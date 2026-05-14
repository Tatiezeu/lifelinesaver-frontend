import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Main layout components and pages
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Home from './pages/Home';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Services from './pages/Services';
import About from './pages/Aboutus.jsx';
import ContactUs from './pages/Contactus.jsx';
import Footer from './pages/Footer.jsx'; // Ensure Footer is imported
import Pack from './components/Pack.jsx';
import Payment from './components/Payment.jsx';
import PaymentHospital from './components/PaymentHospital.jsx';



// Emergency layout components and pages
import EmergencySidebar from './emergency/components/Sidebar';
import EmergencyTopbar from './emergency/components/Topbar';
import EmergencyDashboard from './emergency/pages/Dashboard';
import EmergencyLiveMap from './emergency/pages/LiveMap';
import EmergencyHistory from './emergency/pages/History';
import EmergencySettings from './emergency/pages/Settings';
import EmergencyLogout from './emergency/pages/Logout';

import './App.css';

function DashboardLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function EmergencyLayout() {
  return (
    <div className="app-container">
      <EmergencySidebar />
      <div className="main-content">
        <EmergencyTopbar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home - no layout */}
        <Route path="/home" element={<Home />} />

        {/* Services - no layout */}
        <Route path="/services" element={<Services />} />

        {/* About Us - no layout */}
        <Route path="/about" element={<About />} />

        {/* Contact Us - no layout */}
        <Route path="/contact" element={<ContactUs />} />

        {/* Footer - no layout */}
        <Route path="/footer" element={<Footer />} />

       {/* login - no layout */}
        <Route path="/Signin" element={<Signin />} />

        {/* Signup - no layout */}
        <Route path="/Signup" element={<Signup />} />
        {/* Pricing - no layout */}
        <Route path="/pack" element={<Pack />} />

        {/* Payment-no layout */}
        <Route path="/payment" element={<Payment />} />

        {/* PaymentHospital - no layout */}

        <Route path="/payment-hospital" element={<PaymentHospital />} />
        

        {/* Main dashboard layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Route>

        {/* Emergency layout */}
        <Route path="/emergency" element={<EmergencyLayout />}>
          <Route index element={<EmergencyDashboard />} />
          <Route path="dashboard" element={<EmergencyDashboard />} />
          <Route path="livemap" element={<EmergencyLiveMap />} />
          <Route path="history" element={<EmergencyHistory />} />
          <Route path="settings" element={<EmergencySettings />} />
          <Route path="logout" element={<EmergencyLogout />} />
        </Route>

        {/* 404 fallback */}
        {/* <Route path="*" element={<h1>404 - Page Not Found</h1>} /> */}
      </Routes>
    </Router>
  );
}
