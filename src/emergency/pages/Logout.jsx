import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

const EmergencyLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any auth tokens or user data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page immediately using navigate
    navigate('/signin');
  }, [navigate]);

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>You have been logged out</h2>
        <p>If the window doesn’t close, you’ll be redirected to login...</p>
      </div>
    </div>
  );
};

export default EmergencyLogout;
