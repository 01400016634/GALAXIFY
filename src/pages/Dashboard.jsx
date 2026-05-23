import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import {
  Facebook, Phone, Mail, MessageCircle, BarChart3, Globe, Layout, PackageSearch, Settings,
  ChevronUp, ChevronDown, LayoutTemplate, Trash2, CheckCircle2, Eye, Send, Lock,
  Plus, Upload, Image as ImageIcon, MapPin, DollarSign, TrendingUp, ShoppingBag,
  Linkedin, Twitter, Youtube, Github, ShieldCheck, Map, CreditCard, Box,
  AlignLeft, Play, Wand2, Smartphone, Monitor, Type, Palette, Video, Share2, Search,
  Zap, Layers, Sparkles, Sliders, Copy, ChevronsUpDown, ArrowRight, ArrowLeft, Users, Activity,
  ArrowUpRight, Instagram, MessageSquare, FileText, DownloadCloud, Fingerprint, User, Crown, ExternalLink,
  LayoutDashboard, PlusCircle, Edit, LogOut
} from 'lucide-react';

const SOCIAL_PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500', hex: '#1877F2' },
  { id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'text-green-500', hex: '#25D366' },
  { id: 'gmail', name: 'Gmail', icon: Mail, color: 'text-red-500', hex: '#EA4335' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', hex: '#0A66C2' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-400', hex: '#1DA1F2' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600', hex: '#FF0000' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500', hex: '#E4405F' },
  { id: 'wechat', name: 'WeChat', icon: MessageSquare, color: 'text-emerald-500', hex: '#07C160' },
];

const CATEGORY_TEMPLATES = {
  'E-Commerce': [
    { title: 'Hero Section', content: { headline: '', subheadline: '', description: '' }, cta: { buttonText: '' } },
    { title: 'Product Showcase', customFields: { productName: '', price: '', description: '' }, cta: { buttonText: 'Buy Now' } },
    { title: 'Offer / Discount Section', content: { headline: 'Limited Offer', subheadline: '', description: '' }, cta: { buttonText: 'Claim' } },
    { title: 'Reviews Section', content: { headline: 'Customer Reviews' } },
    { title: 'CTA Section', content: { headline: 'Join Us' }, cta: { buttonText: 'Sign Up' } }
  ],
  'Digital Gadgets': [
    { title: 'Hero', content: { headline: '', subheadline: '' } },
    { title: 'Gadget Showcase', customFields: { productName: '', price: '', specs: '' }, cta: { buttonText: 'Buy Now' } },
    { title: 'Technical Specs', customFields: { processor: '', ram: '', storage: '', battery: '', display: '' } },
    { title: '3D Viewer Section', customFields: { modelUploadGLB: '' } },
    { title: 'Comparison Section', content: { headline: 'Comparison' } }
  ],
  'Real Estate': [
    { title: 'Hero', content: { headline: '' } },
    { title: 'Property Details', customFields: { propertyName: '', price: '', locationMapLink: '', bedrooms: '', bathrooms: '', area: '' } },
    { title: 'Amenities', customFields: { amenitiesArray: '' } },
    { title: 'Gallery', content: { headline: 'Photos' } },
    { title: 'Booking Section', cta: { buttonText: 'Contact Agent' } }
  ],
  'Learning Platform': [
    { title: 'Hero', content: { headline: '' } },
    { title: 'Course Details', customFields: { courseTitle: '', price: '', instructor: '' }, cta: { buttonText: 'Enroll Now' } },
    { title: 'Curriculum', customFields: { modulesArray: '' } },
    { title: 'Instructor', customFields: { instructorName: '', certificateToggle: 'Yes' } },
    { title: 'Pricing', cta: { buttonText: 'Enroll' } }
  ],
  'Agency / Service': [
    { title: 'Hero', content: { headline: '' } },
    { title: 'Service Details', customFields: { serviceName: '', price: '', details: '' }, cta: { buttonText: 'Book Service' } },
    { title: 'Case Studies', customFields: { resultMetrics: '' } },
    { title: 'Testimonials', customFields: { clientLogos: '' } },
    { title: 'Contact CTA', customFields: { contactEmail: '' } }
  ],
  'Portfolio': [
    { title: 'Hero', customFields: { name: '', title: '' } },
    { title: 'About', customFields: { bio: '', resumeLink: '', socialLinks: '' } },
    { title: 'Experience', customFields: { experienceData: '' } },
    { title: 'Projects', customFields: { projectsArray: '' } },
    { title: 'Skills', customFields: { techStack: '' } },
    { title: 'Training And Certification', customFields: { certificateList: '' } },
    { title: 'Research', customFields: { researchPapers: '' } },
    { title: 'Contact', content: { headline: 'Get in Touch' } }
  ]
};

