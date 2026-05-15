// Simple runtime-configurable base URL for backend API
// Uses environment variable if provided, otherwise falls back to localStorage, then default localhost

const DEFAULT_BASE_URL = 'http://localhost:8080/LifelineJavaBackend';

export const getBackendBaseUrl = () => {
  // Vite env var
  const envUrl = import.meta && import.meta.env && import.meta.env.VITE_BACKEND_BASE_URL;
  if (envUrl) return envUrl;

  try {
    const stored = localStorage.getItem('BACKEND_BASE_URL');
    if (stored) return stored;
  } catch (_) {
    // ignore
  }
  return DEFAULT_BASE_URL;
};

export const setBackendBaseUrl = (url) => {
  try {
    localStorage.setItem('BACKEND_BASE_URL', url);
  } catch (_) {
    // ignore
  }
};

export const getAlertsEndpoint = () => `${getBackendBaseUrl()}/api/alerts`;
export const getAlertsReceiveEndpoint = () => `${getBackendBaseUrl()}/api/alerts/receive`;

// Client-specific endpoints
export const getClientProfileEndpoint = () => `${getBackendBaseUrl()}/api/client/profile`;
export const getClientAlertsEndpoint  = () => `${getBackendBaseUrl()}/api/client/alerts`;

export const getGoogleMapsApiKey = () => {
  const envKey = import.meta && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey) return envKey;
  try {
    const stored = localStorage.getItem('GOOGLE_MAPS_API_KEY');
    if (stored) return stored;
  } catch (_) {
    // ignore
  }
  return '';
};


