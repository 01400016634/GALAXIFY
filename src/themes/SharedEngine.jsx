import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Activity, ArrowRight } from 'lucide-react';

const postVertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;
const postFragmentShader = `
  uniform sampler2D tDiffuse; uniform float time; uniform vec2 resolution;
  uniform vec3 tint; uniform float noiseIntensity; uniform float blurRadius;
  varying vec2 vUv;
  float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  void main() {
      vec2 uv = vUv; float dist = length(uv - 0.5);
      float rgbShift = smoothstep(0.2, 1.0, dist) * 0.01;
      vec4 baseColor = vec4(
          texture2D(tDiffuse, uv + vec2(rgbShift, 0.0)).r,
          texture2D(tDiffuse, uv).g,
          texture2D(tDiffuse, uv - vec2(rgbShift, 0.0)).b, 1.0
      );
      float blurAmount = smoothstep(0.1, 1.2, dist) * blurRadius;
      vec4 blurColor = vec4(0.0); float total = 0.0;
      for(float i = 0.0; i < 16.0; i++) {
          float angle = i * 6.28318 / 16.0;
          vec2 offset = vec2(cos(angle), sin(angle)) * blurAmount;
          offset.x *= resolution.y / resolution.x; 
          blurColor.r += texture2D(tDiffuse, uv + offset + vec2(rgbShift, 0.0)).r;
          blurColor.g += texture2D(tDiffuse, uv + offset).g;
          blurColor.b += texture2D(tDiffuse, uv + offset - vec2(rgbShift, 0.0)).b;
          total += 1.0;
      }
      blurColor /= total;
      vec4 finalColor = mix(baseColor, blurColor, smoothstep(0.1, 0.8, dist));
      finalColor.rgb *= tint;
      finalColor.rgb = mix(finalColor.rgb, smoothstep(0.0, 1.0, finalColor.rgb), 0.5);
      finalColor.rgb += pow(max(finalColor.rgb, 0.0), vec3(2.5)) * 1.2;
      finalColor.rgb += (random(uv + time) - 0.5) * noiseIntensity;
      finalColor.rgb *= smoothstep(1.4, 0.3, dist);
      gl_FragColor = finalColor;
  }
`;

