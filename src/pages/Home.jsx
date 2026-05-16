import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import SolarSystem from '../components/hero/SolarSystem';
import ErrorBoundary from '../components/hero/ErrorBoundary';
import CanvasLoader from '../components/hero/CanvasLoader';
import InfoSection from '../components/layout/InfoSection';
import {
  Rocket, Sparkles, Globe, MonitorSmartphone, Code, HelpCircle,
  CheckCircle2, ChevronDown, Target, Layers, Zap, LayoutTemplate, ArrowRight,
  Database, ShieldCheck, ShoppingBag, Cpu, Home as HomeIcon, BookOpen, Briefcase,
  Wand2, Fingerprint, ImageIcon, Video, Box, Star, Send, Sliders, MessageSquare,
  User, Palette, Activity, Eye, Menu, Crown
} from 'lucide-react';

// 🚀 GLOBAL CONFIGURATION CONSTANTS
const glassCard = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.15)] border-white/10";

const METRICS_CARDS = [
  { icon: Activity, metric: "14,200+", label: "Immersive Spaces Generated Globally" },
  { icon: Zap, metric: "99.9%", label: "Spatial Delivery Network Uptime" },
  { icon: Layers, metric: "15 Themes", label: "High-Fidelity Ready-to-Deploy Assets" },
  { icon: Code, metric: "1-Click", label: "Production-Ready Setup & Initialization" }
];

const VERTICALS = [
  { name: "🛒 E-Commerce", sub: "High-Volume Retail", desc: "Built-in interactive 3D product display modules, synchronized price arrays, and secure transactional routing.", icon: ShoppingBag },
  { name: "📱 Digital Gadgets", sub: "Hardware Specs", desc: "Optimized for extreme macro-lens detailing, exploded product deconstructions, and high-tech industrial showcases.", icon: Cpu },
  { name: "🏢 Real Estate", sub: "Property Matrices", desc: "Sleek architectural visual panels, structural micro-previews, and spatial layouts optimized for project displays.", icon: HomeIcon },
  { name: "🎓 Learning Platforms", sub: "EdTech Hubs", desc: "Dynamic course path tracking, digital certification display shelves, and clean student progression interfaces.", icon: BookOpen },
  { name: "💼 Agency & Services", sub: "Premium Branding", desc: "Built for bold typographic styling, monumental layouts, and high-conversion client acquisition forms.", icon: Briefcase }
];

const ALL_15_THEMES = [
  { id: 'theme-1', name: 'Cyber Neon Mall', track: 'E-Commerce', style: 'Dark & Glowing', bg: 'from-pink-600/40 via-purple-900/50 to-black', element: 'neon-grid' },
  { id: 'theme-2', name: 'Space Market', track: 'E-Commerce', style: 'Galactic & Orbital', bg: 'from-blue-600/40 via-slate-900 to-black', element: 'orbit-rings' },
  { id: 'theme-3', name: 'Golden Prestige', track: 'E-Commerce', style: 'Luxury Storefronts', bg: 'from-amber-600/30 via-stone-900 to-black', pro: true, element: 'luxury-gems' },
  { id: 'theme-4', name: 'Cyber Lab', track: 'Digital Gadgets', style: 'Hardware Detailing', bg: 'from-cyan-600/40 via-zinc-900 to-black', element: 'matrix-nodes' },
  { id: 'theme-5', name: 'Tron Grid', track: 'Digital Gadgets', style: 'Vector Landscape', bg: 'from-teal-600/40 via-emerald-950/30 to-black', element: 'vector-lines' },
  { id: 'theme-6', name: 'Portal Dimension', track: 'Digital Gadgets', style: 'Energy Vortex Core', bg: 'from-purple-600/40 via-indigo-950 to-black', pro: true, element: 'vortex-core' },
  { id: 'theme-7', name: 'Skyline Estate', track: 'Real Estate', style: 'Holographic City', bg: 'from-sky-600/40 via-slate-900 to-black', element: 'city-wireframe' },
  { id: 'theme-8', name: 'Dream Hall', track: 'Real Estate', style: 'Minimalist Walkthrough', bg: 'from-violet-600/30 via-neutral-900 to-black', element: 'minimal-blocks' },
  { id: 'theme-9', name: 'Frozen Platinum', track: 'Real Estate', style: 'Structural Display', bg: 'from-blue-400/30 via-indigo-950 to-black', pro: true, element: 'crystal-shards' },
  { id: 'theme-10', name: 'Cosmic Library', track: 'Learning', style: 'Cosmic Curation', bg: 'from-fuchsia-600/40 via-purple-950 to-black', element: 'stars-orbit' },
  { id: 'theme-11', name: 'AI Sphere', track: 'Learning', style: 'Neural Node Networks', bg: 'from-cyan-500/30 via-slate-900 to-black', element: 'neural-mesh' },
  { id: 'theme-12', name: 'Genesis Matrix', track: 'Learning', style: 'Systematic Journeys', bg: 'from-emerald-500/30 via-stone-900 to-black', pro: true, element: 'dna-helix' },
  { id: 'theme-13', name: 'Command Center', track: 'Agency & Service', style: 'Heavy Typography', bg: 'from-red-600/30 via-zinc-900 to-black', element: 'tactical-grid' },
  { id: 'theme-14', name: 'Crystal Vault', track: 'Agency & Service', style: 'Refractive Geometries', bg: 'from-indigo-500/30 via-slate-900 to-black', element: 'refractive-shapes' },
  { id: 'theme-15', name: 'Dark Matter', track: 'Agency & Service', style: 'Extreme Void Scaling', bg: 'from-purple-900/50 via-neutral-950 to-black', pro: true, element: 'physics-cloud' }
];

