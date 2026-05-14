import React, { useEffect } from 'react';
import './Logout.css';

const EmergencyLogout = () => {
  useEffect(() => {
    // Clear any auth tokens or user data
    localStorage.clear();
    sessionStorage.clear();

    // Try to close the window (may not work unless window was opened via JS)
    window.close();

    // Fallback: redirect to login page after 1.5 seconds if window doesn't close
    const timeout = setTimeout(() => {
      window.location.href = '/signin'; // fallback in case window.close() fails
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

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
