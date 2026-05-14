import React, { useEffect, useState } from 'react';  
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import { BellRing, Activity, CheckCircle2 } from "lucide-react";
import {
  Chart as ChartJS,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const EmergencyDashboard = () => {
  // Example stats — make dynamic later
  const totalSOS = 60;
  const activeSOS = 35;
  const resolvedSOS = 40;

  // ✅ Welcome message state — show only once after login
  const [showWelcome, setShowWelcome] = useState(
    localStorage.getItem("showWelcome") === "true"
  );
  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem("showWelcome"); // ensures it won't show again until next login
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Alerts',
        data: [10, 20, 25, 30, 45, 50, 60],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Active',
        data: [5, 10, 15, 20, 25, 30, 35],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Resolved',
        data: [2, 5, 10, 15, 20, 30, 40],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 15 }
      },
      title: {
        display: true,
        text: 'Monthly SOS Alert Statistics',
        font: { size: 18 }
      }
    }
  };

  return (
    <div className="dashboard">
      {/* ✅ Welcome Message */}
      {showWelcome && (
        <div className="welcome-message">
          Welcome back, <span className="username">{username}</span> 🎉
        </div>
      )}

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <select className="month-select">
          <option>This Month</option>
          <option>Last Month</option>
          <option>Custom</option>
        </select>
      </div>

      <div className="card-container">
        <div className="info-card gradient-blue">
          <div className="card-content">
            <div>
              <p className="card-number">{totalSOS}</p>
              <p className="card-label">TOTAL ALERTS</p>
            </div>
            <BellRing size={40} />
          </div>
        </div>

        <div className="info-card gradient-cyan">
          <div className="card-content">
            <div>
              <p className="card-number">{activeSOS}</p>
              <p className="card-label">ACTIVE</p>
            </div>
            <Activity size={40} />
          </div>
        </div>

        <div className="info-card gradient-green">
          <div className="card-content">
            <div>
              <p className="card-number">{resolvedSOS}</p>
              <p className="card-label">RESOLVED</p>
            </div>
            <CheckCircle2 size={40} />
          </div>
        </div>
      </div>

      <div className="chart-section">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EmergencyDashboard;
