import React, { useEffect, useState } from 'react';  
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, resolved: 0 });
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: []
  });

  const [showWelcome, setShowWelcome] = useState(
    localStorage.getItem("showWelcome") === "true"
  );
  const username = localStorage.getItem("username") || "User";

  const updateChart = (data) => {
    const total = data.total || 0;
    const active = data.active || 0;
    const resolved = data.resolved || 0;

    setChartData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Total Alerts',
          data: [
            Math.floor(total * 0.5), 
            Math.floor(total * 0.6), 
            Math.floor(total * 0.7), 
            Math.floor(total * 0.8), 
            Math.floor(total * 0.9), 
            Math.floor(total * 0.95), 
            total
          ],
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
        },
        {
          label: 'Active (In Progress)',
          data: [
            Math.floor(active * 0.4), 
            Math.floor(active * 0.5), 
            Math.floor(active * 0.6), 
            Math.floor(active * 0.75), 
            Math.floor(active * 0.85), 
            Math.floor(active * 0.92), 
            active
          ],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
        },
        {
          label: 'Resolved',
          data: [
            Math.floor(resolved * 0.3), 
            Math.floor(resolved * 0.5), 
            Math.floor(resolved * 0.65), 
            Math.floor(resolved * 0.75), 
            Math.floor(resolved * 0.85), 
            Math.floor(resolved * 0.95), 
            resolved
          ],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
        }
      ]
    });
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const now = new Date();
      let month = now.getMonth() + 1;
      let year = now.getFullYear();

      if (selectedPeriod === 'last_month') {
        month = now.getMonth();
        if (month === 0) { month = 12; year -= 1; }
      } else if (selectedPeriod === 'all_time') {
        month = null;
        year = null;
      }

      let url = 'http://localhost:8080/LifelineJavaBackend/api/alerts/stats';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }

      console.log('Fetching stats from URL:', url);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Dashboard received stats:', res.data);
      setStats(res.data);
      updateChart(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedPeriod]);

  // Listen for new alerts to update stats in real-time
  useEffect(() => {
    const handleNewAlert = () => {
      fetchStats();
    };
    window.addEventListener('newAlert', handleNewAlert);
    return () => window.removeEventListener('newAlert', handleNewAlert);
  }, [selectedPeriod]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false);
        localStorage.removeItem("showWelcome");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 15 } },
      title: { 
        display: true, 
        text: 'Monthly SOS Alert Statistics (Total, Pending, Active, Resolved)',
        font: { size: 16 }
      }
    }
  };

  return (
    <div className="dashboard">
      {showWelcome && (
        <div className="welcome-message">
          Welcome back, <span className="username">{username}</span> 🎉
        </div>
      )}

      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <select 
          className="month-select"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="this_month">This Month</option>
          <option value="last_month">Last Month</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      <div className="card-container">
        <div className="info-card gradient-blue">
          <div className="card-content">
            <div>
              <p className="card-number">{stats.total || 0}</p>
              <p className="card-label">TOTAL ALERTS</p>
            </div>
            <BellRing size={40} />
          </div>
        </div>

        <div className="info-card gradient-cyan">
          <div className="card-content">
            <div>
              <p className="card-number">{stats.active || 0}</p>
              <p className="card-label">ACTIVE / ACCEPTED</p>
            </div>
            <Activity size={40} />
          </div>
        </div>

        <div className="info-card gradient-green">
          <div className="card-content">
            <div>
              <p className="card-number">{stats.resolved || 0}</p>
              <p className="card-label">RESOLVED</p>
            </div>
            <CheckCircle2 size={40} />
          </div>
        </div>
      </div>

      <div className="chart-section">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EmergencyDashboard;
