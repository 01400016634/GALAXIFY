import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PortfolioView from './pages/PortfolioView';
import Pricing from './pages/Pricing';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ProfileSettings from './pages/ProfileSettings';

// 🛡️ OWNER CMS Imports
import AdminLogin from './pages/AdminLogin';
import OwnerCMS from './pages/OwnerCMS';

// ==========================================
// 🔐 CUSTOM ADMIN PROTECTOR
// ==========================================
const AdminRoute = ({ children }) => {
  const hasToken = localStorage.getItem('adminToken');
  // If no token is found, kick them back to the /admin login page
  if (!hasToken) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const Navigation = () => {
  const location = useLocation();

  // Hide Navbar on specialized routes so they take up the full screen
  if (
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/u/') ||
    location.pathname === '/owner-panel' ||
    location.pathname === '/admin' // Hide navbar on admin login screen too
  ) {
    return null;
  }
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected User Dashboard Routes (Uses Firebase) */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="upgrade" element={<Pricing />} />
          </Route>

          {/* 🔐 NEW: The Admin Login Screen */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* 🛡️ UPDATED: OWNER CMS Route (Uses AdminRoute instead of ProtectedRoute) */}
          <Route path="/owner-panel" element={
            <AdminRoute>
              <OwnerCMS />
            </AdminRoute>
          } />

          {/* Dynamic Public Portfolio Route */}
          <Route path="/u/:username" element={<PortfolioView />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;