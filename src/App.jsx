
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// IMPORT YOUR PAGES
import Home from './pages/Home';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import PortfolioView from './pages/PortfolioView';
import OwnerLogin from './pages/OwnerLogin';
import OwnerCMS from './pages/OwnerCMS';
import ClientLogin from './pages/ClientLogin';
import CustomerDashboard from './pages/CustomerDashboard';
// This is for normal users (Dashboard)
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black" />; // Silent load
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const hasOwnerAccess = !!localStorage.getItem('adminToken');

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/customer-dashboard/:username" element={<CustomerDashboard />} />
          {/* Public Live Site */}
          <Route path="/3DUNIVERSE/:username" element={<PortfolioView />} />

          {/* 🚀 NEW: The Customer Portal Authentication Route */}
          <Route path="/client-portal/:username" element={<ClientLogin />} />

          {/* Secure Admin Door */}
          <Route
            path="/admin"
            element={hasOwnerAccess ? <OwnerCMS /> : <OwnerLogin />}
          />
          {/* 🚀 ADD THIS NEW ROUTE */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Creator Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;