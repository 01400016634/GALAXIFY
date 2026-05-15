import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import {
  Flame, Zap, Globe, Shield,
  ArrowUpRight, Terminal, Activity, Layers
} from 'lucide-react';
import * as THREE from 'three';

// 1. CINEMATIC LAVA SHADER (The "Billion Dollar" Floor)
const MoltenFlow = () => {
  const mesh = useRef();
  // Using a custom shader for that hyper-realistic heat distortion
  useFrame((state) => {
    const { clock } = state;
    mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#ff4500') },
      uColorB: { value: new THREE.Color('#1a0500') }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying vec2 vUv;
      void main() {
        float flow = sin(vUv.x * 10.0 + uTime * 0.5) * 0.5 + 0.5;
        vec3 color = mix(uColorA, uColorB, flow * vUv.y);
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), []);

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 32, 32]} />
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
};

// 2. FLOATING OBSIDIAN DEBRIS
const ObsidianField = () => {
  const group = useRef();
  const count = 40;
  const positions = useMemo(() => {
    return Array.from({ length: count }, () => [
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 30
    ]);
  }, []);

  useFrame((state) => {
    group.current.rotation.y += 0.001;
    group.current.children.forEach((child, i) => {
      child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.005;
    });
  });

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <dodecahedronGeometry args={[Math.random() * 0.5, 0]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0} metalness={1} />
        </mesh>
      ))}
    </group>
  );
};

const LavaTheme = ({ portfolioData }) => {
  const { brand = {}, hero = {}, blocks = [], media = [], contact = {} } = portfolioData || {};
  const primaryColor = brand.colors?.[0] || '#ff4500';

  const glassStyle = "bg-black/40 backdrop-blur-2xl border border-orange-500/20 shadow-[0_8px_32px_rgba(255,69,0,0.15)]";

  return (
    <div className="min-h-screen bg-[#0a0500] text-orange-50 font-sans selection:bg-orange-500 overflow-x-hidden relative">

      {/* 3D VOLCANIC ENVIRONMENT */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 2, 15], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color={primaryColor} />
          <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} color="#ffaa00" />
          <MoltenFlow />
          <ObsidianField />
          <fog attach="fog" args={['#0a0500', 5, 45]} />
        </Canvas>
      </div>

      {/* HEAT DISTORTION OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,5,0,0.4)_100%)]" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 py-12">

        {/* HEADER: Dynamic Logo & Nav */}
        <nav className="flex justify-between items-center mb-32">
          <div className="flex items-center gap-4">
            {/* ROUND LOGO FIX */}
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-orange-600 to-yellow-400 shadow-[0_0_20px_rgba(255,69,0,0.4)]">
              <img
                // 👇 Changed the fallback URL here!
                src={brand.logo || "https://ui-avatars.com/api/?name=3D&background=ff4500&color=fff"}
                className="w-full h-full object-cover rounded-full border-2 border-black"
                alt="Brand Logo"
              />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-white">3D UNIVERSE</span>
          </div>
          <div className="flex gap-4">
            {Object.entries(contact.socialUrls || {}).map(([key, url]) => (
              <a key={key} href={url} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-orange-500 transition-all border border-white/10 group">
                <Globe size={18} className="group-hover:text-black" />
              </a>
            ))}
          </div>
        </nav>

        {/* HERO: The Core Visual Hook */}
        <section className="text-center space-y-8 mb-40">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h1 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_50px_rgba(255,69,0,0.3)]">
              {brand.name || "MOLTEN_PROTOCOL"}
            </h1>
            <p className="text-xl md:text-3xl text-orange-500 font-bold tracking-[0.2em] mt-4 uppercase italic">
              {hero.headline || "Forging Immersive Reality"}
            </p>
          </motion.div>

          {hero.ctaText && (
            <button className="px-10 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-black rounded-none skew-x-[-12deg] hover:skew-x-0 transition-all shadow-[0_0_30px_rgba(255,69,0,0.5)] uppercase italic tracking-widest">
              {hero.ctaText}
            </button>
          )}
        </section>

        {/* SECTION BUILDER: Modular Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-40">
          {blocks.map((block) => (
            <div key={block.id} className={`${glassStyle} p-10 rounded-none border-l-4 border-l-orange-600 relative group overflow-hidden`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <Layers className="text-orange-500" size={40} />
              </div>
              <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3 uppercase italic">
                <Activity size={20} className="text-orange-500" /> {block.title}
              </h3>

              {block.type === 'features' && (
                <div className="space-y-6">
                  {block.items?.map((item, i) => (
                    <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-4">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 animate-pulse" />
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm">{item.title}</h4>
                        <p className="text-orange-200/60 text-xs mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* MEDIA MANAGER: Cinematic Assets */}
        {media.length > 0 && (
          <section className="mb-40">
            <h2 className="text-3xl font-black text-white mb-12 uppercase italic flex items-center gap-4">
              <span className="w-12 h-[2px] bg-orange-600" /> VISUAL_ARCHIVE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {media.map((file, idx) => (
                <div key={idx} className="aspect-video relative overflow-hidden group border border-white/10 shadow-2xl">
                  {file.type?.includes('video') ? (
                    <video src={file.url} autoPlay loop muted className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  ) : (
                    <img src={file.url} alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                  )}
                  <div className="absolute inset-0 bg-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FOOTER: Global Command */}
        <footer className="pt-20 border-t border-orange-500/20 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4 font-mono text-xs uppercase tracking-widest text-orange-500">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            NODE_STATUS: STABLE_DEPLOYMENT
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-white">
            <a href="#" className="hover:text-orange-500">Protocol_Terms</a>
            <a href="#" className="hover:text-orange-500">Secure_Access</a>
          </div>
          <div className="text-[10px] font-black text-white/40 uppercase">
            EST. 2026 // 3D_UNIVERSE_CORE
          </div>
        </footer>

      </div>
    </div>
  );
};

export default LavaTheme;