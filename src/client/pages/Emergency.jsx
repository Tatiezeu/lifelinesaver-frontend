import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaClock, FaExclamationCircle, FaCheckCircle, FaShareAlt, FaPhone, FaSpinner } from 'react-icons/fa';
import { getBackendBaseUrl } from '../../config';
import './Emergency.css';

const safetyChecklist = [
  'Turn on hazard lights',
  'Stay inside the vehicle (unless unsafe)',
  'Move to the hard shoulder if possible',
  'Lock doors and wait for official responders',
];

const ClientEmergency = () => {
  const [sosSent, setSosSent]         = useState(false);
  const [holding, setHolding]         = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);   // 0-100 %
  const [checked, setChecked]         = useState([false, false, false, false]);
  const [activeAlertId, setActiveAlertId] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  // live stats from backend
  const [stats, setStats] = useState({ avg: '–', active: '–', resolved: '–' });

  const holdTimerRef   = useRef(null);
  const progressRef    = useRef(null);
  const progressVal    = useRef(0);

  // ── Fetch stats ──────────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;
      const res = await axios.get(`${getBackendBaseUrl()}/api/alerts/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = res.data;
      setStats({
        avg:      '4.2 min',                 // static; can be computed if needed
        active:   d.active   ?? d.pending ?? '–',
        resolved: d.resolved ?? '–',
      });
    } catch (_) {}
  };

  useEffect(() => {
    fetchStats();
    const iv = setInterval(fetchStats, 15000);
    return () => clearInterval(iv);
  }, []);

  // ── Hold-to-SOS logic ────────────────────────────────────────────
  const handleHoldStart = (e) => {
    if (e) e.preventDefault();
    if (sosSent || loading) return;
    
    setHolding(true);
    progressVal.current = 0;
    setHoldProgress(0);

    if (progressRef.current) clearInterval(progressRef.current);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    // Progress bar fills over 3 s
    progressRef.current = setInterval(() => {
      progressVal.current += 2;           // 2 % every 60 ms → 100 % in 3 s
      setHoldProgress(progressVal.current);
      if (progressVal.current >= 100) {
        clearInterval(progressRef.current);
      }
    }, 60);

    holdTimerRef.current = setTimeout(() => {
      sendSos();
    }, 3000);
  };

  const handleHoldEnd = (e) => {
    if (e) e.preventDefault();
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressRef.current)  clearInterval(progressRef.current);
    setHolding(false);
    setHoldProgress(0);
    progressVal.current = 0;
  };

  // ── Send SOS to backend ──────────────────────────────────────────
  const sendSos = async () => {
    setHolding(false);
    setHoldProgress(0);
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');

      // Try to get geolocation
      let lat = null, lng = null, address = '';
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            pos => { lat = pos.coords.latitude; lng = pos.coords.longitude; resolve(); },
            ()  => resolve(),
            { timeout: 4000 }
          );
        });
      } catch (_) {}

      const body = {
        message: 'SOS emergency request from ' + (localStorage.getItem('username') || 'Client'),
        ...(lat !== null && { latitude: lat, longitude: lng }),
        address: address || 'Mbankomo',
      };

      const res = await axios.post(
        `${getBackendBaseUrl()}/api/client/alerts`,
        body,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setActiveAlertId(res.data.id);
      setSosSent(true);

      // Notify other components (like Notifications)
      window.dispatchEvent(new CustomEvent('newAlert', { detail: res.data }));

    } catch (err) {
      setError('Failed to send SOS. Please try again.');
      console.error('SOS error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset for new SOS ────────────────────────────────────────────
  const handleSendAnother = () => {
    setSosSent(false);
    setActiveAlertId(null);
    setChecked([false, false, false, false]);
    setError('');
  };

  // ── Cancel SOS ───────────────────────────────────────────────────
  const cancelSos = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      if (activeAlertId) {
        await axios.patch(
          `${getBackendBaseUrl()}/api/client/alerts/${activeAlertId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setSosSent(false);
      setActiveAlertId(null);
      setChecked([false, false, false, false]);
      fetchStats();
    } catch (err) {
      setError('Failed to cancel. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (i) => {
    const updated = [...checked];
    updated[i] = !updated[i];
    setChecked(updated);
  };

  // ── Sent state ───────────────────────────────────────────────────
  if (sosSent) {
    return (
      <div className="ce-page">
        <div className="ce-sent-card">
          <div className="ce-sent-icon-wrap">
            <FaExclamationCircle size={32} color="#ef4444" />
          </div>
          <h2 className="ce-sent-title">Emergency Request Sent</h2>
          <p className="ce-sent-subtitle">
            Help is on the way. Stay safe and follow the checklist below.
          </p>

          <div className="ce-eta-box">
            <FaClock size={20} color="#ef4444" />
            <div>
              <div className="ce-eta-label">Estimated Arrival</div>
              <div className="ce-eta-time">~5 min</div>
            </div>
          </div>

          <div className="ce-checklist-card">
            <h3 className="ce-checklist-title">Safety Checklist</h3>
            {safetyChecklist.map((item, i) => (
              <label key={i} className="ce-check-row" onClick={() => toggleCheck(i)}>
                <input type="checkbox" checked={checked[i]} onChange={() => toggleCheck(i)} />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <div className="ce-action-btns">
            <button className="ce-action-btn ce-share" onClick={() => alert('Location shared!')}><FaShareAlt /> Share Location</button>
            <button className="ce-action-btn ce-call" onClick={() => window.location.href='tel:911'}><FaPhone /> Call Services</button>
          </div>

          <div className="ce-post-sos-actions">
            <button className="ce-another-btn" onClick={handleSendAnother}>
              Send Another Alert
            </button>
            <button
              className="ce-cancel-btn"
              onClick={cancelSos}
              disabled={loading}
            >
              {loading ? <FaSpinner className="ce-spin" /> : null}
              {loading ? ' Cancelling…' : 'Cancel Request'}
            </button>
          </div>
          
          {error && <p className="ce-error-msg">{error}</p>}
        </div>
      </div>
    );
  }

  // ── Default (pre-SOS) state ──────────────────────────────────────
  return (
    <div className="ce-page">
      <div className="ce-header">
        <h1 className="ce-title">Emergency Services</h1>
        <p className="ce-subtitle">Request immediate assistance when you need it</p>
      </div>

      {/* Stats */}
      <div className="ce-stats-grid">
        <div className="ce-stat-card">
          <div className="ce-stat-icon"><FaClock color="#3b82f6" /></div>
          <div className="ce-stat-label">Average Response Time</div>
          <div className="ce-stat-value">{stats.avg}</div>
        </div>
        <div className="ce-stat-card">
          <div className="ce-stat-icon"><FaExclamationCircle color="#f59e0b" /></div>
          <div className="ce-stat-label">Active Emergencies</div>
          <div className="ce-stat-value">{stats.active}</div>
        </div>
        <div className="ce-stat-card">
          <div className="ce-stat-icon"><FaCheckCircle color="#22c55e" /></div>
          <div className="ce-stat-label">Resolved Today</div>
          <div className="ce-stat-value">{stats.resolved}</div>
        </div>
      </div>

      {/* SOS Section */}
      <div className="ce-sos-card">
        <h2 className="ce-sos-title">Emergency SOS</h2>
        <p className="ce-sos-sub">Hold the button for 3 seconds to send an emergency alert</p>

        <button
          className={`ce-sos-btn ${holding ? 'ce-sos-holding' : ''} ${loading ? 'ce-sos-loading' : ''}`}
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerLeave={handleHoldEnd}
          onContextMenu={(e) => e.preventDefault()}
          disabled={loading}
        >
          {loading ? <FaSpinner className="ce-spin" /> : 'SOS'}
        </button>

        <p className="ce-sos-footer">
          This will alert emergency services with your current location and vehicle details
        </p>
      </div>

      {/* Countdown Overlay */}
      {holding && (
        <div className="ce-countdown-overlay" style={{ pointerEvents: 'none' }}>
          <div className="ce-countdown-content">
            <div className="ce-countdown-ring-wrap">
              <svg viewBox="0 0 100 100" className="ce-countdown-svg">
                <circle cx="50" cy="50" r="45" className="ce-ring-bg" />
                <circle
                  cx="50" cy="50" r="45"
                  className="ce-ring-fill"
                  strokeDasharray={`${holdProgress * 2.827} 282.7`}
                />
              </svg>
              <div className="ce-countdown-text">
                {Math.max(1, Math.ceil((100 - holdProgress) / 33.3))}
              </div>
            </div>
            <h3 className="ce-overlay-title">HOLDING SOS...</h3>
            <p className="ce-overlay-sub">Release to cancel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientEmergency;
