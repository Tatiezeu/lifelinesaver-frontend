import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  FaMapMarkedAlt,
  FaHistory,
  FaCog,
  FaHome,
  FaSignOutAlt
} from 'react-icons/fa';

const lifelineLogo = '/lifelinesaver/assets/logo.jpg';

const EmergencySidebar = () => {
  const API_URL = 'http://localhost:8080/LifelineJavaBackend/api/alerts';

  const createAlert = async () => {
    console.log('--- START createAlert ---');
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.log('No access token found.');
        return;
      }

      const now = new Date();
      const nowStr = now.toLocaleDateString();
      const timestamp = now.getTime();
      
      const userEmailStored = localStorage.getItem('userEmail');
      let userEmail = userEmailStored;
      
      if (!userEmail) {
        // Fallback: extract from dummy token "dummy-access-token-email@example.com"
        if (token.startsWith('dummy-access-token-')) {
          userEmail = token.replace('dummy-access-token-', '');
        } else {
          userEmail = 'tatiezeub@gmail.com';
        }
      }
      
      // Use a specific location in Yaounde
      const lat = 3.8480;
      const lng = 11.5021;
      
      const alertData = {
        message: `tekeng yvan date ${nowStr} timestamp ${timestamp}`,
        longitude: lng,
        latitude: lat,
        address: "Mvan, Yaounde",
        status: 'pending',
        user: { email: userEmail }
      };

      console.log('Sending alert data:', JSON.stringify(alertData, null, 2));
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
      const response = await axios.post(API_URL, alertData, config);
      console.log('Alert response:', response.data);
      
      // Dispatch custom event for Topbar, Map, and History to listen
      window.dispatchEvent(new CustomEvent('newAlert', { detail: response.data }));
      console.log("🚨 Emergency Alert Created: tekeng yvan");

    } catch (error) {
      console.error('Error creating alert:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
    }
  };

  return (
    <div className="sidebar emergency-sidebar">
      {/* App Logo and Name */}
      <div className="sidebar-header" onClick={createAlert} style={{cursor: 'pointer'}}>
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="sidebar-title">Lifeline Saver</h1>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu">
        <NavLink to="/emergency/" end className="sidebar-link">
          <FaHome className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/emergency/livemap" className="sidebar-link">
          <FaMapMarkedAlt className="sidebar-icon" />
          <span>Live Map</span>
        </NavLink>

        <NavLink to="/emergency/history" className="sidebar-link">
          <FaHistory className="sidebar-icon" />
          <span>SOS History</span>
        </NavLink>

        <NavLink to="/emergency/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/emergency/logout" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default EmergencySidebar;