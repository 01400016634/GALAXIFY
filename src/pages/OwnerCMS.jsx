import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Palette, Megaphone,
  CreditCard, Settings, ShieldAlert, ShieldCheck, LogOut,
  Activity, Search, MoreVertical, UploadCloud,
  Edit, Trash2, DollarSign, TrendingUp, Eye, Image as ImageIcon,
  Globe, Layout, Video, Layers, PlusCircle, ListPlus, Type, Save,
  CheckCircle2, User, Menu, Crown, X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CountUp = ({ target, duration = 2000 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return <>{displayValue.toLocaleString()}</>;
};

const OwnerCMS = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // States for the Global Content Editor Modal
  const [editingSection, setEditingSection] = useState(null);
  const [tempContentData, setTempContentData] = useState([]);

  // MASTER THEMES REGISTRY
  const MASTER_THEMES = [
    { id: 'theme-1', name: 'Cyber Neon Mall', category: 'E-Commerce', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-pink-600/30 via-purple-950 to-black', element: 'neon-grid' },
    { id: 'theme-2', name: 'Space Market', category: 'E-Commerce', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-blue-900/40 via-slate-950 to-black', element: 'orbit-rings' },
    { id: 'theme-3', name: 'Golden Prestige', category: 'E-Commerce', premium: true, videoBg: true, previewClass: 'bg-gradient-to-br from-amber-600/20 via-stone-950 to-black', element: 'luxury-gems' },
    { id: 'theme-4', name: 'Cyber Lab', category: 'Digital Gadgets', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-cyan-600/30 via-zinc-950 to-black', element: 'matrix-nodes' },
    { id: 'theme-5', name: 'Tron Grid', category: 'Digital Gadgets', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-teal-600/30 via-emerald-950/40 to-black', element: 'vector-lines' },
    { id: 'theme-6', name: 'Portal Dimension', category: 'Digital Gadgets', premium: true, videoBg: true, previewClass: 'bg-gradient-to-br from-purple-900/40 via-indigo-950 to-black', element: 'vortex-core' },
    { id: 'theme-7', name: 'Skyline Estate', category: 'Real Estate', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-sky-900/30 via-slate-950 to-black', element: 'city-wireframe' },
    { id: 'theme-8', name: 'Dream Hall', category: 'Real Estate', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-violet-900/20 via-neutral-950 to-black', element: 'minimal-blocks' },
    { id: 'theme-9', name: 'Frozen Platinum', category: 'Real Estate', premium: true, videoBg: true, previewClass: 'bg-gradient-to-br from-blue-500/20 via-slate-950 to-black', element: 'crystal-shards' },
    { id: 'theme-10', name: 'Cosmic Library', category: 'Learning', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-fuchsia-900/30 via-purple-950 to-black', element: 'stars-orbit' },
    { id: 'theme-11', name: 'Ai Sphere', category: 'Learning', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-cyan-500/20 via-slate-950 to-black', element: 'neural-mesh' },
    { id: 'theme-12', name: 'Genetic Matrix', category: 'Learning', premium: true, videoBg: true, previewClass: 'bg-gradient-to-br from-emerald-500/20 via-stone-950 to-black', element: 'dna-helix' },
    { id: 'theme-13', name: 'Command Center', category: 'Agency', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-red-950/40 via-zinc-950 to-black', element: 'tactical-grid' },
    { id: 'theme-14', name: 'Crystal Vault', category: 'Agency', premium: false, videoBg: true, previewClass: 'bg-gradient-to-br from-indigo-500/20 via-slate-950 to-black', element: 'refractive-shapes' },
    { id: 'theme-15', name: 'Dark Matter', category: 'Agency', premium: true, videoBg: true, previewClass: 'bg-gradient-to-br from-purple-950 via-neutral-950 to-black', element: 'physics-cloud' }
  ];

  const [categories, setCategories] = useState(['E-Commerce', 'Digital Gadgets', 'Real Estate', 'Learning', 'Agency']);

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
      siteLogo: '',
      maintenanceMode: false,
      homepageSections: ['Features', 'Pricing', 'Themes', 'FAQ'],
      userDashboardTabs: ['Analytics', 'Pages', 'Editor', 'Inventory', 'Settings'],
      sectionContent: {
        FAQ: [
          { id: 1, k1: "Do I need 3D modeling experience?", k2: "No coding or design skills are needed. The engine auto-configures everything." },
          { id: 2, k1: "Can I connect a custom domain?", k2: "Yes, Pro users can point landing pages to any custom domain." }
        ],
        Features: [
          { id: 1, k1: "Instant Deployment", k2: "Push to edge network in milliseconds." }
        ]
      }
    },
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
    revenueData: [
      { name: 'Mon', users: 120, sales: 15, revenue: 450 },
      { name: 'Tue', users: 210, sales: 25, revenue: 750 },
      { name: 'Wed', users: 180, sales: 20, revenue: 600 },
      { name: 'Thu', users: 290, sales: 40, revenue: 1200 },
      { name: 'Fri', users: 350, sales: 55, revenue: 1650 },
      { name: 'Sat', users: 420, sales: 70, revenue: 2100 },
      { name: 'Sun', users: 500, sales: 90, revenue: 2700 }
    ]
  });

  const fetchDashboard = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/owner/dashboard?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      const result = await response.json();

      const activeThemesCount = MASTER_THEMES.length;
      const mostUsedTheme = result.metrics?.mostUsedTheme || 'Cyber Neon Mall';

      setData(prev => ({
        ...prev,
        ...result,
        revenueData: result.revenueData?.length > 0 ? result.revenueData : prev.revenueData,
        metrics: { ...result.metrics, mostUsedTheme, activeThemesCount },
        settings: { ...prev.settings, ...(result.settings || {}) },
        workflowConfig: result.workflowConfig || prev.workflowConfig
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
    await fetch(`/api/owner/users/${id}/plan`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: JSON.stringify({ plan: newPlan })
    });
    fetchDashboard();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user?")) return;
    await fetch(`/api/owner/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchDashboard();
  };

  const handleSetDomain = async (projectId, currentDomain) => {
    const newDomain = prompt("Enter custom domain (e.g., www.mywebsite.com):", currentDomain || "");
    if (newDomain === null) return;

    try {
      await fetch(`/api/owner/projects/${projectId}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ customDomain: newDomain })
      });
      fetchDashboard();
    } catch (err) {
      alert("Failed to update domain");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("🚨 Delete this project permanently? This cannot be undone.")) return;
    try {
      await fetch(`/api/owner/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchDashboard();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const handleThemeUpload = async (e) => {
    e.preventDefault();
    const fileInput = e.target.themeFile;
    const file = fileInput.files[0];

    if (!file) return alert("Please select a .jsx file to upload.");
    if (!file.name.endsWith('.jsx')) return alert("Only .jsx files are allowed.");

    const formData = new FormData();
    formData.append('themeFile', file);
    formData.append('name', e.target.name.value);
    formData.append('category', e.target.category.value);
    formData.append('isPremium', e.target.isPremium.checked);
    formData.append('supportsVideoBg', e.target.supportsVideoBg.checked);

    try {
      const response = await fetch('/api/owner/upload-theme', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
      });

      if (response.ok) {
        alert("🚀 SYSTEM_UPDATE: New 3D Theme Injected into Core!");
        setShowThemeModal(false);
        fetchDashboard();
      } else {
        alert("Upload failed on the server.");
      }
    } catch (err) {
      alert("Infection failed: Could not write to src/themes. Is the server running?");
    }
  };

  // WORKFLOW HANDLERS
  const setWorkflowConfig = (newConfig) => {
    setData(prev => ({ ...prev, workflowConfig: newConfig }));
  };

  // ... (Workflow Add/Edit Handlers remain the same)
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
  const handleSaveWorkflowToDB = async () => {
    try {
      await fetch('/api/owner/workflow', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: JSON.stringify({ workflowConfig: data.workflowConfig })
      });
      alert("🚀 Workflow Engine Saved Successfully!");
    } catch (err) {
      alert("Error connecting to backend database.");
    }
  };

  // 🚀 GLOBAL SETTINGS & LOGO HANDLERS
  const handleEditHomepageSection = (index, newText) => {
    const newSections = [...data.settings.homepageSections];
    newSections[index] = newText;
    setData(prev => ({ ...prev, settings: { ...prev.settings, homepageSections: newSections } }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => ({ ...prev, settings: { ...prev.settings, siteLogo: reader.result } }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔥 NEW FIX: Function to handle Image Uploads inside the Modal
  const handleItemImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newData = [...tempContentData];
        newData[index].image = reader.result; // Saves base64 string to the specific item
        setTempContentData(newData);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🚀 SAVE SETTINGS TO BACKEND
  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/owner/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ settings: data.settings })
      });

      if (response.ok) {
        alert("🚀 Settings and Logo saved successfully! They will now reflect on the main website.");
      } else {
        alert("Failed to save settings to the database.");
      }
    } catch (err) {
      alert("Error connecting to backend database to save settings.");
    }
  };

  // CONTENT EDITOR MODAL LOGIC (Works for ALL Sections)
  const openContentEditor = (sectionName) => {
    setEditingSection(sectionName);
    setTempContentData([...(data.settings.sectionContent?.[sectionName] || [])]);
  };

  const saveContentEdits = () => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        sectionContent: {
          ...prev.settings.sectionContent,
          [editingSection]: tempContentData
        }
      }
    }));
    setEditingSection(null);
    setTimeout(() => handleSaveSettings(), 500);
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

  // COMPUTED VARIABLES (Moved outside of JSX to prevent compilation crashes)
  const validPublishedProjects = data.projects?.filter(p => p.status === 'Published' || p.publicUrl || p.public_url || p.site_name || p.page_data?.status === 'Published') || [];

  const groupedProjects = validPublishedProjects.reduce((acc, project) => {
    const ownerName = project.username || project.userEmail || project.user_id || 'Unknown Owner';
    if (!acc[ownerName]) acc[ownerName] = [];
    acc[ownerName].push(project);
    return acc;
  }, {});

  const totalUsers = data.users?.length || 0;
  const proUsers = data.users?.filter(u => u.plan === 'pro' || u.plan === 'premium').length || 0;
  const freeUsers = totalUsers - proUsers;
  const totalRevenue = proUsers * 15;
  const totalThemes = typeof MASTER_THEMES !== 'undefined' ? MASTER_THEMES.length : 15;
  const activeThemes = data.metrics?.activeThemesCount || 0;

  const safeEditingSection = editingSection || '';
  const isFaq = safeEditingSection.toLowerCase() === 'faq' || safeEditingSection.toLowerCase() === 'faqs';
  const isPricing = safeEditingSection.toLowerCase() === 'pricing';
  const label1 = isFaq ? 'Question' : isPricing ? 'Plan Name' : 'Title';
  const label2 = isFaq ? 'Answer' : isPricing ? 'Price & Details' : 'Description';

  return (
    <div className="min-h-screen w-full bg-[#030303] text-slate-200 flex font-sans overflow-hidden selection:bg-[#ff003c]/30">

      {/* 🔴 LEFT SIDEBAR */}
      <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col relative z-20">

        {/* DYNAMIC LOGO & HEADER */}
        <div className="p-8 border-b border-white/5 relative overflow-hidden flex items-center gap-3">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent opacity-50" />

          {data.settings?.siteLogo ? (
            <img src={data.settings.siteLogo} alt="Site Logo" className="w-10 h-10 rounded-full object-cover border-2 border-[#ff003c]/50 shadow-[0_0_15px_rgba(255,0,60,0.3)] shrink-0" />
          ) : (
            <ShieldAlert className="text-[#ff003c] shrink-0" size={32} />
          )}

          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-widest truncate max-w-[150px]">{data.settings?.siteName || '3D UNIVERSE'}</h1>
            <p className="text-[9px] text-[#ff003c] font-mono mt-0.5 uppercase tracking-[0.2em]">Owner CMS</p>
          </div>
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

        <header className="px-10 py-6 border-b border-white/5 flex justify-between items-center bg-black/20 backdrop-blur-md z-10">
          <h2 className="text-3xl font-bold text-white capitalize tracking-wide">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-green-500 font-mono bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <Activity size={12} className="animate-pulse" /> DATABASE SECURE
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">

            {/* 📊 ANALYTICS MODULE */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 font-sans"
              >
                {/* 🚀 HEADER: Command Center */}
                <div className="flex justify-between items-center bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(255,0,60,0.05)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff003c] via-blue-500 to-transparent"></div>
                  <div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 flex items-center gap-3">
                      <ShieldCheck size={28} className="text-[#ff003c]" /> Owner Command Center
                    </h2>
                    <p className="text-gray-400 mt-1 font-mono text-sm tracking-widest uppercase">System Analytics & Live Telemetry</p>
                  </div>
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                    <span className="text-green-400 font-bold text-sm tracking-widest uppercase">System Online</span>
                  </div>
                </div>

                {/* 🚀 TOP ROW: Real Motion Circle Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Metric 1: Total Revenue (Green Rings) */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-green-500/50 transition-colors">
                    <h3 className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-6 z-10">Estimated Revenue</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-green-500/30 animate-[spin_4s_linear_infinite]"></div>
                      <div className="absolute inset-2 rounded-full border-b-2 border-r-2 border-green-400/40 animate-[spin_3s_linear_infinite_reverse]"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <DollarSign size={24} className="text-green-400 mb-1" />
                        <span className="text-3xl font-black text-white">
                          $<CountUp target={totalRevenue} />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 2: Total Users (Blue Rings) */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <h3 className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-6 z-10">Total Users</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500/40 animate-[spin_3s_linear_infinite]"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <Users size={24} className="text-blue-400 mb-1" />
                        <span className="text-3xl font-black text-white"><CountUp target={totalUsers} /></span>
                      </div>
                    </div>
                  </div>

                  {/* Metric 3: Active Themes */}
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#ff003c]/50 transition-colors">
                    <h3 className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-6 z-10">Active Themes</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ff003c]/30 animate-[spin_8s_linear_infinite]"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <Palette size={24} className="text-[#ff003c] mb-1" />
                        <span className="text-2xl font-black text-white">{activeThemes} / {totalThemes}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🚀 MIDDLE ROW: Database Splits (Free vs Pro) */}
                <div className="grid grid-cols-1 gap-8">
                  <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2"><Layers size={18} className="text-blue-400" /> User Database Tier Split</h3>
                      <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-mono text-gray-300">Total: {totalUsers.toLocaleString()}</span>
                    </div>

                    <div className="space-y-4">
                      {/* Interactive Progress Bar */}
                      <div className="h-4 w-full bg-black rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-gray-600 transition-all duration-1000" style={{ width: `${totalUsers > 0 ? (freeUsers / totalUsers) * 100 : 0}%` }}></div>
                        <div className="h-full bg-gradient-to-r from-[#ff003c] to-pink-500 relative transition-all duration-1000" style={{ width: `${totalUsers > 0 ? (proUsers / totalUsers) * 100 : 0}%` }}>
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center pt-2">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                          <span className="text-xs text-gray-500 uppercase tracking-widest block mb-1">Free Tier</span>
                          <span className="text-2xl font-bold text-gray-300">{freeUsers.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#ff003c]/10 p-4 rounded-xl border border-[#ff003c]/20 hover:bg-[#ff003c]/20 transition-colors">
                          <span className="text-xs text-[#ff003c] uppercase tracking-widest block mb-1 flex items-center justify-center gap-1"><CreditCard size={12} /> Premium Subs</span>
                          <span className="text-2xl font-black text-[#ff003c]">{proUsers.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🚀 BOTTOM ROW: LIVE ANALYTICS GRAPH */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl w-full">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <Activity className="text-[#ff003c]" /> Live System Performance (7 Days)
                      </h3>
                      <p className="text-sm text-gray-500 font-mono">Revenue and user acquisition matrix.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ff003c]"></div><span className="text-xs text-gray-400 uppercase font-bold">Revenue</span></div>
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-400 uppercase font-bold">Users</span></div>
                    </div>
                  </div>

                  <div className="h-[350px] w-full" key="analytics-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff003c" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff003c" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                        <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontFamily: 'monospace' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #ffffff20', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                          itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                          labelStyle={{ color: '#888', marginBottom: '4px', textTransform: 'uppercase', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#ff003c" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        <Area type="monotone" dataKey="users" name="Active Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
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
                  <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2"><Globe className="text-[#ff003c]" /> User Landing Pages (Published Only)</h3>
                  <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-xs text-slate-400 uppercase tracking-widest">
                      <tr>
                        <th className="p-4">Project Name</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Custom Domain</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.keys(groupedProjects).length > 0 ? (
                        Object.entries(groupedProjects).map(([owner, projects]) => (
                          <React.Fragment key={owner}>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                              <td colSpan="4" className="p-3 text-[#ff003c] font-bold text-xs uppercase tracking-widest bg-black/40">
                                <span className="flex items-center gap-2"><User size={14} /> Owner: {owner}</span>
                              </td>
                            </tr>
                            {projects.map(project => {
                              const projectName = project.page_data?.setup?.name || project.fullName || project.site_name || "Untitled Project";
                              const previewUrl = project.publicUrl || project.public_url || `/3DUNIVERSE/${project.site_name || project.username}`;

                              return (
                                <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                                  <td className="p-4">
                                    <div className="font-bold text-white text-sm">{projectName}</div>
                                  </td>
                                  <td className="p-4">
                                    <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Published</span>
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
                                    <button onClick={() => window.open(previewUrl, '_blank')} className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs bg-blue-400/10 px-3 py-1.5 rounded-lg border border-blue-400/20" title="Preview Public Link">
                                      <Eye size={14} /> Preview
                                    </button>
                                    <button onClick={() => handleDeleteProject(project._id)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded-lg border border-red-500/20 transition-colors" title="Delete Project">
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </React.Fragment>
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

            {/* 🧩 WORKFLOW BUILDER MODULE */}
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
                      <Save size={18} /> Save & Deploy
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {data.workflowConfig?.map((phaseObj, pIndex) => (
                    <div key={pIndex} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                      <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
                        <h4 className="text-[#ff003c] font-black uppercase tracking-widest text-sm">{phaseObj.phase}</h4>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditPhase(pIndex)} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"><Edit size={12} /> Edit Name</button>
                          <button onClick={() => handleAddStep(pIndex)} className="text-slate-400 hover:text-white flex items-center gap-1 text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 transition-colors"><PlusCircle size={12} /> Add Step</button>
                        </div>
                      </div>
                      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {phaseObj.steps.map((step, sIndex) => (
                          <div key={sIndex} className="bg-black/50 border border-white/10 p-5 rounded-xl hover:border-white/20 transition-colors relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditStep(pIndex, sIndex)} className="text-blue-400 hover:text-blue-300 bg-blue-400/10 p-1.5 rounded"><Edit size={14} /></button>
                              <button onClick={() => handleDeleteStep(pIndex, sIndex)} className="text-red-500 hover:text-red-400 bg-red-500/10 p-1.5 rounded"><Trash2 size={14} /></button>
                            </div>
                            <h5 className="text-white font-bold text-lg mb-1 pr-16">{step.title}</h5>
                            <p className="text-xs text-slate-400 mb-4">{step.description}</p>
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
              <motion.div key="themes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
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
                        <div className="flex gap-2">
                          <select name="category" className="flex-1 bg-white/5 border border-white/10 rounded p-3 text-white focus:border-[#ff003c] outline-none cursor-pointer" required defaultValue="">
                            <option value="" disabled>Select a Category...</option>
                            {categories.map((cat, i) => <option key={i} value={cat} className="bg-slate-900 text-white">{cat}</option>)}
                          </select>
                          <button type="button" onClick={handleAddNewCategory} className="px-4 bg-[#ff003c]/10 hover:bg-[#ff003c]/20 text-[#ff003c] rounded-lg text-sm font-bold border border-[#ff003c]/30 transition-colors whitespace-nowrap">+ Add New</button>
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

                <div className="space-y-12">
                  {categories.map((catName) => {
                    // 🔥 SYNCHRONIZATION FIX: Merge hardcoded themes with database themes
                    const allThemes = [...MASTER_THEMES, ...(data.themes || [])];
                    const matchedThemes = allThemes.filter(t => t.category === catName);

                    return (
                      <div key={catName} className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ff003c] font-black bg-[#ff003c]/10 border border-[#ff003c]/20 px-3 py-1 rounded">{catName}</span>
                          <span className="text-xs font-mono text-slate-500">({matchedThemes.length} Nodes Configured)</span>
                          <div className="flex-1 h-[1px] bg-gradient-to-r from-white/10 to-transparent ml-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {matchedThemes.map((theme) => (
                            <div key={theme.id} className="bg-[#0b0b0d] border border-white/10 rounded-2xl overflow-hidden group flex flex-col justify-between shadow-xl">

                              {/* 🔥 IMAGE RENDERING FIX: Checks for custom image, falls back to palette icon */}
                              <div className={`h-40 ${theme.previewClass} relative flex items-center justify-center border-b border-white/5 overflow-hidden`}>
                                {theme.image ? (
                                  <img src={theme.image} alt={theme.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Palette size={36} className="text-white/10 group-hover:text-white/30 transition-colors relative z-10" />
                                )}
                                <span className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-white/10">{theme.id}</span>
                                {theme.premium && <span className="absolute top-3 right-3 bg-[#ff003c]/20 text-[#ff003c] border border-[#ff003c]/50 text-[10px] font-bold px-2 py-1 rounded tracking-wide shadow-md">PRO</span>}
                              </div>

                              <div className="p-5 space-y-4">
                                <div>
                                  <h4 className="text-white font-bold text-lg leading-tight group-hover:text-[#ff003c] transition-colors">{theme.name}</h4>
                                  <p className="text-[11px] font-mono text-slate-500 uppercase mt-0.5 tracking-wider">Operational Live Environment</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ⚙️ GLOBAL CONFIG MODULE */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-2 gap-8">

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Settings className="text-[#ff003c]" /> Core Configuration</h3>
                  <form className="space-y-4">

                    {/* 🚀 BRAND LOGO UPLOADER */}
                    <div className="flex items-center gap-4 border border-white/10 p-4 rounded-xl bg-white/5">
                      <div className="w-16 h-16 rounded-full bg-black border border-[#ff003c]/50 flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(255,0,60,0.2)]">
                        {data.settings.siteLogo ? <img src={data.settings.siteLogo} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-slate-500" />}
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Upload Brand Logo (PNG/JPEG)</label>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="text-xs text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#ff003c]/10 file:text-[#ff003c] hover:file:bg-[#ff003c]/20 cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">System Identity (Website Name)</label>
                      <input type="text" value={data.settings?.siteName || ''} onChange={(e) => setData(prev => ({ ...prev, settings: { ...prev.settings, siteName: e.target.value } }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#ff003c] outline-none" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase font-bold mb-2 block">Website Title / Tagline</label>
                      <input type="text" value={data.settings?.heroTagline || ''} onChange={(e) => setData(prev => ({ ...prev, settings: { ...prev.settings, heroTagline: e.target.value } }))} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#ff003c] outline-none" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl mt-4">
                      <div><h4 className="text-sm font-bold text-white">Maintenance Mode</h4></div>
                      <input
                        type="checkbox"
                        checked={data.settings?.maintenanceMode || false}
                        onChange={(e) => setData(prev => ({ ...prev, settings: { ...prev.settings, maintenanceMode: e.target.checked } }))}
                        className="w-5 h-5 accent-[#ff003c]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="w-full py-4 rounded-xl text-white font-bold bg-[#ff003c] hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,0,60,0.4)] flex items-center justify-center gap-2"
                    >
                      <Save size={18} /> COMMIT SETTINGS & SYNC TO WEBSITE
                    </button>
                  </form>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Globe className="text-[#ff003c]" /> Manage Homepage Sections</h3>
                  <p className="text-xs text-slate-400 mb-6">Edit section names, toggle visibility, and configure internal content matrices.</p>
                  <div className="space-y-3">
                    {data.settings?.homepageSections?.map((section, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-lg gap-3 hover:border-white/30 transition-colors">
                        <input
                          type="text"
                          value={section}
                          onChange={(e) => handleEditHomepageSection(idx, e.target.value)}
                          className="flex-1 bg-transparent text-white text-sm font-bold border-none outline-none focus:ring-1 focus:ring-[#ff003c]/50 px-3 py-1.5 rounded transition-all"
                        />
                        <div className="flex gap-2 shrink-0 px-2 items-center">
                          <button onClick={() => openContentEditor(section)} className="text-cyan-400 hover:text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-cyan-400/10 px-2 py-1.5 rounded border border-cyan-400/20 mr-2">
                            <Edit size={12} /> Edit Content
                          </button>
                          <input type="checkbox" defaultChecked className="w-4 h-4 accent-green-500 cursor-pointer" />
                          <button className="text-red-500 hover:text-red-400 p-1"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                    <button className="text-xs text-[#ff003c] font-bold mt-2 hover:underline">+ Add Custom Section</button>
                  </div>
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl col-span-2">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Layout className="text-[#ff003c]" /> User Dashboard Layout Manager</h3>
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

      {/* 🚀 GLOBAL CONTENT EDITOR MODAL */}
      {editingSection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0c] border border-[#ff003c]/40 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit size={18} className="text-[#ff003c]" /> Editing Content: {editingSection}
              </h3>
              <button onClick={() => setEditingSection(null)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {tempContentData.map((item, idx) => (
                <div key={item.id || idx} className="bg-white/5 border border-white/10 rounded-xl p-4 relative group">
                  <button onClick={() => setTempContentData(tempContentData.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-3 pr-8">
                    {/* Text Inputs */}
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{label1}</label>
                      <input type="text" value={item.k1 || ''} onChange={(e) => {
                        const newData = [...tempContentData];
                        newData[idx].k1 = e.target.value;
                        setTempContentData(newData);
                      }} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-[#ff003c]" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">{label2}</label>
                      <textarea rows="2" value={item.k2 || ''} onChange={(e) => {
                        const newData = [...tempContentData];
                        newData[idx].k2 = e.target.value;
                        setTempContentData(newData);
                      }} className="w-full bg-black/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:border-[#ff003c] resize-none" />
                    </div>

                    {/* 🔥 NEW FEATURE: ITEM IMAGE UPLOADER */}
                    <div className="mt-3">
                      <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Slide Image / Photo</label>
                      <div className="flex items-center gap-4 bg-black/50 border border-white/10 p-3 rounded-lg">
                        {item.image ? (
                          <div className="w-16 h-16 rounded bg-black/80 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                            <img src={item.image} alt="Slide Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded bg-black/80 flex items-center justify-center shrink-0 border border-white/10 border-dashed text-slate-600">
                            <ImageIcon size={20} />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={(e) => handleItemImageUpload(e, idx)}
                            className="text-xs text-white file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#ff003c]/10 file:text-[#ff003c] hover:file:bg-[#ff003c]/20 cursor-pointer w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setTempContentData([...tempContentData, { id: Date.now(), k1: '', k2: '', image: '' }])} className="w-full py-3 rounded-xl border border-dashed border-white/20 text-slate-400 font-bold hover:text-white hover:border-[#ff003c] hover:bg-[#ff003c]/10 transition-colors flex items-center justify-center gap-2 text-sm">
                <PlusCircle size={16} /> Add New Item to {editingSection}
              </button>
            </div>

            <div className="p-5 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button onClick={() => setEditingSection(null)} className="px-5 py-2 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={saveContentEdits} className="px-6 py-2 bg-[#ff003c] text-white font-bold rounded-xl shadow-[0_0_15px_rgba(255,0,60,0.4)] flex items-center gap-2 hover:scale-[1.02] transition-transform">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerCMS;