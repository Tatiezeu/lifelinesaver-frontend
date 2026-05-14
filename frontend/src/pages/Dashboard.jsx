import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import { Users, UserCheck, UserX } from 'lucide-react';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const isAdmin = true;
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [suspendedUsers, setSuspendedUsers] = useState(0);

  const [showWelcome, setShowWelcome] = useState(false);
  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    const welcomeFlag = localStorage.getItem("showWelcome");
    if (welcomeFlag === "true") {
      setShowWelcome(true);
      localStorage.removeItem("showWelcome");
      const timer = setTimeout(() => setShowWelcome(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch users dynamically
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/users/');
        const users = res.data;

        setTotalUsers(users.length);
        setSuspendedUsers(users.filter(u => u.is_suspended).length);
        setActiveUsers(users.filter(u => !u.is_suspended).length);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Total Users',
        data: [900, 950, 1000, 1100, 1150, 1180, totalUsers], 
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Active Users',
        data: [700, 750, 800, 850, 900, 925, activeUsers],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Suspended Users',
        data: [50, 60, 70, 90, 110, 130, suspendedUsers],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
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
      legend: { position: 'top', labels: { boxWidth: 15 } },
      title: { display: true, text: 'Monthly User Statistics', font: { size: 18 } }
    }
  };

  return (
    <div className={`dashboard ${isAdmin ? 'admin-scrollable' : ''}`}>
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
              <p className="card-number">{totalUsers}</p>
              <p className="card-label">TOTAL USERS</p>
            </div>
            <Users size={40} />
          </div>
        </div>

        <div className="info-card gradient-cyan">
          <div className="card-content">
            <div>
              <p className="card-number">{activeUsers}</p>
              <p className="card-label">ACTIVE USERS</p>
            </div>
            <UserCheck size={40} />
          </div>
        </div>

        <div className="info-card gradient-red">
          <div className="card-content">
            <div>
              <p className="card-number">{suspendedUsers}</p>
              <p className="card-label">SUSPENDED USERS</p>
            </div>
            <UserX size={40} />
          </div>
        </div>
      </div>

      <div className="chart-section">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;