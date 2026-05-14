import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaShieldAlt, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    profile_picture: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) return;
        const res = await axios.get('http://localhost:8080/LifelineJavaBackend/api/authentication/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="profile-container" style={{ padding: '20px', maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '30px', color: '#1e1e2f' }}>Account Profile</h2>
      
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyCenter: 'center', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <FaUser size={60} color="#ccc" />
            )}
          </div>
          <button style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaCamera size={18} />
          </button>
        </div>

        <h3 style={{ margin: '0 0 10px', fontSize: '24px' }}>{profile.name || 'User Name'}</h3>
        <p style={{ color: '#666', marginBottom: '30px' }}>{profile.role?.toUpperCase() || 'ROLE'}</p>

        <div style={{ display: 'grid', gap: '20px', textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <FaEnvelope color="#007bff" />
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Email Address</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{profile.email}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '10px' }}>
            <FaShieldAlt color="#007bff" />
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Account Type</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{profile.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
