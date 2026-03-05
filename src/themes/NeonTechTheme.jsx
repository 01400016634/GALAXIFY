import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const CyberGrid = () => {
  const gridRef = useRef();
  
  useFrame((state, delta) => {
    if (gridRef.current) {
      // Move grid towards camera (positive Z) to simulate moving forward
      gridRef.current.position.z += delta * 4;
      // Reset position to create endless loop effect
      // Grid cell size is 100/50 = 2 units
      if (gridRef.current.position.z > 2) {
        gridRef.current.position.z = 0;
      }
    }
  });

  return (
    <gridHelper 
      ref={gridRef} 
      args={[100, 50, '#00ffff', '#00ffff']} 
      position={[0, -2, 0]}
    />
  );
};

const DataPacket = ({ position }) => {
  const mesh = useRef();
  const [rotationSpeed] = useState(() => ({
    x: (Math.random() - 0.5) * 0.05,
    y: (Math.random() - 0.5) * 0.05
  }));

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += rotationSpeed.x;
      mesh.current.rotation.y += rotationSpeed.y;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#ff00ff" wireframe />
    </mesh>
  );
};

const FloatingData = () => {
  const count = 30;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 40, // x
        (Math.random() - 0.5) * 20, // y
        (Math.random() - 0.5) * 40 - 10 // z
      ]);
    }
    return pos;
  }, []);

  return (
    <group>
      {positions.map((p, i) => (
        <DataPacket key={i} position={p} />
      ))}
    </group>
  );
};

const NeonTechTheme = ({ portfolioData }) => {
  const { name, designation, about, skills, projects, experience } = portfolioData;

  // Glitch-like entrance animation
  const glitchVariant = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 10,
        staggerChildren: 0.1 
      }
    }
  };

  const cardClass = "bg-black/60 border border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] p-6 backdrop-blur-sm rounded-none";

  return (
    <div className="min-h-screen w-full bg-black text-cyan-400 font-mono selection:bg-pink-500 selection:text-white overflow-x-hidden relative">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 1, 10], fov: 60 }}>
          <fog attach="fog" args={['#000000', 5, 40]} />
          <CyberGrid />
          <FloatingData />
        </Canvas>
      </div>

      {/* Scan-line Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

      <div className="relative z-20 max-w-6xl mx-auto px-6 py-20">
        
        {/* Hero Section */}
        <motion.header 
          initial="hidden"
          animate="visible"
          variants={glitchVariant}
          className="mb-24 border-l-4 border-pink-500 pl-6 py-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2 text-white uppercase drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            {name || "SYSTEM_USER"}
          </h1>
          <div className="flex items-center gap-3">
            <span className="animate-pulse text-pink-500 text-2xl">►</span>
            <h2 className="text-xl md:text-2xl text-cyan-300 tracking-widest uppercase">
              {designation || "NETRUNNER"}
            </h2>
          </div>
        </motion.header>

        {/* About Section - Terminal Style */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className={cardClass}>
            <div className="bg-cyan-950/10 p-4">
              <h3 className="text-pink-500 text-xl mb-4 flex items-center gap-2">
                <span className="text-cyan-400">root@portfolio:~$</span> cat about.txt
              </h3>
              <p className="text-lg text-cyan-100/80 leading-relaxed">
                {about || "Initializing... User is a creative technologist specializing in high-performance digital interfaces. System status: ONLINE."}
                <span className="animate-pulse inline-block w-3 h-5 bg-cyan-400 ml-1 align-middle" />
              </p>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Skills - Digital Loading Sequences */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-cyan-500/30 pb-2 inline-block">
              // SYSTEM_CAPABILITIES
            </h3>
            <div className="space-y-6">
              {(skills && skills.length > 0 ? skills : [{name: 'HACKING', level: 90}, {name: 'CODING', level: 75}]).map((skill, idx) => (
                <div key={idx} className="font-mono text-sm">
                  <div className="flex justify-between mb-1 text-cyan-300">
                    <span>{skill.name}</span>
                    <span>[{skill.level}%]</span>
                  </div>
                  <div className="h-6 w-full bg-gray-900 border border-gray-700 relative flex items-center px-1">
                    {/* Generating "blocks" based on percentage */}
                    <div className="h-3 bg-pink-500 shadow-[0_0_10px_#f472b6]" style={{ width: `${skill.level}%` }} />
                    {/* Scanline on bar */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] w-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects - Code Blocks */}
          <section>
            <h3 className="text-2xl font-bold text-white mb-8 border-b border-cyan-500/30 pb-2 inline-block">
              // EXECUTED_PROTOCOLS
            </h3>
            <div className="space-y-6">
              {(projects && projects.length > 0 ? projects : (experience || [{title: 'PROJECT_ZERO', description: 'Classified data.'}])).map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className={cardClass}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title || item.role}
                      </h4>
                      <span className="text-xs text-pink-500 border border-pink-500/50 px-2 py-0.5">
                        {item.company || "V1.0"}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="text-xs text-cyan-600">
                      &lt;status&gt;DEPLOYED&lt;/status&gt;
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default NeonTechTheme;