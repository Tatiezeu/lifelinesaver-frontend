import React, { useState } from 'react';
import './Navbar.css';
const lifelineLogo = '/assets/logo.jpg';
import { Link } from 'react-router-dom';
import { FaUser, FaCog, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  // Smooth scroll function
  const scrollToSection = (id) => {
    const element = document.getElementById(id.toLowerCase()); // IDs are lowercase
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80, // adjust for fixed navbar height
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="topbar-left">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" />
        <h1 className="title">LIFELINE SAVER</h1>
      </div>

      {/* Center: Navigation Tabs */}
      <div className="navbar-center">
        <span className="nav-link" onClick={() => scrollToSection('home')}>Home</span>
        <span className="nav-link" onClick={() => scrollToSection('services')}>Services</span>
        <span className="nav-link" onClick={() => scrollToSection('about')}>About Us</span>
        <span className="nav-link" onClick={() => scrollToSection('contact')}>Contact Us</span>
      </div>

      {/* Right */}
      <div className="navbar-icons">
        {/* User Menu */}
        <div className="navbar-icon-wrapper">
          <FaUser
            size={20}
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setSettingsMenuOpen(false);
            }}
          />
          {userMenuOpen && (
            <div className="dropdown-menu">
              <Link className='label' to="/signin"><FaSignInAlt /> Sign In</Link>
              <Link className='label' to="/Pack"><FaSignOutAlt /> Sign Up</Link>
            </div>
          )}
        </div>

        {/* Settings Menu */}
        <div className="navbar-icon-wrapper">
          <FaCog
            size={20}
            onClick={() => {
              setSettingsMenuOpen(!settingsMenuOpen);
              setUserMenuOpen(false);
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
