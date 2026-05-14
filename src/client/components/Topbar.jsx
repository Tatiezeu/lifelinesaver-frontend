import React, { useState, useEffect } from 'react';
import { FaBell, FaMoon, FaSun, FaUserCircle } from 'react-icons/fa';
import './Topbar.css';

const ClientTopbar = () => {
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const username = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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
        <button className="client-topbar-icon-btn">
          <FaBell size={16} />
        </button>
        <div className="client-topbar-profile">
          <FaUserCircle size={28} color="#4f7ef8" />
          <span className="client-topbar-username">{username}</span>
        </div>
      </div>
    </div>
  );
};

export default ClientTopbar;
