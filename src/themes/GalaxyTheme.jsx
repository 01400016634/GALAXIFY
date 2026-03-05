import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { motion } from 'framer-motion';

const Crystal = ({ position }) => {
  const meshRef = useRef();
  const [randomData] = useState(() => ({
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02
    },
    bobOffset: Math.random() * 100,
    bobSpeed: 0.5 + Math.random() * 0.5
  }));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x += randomData.rotationSpeed.x;
      meshRef.current.rotation.y += randomData.rotationSpeed.y;
      // Bobbing effect on Y axis
      meshRef.current.position.y = position[1] + Math.sin(t * randomData.bobSpeed + randomData.bobOffset) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial 
        color="#8b5cf6" 
        emissive="#3b0764"
        emissiveIntensity={0.5}
        roughness={0}
        metalness={1}
        wireframe 
      />
    </mesh>
  );
};

const FloatingCrystals = () => {
  const count = 15;
  const crystals = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      position: [
        (Math.random() - 0.5) * 30, // x spread
        (Math.random() - 0.5) * 20, // y spread
        (Math.random() - 0.5) * 10  // z spread
      ]
    }));
  }, []);

  return (
    <group>
      {crystals.map((data, i) => (
        <Crystal key={i} position={data.position} />
      ))}
    </group>
  );
};

const GalaxyTheme = ({ portfolioData }) => {
  const { name, designation, about, skills, experience, projects } = portfolioData;

  // Framer motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardClass = "bg-black/40 backdrop-blur-md border border-purple-500/30 text-slate-200 rounded-2xl p-8 shadow-xl";

  return (
    <div className="relative min-h-screen w-full bg-black text-slate-200 font-sans overflow-x-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
          <Stars radius={150} depth={50} count={7000} factor={6} saturation={1} fade />
          <FloatingCrystals />
        </Canvas>
      </div>

      {/* Foreground UI */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-16"
        >
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              {name || "Your Name"}
            </h1>
            <h2 className="text-2xl md:text-3xl text-purple-200 font-light tracking-widest uppercase">
              {designation || "Creative Developer"}
            </h2>
          </motion.div>

          {/* About */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">About Me</h3>
            <p className="text-lg leading-relaxed text-slate-300">
              {about || "Passionate about building digital experiences that matter."}
            </p>
          </motion.section>

          {/* Skills */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className="text-2xl font-bold text-purple-400 mb-6">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(skills && skills.length > 0 ? skills : [{name: 'Skill 1', level: 80}]).map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{skill.name}</span>
                    <span className="text-purple-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-900/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Experience */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className="text-2xl font-bold text-purple-400 mb-6">Experience</h3>
            <div className="space-y-8">
              {(experience && experience.length > 0 ? experience : [{company: 'Company', role: 'Role', description: 'Description'}]).map((exp, idx) => (
                <div key={idx} className="border-l-2 border-purple-500/30 pl-6">
                  <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                  <div className="text-purple-300 text-sm mb-2">@ {exp.company}</div>
                  <p className="text-slate-400">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Projects */}
           <motion.section variants={itemVariants} className={cardClass}>
            <h3 className="text-2xl font-bold text-purple-400 mb-6">Projects</h3>
            <div className="grid grid-cols-1 gap-6">
              {(projects && projects.length > 0 ? projects : [{title: 'Project 1', description: 'A cool project', link: '#'}]).map((proj, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-white">{proj.title || "Project Title"}</h4>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-purple-400 hover:text-purple-300">View</a>}
                  </div>
                  <p className="text-slate-400 text-sm">{proj.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
};

export default GalaxyTheme;