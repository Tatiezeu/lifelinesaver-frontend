import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaUserCheck, FaUserSlash } from 'react-icons/fa';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminHome = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0
  });

  const chartData = [
    { name: 'Total', value: stats.total, color: '#007bff' },
    { name: 'Active', value: stats.active, color: '#28a745' },
    { name: 'Suspended', value: stats.suspended, color: '#dc3545' },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8080/LifelineJavaBackend/api/users');
        const users = res.data;
        const total = users.length;
        const suspended = users.filter(u => u.is_suspended).length;
        const active = total - suspended;
        setStats({ total, active, suspended });
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-home">
      <h2 style={{ marginBottom: '20px', color: '#1e1e2f' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '50%', color: '#007bff' }}><FaUsers size={24} /></div>
          <div>
            <h4 style={{ color: '#666', margin: 0 }}>Total Users</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.total}</p>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '50%', color: '#28a745' }}><FaUserCheck size={24} /></div>
          <div>
            <h4 style={{ color: '#666', margin: 0 }}>Active Users</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.active}</p>
          </div>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#ffebee', padding: '15px', borderRadius: '50%', color: '#dc3545' }}><FaUserSlash size={24} /></div>
          <div>
            <h4 style={{ color: '#666', margin: 0 }}>Suspended Users</h4>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{stats.suspended}</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '400px' }}>
        <h3 style={{ marginBottom: '20px', color: '#333' }}>User Statistics Graph</h3>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminHome;
