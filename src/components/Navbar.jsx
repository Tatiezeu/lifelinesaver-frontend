import React, { useState } from 'react';
import './Navbar.css';
import lifelineLogo from '../assets/logo.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCog, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Smooth scroll function
  const scrollToSection = (id) => {
    if (id.toLowerCase() === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      return;
    }
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavClick = (path, sectionId) => {
    if (location.pathname === '/' || location.pathname === '/home') {
      scrollToSection(sectionId);
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar">
      {/* Left */}
      <div className="topbar-left">
        <img src={lifelineLogo} alt="Lifeline Logo" className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
        <h1 className="title" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>LIFELINE SAVER</h1>
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
              <Link className='label' to="/signup"><FaSignInAlt /> Sign Up</Link>
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
