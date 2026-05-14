import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import {
  FaExclamationTriangle, FaBolt, FaCar, FaClock,
  FaWrench, FaOilCan, FaTachometerAlt,
} from 'react-icons/fa';
import { MdElectricBolt } from 'react-icons/md';
import './Dashboard.css';

const sparkData = [
  [{ v: 10 }, { v: 20 }, { v: 15 }, { v: 35 }, { v: 28 }, { v: 40 }],
  [{ v: 22 }, { v: 18 }, { v: 28 }, { v: 20 }, { v: 30 }, { v: 25 }],
  [{ v: 50 }, { v: 50 }, { v: 50 }, { v: 50 }, { v: 50 }, { v: 50 }],
  [{ v: 30 }, { v: 20 }, { v: 28 }, { v: 18 }, { v: 25 }, { v: 20 }],
];
const sparkColors = ['#ef4444', '#22c55e', '#3b82f6', '#f59e0b'];

const statCards = [
  { icon: <FaExclamationTriangle />, label: 'Total Alerts', value: '23', color: '#ef4444' },
  { icon: <FaBolt />,                label: 'Recent Activity', value: '8', color: '#22c55e' },
  { icon: <FaCar />,                 label: 'Car Health Status', value: 'Good', color: '#3b82f6' },
  { icon: <FaClock />,               label: 'Active Requests', value: '2', color: '#f59e0b' },
];

const quickActions = [
  {
    icon: <FaWrench size={24} color="#f59e0b" />,
    bg: '#fef9c3',
    title: 'Request Tow',
    desc: 'Get your vehicle towed to the nearest service center',
  },
  {
    icon: <FaExclamationTriangle size={24} color="#ef4444" />,
    bg: '#fef2f2',
    title: 'Flat Tire',
    desc: 'Request roadside assistance for tire change',
  },
  {
    icon: <FaOilCan size={24} color="#3b82f6" />,
    bg: '#eff6ff',
    title: 'Out of Fuel',
    desc: 'Request emergency fuel delivery',
  },
];

const ClientDashboard = () => {
  const [activeAction, setActiveAction] = useState(null);

  return (
    <div className="cd-page">
      <div className="cd-header">
        <h1 className="cd-title">Dashboard</h1>
        <p className="cd-subtitle">Overview of your emergency alerts and vehicle status</p>
      </div>

      {/* Stat Cards */}
      <div className="cd-stat-grid">
        {statCards.map((s, i) => (
          <div key={i} className="cd-stat-card">
            <div className="cd-stat-top">
              <span style={{ color: s.color, fontSize: '1.3rem' }}>{s.icon}</span>
              <span className="cd-stat-label">{s.label}</span>
            </div>
            <div className="cd-stat-value">{s.value}</div>
            <ResponsiveContainer width="100%" height={40}>
              <LineChart data={sparkData[i]}>
                <Line type="monotone" dataKey="v" stroke={s.color} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="cd-section-title">Quick Actions</div>
      <div className="cd-quick-grid">
        {quickActions.map((a, i) => (
          <button
            key={i}
            className={`cd-quick-card ${activeAction === i ? 'cd-quick-active' : ''}`}
            onClick={() => setActiveAction(i === activeAction ? null : i)}
          >
            <div className="cd-quick-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div className="cd-quick-title">{a.title}</div>
            <div className="cd-quick-desc">{a.desc}</div>
          </button>
        ))}
      </div>

      {/* Vehicle Health */}
      <div className="cd-health-card">
        <div className="cd-health-title">Vehicle Health Monitor</div>
        <div className="cd-health-grid">
          <div className="cd-health-item">
            <MdElectricBolt size={24} color="#22c55e" />
            <div>
              <div className="cd-health-label">Battery</div>
              <div className="cd-health-value">94%</div>
            </div>
          </div>
          <div className="cd-health-item">
            <FaOilCan size={20} color="#3b82f6" />
            <div>
              <div className="cd-health-label">Oil Level</div>
              <div className="cd-health-value">Good</div>
            </div>
          </div>
          <div className="cd-health-item">
            <FaTachometerAlt size={20} color="#f59e0b" />
            <div>
              <div className="cd-health-label">Tire Pressure</div>
              <div className="cd-health-value">Normal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