const FAQS = [
  { q: "Do I need prior 3D modeling or development experience?", a: "No coding or design skills are needed. The engine reads your text directly from the dashboard forms and auto-configures all spatial placements." },
  { q: "Can I connect my own custom brand domain?", a: "Yes. Pro users can instantly point their landing pages to any custom domain to ensure complete brand ownership." },
  { q: "Can I edit the content of my landing page after publishing?", a: "Yes. Your user dashboard serves as a continuous management console. Any text or configuration changes save automatically and sync instantly to the public URL." },
  { q: "Is global fast hosting included with the platform?", a: "Yes, every landing page is securely hosted on our high-performance edge network optimized specifically to stream rich WebGL assets smoothly." }
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Dynamic review pipeline state matrix
  const [reviews, setReviews] = useState([
    { name: "Founder & Lead Architect", role: "Design Nexus System", review: "The seamless combination of automated backend synchronization and premium spatial rendering allowed us to deploy our product platform with incredible speed. Dwell times have increased significantly.", stars: 5 },
    { name: "E-Commerce Brand Manager", role: "Velo Retail Global", review: "Moving our product displays into an interactive environment completely transformed our conversion metrics. Our audience loves the fluid interaction.", stars: 5 }
  ]);
  const [newReview, setNewReview] = useState({ name: '', role: '', review: '', stars: 5 });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.review) return;
    setReviews([{ ...newReview }, ...reviews]);
    setNewReview({ name: '', role: '', review: '', stars: 5 });
  };

  const handleCtaClick = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  // 🚀 REDESIGNED LIVE VISUAL PREVIEWS (Larger & More Vibrant)
  const renderAbstractVisual = (elementKey) => {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-80">
        {elementKey === 'neon-grid' && <div className="absolute inset-0 bg-[linear-gradient(to_right,#ff003c30_1px,transparent_1px),linear-gradient(to_bottom,#00ffff30_1px,transparent_1px)] bg-[size:16px_16px] [transform:perspective(100px)_rotateX(60deg)] origin-bottom animate-pulse" />}
        {elementKey === 'orbit-rings' && <div className="w-24 h-24 rounded-full border-2 border-blue-400/50 border-dashed animate-spin [animation-duration:8s] mx-auto mt-12 relative"><div className="w-3 h-3 rounded-full bg-cyan-400 absolute top-1 left-1 shadow-[0_0_15px_#00ffff]" /></div>}
        {elementKey === 'luxury-gems' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2)_0%,transparent_70%)]"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-amber-500/30 rotate-45 animate-pulse" /></div>}
        {elementKey === 'matrix-nodes' && <div className="absolute inset-0 flex justify-around opacity-50"><div className="w-[1px] h-full bg-cyan-500/50 animate-pulse" /><div className="w-[1px] h-full bg-blue-500/50 animate-pulse delay-100" /></div>}
        {elementKey === 'vector-lines' && <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(to_bottom,transparent,#00ffff30)] [transform:perspective(60px)_rotateX(60deg)] border-t border-cyan-500/60" />}
        {elementKey === 'vortex-core' && <div className="w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/50 animate-pulse flex items-center justify-center mx-auto mt-14"><div className="w-8 h-8 rounded-full border-2 border-cyan-400/60 animate-ping" /></div>}
        {elementKey === 'city-wireframe' && <div className="flex items-end gap-2 justify-center h-20 absolute bottom-0 inset-x-0"><div className="w-5 h-12 border border-cyan-500/40 bg-cyan-500/10" /><div className="w-6 h-16 border border-purple-500/40 bg-purple-500/10" /></div>}
        {elementKey === 'minimal-blocks' && <div className="flex gap-4 justify-center items-center h-full"><div className="w-8 h-8 border border-white/30 rotate-12 animate-bounce" /></div>}
        {elementKey === 'crystal-shards' && <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 [transform:skewY(-15deg)]" />}
        {elementKey === 'stars-orbit' && <div className="absolute inset-0 bg-[radial-gradient(2px_2px_at_20px_30px,#fff,transparent),radial-gradient(2px_2px_at_60px_80px,#fff,transparent)] opacity-60 animate-pulse" />}
        {elementKey === 'neural-mesh' && <div className="flex gap-3 justify-center mt-16"><div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" /><div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" /></div>}
        {elementKey === 'dna-helix' && <div className="absolute inset-y-0 left-1/2 w-8 border-x border-dashed border-emerald-500/30 animate-pulse" />}
        {elementKey === 'tactical-grid' && <div className="absolute inset-0 border-b border-red-500/30 bg-[linear-gradient(rgba(255,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />}
        {elementKey === 'refractive-shapes' && <div className="w-20 h-20 border-2 border-indigo-500/40 rotate-45 animate-spin [animation-duration:20s] mx-auto mt-10" />}
        {elementKey === 'physics-cloud' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.2)_0%,transparent_60%)] scale-150 animate-pulse" />}
      </div>
    );
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-cyan-500/30 text-slate-200 font-sans">

      {/* INJECTED CAROUSEL KEYFRAME FOR INFINITE SLIDING MARQUEE TRACK */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-stream {
          display: flex;
          width: max-content;
          animation: marquee 50s linear infinite;
        }
        .animate-marquee-stream:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* BACKGROUND: 3D Solar System Canvas (Completely Untouched) */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 20, 35], fov: 45 }}>
            <Suspense fallback={<CanvasLoader />}>
              <SolarSystem />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* FOREGROUND: Scrolling Layout Engine Container */}
      <div className="relative z-10 pointer-events-none h-full w-full overflow-y-auto custom-scrollbar transform-gpu">
        <div className="pointer-events-auto flex flex-col min-h-full bg-gradient-to-b from-transparent via-black/40 to-[#040406]">

          {/* NAVIGATION */}
          <nav className="w-full bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-2xl">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="text-white animate-pulse" size={20} />
                </div>
                <h1 className="text-xl font-black tracking-widest text-white">
                  3D <span className="text-cyan-400 font-light">UNIVERSE</span>
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
                <a href="#workflow" className="hover:text-cyan-400 transition-colors">Workflow</a>
                <a href="#verticals" className="hover:text-cyan-400 transition-colors">Frameworks</a>
                <a href="#galleries" className="hover:text-cyan-400 transition-colors">Themes</a>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">Licensing</a>
              </div>
              <button onClick={handleCtaClick} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                {currentUser ? 'Open Dashboard' : 'Sign In'}
              </button>
            </div>
          </nav>

          {/* 1. HERO SECTION */}
          <section className="pt-28 pb-16 px-6 flex flex-col items-center text-center min-h-[85vh] justify-center max-w-5xl mx-auto relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-6 backdrop-blur-md">
              <Sparkles size={12} /> ✦ THE NEXT GENERATION OF THE SPATIAL WEB
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
              Build Cinematic 3D Websites. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-transparent bg-clip-text drop-shadow-[0_0_30px_rgba(6,182,212,0.2)]">Zero Code Required.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mb-10 leading-relaxed font-normal">
              Transform standard business metrics into immersive, high-conversion spatial experiences instantly. Select from 15 pre-engineered interactive environments built to capture attention and keep your visitors engaged 10x longer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 items-center justify-center">
              <button onClick={handleCtaClick} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_35px_rgba(6,182,212,0.4)] text-sm uppercase tracking-wider font-black">
                Launch Your Space Free →
              </button>
              <button onClick={() => document.getElementById('workflow').scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 text-sm uppercase tracking-wider flex items-center justify-center transition-all">
                Watch Live Demo
              </button>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mt-5 block">
              ⚡ No setup fees. Deploy instantly to global edge networks.
            </p>
          </section>

          {/* 2. SOCIAL PROOF & METRICS */}
          <section className="max-w-[1400px] mx-auto px-6 w-full py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {METRICS_CARDS.map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className={glassCard + " !p-6 flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden"}>
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 group-hover:text-cyan-400 transition-all">
                      <Icon size={36} />
                    </div>
                    <div className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">{card.metric}</div>
                    <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-4 leading-tight">{card.label}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CENTRAL SPACE PLATFORM WRAPPER */}
          <div className="max-w-[1400px] mx-auto px-6 py-32 space-y-40 w-full">

            {/* 3. HOW IT WORKS */}
            <section id="workflow" className="space-y-16">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Automation Sequence</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">From Vision to Immersive Reality in 4 Steps</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { num: "Step 01", title: "Framework Selection", desc: "Select an industry configuration engineered specifically for your commercial goals—from high-volume digital shops to elite corporate services." },
                  { num: "Step 02", title: "Contextual Inputs", desc: "Fill out a smart, dynamic form tailored entirely to your business niche. Our system completely handles the structural coordinates." },
                  { num: "Step 03", title: "Layout Automation", desc: "The core engine instantly formats your text placement, adjusts lighting contrast, and maps the smooth cinematic camera paths." },
                  { num: "Step 04", title: "Instant Deployment", desc: "Hit publish to deploy your immersive space to a lightning-fast public URL, or download the full code repository natively." }
                ].map((step, i) => (
                  <div key={i} className="bg-[#09090c] border border-white/5 rounded-2xl p-6 space-y-4 relative group hover:border-cyan-500/20 hover:bg-[#111116] transition-all duration-300">
                    <span className="text-xs font-mono font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded">{step.num}</span>
                    <h4 className="text-white font-bold text-base pt-2">{step.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. CATEGORY SHOWCASE */}
            <section id="verticals" className="space-y-16">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/20 uppercase tracking-widest font-bold">Spatial Ecosystems</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Pre-Engineered Spatial Ecosystems</h2>
                <p className="text-slate-400 font-light text-sm sm:text-base max-w-xl mx-auto">Select a framework structurally optimized to captivate your exact target demographic.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {VERTICALS.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <div key={i} className={glassCard + " !p-6 flex flex-col justify-between group hover:border-cyan-500/30 transition-all duration-300"}>
                      <div>
                        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-slate-400 group-hover:text-cyan-400 transition-colors inline-block mb-4">
                          <Icon size={18} />
                        </div>
                        <h4 className="text-white font-bold text-base tracking-wide leading-none">{v.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500 font-bold tracking-tight block mt-2">{v.sub}</span>
                        <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mt-4">{v.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
            {/* 5. SMART FORM ENGINE SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Dashboard Automation</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Context-Aware Smart Forms</h2>
                <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
                  Traditional website builders overwhelm you with thousands of confusing padding numbers, positional coordinates, and design menus. Our platform strips away the noise. The engine customizes your management dashboard dynamically based on your chosen category. You only see the fields relevant to your business—you focus entirely on your content, while our core architecture instantly translates it into beautiful 3D coordinates.
                </p>
              </div>

              {/* 🚀 UPGRADED: Removed opacity-30, added glassCard blur, and brightened text */}
              <div className={glassCard + " lg:col-span-6 !p-8 select-none relative overflow-hidden group bg-black/40"}>
                <div className="absolute top-4 left-5 flex gap-1.5">
                  <div className="w-2.5 h-2.5 bg-red-500/50 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-yellow-500/50 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-green-500/50 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                </div>

                <div className="space-y-4 pt-6 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/10 p-4 rounded-xl bg-black/60 shadow-inner group-hover:border-white/20 transition-colors">
                      <span className="text-slate-500 block mb-1 text-[9px] uppercase tracking-widest">Product Title Node</span>
                      <span className="text-white font-bold text-sm">Mechanical Core v2</span>
                    </div>
                    <div className="border border-white/10 p-4 rounded-xl bg-black/60 shadow-inner group-hover:border-white/20 transition-colors">
                      <span className="text-slate-500 block mb-1 text-[9px] uppercase tracking-widest">Price Coordinate</span>
                      <span className="text-green-400 font-bold text-sm">$1,499.00</span>
                    </div>
                  </div>
                  <div className="border border-white/10 p-4 rounded-xl bg-black/60 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                    <span className="text-slate-500 block mb-1 text-[9px] uppercase tracking-widest">Mesh File Target (.glb)</span>
                    <span className="text-cyan-400 block truncate">supabase://models/assets/core_v2.glb</span>
                  </div>
                </div>

                {/* Decorative scanner line */}
                <div className="absolute left-0 right-0 top-0 h-[1px] bg-cyan-500/40 animate-[bounce_4s_infinite] shadow-[0_0_15px_#00ffff]" />
              </div>
            </section>

            {/* 7. THE 15 PREMIUM THEMES SHOWCASE (Larger Cards & Vibrant Previews) */}
            <section id="galleries" className="space-y-12 overflow-hidden relative w-full">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Core Registry</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Premium Cinematic Landscapes</h2>
                <p className="text-slate-400 font-light text-sm sm:text-base max-w-xl mx-auto">Explore our complete core registry of 15 live interactive environment models categorized perfectly by industry matrix.</p>
              </div>

              {/* INFINITE AUTO MARQUEE TRACK */}
              <div className="w-full relative py-6 mask-gradient overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#040406] to-transparent z-10 pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#040406] to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee-stream gap-8">
                  {[...ALL_15_THEMES, ...ALL_15_THEMES].map((theme, idx) => (
                    <div key={idx} className="w-[340px] sm:w-[400px] shrink-0 bg-[#09090b] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl relative group">

                      {/* LARGER PREVIEW BOX WITH VIBRANT RENDER OUTPUT */}
                      <div className="h-48 bg-gradient-to-br from-slate-900 to-black relative flex items-center justify-center border-b border-white/5 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-70 group-hover:opacity-100 transition-opacity duration-500`} />
                        {renderAbstractVisual(theme.element)}

                        <LayoutTemplate size={32} className="text-white/20 relative z-10 group-hover:text-cyan-400/50 group-hover:scale-110 transition-all duration-500" />
                        <span className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-300 bg-black/80 px-2.5 py-1 rounded border border-white/10 shadow-lg">{theme.id}</span>
                        {theme.pro && <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[9px] font-black px-2.5 py-1 rounded uppercase font-mono shadow-xl">PRO</span>}
                      </div>

                      <div className="p-5 bg-black/40 border-t border-white/5 relative z-20">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400/80 block">{theme.track} Track</span>
                        <h4 className="text-white font-bold text-lg mt-1">{theme.name}</h4>
                        <p className="text-xs text-slate-400 font-light font-mono mt-1.5">{theme.style} target matrix loops active.</p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 8. FEATURES GRID */}
            <section className="space-y-12">
              <div className="text-center space-y-3">
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/20 uppercase tracking-widest font-bold">Engine Presets</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Built for High-Performance Spatial Growth</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "01 | Adaptive Section Engine", desc: "Add, delete, or rename content sections natively from your dashboard. The spatial camera re-routes paths automatically." },
                  { title: "02 | Fluid Motion Mechanics", desc: "Silky smooth scrolling mechanics, micro-bounce interactions, and reactive mouse-tracking effects out of the box." },
                  { title: "03 | Live Dashboard Synchronizer", desc: "Update text strings or price lists from your command center and see them update on the public live URL instantly." },
                  { title: "04 | Global Edge Deployment", desc: "Lightning-fast global loading times via an optimized spatial delivery network." },
                  { title: "05 | Custom Domain Support", desc: "Seamlessly connect your custom domain name to keep your corporate presence completely premium." }
                ].map((feat, i) => (
                  <div key={i} className={glassCard + " !p-6 space-y-3 group hover:border-cyan-500/30 transition-colors duration-300 shadow-xl bg-black/40"}>
                    <h4 className="text-white font-bold text-sm tracking-wide uppercase font-mono group-hover:text-cyan-400 transition-colors">{feat.title}</h4>
                    <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9. MEDIA MANAGER SHOWCASE */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Centralized Studio</span>
                <h2 className="text-3xl font-black text-white tracking-tight">Centralized Asset Studio</h2>
                <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
                  Consolidate your high-definition media source files seamlessly. Drag and drop transparent logos, optimized video loops, and high-fidelity 3D assets into a single dashboard system designed to compress and scale your visual elements effortlessly.
                </p>
              </div>
              <div className="lg:col-span-7 grid grid-cols-3 gap-4 w-full">
                {[{ n: 'Logos (PNG)', i: ImageIcon }, { n: 'Video Loops', i: Video }, { n: 'WebGL Files', i: Box }].map((item, idx) => (
                  <div key={idx} className={glassCard + " !p-5 text-center flex flex-col items-center justify-center gap-3 min-h-[140px] group hover:border-cyan-500/20"}>
                    <item.i size={24} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400 group-hover:text-white transition-colors">{item.n}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 10. TESTIMONIALS / SUCCESS STORIES */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-[#08080a] border border-white/5 p-8 rounded-2xl relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[80px] pointer-events-none" />

              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Ecosystem Proof</span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-3">Trusted by Forward-Thinking Brands</h3>
                  <p className="text-slate-400 text-xs font-light mt-1">Submit your workspace runtime validation parameters. Your comment blocks will append below instantly.</p>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3 font-sans">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Identity / Title" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500" required />
                    <input type="text" placeholder="Corporate Position" value={newReview.role} onChange={e => setNewReview({ ...newReview, role: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500" required />
                  </div>
                  <textarea placeholder="Write workspace runtime validation matrix review feedback..." rows="3" value={newReview.review} onChange={e => setNewReview({ ...newReview, review: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-cyan-500 resize-none" required />
                  <button type="submit" className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10">
                    <Send size={12} /> Inject Review Instance
                  </button>
                </form>
              </div>

              {/* Live Roller Review Output Stream */}
              <div className="lg:col-span-7 space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-5 bg-black/40 border border-white/5 rounded-xl space-y-3 relative group overflow-hidden transition-all hover:border-white/10 animate-in slide-in-from-top-3 duration-300">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">{rev.name.charAt(0)}</div>
                        <div>
                          <h5 className="text-white text-xs font-bold leading-none">{rev.name}</h5>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{rev.role}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-cyan-400">
                        {Array.from({ length: rev.stars || 5 }).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed relative z-10">"{rev.review}"</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 11. PRICING SECTION */}
            <section id="pricing" className="max-w-[900px] mx-auto space-y-12">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 uppercase tracking-widest font-bold">Licensing Models</span>
                <h2 className="text-3xl md:text-5xl font-black text-white mt-2">Clear, Predictable Commercial Tiering</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Starter Free Plan Card */}
                <div className={glassCard + " flex flex-col justify-between bg-black/40"}>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-wide text-white">STARTER PLAN</h3>
                    <div className="text-4xl font-black text-white pt-2 pb-4">$0 <span className="text-xs text-slate-500 font-mono">/ Free Forever</span></div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400 font-light pt-4 border-t border-white/10">
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> ✔ 1 Active Spatial Landing Page</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> ✔ Core Layout Blocks</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> ✔ Access to Base Theme Selection</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> ✔ 3D Universe Subdomain URL (brand.3duniverse.com)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-cyan-400 shrink-0" /> ✔ Standard Cloud Hosting Parameters</li>
                    </ul>
                  </div>
                  <button onClick={handleCtaClick} className="w-full py-3 rounded-xl border border-white/10 text-white text-xs uppercase tracking-wider font-bold hover:bg-white/5 transition-colors mt-8">
                    INITIALIZE FREE SPACE
                  </button>
                </div>

                {/* Pro Premium Plan Card */}
                <div className={glassCard + " flex flex-col justify-between relative border-orange-500/40 bg-black/40 shadow-[0_0_30px_rgba(249,115,22,0.05)]"}>
                  <span className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-black text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg font-mono">MOST POPULAR 👑</span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-wide text-white">PRO PLAN</h3>
                    <div className="text-4xl font-black text-white pt-2 pb-4">$15 <span className="text-xs text-slate-500 font-mono">/ Month</span></div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 font-light pt-4 border-t border-white/10">
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-400 shrink-0" /> ✔ Unlimited Immersive Pages</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-400 shrink-0" /> ✔ Unlock All 15 Premium Cinematic Themes</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-400 shrink-0" /> ✔ Connect Your Custom Domain (yourbrand.com)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-400 shrink-0" /> ✔ Zero Platform Watermarks</li>
                      <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-orange-400 shrink-0" /> ✔ Priority Edge Hosting Optimization</li>
                    </ul>
                  </div>
                  <button onClick={handleCtaClick} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all mt-8 shadow-lg shadow-orange-500/10">
                    UPGRADE TO PREMIUM ACCESS
                  </button>
                </div>

              </div>
            </section>

            {/* 12. FAQ SECTION */}
            <section className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl sm:text-4xl font-black text-white">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="bg-[#09090b] border border-white/5 rounded-xl overflow-hidden transition-all">
                    <button onClick={() => toggleFaq(idx)} className="w-full p-4 text-left flex justify-between items-center text-white hover:bg-white/[0.01] transition-colors">
                      <span className="font-bold text-sm sm:text-base flex items-center gap-2"><HelpCircle size={16} className="text-cyan-500" /> {faq.q}</span>
                      <ChevronDown size={14} className={`text-slate-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="p-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 bg-black/20 font-light animate-in fade-in duration-200">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 13. FINAL CTA SECTION */}
            <section className="text-center space-y-6 max-w-2xl mx-auto py-12 flex flex-col items-center justify-center">
              <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse"><Zap size={24} /></div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Ready to Step into the Third Dimension?</h2>
              <p className="text-slate-400 text-sm sm:text-base font-light max-w-md mx-auto">Join the future of web storytelling. Complete your business parameters and take your digital presence live globally in minutes.</p>
              <button onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 uppercase tracking-wider text-xs font-black mt-4">
                CREATE YOUR IMMERSIVE SPACE FREE
              </button>
            </section>

          </div>

          {/* 14. FOOTER */}
          <footer className="border-t border-white/5 bg-[#020203] relative z-10 py-16 px-6 text-gray-500 text-xs font-mono">
            <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
              <div className="space-y-3">
                <h5 className="text-white font-bold tracking-wider uppercase text-[10px]">Product</h5>
                <p className="text-slate-400 leading-relaxed font-light text-[11px]">Frameworks · 15 Premium Themes · Pricing · Edge Hosting</p>
              </div>
              <div className="space-y-3">
                <h5 className="text-white font-bold tracking-wider uppercase text-[10px]">Solutions</h5>
                <p className="text-slate-400 leading-relaxed font-light text-[11px]">E-Commerce · Digital Gadgets · Real Estate · Learning Hubs · Agency Spaces</p>
              </div>
              <div className="space-y-3">
                <h5 className="text-white font-bold tracking-wider uppercase text-[10px]">Resources</h5>
                <p className="text-slate-400 leading-relaxed font-light text-[11px]">Platform Documentation · API Access · System Status · Security</p>
              </div>
              <div className="space-y-3">
                <h5 className="text-white font-bold tracking-wider uppercase text-[10px]">Company</h5>
                <p className="text-slate-400 leading-relaxed font-light text-[11px]">Our Story · Contact Support · Terms of Service · Privacy Policy</p>
              </div>
            </div>

            <div className="max-w-[1400px] mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px]">
              <div className="flex items-center gap-2 text-gray-400 font-bold tracking-wider">
                <Globe size={14} className="text-cyan-400" /> 3D UNIVERSE ENGINE SUBSYSTEMS
              </div>
              <p className="text-center sm:text-right text-gray-600 font-sans">
                © 2026 3D UNIVERSE. Elevating digital reality globally.
              </p>
            </div>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default Home;