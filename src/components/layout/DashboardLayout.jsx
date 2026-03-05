import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, FolderOpen, User, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Create New Web Portfolio', path: '/dashboard', icon: <PlusCircle size={20} /> },
    { name: 'My Portfolios', path: '/dashboard/portfolios', icon: <FolderOpen size={20} /> },
    { name: 'Profile Settings', path: '/dashboard/settings', icon: <User size={20} /> },
    { name: 'Upgrade to Pro', path: '/dashboard/upgrade', icon: <Crown size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-slate-200 font-semibold text-lg tracking-wide">GALAXIFY</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-400 font-bold text-lg">AI</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-white transition-colors'}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-400 hover:bg-white/5 hover:text-red-400 group border border-transparent"
          >
            <LogOut size={20} className="group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={16} className="text-yellow-400" />
              <h4 className="text-sm font-bold text-white">Pro Plan</h4>
            </div>
            <p className="text-xs text-slate-400 mb-3">Unlock all themes & features</p>
            <Link to="/dashboard/upgrade" className="block w-full py-1.5 bg-white text-black text-center text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Upgrade
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen bg-[#0f172a]">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;