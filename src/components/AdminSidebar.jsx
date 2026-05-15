import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import '../emergency/components/Sidebar.css'; // Reuse sidebar styles

const AdminSidebar = () => {
  const lifelineLogo = '/lifelinesaver/assets/logo.jpg';

  return (
    <div className="sidebar admin-sidebar">
      <div className="sidebar-header">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="sidebar-title">Admin Panel</h1>
      </div>
      <nav className="sidebar-menu">
        <NavLink to="/admin" end className="sidebar-link">
          <FaHome className="sidebar-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/admin/users" className="sidebar-link">
          <FaUsers className="sidebar-icon" />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          <span>Settings</span>
        </NavLink>
        <NavLink to="/admin/logout" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          <span>Logout</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
