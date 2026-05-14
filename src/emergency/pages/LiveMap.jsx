import React, { useState, useEffect, useRef } from 'react';
import './LiveMap.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Marker icons
const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/leaflet-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const EmergencyLiveMap = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, this_month
  const API_URL = 'http://localhost:8080/LifelineJavaBackend/api/alerts';
  const mapRef = useRef(null);

  // Fetch alerts from backend
  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(API_URL, config);

      if (Array.isArray(response.data)) {
        setAlerts(response.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Listen for new alerts for instant marker updates
  useEffect(() => {
    const handleNewAlert = (event) => {
      const newAlert = event.detail;
      setAlerts(prev => [newAlert, ...prev]);
    };
    window.addEventListener('newAlert', handleNewAlert);
    return () => window.removeEventListener('newAlert', handleNewAlert);
  }, []);

  const updateAlertStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(`${API_URL}/${id}`, { status }, config);

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: response.data.status } : a))
      );
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const getMarkerIcon = (alertsAtLocation) => {
    // Priority: Active (Red) > Pending (Orange) > Resolved (Green)
    if (alertsAtLocation.some((a) => a.status === 'active')) return redIcon;
    if (alertsAtLocation.some((a) => a.status === 'pending')) return orangeIcon;
    return greenIcon;
  };

  // Group alerts by location after filtering
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = (alert.message || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (alert.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'this_month') {
      const d = alert.created_at || alert.createdAt;
      if (!d) return false;
      const alertDate = new Date(d);
      const now = new Date();
      return matchesSearch && alertDate.getMonth() === now.getMonth() && alertDate.getFullYear() === now.getFullYear();
    }
    return matchesSearch;
  });

  const groupedAlerts = {};
  filteredAlerts.forEach((alert) => {
    const lat = alert.latitude ? alert.latitude.toFixed(6) : "0";
    const lng = alert.longitude ? alert.longitude.toFixed(6) : "0";
    const key = `${lat}-${lng}`;
    if (!groupedAlerts[key]) groupedAlerts[key] = [];
    groupedAlerts[key].push(alert);
  });

  const emergencyServices = [
    { id: 1, lat: 4.08, lng: 9.71, name: 'Emergency Base - Deido' },
  ];

  return (
    <div className="livemap-container" style={{ width: '100%' }}>
      <MapContainer
        center={[4.06, 9.71]}
        zoom={13}
        className="map"
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Emergency base markers */}
        {emergencyServices.map((service) => (
          <Marker key={service.id} position={[service.lat, service.lng]} icon={blueIcon}>
            <Popup>
              <strong>{service.name}</strong>
            </Popup>
          </Marker>
        ))}

        {/* Grouped alerts markers */}
        {Object.values(groupedAlerts).map((alertsAtLocation, idx) => {
          const { latitude, longitude } = alertsAtLocation[0];
          return (
            <Marker
              key={idx}
              position={[latitude, longitude]}
              icon={getMarkerIcon(alertsAtLocation)}
            >
              <Popup className="alert-popup">
                <div className="popup-card">
                  <h4 className="popup-title">{alertsAtLocation.length} Alert(s) here</h4>
                  <div className="popup-scrollable">
                    {alertsAtLocation.map((alert) => (
                      <div key={alert.id} className="alert-detail-item">
                        <div className="alert-info">
                          <p><strong>Msg:</strong> {alert.message}</p>
                          <p><strong>Loc:</strong> {alert.address}</p>
                          <div className={`status-badge ${alert.status}`}>
                            {alert.status.toUpperCase()}
                          </div>
                        </div>

                        <div className="action-buttons-container">
                          {alert.status === 'pending' && (
                            <>
                              <button
                                className="btn-action accept"
                                onClick={() => updateAlertStatus(alert.id, 'active')}
                              >
                                Accept
                              </button>
                              <button
                                className="btn-action decline"
                                onClick={() => updateAlertStatus(alert.id, 'declined')}
                              >
                                Decline
                              </button>
                            </>
                          )}
                          
                          {alert.status === 'active' && (
                            <button
                              className="btn-action complete"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EmergencyLiveMap;