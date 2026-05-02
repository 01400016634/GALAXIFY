import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Briefcase, Award, GraduationCap, Linkedin, Github, Mail } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sparkles, Html, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- HYPER-REALISTIC LAVA PLANET SHADER ---
const LavaPlanet = ({ isHovered }) => {
  const materialRef = useRef();
  const planetRef = useRef();

  // Internal values for smooth transitions
  const hoverFactor = useRef(0);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorRock: { value: new THREE.Color('#0a0a0a') },
    uColorLava: { value: new THREE.Color('#ff2a00') },
    uColorLavaHot: { value: new THREE.Color('#ffaa00') },
    uIntensity: { value: 1.0 } // New uniform for interactivity
  }), []);

  useFrame((state) => {
    // Smoothly transition the factor (0 to 1) over 10 frames
    hoverFactor.current = THREE.MathUtils.lerp(hoverFactor.current, isHovered ? 1 : 0, 0.1);
    
    if (materialRef.current) {
      // 1. Speed up time when hovered (lava pulses faster)
      const speed = 0.15 + (hoverFactor.current * 0.4); 
      materialRef.current.uniforms.uTime.value += speed * 0.1;
      
      // 2. Increase glow intensity when hovered
      materialRef.current.uniforms.uIntensity.value = 1.0 + (hoverFactor.current * 2.0);
    }
    
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={planetRef} position={[4, 0, -3]}>
      <mesh>
        {/* High detail sphere for vertex displacement */}
        <sphereGeometry args={[3.5, 128, 128]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vNoise;
            uniform float uTime;

            // 3D Simplex Noise function
            vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
            vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
            float snoise(vec3 v){ 
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 = v - i + dot(i, C.xxx) ;
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod(i, 289.0 ); 
              vec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
              float n_ = 0.142857142857;
              vec3  ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_ );
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4( x.xy, y.xy );
              vec4 b1 = vec4( x.zw, y.zw );
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
              vec3 p0 = vec3(a0.xy,h.x);
              vec3 p1 = vec3(a0.zw,h.y);
              vec3 p2 = vec3(a1.xy,h.z);
              vec3 p3 = vec3(a1.zw,h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
              p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
              vUv = uv;
              vNormal = normal;
              
              // Generate base noise
              float n = snoise(position * 1.2 + uTime * 0.15);
              
              // Create sharp valleys/cracks at noise = 0
              vNoise = abs(n);
              
              // Push vertices OUT where noise > 0, creating deep static fissures
              vec3 newPos = position + normal * (vNoise * 0.4);
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            varying vec3 vNormal;
            varying float vNoise;
            
            uniform vec3 uColorRock;
            uniform vec3 uColorLava;
            uniform vec3 uColorLavaHot;
            uniform float uTime;
            uniform float uIntensity;

            void main() {
              float crack = smoothstep(0.01, 0.25, vNoise);
              float pulse = (sin(uTime * 3.0 - vNoise * 10.0) * 0.5 + 0.5);
              
              vec3 lavaBase = mix(uColorLava, uColorLavaHot, pulse);
              vec3 lava = lavaBase * (4.5 * uIntensity); // Intensity reacts to hover
              vec3 rock = uColorRock;

              // --- SPECULAR REFINEMENT ---
              vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
              vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
              float spec = pow(max(dot(vNormal, normalize(lightDir + viewDir)), 0.0), 32.0);

              vec3 color = mix(lava, rock, crack);
              
              // Add sharp glints strictly to the rock surface
              color += (spec * 0.3 * crack); 
              
              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  );
};

// --- SCIENTIFIC HUD ELEMENT ---
const ScientificHUD = () => {
  const hudRef = useRef();
  useFrame((state) => {
    hudRef.current.rotation.x += 0.005;
    hudRef.current.rotation.y += 0.01;
  });
  return (
    <group ref={hudRef} position={[-4, 1.5, 2]}>
      <Icosahedron args={[0.5, 1]} wireframe>
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.6} />
      </Icosahedron>
      <Icosahedron args={[0.8, 0]} wireframe>
        <meshBasicMaterial color="#ff2a00" transparent opacity={0.2} />
      </Icosahedron>
    </group>
  );
};

// --- PARALLAX RIG ---
const ParallaxRig = ({ children }) => {
  const rigRef = useRef();
  useFrame((state) => {
    if (rigRef.current) {
      rigRef.current.rotation.y = THREE.MathUtils.lerp(rigRef.current.rotation.y, (state.pointer.x * Math.PI) / 20, 0.05);
      rigRef.current.rotation.x = THREE.MathUtils.lerp(rigRef.current.rotation.x, (state.pointer.y * Math.PI) / 20, 0.05);
    }
  });
  return <group ref={rigRef}>{children}</group>;
};

const LavaTheme = ({ portfolioData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Safety delay to prevent Vite HMR from crashing the PostProcessing context
  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a fallback to prevent crashes if personal data is missing
  const p = portfolioData?.personal || {};
  const c = portfolioData?.contact || {};
  const bio = portfolioData?.about || "An experienced scientific professional exploring the depths of the unknown. Leveraging advanced analytics to decode planetary phenomena.";

  return (
    <div className="w-full bg-[#020205] text-white font-sans overflow-x-hidden">
      
      {/* --- 3D HERO SECTION --- */}
      <div className="relative w-full h-screen">
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false }}
        >
          <color attach="background" args={['#030105']} />
          <fog attach="fog" args={['#030105', 8, 25]} />
          
          <ambientLight intensity={0.1} />
          <directionalLight position={[-10, 10, 5]} color="#ffffff" intensity={2} />
          <pointLight position={[4, 0, -3]} color="#ff4500" intensity={50} distance={15} />
          
          <ParallaxRig>
            <LavaPlanet isHovered={isHovered} />
            
            {/* Floating Deep Space Embers */}
            <Sparkles count={500} scale={[20, 15, 10]} size={2} speed={0.2} opacity={0.6} color="#ffaa00" position={[0, 0, -5]} />
            <Sparkles count={150} scale={[10, 10, 10]} size={4} speed={0.5} opacity={1} color="#ff2a00" position={[4, 0, 0]} />

            {/* Professional Floating UI Elements */}
            <ScientificHUD />
            
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
              <Text
                position={[-2.5, 1.8, 1]}
                fontSize={1.2}
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.05}
              >
                {p.name || "UNNAMED"}
                <meshPhysicalMaterial 
                  color="#ffb6c1" 
                  metalness={0.9} 
                  roughness={0.3} 
                  clearcoat={1}
                />
              </Text>
              
              <Text
                position={[-2.5, 0.8, 1.2]}
                fontSize={0.35}
                color="#ffaa00"
                anchorX="center"
                anchorY="middle"
                letterSpacing={0.2}
              >
                {p.designation || "SCIENTIFIC OFFICER"}
                <meshBasicMaterial color="#ffaa00" toneMapped={false} />
              </Text>
            </Float>

            {/* High-end Glassmorphism Bio Panel */}
            <Html position={[-2.5, -1, 1]} center transform distanceFactor={8} occlude={false}>
              <div 
                className="w-[450px] p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-[#ffaa00]/40 flex flex-col items-center text-center"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {p.profilePicture && (
                  <img 
                    src={p.profilePicture} 
                    className="w-20 h-20 rounded-full object-cover border border-[#ffaa00]/50 shadow-[0_0_20px_rgba(255,170,0,0.3)] mb-6" 
                    alt={p.name} 
                  />
                )}
                <p className="text-slate-300 text-sm leading-relaxed font-light tracking-wide">{bio}</p>
              </div>
            </Html>
          </ParallaxRig>
          
          {/* Post-Processing Layer for True HDR Glow */}
          {mounted && (
            <EffectComposer disableNormalPass multisampling={0}>
              <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.4} />
            </EffectComposer>
          )}
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            enableRotate={false} 
          />
        </Canvas>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#ff4500] animate-bounce pointer-events-none">
          <p className="text-xs tracking-widest uppercase mb-2 text-center">Scroll</p>
          <div className="w-px h-8 bg-[#ff4500] mx-auto"></div>
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 bg-[#020205]">

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Experience - 3D Timeline Style */}
          {portfolioData?.experience?.length > 0 && (
            <div className="md:col-span-2 p-10 bg-[#101010]/40 backdrop-blur-3xl border border-[#FF4500]/20 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-3xl font-black mb-10 flex items-center gap-4 text-[#FF4500]">
                <Briefcase size={32} /> THE JOURNEY
              </h3>
              <div className="space-y-12">
                {portfolioData.experience.map((exp, i) => (
                  <div key={i} className="relative pl-10 border-l-2 border-[#FF4500]/20 group hover:border-[#FF4500] transition-colors">
                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-[#101010] border-4 border-[#FF4500] group-hover:scale-125 transition-transform shadow-[0_0_20px_rgba(255,69,0,0.6)]"></div>
                    <h4 className="text-2xl font-bold text-white">{exp.jobTitle}</h4>
                    <p className="text-[#FF4500] font-bold text-sm mb-4">{exp.company} <span className="text-slate-500 font-normal ml-2">[{exp.date}]</span></p>
                    <p className="text-slate-400 leading-relaxed">{exp.responsibilities}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills - "Heat Levels" */}
          {portfolioData?.skills?.length > 0 && (
            <div className="p-10 bg-[#101010]/40 backdrop-blur-3xl border border-[#FF4500]/20 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-[#FF4500]">
                <Award /> HEAT LEVELS
              </h3>
              <div className="space-y-6">
                {portfolioData.skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 text-sm font-black tracking-widest uppercase">
                      <span>{skill.name}</span>
                      <span className="text-[#FF4500]">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#101010] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FF4500] to-[#FFFFE0] shadow-[0_0_15px_rgba(255,69,0,0.8)] transition-all duration-1000" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education - Mini Glass Cards */}
          {portfolioData?.education?.length > 0 && (
            <div className="p-10 bg-[#101010]/40 backdrop-blur-3xl border border-[#FF4500]/20 rounded-[2.5rem] shadow-2xl">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-[#FF4500]">
                <GraduationCap /> FOUNDATION
              </h3>
              <div className="space-y-6">
                {portfolioData.education.map((edu, i) => (
                  <div key={i} className="p-4 bg-[#101010]/60 rounded-2xl border border-white/5 hover:border-[#FF4500]/50 hover:shadow-[0_0_20px_rgba(255,69,0,0.2)] transition-all">
                    <h4 className="font-bold text-lg">{edu.degree}</h4>
                    <p className="text-slate-400 text-sm">{edu.institution}</p>
                    <p className="text-[#FF4500]/80 text-xs font-bold mt-2">{edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Social Footer */}
        <footer className="mt-20 flex flex-col items-center gap-8">
            <div className="flex gap-6">
               {c.linkedin && <a href={c.linkedin} className="p-4 bg-[#101010]/60 rounded-full hover:bg-[#FF4500] hover:shadow-[0_0_20px_rgba(255,69,0,0.6)] transition-all border border-[#FF4500]/20"><Linkedin size={24}/></a>}
               {c.github && <a href={c.github} className="p-4 bg-[#101010]/60 rounded-full hover:bg-[#FF4500] hover:shadow-[0_0_20px_rgba(255,69,0,0.6)] transition-all border border-[#FF4500]/20"><Github size={24}/></a>}
               {c.email && <a href={`mailto:${c.email}`} className="p-4 bg-[#101010]/60 rounded-full hover:bg-[#FF4500] hover:shadow-[0_0_20px_rgba(255,69,0,0.6)] transition-all border border-[#FF4500]/20"><Mail size={24}/></a>}
            </div>
            <div className="text-slate-600 text-xs tracking-[0.5em] font-bold">GALAXIFY AI • 2026</div>
        </footer>
      </div>
    </div>
  );
};

export default LavaTheme;