import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaBell, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import { getBackendBaseUrl } from '../../config';
import './Topbar.css';

const defaultPic = null; // falls back to FaUserCircle icon

const ClientTopbar = () => {
  const [time, setTime]               = useState(new Date());
  const [darkMode, setDarkMode]       = useState(localStorage.getItem('theme') === 'dark');
  const [username, setUsername]       = useState(localStorage.getItem('username') || 'Client');
  const [profilePicUrl, setProfilePicUrl] = useState(localStorage.getItem('profile_picture') || null);

  // ── Clock ──────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ── Dark-mode ──────────────────────────────────────────────────────
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // ── Fetch real profile from backend ───────────────────────────────
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const res = await axios.get(
        `${getBackendBaseUrl()}/api/client/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;
      const name = data.name || 'Client';
      const pic  = data.profile_picture
        ? (data.profile_picture.startsWith('http')
            ? data.profile_picture
            : `${getBackendBaseUrl()}${data.profile_picture}`)
        : null;

      setUsername(name);
      setProfilePicUrl(pic);
      localStorage.setItem('username', name);
      if (pic) localStorage.setItem('profile_picture', pic);

    } catch (err) {
      // fall back to stored values
      const storedName = localStorage.getItem('username');
      const storedPic  = localStorage.getItem('profile_picture');
      if (storedName) setUsername(storedName);
      if (storedPic)  setProfilePicUrl(storedPic);
    }
  };

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(fetchProfile, 30000); // refresh every 30 s
    return () => clearInterval(interval);
  }, []);

  // Re-fetch when profile page fires a custom event after save
  useEffect(() => {
    const handler = () => fetchProfile();
    window.addEventListener('clientProfileUpdated', handler);
    return () => window.removeEventListener('clientProfileUpdated', handler);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <div className="client-topbar">
      <div className="client-topbar-left">
        <span className="client-topbar-date">{formattedDate}</span>
      </div>
      <div className="client-topbar-center">
        <span className="client-topbar-time">{formattedTime}</span>
      </div>
      <div className="client-topbar-right">
        <button className="client-topbar-icon-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
        </button>

        <div className="client-topbar-profile">
          {profilePicUrl ? (
            <img
              src={profilePicUrl}
              alt={username}
              className="client-topbar-avatar"
              onError={e => { e.target.style.display = 'none'; }}
            />
          ) : (
            <FaUserCircle size={30} color="#4f7ef8" />
          )}
          <span className="client-topbar-username">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientTopbar;
