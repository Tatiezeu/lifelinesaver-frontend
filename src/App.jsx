import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Public pages
import Home from './pages/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Pack from './components/Pack';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Profile from './pages/Profile';

// Emergency dashboard
import EmergencyDashboard from './emergency/pages/Dashboard';
import EmergencyLiveMap from './emergency/pages/LiveMap';
import EmergencyHistory from './emergency/pages/History';
import EmergencySettings from './emergency/pages/Settings';
import EmergencySidebar from './emergency/components/Sidebar';
import EmergencyTopbar from './emergency/components/Topbar';

// Admin dashboard
import AdminSidebar from './components/AdminSidebar';
import AdminTopbar from './components/Topbar';
import AdminHome from './pages/AdminHome';

// Client dashboard
import ClientSidebar from './client/components/Sidebar';
import ClientTopbar from './client/components/Topbar';
import ClientDashboard from './client/pages/Dashboard';
import ClientMaps from './client/pages/Maps';
import ClientEmergency from './client/pages/Emergency';
import ClientNotifications from './client/pages/Notifications';
import ClientProfile from './client/pages/Profile';

// ─── Shared layout style ──────────────────────────────────────────────────────
const dashLayout = { display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' };
const sidebarWrap = { width: '250px', flexShrink: 0, height: '100vh' };
const mainWrap = { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' };

// ─── Emergency Layout ─────────────────────────────────────────────────────────
const EmergencyLayout = () => (
  <div style={dashLayout}>
    <div style={sidebarWrap}><EmergencySidebar /></div>
    <div style={mainWrap}>
      <EmergencyTopbar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f3f4f6' }}>
        <Outlet />
      </div>
    </div>
  </div>
);

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout = () => (
  <div style={dashLayout}>
    <div style={sidebarWrap}><AdminSidebar /></div>
    <div style={mainWrap}>
      <AdminTopbar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f3f4f6' }}>
        <Outlet />
      </div>
    </div>
  </div>
);

// ─── Client Layout ────────────────────────────────────────────────────────────
const ClientLayout = () => (
  <div style={dashLayout}>
    <div style={sidebarWrap}><ClientSidebar /></div>
    <div style={mainWrap}>
      <ClientTopbar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f8fafc' }}>
        <Outlet />
      </div>
    </div>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pack" element={<Pack />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Emergency dashboard */}
        <Route path="/emergency" element={<EmergencyLayout />}>
          <Route index element={<EmergencyDashboard />} />
          <Route path="livemap" element={<EmergencyLiveMap />} />
          <Route path="history" element={<EmergencyHistory />} />
          <Route path="settings" element={<EmergencySettings />} />
        </Route>

        {/* Client dashboard */}
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<ClientDashboard />} />
          <Route path="maps" element={<ClientMaps />} />
          <Route path="emergency" element={<ClientEmergency />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}
