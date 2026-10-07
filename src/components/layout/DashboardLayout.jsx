import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="w-full min-h-screen bg-[#050505]">
      {/* This just renders whatever page is active (like your new Dashboard.jsx) without adding extra sidebars! */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;