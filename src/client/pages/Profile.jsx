import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FaUser, FaEnvelope, FaPhone, FaFileAlt,
  FaCar, FaSave, FaTimes, FaCamera, FaSpinner,
} from 'react-icons/fa';
import { getBackendBaseUrl } from '../../config';
import './Profile.css';

const ClientProfile = () => {
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [editing, setEditing]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const fileInputRef = useRef(null);

  const emptyForm = {
    name: '', email: '', profile_picture: '',
    phone: '', insurance: '',
    vehicleMake: '', vehicleModel: '', vehicleYear: '', licensePlate: '',
  };

  const [form, setForm]   = useState(emptyForm);
  const [draft, setDraft] = useState(emptyForm);

  // ── Load profile on mount ────────────────────────────────────────
  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      if (!token) { setError('Not authenticated.'); setLoading(false); return; }

      const res = await axios.get(`${getBackendBaseUrl()}/api/client/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = res.data;
      const loaded = {
        name:         d.name            || '',
        email:        d.email           || '',
        profile_picture: d.profile_picture || '',
        phone:        d.phone           || '',
        insurance:    d.insurance       || '',
        vehicleMake:  d.vehicleMake     || '',
        vehicleModel: d.vehicleModel    || '',
        vehicleYear:  d.vehicleYear     || '',
        licensePlate: d.licensePlate    || '',
      };
      setForm(loaded);
      setDraft(loaded);
      
      // Sync localStorage and sidebar
      if (loaded.name) localStorage.setItem('username', loaded.name);
      if (loaded.profile_picture) {
        const pic = (loaded.profile_picture.startsWith('http') || loaded.profile_picture.startsWith('data:'))
          ? loaded.profile_picture
          : `${getBackendBaseUrl()}${loaded.profile_picture.startsWith('/') ? '' : '/'}${loaded.profile_picture}`;
        localStorage.setItem('profile_picture', pic);
      }
      window.dispatchEvent(new CustomEvent('clientProfileUpdated'));

    } catch (err) {
      setError('Failed to load profile.');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── Save ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('access');
      const res = await axios.put(
        `${getBackendBaseUrl()}/api/client/profile`,
        draft,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const d = res.data;
      const saved = {
        name:         d.name            || draft.name,
        email:        d.email           || draft.email,
        profile_picture: d.profile_picture || draft.profile_picture,
        phone:        d.phone           || draft.phone,
        insurance:    d.insurance       || draft.insurance,
        vehicleMake:  d.vehicleMake     || draft.vehicleMake,
        vehicleModel: d.vehicleModel    || draft.vehicleModel,
        vehicleYear:  d.vehicleYear     || draft.vehicleYear,
        licensePlate: d.licensePlate    || draft.licensePlate,
      };
      
      setForm(saved);
      setDraft(saved);
      setEditing(false);
      setSuccess('Profile saved successfully!');

      // Update localStorage for sidebar
      localStorage.setItem('username', saved.name);
      if (saved.profile_picture) {
        const pic = (saved.profile_picture.startsWith('http') || saved.profile_picture.startsWith('data:'))
          ? saved.profile_picture
          : `${getBackendBaseUrl()}${saved.profile_picture.startsWith('/') ? '' : '/'}${saved.profile_picture}`;
        localStorage.setItem('profile_picture', pic);
      }

      // Notify sidebar to refresh
      window.dispatchEvent(new CustomEvent('clientProfileUpdated'));

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
      console.error('Profile save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setDraft({ ...form }); setEditing(false); setError(''); };

  // ── Avatar preview (base64) ──────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraft(prev => ({ ...prev, profile_picture: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  // ── Derived ──────────────────────────────────────────────────────
  const initials = form.name
    ? form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  const avatarSrc = (editing ? draft.profile_picture : form.profile_picture) || null;

  if (loading) {
    return (
      <div className="cp-page cp-loading-state">
        <FaSpinner className="cp-spin" size={32} color="#4f7ef8" />
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <div className="cp-page-header">
        <div>
          <h1 className="cp-title">Profile</h1>
          <p className="cp-subtitle">Manage your account and vehicle information</p>
        </div>
        {!editing
          ? <button className="cp-edit-btn" onClick={() => { setEditing(true); setError(''); setSuccess(''); }}>
              Edit Profile
            </button>
          : <div style={{ display: 'flex', gap: 10 }}>
              <button className="cp-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <FaSpinner className="cp-spin" /> : <FaSave />}
                {saving ? ' Saving…' : ' Save'}
              </button>
              <button className="cp-cancel-btn" onClick={handleCancel} disabled={saving}>
                <FaTimes /> Cancel
              </button>
            </div>
        }
      </div>

      {error   && <p className="cp-msg cp-error">{error}</p>}
      {success && <p className="cp-msg cp-success">{success}</p>}

      <div className="cp-card">
        {/* Avatar */}
        <div className="cp-avatar-section">
          <div className="cp-avatar-wrap">
            {avatarSrc
              ? <img src={avatarSrc} alt={form.name} className="cp-avatar-img" onError={e => e.target.style.display='none'} />
              : <div className="cp-avatar">{initials}</div>
            }
            {editing && (
              <>
                <button className="cp-avatar-cam" onClick={() => fileInputRef.current.click()}>
                  <FaCamera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
              </>
            )}
          </div>
          <h2 className="cp-name">{form.name || '—'}</h2>
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
                <input
                  disabled={!editing}
                  value={editing ? draft.name : form.name}
                  onChange={e => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Email</label>
              <div className="cp-input-wrap">
                <FaEnvelope className="cp-input-icon" />
                <input disabled value={form.email} placeholder="Email address" />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Phone</label>
              <div className="cp-input-wrap">
                <FaPhone className="cp-input-icon" />
                <input
                  disabled={!editing}
                  value={editing ? draft.phone : form.phone}
                  onChange={e => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Insurance Policy Number</label>
              <div className="cp-input-wrap">
                <FaFileAlt className="cp-input-icon" />
                <input
                  disabled={!editing}
                  value={editing ? draft.insurance : form.insurance}
                  onChange={e => setDraft({ ...draft, insurance: e.target.value })}
                  placeholder="POL-XXXX-XXXXXXXX"
                />
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
                <input
                  disabled={!editing}
                  value={editing ? draft.vehicleMake : form.vehicleMake}
                  onChange={e => setDraft({ ...draft, vehicleMake: e.target.value })}
                  placeholder="e.g. Toyota"
                />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Model</label>
              <div className="cp-input-wrap">
                <FaCar className="cp-input-icon" />
                <input
                  disabled={!editing}
                  value={editing ? draft.vehicleModel : form.vehicleModel}
                  onChange={e => setDraft({ ...draft, vehicleModel: e.target.value })}
                  placeholder="e.g. Camry"
                />
              </div>
            </div>
            <div className="cp-field-group">
              <label>Year</label>
              <div className="cp-input-wrap">
                <FaCar className="cp-input-icon" />
                <input
                  disabled={!editing}
                  value={editing ? draft.vehicleYear : form.vehicleYear}
                  onChange={e => setDraft({ ...draft, vehicleYear: e.target.value })}
                  placeholder="e.g. 2023"
                />
              </div>
            </div>
            <div className="cp-field-group">
              <label>License Plate</label>
              <div className="cp-input-wrap">
                <FaFileAlt className="cp-input-icon" />
                <input
                  disabled={!editing}
                  value={editing ? draft.licensePlate : form.licensePlate}
                  onChange={e => setDraft({ ...draft, licensePlate: e.target.value })}
                  placeholder="e.g. ABC-1234"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save button at bottom (convenient) */}
        {editing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <button className="cp-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? <FaSpinner className="cp-spin" /> : <FaSave />}
              {saving ? ' Saving…' : ' Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
