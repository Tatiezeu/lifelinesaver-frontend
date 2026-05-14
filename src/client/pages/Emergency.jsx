import React, { useState } from 'react';
import { FaClock, FaExclamationCircle, FaCheckCircle, FaShareAlt, FaPhone } from 'react-icons/fa';
import './Emergency.css';

const stats = [
  { icon: <FaClock color="#3b82f6" />, label: 'Average Response Time', value: '4.2 min' },
  { icon: <FaExclamationCircle color="#f59e0b" />, label: 'Active Emergencies', value: '2' },
  { icon: <FaCheckCircle color="#22c55e" />, label: 'Resolved Today', value: '12' },
];

const safetyChecklist = [
  'Turn on hazard lights',
  'Stay inside the vehicle (unless unsafe)',
  'Move to the hard shoulder if possible',
  'Lock doors and wait for official responders',
];

const ClientEmergency = () => {
  const [sosSent, setSosSent] = useState(false);
  const [holding, setHolding] = useState(false);
  const [holdTimer, setHoldTimer] = useState(null);
  const [checked, setChecked] = useState([false, false, false, false]);
  const [countdown, setCountdown] = useState('4:33');

  const handleHoldStart = () => {
    setHolding(true);
    const t = setTimeout(() => {
      setSosSent(true);
      setHolding(false);
    }, 3000);
    setHoldTimer(t);
  };

  const handleHoldEnd = () => {
    if (holdTimer) clearTimeout(holdTimer);
    setHolding(false);
  };

  const toggleCheck = (i) => {
    const updated = [...checked];
    updated[i] = !updated[i];
    setChecked(updated);
  };

  if (sosSent) {
    return (
      <div className="ce-page">
        <div className="ce-sent-card">
          <div className="ce-sent-icon-wrap">
            <FaExclamationCircle size={32} color="#ef4444" />
          </div>
          <h2 className="ce-sent-title">Emergency Request Sent</h2>
          <p className="ce-sent-subtitle">Help is on the way. Stay safe and follow the checklist below.</p>

          <div className="ce-eta-box">
            <FaClock size={20} color="#ef4444" />
            <div>
              <div className="ce-eta-label">Estimated Arrival</div>
              <div className="ce-eta-time">{countdown}</div>
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
            <button className="ce-action-btn ce-share"><FaShareAlt /> Share Location via SMS</button>
            <button className="ce-action-btn ce-call"><FaPhone /> Call Emergency Contact</button>
          </div>

          <button className="ce-cancel-btn" onClick={() => setSosSent(false)}>Cancel Emergency Request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ce-page">
      <div className="ce-header">
        <h1 className="ce-title">Emergency Services</h1>
        <p className="ce-subtitle">Request immediate assistance when you need it</p>
      </div>

      {/* Stats */}
      <div className="ce-stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="ce-stat-card">
            <div className="ce-stat-icon">{s.icon}</div>
            <div className="ce-stat-label">{s.label}</div>
            <div className="ce-stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* SOS Section */}
      <div className="ce-sos-card">
        <h2 className="ce-sos-title">Emergency SOS</h2>
        <p className="ce-sos-sub">Hold the button for 3 seconds to send an emergency alert</p>

        <button
          className={`ce-sos-btn ${holding ? 'ce-sos-holding' : ''}`}
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
        >
          SOS
        </button>

        <p className="ce-sos-footer">This will alert emergency services with your current location and vehicle details</p>
      </div>
    </div>
  );
};

export default ClientEmergency;
