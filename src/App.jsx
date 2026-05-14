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

// ─── Emergency Layout ────────────────────────────────────────────────────────
const EmergencyLayout = () => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    {/* Fixed-width sidebar */}
    <div style={{ width: '250px', flexShrink: 0, height: '100vh' }}>
      <EmergencySidebar />
    </div>
    {/* Everything else: topbar + scrollable page content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <EmergencyTopbar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f3f4f6' }}>
        <Outlet />
      </div>
    </div>
  </div>
);

// ─── Admin Layout ─────────────────────────────────────────────────────────────
const AdminLayout = () => (
  <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    {/* Fixed-width sidebar */}
    <div style={{ width: '250px', flexShrink: 0, height: '100vh' }}>
      <AdminSidebar />
    </div>
    {/* Everything else: topbar + scrollable page content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <AdminTopbar />
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#f3f4f6' }}>
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
      </Routes>
    </Router>
  );
}
