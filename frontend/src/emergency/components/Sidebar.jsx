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

const lifelineLogo = '/assets/logo.jpg';

const EmergencySidebar = () => {
  const API_URL = 'http://localhost:8000/api/alerts/';

  const createAlert = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.log('No access token found.');
        return;
      }

      const alertData = {
        emergency_in_charge: 10,
        message: 'Laurie incident detected',
        longitude: 11.5072,
        latitude: 3.8785,
        address: "Bastos, Yaoundé, Centre Region",
        status: 'acknowledged',
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.post(API_URL, alertData, config);
      console.log('Alert created successfully:', response.data);

      // Dispatch custom event for History.jsx to listen
      const event = new CustomEvent('newAlert', { detail: response.data });
      window.dispatchEvent(event);

    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  return (
    <div className="sidebar">
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