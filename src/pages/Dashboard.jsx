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
  LayoutDashboard, PlusCircle, Edit
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

// 🚀 UPDATED CATEGORY TEMPLATES
const CATEGORY_TEMPLATES = {
  'E-Commerce': [
    { title: 'Hero Section', content: { headline: '', subheadline: '', description: '' }, cta: { buttonText: '' } },
    { title: 'Product Section', customFields: { productName: '', price: '', discountPercent: '', stockStatus: '', productImages: '', description: '' }, cta: { buttonText: 'Buy Now' } },
    { title: 'Offer / Discount Section', content: { headline: 'Limited Offer', subheadline: '', description: '' }, cta: { buttonText: 'Claim' } },
    { title: 'Reviews Section', content: { headline: 'Customer Reviews' } },
    { title: 'CTA Section', content: { headline: 'Join Us' }, cta: { buttonText: 'Sign Up' } }
  ],
  'Digital Gadgets': [
    { title: 'Hero', content: { headline: '', subheadline: '' } },
    { title: 'Product Showcase', customFields: { productName: '', modelUploadGLB: '' } },
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
    { title: 'Course Details', customFields: { courseTitle: '', duration: '', level: '' } },
    { title: 'Curriculum', customFields: { modulesArray: '' } },
    { title: 'Instructor', customFields: { instructorName: '', certificateToggle: 'Yes' } },
    { title: 'Pricing', cta: { buttonText: 'Enroll' } }
  ],
  'Agency / Service': [
    { title: 'Hero', content: { headline: '' } },
    { title: 'Services', customFields: { agencyName: '', serviceList: '' } },
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

const renderStep4Blocks = () => {
  // 🚀 IF EMPTY: Show Category Selection Grid inside Section Builder
  if (pageData.blocks.length === 0) {
    return (
      <div className="space-y-8 h-full animate-in fade-in duration-500">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-2">Build Your Section Structure</h2>
          <p className="text-gray-400">Choose your industry to automatically generate the required sections and smart fields.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.keys(CATEGORY_TEMPLATES).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all text-center group"
            >
              <PlusCircle className="mx-auto text-gray-500 group-hover:text-cyan-400 mb-4" size={32} />
              <h3 className="text-white font-bold text-lg">{cat}</h3>
              <p className="text-[10px] text-gray-500 uppercase mt-2">Generate {CATEGORY_TEMPLATES[cat].length} Sections</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 🚀 IF BLOCKS EXIST: Show the actual Section Management UI
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-center bg-black/40 p-6 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutDashboard className="text-cyan-500" /> Structure: {pageData.setup.category}</h2>
          <p className="text-gray-400 text-sm">Managing {pageData.blocks.length} sections for your page.</p>
        </div>
        <div className="flex gap-2">
          {/* Change Category Button to restart structure */}
          <button onClick={() => setPageData({ ...pageData, blocks: [] })} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">Change Category</button>
          <button onClick={handleAddCustomSection} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 flex items-center gap-2 transition-all">
            <Plus size={16} /> Custom Section
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        {pageData.blocks.map((block, index) => (
          <div key={block.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all">

            {/* 1. SECTION HEADER BAR */}
            <div className="bg-black/40 p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 border-b border-white/10" onClick={() => handleUpdateBlock(block.id, 'collapsed', !block.collapsed)}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col opacity-50" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleMoveBlock(index, -1)} disabled={index === 0} className="hover:text-white disabled:opacity-20"><ChevronUp size={14} /></button>
                  <button onClick={() => handleMoveBlock(index, 1)} disabled={index === pageData.blocks.length - 1} className="hover:text-white disabled:opacity-20"><ChevronDown size={14} /></button>
                </div>
                <h3 className="text-white font-bold">{block.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{block.collapsed ? '[Click to Expand]' : '[Click to Collapse]'}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }} className="text-red-500/50 hover:text-red-400 p-2 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            {/* 2. THE EXPANDABLE FORM BOXES */}
            {!block.collapsed && (
              <div className="p-6 space-y-6 bg-black/20 animate-in slide-in-from-top-2 duration-300">

                {/* 🚀 BOX 5: NICHE DATA (Auto-Generates from CATEGORY_TEMPLATES) */}
                {block.customFields && Object.keys(block.customFields).length > 0 && (
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
                    <h4 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Fingerprint size={14} /> Box 5: Required Niche Data</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.keys(block.customFields).map(key => (
                        <div key={key}>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="text"
                            value={block.customFields[key]}
                            onChange={e => {
                              const val = e.target.value;
                              setPageData(prev => ({
                                ...prev,
                                blocks: prev.blocks.map(b => b.id === block.id ? { ...b, customFields: { ...b.customFields, [key]: val } } : b)
                              }));
                            }}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-cyan-500"
                            placeholder={`Enter ${key}...`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* BOX 1: CONTENT */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Box 1: Main Content</h4>
                    <input type="text" placeholder="Headline" value={block.content?.headline || ''} onChange={e => handleUpdateBlockData(block.id, 'content', 'headline', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white text-sm focus:border-cyan-500 outline-none" />
                    <textarea placeholder="Description / Narrative" rows="3" value={block.content?.description || ''} onChange={e => handleUpdateBlockData(block.id, 'content', 'description', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white text-sm focus:border-cyan-500 outline-none resize-none" />
                  </div>

                  {/* BOX 2: MEDIA */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Box 2: Visual Media</h4>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-black/40 border border-dashed border-white/20 rounded p-4 text-gray-500 hover:text-cyan-400 hover:border-cyan-500 transition-colors flex flex-col items-center gap-2">
                        <ImageIcon size={18} /> <span className="text-[10px] font-bold uppercase">Static Image</span>
                      </button>
                      <button className="flex-1 bg-black/40 border border-dashed border-white/20 rounded p-4 text-gray-500 hover:text-purple-400 hover:border-purple-500 transition-colors flex flex-col items-center gap-2">
                        <Box size={18} /> <span className="text-[10px] font-bold uppercase">3D / Video</span>
                      </button>
                    </div>
                  </div>

                  {/* BOX 3: CTA */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Box 3: Action Button</h4>
                    <input type="text" placeholder="Button Label (e.g. Order Now)" value={block.cta?.buttonText || ''} onChange={e => handleUpdateBlockData(block.id, 'cta', 'buttonText', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white text-sm focus:border-cyan-500 outline-none" />
                  </div>

                  {/* BOX 4: STYLE */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Box 4: Animations</h4>
                    <select value={block.style?.animationType || 'fade-up'} onChange={e => handleUpdateBlockData(block.id, 'style', 'animationType', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded p-2.5 text-white text-sm outline-none cursor-pointer">
                      <option value="fade-up">Smooth Fade Up</option>
                      <option value="3d-flip">3D Perspective Flip</option>
                      <option value="slide-right">Slide From Right</option>
                    </select>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
const INITIAL_PAGE_DATA = {
  id: '',
  status: 'Draft',
  setup: { name: '', category: 'ecommerce', goal: 'sales', themeId: 'theme-1', audience: '' },
  brand: { logo: '', name: '', tagline: '', aboutShort: '', colors: ['#06B6D4', '#3b82f6'], font: 'Inter' },
  hero: { headline: '', subheadline: '', ctaText: '', ctaLink: '', bgType: 'particles' },
  dynamic: { items: [] },
  blocks: [],
  theme: { style: 'glass', animationIntensity: 50, mouseEffects: true, scrollEffects: true, particles: true, floating: true, navStyle: 'standard', contentWidth: 'boxed' },
  ai: { tone: 'professional', generated: '' },
  contact: { email: '', phone: '', whatsapp: '', address: '', activeSocials: ['facebook', 'instagram'], socialUrls: {} },
  media: [],
  seo: { title: '', description: '', keywords: '', analyticsId: '' },
  publish: { subdomain: '', visibility: 'public', password: '', customDomain: '', publicUrl: '' }
};

const MENU_ITEMS = [
  { id: 'analytics', label: 'Overview & Analytics', icon: BarChart3 },
  { id: 'pages', label: 'My Landing Pages', icon: Globe },
  { id: 'editor', label: 'Page Builder Workflow', icon: Layout },
  { id: 'inventory', label: 'E-Commerce & Stock', icon: PackageSearch },
  { id: 'settings', label: 'Account Settings', icon: Settings }
];

const EDITOR_STEPS = [
  { id: 'setup', label: 'Project Setup', icon: Settings, phase: 'Phase 1: Architecture' },
  { id: 'brand', label: 'Brand Identity', icon: Palette, phase: 'Phase 1: Architecture' },
  { id: 'category', label: 'Category Selection', icon: LayoutTemplate, phase: 'Phase 1: Architecture' },
  { id: 'hero', label: 'Hero Section', icon: Monitor, phase: 'Phase 2: Core Content' },
  { id: 'blocks', label: 'Section Builder', icon: Layers, phase: 'Phase 2: Core Content' },
  { id: 'theme', label: 'Theme & Animations', icon: Sliders, phase: 'Phase 3: Refinement' },
  { id: 'ai', label: 'AI Content Optimizer', icon: Sparkles, phase: 'Phase 3: Refinement' },
  { id: 'media', label: 'Media Manager', icon: ImageIcon, phase: 'Phase 3: Refinement' },
  { id: 'contact', label: 'Contact & Socials', icon: Phone, phase: 'Phase 3: Refinement' },
  { id: 'seo', label: 'SEO & Performance', icon: Search, phase: 'Phase 4: Launch' },
  { id: 'publish', label: 'Publish settings', icon: Share2, phase: 'Phase 4: Launch' }
];

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

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [userTier, setUserTier] = useState('free');
  const [activeTab, setActiveTab] = useState('analytics');
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

    const userName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || '3D Universe User';
    const userAvatar = currentUser.user_metadata?.avatar_url || '';

    setUserProfile(prev => ({
      ...prev,
      name: userName,
      email: currentUser.email,
      avatar: userAvatar
    }));

    const fetchMongoData = async () => {
      try {
        const timestamp = new Date().getTime();
        const mongoResponse = await fetch(`http://localhost:5001/api/user/portfolio/${currentUser.id}?t=${timestamp}`);
        if (mongoResponse.ok) {
          const mongoData = await mongoResponse.json();
          if (mongoData.user) {
            setUserTier(mongoData.user.plan === 'pro' || mongoData.user.plan === 'premium' ? 'pro' : 'free');
          }
        }
        await fetch('http://localhost:5001/api/owner/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userName,
            email: currentUser.email,
            uid: currentUser.id
          })
        });
      } catch (error) {
        console.error("Database connection failed:", error);
      }
    };
    fetchMongoData();
  }, [currentUser]);

  const handleBuyPro = async () => {
    if (!currentUser) return alert("Please log in to upgrade.");
    try {
      const response = await fetch('http://localhost:5001/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentUser.id, plan: 'pro' })
      });

      if (response.ok) {
        alert("🎉 Successfully Upgraded to PRO!");
        setUserTier('pro');
      } else {
        alert("Server failed to update database.");
      }
    } catch (error) {
      alert("Payment gateway connection failed. Is Port 5001 running?");
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

  const loadPageForEditing = (page) => {
    setPageData({ ...page });
    setActiveTab('editor');
    setActiveEditorStep('setup');
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

  // ==========================================
  // RENDER FUNCTIONS (ANALYTICS, PAGES, INV, SETTINGS STAY THE SAME)
  // ==========================================
  const renderAnalytics = () => {
    const activeProject = savedPages.find(p => p.id === selectedProjectId) || savedPages[0];
    const visitorMultiplier = activeProject.views > 1000 ? 1 : 0.1;

    return (
      <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white">Overview & Analytics</h2>
            <p className="text-gray-400">Viewing real-time performance for specific projects.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-400">Select Project:</label>
              <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none cursor-pointer">
                {savedPages.map(p => <option key={p.id} value={p.id}>{p.setup.name || 'Untitled'}</option>)}
              </select>
            </div>
            <button onClick={initNewPageProcess} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Plus size={18} /> New Page
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Revenue', value: `$${(activeProject.revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
            { title: 'Active Visitors', value: Math.floor(120 * visitorMultiplier), icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
            { title: 'Avg. Conversion', value: activeProject.convRate, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { title: 'Page Views', value: activeProject.views?.toLocaleString(), icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' }
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div>
                <span className="text-xs font-bold text-green-400 flex items-center gap-1"><ArrowUpRight size={14} /> +{(Math.random() * 20).toFixed(1)}%</span>
              </div>
              <div>
                <h4 className="text-3xl font-black text-white">{stat.value}</h4>
                <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MapPin size={18} className="text-cyan-400" /> Live Visitor Map ({activeProject.setup.name})</h3>
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
    )
  };

  const renderPages = () => (
    <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white">My Landing Pages</h2>
          <p className="text-gray-400">Manage, edit, and duplicate your immersive web experiences.</p>
        </div>
        <button onClick={initNewPageProcess} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors">
          <Plus size={18} /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {savedPages.map(page => (
          <div key={page.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all group">
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
              <p className="text-xs text-gray-400 mb-4">{page.id}</p>

              <div className="flex justify-between items-center text-sm text-gray-300 mb-5 bg-black/30 p-3 rounded-xl border border-white/5">
                <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase">Views</span><span className="font-bold">{page.views?.toLocaleString() || 0}</span></div>
                <div className="flex flex-col"><span className="text-[10px] text-gray-500 uppercase">Conv. Rate</span><span className="font-bold text-green-400">{page.convRate || '0%'}</span></div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => loadPageForEditing(page)} className="flex-1 py-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg font-bold text-sm transition-colors border border-cyan-500/30">Edit Page</button>
                {page.publish?.publicUrl && (
                  <button onClick={() => window.open(page.publish.publicUrl, '_blank')} className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 hover:text-green-300 border border-green-500/20 transition-colors" title="View Live Site">
                    <Globe size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInventory = () => {
    const projectInventory = inventory.filter(item => item.projectId === selectedProjectId);

    return (
      <div className="p-8 h-full overflow-y-auto custom-scrollbar space-y-8">
        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white">E-Commerce Inventory</h2>
            <p className="text-gray-400">Manage products linked to specific landing pages.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-400">Context:</label>
              <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white outline-none cursor-pointer">
                {savedPages.map(p => <option key={p.id} value={p.id}>{p.setup.name || 'Untitled'}</option>)}
              </select>
            </div>
            <button className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs uppercase bg-black/50 text-gray-500 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-bold">Product Name</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectInventory.length > 0 ? projectInventory.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3"><Box size={16} className="text-cyan-400" /> {item.name}</td>
                  <td className="px-6 py-4">${item.price}</td>
                  <td className="px-6 py-4">{item.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${item.stock > 15 ? 'bg-green-500/20 text-green-400' : item.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded text-gray-300"><Settings size={14} /></button>
                    <button className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded text-gray-300 transition-colors"><Trash2 size={14} /></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products configured for this landing page yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  };

  const renderSettings = () => (
    <div className="p-8 max-w-4xl h-full overflow-y-auto custom-scrollbar space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white">Account Settings</h2>
        <p className="text-gray-400">Manage your profile, preferences, and subscription tier.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-4 flex items-center gap-2"><User size={18} className="text-cyan-400" /> Profile Information</h3>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center bg-black/50 overflow-hidden relative group cursor-pointer hover:border-cyan-500 transition-colors">
              {userProfile.avatar ? <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User size={32} className="text-gray-500" />}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={20} className="text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-500 font-bold">Change Avatar</span>
          </div>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label><input type="text" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" /></div>
              <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label><input type="email" value={userProfile.email} disabled className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-gray-500 outline-none cursor-not-allowed" /></div>
            </div>
            <div><label className="block text-xs font-bold text-gray-400 uppercase mb-2">Company / Agency Name</label><input type="text" value={userProfile.company} onChange={(e) => setUserProfile({ ...userProfile, company: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none" /></div>
            <button onClick={() => setSyncStatus('Saved')} className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center gap-2 transition-colors">Save Profile Changes</button>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2"><CreditCard size={18} className="text-green-400" /> Subscription Tier</h3>
        <div className="flex gap-4">
          <div className={`flex-1 p-6 rounded-xl border-2 transition-all ${userTier === 'free' ? 'border-gray-500 bg-gray-900' : 'border-white/10 bg-black/50'}`}>
            <h4 className="text-xl font-bold text-white mb-2">Starter Plan</h4>
            <p className="text-sm text-gray-400 mb-4">Basic features, watermarked branding, limited themes.</p>
            <div className="text-2xl font-black text-white">$0 <span className="text-sm font-normal text-gray-500">/mo</span></div>
          </div>

          <div onClick={userTier === 'free' ? handleBuyPro : undefined} className={`flex-1 p-6 rounded-xl border-2 transition-all relative overflow-hidden ${userTier === 'pro' ? 'border-green-500 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.15)] cursor-default' : 'border-orange-500/50 bg-black/50 hover:border-orange-500 cursor-pointer shadow-[0_0_20px_rgba(249,115,22,0.1)]'}`}>
            {userTier === 'pro' && <div className="absolute top-0 right-0 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase">Active</div>}
            {userTier === 'free' && <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase">Upgrade</div>}

            <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">Professional <Sparkles size={16} className={userTier === 'pro' ? 'text-green-400' : 'text-orange-400'} /></h4>
            <p className="text-sm text-gray-400 mb-4">Unlock Premium Themes, Custom Domains & API.</p>
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
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Logo Upload</label>
              <label className="w-full h-12 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-sm text-gray-500 hover:text-cyan-400 hover:border-cyan-500 cursor-pointer transition-colors bg-black/50 overflow-hidden">
                {pageData.brand.logo ? <img src={pageData.brand.logo} className="h-full object-contain" /> : <><Upload size={16} className="mr-2" /> Drop SVG/PNG</>}
                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                  const url = await uploadFileToStorage(e.target.files[0]);
                  if (url) updateNestedData('brand', 'logo', url);
                }} />
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
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Hero Section</h3>
          <p className="text-sm text-gray-400">The most important real estate. Hook your visitors instantly.</p>
        </div>
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
            <select value={pageData.hero.bgType} onChange={e => updateNestedData('hero', 'bgType', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none appearance-none">
              <option value="particles">3D Particles Engine</option>
              <option value="video">Cinematic Video Loop</option>
              <option value="image">Static High-Res Image</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#050505] border border-white/5 rounded-3xl relative overflow-hidden flex flex-col shadow-2xl">
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
                  <button className="w-full bg-black/50 border border-white/10 border-dashed rounded p-4 text-gray-400 hover:text-cyan-400 hover:border-cyan-500 transition-colors flex flex-col items-center gap-2">
                    <ImageIcon size={20} /> <span className="text-xs">Select from Media Library</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="bg-black/50 border border-white/10 rounded p-3 text-gray-400 text-xs flex items-center justify-center gap-2 hover:border-white/30"><Video size={14} /> Add Video</button>
                    <button className="bg-black/50 border border-white/10 rounded p-3 text-gray-400 text-xs flex items-center justify-center gap-2 hover:border-white/30"><Box size={14} /> Attach 3D Model</button>
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
    const themeDetails = [
      { id: 'theme-1', name: 'Cyber Neon', style: 'Dark & Glowing', bg: 'from-pink-600/40 to-purple-900' },
      { id: 'theme-2', name: 'Glass Corporate', style: 'Clean & Blurred', bg: 'from-gray-700 to-black' },
      { id: 'theme-3', name: 'Immersive VR', style: 'Full 3D Space', bg: 'from-cyan-600/40 to-black' },
      { id: 'theme-4', name: 'E-Comm Flow', style: 'High Conversion', bg: 'from-emerald-600/40 to-black' }
    ].find(t => t.id === pageData.setup.themeId) || { name: 'Custom Theme', style: 'User Defined', bg: 'from-cyan-600/40 to-black' };

    return (
      <div className="flex flex-col h-full space-y-6 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">Theme, Layout & Animations <Sparkles size={20} className="text-cyan-400" /></h3>
          <p className="text-sm text-gray-400">Control the global structure, aesthetics, and 3D physics of your page.</p>
        </div>

        <div className={`w-full shrink-0 h-32 rounded-2xl relative overflow-hidden flex items-center justify-between p-8 border border-white/10 shadow-lg group`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${themeDetails.bg} opacity-80 transition-transform duration-700 group-hover:scale-105`}></div>
          <div className="relative z-10">
            <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 mb-2 inline-block shadow-lg">Active Theme</span>
            <h2 className="text-3xl font-black text-white">{themeDetails.name}</h2>
            <p className="text-sm text-gray-300">{themeDetails.style}</p>
          </div>
          <button onClick={() => setIsThemeModalOpen(true)} className="relative z-10 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl font-bold transition-all border border-white/20 flex items-center gap-2 shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
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
                  <select value={pageData.theme.navStyle || 'standard'} onChange={(e) => updateNestedData('theme', 'navStyle', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
                    <option value="floating">Floating Dock</option>
                    <option value="sticky">Sticky Top Bar</option>
                    <option value="standard">Standard Inline</option>
                    <option value="hidden">Hidden / Immersive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content Width</label>
                  <select value={pageData.theme.contentWidth || 'boxed'} onChange={(e) => updateNestedData('theme', 'contentWidth', e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none cursor-pointer">
                    <option value="fluid">Fluid (100% Edge-to-Edge)</option>
                    <option value="boxed">Boxed (Standard Container)</option>
                    <option value="narrow">Narrow (Minimal/Blog)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-6">
              <h4 className="text-sm font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2"><Sparkles size={16} className="text-cyan-400" /> Animation & Physics</h4>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-4 flex justify-between">
                  Animation Intensity <span>{pageData.theme.animationIntensity}%</span>
                </label>
                <input type="range" min="0" max="100" value={pageData.theme.animationIntensity} onChange={(e) => updateNestedData('theme', 'animationIntensity', e.target.value)} className="w-full accent-cyan-500 cursor-pointer" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'particles', label: 'Particle Engine', desc: 'Background 3D dust' },
                  { id: 'floating', label: 'Floating Physics', desc: 'Hovering elements' },
                  { id: 'mouseEffects', label: 'Mouse Tracking', desc: 'Parallax movement' },
                  { id: 'scrollEffects', label: 'Scroll Reveal', desc: 'Fade in on scroll' }
                ].map(toggle => (
                  <div key={toggle.id} className="flex items-center justify-between p-3 bg-black/50 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold text-white">{toggle.label}</h4>
                      <p className="text-[10px] text-gray-500">{toggle.desc}</p>
                    </div>
                    <div
                      onClick={() => updateNestedData('theme', toggle.id, !pageData.theme[toggle.id])}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${pageData.theme[toggle.id] ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${pageData.theme[toggle.id] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#050505] border border-white/5 rounded-3xl p-8 relative flex flex-col items-center justify-center overflow-hidden shadow-inner group min-h-[400px]">
            {pageData.theme.particles && (
              <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full animate-ping opacity-50"></div>
                <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-cyan-500 rounded-full animate-ping opacity-50 delay-700"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-purple-500 rounded-full animate-ping opacity-50 delay-1000"></div>
              </div>
            )}

            <div className={`relative z-10 w-full h-full border-2 border-dashed flex flex-col overflow-hidden transition-all duration-1000
                      ${pageData.theme.animationIntensity > 50 ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-white/20 bg-white/5'}
                      ${pageData.theme.contentWidth === 'fluid' ? 'max-w-full rounded-none' : pageData.theme.contentWidth === 'narrow' ? 'max-w-[150px] rounded-3xl' : 'max-w-[250px] rounded-2xl'}
                   `}>
              {pageData.theme.navStyle !== 'hidden' && (
                <div className={`h-8 border-b border-white/20 flex items-center px-4 gap-2 
                             ${pageData.theme.navStyle === 'floating' ? 'm-4 rounded-full bg-white/10 backdrop-blur-md' : 'bg-white/5'}
                          `}>
                  <div className="w-3 h-3 rounded-full bg-cyan-500/50"></div>
                  <div className="flex-1"></div>
                  <div className="w-8 h-1.5 rounded bg-white/20"></div>
                </div>
              )}
              <div className={`flex-1 flex items-center justify-center p-8 transition-all
                         ${pageData.theme.floating ? 'animate-[bounce_3s_infinite_ease-in-out]' : ''}
                         ${pageData.theme.mouseEffects ? 'group-hover:rotate-6 group-hover:scale-105' : ''}
                      `}>
                <LayoutTemplate size={48} className={`text-white transition-all ${pageData.theme.animationIntensity > 50 ? 'animate-pulse' : 'opacity-50'}`} />
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
      </div>

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

    const handleThemeSelect = (themeId) => {
      let presets = {};
      if (themeId === 'theme-1') presets = { animationIntensity: 80, particles: true, floating: true, navStyle: 'floating', contentWidth: 'fluid' };
      else if (themeId === 'theme-2') presets = { animationIntensity: 30, particles: false, floating: false, navStyle: 'sticky', contentWidth: 'boxed' };
      else if (themeId === 'theme-3') presets = { animationIntensity: 100, particles: true, floating: true, navStyle: 'hidden', contentWidth: 'fluid' };
      else if (themeId === 'theme-4') presets = { animationIntensity: 40, particles: false, floating: true, navStyle: 'standard', contentWidth: 'boxed' };

      setPageData(prev => ({ ...prev, setup: { ...prev.setup, themeId }, theme: { ...prev.theme, ...presets } }));
      setIsThemeModalOpen(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-4xl h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><LayoutTemplate size={20} /> Theme Gallery</h2>
            <button onClick={() => setIsThemeModalOpen(false)} className="text-gray-400 hover:text-white">Close [X]</button>
          </div>
          <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { id: 'theme-1', name: 'Cyber Neon', style: 'Dark & Glowing', pro: false },
              { id: 'theme-2', name: 'Glass Corporate', style: 'Clean & Blurred', pro: false },
              { id: 'theme-3', name: 'Immersive VR', style: 'Full 3D Space', pro: true },
              { id: 'theme-4', name: 'E-Comm Flow', style: 'High Conversion', pro: true }
            ].map(theme => (
              <div key={theme.id} onClick={() => handleThemeSelect(theme.id)} className={`rounded-2xl border-2 transition-all cursor-pointer overflow-hidden group relative ${pageData.setup.themeId === theme.id ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-white/10 hover:border-white/30'}`}>
                {theme.pro && <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-lg">PRO</div>}
                <div className="h-40 bg-gray-900 relative flex items-center justify-center overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.id === 'theme-1' ? 'from-pink-600/40 to-purple-900' : theme.id === 'theme-2' ? 'from-gray-700 to-black' : theme.id === 'theme-3' ? 'from-cyan-600/40 to-black' : 'from-emerald-600/40 to-black'} opacity-80 group-hover:scale-105 transition-transform duration-500`}></div>
                  <Layout className="w-12 h-12 text-white/50 relative z-10" />
                </div>
                <div className="p-4 bg-black/80 backdrop-blur-md">
                  <p className="text-sm font-bold text-white mb-1">{theme.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase">{theme.style}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        <aside className="w-64 bg-[#0A0A0E] border-r border-white/5 overflow-y-auto custom-scrollbar flex flex-col py-6 pl-4 pr-2 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${isActive ? 'bg-cyan-600 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
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

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
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

          <div className="h-20 border-t border-white/5 bg-[#0A0A0E]/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 flex items-center gap-2"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Step {currentStepIndex + 1} of {EDITOR_STEPS.length}</span>
            <button
              onClick={currentStepIndex === EDITOR_STEPS.length - 1 ? handlePublish : handleNextStep}
              className="px-6 py-3 bg-white text-black rounded-xl text-sm font-black hover:bg-cyan-400 hover:text-white transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              {currentStepIndex === EDITOR_STEPS.length - 1 ? 'Deploy Live' : `Next: ${EDITOR_STEPS[currentStepIndex + 1]?.label}`}
              {currentStepIndex !== EDITOR_STEPS.length - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </main>
        {renderThemeModal()}
        {renderPageTypeModal()}
      </div>
    )
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex font-sans selection:bg-cyan-500/30 overflow-hidden">
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

      <main className="flex-1 flex flex-col relative z-10 h-screen overflow-hidden">
        <header className="h-20 bg-[#0A0A0E] border-b border-white/5 flex items-center justify-between px-8 z-40 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold text-white">
              {activeTab === 'editor' ? <span className="flex items-center gap-2"><Layout size={18} className="text-cyan-500" /> Workspace: {pageData.setup.name || 'Untitled Project'}</span> : activeTab === 'analytics' ? 'Dashboard Overview' : activeTab === 'inventory' ? 'Inventory Manager' : activeTab === 'settings' ? 'Account Settings' : 'My Landing Pages'}
            </span>
            {activeTab === 'editor' && (
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border transition-colors duration-300 ${syncStatus === 'Published!' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' :
                  syncStatus === 'Saved' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                    'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                  }`}>
                  {syncStatus === 'Saved' || syncStatus === 'Published!' ? <span className="flex items-center gap-1.5"><CheckCircle2 size={10} /> {syncStatus}</span> : 'Syncing...'}
                </span>

                {pageData.publish?.publicUrl && syncStatus === 'Published!' && (
                  <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg ml-3">
                    <Globe size={12} className="text-cyan-400" />
                    <span className="text-xs text-cyan-100 font-mono select-all">{pageData.publish.publicUrl}</span>
                    <button onClick={() => window.open(pageData.publish.publicUrl, '_blank')} className="text-cyan-400 hover:text-white ml-2"><ExternalLink size={12} /></button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handlePreview} className="hidden sm:flex items-center gap-2 px-5 py-2 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors">
              <Eye size={16} /> Preview Mode
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-2 text-sm font-black text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Send size={16} /> Publish Changes
            </button>

            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>

            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-xl transition-colors" onClick={() => setActiveTab('settings')}>
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-bold text-white leading-tight">{userProfile.name}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${userTier === 'pro' ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'text-gray-500'}`}>
                  {userTier === 'pro' ? 'PRO ACTIVE' : 'FREE PLAN'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-400 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                  {userProfile.avatar ? <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white font-bold">{userProfile.name.charAt(0)}</span>}
                </div>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'editor' && renderBuilderArea()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'pages' && renderPages()}
        {activeTab === 'inventory' && renderInventory()}
        {activeTab === 'settings' && renderSettings()}
        {renderPageTypeModal()}
      </main>
    </div>
  );
}