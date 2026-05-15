import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 1. IMPORT YOUR HOME PAGE
import Home from './pages/Home';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import PortfolioView from './pages/PortfolioView';
import OwnerLogin from './pages/OwnerLogin';
import OwnerCMS from './pages/OwnerCMS';

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
  // 🚀 MOVED THIS HERE: Now the App function can actually see it!
  // I also changed it back to 'adminToken' to match your OwnerLogin.jsx file.
  const hasOwnerAccess = !!localStorage.getItem('adminToken');

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/3DUNIVERSE/:username" element={<PortfolioView />} />

          {/* 🚀 DELETED THE DUPLICATE! Now there is only one secure /admin door */}
          <Route
            path="/admin"
            element={hasOwnerAccess ? <OwnerCMS /> : <OwnerLogin />}
          />

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