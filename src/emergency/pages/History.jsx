import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './History.css';
import { FaTrashAlt } from 'react-icons/fa';
import ConfirmationModal from '../../components/ConfirmationModal';

const EmergencyHistory = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:8080/LifelineJavaBackend/api/alerts';

  const getToken = () => {
    const token = localStorage.getItem('access');
    console.log('Access Token:', token);
    return token;
  };

  const getConfig = () => {
    const token = getToken();
    return {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    };
  };

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL, getConfig());
      setAlerts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Listen for new alerts from Sidebar
    const handleNewAlert = (event) => {
      const newAlert = event.detail;
      setAlerts(prev => [newAlert, ...prev]); // prepend new alert
    };

    window.addEventListener('newAlert', handleNewAlert);

    return () => {
      window.removeEventListener('newAlert', handleNewAlert);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', id: null });

  const handleDelete = async (id) => {
    setModalConfig({ type: 'single', id });
    setIsModalOpen(true);
  };

  const handleClearAll = async () => {
    setModalConfig({ type: 'all', id: null });
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    setIsModalOpen(false);
    if (modalConfig.type === 'single') {
      try {
        await axios.delete(`${API_URL}/${modalConfig.id}`, getConfig());
        setAlerts(alerts.filter(alert => alert.id !== modalConfig.id));
      } catch (error) {
        console.error('Error deleting alert:', error);
      }
    } else {
      try {
        await axios.delete(API_URL, getConfig());
        setAlerts([]);
      } catch (error) {
        console.error('Error clearing alerts:', error);
      }
    }
  };

  return (
    <div className="history-container">
      <h2 className="history-title">SOS Alert History</h2>

      {loading ? (
        <p>Loading alerts...</p>
      ) : (
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <p className="no-alerts">No SOS alerts in history.</p>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="alert-card">
                <div className="alert-info">
                  <h4>{alert.title || `SOS Alert - ${alert.address}`}</h4>
                  <p><strong>Time:</strong> {(() => {
                    const d = alert.created_at || alert.createdAt;
                    return d ? new Date(d).toLocaleString() : 'N/A';
                  })()}</p>
                  <p><strong>Address:</strong> {alert.address}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span className={`status ${alert.status.toLowerCase()}`}>{alert.status}</span>
                  </p>
                </div>
                <FaTrashAlt className="delete-icon" onClick={() => handleDelete(alert.id)} />
              </div>
            ))
          )}
        </div>
      )}

      {alerts.length > 0 && (
        <button className="clear-btn" onClick={handleClearAll}>
          Clear All History
        </button>
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmAction}
        title={modalConfig.type === 'all' ? 'Clear All History' : 'Delete Alert'}
        message={modalConfig.type === 'all' 
          ? 'Are you sure you want to clear ALL alert history? This will permanently delete everything from the database.'
          : 'Are you sure you want to delete this alert? This action cannot be undone.'
        }
      />
    </div>
  );
};

export default EmergencyHistory;