const uploadFileToStorage = async (file) => {
  if (!file) return null;
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
    const filePath = `uploads/${Date.now()}_${safeName}`;
    const { data, error } = await supabase.storage.from('media').upload(filePath, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (err) {
    alert("Supabase Upload failed: " + err.message);
    return null;
  }
};

const INITIAL_PAGE_DATA = {
  setup: { name: '', goal: 'sales', audience: '', category: 'ecommerce', themeId: 'theme-1' },
  brand: { logo: '', name: '', tagline: '', aboutShort: '', colors: ['#06b6d4', '#000000'], font: 'Inter' },
  hero: { headline: '', subheadline: '', ctaText: '', ctaLink: '', bgType: 'particles' },
  blocks: [],
  theme: { navStyle: 'standard', contentWidth: 'boxed', animationIntensity: 50, particles: true, floating: true, mouseEffects: false, scrollEffects: false },
  ai: { tone: 'professional' },
  media: [],
  contact: { activeSocials: [], socialUrls: {} },
  seo: { title: '', description: '' },
  publish: { customDomain: '', visibility: 'public' }
};

const EDITOR_STEPS = [
  { id: 'setup', label: 'Project Setup', phase: 'Phase 1: Architecture', icon: LayoutTemplate },
  { id: 'brand', label: 'Brand Identity', phase: 'Phase 1: Architecture', icon: Palette },
  { id: 'category', label: 'Industry', phase: 'Phase 1: Architecture', icon: Layers },
  { id: 'hero', label: 'Hero Section', phase: 'Phase 2: Core Content', icon: ImageIcon },
  { id: 'blocks', label: 'Dynamic Blocks', phase: 'Phase 2: Core Content', icon: LayoutDashboard },
  { id: 'theme', label: '3D Theme', phase: 'Phase 3: Refinement', icon: Sparkles },
  { id: 'ai', label: 'AI Writer', phase: 'Phase 3: Refinement', icon: Zap },
  { id: 'media', label: 'Media Library', phase: 'Phase 3: Refinement', icon: Video },
  { id: 'contact', label: 'Socials', phase: 'Phase 4: Launch', icon: MessageCircle },
  { id: 'seo', label: 'SEO Config', phase: 'Phase 4: Launch', icon: Search },
  { id: 'publish', label: 'Deploy Live', phase: 'Phase 4: Launch', icon: Send }
];

const MENU_ITEMS = [
  { id: 'analytics', label: 'Dashboard Overview', icon: BarChart3 },
  { id: 'pages', label: 'Landing Pages', icon: Layout },
  { id: 'inventory', label: 'Inventory Manager', icon: Box },
  // 🚀 ADD THIS NEW LINE:
  { id: 'crm', label: 'Customer CRM', icon: Users },
  { id: 'settings', label: 'Account Settings', icon: Settings }
];

// 🚀 1. THE ADVANCED CRM COMPONENT
const OwnerCRM = ({ selectedProjectId, savedPages, setSelectedProjectId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selectedProjectId) return;
      const { data } = await supabase
        .from('client_requests')
        .select('*')
        .eq('site_name', selectedProjectId)
        .order('created_at', { ascending: false });
      if (data) setRequests(data);
    };
    fetchRequests();
  }, [selectedProjectId]);

  const updateStatus = async (id, newStatus) => {
    await supabase.from('client_requests').update({ status: newStatus }).eq('id', id);
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-24">
      {/* 🚀 RESPONSIVE CRM HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 gap-4 md:gap-5 shadow-lg">
        <div>
          <h2 className="text-lg md:text-2xl font-black text-white">Customer Orders & Bookings</h2>
          <p className="text-xs md:text-sm text-gray-400 mt-1">Manage incoming orders for your published landing pages.</p>
        </div>

        {/* Changed from items-center to flex-col on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full lg:w-auto bg-black/50 p-3 rounded-xl border border-white/10">
          <label className="text-xs sm:text-sm font-bold text-gray-400 whitespace-nowrap px-1">Filter by Page:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full sm:w-auto bg-black border border-white/20 rounded-lg px-3 py-2 text-white outline-none cursor-pointer focus:border-cyan-500 text-xs sm:text-sm"
          >
            {savedPages.map(p => <option key={p.id} value={p.id}>{p.setup?.name || 'Untitled Project'}</option>)}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="bg-black/40 p-5 md:p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-cyan-500/30 transition-colors">
            <div className="w-full md:w-auto">
              <p className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">
                {req.request_type} • {req.payload?.item || 'Item'}
              </p>
              <h4 className="text-white font-bold text-lg">{req.payload?.customer_name || 'Customer'}</h4>
              <p className="text-gray-400 text-sm mt-1">📧 {req.customer_email}</p>
              <p className="text-gray-400 text-sm">📞 {req.phone_number}</p>
              <p className="text-gray-500 text-xs mt-2 bg-black/50 p-2 rounded border border-white/5">📍 {req.delivery_address}</p>
            </div>

            <div className="w-full md:w-auto flex flex-col items-end gap-2">
              <div className="text-xl font-black text-green-400">${req.payload?.price || '0.00'}</div>
              <select
                value={req.status}
                onChange={(e) => updateStatus(req.id, e.target.value)}
                className={`w-full md:w-auto bg-black text-white px-4 py-2 rounded-lg border border-white/20 outline-none focus:border-cyan-500 font-bold text-sm transition-colors ${req.status === 'Completed' ? 'text-green-400 border-green-500/30' : ''}`}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Shipped / Completed</option>
              </select>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="p-8 text-center bg-black/20 rounded-2xl border border-white/5 border-dashed">
            <h3 className="text-xl font-bold text-gray-500 mb-2">No orders found</h3>
            <p className="text-gray-600 text-sm">Select a different project from the dropdown above, or wait for new customers to buy.</p>
          </div>
        )}
      </div>
    </div>
  );
};


export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userTier, setUserTier] = useState('free');
  const [activeTab, setActiveTab] = useState('analytics');
  const [modalCategory, setModalCategory] = useState('All');
  const [activeEditorStep, setActiveEditorStep] = useState('setup');
  const [syncStatus, setSyncStatus] = useState('Saved');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isPageTypeModalOpen, setIsPageTypeModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: '',
    company: '',
    avatar: ''
  });

  const [selectedProjectId, setSelectedProjectId] = useState('page-1');
  const [pageData, setPageData] = useState({ ...INITIAL_PAGE_DATA, id: `page-${Date.now()}` });
  const [savedPages, setSavedPages] = useState([
    { id: 'page-1', setup: { name: 'SaaS Launch' }, status: 'Draft', views: 0, convRate: '0%', revenue: 0 }
  ]);
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    // 1. Set basic profile info from Supabase
    const userName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '3D Universe User';
    const userAvatar = currentUser.user_metadata?.avatar_url || '';

    setUserProfile(prev => ({
      ...prev,
      name: userName,
      email: currentUser.email,
      avatar: userAvatar
    }));

    // 2. Fetch User Data, Portfolio, and Sync with MongoDB
    const fetchUserData = async () => {
      try {
        // A. Sync user to MongoDB (so they exist in your CMS)
        await fetch('/api/owner/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userName,
            email: currentUser.email,
            uid: currentUser.id
          })
        });

        // B. Fetch MongoDB Plan & Portfolio
        const mongoResponse = await fetch(`/api/user/portfolio/${currentUser.id}`);
        if (mongoResponse.ok) {
          const mongoData = await mongoResponse.json();

          // Set their plan tier safely inside the scope
          if (mongoData.user) {
            setUserTier(mongoData.user.plan === 'pro' || mongoData.user.plan === 'premium' ? 'pro' : 'free');
          }

          // Load MongoDB portfolio into editor form if it exists
          if (mongoData.portfolio) {
            setPageData(prev => ({ ...prev, ...mongoData.portfolio }));
          }
        }

        // C. THE FIX: Load Saved Pages from Supabase (Where you published them!)
        const { data: supabasePages, error: supabaseError } = await supabase
          .from('landing_pages')
          .select('*')
          .eq('user_id', currentUser.id);

        if (supabasePages && !supabaseError) {
          // Format the Supabase data so your UI understands it
          const formattedPages = supabasePages.map(page => ({
            id: page.id,        // Set the ID
            _id: page.id,       // Ensure _id exists so the delete button doesn't crash
            ...page.page_data,  // Unpack your saved layout data
            status: 'Published',
            publish: { publicUrl: page.public_url }
          }));

          setSavedPages(formattedPages); // This stops them from disappearing!
        }

      } catch (error) {
        console.error("Database connection failed:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // 🚀 2. FIXED PRO UPGRADE FUNCTION
  const handleBuyPro = async () => {
    if (!currentUser) return alert("Please log in to upgrade.");

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([
          {
            user_id: currentUser.id,
            site_name: '3d-universe-platform',
            request_type: 'Pro Upgrade',
            customer_email: currentUser.email,
            status: 'Pending',
            payload: { item: 'Pro User Upgrade', price: 15 }
          }
        ]);

      if (error) throw error;

      alert("🎉 Upgrade request sent! An admin will approve your PRO status shortly.");
      setUserTier('pro'); // Instantly updates UI so you can test PRO features

    } catch (error) {
      alert("Failed to process upgrade: " + error.message);
    }
  };

  useEffect(() => {
    if (activeTab !== 'editor') return;
    setSyncStatus('Syncing...');
    const timer = setTimeout(() => {
      setSyncStatus('Saved');
    }, 1500);
    return () => clearTimeout(timer);
  }, [pageData, activeTab]);

  const updateNestedData = (section, field, value) => {
    setPageData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handlePublish = async () => {
    console.log("Publishing Data:", pageData);
    if (!currentUser) {
      alert("Error: You must be logged in to your account to publish real changes.");
      return;
    }

    setSyncStatus('Publishing...');

    const rawBrandName = pageData.brand?.name || "untitled-project";
    const cleanUrlSlug = rawBrandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      const publicUrl = `${window.location.origin}/3DUNIVERSE/${cleanUrlSlug}`;

      let sanitizedData;
      try {
        sanitizedData = JSON.parse(JSON.stringify(pageData));
      } catch (e) {
        alert("Error reading data. Please ensure no invalid files are attached.");
        setSyncStatus('Saved');
        return;
      }

      const { error } = await supabase
        .from('landing_pages')
        .upsert({
          id: currentUser.id,
          user_id: currentUser.id,
          site_name: cleanUrlSlug,
          page_data: sanitizedData,
          public_url: publicUrl
        });

      if (error) throw error;

      setPageData(prev => ({ ...prev, status: 'Published', publish: { ...prev.publish, publicUrl } }));

      setSavedPages(prev => {
        const existingIdx = prev.findIndex(p => p.id === pageData.id);
        const updatedPage = { ...pageData, status: 'Published', publish: { ...pageData.publish, publicUrl } };
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = updatedPage;
          return updated;
        }
        return [...prev, updatedPage];
      });

      setSyncStatus('Published!');
      alert(`🚀 Success! Your Landing Page has been securely deployed via Supabase.\n\nOpening your new page now...`);

      window.open(publicUrl, '_blank');
      setActiveTab('pages');

    } catch (err) {
      console.error("Supabase Publish Error:", err);
      alert(`Deployment failed: ${err.message}`);
      setSyncStatus('Saved');
    }
  };

  const handlePreview = () => {
    if (!currentUser) {
      alert("Please log in to preview your live URL.");
      return;
    }

    const rawBrandName = pageData.brand?.name || "untitled-project";
    const cleanUrlSlug = rawBrandName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    localStorage.setItem('3duniverse_draft', JSON.stringify(pageData));

    const publicUrl = `${window.location.origin}/3DUNIVERSE/${cleanUrlSlug}?mode=preview`;
    window.open(publicUrl, '_blank');
  };

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out of 3D UNIVERSE?")) {
      try {
        await supabase.auth.signOut();
        window.location.href = '/'; // Redirects instantly to your login or landing homepage
      } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out cleanly. Please clear browser cache.");
      }
    }
  };

  const loadPageForEditing = (page) => {
    setPageData({ ...page });
    setActiveTab('editor');
    setActiveEditorStep('setup');
  };
  const handleDeleteProject = async (projectId) => {
    // 1. DEFENSIVE CHECK: Stop if no ID is found
    if (!projectId) {
      console.error("Delete cancelled: Project ID is missing.");
      alert("Error: Cannot delete project because the ID is missing.");
      return;
    }

    if (!window.confirm("Are you sure? This will permanently delete your project.")) return;

    try {
      const response = await fetch(`/api/user/project/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedPages(prevPages => prevPages.filter(page => page._id !== projectId));
        alert("Project deleted successfully.");
      } else {
        alert("Failed to delete project.");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const initNewPageProcess = () => {
    setIsPageTypeModalOpen(true);
  }

  const createNewPage = (category) => {
    setPageData({ ...INITIAL_PAGE_DATA, id: `page-${Date.now()}`, setup: { ...INITIAL_PAGE_DATA.setup, category }, blocks: [] });
    setIsPageTypeModalOpen(false);
    setActiveTab('editor');
    setActiveEditorStep('setup');
  }

  const currentStepIndex = EDITOR_STEPS.findIndex(s => s.id === activeEditorStep);
  const handleNextStep = () => {
    if (currentStepIndex < EDITOR_STEPS.length - 1) setActiveEditorStep(EDITOR_STEPS[currentStepIndex + 1].id);
  };
  const handlePrevStep = () => {
    if (currentStepIndex > 0) setActiveEditorStep(EDITOR_STEPS[currentStepIndex - 1].id);
  };

  // 🚀 CATEGORY MAPPING LOGIC
  const handleCategorySelect = (categoryName) => {
    const templateSections = CATEGORY_TEMPLATES[categoryName] || CATEGORY_TEMPLATES['E-Commerce'];

    const defaultSections = templateSections.map((section, index) => ({
      id: `sec_${Date.now()}_${index}`,
      title: section.title,
      collapsed: true,
      content: {
        headline: section.content?.headline || '',
        subheadline: section.content?.subheadline || '',
        description: section.content?.description || ''
      },
      customFields: section.customFields || {}, // Maps specific fields (Price, RAM, etc)
      media: { bgImage: '', heroImage: '', video: '' },
      cta: {
        buttonText: section.cta?.buttonText || '',
        buttonLink: section.cta?.buttonLink || '',
        secondaryText: section.cta?.secondaryText || '',
        secondaryLink: section.cta?.secondaryLink || ''
      },
      style: { animationType: 'fade-up', alignment: 'left', glowEffect: false, overlayStrength: '50%' }
    }));

    setPageData(prev => ({
      ...prev,
      setup: { ...prev.setup, category: categoryName },
      blocks: defaultSections
    }));


  };

  // 🚀 ADD CUSTOM SECTION LOGIC
  const handleAddCustomSection = () => {
    const newBlock = {
      id: `sec_${Date.now()}_custom`,
      title: 'New Custom Section',
      collapsed: false,
      content: { headline: '', subheadline: '', description: '' },
      customFields: {},
      media: { bgImage: '', heroImage: '', video: '' },
      cta: { buttonText: '', buttonLink: '', secondaryText: '', secondaryLink: '' },
      style: { animationType: 'fade-up', alignment: 'left', glowEffect: false, overlayStrength: '50%' }
    };
    setPageData(prev => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const handleUpdateBlockData = (blockId, category, field, value) => {
    setPageData(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          [category]: {
            ...(b[category] || {}),
            [field]: value
          }
        };
      })
    }));
  };

  const handleUpdateBlock = (blockId, field, value) => {
    setPageData(prev => ({ ...prev, blocks: prev.blocks.map(b => b.id === blockId ? { ...b, [field]: value } : b) }));
  };

  const handleMoveBlock = (index, direction) => {
    setPageData(prev => {
      const newBlocks = [...prev.blocks];
      if (index + direction < 0 || index + direction >= newBlocks.length) return prev;
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[index + direction];
      newBlocks[index + direction] = temp;
      return { ...prev, blocks: newBlocks };
    });
  };

  const handleDeleteBlock = (blockId) => {
    setPageData(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== blockId) }));
  };


  const renderAnalytics = () => {
    // 1. Safely attempt to find an active project
    const activeProject = savedPages.find(p => p.id === selectedProjectId) || savedPages[0];

    // 2. THE FIX: If there are NO projects, show a nice empty state instead of crashing!
    if (!activeProject) {
      return (
        <div className="p-8 h-full overflow-y-auto custom-scrollbar space-y-8">
          <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <div>
              <h2 className="text-2xl font-black text-white">Overview & Analytics</h2>
              <p className="text-gray-400">Viewing real-time performance for specific projects.</p>
            </div>
            <button onClick={initNewPageProcess} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Plus size={18} /> New Page
            </button>
          </div>
          <div className="h-64 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-500 flex-col gap-3 bg-black/20">
            <Layout size={32} className="opacity-50" />
            <p className="font-medium">No active projects found. Create a new page to view analytics!</p>
          </div>
        </div>
      );
    }

    // 3. If we DO have a project, it's now 100% safe to read .views and do the math
    const visitorMultiplier = activeProject.views > 1000 ? 1 : 0.1;
    return (
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 h-full overflow-y-auto custom-scrollbar">
        {/* Make header stack on mobile */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">Overview & Analytics</h2>
            <p className="text-xs md:text-sm text-gray-400">Viewing real-time performance for specific projects.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-xs sm:text-sm font-bold text-gray-400">Select Project:</label>
              <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full sm:w-auto bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none cursor-pointer text-sm">
                {savedPages.map(p => <option key={p.id} value={p.id}>{p.setup?.name || 'Untitled'}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { title: 'Total Revenue', value: `$${(activeProject.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
            { title: 'Active Visitors', value: Math.floor(120 * visitorMultiplier), icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { title: 'Avg. Conversion', value: activeProject.convRate || '0%', icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { title: 'Page Views', value: activeProject.views?.toLocaleString() || 0, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 md:mb-4">
                <div className={`p-2 md:p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={20} md:size={24} /></div>
                <span className="text-[10px] md:text-xs font-bold text-green-400 flex items-center gap-1"><ArrowUpRight size={12} /> +9.4%</span>
              </div>
              <div>
                <h4 className="text-xl md:text-3xl font-black text-white">{stat.value}</h4>
                <p className="text-[10px] md:text-sm text-gray-400 font-medium">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin size={18} className="text-cyan-400" /> Live Visitor Map ({activeProject.setup?.name})</h3>
            <div className="relative flex-1 min-h-[300px] bg-[#0A0A0E] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)]"></div>
              <Map className="w-full h-full text-white/5 absolute p-8" />
              {activeProject.views > 0 ? (
                <>
                  <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-cyan-500 rounded-full animate-ping"></div>
                  <div className="absolute top-[45%] left-[60%] w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <div className="absolute top-[60%] left-[40%] w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute top-[20%] left-[70%] w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse shadow-[0_0_10px_#a855f7]"></div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"><p className="text-gray-500 font-bold">No active traffic yet.</p></div>
              )}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-cyan-400" /> Revenue (Last 7 Days)</h3>
            <div className="flex-1 flex items-end gap-3 min-h-[300px] pt-10 relative">
              {activeProject.revenue > 0 ? [40, 70, 45, 90, 65, 80, 100].map((val, i) => (
                <div key={i} className="flex-1 bg-cyan-500/10 hover:bg-cyan-500/30 transition-colors rounded-t-xl relative group flex justify-center">
                  <div className="absolute -top-8 bg-black border border-white/10 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">${(val * 120 * visitorMultiplier).toFixed(0)}</div>
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-cyan-600 to-blue-400 rounded-t-xl transition-all duration-1000 ease-out" style={{ height: `${val}%` }}></div>
                </div>
              )) : (
                <div className="absolute inset-0 flex items-center justify-center"><p className="text-gray-500 font-bold">No revenue data for this project.</p></div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-4 px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPages = () => (
    // Reduced padding on mobile (p-4) vs desktop (md:p-8)
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 h-full overflow-y-auto custom-scrollbar">

      {/* Stacked header on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white">My Landing Pages</h2>
          <p className="text-xs md:text-sm text-gray-400">Manage, edit, and duplicate your immersive web experiences.</p>
        </div>
        <button onClick={initNewPageProcess} className="w-full sm:w-auto px-4 md:px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-colors shrink-0">
          <Plus size={16} /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {savedPages.map((page, idx) => {
          // 🚀 SAFETY CHECK: Get the valid ID, prioritizing MongoDB's _id
          const currentId = page._id || page.id;

          return (
            <div key={`${currentId}-${idx}`} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group">
              <div className="h-40 bg-[#0A0A0E] relative flex items-center justify-center border-b border-white/5 group-hover:bg-[#111118] transition-colors">
                <LayoutTemplate className="w-16 h-16 text-white/10 group-hover:scale-110 group-hover:text-cyan-500/20 transition-all" />
                <div className="absolute top-3 right-3">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${page.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {page.status}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1">{page.setup.name || 'Untitled Project'}</h3>
                {/* Displaying currentId safely */}
                <p className="text-xs text-gray-400 mb-4 font-mono">{currentId}</p>

                <div className="flex justify-between items-center text-sm text-gray-300 mb-5 bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase">Views</span><span className="font-bold">{page.views?.toLocaleString() || 0}</span></div>
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase">Conv. Rate</span><span className="font-bold text-green-400">{page.convRate || '0%'}</span></div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => loadPageForEditing(page)} className="flex-1 py-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg font-bold text-sm transition-colors border border-cyan-500/30">Edit Page</button>

                  {/* Using currentId here ensures it's never undefined */}
                  <button
                    onClick={() => handleDeleteProject(currentId)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 border border-red-500/20 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>

                  {page.publish?.publicUrl && (
                    <button onClick={() => window.open(page.publish.publicUrl, '_blank')} className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 hover:text-green-300 border border-green-500/20 transition-colors" title="View Live Site">
                      <Globe size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderInventory = () => {
    const projectInventory = inventory.filter(item => item.projectId === selectedProjectId);

    return (
      <div className="p-4 md:p-8 h-full overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-24">

        {/* 🚀 FIXED: Stacked header on mobile */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white">E-Commerce Inventory</h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1">Manage products linked to specific landing pages.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-xs sm:text-sm font-bold text-gray-400">Context:</label>
              <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full sm:w-auto bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white outline-none cursor-pointer text-sm">
                {savedPages.map(p => <option key={p.id} value={p.id}>{p.setup.name || 'Untitled'}</option>)}
              </select>
            </div>
            <button className="w-full sm:w-auto px-4 md:px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* 🚀 FIXED: Added overflow-x-auto so the table swipes on mobile instead of breaking! */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
            <thead className="text-[10px] md:text-xs uppercase bg-black/50 text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 font-bold">Product Name</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-bold">Price</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-bold">Stock</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-bold">Status</th>
                <th className="px-4 md:px-6 py-3 md:py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectInventory.length > 0 ? projectInventory.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs md:text-sm">
                  <td className="px-4 md:px-6 py-4 font-medium text-white flex items-center gap-2 md:gap-3"><Box size={14} className="text-cyan-400" /> {item.name}</td>
                  <td className="px-4 md:px-6 py-4">${item.price}</td>
                  <td className="px-4 md:px-6 py-4">{item.stock} units</td>
                  <td className="px-4 md:px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[9px] md:text-[10px] font-bold uppercase ${item.stock > 15 ? 'bg-green-500/20 text-green-400' : item.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{item.status}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 text-right flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-300"><Settings size={14} /></button>
                    <button className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded text-gray-300 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 text-xs md:text-sm">No products configured for this landing page yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  };

  const renderSettings = () => (
    // 🚀 FIXED: Added p-4 for mobile, md:p-8 for desktop
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar space-y-6 md:space-y-8 pb-24">
      <div>
        <h2 className="text-xl md:text-2xl font-black text-white">Account Settings</h2>
        <p className="text-xs md:text-sm text-gray-400">Manage your profile, preferences, and subscription tier.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-6">
        <h3 className="text-base md:text-lg font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2"><User size={18} className="text-cyan-400" /> Profile Information</h3>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-black/50 overflow-hidden relative group cursor-pointer hover:border-cyan-500 transition-colors">
              {userProfile.avatar ? <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-gray-500" />}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <span className="text-[10px] md:text-xs text-gray-500 font-bold">Change Avatar</span>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label><input type="text" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label><input type="email" value={userProfile.email} disabled className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none cursor-not-allowed" /></div>
            </div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company / Agency Name</label><input type="text" value={userProfile.company} onChange={(e) => setUserProfile({ ...userProfile, company: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" /></div>
            <button onClick={() => setSyncStatus('Saved')} className="w-full md:w-auto px-6 py-3 md:py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 transition-colors text-sm">Save Profile Changes</button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 space-y-6">
        <h3 className="text-base md:text-lg font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2"><CreditCard size={18} className="text-green-400" /> Subscription Tier</h3>

        {/* 🚀 FIXED: flex-col on mobile so the cards stack! */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className={`flex-1 p-5 md:p-6 rounded-xl border-2 transition-all ${userTier === 'free' ? 'border-gray-500 bg-gray-900' : 'border-white/10 bg-black/50'}`}>
            <h4 className="text-lg md:text-xl font-bold text-white mb-2">Starter Plan</h4>
            <p className="text-xs md:text-sm text-gray-400 mb-4">Basic features, watermarked branding, limited themes.</p>
            <div className="text-2xl font-black text-white">$0 <span className="text-sm font-normal text-gray-500">/mo</span></div>
          </div>

          <div onClick={userTier === 'free' ? handleBuyPro : undefined} className={`flex-1 p-5 md:p-6 rounded-xl border-2 transition-all relative overflow-hidden ${userTier === 'pro' ? 'border-green-500 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-default' : 'border-orange-500/50 bg-black/50 hover:border-orange-500 cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.1)]'}`}>
            {userTier === 'pro' && <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase">Active</div>}
            {userTier === 'free' && <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase">Upgrade</div>}

            <h4 className="text-lg md:text-xl font-bold text-white mb-2 flex items-center gap-2">Professional <Sparkles size={16} className={userTier === 'pro' ? 'text-green-400' : 'text-orange-400'} /></h4>
            <p className="text-xs md:text-sm text-gray-400 mb-4">Unlock Premium Themes, Custom Domains & API.</p>
            <div className="text-2xl font-black text-white">$15 <span className="text-sm font-normal text-gray-500">/mo</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==========================================
  // 🧩 RENDER EDITOR WORKFLOW STEPS
  // ==========================================
  const renderStep1Setup = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Project Setup</h3>
          <p className="text-sm text-gray-400">Define the core architecture and goal of your immersive page.</p>
        </div>
        <div className="space-y-5 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Project Name</label><input type="text" value={pageData.setup.name} onChange={e => updateNestedData('setup', 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder="e.g. Product Launch" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Website Goal</label>
              <select value={pageData.setup.goal} onChange={e => updateNestedData('setup', 'goal', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer">
                <option value="sales">Product Sales</option>
                <option value="leads">Lead Generation</option>
                <option value="awareness">Brand Awareness</option>
              </select>
            </div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Audience</label><input type="text" value={pageData.setup.audience} onChange={e => updateNestedData('setup', 'audience', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder="Tech enthusiasts, ages 18-35" /></div>
          </div>
        </div>
      </div>
      <div className="bg-[#0A0A0E] border border-white/5 rounded-3xl p-8 relative flex flex-col items-center justify-center text-center shadow-2xl">
        <LayoutTemplate className="w-20 h-20 text-cyan-500/40 mb-6" />
        <h4 className="text-xl font-bold text-white mb-2">Architecture Ready</h4>
        <p className="text-gray-400 text-sm mb-8 max-w-sm">Continue to configure your brand, then let our AI auto-generate your sections based on your category.</p>
      </div>
    </div>
  );

  const renderStep2Brand = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Brand Identity</h3>
          <p className="text-sm text-gray-400">Configure logos, colors, and typography globally.</p>
        </div>
        <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="flex gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Logo Upload</label>
              <label className="w-full h-12 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-sm text-gray-500 hover:text-cyan-400 hover:border-cyan-500 cursor-pointer transition-colors bg-black/50 overflow-hidden">
                {pageData.brand?.logo ? (
                  <img src={pageData.brand.logo} className="h-full object-contain p-1" alt="Logo" />
                ) : (
                  <><Upload size={16} className="mr-2" /> Drop SVG/PNG</>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSyncStatus('Uploading...');
                      const url = await uploadFileToStorage(e.target.files[0]);
                      if (url) {
                        updateNestedData('brand', 'logo', url);
                        setSyncStatus('Saved');
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Brand Name</label><input type="text" value={pageData.brand.name} onChange={e => updateNestedData('brand', 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tagline</label><input type="text" value={pageData.brand.tagline} onChange={e => updateNestedData('brand', 'tagline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">About (Short)</label><textarea value={pageData.brand.aboutShort} onChange={e => updateNestedData('brand', 'aboutShort', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none h-20 resize-none" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Primary Color</label>
              <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl px-4 py-2">
                <input type="color" value={pageData.brand.colors[0]} onChange={e => updateNestedData('brand', 'colors', [e.target.value, pageData.brand.colors[1]])} className="w-8 h-8 rounded cursor-pointer bg-transparent border-none p-0" />
                <span className="text-white text-sm font-mono">{pageData.brand.colors[0]}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Font Style</label>
              <select value={pageData.brand.font} onChange={e => updateNestedData('brand', 'font', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer">
                <option value="Inter">Inter (Modern)</option>
                <option value="Playfair">Playfair (Elegant)</option>
                <option value="Space Grotesk">Space Grotesk (Tech)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-center items-center text-center">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-30 pointer-events-none transition-colors duration-500" style={{ backgroundColor: pageData.brand.colors[0] }}></div>
        <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 mb-6 flex items-center justify-center backdrop-blur-md shadow-2xl">
          {pageData.brand.logo ? <img src={pageData.brand.logo} className="w-full h-full object-contain p-2" /> : <ImageIcon className="text-white/50" size={32} />}
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight transition-all duration-300" style={{ fontFamily: pageData.brand.font }}>{pageData.brand.name || 'Your Brand'}</h2>
        <p className="text-lg text-white/70 mb-8 font-light max-w-md">{pageData.brand.tagline || 'Your awesome tagline goes here.'}</p>
        <button className="px-8 py-4 rounded-xl text-white font-bold transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1" style={{ backgroundColor: pageData.brand.colors[0] }}>
          Button Style
        </button>
      </div>
    </div>
  );

  const renderStepCategory = () => (
    <div className="space-y-8 h-full">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-3xl font-black text-white mb-3">Select Your Industry</h3>
        <p className="text-gray-400">Select a template to automatically load the predefined section structure and fields for your niche. You can always edit these blocks later.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.keys(CATEGORY_TEMPLATES).map(cat => (
          <button
            key={cat}
            onClick={() => handleCategorySelect(cat)}
            className={`p-6 rounded-2xl border text-left transition-all ${pageData.setup.category === cat ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
          >
            <Layers className={`w-8 h-8 mb-4 ${pageData.setup.category === cat ? 'text-cyan-400' : 'text-gray-500'}`} />
            <h3 className="text-lg font-bold text-white">{cat}</h3>
            <p className="text-xs text-gray-500 mt-2">Includes {CATEGORY_TEMPLATES[cat].length} pre-built structured sections.</p>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3Hero = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Hero & Navigation</h3>
          <p className="text-sm text-gray-400">Configure your main header and the top navigation menu.</p>
        </div>

        {/* Main Hero Config */}
        <div className="space-y-5 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 flex justify-between">Hero Headline <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"><Wand2 size={12} /> AI</button></label>
            <input type="text" value={pageData.hero.headline} onChange={e => updateNestedData('hero', 'headline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none text-lg font-bold" placeholder="Enter the Next Reality" />
          </div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Sub-headline</label><textarea value={pageData.hero.subheadline} onChange={e => updateNestedData('hero', 'subheadline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none h-20 resize-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">CTA Text</label><input type="text" value={pageData.hero.ctaText} onChange={e => updateNestedData('hero', 'ctaText', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder="Shop Now" /></div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">CTA Link</label><input type="text" value={pageData.hero.ctaLink} onChange={e => updateNestedData('hero', 'ctaLink', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" placeholder="#products" /></div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hero Media Background</label>
            <select value={pageData.hero.bgType} onChange={e => updateNestedData('hero', 'bgType', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer">
              <option value="particles">3D Particles Engine</option>
              <option value="video">Cinematic Video Loop</option>
              <option value="image">Static High-Res Image</option>
            </select>
          </div>
        </div>

       // Find this inside renderStep3Hero() in Dashboard.jsx
        {/* 🚀 NEW: Top Navigation Builder */}
        <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl mt-6">
          <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2"><Layout size={16} className="text-cyan-400" /> Top Navigation Menu</h4>
          <p className="text-xs text-gray-400">Add the links that will appear between your logo and the Customer Sign-In button.</p>

          <div className="space-y-3 mt-4">
            {(pageData.hero?.navLinks || []).map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center bg-black/30 p-2 rounded-xl border border-white/5">
                <input type="text" value={link.label} placeholder="Name (e.g. Features)" onChange={e => {
                  const newLinks = [...(pageData.hero.navLinks || [])];
                  newLinks[idx].label = e.target.value;
                  updateNestedData('hero', 'navLinks', newLinks);
                }} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-500" />
                <input type="text" value={link.target} placeholder="Link (e.g. #sec_123)" onChange={e => {
                  const newLinks = [...(pageData.hero.navLinks || [])];
                  newLinks[idx].target = e.target.value;
                  updateNestedData('hero', 'navLinks', newLinks);
                }} className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-500" />
                <button onClick={() => {
                  const newLinks = (pageData.hero.navLinks || []).filter((_, i) => i !== idx);
                  updateNestedData('hero', 'navLinks', newLinks);
                }} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          <button onClick={() => {
            const newLinks = [...(pageData.hero.navLinks || []), { label: 'New Link', target: '#' }];
            updateNestedData('hero', 'navLinks', newLinks);
          }} className="w-full py-3 mt-2 bg-black/50 hover:bg-white/5 border border-white/10 border-dashed rounded-xl text-xs font-bold text-cyan-400 flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Hero Preview Screen */}
      <div className="bg-[#050505] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl min-h-[500px]">
        <div className="absolute top-4 right-4 z-20 flex bg-black/60 backdrop-blur-md rounded-lg border border-white/10 p-1">
          <button onClick={() => setPreviewMode('desktop')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><Monitor size={16} /></button>
          <button onClick={() => setPreviewMode('mobile')} className={`p-1.5 rounded-md transition-colors ${previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-500'}`}><Smartphone size={16} /></button>
        </div>
        <div className={`flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${previewMode === 'mobile' ? 'w-[320px] mx-auto border-x border-white/10 bg-black' : 'w-full'}`}>
          <div className="flex-1 relative flex items-center justify-center p-8 text-center overflow-hidden">
            {pageData.hero.bgType === 'particles' && (
              <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30">
                <div className="w-[120%] h-[120%] border-[1px] border-cyan-500/20 rounded-full animate-[spin_20s_linear_infinite]" style={{ transform: 'perspective(500px) rotateX(60deg)' }}></div>
                <div className="absolute w-[80%] h-[80%] border-[1px] border-blue-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" style={{ transform: 'perspective(500px) rotateX(60deg)' }}></div>
              </div>
            )}
            <div className="relative z-10 max-w-lg mx-auto space-y-6">
              <h1 className={`${previewMode === 'mobile' ? 'text-3xl' : 'text-5xl'} font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 leading-tight`} style={{ fontFamily: pageData.brand.font }}>
                {pageData.hero.headline || 'Enter the Next Reality'}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">{pageData.hero.subheadline || 'Immersive VR experiences for the next generation.'}</p>
              <button className="px-8 py-4 rounded-full text-white font-bold shadow-[0_0_20px_rgba(0,0,0,0.4)] transition-all" style={{ backgroundColor: pageData.brand.colors[0] }}>
                {pageData.hero.ctaText || 'Explore Features'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4Blocks = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutDashboard className="text-cyan-500" /> Dynamic Section Builder</h2>
          <p className="text-gray-400 text-sm">Category: <span className="text-cyan-400 font-bold">{pageData.setup.category?.toUpperCase() || 'None selected'}</span></p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            alert("AI suggests: Add 'Testimonials' and 'Pricing' to boost conversions!");
          }} className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-lg text-sm font-bold border border-cyan-500/20 flex items-center gap-2 transition-colors">
            <Sparkles size={16} /> AI Recommend
          </button>

          {/* 🚀 ADD CUSTOM SECTION BUTTON ACTIVE */}
          <button onClick={handleAddCustomSection} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 flex items-center gap-2 transition-colors">
            <PlusCircle size={16} /> Custom Section
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {pageData.blocks.map((block, index) => (
          <div key={block.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">

            <div className="bg-black/40 p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 border-b border-white/10" onClick={() => handleUpdateBlock(block.id, 'collapsed', !block.collapsed)}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col opacity-50 hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleMoveBlock(index, -1)} disabled={index === 0} className="hover:text-white disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button onClick={() => handleMoveBlock(index, 1)} disabled={index === pageData.blocks.length - 1} className="hover:text-white disabled:opacity-30"><ChevronDown size={14} /></button>
                </div>
                <h3 className="text-white font-bold">{block.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-white text-xs flex items-center gap-1"><Edit size={14} /> Edit Form</button>
                <div className="w-10 h-5 bg-cyan-500/20 rounded-full flex items-center p-1 cursor-pointer"><div className="w-3 h-3 bg-cyan-500 rounded-full translate-x-5 transition-transform" /></div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }} className="text-red-500/50 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            {!block.collapsed && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20">

                {/* 🚀 DYNAMIC BOX 5: NICHE SPECIFIC FIELDS */}
                {block.customFields && Object.keys(block.customFields).length > 0 && (
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4 space-y-3 md:col-span-2">
                    <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={12} /> Box 5: Niche Specific Data</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.keys(block.customFields).map(fieldKey => (
                        <div key={fieldKey}>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                            {fieldKey.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="text"
                            value={block.customFields[fieldKey]}
                            onChange={e => {
                              const val = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => b.id === block.id ? { ...b, customFields: { ...b.customFields, [fieldKey]: val } } : b)
                              }));
                            }}
                            className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Box 1: Main Content</h4>
                  <input type="text" placeholder="Headline" value={block.content?.headline || ''} onChange={e => handleUpdateBlockData(block.id, 'content', 'headline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                  <input type="text" placeholder="Sub-headline" value={block.content?.subheadline || ''} onChange={e => handleUpdateBlockData(block.id, 'content', 'subheadline', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                  <textarea placeholder="Description" rows="3" value={block.content?.description || ''} onChange={e => handleUpdateBlockData(block.id, 'content', 'description', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500 resize-none" />
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Box 2: Media Assets</h4>

                  {/* Live Media Status Preview indicator */}
                  {block.media?.bgImage || block.media?.heroImage || block.customFields?.modelUploadGLB || block.media?.video ? (
                    <div className="text-[10px] text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20 truncate">
                      📎 Attached: {block.media?.heroImage || block.customFields?.modelUploadGLB || block.media?.video}
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-500 italic p-2 bg-black/20 rounded">No asset attached to this section</div>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {/* IMAGE UPLOAD */}
                    <label className="bg-black/50 border border-white/10 border-dashed rounded p-3 text-gray-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer text-xs">
                      <ImageIcon size={20} /> <span className="text-xs">Upload Section Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            setSyncStatus('Uploading...');
                            const url = await uploadFileToStorage(e.target.files[0]);
                            if (url) handleUpdateBlockData(block.id, 'media', 'heroImage', url);
                            setSyncStatus('Saved');
                          }
                        }}
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {/* VIDEO UPLOAD */}
                      <label className="bg-black/50 border border-white/10 rounded p-3 text-gray-400 text-xs flex items-center justify-center gap-2 hover:border-white/30 cursor-pointer">
                        <Video size={14} /> Add Video
                        <input
                          type="file"
                          accept="video/mp4"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              setSyncStatus('Uploading...');
                              const url = await uploadFileToStorage(e.target.files[0]);
                              if (url) handleUpdateBlockData(block.id, 'media', 'video', url);
                              setSyncStatus('Saved');
                            }
                          }}
                        />
                      </label>

                      {/* 3D GLB UPLOAD */}
                      <label className="bg-black/50 border border-white/10 rounded p-3 text-gray-400 text-xs flex items-center justify-center gap-2 hover:border-white/30 cursor-pointer">
                        <Box size={14} /> Attach 3D Model
                        <input
                          type="file"
                          accept=".glb,.gltf"
                          className="hidden"
                          onChange={async (e) => {
                            if (e.target.files?.[0]) {
                              setSyncStatus('Uploading...');
                              const url = await uploadFileToStorage(e.target.files[0]);
                              if (url) {
                                const updatedCustom = { ...block.customFields, modelUploadGLB: url };
                                handleUpdateBlock(block.id, 'customFields', updatedCustom);
                              }
                              setSyncStatus('Saved');
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Box 3: Action Buttons</h4>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Button Text" value={block.cta?.buttonText || ''} onChange={e => handleUpdateBlockData(block.id, 'cta', 'buttonText', e.target.value)} className="w-1/3 bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                    <input type="text" placeholder="Target Link URL" value={block.cta?.buttonLink || ''} onChange={e => handleUpdateBlockData(block.id, 'cta', 'buttonLink', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Secondary Text" value={block.cta?.secondaryText || ''} onChange={e => handleUpdateBlockData(block.id, 'cta', 'secondaryText', e.target.value)} className="w-1/3 bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                    <input type="text" placeholder="Secondary Link" value={block.cta?.secondaryLink || ''} onChange={e => handleUpdateBlockData(block.id, 'cta', 'secondaryLink', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white text-sm outline-none focus:border-cyan-500" />
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Box 4: Style Options</h4>
                  <select value={block.style?.animationType || 'fade-up'} onChange={e => handleUpdateBlockData(block.id, 'style', 'animationType', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-gray-300 text-sm outline-none focus:border-cyan-500 cursor-pointer">
                    <option value="fade-up">Animation: Fade Up</option>
                    <option value="3d-flip">Animation: 3D Flip</option>
                    <option value="slide-right">Animation: Slide Right</option>
                  </select>
                  <select value={block.style?.alignment || 'left'} onChange={e => handleUpdateBlockData(block.id, 'style', 'alignment', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded p-3 text-gray-300 text-sm outline-none focus:border-cyan-500 cursor-pointer">
                    <option value="left">Text Align: Left</option>
                    <option value="center">Text Align: Center</option>
                    <option value="right">Text Align: Right</option>
                  </select>
                </div>

              </div>
            )}
          </div>
        ))}
        {pageData.blocks.length === 0 && (
          <div className="h-40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-gray-500 flex-col gap-2">
            <Layers size={32} className="opacity-50" />
            <p>Your canvas is empty. Select a Category in Phase 1 to auto-generate sections.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep5Theme = () => {
    // 🚀 Complete Master Definition mapping for all 15 AAA 3D environments
    const systemThemes = [
      { id: 'theme-1', name: 'Cyber Neon Mall', style: 'Dark & Glowing (E-Commerce)', bg: 'from-pink-600/30 via-purple-900/40 to-black', element: 'neon-grid' },
      { id: 'theme-2', name: 'Space Market', style: 'Galactic & Orbital (E-Commerce)', bg: 'from-blue-600/30 via-slate-900 to-black', element: 'orbit-rings' },
      { id: 'theme-3', name: 'Golden Prestige', style: 'Luxury & Reflective (E-Commerce) [PRO]', bg: 'from-amber-600/20 via-stone-900 to-black', element: 'luxury-gems' },
      { id: 'theme-4', name: 'Cyber Lab', style: 'Computational Field (Digital Gadgets)', bg: 'from-cyan-600/30 via-zinc-900 to-black', element: 'matrix-nodes' },
      { id: 'theme-5', name: 'Tron Grid', style: 'Vector Landscape (Digital Gadgets)', bg: 'from-teal-600/30 via-emerald-950/20 to-black', element: 'vector-lines' },
      { id: 'theme-6', name: 'Portal Dimension', style: 'Energy Vortex Core (Digital Gadgets) [PRO]', bg: 'from-purple-600/30 via-indigo-950 to-black', element: 'vortex-core' },
      { id: 'theme-7', name: 'Skyline Estate', style: 'Holographic City (Real Estate)', bg: 'from-sky-600/30 via-slate-900 to-black', element: 'city-wireframe' },
      { id: 'theme-8', name: 'Dream Hall', style: 'Minimalist Floating (Real Estate)', bg: 'from-violet-600/20 via-neutral-900 to-black', element: 'minimal-blocks' },
      { id: 'theme-9', name: 'Frozen Platinum', style: 'Crystalline Glacial (Real Estate) [PRO]', bg: 'from-blue-400/20 via-indigo-950 to-black', element: 'crystal-shards' },
      { id: 'theme-10', name: 'Cosmic Library', style: 'Swirling Information (Learning)', bg: 'from-fuchsia-600/30 via-purple-950 to-black', element: 'stars-orbit' },
      { id: 'theme-11', name: 'Ai Sphere', style: 'Neural Node Networks (Learning)', bg: 'from-cyan-500/20 via-slate-900 to-black', element: 'neural-mesh' },
      { id: 'theme-12', name: 'Genetic Matrix', style: 'Biological Helix (Learning) [PRO]', bg: 'from-emerald-500/20 via-stone-900 to-black', element: 'dna-helix' },
      { id: 'theme-13', name: 'Command Center', style: 'Tactical Mainframe (Agency)', bg: 'from-red-600/20 via-zinc-900 to-black', element: 'tactical-grid' },
      { id: 'theme-14', name: 'Crystal Vault', style: 'Refractive Geometric (Agency)', bg: 'from-indigo-500/20 via-slate-900 to-black', element: 'refractive-shapes' },
      { id: 'theme-15', name: 'Dark Matter', style: 'Volumetric Physics (Agency) [PRO]', bg: 'from-purple-900/40 via-neutral-950 to-black', element: 'physics-cloud' }
    ];

    const themeDetails = systemThemes.find(t => t.id === pageData.setup?.themeId) || systemThemes[0];

    // 🔮 Live CSS Simulation Engine mimicking Three.js environmental render behaviors
    const renderLivePreviewBackground = (elementKey) => {
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-40 group-hover:opacity-60 transition-opacity duration-500">
          {elementKey === 'neon-grid' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff003c15_1px,transparent_1px),linear-gradient(to_bottom,#00ffff15_1px,transparent_1px)] bg-[size:16px_24px] [transform:perspective(100px)_rotateX(45deg)] origin-bottom animate-pulse" />
          )}
          {elementKey === 'orbit-rings' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-blue-500/20 border-dashed animate-spin [animation-duration:15s] relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-cyan-400/10 border-dashed animate-spin [animation-duration:8s]" />
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 absolute top-4 left-4 shadow-[0_0_12px_#00ffff]" />
              </div>
            </div>
          )}
          {elementKey === 'luxury-gems' && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)]">
              <div className="absolute bottom-4 left-1/4 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-60" />
              <div className="absolute bottom-12 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-40 delay-300" />
            </div>
          )}
          {elementKey === 'matrix-nodes' && (
            <div className="absolute inset-x-0 top-0 h-48 flex justify-around opacity-40">
              <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500 to-transparent animate-pulse" />
              <div className="w-[1px] h-40 bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-pulse delay-200" />
              <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse delay-500" />
            </div>
          )}
          {elementKey === 'vector-lines' && (
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,#00ffff15)] [transform:perspective(70px)_rotateX(55deg)] border-t border-cyan-500/40" />
          )}
          {elementKey === 'vortex-core' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-purple-500/5 border border-purple-500/20 animate-pulse flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-400/30 animate-spin [animation-duration:6s]" />
              </div>
            </div>
          )}
          {elementKey === 'city-wireframe' && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-3 h-28 opacity-40">
              <div className="w-6 h-20 border border-cyan-500/30 bg-cyan-500/5 rounded-t-sm" />
              <div className="w-8 h-28 border border-purple-500/30 bg-purple-500/5 rounded-t-sm" />
              <div className="w-7 h-14 border border-blue-500/30 bg-blue-500/5 rounded-t-sm" />
            </div>
          )}
          {elementKey === 'minimal-blocks' && (
            <div className="absolute inset-0 flex gap-4 items-center justify-center opacity-20">
              <div className="w-6 h-6 border border-white/20 rounded rotate-12 animate-bounce" />
              <div className="w-4 h-4 border border-white/20 rounded -rotate-12 animate-bounce delay-300" />
            </div>
          )}
          {elementKey === 'crystal-shards' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5 [transform:skewY(-12deg)_scale(1.2)]" />
          )}
          {elementKey === 'stars-orbit' && (
            <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,#fff,transparent),radial-gradient(2px_2px_at_60px_120px,#fff,transparent),radial-gradient(2.5px_2.5px_at_110px_60px,#fff,transparent)] opacity-40 animate-pulse" />
          )}
          {elementKey === 'neural-mesh' && (
            <div className="absolute inset-0 flex items-center justify-center gap-5 opacity-40">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping delay-300" />
            </div>
          )}
          {elementKey === 'dna-helix' && (
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 border-r border-l border-dashed border-emerald-500/20 animate-pulse" />
          )}
          {elementKey === 'tactical-grid' && (
            <div className="absolute inset-0 bg-radial-grid bg-[size:20px_20px] border-b border-red-500/10"><div className="w-full h-0.5 bg-red-500/20 absolute top-1/2 animate-bounce" /></div>
          )}
          {elementKey === 'refractive-shapes' && (
            <div className="absolute inset-0 flex items-center justify-center opacity-25 animate-spin [animation-duration:25s]"><div className="w-20 h-20 border-2 border-indigo-500/30 rotate-45" /></div>
          )}
          {elementKey === 'physics-cloud' && (
            <div className="absolute inset-0 bg-radial-gradient bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_60%)] scale-150 animate-pulse" />
          )}
        </div>
      );
    };

    return (
      <div className="flex flex-col h-full space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">Theme, Layout & Animations <Sparkles size={20} className="text-cyan-400" /></h3>
          <p className="text-sm text-gray-400">Control the global structure, aesthetics, and 3D physics of your page.</p>
        </div>

        {/* Top Active Theme Identity Banner */}
        <div className="w-full shrink-0 h-32 rounded-2xl relative overflow-hidden flex items-center justify-between p-8 border border-white/10 shadow-lg group">
          <div className={`absolute inset-0 bg-gradient-to-br ${themeDetails.bg} opacity-80 transition-transform duration-700 group-hover:scale-105`}></div>
          <div className="relative z-10">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 mb-2 inline-block shadow-lg">Active System Setup</span>
            <h2 className="text-3xl font-black text-white">{themeDetails.name}</h2>
            <p className="text-sm text-gray-300 font-mono tracking-tight">{themeDetails.style}</p>
          </div>
          <button
            onClick={() => {
              const projectCat = pageData.setup?.category === 'ecommerce' ? 'E-Commerce' :
                pageData.setup?.category === 'gadgets' ? 'Digital Gadgets' :
                  pageData.setup?.category === 'service' ? 'Agency' :
                    pageData.setup?.category === 'learning' ? 'Learning' : 'All';
              setModalCategory(projectCat);
              setIsThemeModalOpen(true);
            }}
            className="relative z-10 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-bold transition-all border border-white/20 flex items-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1"
          >
            <Layout size={16} /> Change Theme
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-1">
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
              <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 mb-4 flex items-center gap-2"><LayoutTemplate size={16} className="text-cyan-400" /> Layout Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Navigation Style</label>
                  <select value={pageData.theme?.navStyle || 'standard'} onChange={(e) => updateNestedData('theme', 'navStyle', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer focus:border-cyan-500">
                    <option value="floating">Floating Dock</option>
                    <option value="sticky">Sticky Top Bar</option>
                    <option value="standard">Standard Inline</option>
                    <option value="hidden">Hidden / Immersive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content Width</label>
                  <select value={pageData.theme?.contentWidth || 'boxed'} onChange={(e) => updateNestedData('theme', 'contentWidth', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer focus:border-cyan-500">
                    <option value="fluid">Fluid (100% Edge-to-Edge)</option>
                    <option value="boxed">Boxed (Standard Container)</option>
                    <option value="narrow">Narrow (Minimal/Blog)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
              <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2"><Sparkles size={16} className="text-cyan-400" /> Animation & Physics Engine</h4>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex justify-between">
                  Animation Intensity <span>{pageData.theme?.animationIntensity || 50}%</span>
                </label>
                <input type="range" min="0" max="100" value={pageData.theme?.animationIntensity || 50} onChange={(e) => updateNestedData('theme', 'animationIntensity', parseInt(e.target.value))} className="w-full accent-cyan-500 cursor-pointer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'particles', label: 'Particle Engine', desc: 'Background 3D dust clouds' },
                  { id: 'floating', label: 'Floating Physics', desc: 'Hovering scene objects' },
                  { id: 'mouseEffects', label: 'Mouse Tracking', desc: 'Parallax camera physics' },
                  { id: 'scrollEffects', label: 'Scroll Reveal', desc: 'Fade structural wrappers' }
                ].map(toggle => (
                  <div key={toggle.id} className="flex items-center justify-between p-3 bg-black/50 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold text-white">{toggle.label}</h4>
                      <p className="text-[10px] text-gray-500 font-sans">{toggle.desc}</p>
                    </div>
                    <div
                      onClick={() => updateNestedData('theme', toggle.id, !pageData.theme?.[toggle.id])}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${pageData.theme?.[toggle.id] ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${pageData.theme?.[toggle.id] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 🚀 THE LIVE DEVICE MOCKUP SCREEN WITH BUILT-IN ACTIVE BACKGROUNDS */}
          <div className="bg-[#050507] border border-white/5 rounded-3xl p-8 relative flex flex-col items-center justify-center overflow-hidden shadow-inner min-h-[400px] group">

            {/* Live Gradient Layer */}
            <div className={`absolute inset-0 bg-gradient-to-br ${themeDetails.bg} opacity-20 transition-all duration-700`} />

            {/* Live 3D Particle/Grid Simulation Layer */}
            {renderLivePreviewBackground(themeDetails.element)}

            {pageData.theme?.particles && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-40"></div>
                <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30 delay-700"></div>
                <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-40 delay-1000"></div>
              </div>
            )}

            {/* Simulated Frame Shell Container */}
            <div className={`relative z-10 w-full h-full border-2 border-dashed flex flex-col overflow-hidden transition-all duration-700
                      ${(pageData.theme?.animationIntensity || 50) > 50 ? 'border-cyan-400 bg-cyan-500/5 shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'border-white/10 bg-white/[0.02]'}
                      ${pageData.theme?.contentWidth === 'fluid' ? 'max-w-full rounded-none' : pageData.theme?.contentWidth === 'narrow' ? 'max-w-[180px] rounded-3xl' : 'max-w-[260px] rounded-2xl'}
                   `}>
              {pageData.theme?.navStyle !== 'hidden' && (
                <div className={`h-8 border-b border-white/10 flex items-center px-4 gap-2 
                             ${pageData.theme?.navStyle === 'floating' ? 'm-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md' : 'bg-white/[0.02]'}
                          `}>
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500/60"></div>
                  <div className="flex-1"></div>
                  <div className="w-10 h-1.5 rounded bg-white/20"></div>
                </div>
              )}
              <div className={`flex-1 flex items-center justify-center p-8 transition-all duration-500
                         ${pageData.theme?.floating ? 'animate-[bounce_4s_infinite_ease-in-out]' : ''}
                         ${pageData.theme?.mouseEffects ? 'group-hover:rotate-3 group-hover:scale-105' : ''}
                      `}>
                <LayoutTemplate size={44} className={`text-white transition-all duration-500 ${(pageData.theme?.animationIntensity || 50) > 50 ? 'text-cyan-400 animate-pulse' : 'opacity-40'}`} />
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };
  const renderStep6AI = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">AI Content System <Zap size={20} className="text-yellow-400" /></h3>
          <p className="text-sm text-gray-400">Let AI write high-converting copy based on your project setup.</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tone of Voice</label>
            <select value={pageData.ai.tone} onChange={(e) => updateNestedData('ai', 'tone', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
              <option value="professional">Professional & Trustworthy</option>
              <option value="hype">Hype & Energetic</option>
              <option value="luxury">Luxury & Minimal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 transition-colors flex flex-col items-center justify-center gap-2 group">
              <Monitor size={24} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-white">Generate Copy</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black/30 border border-white/5 rounded-3xl p-6 relative flex flex-col shadow-inner">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-4 flex items-center gap-2"><Sparkles size={14} /> AI Output</h4>
        <div className="flex-1 bg-[#0A0A0E] rounded-xl border border-white/10 p-5 font-mono text-sm text-gray-300 overflow-y-auto">
          <span className="text-green-400">&gt;</span> AI System Ready.
        </div>
      </div>
    </div>
  );

  const renderStep7Media = () => (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-1">Global Media Manager</h3>
          <p className="text-sm text-gray-400">Your central library for Images, Videos, and 3D Models (.glb).</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10"><ImageIcon size={14} /> Image Library</button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10"><Video size={14} /> Video Assets</button>
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 hover:bg-white/10"><Box size={14} /> 3D Models</button>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar">
        <label className="border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-6 text-gray-500 hover:border-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer min-h-[150px]">
          <DownloadCloud size={32} className="mb-2" />
          <span className="text-sm font-bold text-center">Click to Upload<br />PNG, MP4, GLB</span>
          <input type="file" accept="image/*,video/mp4,.glb,.gltf" multiple className="hidden" onChange={async (e) => {
            const files = Array.from(e.target.files);
            let newMedia = [...(pageData.media || [])];
            for (let file of files) {
              const url = await uploadFileToStorage(file);
              if (url) newMedia.push({ name: file.name, url, type: file.type });
            }
            setPageData(prev => ({ ...prev, media: newMedia }));
          }} />
        </label>

        {pageData.media?.map((m, idx) => (
          <div key={idx} className="bg-black/50 border border-white/10 rounded-xl relative group overflow-hidden min-h-[150px]">
            {m.type.includes('image') ? (
              <img src={m.url} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-cyan-900/20"><Video size={40} className="text-cyan-400/50" /></div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-sm text-[10px] text-white font-mono truncate">
              {m.name}
            </div>
            <button onClick={() => {
              const newMedia = [...pageData.media];
              newMedia.splice(idx, 1);
              setPageData(prev => ({ ...prev, media: newMedia }));
            }} className="absolute top-2 right-2 bg-red-500/80 p-1.5 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep8Contact = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Contact & Socials</h3>
          <p className="text-sm text-gray-400">Configure your quick-access floating buttons.</p>
        </div>

        {/* --- BOX 1: SOCIAL PLATFORMS --- */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-4">Toggle Active Social Icons</label>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {SOCIAL_PLATFORMS.map(social => {
              const isActive = pageData.contact.activeSocials.includes(social.id);
              return (
                <div key={social.id}
                  onClick={() => {
                    const newSocials = isActive ? pageData.contact.activeSocials.filter(id => id !== social.id) : [...pageData.contact.activeSocials, social.id];
                    updateNestedData('contact', 'activeSocials', newSocials);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isActive ? `border-[${social.hex}]/50 bg-[${social.hex}]/10` : 'border-white/5 bg-black/50 hover:bg-white/5'}`}
                >
                  <social.icon size={18} className={isActive ? social.color : 'text-gray-500'} />
                  <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-500'}`}>{social.name}</span>
                </div>
              )
            })}
          </div>

          <label className="block text-xs font-bold text-gray-400 uppercase mb-4 pt-4 border-t border-white/10">Assign Links</label>
          <div className="space-y-3">
            {pageData.contact.activeSocials.map(socialId => {
              const social = SOCIAL_PLATFORMS.find(s => s.id === socialId);
              return (
                <div key={socialId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: `${social.hex}20` }}><social.icon size={16} style={{ color: social.hex }} /></div>
                  <input type="text" placeholder={`Enter full URL for ${social.name}`}
                    value={pageData.contact.socialUrls?.[socialId] || ''}
                    onChange={(e) => {
                      const newUrls = { ...pageData.contact.socialUrls, [socialId]: e.target.value };
                      updateNestedData('contact', 'socialUrls', newUrls);
                    }}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 🚀 NEW BOX 2: QUICK CHAT BUTTON */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-green-400" /> Floating Quick Chat
          </h4>
          <p className="text-xs text-gray-400 mb-4">Set up a WhatsApp or Messenger button for the bottom corner of your site.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Platform</label>
                <select
                  value={pageData.contact?.quickChatPlatform || 'whatsapp'}
                  onChange={(e) => {
                    const platform = e.target.value;
                    const color = platform === 'whatsapp' ? '#25D366' : platform === 'messenger' ? '#00B2FF' : '#EA4335';
                    updateNestedData('contact', 'quickChatPlatform', platform);
                    updateNestedData('contact', 'quickChatColor', color);
                  }}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="messenger">FB Messenger</option>
                  <option value="gmail">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Hover Label Text</label>
                <input
                  type="text"
                  placeholder="e.g. Chat with us!"
                  value={pageData.contact?.quickChatLabel || ''}
                  onChange={(e) => updateNestedData('contact', 'quickChatLabel', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Direct Link / Phone URL</label>
              <input
                type="text"
                placeholder="https://wa.me/1234567890"
                value={pageData.contact?.quickChatUrl || ''}
                onChange={(e) => updateNestedData('contact', 'quickChatUrl', e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

      </div>

      {/* --- PREVIEW DOCK --- */}
      <div className="bg-[#050505] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col justify-end p-8 shadow-inner">
        <h4 className="absolute top-8 left-8 text-white/20 font-black text-4xl">Preview<br />Floating Dock</h4>
        <div className="flex gap-4 justify-center items-center bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-xl mx-auto shadow-2xl">
          {pageData.contact.activeSocials.length > 0 ? (
            SOCIAL_PLATFORMS.filter(s => pageData.contact.activeSocials.includes(s.id)).map(social => (
              <div key={social.id} className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-lg" style={{ boxShadow: `0 5px 15px ${social.hex}30` }}>
                <social.icon size={20} style={{ color: social.hex }} />
              </div>
            ))
          ) : (
            <span className="text-gray-500 text-sm font-bold px-4">Select platforms to generate dock</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep9SEO = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">SEO & Analytics</h3>
          <p className="text-sm text-gray-400">Ensure your page ranks high and tracks correctly.</p>
        </div>

        <div className="space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">SEO Title Tag</label><input type="text" value={pageData.seo.title} onChange={(e) => updateNestedData('seo', 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" maxLength="60" /></div>
          <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Description</label><textarea value={pageData.seo.description} onChange={(e) => updateNestedData('seo', 'description', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none h-24 resize-none" maxLength="160" /></div>
        </div>
      </div>

      <div className="bg-white flex flex-col p-8 rounded-3xl shadow-inner font-sans">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-6 flex items-center gap-2"><Search size={14} /> Google Search Preview</h4>
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {pageData.brand.logo ? <img src={pageData.brand.logo} className="w-full h-full object-cover" /> : <Globe size={16} className="text-gray-500" />}
            </div>
            <div>
              <p className="text-sm text-gray-800 font-medium leading-none">{pageData.brand.name || 'Your Brand Name'}</p>
              <p className="text-xs text-gray-500 leading-none mt-1">https://{pageData.publish.customDomain || '3duniverse'}.app</p>
            </div>
          </div>
          <h3 className="text-xl text-blue-800 font-normal hover:underline cursor-pointer truncate">{pageData.seo.title || 'Page Title Will Appear Here'}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{pageData.seo.description || 'Your highly optimized meta description will appear here.'}</p>
        </div>
      </div>
    </div>
  );

  const renderStep10Publish = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Publish Settings</h3>
          <p className="text-sm text-gray-400">Configure your domain and push to the edge network.</p>
        </div>
        <div className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Custom Domain (Pro)</label>
            <div className="flex gap-2">
              <input type="text" value={pageData.publish.customDomain} onChange={(e) => updateNestedData('publish', 'customDomain', e.target.value)} className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 outline-none" placeholder="www.yourbrand.com" disabled={userTier === 'free'} />
            </div>
            {userTier === 'free' && <p className="text-xs text-orange-400 mt-2">Upgrade to Pro to use custom domains.</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Page Visibility</label>
            <select value={pageData.publish.visibility} onChange={(e) => updateNestedData('publish', 'visibility', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
              <option value="public">Public (Indexed by Search Engines)</option>
              <option value="hidden">Hidden (Link only)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 relative flex flex-col items-center justify-center text-center shadow-inner">
        <Fingerprint size={64} className="text-cyan-500/40 mb-6" />
        <h4 className="text-2xl font-black text-white mb-2">Ready for Lift-off</h4>
        <p className="text-gray-400 text-sm mb-8 max-w-sm">Your 3D environment will be deployed to a global edge network for instant loading worldwide.</p>
        <button onClick={handlePublish} className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105">
          <Send size={18} /> DEPLOY SECURELY
        </button>
      </div>
    </div>
  );

  const renderThemeModal = () => {
    if (!isThemeModalOpen) return null;

    const ALL_THEMES = [
      { id: 'theme-1', name: 'Cyber Neon Mall', category: 'E-Commerce', style: 'Dark & Glowing', pro: false, bg: 'from-pink-600/30 to-purple-900/40', element: 'neon-grid', desc: 'Vibrant fluorescent geometries optimized for cutting-edge storefront showcases.' },
      { id: 'theme-2', name: 'Space Market', category: 'E-Commerce', style: 'Galactic & Orbital', pro: false, bg: 'from-blue-600/30 to-slate-900', element: 'orbit-rings', desc: 'A deep space orbital platform system loop designed for high-end commerce catalogs.' },
      { id: 'theme-3', name: 'Golden Prestige', category: 'E-Commerce', style: 'Luxury & Reflective', pro: true, bg: 'from-amber-600/20 to-stone-900', element: 'luxury-gems', desc: 'Premium raycast gold reflections and volumetric luxury rendering paths.' },
      { id: 'theme-4', name: 'Cyber Lab', category: 'Digital Gadgets', style: 'Computational Field', pro: false, bg: 'from-cyan-600/30 to-zinc-900', element: 'matrix-nodes', desc: 'An immersive matrix data stream array custom-tailored for electronic spec structures.' },
      { id: 'theme-5', name: 'Tron Grid', category: 'Digital Gadgets', style: 'Vector Landscape', pro: false, bg: 'from-teal-600/30 to-emerald-950/20', element: 'vector-lines', desc: 'Infinite reactive laser coordinates mapping hardware telemetry layers.' },
      { id: 'theme-6', name: 'Portal Dimension', category: 'Digital Gadgets', style: 'Energy Vortex Core', pro: true, bg: 'from-purple-600/30 to-indigo-950', element: 'vortex-core', desc: 'Dynamic gravitational core pulling abstract geometry arrays into an active space vertex.' },
      { id: 'theme-7', name: 'Skyline Estate', category: 'Real Estate', style: 'Holographic City', pro: false, bg: 'from-sky-600/30 to-slate-900', element: 'city-wireframe', desc: 'Wireframe urban developments scaling through light coordinates for development showcases.' },
      { id: 'theme-8', name: 'Dream Hall', category: 'Real Estate', style: 'Minimalist Floating', pro: false, bg: 'from-violet-600/20 to-neutral-900', element: 'minimal-blocks', desc: 'Serene white architectural physics blocks hovering in clean responsive containers.' },
      { id: 'theme-9', name: 'Frozen Platinum', category: 'Real Estate', style: 'Crystalline Glacial', pro: true, bg: 'from-blue-400/20 to-indigo-950', element: 'crystal-shards', desc: 'Refractive glacial materials interacting with ambient system lights for luxury agencies.' },
      { id: 'theme-10', name: 'Cosmic Library', category: 'Learning', style: 'Swirling Information', pro: false, bg: 'from-fuchsia-600/30 to-purple-950', element: 'stars-orbit', desc: 'Stellar educational nebulae tracking information streams along user coordinate curves.' },
      { id: 'theme-11', name: 'Ai Sphere', category: 'Learning', style: 'Neural Node Networks', pro: false, bg: 'from-cyan-500/20 to-slate-900', element: 'neural-mesh', desc: 'Interconnected glowing synaptic lanes mapping live AI computation grids.' },
      { id: 'theme-12', name: 'Genetic Matrix', category: 'Learning', style: 'Biological Helix', pro: true, bg: 'from-emerald-500/20 to-stone-900', element: 'dna-helix', desc: 'Double-helix particle structures utilizing high-performance rendering configurations.' },
      { id: 'theme-13', name: 'Command Center', category: 'Agency', style: 'Tactical Mainframe', pro: false, bg: 'from-red-600/20 to-zinc-900', element: 'tactical-grid', desc: 'Sleek, diagnostic agency environment tracking server frames and deployment statuses.' },
      { id: 'theme-14', name: 'Crystal Vault', category: 'Agency', style: 'Refractive Geometric', pro: false, bg: 'from-indigo-500/20 to-slate-900', element: 'refractive-shapes', desc: 'Polygonal crystal monolith layouts responding cleanly to global cursor coordinates.' },
      { id: 'theme-15', name: 'Dark Matter', category: 'Agency', style: 'Volumetric Physics', pro: true, bg: 'from-purple-900/40 to-neutral-950', element: 'physics-cloud', desc: 'High-end dark layout matrix computing fluid particle fields for creative portfolios.' }
    ];

    const THEME_CATEGORIES = ['All', 'E-Commerce', 'Digital Gadgets', 'Real Estate', 'Learning', 'Agency'];
    const activeSelectedTheme = ALL_THEMES.find(t => t.id === pageData.setup?.themeId) || ALL_THEMES[0];

    const handleThemeSelect = (themeId) => {
      let presets = { animationIntensity: 60, particles: true, floating: true, navStyle: 'standard', contentWidth: 'boxed' };

      if (['theme-1', 'theme-3', 'theme-6', 'theme-12'].includes(themeId)) {
        presets = { animationIntensity: 85, particles: true, floating: true, navStyle: 'floating', contentWidth: 'fluid' };
      } else if (['theme-2', 'theme-5', 'theme-7', 'theme-13'].includes(themeId)) {
        presets = { animationIntensity: 40, particles: true, floating: false, navStyle: 'sticky', contentWidth: 'boxed' };
      }

      setPageData(prev => ({ ...prev, setup: { ...prev.setup, themeId }, theme: { ...prev.theme, ...presets } }));
      setIsThemeModalOpen(false); // 🚀 Instantly unmounts and closes upon selection click
    };

    // Shared inner layout rendering block for card animations
    const renderModalPreviewBackground = (elementKey) => {
      return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          {elementKey === 'neon-grid' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff003c15_1px,transparent_1px),linear-gradient(to_bottom,#00ffff15_1px,transparent_1px)] bg-[size:12px_12px] animate-pulse" />}
          {elementKey === 'orbit-rings' && <div className="w-16 h-16 rounded-full border border-blue-400/20 border-dashed animate-spin [animation-duration:8s] mx-auto mt-8" />}
          {elementKey === 'vector-lines' && <div className="absolute inset-x-0 bottom-0 h-12 bg-[linear-gradient(to_bottom,transparent,#00ffff20)] [transform:perspective(40deg)_rotateX(60deg)] border-t border-cyan-500/30" />}
          {elementKey === 'vortex-core' && <div className="w-12 h-12 rounded-full border border-purple-500/30 animate-ping mx-auto mt-10" />}
          {elementKey === 'neural-mesh' && <div className="flex gap-2 justify-center mt-12 opacity-60"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" /><div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" /></div>}
          {elementKey === 'city-wireframe' && <div className="flex items-end gap-1 justify-center h-12 absolute bottom-0 inset-x-0"><div className="w-3 h-8 border border-cyan-500/20" /><div className="w-4 h-12 border border-purple-500/20" /></div>}
        </div>
      );
    };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 md:p-6 animate-in fade-in duration-200">
        <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-6xl h-[90vh] md:h-[88vh] rounded-2xl md:rounded-3xl flex flex-col shadow-2xl overflow-hidden transform will-change-transform">

          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-black/40 shrink-0">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2"><LayoutTemplate size={20} className="text-cyan-400" /> Theme Gallery Workspace</h2>
              <p className="hidden sm:block text-xs text-gray-500 mt-1">Cross-examine layout meshes across alternative market structures globally.</p>
            </div>
            <button onClick={() => setIsThemeModalOpen(false)} className="text-gray-400 hover:text-white px-4 py-2 border border-white/10 rounded-xl bg-white/5 text-xs font-mono transition-colors">Close [X]</button>
          </div>

          {/* Categories Tab Row */}
          <div className="px-4 md:px-6 py-3 bg-black/40 border-b border-white/5 flex flex-wrap gap-2 items-center shrink-0">
            <span className="text-[10px] font-mono uppercase text-gray-500 mr-2 hidden md:inline-block">Filter Niche Matrix:</span>
            {THEME_CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setModalCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${modalCategory === cat
                  ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                  : 'bg-transparent border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Live Status Header Banner Box */}
          <div className="mx-4 md:mx-6 mt-4 p-5 rounded-xl border border-white/5 relative overflow-hidden bg-black/50 backdrop-blur-md shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className={`absolute inset-0 bg-gradient-to-r ${activeSelectedTheme.bg} opacity-15 transition-all duration-700 ease-in-out`} />
            <div className="relative z-10 space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">Current Target Core: {activeSelectedTheme.category}</span>
                <span className="text-[9px] font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{activeSelectedTheme.id}</span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-white tracking-tight">{activeSelectedTheme.name} <span className="text-xs font-normal font-mono text-gray-500 ml-1">[{activeSelectedTheme.style}]</span></h3>
              <p className="text-xs text-gray-400 max-w-3xl font-light leading-relaxed">{activeSelectedTheme.desc}</p>
            </div>
            {activeSelectedTheme.pro && <span className="relative z-10 shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 text-black text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-wider shadow-xl">PRO ACTIVE MESH</span>}
          </div>

          {/* Cards Gallery Grid (Alive Cards) */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 bg-[#060608] custom-scrollbar">
            {ALL_THEMES
              .filter(t => modalCategory === 'All' || t.category === modalCategory)
              .map(theme => {
                const isSelected = pageData.setup?.themeId === theme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme.id)}
                    className={`rounded-xl md:rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden group relative flex flex-col justify-between min-h-[140px] transform-gpu ${isSelected ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/10 bg-black/40 hover:border-white/20 hover:bg-[#111115]'
                      }`}
                  >
                    {theme.pro && <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-black px-2.5 py-0.5 rounded text-black tracking-wider uppercase shadow-lg">PRO</div>}

                    <div className="h-28 md:h-32 bg-gray-900 relative flex items-center justify-center overflow-hidden border-b border-white/5">
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-80 group-hover:scale-105 transition-transform duration-500 will-change-transform`}></div>

                      {/* 🚀 Injected Card Preview Vector Animation */}
                      {renderModalPreviewBackground(theme.element)}

                      <Layout className={`w-8 h-8 md:w-10 md:h-10 relative z-10 transition-colors ${isSelected ? 'text-cyan-400' : 'text-white/20 group-hover:text-white/40'}`} />
                      <span className="absolute bottom-2 left-3 text-[9px] font-mono text-gray-500 bg-black/60 px-1.5 py-0.5 rounded border border-white/5">{theme.id}</span>
                    </div>

                    <div className="p-4 bg-black/20 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-500/60 block mb-0.5">{theme.category}</span>
                        <h4 className="text-sm md:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">{theme.name}</h4>
                        <p className="text-[11px] md:text-xs text-gray-400 mt-1 line-clamp-2 font-light">{theme.style} environment loop profiles.</p>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 py-1.5 px-3 rounded-lg w-full justify-center">
                          <CheckCircle2 size={12} /> Currently Selected Active Target
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
          </div>

        </div>
      </div>
    );
  };
  const renderPageTypeModal = () => {
    if (!isPageTypeModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-4xl rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Globe size={20} /> What are you building today?</h2>
            <button onClick={() => setIsPageTypeModalOpen(false)} className="text-gray-400 hover:text-white">Close [X]</button>
          </div>
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { id: 'ecommerce', name: 'E-Commerce', icon: ShoppingBag, color: 'text-cyan-400' },
              { id: 'learning', name: 'Learning Platform', icon: FileText, color: 'text-green-400' },
              { id: 'service', name: 'Service / Agency', icon: Users, color: 'text-blue-400' },
              { id: 'gadgets', name: 'Digital Gadgets', icon: Monitor, color: 'text-purple-400' }
            ].map(cat => (
              <div key={cat.id} onClick={() => createNewPage(cat.id)} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-white/30 cursor-pointer transition-all text-center group">
                <cat.icon size={32} className={`mx-auto mb-4 ${cat.color} group-hover:scale-110 transition-transform`} />
                <h3 className="text-sm font-bold text-white">{cat.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderBuilderArea = () => {
    const progressPercent = ((currentStepIndex + 1) / EDITOR_STEPS.length) * 100;

    return (
      <div className="flex flex-1 overflow-hidden relative">

        {/* 🚀 FIXED: hidden on mobile (hidden md:flex) so the workspace has room to breathe */}
        <aside className="hidden md:flex w-64 bg-[#0A0A0E] border-r border-white/5 overflow-y-auto custom-scrollbar flex-col py-6 pl-4 pr-2 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
          {['Phase 1: Architecture', 'Phase 2: Core Content', 'Phase 3: Refinement', 'Phase 4: Launch'].map(phase => (
            <div key={phase} className="mb-6">
              <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2 px-2">{phase}</div>
              <div className="space-y-1">
                {EDITOR_STEPS.filter(s => s.phase === phase).map(step => {
                  const isActive = activeEditorStep === step.id;
                  const isCompleted = EDITOR_STEPS.findIndex(s => s.id === step.id) < currentStepIndex;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setActiveEditorStep(step.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <step.icon size={16} className={isActive ? 'text-white' : 'opacity-70'} />
                      {step.label}
                      {isCompleted && !isActive && <CheckCircle2 size={14} className="text-green-500 ml-auto" />}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 flex flex-col bg-gradient-to-br from-[#050505] to-[#0A0A0E] relative overflow-hidden">
          <div className="h-1 w-full bg-white/5 absolute top-0 left-0 z-10">
            <div className="h-full bg-cyan-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div>
          </div>

          {/* 🚀 FIXED: Mobile padding (p-4) vs Desktop (md:p-8) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-32 md:pb-8">
            <div className="max-w-[1400px] mx-auto animate-in fade-in zoom-in-[0.98] duration-300 h-full">
              {activeEditorStep === 'setup' && renderStep1Setup()}
              {activeEditorStep === 'brand' && renderStep2Brand()}
              {activeEditorStep === 'category' && renderStepCategory()}
              {activeEditorStep === 'hero' && renderStep3Hero()}
              {activeEditorStep === 'blocks' && renderStep4Blocks()}
              {activeEditorStep === 'theme' && renderStep5Theme()}
              {activeEditorStep === 'ai' && renderStep6AI()}
              {activeEditorStep === 'media' && renderStep7Media()}
              {activeEditorStep === 'contact' && renderStep8Contact()}
              {activeEditorStep === 'seo' && renderStep9SEO()}
              {activeEditorStep === 'publish' && renderStep10Publish()}
            </div>
          </div>

          {/* 🚀 FIXED: Mobile Footer wraps elements nicely */}
          <div className="min-h-[5rem] py-4 md:py-0 md:h-20 border-t border-white/5 bg-[#0A0A0E]/80 backdrop-blur-md flex flex-wrap items-center justify-between px-4 md:px-8 z-10 shrink-0 gap-3">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest hidden sm:block">Step {currentStepIndex + 1} of {EDITOR_STEPS.length}</span>
            <button
              onClick={currentStepIndex === EDITOR_STEPS.length - 1 ? handlePublish : handleNextStep}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-white text-black rounded-xl text-xs md:text-sm font-black hover:bg-cyan-400 hover:text-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {currentStepIndex === EDITOR_STEPS.length - 1 ? 'Deploy Live' : `Next: ${EDITOR_STEPS[currentStepIndex + 1]?.label}`}
              {currentStepIndex !== EDITOR_STEPS.length - 1 && <ArrowRight size={14} />}
            </button>
          </div>
        </main>

      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex font-sans selection:bg-cyan-500/30 overflow-hidden">

      {/* GLOBAL SYSTEM LEFT SIDEBAR */}
      <aside className="w-16 lg:w-64 bg-[#0A0A0E] border-r border-white/5 flex flex-col relative z-30 transition-all duration-300 shadow-[10px_0_30px_rgba(0,0,0,0.3)]">

        <div className="p-4 border-b border-white/5 hidden lg:block shrink-0">
          <button onClick={() => window.location.href = '/'} className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold w-full bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl">
            <ArrowLeft size={16} /> Back to Homepage
          </button>
        </div>

        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5 shrink-0">
          <Globe className="text-cyan-500 w-8 h-8" />
          <span className="hidden lg:block text-xl font-black ml-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">3D <span className="text-white font-light">UNIVERSE</span></span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-cyan-600/10 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              title={item.label}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-cyan-400' : 'opacity-70'} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-2 border-t border-white/5 shrink-0">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl text-sm font-medium text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all group"
            title="Sign Out"
          >
            <LogOut size={20} className="opacity-70 group-hover:scale-105 transition-transform" />
            <span className="hidden lg:block font-bold">Sign Out</span>
          </button>
        </div>

        <div className="p-4 mt-auto border-t border-white/5 hidden lg:block shrink-0">
          {userTier === 'free' ? (
            <div onClick={handleBuyPro} className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-3 cursor-pointer hover:border-cyan-500 transition-colors group">
              <div className="flex items-center gap-3">
                <Crown size={16} className="text-yellow-500 transition-colors" />
                <span className="text-sm font-bold text-white">Free Plan</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 leading-tight">Click to Upgrade to Pro</p>
            </div>
          ) : (
            <div onClick={() => setActiveTab('settings')} className="bg-[#111118] border border-green-500/30 rounded-2xl p-3 flex items-center gap-3 shadow-[0_0_15px_rgba(34,197,94,0.1)] cursor-pointer hover:border-green-500/50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
              </div>
              <div>
                <h4 className="text-green-400 font-bold text-xs uppercase tracking-wider">Pro Active</h4>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* WORKSPACE APP WORKSPACE DISPLAY LAYOUTS */}
      {/* 🚀 ADDED THE MISSING OPENING MAIN TAG HERE */}
      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">

        {/* 🚀 RESPONSIVE HEADER: Wraps on mobile, stays inline on desktop */}
        <header className="min-h-[5rem] py-3 md:py-0 md:h-20 bg-[#0A0A0E] border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 z-40 shadow-sm shrink-0 gap-4 md:gap-0">

          <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-sm md:text-base font-bold text-white truncate max-w-[200px] md:max-w-none">
              {activeTab === 'editor' ? <span className="flex items-center gap-2"><Layout size={18} className="text-cyan-500" /> Workspace: {pageData.setup.name || 'Untitled Project'}</span> : activeTab === 'analytics' ? 'Dashboard Overview' : activeTab === 'inventory' ? 'Inventory Manager' : activeTab === 'settings' ? 'Account Settings' : 'My Landing Pages'}
            </span>

            {activeTab === 'editor' && (
              <div className="flex items-center gap-2 md:gap-3">
                <span className={`text-[9px] md:text-[10px] uppercase tracking-widest font-bold px-2 md:px-3 py-1 rounded-full border transition-colors duration-300 ${syncStatus === 'Published!' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' : syncStatus === 'Saved' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'}`}>
                  {syncStatus === 'Saved' || syncStatus === 'Published!' ? <span className="flex items-center gap-1"><CheckCircle2 size={10} /> {syncStatus}</span> : 'Syncing...'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-between md:justify-end">
            <button onClick={handlePreview} className="hidden sm:flex items-center gap-2 px-3 md:px-5 py-2 text-xs md:text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Eye size={16} /> Preview
            </button>
            <button onClick={handlePublish} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 text-xs md:text-sm font-black text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Send size={14} md:size={16} /> Publish
            </button>

            <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-colors" onClick={() => setActiveTab('settings')}>
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs md:text-sm font-bold text-white leading-tight">{userProfile.name}</span>
                <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider ${userTier === 'pro' ? 'text-green-400' : 'text-gray-500'}`}>{userTier === 'pro' ? 'PRO ACTIVE' : 'FREE PLAN'}</span>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 p-[2px] shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {userProfile.avatar ? <img src={userProfile.avatar} className="w-full h-full object-cover" /> : <span className="text-white font-bold text-xs md:text-sm">{userProfile.name.charAt(0)}</span>}
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'editor' && renderBuilderArea()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'pages' && renderPages()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'crm' && <OwnerCRM selectedProjectId={selectedProjectId} savedPages={savedPages} setSelectedProjectId={setSelectedProjectId} />}
        {activeTab === 'settings' && renderSettings()}
      </main>

      {/* 🚀 MOVED TO ROOT LEVEL: Overlays all components seamlessly across all devices */}
      {renderThemeModal()}
      {renderPageTypeModal()}

    </div>
  );
}

