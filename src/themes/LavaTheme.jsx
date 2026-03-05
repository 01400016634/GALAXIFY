import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

const RisingEmbers = () => {
  const count = 500;
  const mesh = useRef();
  
  // Initial positions and speeds
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      spd[i] = 0.01 + Math.random() * 0.04;        // random speed
    }
    return [pos, spd];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Rise up
      positions[i3 + 1] += speeds[i];
      
      // Reset if above view (approx 10 units up)
      if (positions[i3 + 1] > 12) {
        positions[i3 + 1] = -12;
        positions[i3] = (Math.random() - 0.5) * 25; // Reset X randomly
      }
      
      // X-axis drift (wind simulation)
      positions[i3] += Math.sin(time * 0.5 + positions[i3 + 1]) * 0.005;
    }
    
    if (mesh.current) {
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ff4500" transparent opacity={0.8} />
    </points>
  );
};

const LavaTheme = ({ portfolioData }) => {
  const { name, designation, about, skills, projects, experience } = portfolioData;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  const cardClass = "bg-zinc-950/80 backdrop-blur border-b-2 border-orange-600 shadow-[0_4px_20px_rgba(239,68,68,0.2)] rounded-xl p-8";
  const headerClass = "text-3xl font-bold mb-6 bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text";

  return (
    <div className="relative min-h-screen w-full bg-zinc-950 text-white font-sans overflow-x-hidden">
      
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <RisingEmbers />
        </Canvas>
      </div>

      {/* Foreground UI */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-16"
        >
          
          {/* Hero Section */}
          <motion.header variants={itemVariants} className="text-center mb-24">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text drop-shadow-sm">
                {name || "YOUR NAME"}
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-light text-orange-200/80 uppercase tracking-widest">
              {designation || "Creative Developer"}
            </h2>
          </motion.header>

          {/* Bio Section */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className={headerClass}>Bio</h3>
            <p className="text-lg text-zinc-300 leading-relaxed">
              {about || "I forge digital products with the intensity of a thousand suns. Passionate about creating high-performance applications that leave a lasting impact."}
            </p>
          </motion.section>

          {/* Skills Section */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className={headerClass}>Heat Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(skills && skills.length > 0 ? skills : [{name: 'React', level: 90}, {name: 'Design', level: 75}]).map((skill, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between mb-2 text-sm font-medium text-orange-200/70 group-hover:text-orange-100 transition-colors">
                    <span>{skill.name}</span>
                    <span>{skill.level}°C</span>
                  </div>
                  <div className="h-4 w-full bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Experience Section */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className={headerClass}>Experience</h3>
            <div className="space-y-8">
               {(experience && experience.length > 0 ? experience : [{company: 'Company', role: 'Role', description: 'Description'}]).map((exp, idx) => (
                <div key={idx} className="border-l-2 border-orange-600/50 pl-6">
                  <h4 className="text-xl font-bold text-orange-100">{exp.role}</h4>
                  <div className="text-orange-400/80 text-sm mb-2">@ {exp.company}</div>
                  <p className="text-zinc-400">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section variants={itemVariants} className={cardClass}>
            <h3 className={headerClass}>Forged Projects</h3>
            <div className="grid grid-cols-1 gap-6">
              {(projects && projects.length > 0 ? projects : [{title: 'Project Alpha', description: 'A high-intensity web application.'}]).map((project, idx) => (
                <div key={idx} className="bg-zinc-900/50 p-6 rounded-lg border border-orange-500/20 hover:border-orange-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-orange-100">{project.title}</h4>
                    {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="text-xs text-orange-400 hover:text-orange-300 border border-orange-500/30 px-2 py-1 rounded">View</a>}
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
};

export default LavaTheme;