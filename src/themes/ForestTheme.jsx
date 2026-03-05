import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const Firefly = ({ initialPosition }) => {
  const mesh = useRef();
  const [randoms] = useState(() => ({
    speed: 0.2 + Math.random() * 0.3,
    xOffset: Math.random() * 100,
    yOffset: Math.random() * 100,
    zOffset: Math.random() * 100,
    xAmp: 1 + Math.random() * 2,
    yAmp: 1 + Math.random() * 2,
    zAmp: 1 + Math.random() * 2,
  }));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.position.x = initialPosition[0] + Math.sin(t * randoms.speed + randoms.xOffset) * randoms.xAmp;
      mesh.current.position.y = initialPosition[1] + Math.cos(t * randoms.speed * 0.8 + randoms.yOffset) * randoms.yAmp;
      mesh.current.position.z = initialPosition[2] + Math.sin(t * randoms.speed * 0.5 + randoms.zOffset) * randoms.zAmp;
    }
  });

  return (
    <mesh ref={mesh} position={initialPosition}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#a3e635" />
    </mesh>
  );
};

const Fireflies = () => {
  const count = 100;
  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ]);
    }
    return pos;
  }, []);

  return (
    <group>
      {positions.map((pos, i) => (
        <Firefly key={i} initialPosition={pos} />
      ))}
    </group>
  );
};

const ForestTheme = ({ portfolioData }) => {
  const { name, designation, about, skills, experience, projects } = portfolioData;

  // Animation variants for organic entrances
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardClass = "bg-emerald-950/30 backdrop-blur-lg border border-emerald-500/20 text-emerald-50 rounded-3xl p-10 shadow-xl";

  return (
    <div className="relative min-h-screen w-full bg-[#0a1a10] text-emerald-50 font-sans selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#a3e635" />
          <Fireflies />
        </Canvas>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        
        {/* Hero Section */}
        <motion.header 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-32 pt-10"
        >
          <h1 className="text-6xl md:text-8xl font-serif font-medium tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-emerald-100 to-emerald-400 drop-shadow-sm">
            {name || "Your Name"}
          </h1>
          <div className="inline-block px-6 py-2 rounded-full bg-emerald-950/30 border border-emerald-800/30 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-light text-emerald-200/80 tracking-widest uppercase">
              {designation || "Creative Developer"}
            </h2>
          </div>
        </motion.header>

        {/* About Section - Frosted Leaf Card */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mb-24"
        >
          <div className={`${cardClass} relative overflow-hidden group`}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
            <h3 className="text-4xl font-serif text-emerald-100 mb-8">About</h3>
            <p className="text-lg md:text-xl text-emerald-100/80 leading-relaxed font-light">
              {about || "I cultivate digital experiences with a focus on organic growth and user-centric design. Like a forest, my code is structured, resilient, and ever-evolving."}
            </p>
          </div>
        </motion.section>

        {/* Skills Section - Vibrant Green Bars */}
        <section className="mb-24">
          <h3 className="text-4xl font-serif text-emerald-100 mb-12 text-center">Cultivation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(skills && skills.length > 0 ? skills : [{name: 'React', level: 90}, {name: 'Node', level: 75}, {name: 'Design', level: 85}, {name: 'UI/UX', level: 80}]).map((skill, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="flex justify-between mb-2 text-emerald-100 font-medium">
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="h-3 w-full bg-emerald-950/50 rounded-full overflow-hidden border border-emerald-500/10">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-lime-400"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience/Projects Section - Vertical Growth */}
        <section className="mb-20">
          <h3 className="text-4xl font-serif text-emerald-100 mb-12">Growth</h3>
          <div className="space-y-8">
            {/* Combine experience and projects or just show experience if available */}
            {(experience && experience.length > 0 ? experience : [{company: 'Studio Ghibli', role: 'Lead Animator', description: 'Creating immersive worlds.'}]).map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex gap-6 group"
              >
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-lime-500 shadow-[0_0_10px_rgba(132,204,22,0.4)]" />
                  <div className="w-0.5 h-full bg-emerald-900/50 my-2 group-last:hidden" />
                </div>
                <div className="pb-12">
                  <h4 className="text-2xl font-serif text-emerald-50">{item.role || item.title}</h4>
                  <div className="text-lime-400/80 text-sm mb-3 uppercase tracking-wider">{item.company || "Project"}</div>
                  <p className="text-emerald-200/60 leading-relaxed max-w-2xl">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ForestTheme;