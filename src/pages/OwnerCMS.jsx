import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Palette, Megaphone,
  CreditCard, Settings, ShieldAlert, LogOut,
  Activity, Search, MoreVertical, UploadCloud,
  Edit, Trash2, DollarSign, TrendingUp, Eye, Image as ImageIcon
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerCMS = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  // REAL-TIME STATE
  const [data, setData] = useState({
    metrics: {},
    users: [],
    themes: [],
    announcements: [],
    settings: {},
    revenueData: [] // For Recharts
  });

  // 🔴 CORE DATA FETCH (CACHE DISABLED)
  const fetchDashboard = async () => {
    try {
      // Add a timestamp query to physically force the browser to see it as a "new" request
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:5001/api/owner/dashboard?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store' // Strict command to bypass browser cache
      });

      const result = await response.json();

      const safeRevenue = result.revenueData || [
        { name: 'Week 1', revenue: 0 }, { name: 'Week 2', revenue: 150 },
        { name: 'Week 3', revenue: 450 }, { name: 'Week 4', revenue: 900 }
      ];

      setData({ ...result, revenueData: safeRevenue });
      setLoading(false);
    } catch (error) {
      console.error("Failed to load Master DB", error);
      setLoading(false);
    }
  };
  useEffect(() => { fetchDashboard(); }, []);

  // 🔴 REAL-TIME ACTIONS
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  const handleUpdatePlan = async (id, currentPlan) => {
    const newPlan = currentPlan === 'free' ? 'pro' : 'free';
    if (!window.confirm(`Upgrade user to ${newPlan.toUpperCase()}?`)) return;
    await fetch(`http://localhost:5001/api/owner/users/${id}/plan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: JSON.stringify({ plan: newPlan })
    });
    fetchDashboard();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    await fetch(`http://localhost:5001/api/owner/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchDashboard();
  };

  const handleCreateBroadcast = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      title: formData.get('title'),
      type: formData.get('type'),
      message: formData.get('message')
    };

    try {
      await fetch('http://localhost:5001/api/owner/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify(payload)
      });
      e.target.reset();
      fetchDashboard(); // Instantly refresh UI
    } catch (err) { alert("Failed to deploy broadcast"); }
  };

  const handleDeleteBroadcast = async (id) => {
    await fetch(`http://localhost:5001/api/owner/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchDashboard();
  };

  const menuItems = [
    { id: 'analytics', icon: <LayoutDashboard size={18} />, label: 'Analytics' },
    { id: 'users', icon: <Users size={18} />, label: 'User Hub' },
    { id: 'themes', icon: <Palette size={18} />, label: 'Theme Engine' },
    { id: 'offers', icon: <Megaphone size={18} />, label: 'Broadcasts' },
    { id: 'subscriptions', icon: <CreditCard size={18} />, label: 'Billing' },
    { id: 'media', icon: <UploadCloud size={18} />, label: 'Media Vault' },
    { id: 'settings', icon: <Settings size={18} />, label: 'Global Config' }
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <motion.div animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-[#ff003c] font-mono tracking-[0.2em] flex flex-col items-center gap-4 text-sm">
        <ShieldAlert size={48} /> CONNECTING TO MAINFRAME...
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#030303] text-slate-200 flex font-sans overflow-hidden selection:bg-[#ff003c]/30">

      {/* SIDEBAR */}
      <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-50" />
          <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-widest"><ShieldAlert className="text-[#ff003c]" size={28} /> GALAXIFY AI</h1>
          <p className="text-[10px] text-[#ff003c] font-mono mt-2 uppercase tracking-[0.3em]">Owner CMS</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}>
              {activeTab === item.id && <motion.div layoutId="activeTabIndicator" className="absolute inset-0 bg-gradient-to-r from-[#ff003c]/20 to-transparent border-l-2 border-[#ff003c]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} />}
              <span className="relative z-10 flex items-center gap-4"><span className={activeTab === item.id ? 'text-[#ff003c]' : ''}>{item.icon}</span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogout} className="w-full group flex items-center justify-center gap-2 bg-[#ff003c]/10 hover:bg-[#ff003c]/20 text-[#ff003c] px-4 py-4 rounded-xl text-xs font-bold border border-[#ff003c]/30 transition-all duration-300">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> DISCONNECT
          </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff003c] opacity-[0.03] blur-[120px] pointer-events-none" />

        <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
          <h2 className="text-3xl font-bold text-white capitalize tracking-wide">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" placeholder="Search Database..." className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#ff003c]/50 text-white w-64 transition-all" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <Activity size={12} className="animate-pulse" /> DATABASE SECURE
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">

            {/* 📊 ANALYTICS MODULE */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { title: "Total Users", value: data.metrics?.totalUsers || 0, icon: <Users size={20} />, color: "text-blue-400" },
                    { title: "Premium Subs", value: data.metrics?.premiumUsers || 0, icon: <CreditCard size={20} />, color: "text-[#ff003c]" },
                    { title: "Active Themes", value: data.metrics?.activeThemes || 0, icon: <Palette size={20} />, color: "text-purple-400" },
                    { title: "Estimated Revenue", value: `$${(data.metrics?.premiumUsers || 0) * 15}`, icon: <DollarSign size={20} />, color: "text-green-400" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden group hover:border-[#ff003c]/50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
                        <TrendingUp size={16} className="text-green-500" />
                      </div>
                      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.title}</h3>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-[400px]">
                  <h3 className="text-white font-bold mb-6 flex items-center gap-2"><Activity className="text-[#ff003c]" size={18} /> Live Metrics Overview</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={data.revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                      <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                      <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                      <Area type="monotone" dataKey="revenue" stroke="#ff003c" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {/* 👥 USER HUB MODULE */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr className="text-slate-400 text-xs uppercase tracking-widest">
                        <th className="px-8 py-5">User Identity</th>
                        <th className="px-8 py-5">Access Tier</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.users?.length > 0 ? data.users.map((user) => (
                        <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-[#ff003c]/20 border border-white/10 flex items-center justify-center font-bold text-white shadow-inner">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white group-hover:text-[#ff003c] transition-colors">{user.name || 'Anonymous User'}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border shadow-[0_0_10px_rgba(255,0,60,0.1)] ${user.plan === 'pro' || user.plan === 'premium' ? 'bg-[#ff003c]/10 text-[#ff003c] border-[#ff003c]/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                              {user.plan || 'FREE'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right flex justify-end gap-2">
                            <button onClick={() => handleUpdatePlan(user._id, user.plan)} className="text-slate-500 hover:text-green-400 transition-colors p-2 hover:bg-white/10 rounded-lg"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteUser(user._id)} className="text-slate-500 hover:text-red-500 transition-colors p-2 hover:bg-white/10 rounded-lg"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-500">No users found in database.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 🎨 THEME ENGINE MODULE */}
            {activeTab === 'themes' && (
              <motion.div key="themes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex justify-between items-center bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                  <div>
                    <h3 className="text-white font-bold text-xl">Theme Database</h3>
                    <p className="text-slate-400 text-sm">Manage portfolio templates and access levels.</p>
                  </div>
                  <button className="bg-[#ff003c] hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,0,60,0.4)] flex items-center gap-2 transition-all">
                    <UploadCloud size={18} /> Upload New Theme
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {data.themes?.length > 0 ? data.themes.map((theme) => (
                    <div key={theme._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                      <div className="h-40 bg-gradient-to-br from-slate-800 to-black relative flex items-center justify-center">
                        <Palette size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
                        {theme.isPremium && <span className="absolute top-3 right-3 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/50 text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>}
                      </div>
                      <div className="p-5">
                        <h4 className="text-white font-bold text-lg mb-1">{theme.name}</h4>
                        <p className="text-slate-500 text-xs mb-4">Category: {theme.category || 'General'}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-colors">Edit Metadata</button>
                          <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 text-center text-slate-500 py-10">No themes active in database.</div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 📢 BROADCASTS MODULE */}
            {activeTab === 'offers' && (
              <motion.div key="offers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 gap-8">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Megaphone className="text-[#ff003c]" /> Create Broadcast</h3>
                  <form onSubmit={handleCreateBroadcast} className="space-y-4">
                    <div><label className="text-xs text-slate-400 font-bold mb-2 block">Headline</label><input type="text" name="title" required placeholder="e.g. 50% OFF PRO PLAN" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#ff003c]/50 outline-none" /></div>
                    <div><label className="text-xs text-slate-400 font-bold mb-2 block">Broadcast Type</label><select name="type" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"><option value="offer">Special Offer</option><option value="alert">System Alert</option></select></div>
                    <div><label className="text-xs text-slate-400 font-bold mb-2 block">Message Body</label><textarea name="message" required rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"></textarea></div>
                    <button type="submit" className="w-full py-4 rounded-xl text-white font-bold tracking-widest bg-gradient-to-r from-[#ff003c] to-red-800 shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:scale-[1.02] transition-transform">DEPLOY TO MAINFRAME</button>
                  </form>
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Active Signals</h3>
                  <div className="space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
                    {data.announcements?.length > 0 ? data.announcements.map((ann) => (
                      <div key={ann._id} className="p-4 border border-[#ff003c]/30 bg-[#ff003c]/5 rounded-xl flex justify-between items-start">
                        <div>
                          <h4 className="text-[#ff003c] font-bold text-sm mb-1 uppercase">{ann.title}</h4>
                          <p className="text-xs text-slate-300 mb-2">{ann.message}</p>
                          <p className="text-[10px] text-slate-500 uppercase">{ann.type} • Active</p>
                        </div>
                        <button onClick={() => handleDeleteBroadcast(ann._id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    )) : (
                      <div className="text-slate-500 text-sm text-center py-4">No active broadcasts.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 💳 BILLING MODULE */}
            {activeTab === 'subscriptions' && (
              <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="grid grid-cols-3 gap-6 mb-8">
                  {['FREE', 'PRO', 'ULTRA'].map((tier, i) => (
                    <div key={i} className={`p-6 rounded-2xl border ${i === 1 ? 'border-[#ff003c] bg-[#ff003c]/5' : 'border-white/10 bg-black/40'}`}>
                      <h3 className={`text-lg font-bold mb-2 ${i === 1 ? 'text-[#ff003c]' : 'text-white'}`}>{tier} TIER</h3>
                      <p className="text-3xl font-bold text-white mb-4">{i === 0 ? '$0' : i === 1 ? '$15' : '$49'}<span className="text-sm text-slate-500 font-normal">/mo</span></p>
                      <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white font-bold transition-colors">Edit Plan Data</button>
                    </div>
                  ))}
                </div>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Recent Transactions (Stripe)</h3>
                  <div className="text-slate-500 text-sm text-center py-10 border border-dashed border-white/10 rounded-xl">Stripe API webhook connection required to display live ledger.</div>
                </div>
              </motion.div>
            )}

            {/* 📁 MEDIA VAULT MODULE */}
            {activeTab === 'media' && (
              <motion.div key="media" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="border-2 border-dashed border-[#ff003c]/50 rounded-2xl p-12 flex flex-col items-center justify-center bg-gradient-to-b from-[#ff003c]/5 to-transparent hover:bg-[#ff003c]/10 transition-colors cursor-pointer group relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Media" />
                  <UploadCloud size={48} className="text-[#ff003c] mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-bold text-lg mb-2">Upload Asset to Cloudinary</h3>
                  <p className="text-slate-500 text-sm">Drag and drop images, videos, or 3D models here</p>
                </div>
                <div className="grid grid-cols-4 gap-4 mt-8">
                  <div className="col-span-4 text-center text-slate-500 py-10">No media assets found in database.</div>
                </div>
              </motion.div>
            )}

            {/* ⚙️ SETTINGS MODULE */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-50" />
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-[#ff003c]" /> Global Configuration</h3>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const payload = { siteName: formData.get('siteName'), heroTagline: formData.get('heroTagline'), maintenanceMode: formData.get('maintenanceMode') === 'on' };
                    await fetch('http://localhost:5001/api/owner/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }, body: JSON.stringify(payload) });
                    alert("CORE SETTINGS UPDATED SUCESSFULLY");
                    fetchDashboard();
                  }} className="space-y-6">
                    <div><label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">System Identity</label><input type="text" name="siteName" defaultValue={data.settings?.siteName || "GALAXIFY AI"} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff003c]/50" /></div>
                    <div><label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">Primary Directive</label><input type="text" name="heroTagline" defaultValue={data.settings?.heroTagline || "Build immersive web experiences"} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff003c]/50" /></div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div><h4 className="text-sm font-bold text-white">Maintenance Mode</h4><p className="text-xs text-slate-500">Lock down the system.</p></div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" name="maintenanceMode" defaultChecked={data.settings?.maintenanceMode} className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff003c]"></div>
                      </label>
                    </div>
                    <button type="submit" className="w-full py-4 rounded-xl text-white font-bold tracking-widest bg-gradient-to-r from-[#ff003c] to-red-800 shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:scale-[1.02] transition-transform">COMMIT CHANGES</button>
                  </form>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default OwnerCMS;