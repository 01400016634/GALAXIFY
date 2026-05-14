import React, { useState, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useAuth } from '../context/AuthContext';
import SolarSystem from '../components/hero/SolarSystem';
import ErrorBoundary from '../components/hero/ErrorBoundary';
import CanvasLoader from '../components/hero/CanvasLoader';
import InfoSection from '../components/layout/InfoSection';
import {
  Rocket, Sparkles, Globe, MonitorSmartphone, Code,
  CheckCircle, ChevronDown, Target, Layers, Zap, LayoutTemplate, ArrowRight
} from 'lucide-react';

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  // 👇 1. Get both login AND currentUser from AuthContext
  const { login, currentUser } = useAuth();

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 👇 2. Dynamic Button Logic: If logged in, go to Dashboard. If not, trigger Login.
  const handleCtaClick = async () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      try {
        await login();
        // The redirect to dashboard is handled in Login.jsx or usually happens 
        // automatically once currentUser is detected, but we add it here for safety.
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  const glassCard = "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors shadow-[0_4px_30px_rgba(0,0,0,0.1)]";

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden selection:bg-cyan-500/30 text-slate-200 font-sans">

      {/* BACKGROUND: 3D Solar System Scene */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 20, 35], fov: 45 }}>
            <Suspense fallback={<CanvasLoader />}>
              <SolarSystem />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* FOREGROUND: Scrolling UI Overlay */}
      <div className="relative z-10 pointer-events-none h-full w-full overflow-y-auto custom-scrollbar">

        <div className="pointer-events-auto flex flex-col min-h-full">

          {/* NAVIGATION */}
          <nav className="w-full bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="text-white" size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  3D <span className="text-cyan-400">UNIVERSE</span>
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
                <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                <a href="#solutions" className="hover:text-cyan-400 transition-colors">Solutions</a>
                <a href="#mission" className="hover:text-cyan-400 transition-colors">Mission</a>
                <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
              </div>
              <div className="flex items-center gap-4">
                {/* 👇 Navbar Button change based on Auth state */}
                <button onClick={handleCtaClick} className="bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2 rounded-full text-sm font-black transition-all">
                  {currentUser ? 'Open Dashboard' : 'Sign In'}
                </button>
              </div>
            </div>
          </nav>

          {/* HERO SECTION */}
          <section className="pt-32 pb-20 px-6 flex flex-col items-center text-center min-h-[80vh] justify-center">

            {/* 👇 3. STATUS DISPLAY: Show user identity in Hero if logged in */}
            {currentUser ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md animate-pulse">
                <CheckCircle size={14} /> Logged in as {currentUser.displayName}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md">
                <Rocket size={14} /> The Future of Spatial Web
              </div>
            )}

            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight max-w-5xl leading-tight mb-6 drop-shadow-2xl">
              Launch Your Brand into the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">3D Universe.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-3xl mb-10 leading-relaxed drop-shadow-lg font-medium">
              Transform your business vision into an immersive, cinematic landing page in seconds. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* 👇 4. Main Quick Button logic fix */}
              <button onClick={handleCtaClick} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-2">
                {currentUser ? 'Go to My Dashboard' : 'Build Your Space Now'} <ArrowRight size={18} />
              </button>

              <a href="#solutions" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-colors">
                Explore Themes
              </a>
            </div>
          </section>

          {/* MAIN CONTENT WRAPPER */}
          <div className="container mx-auto px-6 py-12 space-y-32">

            {/* MISSION & VISION */}
            <section id="mission" className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission & Vision</h2>
                <div className="space-y-6 text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-cyan-400">The Mission:</strong> "To empower every brand with the power of spatial storytelling."
                  </p>
                  <p>
                    <strong className="text-purple-400">Our Vision:</strong> We aim to be the world's leading engine for the 'Spatial Web'.
                  </p>
                </div>
              </div>

              <div className={glassCard}>
                <h3 className="text-xl font-bold text-white mb-6">Core Pillars</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <div className="mt-1 bg-cyan-500/20 p-2 rounded-lg text-cyan-400 h-fit"><Zap size={20} /></div>
                    <div><strong className="text-white block">Accessible Innovation</strong> Professional-grade 3D rendering.</div>
                  </li>
                  <li className="flex gap-4">
                    <div className="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400 h-fit"><Target size={20} /></div>
                    <div><strong className="text-white block">Conversion-First Design</strong> Mathematically optimized layout.</div>
                  </li>
                </ul>
              </div>
            </section>

            {/* FEATURES */}
            <section id="features">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Engineered for Growth</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={glassCard}>
                  <Sparkles className="text-cyan-400 mb-6" size={32} />
                  <h3 className="text-xl font-bold text-white mb-3">Instant Brand Deployment</h3>
                  <p className="text-slate-400 text-sm">Upload your brief and let AI generate your 3D space instantly.</p>
                </div>
                <div className={glassCard}>
                  <Globe className="text-blue-400 mb-6" size={32} />
                  <h3 className="text-xl font-bold text-white mb-3">One-Click Public Launch</h3>
                  <p className="text-slate-400 text-sm">Get a shareable URL instantly via our secure hosting.</p>
                </div>
              </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="max-w-[900px] mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white">Pricing Strategy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={glassCard + " flex flex-col"}>
                  <h3 className="text-2xl font-bold text-white">Starter Plan</h3>
                  <div className="text-4xl font-extrabold text-white mb-8 mt-4">Free</div>
                  <button onClick={handleCtaClick} className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">
                    {currentUser ? 'Manage Account' : 'Start Free'}
                  </button>
                </div>
                <div className="bg-white/10 backdrop-blur-2xl border border-orange-500/50 rounded-2xl p-8 flex flex-col relative">
                  <h3 className="text-2xl font-bold text-white">Professional</h3>
                  <div className="text-4xl font-extrabold text-white mb-8 mt-4">$15/mo</div>
                  <button onClick={handleCtaClick} className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:scale-[1.02] transition-transform">
                    {currentUser ? 'Upgrade Plan' : 'Upgrade Now'}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* FOOTER */}
          <div className="mt-auto bg-black/40 backdrop-blur-xl border-t border-white/10">
            <InfoSection />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;