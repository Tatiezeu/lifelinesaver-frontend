import React from 'react';
import './LiveMap.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Default red and blue icons (custom)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const EmergencyLiveMap = () => {
  // Sample static SOS alerts and emergency service positions
  const sosAlerts = [
    {
      id: 1,
      lat: 4.05,
      lng: 9.7,
      name: 'SOS Alert - Bonaberi',
      time: '12:45 PM',
      status: 'Pending',
      address: 'Bonaberi, Douala'
    },
    {
      id: 2,
      lat: 4.07,
      lng: 9.72,
      name: 'SOS Alert - Akwa',
      time: '13:20 PM',
      status: 'Pending',
      address: 'Akwa, Douala'
    }
  ];

  const emergencyServices = [
    {
      id: 1,
      lat: 4.08,
      lng: 9.71,
      name: 'Emergency Base - Deido'
    }
  ];

  return (
    <div className="livemap-container">
      <MapContainer center={[4.06, 9.71]} zoom={13} scrollWheelZoom={true} className="map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Emergency services (blue) */}
        {emergencyServices.map((service) => (
          <Marker key={service.id} position={[service.lat, service.lng]} icon={blueIcon}>
            <Popup>
              <strong>{service.name}</strong>
            </Popup>
          </Marker>
        ))}

        {/* SOS Alerts (red) */}
        {sosAlerts.map((alert) => (
          <Marker key={alert.id} position={[alert.lat, alert.lng]} icon={redIcon}>
            <Popup>
              <div className="popup-card">
                <h4>{alert.name}</h4>
                <p><strong>Time:</strong> {alert.time}</p>
                <p><strong>Address:</strong> {alert.address}</p>
                <p><strong>Status:</strong> <span className="status">{alert.status}</span></p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default EmergencyLiveMap;
