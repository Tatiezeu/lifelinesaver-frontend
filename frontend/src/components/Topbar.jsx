import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import './Topbar.css';
import { FaSearch } from 'react-icons/fa';
const lifelineLogo = '/assets/logo.jpg';

const Topbar = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const [adminName, setAdminName] = useState("Admin User");
  const [profilePic, setProfilePic] = useState(lifelineLogo);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access'); // updated key
      if (!token) return;

      const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      // --- Name ---
      const username = data.name || "Admin User";
      setAdminName(username);
      localStorage.setItem("username", username);

      // --- Profile picture ---
      let profile_url = lifelineLogo;
      if (data.profile_picture) {
        profile_url = data.profile_picture.startsWith("http")
          ? data.profile_picture
          : `http://127.0.0.1:8000${data.profile_picture}`;
      }
      setProfilePic(profile_url);
      localStorage.setItem("profile_picture", profile_url);

    } catch (err) {
      console.error("Failed to fetch profile:", err);

      // fallback to localStorage
      const storedName = localStorage.getItem("username");
      const storedPic = localStorage.getItem("profile_picture");
      if (storedName) setAdminName(storedName);
      if (storedPic) setProfilePic(storedPic.startsWith("http") ? storedPic : `http://127.0.0.1:8000${storedPic}`);
    }
  };

  useEffect(() => {
    fetchProfile(); // initial fetch
    const interval = setInterval(fetchProfile, 1000); // refresh every 1s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="title">LIFELINE SAVER</h1>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      <div className="topbar-date">{formattedDate}</div>

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
  );
};

export default Topbar;