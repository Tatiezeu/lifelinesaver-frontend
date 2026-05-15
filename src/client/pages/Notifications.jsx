import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaExclamationCircle, FaInfoCircle, FaCheck, FaTimes,
  FaTrash, FaSync, FaBell,
} from 'react-icons/fa';
import { getBackendBaseUrl } from '../../config';
import ConfirmationModal from '../../components/ConfirmationModal';
import './Notifications.css';

/**
 * Maps an EmergencyAlert from the backend into a notification display object.
 */
const mapAlert = (a) => {
  const d = a.created_at || a.createdAt;
  const status = (a.status || 'pending').toLowerCase();
  let borderColor = '#ef4444';
  let icon = <FaExclamationCircle color="#ef4444" size={18} />;

  if (status === 'resolved') {
    borderColor = '#22c55e';
    icon = <FaCheck color="#22c55e" size={18} />;
  } else if (status === 'cancelled') {
    borderColor = '#94a3b8';
    icon = <FaTimes color="#94a3b8" size={18} />;
  } else if (status === 'active') {
    borderColor = '#f59e0b';
    icon = <FaExclamationCircle color="#f59e0b" size={18} />;
  }

  return {
    id: a.id,
    read: false,
    icon,
    borderColor,
    title: `SOS Alert – ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    desc: a.message || a.address || 'Emergency request submitted.',
    time: d ? new Date(d).toLocaleString() : 'Just now',
    status,
  };
};

const ClientNotifications = () => {
  const [notifs, setNotifs]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const fetchMyAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      if (!token) { setError('Not authenticated.'); setLoading(false); return; }

      const res = await axios.get(`${getBackendBaseUrl()}/api/client/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = Array.isArray(res.data) ? res.data : res.data.results || [];
      setNotifs(items.map(mapAlert));
    } catch (err) {
      setError('Could not load notifications.');
      console.error('Notifications fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAlerts();
    const iv = setInterval(fetchMyAlerts, 15000);
    return () => clearInterval(iv);
  }, []);

  // When a new SOS is sent from Emergency page, prepend it immediately
  useEffect(() => {
    const handler = (e) => {
      setNotifs(prev => [mapAlert(e.detail), ...prev]);
    };
    window.addEventListener('newAlert', handler);
    return () => window.removeEventListener('newAlert', handler);
  }, []);

  const toggleRead = (id) =>
    setNotifs(n => n.map(item => item.id === id ? { ...item, read: !item.read } : item));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', id: null });

  const clear = async (id) => {
    setModalConfig({ type: 'single', id });
    setIsModalOpen(true);
  };

  const clearAll = async () => {
    setModalConfig({ type: 'all', id: null });
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    setIsModalOpen(false);
    const token = localStorage.getItem('access');
    
    if (modalConfig.type === 'single') {
      try {
        await axios.delete(`${getBackendBaseUrl()}/api/alerts/${modalConfig.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs(n => n.filter(item => item.id !== modalConfig.id));
      } catch (err) {
        console.error('Error deleting notification:', err);
      }
    } else {
      try {
        await axios.delete(`${getBackendBaseUrl()}/api/alerts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifs([]);
      } catch (err) {
        console.error('Error clearing notifications:', err);
      }
    }
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="cn-page">
      <div className="cn-header">
        <div>
          <h1 className="cn-title">Notifications</h1>
          <p className="cn-subtitle">
            {loading ? 'Refreshing…' : `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="cn-header-btns">
          <button className="cn-btn cn-send" onClick={fetchMyAlerts} title="Refresh">
            <FaSync /> Refresh
          </button>
          <button className="cn-btn cn-clear-all" onClick={clearAll}>
            <FaTrash /> Clear All
          </button>
        </div>
      </div>

      {error && <p className="cn-error">{error}</p>}

      <div className="cn-list">
        {!loading && notifs.length === 0 && (
          <div className="cn-empty">
            <FaBell size={36} color="#cbd5e1" />
            <p>No notifications yet. Your SOS alerts will appear here.</p>
          </div>
        )}
        {notifs.map(n => (
          <div
            key={n.id}
            className={`cn-card ${!n.read ? 'cn-unread' : ''}`}
            style={{ borderLeftColor: n.borderColor }}
          >
            <div className="cn-card-top">
              <div className="cn-card-left">
                {n.icon}
                <div>
                  <div className="cn-card-title">{n.title}</div>
                  <div className="cn-card-desc">{n.desc}</div>
                  <div className="cn-card-time">{n.time}</div>
                </div>
              </div>
              {!n.read && <div className="cn-dot" />}
            </div>
            <div className="cn-card-actions">
              <button className="cn-action-btn" onClick={() => toggleRead(n.id)}>
                {n.read
                  ? <><FaTimes size={11} /> Mark Unread</>
                  : <><FaCheck size={11} /> Mark Read</>
                }
              </button>
              <button 
                className="cn-action-btn cn-action-clear" 
                onClick={(e) => { e.preventDefault(); clear(n.id); }}
              >
                <FaTrash size={11} /> Clear
              </button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={modalConfig.type === 'all' ? 'Clear All Notifications' : 'Clear Notification'}
        message={modalConfig.type === 'all' 
          ? 'Are you sure you want to clear ALL your notifications? This will permanently delete them from the database.'
          : 'Are you sure you want to clear this notification? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default ClientNotifications;
