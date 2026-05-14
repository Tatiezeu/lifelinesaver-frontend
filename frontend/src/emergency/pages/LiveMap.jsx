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
  const API_URL = 'http://localhost:8000/api/alerts/';
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

  const updateAlertStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.patch(`${API_URL}${id}/`, { status }, config);

      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: response.data.status } : a))
      );
    } catch (error) {
      console.error('Error updating alert status:', error);
    }
  };

  const getMarkerIcon = (alertsAtLocation) => {
    // If all resolved -> green
    if (alertsAtLocation.every((a) => a.status === 'resolved')) return greenIcon;
    // If all pending -> orange
    if (alertsAtLocation.every((a) => a.status === 'pending')) return orangeIcon;
    // Otherwise -> red
    return redIcon;
  };

  // Group alerts by location
  const groupedAlerts = {};
  alerts.forEach((alert) => {
    const key = `${alert.latitude.toFixed(6)}-${alert.longitude.toFixed(6)}`;
    if (!groupedAlerts[key]) groupedAlerts[key] = [];
    groupedAlerts[key].push(alert);
  });

  const emergencyServices = [
    { id: 1, lat: 4.08, lng: 9.71, name: 'Emergency Base - Deido' },
  ];

  return (
    <div className="livemap-container">
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
          const { latitude, longitude } = alertsAtLocation[0]; // all alerts same location
          return (
            <Marker
              key={idx}
              position={[latitude, longitude]}
              icon={getMarkerIcon(alertsAtLocation)}
            >
              <Popup>
                <div className="popup-card">
                  <h4>{alertsAtLocation.length} Alert(s) here</h4>
                  {alertsAtLocation.map((alert) => (
                    <div key={alert.id} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                      <p><strong>Message:</strong> {alert.message}</p>
                      <p><strong>Address:</strong> {alert.address}</p>
                      <p><strong>Status:</strong> {alert.status}</p>

                      {/* Show buttons only if not resolved */}
                      {alert.status !== 'resolved' && (
                        <div className="action-buttons">
                          <button
                            className="btn-accept"
                            onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-ignore"
                            onClick={() => updateAlertStatus(alert.id, 'pending')}
                          >
                            Ignore
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
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