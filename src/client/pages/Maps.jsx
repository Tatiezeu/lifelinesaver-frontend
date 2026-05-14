import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Maps.css';

// Mbankomo, Cameroon
const MBANKOMO = { lat: 3.9167, lng: 11.6833 };

const ClientMaps = () => {
  return (
    <div className="cm-page">
      <div className="cm-header">
        <h1 className="cm-title">Live Location</h1>
        <p className="cm-subtitle">Your current position — Mbankomo, Cameroon</p>
      </div>

      <div className="cm-map-wrapper">
        <MapContainer
          center={[MBANKOMO.lat, MBANKOMO.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%', borderRadius: '14px' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Outer pulse ring */}
          <CircleMarker
            center={[MBANKOMO.lat, MBANKOMO.lng]}
            radius={18}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.15, weight: 1.5 }}
          />

          {/* Inner solid dot */}
          <CircleMarker
            center={[MBANKOMO.lat, MBANKOMO.lng]}
            radius={8}
            pathOptions={{ color: '#fff', fillColor: '#3b82f6', fillOpacity: 1, weight: 2.5 }}
          >
            <Popup>
              <strong>Your Location</strong><br />
              Mbankomo, Centre Region<br />
              Cameroon
            </Popup>
          </CircleMarker>
        </MapContainer>

        {/* Info badge */}
        <div className="cm-location-badge">
          <div className="cm-badge-dot" />
          <span>Mbankomo, Cameroon</span>
        </div>
      </div>
    </div>
  );
};

export default ClientMaps;
