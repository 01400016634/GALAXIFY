import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Palette, Megaphone,
  CreditCard, Settings, ShieldAlert, LogOut,
  Activity, Search, MoreVertical, UploadCloud,
  Edit, Trash2, DollarSign, TrendingUp, Eye, Image as ImageIcon,
  Globe, Layout, Video, Layers, PlusCircle, ListPlus, Type, Save
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OwnerCMS = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // 🚀 NEW: THEME CATEGORIES STATE
  const [categories, setCategories] = useState([
    'E-Commerce',
    'Digital Gadgets',
    'Learning Platform',
    'Real Estate',
    'Agency/Service',
    'Personal Portfolio'
  ]);

  const handleAddNewCategory = () => {
    const newCat = prompt("Enter a new Theme Category:");
    if (newCat && newCat.trim() !== "") {
      setCategories([...categories, newCat.trim()]);
    }
  };

  // REAL-TIME STATE
  const [data, setData] = useState({
    metrics: {},
    users: [],
    projects: [],
    themes: [],
    announcements: [],
    settings: {
      siteName: '3D UNIVERSE',
      heroTagline: 'Build immersive web experiences',
      maintenanceMode: false,
      homepageSections: ['Features', 'Pricing', 'Themes', 'FAQ'],
      userDashboardTabs: ['Analytics', 'Pages', 'Editor', 'Inventory', 'Settings']
    },
    // DYNAMIC WORKFLOW CONTROLLER FOR USER DASHBOARD
    workflowConfig: [
      {
        phase: 'Phase 1: Architecture',
        steps: [
          { id: 'setup', title: 'Project Setup', description: 'Define the core architecture and goal.', fields: ['Project Name', 'Business Category', 'Website Goal', 'Target Audience'] },
          { id: 'brand', title: 'Brand Identity', description: 'Configure logos, colors, and typography globally.', fields: ['Logo Upload', 'Brand Name', 'Tagline', 'About (Short)', 'Primary Color', 'Font Style'] }
        ]
      },
      {
        phase: 'Phase 2: Core Content',
        steps: [
          { id: 'hero', title: 'Hero Section', description: 'Hook your visitors instantly.', fields: ['Hero Headline', 'Sub-headline', 'CTA Text', 'CTA Link', 'Hero Media Background'] },
          { id: 'blocks', title: 'Section Builder', description: 'Drag, drop, and configure modular sections.', fields: ['Block Type', 'Block Title', 'Layout Configuration'] }
        ]
      },
      {
        phase: 'Phase 3: Refinement',
        steps: [
          { id: 'theme', title: 'Theme & Animations', description: 'Control the global structure and 3D physics.', fields: ['Theme Selection', 'Navigation Style', 'Content Width', 'Animation Intensity', 'Particle Engine'] },
          { id: 'ai', title: 'AI Content Optimizer', description: 'Let AI write high-converting copy.', fields: ['Tone of Voice', 'Hero Copy Gen', 'Feature Blocks Gen'] },
          { id: 'media', title: 'Media Manager', description: 'Manage 3D models (GLB), videos, and images.', fields: ['File Uploader', 'Media Library'] },
          { id: 'contact', title: 'Contact & Socials', description: 'Configure quick-access floating buttons.', fields: ['Support Email', 'Phone Number', 'WhatsApp Number', 'Active Social Modules'] }
        ]
      },
      {
        phase: 'Phase 4: Launch',
        steps: [
          { id: 'seo', title: 'SEO & Performance', description: 'Ensure your page ranks high.', fields: ['SEO Title Tag', 'Meta Description', 'Google Analytics ID'] },
          { id: 'publish', title: 'Publish Settings', description: 'Configure domain and push to edge network.', fields: ['Custom Domain', 'Page Visibility', 'Access Password'] }
        ]
      }
    ],
    revenueData: []
  });

  // 1. DATA FETCHING FUNCTION
  const fetchDashboard = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`http://localhost:5001/api/owner/dashboard?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const result = await response.json();

      const safeRevenue = result.revenueData || [
        { name: 'Week 1', revenue: 0 }, { name: 'Week 2', revenue: 150 },
        { name: 'Week 3', revenue: 450 }, { name: 'Week 4', revenue: 900 }
      ];

      setData(prev => ({
        ...prev,
        ...result,
        revenueData: safeRevenue,
        settings: { ...prev.settings, ...result.settings },
        workflowConfig: result.workflowConfig || prev.workflowConfig // Load from DB if exists
      }));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load Master DB", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  // --- NEW PROJECT HANDLERS ---
  const handleCopyLink = (username) => {
    if (!username) return alert("User hasn't set a username yet!");
    const url = `${window.location.origin}/p/${username}`;
    navigator.clipboard.writeText(url);
    alert(`🔗 Link copied: ${url}`);
  };

  const handleSetDomain = async (projectId, currentDomain) => {
    const newDomain = prompt("Enter custom domain (e.g., www.mywebsite.com):", currentDomain || "");
    if (newDomain === null) return; // User clicked cancel

    try {
      await fetch(`http://localhost:5001/api/owner/projects/${projectId}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ customDomain: newDomain })
      });
      fetchDashboard(); // Refresh data
    } catch (err) {
      alert("Failed to update domain");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("🚨 Delete this project permanently? This cannot be undone.")) return;
    try {
      await fetch(`http://localhost:5001/api/owner/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchDashboard(); // Refresh data
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const handleThemeUpload = async (e) => {
    e.preventDefault();

    // 1. Get the file
    const fileInput = e.target.themeFile;
    const file = fileInput.files[0];

    if (!file) return alert("Please select a .jsx file to upload.");
    if (!file.name.endsWith('.jsx')) return alert("Only .jsx files are allowed.");

    // 2. Pack everything (File + Text) into a FormData object
    const formData = new FormData();
    formData.append('themeFile', file);
    formData.append('name', e.target.name.value);
    formData.append('category', e.target.category.value);
    formData.append('isPremium', e.target.isPremium.checked);
    formData.append('supportsVideoBg', e.target.supportsVideoBg.checked);

    try {
      // 3. Send it to the server
      const response = await fetch('http://localhost:5001/api/owner/upload-theme', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          // ⚠️ DO NOT set Content-Type here! The browser does it automatically for FormData.
        },
        body: formData
      });

      if (response.ok) {
        alert("🚀 SYSTEM_UPDATE: New 3D Theme Injected into Core!");
        setShowThemeModal(false);
        fetchDashboard(); // Refresh UI
      } else {
        alert("Upload failed on the server.");
      }
    } catch (err) {
      alert("Infection failed: Could not write to src/themes. Is the server running?");
    }
  };

  // ==========================================
  // 🧩 DYNAMIC WORKFLOW INTERACTIVE HANDLERS
  // ==========================================
  const setWorkflowConfig = (newConfig) => {
    setData(prev => ({ ...prev, workflowConfig: newConfig }));
  };

  // Phases
  const handleAddPhase = () => {
    const phaseName = prompt("Enter new Phase name (e.g., Phase 5: Post-Launch):");
    if (!phaseName) return;
    setWorkflowConfig([...data.workflowConfig, { phase: phaseName, steps: [] }]);
  };

  const handleEditPhase = (pIndex) => {
    const newName = prompt("Edit Phase name:", data.workflowConfig[pIndex].phase);
    if (!newName) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].phase = newName;
    setWorkflowConfig(newConfig);
  };

  // Steps
  const handleAddStep = (pIndex) => {
    const stepTitle = prompt("Enter Step title (e.g., Email Automation):");
    if (!stepTitle) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].steps.push({ id: `step_${Date.now()}`, title: stepTitle, description: 'New custom step.', fields: [] });
    setWorkflowConfig(newConfig);
  };

  const handleEditStep = (pIndex, sIndex) => {
    const stepTitle = prompt("Edit Step title:", data.workflowConfig[pIndex].steps[sIndex].title);
    if (!stepTitle) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].steps[sIndex].title = stepTitle;
    setWorkflowConfig(newConfig);
  };

  const handleDeleteStep = (pIndex, sIndex) => {
    if (!window.confirm("Are you sure you want to delete this Step?")) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].steps.splice(sIndex, 1);
    setWorkflowConfig(newConfig);
  };

  // Fields
  const handleAddField = (pIndex, sIndex) => {
    const fieldName = prompt("Enter new Input Field name (e.g., Facebook Pixel ID):");
    if (!fieldName) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].steps[sIndex].fields.push(fieldName);
    setWorkflowConfig(newConfig);
  };

  const handleDeleteField = (pIndex, sIndex, fIndex) => {
    if (!window.confirm("Remove this field from the User Dashboard?")) return;
    const newConfig = [...data.workflowConfig];
    newConfig[pIndex].steps[sIndex].fields.splice(fIndex, 1);
    setWorkflowConfig(newConfig);
  };

  // Save to DB
  const handleSaveWorkflowToDB = async () => {
    try {
      await fetch('http://localhost:5001/api/owner/workflow', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ workflowConfig: data.workflowConfig })
      });
      alert("🚀 Workflow Engine Saved Successfully! Users will now see these changes in their dashboard.");
    } catch (err) {
      alert("Error connecting to backend database. Are you sure your backend supports /api/owner/workflow?");
    }
  };


  const menuItems = [
    { id: 'analytics', icon: <LayoutDashboard size={18} />, label: 'Analytics' },
    { id: 'users', icon: <Users size={18} />, label: 'User Hub' },
    { id: 'projects', icon: <Globe size={18} />, label: 'Project Hub' },
    { id: 'workflow', icon: <ListPlus size={18} />, label: 'Workflow Builder' },
    { id: 'themes', icon: <Palette size={18} />, label: 'Theme Engine' },
    { id: 'subscriptions', icon: <CreditCard size={18} />, label: 'Billing' },
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

      {/* 🔴 LEFT SIDEBAR */}
      <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">
        <div className="p-8 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-50" />
          <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-widest"><ShieldAlert className="text-[#ff003c]" size={28} /> 3D UNIVERSE</h1>
          <p className="text-[10px] text-[#ff003c] font-mono mt-2 uppercase tracking-[0.3em]">Owner CMS</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeTab === item.id ? 'text-white bg-white/5' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}`}>
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

      {/* 🔴 MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative h-screen overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#ff003c] opacity-[0.03] blur-[120px] pointer-events-none" />

        {/* TOP HEADER */}
        <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
          <h2 className="text-3xl font-bold text-white capitalize tracking-wide">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <Activity size={12} className="animate-pulse" /> DATABASE SECURE
            </div>
          </div>
        </header>

        {/* DYNAMIC TAB CONTENT */}
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

            {/* 🌐 PROJECT HUB MODULE */}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><Globe className="text-[#ff003c]" /> User Landing Pages</h3>
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-xs text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="p-4">Project / Owner</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Custom Domain</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {data.projects && data.projects.length > 0 ? (
                        data.projects.map((project) => (
                          <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">{project.fullName || "Untitled Project"}</div>
                              <div className="text-xs text-slate-500 mt-1">@{project.username || 'no-username'}</div>
                            </td>
                            <td className="p-4">
                              <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Active</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className={project.customDomain ? "text-cyan-400 font-mono text-sm" : "text-slate-600 text-sm italic"}>
                                  {project.customDomain || 'Not Configured'}
                                </span>
                                <button onClick={() => handleSetDomain(project._id, project.customDomain)} className="text-slate-500 hover:text-white transition-colors bg-black/50 p-1.5 rounded-md border border-white/10">
                                  <Edit size={12} />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-right flex justify-end gap-2">
                              <button onClick={() => handleCopyLink(project.username)} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20" title="Copy Public Link">
                                <Globe size={14} /> Link
                              </button>
                              <button onClick={() => handleDeleteProject(project._id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20 transition-colors" title="Delete Project">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-10 text-center text-slate-500">No published projects found in the database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* 🧩 NEW: DYNAMIC WORKFLOW & FORM BUILDER MODULE */}
            {activeTab === 'workflow' && (
              <motion.div key="workflow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex justify-between items-center bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                  <div>
                    <h3 className="text-white font-bold text-xl flex items-center gap-2"><Layers className="text-[#ff003c]" /> User Form & Workflow Engine</h3>
                    <p className="text-slate-400 text-sm mt-1">Dynamically manage the Sections, Steps, and Text Fields inside the user's Page Builder.</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={handleAddPhase} className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-xl text-sm font-bold border border-white/10 flex items-center gap-2 transition-all">
                      <PlusCircle size={18} /> Add Phase
                    </button>
                    <button onClick={handleSaveWorkflowToDB} className="bg-gradient-to-r from-[#ff003c] to-red-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,0,60,0.4)] flex items-center gap-2 transition-all hover:scale-105">
                      <Save size={18} /> Save & Deploy Workflow
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {data.workflowConfig?.map((phaseObj, pIndex) => (
                    <div key={pIndex} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl">

                      {/* Phase Header */}
                      <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
                        <h4 className="text-[#ff003c] font-black uppercase tracking-widest text-sm">{phaseObj.phase}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPhase(pIndex)} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"><Edit size={12} /> Edit Name</button>
                          <button onClick={() => handleAddStep(pIndex)} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"><PlusCircle size={12} /> Add Step</button>
                        </div>
                      </div>

                      {/* Steps inside Phase */}
                      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {phaseObj.steps.map((step, sIndex) => (
                          <div key={sIndex} className="bg-black/50 border border-white/10 p-5 rounded-xl hover:border-white/20 transition-colors relative group">

                            {/* Step Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditStep(pIndex, sIndex)} className="text-blue-400 hover:text-blue-300 bg-blue-400/10 p-1.5 rounded"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteStep(pIndex, sIndex)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded"><Trash2 size={14} /></button>
                            </div>

                            <h5 className="text-white font-bold text-lg mb-1 pr-16">{step.title}</h5>
                            <p className="text-xs text-slate-400 mb-4">{step.description}</p>

                            {/* Fields Configuration */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <h6 className="text-[10px] text-slate-500 uppercase font-bold mb-2 flex items-center gap-1"><Type size={10} /> Input Fields Displayed</h6>
                              <div className="flex flex-wrap gap-2">
                                {step.fields.map((field, fIndex) => (
                                  <span key={fIndex} className="bg-black/80 border border-white/10 text-slate-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                                    {field}
                                    <button onClick={() => handleDeleteField(pIndex, sIndex, fIndex)} className="text-red-500/50 hover:text-red-500 ml-1 transition-colors">×</button>
                                  </span>
                                ))}
                                <button onClick={() => handleAddField(pIndex, sIndex)} className="bg-[#ff003c]/10 border border-[#ff003c]/30 text-[#ff003c] text-xs px-2 py-1 rounded hover:bg-[#ff003c]/20 transition-colors">+ Add Field</button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 🎨 THEME ENGINE MODULE */}
            {activeTab === 'themes' && (
              <motion.div key="themes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <div className="flex justify-between items-center bg-black/40 border border-white/10 p-6 rounded-2xl backdrop-blur-xl">
                  <div>
                    <h3 className="text-white font-bold text-xl">Theme Database</h3>
                    <p className="text-slate-400 text-sm">Manage portfolio templates and video background support.</p>
                  </div>
                  <button onClick={() => setShowThemeModal(true)} className="bg-[#ff003c] hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(255,0,60,0.4)] flex items-center gap-2 transition-all">
                    <UploadCloud size={18} /> Add / Update Theme
                  </button>
                </div>

                {showThemeModal && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-[#ff003c]/30 rounded-2xl p-6 w-full max-w-md">
                      <h3 className="text-white font-bold text-xl mb-4">Upload/Edit Theme</h3>

                      <form onSubmit={handleThemeUpload} className="space-y-4">

                        <input type="text" name="name" placeholder="Theme Name (e.g., The Tech-Nexus)" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[#ff003c]" required />

                        {/* 🚀 THE NEW DYNAMIC CATEGORY DROPDOWN */}
                        <div className="flex gap-2">
                          <select
                            name="category"
                            className="flex-1 bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[#ff003c] outline-none cursor-pointer"
                            required
                            defaultValue=""
                          >
                            <option value="" disabled>Select a Category...</option>
                            {categories.map((cat, i) => (
                              <option key={i} value={cat} className="bg-slate-900 text-white">
                                {cat}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={handleAddNewCategory}
                            className="px-4 bg-[#ff003c]/10 hover:bg-[#ff003c]/20 text-[#ff003c] rounded-lg text-sm font-bold border border-[#ff003c]/30 transition-colors whitespace-nowrap"
                          >
                            + Add New
                          </button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded p-3">
                          <label className="text-xs text-slate-400 block mb-2 uppercase font-bold">Select Theme File (.jsx)</label>
                          <input type="file" name="themeFile" accept=".jsx" className="text-white text-sm w-full" required />
                        </div>

                        <label className="flex items-center gap-3 text-white cursor-pointer"><input type="checkbox" name="isPremium" /> Requires PRO Subscription</label>
                        <label className="flex items-center gap-3 text-white cursor-pointer"><input type="checkbox" name="supportsVideoBg" defaultChecked /> Enable Video Background</label>

                        <div className="flex justify-end gap-2 mt-6">
                          <button type="button" onClick={() => setShowThemeModal(false)} className="px-4 py-2 text-slate-400">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-[#ff003c] text-white font-bold rounded shadow-[0_0_15px_rgba(255,0,60,0.4)]">Upload Theme</button>
                        </div>
                      </form>

                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group">
                    <div className="h-40 bg-gradient-to-br from-slate-800 to-black relative flex items-center justify-center">
                      <Palette size={48} className="text-white/20 group-hover:scale-110 transition-transform" />
                      <span className="absolute top-3 right-3 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/50 text-[10px] font-bold px-2 py-1 rounded">PREMIUM</span>
                      <span className="absolute top-3 left-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"><Video size={10} /> VIDEO BG</span>
                    </div>
                    <div className="p-5">
                      <h4 className="text-white font-bold text-lg mb-1">Cyber Neon</h4>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg text-xs font-bold transition-colors">Edit Metadata</button>
                        <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ⚙️ GLOBAL CONFIG MODULE */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 gap-8">

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-[#ff003c]" /> Core Configuration</h3>
                  <form className="space-y-4">
                    <div><label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">System Identity</label><input type="text" defaultValue="3D UNIVERSE" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div><h4 className="text-sm font-bold text-white">Maintenance Mode</h4></div>
                      <input type="checkbox" className="w-5 h-5 accent-[#ff003c]" />
                    </div>
                    <button type="submit" className="w-full py-4 rounded-xl text-white font-bold bg-[#ff003c] hover:scale-[1.02] transition-transform">COMMIT SETTINGS</button>
                  </form>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Globe className="text-[#ff003c]" /> Manage Homepage Sections</h3>
                  <p className="text-xs text-slate-400 mb-6">Toggle which sections appear on your public landing page.</p>
                  <div className="space-y-3">
                    {data.settings?.homepageSections?.map((section, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg">
                        <span className="text-white text-sm font-bold">{section}</span>
                        <div className="flex gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-500 cursor-pointer" />
                          <button className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    <button className="text-xs text-[#ff003c] font-bold">+ Add Custom Section</button>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl col-span-2">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Layout className="text-[#ff003c]" /> User Dashboard Layout Manager</h3>
                  <p className="text-xs text-slate-400 mb-6">Control exactly what your users see in their dashboard side-menu.</p>
                  <div className="grid grid-cols-3 gap-4">
                    {data.settings?.userDashboardTabs?.map((tab, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                        <span className="text-white text-sm font-bold">{tab}</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#ff003c] cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 💳 BILLING MODULE */}
            {activeTab === 'subscriptions' && (
              <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6">Stripe Subscription Management</h3>
                  <div className="text-slate-500 text-sm text-center py-10">Stripe API connection required.</div>
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