import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './Settings.css';

const EmergencySettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState('');
  const [message, setMessage] = useState('');

  // Load current user info on component mount
useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem('access');
    if (!token) return;

    try {
      const res = await axios.get('http://127.0.0.1:8000/api/profiles/', {
        headers: {
          Authorization: `Bearer ${token}`, // FIXED
        },
      });

      setName(res.data.name);
      setEmail(res.data.email);

      if (res.data.profile_picture) {
        const baseUrl = "http://127.0.0.1:8000"; // FIX if API returns relative URL
        const profilePicUrl = res.data.profile_picture.startsWith('http')
          ? res.data.profile_picture
          : `${baseUrl}${res.data.profile_picture}`;
        setPreviewPic(profilePicUrl);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  fetchProfile();
}, []);
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = !isDarkMode ? 'dark' : '';
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('access');
    if (!token) return alert('You must be logged in');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profilePic) formData.append('profile_picture', profilePic);

    try {
      const res = await axios.put(
        'http://127.0.0.1:8000/api/profiles/update/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update localStorage so Topbar can reflect changes
      localStorage.setItem('username', res.data.name);
      localStorage.setItem('profile_picture', res.data.profile_picture || '');

      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="settings-container full-width">
      <h2 className="settings-title">Settings</h2>

      {/* Dark mode toggle */}
      <div className="theme-toggle">
        <div
          className={`toggle-slider ${isDarkMode ? 'active' : ''}`}
          onClick={handleThemeToggle}
        >
          <div className="toggle-thumb"></div>
        </div>
        <span className="toggle-label">
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </span>
      </div>

      {/* Profile Update Form */}
      <form className="profile-form full-width" onSubmit={handleProfileUpdate}>
        <h3>Update Profile</h3>

        {/* Profile Picture Preview */}
        {previewPic && (
          <div className="profile-pic-preview">
            <img src={previewPic} alt="Preview" />
          </div>
        )}

        <label>Full Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Change Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicChange}
        />

        <button type="submit" className="update-btn">
          Update Profile
        </button>

        {message && <p className="update-message">{message}</p>}
      </form>
    </div>
  );
};

export default EmergencySettings;