export function CinematicCanvas({ setupScene, tintColor }) {
    const mountRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);

        const renderTarget = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
        const postScene = new THREE.Scene();
        const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const postMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: renderTarget.texture }, time: { value: 0.0 }, resolution: { value: new THREE.Vector2(width, height) },
                tint: { value: new THREE.Vector3(...tintColor) }, noiseIntensity: { value: 0.02 }, blurRadius: { value: 0.04 }
            },
            vertexShader: postVertexShader, fragmentShader: postFragmentShader
        });
        postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial));

        const ctx = {
            scene, camera, animatedObjects: [], customUpdate: null,
            addParticles: (color, count, size, type, opacity = 0.6) => {
                const geo = new THREE.BufferGeometry(); const arr = new Float32Array(count * 3);
                for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 60;
                geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
                const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color, size, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false }));
                scene.add(pts); ctx.animatedObjects.push({ obj: pts, type });
            },
            addGlowingRing: (radius, color, thickness = 0.05, detail = 128) => {
                const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, thickness, 32, detail), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
                ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                scene.add(ring); ctx.animatedObjects.push({ obj: ring, type: 'rotate-random', speed: 1 });
                return ring;
            }
        };

        setupScene(ctx);
        const clock = new THREE.Clock();
        let animationFrameId;

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            if (ctx.customUpdate) ctx.customUpdate(t);

            const shakeX = (Math.sin(t * 1.5) * 0.05) + (Math.sin(t * 4.2) * 0.02);
            const shakeY = (Math.cos(t * 1.2) * 0.05) + (Math.sin(t * 3.7) * 0.02);
            camera.position.x += ((Math.sin(t * 0.2) * 2 + shakeX + mousePos.current.x * 6) - camera.position.x) * 0.05;
            camera.position.y += ((Math.cos(t * 0.15) * 1 + shakeY + mousePos.current.y * 6) - camera.position.y) * 0.05;
            camera.lookAt(Math.sin(t * 10) * 0.01, Math.cos(t * 12) * 0.01, 0);

            ctx.animatedObjects.forEach(item => {
                if (item.type === 'rotate-slow-y') item.obj.rotation.y = t * (item.speed || 0.1);
                else if (item.type === 'rotate-z-fast') item.obj.rotation.z = t * item.speed;
                else if (item.type === 'float-spin') { item.obj.rotation.x = t * 0.5; item.obj.rotation.y = t * 0.3; item.obj.position.y += Math.sin(t * 2) * 0.05; }
                else if (item.type === 'float-spin-slow') { item.obj.rotation.x = t * 0.2; item.obj.rotation.y = t * 0.1; item.obj.position.y += Math.sin(t * 1.5) * 0.1; }
                else if (item.type === 'float-spin-fast') { item.obj.rotation.x = t; item.obj.rotation.y = t * 0.8; item.obj.position.y += Math.sin(t * 3) * 0.1; }
                else if (item.type === 'rotate-complex-slow') { item.obj.rotation.x = t * (item.speed || 0.1); item.obj.rotation.y = t * (item.speed || 0.15); }
                else if (item.type === 'scan-y-large') item.obj.position.y = Math.sin(t * 1.5 + item.offset) * 6;
                else if (item.type === 'rotate-random') { item.obj.rotation.z += item.speed * 0.01; item.obj.rotation.x += item.speed * 0.005; }
                else if (item.type === 'pulse-nodes') { item.obj.rotation.y = t * 0.05; const s = 1 + Math.sin(t * 8) * 0.2; item.obj.scale.set(s, s, s); }
                else if (item.type === 'scroll-grid') item.obj.position.z = (t * item.speed) % 10;
                else if (item.type === 'suck-into-portal') {
                    item.obj.position.z -= item.speed; item.obj.rotation.x += 0.1; item.obj.rotation.y += 0.1;
                    if (item.obj.position.z < -20) { item.obj.position.z = 20; item.obj.position.x = (Math.random() - 0.5) * 30; item.obj.position.y = (Math.random() - 0.5) * 30; }
                }
                else if (item.type === 'snow') item.obj.position.y = (t * -4) % 30;
                else if (item.type === 'rain') item.obj.position.y = (t * -40) % 30;
                else if (item.type === 'embers') { item.obj.position.y = (t * 8) % 30; item.obj.position.x += Math.sin(t * 6) * 0.08; }
                else if (item.type === 'dust') { item.obj.position.y += Math.sin(t * 0.5) * 0.02; item.obj.rotation.y = t * 0.03; }
                else if (item.type === 'fog') { item.obj.position.x += Math.sin(t * 0.2) * 0.08; item.obj.position.y += Math.cos(t * 0.1) * 0.04; }
                else if (item.type === 'stars') item.obj.rotation.y = t * 0.02;
            });

            postMaterial.uniforms.time.value = t;
            renderer.setRenderTarget(renderTarget);
            renderer.render(scene, camera);
            renderer.setRenderTarget(null);
            renderer.render(postScene, postCamera);
        };
        animate();

        const handleResize = () => {
            const w = mountRef.current.clientWidth; const h = mountRef.current.clientHeight;
            camera.aspect = w / h; camera.updateProjectionMatrix();
            renderer.setSize(w, h); renderTarget.setSize(w, h);
            postMaterial.uniforms.resolution.value.set(w, h);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current && mountRef.current.contains(renderer.domElement)) mountRef.current.removeChild(renderer.domElement);
            renderer.dispose(); renderTarget.dispose();
        };
    }, [tintColor]);

    // Notice: absolute inset-0 prevents the 3D from breaking the dashboard layout!
    return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

