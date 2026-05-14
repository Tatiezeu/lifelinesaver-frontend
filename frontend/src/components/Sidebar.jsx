import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
const lifelineLogo = '/assets/logo.jpg';

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* App Logo and Name */}
      <div className="sidebar-header">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="sidebar-title">Lifeline Admin</h1>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="sidebar-link">
          <FaHome className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/users" className="sidebar-link">
          <FaUsers className="sidebar-icon" />
          <span>Users</span>
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </NavLink>

        <NavLink to="/logout" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
