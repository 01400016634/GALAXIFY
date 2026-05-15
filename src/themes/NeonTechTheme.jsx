import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Zap, Activity, Globe, Layout, Image as ImageIcon, Video } from 'lucide-react';

// 3D Grid Component for that "Outrun" look
const CyberGrid = () => {
  const gridRef = useRef();
  useFrame((state, delta) => {
    if (gridRef.current) {
      gridRef.current.position.z += delta * 4;
      if (gridRef.current.position.z > 2) gridRef.current.position.z = 0;
    }
  });
  return <gridHelper ref={gridRef} args={[100, 50, '#ff00ff', '#00ffff']} position={[0, -2, 0]} />;
};

const NeonTechTheme = ({ portfolioData }) => {
  // 1. Map all Phase 1-4 Workflow Data
  const {
    brand = {},
    hero = {},
    blocks = [],
    media = [],
    contact = {}
  } = portfolioData || {};

  const primaryColor = brand.colors?.[0] || '#00f3ff';

  const cardClass = "bg-black/80 border border-cyan-500/30 p-6 backdrop-blur-md relative overflow-hidden";

  return (
    <div className="min-h-screen w-full bg-black text-cyan-400 font-mono selection:bg-pink-500 selection:text-white overflow-x-hidden relative">

      {/* BACKGROUND: 3D Scene */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 1, 10], fov: 60 }}>
          <fog attach="fog" args={['#000000', 5, 40]} />
          <CyberGrid />
        </Canvas>
      </div>

      {/* Scan-line CRT Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-10" />

      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">

        {/* HEADER: Brand Identity & Logo */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 border-l-4 border-pink-500 pl-6"
        >
          {brand.logo && (
            <img src={brand.logo} alt="Logo" className="w-20 h-20 object-contain mb-6 filter drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
          )}
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">
            {brand.name || "SYSTEM_BOOT"}
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <span className="animate-pulse text-pink-500 text-2xl">►</span>
            <h2 className="text-xl md:text-2xl text-cyan-300 tracking-widest uppercase">
              {hero.headline || brand.tagline || "INITIALIZING_PROTOCOL"}
            </h2>
          </div>
        </motion.header>

        {/* SECTION BUILDER: Dynamic Blocks */}
        <div className="space-y-12 mb-24">
          {blocks.map((block, idx) => (
            <motion.section
              key={block.id || idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className={cardClass}
            >
              <div className="absolute top-0 right-0 p-2 text-[10px] text-pink-500/50 uppercase">Sector_{block.type}</div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tighter">
                <Terminal size={20} className="text-pink-500" /> // {block.title}
              </h3>

              {block.type === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {block.items?.map((item, i) => (
                    <div key={i} className="border-l border-white/10 pl-4 group hover:border-cyan-400 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold uppercase tracking-widest">{item.title}</span>
                        <Cpu size={14} className="opacity-30 group-hover:text-pink-500 transition-colors" />
                      </div>
                      <p className="text-cyan-100/60 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {block.type === 'faq' && (
                <div className="space-y-4">
                  {block.items?.map((item, i) => (
                    <div key={i} className="bg-white/5 p-4">
                      <div className="text-pink-500 font-bold mb-1">&gt; {item.q}</div>
                      <div className="text-cyan-100/80 text-sm pl-4"># {item.a}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>

        {/* MEDIA MANAGER: Visual Assets */}
        {media.length > 0 && (
          <section className="mb-24">
            <h3 className="text-2xl font-bold text-white mb-10 uppercase italic tracking-widest">// VISUAL_ARCHIVE</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media.map((file, idx) => (
                <div key={idx} className="aspect-square bg-black border border-white/10 overflow-hidden group relative">
                  {file.type?.includes('video') ? (
                    <video src={file.url} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <img src={file.url} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-px bg-white/5 absolute rotate-45" />
                    <div className="w-full h-px bg-white/5 absolute -rotate-45" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT & SOCIALS: Network Node */}
        <footer className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-sm opacity-50 uppercase tracking-[0.3em]">
            Status: Deployed_Securely
          </div>
          <div className="flex gap-6">
            {Object.entries(contact.socialUrls || {}).map(([platform, url]) => (
              <a
                key={platform} href={url} target="_blank" rel="noreferrer"
                className="p-3 border border-cyan-500/20 hover:border-pink-500 hover:text-pink-500 transition-all rounded-full bg-white/5 shadow-[0_0_10px_rgba(0,243,255,0.1)]"
              >
                <Globe size={18} />
              </a>
            ))}
          </div>
          <div className="text-[10px] text-white/20 font-bold uppercase">
            © 3D_UNIVERSE_v2.0
          </div>
        </footer>

      </div>
    </div>
  );
};

export default NeonTechTheme;