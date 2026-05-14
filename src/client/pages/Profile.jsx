import React, { useState } from 'react';
import {
  FaUser, FaEnvelope, FaPhone, FaFileAlt,
  FaCar, FaEdit, FaSave, FaTimes,
} from 'react-icons/fa';
import './Profile.css';

const ClientProfile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: 'John Anderson',
    email: 'john.anderson@example.com',
    phone: '+1 (555) 123-4567',
    insurance: 'POL-2024-789456',
    make: 'Tesla',
    model: 'Model 3',
    year: '2023',
    plate: 'ABC-1234',
  });
  const [draft, setDraft] = useState({ ...form });

  const handleSave = () => { setForm({ ...draft }); setEditing(false); };
  const handleCancel = () => { setDraft({ ...form }); setEditing(false); };
  const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="cp-page">
      <div className="cp-page-header">
        <div>
          <h1 className="cp-title">Profile</h1>
          <p className="cp-subtitle">Manage your account and vehicle information</p>
        </div>
        {!editing
          ? <button className="cp-edit-btn" onClick={() => setEditing(true)}><FaEdit /> Edit Profile</button>
          : <div style={{ display: 'flex', gap: 10 }}>
              <button className="cp-save-btn" onClick={handleSave}><FaSave /> Save</button>
              <button className="cp-cancel-btn" onClick={handleCancel}><FaTimes /> Cancel</button>
            </div>
        }
      </div>

      <div className="cp-card">
        {/* Avatar */}
        <div className="cp-avatar-section">
          <div className="cp-avatar">{initials}</div>
          <h2 className="cp-name">{form.name}</h2>
          <p className="cp-email-sub">{form.email}</p>
        </div>

        {/* Personal Info */}
        <div className="cp-section">
          <div className="cp-section-title"><FaUser size={14} /> Personal Information</div>
          <div className="cp-fields-grid">
            <div className="cp-field-group">
              <label>Full Name</label>
              <div className="cp-input-wrap">
                <FaUser className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.name : form.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Email</label>
              <div className="cp-input-wrap">
                <FaEnvelope className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.email : form.email}
                  onChange={e => setDraft({ ...draft, email: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Phone</label>
              <div className="cp-input-wrap">
                <FaPhone className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.phone : form.phone}
                  onChange={e => setDraft({ ...draft, phone: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Insurance Policy Number</label>
              <div className="cp-input-wrap">
                <FaFileAlt className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.insurance : form.insurance}
                  onChange={e => setDraft({ ...draft, insurance: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="cp-section">
          <div className="cp-section-title"><FaCar size={14} /> Vehicle Information</div>
          <div className="cp-fields-grid">
            <div className="cp-field-group">
              <label>Make</label>
              <div className="cp-input-wrap">
                <FaCar className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.make : form.make}
                  onChange={e => setDraft({ ...draft, make: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Model</label>
              <div className="cp-input-wrap">
                <FaCar className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.model : form.model}
                  onChange={e => setDraft({ ...draft, model: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Year</label>
              <div className="cp-input-wrap">
                <FaCar className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.year : form.year}
                  onChange={e => setDraft({ ...draft, year: e.target.value })} />
              </div>
            </div>
            <div className="cp-field-group">
              <label>License Plate</label>
              <div className="cp-input-wrap">
                <FaFileAlt className="cp-input-icon" />
                <input disabled={!editing} value={editing ? draft.plate : form.plate}
                  onChange={e => setDraft({ ...draft, plate: e.target.value })} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
