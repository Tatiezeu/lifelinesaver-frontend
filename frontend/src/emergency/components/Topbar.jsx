import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getAlertsEndpoint } from '../../config';
import './Topbar.css';
import { FaBell } from 'react-icons/fa';

const lifelineLogo = '/assets/logo.jpg';
const defaultProfilePic = '/assets/logo.jpg';

const EmergencyTopbar = () => {
  const [time, setTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("Responder");
  const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePic);
  const dropdownRef = useRef(null);

  // --- Clock update ---
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Close dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Fetch responder profile ---
  const fetchResponderProfile = async () => {
    try {
      const token = localStorage.getItem("access"); 
      if (!token) return;

      const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const name = data.name || "Responder";
      const profilePic = data.profile_picture
        ? data.profile_picture.startsWith("http")
          ? data.profile_picture
          : `http://127.0.0.1:8000${data.profile_picture}`
        : defaultProfilePic;

      setUsername(name);
      setProfilePicUrl(profilePic);

      localStorage.setItem("username", name);
      localStorage.setItem("profile_picture", profilePic);

    } catch (err) {
      console.error("Failed to fetch responder profile:", err);
      const storedName = localStorage.getItem("username");
      const storedPic = localStorage.getItem("profile_picture");
      if (storedName) setUsername(storedName);
      if (storedPic) setProfilePicUrl(storedPic.startsWith("http") ? storedPic : `http://127.0.0.1:8000${storedPic}`);
    }
  };

  useEffect(() => {
    fetchResponderProfile();
    const interval = setInterval(fetchResponderProfile, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Fetch SOS alerts ---
  const fetchAlerts = async () => {
    try {
      const url = getAlertsEndpoint();
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = Array.isArray(res.data) ? res.data : res.data.results || [];
      const mapped = items.map(a => ({
        id: a.id,
        title: a.alert_type ? `${a.alert_type} Alert - ${a.address || ''}`.trim() : `SOS Alert - ${a.address || ''}`.trim(),
        time: new Date(a.created_at).toLocaleString(),
        address: a.address || '',
        status: a.status || 'Pending',
        read: false,
      }));

      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- Listen for new alerts from Sidebar ---
  useEffect(() => {
    const handleNewAlert = (event) => {
      const newAlert = event.detail;
      const formattedAlert = {
        id: newAlert.id,
        title: newAlert.alert_type ? `${newAlert.alert_type} Alert - ${newAlert.address || ''}`.trim() : `SOS Alert - ${newAlert.address || ''}`.trim(),
        time: new Date(newAlert.created_at).toLocaleString(),
        address: newAlert.address || '',
        status: newAlert.status || 'Pending',
        read: false,
      };
      setNotifications(prev => [formattedAlert, ...prev]);
    };

    window.addEventListener('newAlert', handleNewAlert);
    return () => window.removeEventListener('newAlert', handleNewAlert);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="title">LIFELINE SAVER</h1>
      </div>

      <div className="topbar-center">
        <span className="time">{formatTime(time)}</span>
      </div>

      <div className="topbar-right">
        <div className="notification" ref={dropdownRef}>
          <FaBell className="bell-icon" onClick={toggleDropdown} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}

          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
                <button className="mark-all-btn" onClick={clearNotifications}>
                  Clear All
                </button>
              </div>
              <div className="dropdown-content">
                {notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                  >
                    <h4>{notification.title}</h4>
                    <p><strong>Time:</strong> {notification.time}</p>
                    <p><strong>Address:</strong> {notification.address}</p>
                    <p><strong>Status:</strong> <span className={`status ${notification.status.toLowerCase()}`}>{notification.status}</span></p>
                    <button 
                      className="toggle-read-btn"
                      onClick={() => toggleReadStatus(notification.id)}
                    >
                      {notification.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile">
          <img 
            src={profilePicUrl || defaultProfilePic} 
            alt="Responder" 
            className="profile-pic"
            onError={(e) => e.target.src = defaultProfilePic}
          />
          <span className="responder-name">{username || "Responder"}</span>
        </div>
      </div>
    </div>
  );
};

export default EmergencyTopbar;