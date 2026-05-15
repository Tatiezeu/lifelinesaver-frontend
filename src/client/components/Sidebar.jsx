import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaThLarge,
  FaMap,
  FaExclamationCircle,
  FaBell,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import './Sidebar.css';

const ClientSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="client-sidebar">
      <div className="client-sidebar-header">
        <h1 className="client-sidebar-brand">Car Emergency</h1>
      </div>

      <nav className="client-sidebar-nav">
        <NavLink to="/client" end className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaThLarge className="client-nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/client/maps" className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaMap className="client-nav-icon" />
          <span>Maps</span>
        </NavLink>
        <NavLink to="/client/emergency" className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaExclamationCircle className="client-nav-icon" />
          <span>Emergency</span>
        </NavLink>
        <NavLink to="/client/notifications" className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaBell className="client-nav-icon" />
          <span>Notifications</span>
        </NavLink>
        <NavLink to="/client/profile" className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaUser className="client-nav-icon" />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="client-sidebar-footer">
        <NavLink to="/client/logout" className={({ isActive }) => `client-nav-link${isActive ? ' active' : ''}`}>
          <FaSignOutAlt className="client-nav-icon" />
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
};

export default ClientSidebar;
