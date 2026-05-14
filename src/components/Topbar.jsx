import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import './Topbar.css';
import { FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import lifelineLogo from '../assets/logo.jpg';

const Topbar = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const [adminName, setAdminName] = useState("Admin User");
  const [profilePic, setProfilePic] = useState(lifelineLogo);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [searchQuery, setSearchQuery] = useState("");

  // --- Theme Toggle logic ---
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const res = await axios.get('http://localhost:8080/LifelineJavaBackend/api/authentication/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const username = data.name || "Admin User";
      setAdminName(username);
      localStorage.setItem("username", username);

      let profile_url = lifelineLogo;
      if (data.profile_picture) {
        if (data.profile_picture.startsWith("http") || data.profile_picture.startsWith("data:")) {
          profile_url = data.profile_picture;
        } else {
          profile_url = `http://localhost:8080/LifelineJavaBackend${data.profile_picture.startsWith('/') ? '' : '/'}${data.profile_picture}`;
        }
      }
      setProfilePic(profile_url);
      localStorage.setItem("profile_picture", profile_url);

    } catch (err) {
      console.error("Failed to fetch profile:", err);
      const storedName = localStorage.getItem("username");
      const storedPic = localStorage.getItem("profile_picture");
      if (storedName) setAdminName(storedName);
      if (storedPic) setProfilePic(storedPic.startsWith("http") ? storedPic : `http://localhost:8080/LifelineJavaBackend${storedPic}`);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Listen for manual profile updates for immediate sync
    const handleProfileUpdate = () => {
      fetchProfile();
    };
    window.addEventListener('profileUpdate', handleProfileUpdate);

    const interval = setInterval(fetchProfile, 10000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Dispatch a search event so that pages (like Users) can listen and filter
    window.dispatchEvent(new CustomEvent('userSearch', { detail: query }));
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="title">LIFELINE SAVER</h1>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input 
          type="text" 
          placeholder="Search users..." 
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="topbar-date">{formattedDate}</div>

      <div className="topbar-right">
        <div className="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? <FaSun style={{ color: '#f1c40f' }} /> : <FaMoon style={{ color: '#2c3e50' }} />}
        </div>

        <div className="admin-profile">
          <img 
            src={profilePic || lifelineLogo} 
            alt="Admin Profile" 
            className="profile-pic" 
            onError={(e) => e.target.src = lifelineLogo}
          />
          <span className="admin-name">{adminName}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;