// UI LAYOUT COMPONENTS
export const EcommerceLayout = ({ ui }) => (
    <div className="w-full relative z-10 animate-fade-in-up pb-32 pt-40 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            <div className="min-h-[75vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-[6rem] md:text-[10rem] font-black text-white mb-6 drop-shadow-2xl leading-none tracking-tighter" style={{ textShadow: '0 10px 40px rgba(255,255,255,0.2)' }}>{ui.title}</h1>
                <p className="text-3xl text-white font-light max-w-4xl mb-12 drop-shadow-xl">{ui.sub}</p>
                <button className={`bg-gradient-to-r ${ui.accent} text-white px-16 py-6 rounded-full font-black text-2xl uppercase tracking-widest shadow-[0_0_60px_rgba(255,255,255,0.3)]`}>{ui.cta}</button>
            </div>
        </div>
    </div>
);

export const GadgetLayout = ({ ui }) => (
    <div className="w-full relative z-10 animate-fade-in-up pb-32 pt-40 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            <div className="min-h-[70vh] flex flex-col items-start justify-center text-left">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono mb-8 backdrop-blur-md uppercase tracking-widest text-sm">
                    <Activity size={18} className="animate-pulse" /> SYSTEM ONLINE
                </div>
                <h1 className="text-[6rem] md:text-[9rem] font-black text-white mb-6 drop-shadow-2xl tracking-tighter leading-none">{ui.title}</h1>
                <p className="text-3xl text-gray-300 max-w-3xl mb-12 font-light drop-shadow-lg">{ui.sub}</p>
                <button className={`border-2 border-white bg-white/5 backdrop-blur-xl text-white px-14 py-6 font-black text-2xl uppercase tracking-[0.2em] flex items-center gap-4 group`}>
                    {ui.cta} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    </div>
);

export const RealEstateLayout = ({ ui }) => (
    <div className="w-full relative z-10 animate-fade-in-up pb-32 pt-40 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            <div className="min-h-[75vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-[6rem] md:text-[10rem] font-serif text-white mb-6 drop-shadow-2xl leading-none">{ui.title}</h1>
                <p className="text-3xl text-gray-300 max-w-4xl mb-12 font-light drop-shadow-xl">{ui.sub}</p>
                <button className={`bg-white text-black px-16 py-6 font-serif uppercase tracking-[0.3em] font-bold text-xl`}>{ui.cta}</button>
            </div>
        </div>
    </div>
);

export const LearningLayout = ({ ui }) => (
    <div className="w-full relative z-10 animate-fade-in-up pb-32 pt-40 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-[6rem] md:text-[9rem] font-black text-white mb-6 tracking-tighter drop-shadow-2xl leading-none">{ui.title}</h1>
                <p className="text-3xl text-white font-light max-w-4xl mb-12 drop-shadow-xl">{ui.sub}</p>
                <button className={`bg-gradient-to-r ${ui.accent} text-white px-14 py-5 rounded-full font-black text-xl uppercase tracking-widest`}>{ui.cta}</button>
            </div>
        </div>
    </div>
);

export const AgencyLayout = ({ ui }) => (
    <div className="w-full relative z-10 animate-fade-in-up pb-32 pt-40 px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-32">
            <div className="min-h-[70vh] flex flex-col justify-center items-start text-left">
                <h1 className="text-[5rem] md:text-[8rem] font-black uppercase tracking-tighter text-white mb-8 leading-[0.9] max-w-5xl drop-shadow-2xl">{ui.title}</h1>
                <p className="text-3xl text-gray-300 max-w-3xl mb-14 font-light drop-shadow-xl leading-relaxed">{ui.sub}</p>
                <button className={`bg-white text-black px-16 py-6 font-black text-2xl uppercase tracking-[0.2em]`}>{ui.cta}</button>
            </div>
        </div>
    </div>
);