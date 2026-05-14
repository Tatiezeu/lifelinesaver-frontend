import React, { useState } from 'react';
import { FaExclamationCircle, FaExclamationTriangle, FaInfoCircle,
         FaReply, FaCheck, FaTimes, FaTrash, FaPaperPlane } from 'react-icons/fa';
import './Notifications.css';

const initialNotifs = [
  {
    id: 1, read: false,
    icon: <FaExclamationCircle color="#ef4444" size={18} />,
    borderColor: '#ef4444',
    title: 'Emergency Response Completed',
    desc: 'Your emergency request has been resolved. Service rating requested.',
    time: '2 minutes ago',
  },
  {
    id: 2, read: false,
    icon: <FaExclamationTriangle color="#f59e0b" size={18} />,
    borderColor: '#f59e0b',
    title: 'Vehicle Maintenance Due',
    desc: 'Oil change recommended within 500 miles. Schedule your appointment.',
    time: '1 hour ago',
  },
  {
    id: 3, read: true,
    icon: <FaExclamationTriangle color="#f59e0b" size={18} />,
    borderColor: '#f59e0b',
    title: 'Tire Pressure Alert',
    desc: 'Front left tire pressure is low. Please check and refill.',
    time: '3 hours ago',
  },
  {
    id: 4, read: true,
    icon: <FaInfoCircle color="#3b82f6" size={18} />,
    borderColor: '#3b82f6',
    title: 'System Update Available',
    desc: 'A new update is available for your Lifeline Saver app.',
    time: '5 hours ago',
  },
];

const ClientNotifications = () => {
  const [notifs, setNotifs] = useState(initialNotifs);

  const toggleRead = (id) => {
    setNotifs(n => n.map(item => item.id === id ? { ...item, read: !item.read } : item));
  };

  const clear = (id) => setNotifs(n => n.filter(item => item.id !== id));
  const clearAll = () => setNotifs([]);

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div className="cn-page">
      <div className="cn-header">
        <div>
          <h1 className="cn-title">Notifications</h1>
          <p className="cn-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="cn-header-btns">
          <button className="cn-btn cn-send"><FaPaperPlane /> Send New</button>
          <button className="cn-btn cn-clear-all" onClick={clearAll}><FaTrash /> Clear All</button>
        </div>
      </div>

      <div className="cn-list">
        {notifs.length === 0 && (
          <div className="cn-empty">No notifications</div>
        )}
        {notifs.map(n => (
          <div key={n.id} className={`cn-card ${!n.read ? 'cn-unread' : ''}`} style={{ borderLeftColor: n.borderColor }}>
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
              <button className="cn-action-btn"><FaReply size={11} /> Reply</button>
              <button className="cn-action-btn" onClick={() => toggleRead(n.id)}>
                {n.read ? <><FaTimes size={11} /> Mark Unread</> : <><FaCheck size={11} /> Mark Read</>}
              </button>
              <button className="cn-action-btn cn-action-clear" onClick={() => clear(n.id)}>
                <FaTrash size={11} /> Clear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientNotifications;
