import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import './Settings.css';
import lifelineLogo from '../assets/logo.jpg';

const Settings = () => {
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
        const res = await axios.get('http://localhost:8080/LifelineJavaBackend/api/authentication/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setName(res.data.name);
        setEmail(res.data.email);

        if (res.data.profile_picture) {
          const baseUrl = "http://localhost:8080/LifelineJavaBackend";
          // If the database returns the full URL or a relative path, handle it
          const profilePicUrl = (res.data.profile_picture.startsWith('http') || res.data.profile_picture.startsWith('data:'))
            ? res.data.profile_picture
            : `${baseUrl}${res.data.profile_picture.startsWith('/') ? '' : '/'}${res.data.profile_picture}`;
          setPreviewPic(profilePicUrl);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPic(reader.result); // This is now a base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('access');
    if (!token) return alert('You must be logged in');

    try {
      const res = await axios.put(
        `http://localhost:8080/LifelineJavaBackend/api/users/${email}`,
        { 
          name, 
          email,
          profile_picture: previewPic 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      localStorage.setItem('username', res.data.name);
      if (res.data.profile_picture) {
        localStorage.setItem('profile_picture', res.data.profile_picture);
      }
      
      window.dispatchEvent(new CustomEvent('profileUpdate'));
      setMessage('Profile updated successfully! You will be logged out to apply changes...');

      // Clear session and redirect to signin
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/lifelinesaver/signin';
      }, 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="settings-container full-width">
      <form className="profile-form full-width" onSubmit={handleProfileUpdate}>
        <h3>Update Profile</h3>

        <div className="profile-pic-section">
          <div className="profile-pic-preview">
            <img src={previewPic || lifelineLogo} alt="Preview" />
          </div>
          <input type="file" onChange={handleProfilePicChange} accept="image/*" id="profile-upload" hidden />
          <label htmlFor="profile-upload" className="upload-btn-label">Change Picture</label>
        </div>

        <div className="form-group-settings">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group-settings">
          <label>Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="readonly-input"
          />
        </div>

        <button type="submit" className="update-btn">
          Update Profile
        </button>

        {message && (
          <p className={`update-message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Settings;
