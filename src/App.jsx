import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const Navigation = () => {
  const location = useLocation();
  // Hide Navbar on Dashboard (has its own sidebar) and PortfolioView (immersive)
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/u/')) {
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
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route path="upgrade" element={<Pricing />} />
          </Route>

          {/* Dynamic Public Portfolio Route */}
          <Route path="/u/:username" element={<PortfolioView />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;