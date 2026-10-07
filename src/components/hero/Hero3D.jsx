import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Sun Component
 * A glowing sphere with a point light inside to illuminate the planets.
 */
const Sun = () => {
  return (
    <group>
      {/* The visual representation of the Sun (glowing) */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      {/* The light source emitting from the Sun */}
      <pointLight intensity={500} distance={100} decay={2} color="white" />
    </group>
  );
};

/**
 * Planet Component
 * Rotates around the center (0,0,0) based on distance and speed.
 */
const Planet = ({ distance, speed, size, color, offset }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Calculate orbital position
    // offset ensures planets don't all start in a straight line
    const x = distance * Math.cos(t * speed + offset);
    const z = distance * Math.sin(t * speed + offset);
    
    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z);
      // Self-rotation
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
};

/**
 * CameraController Component
 * Slowly pans the camera to create a dynamic cinematic effect.
 */
const CameraController = () => {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle elliptical orbit/pan
    state.camera.position.x = Math.sin(t * 0.05) * 25;
    state.camera.position.z = Math.cos(t * 0.05) * 25 + 10; // +10 to keep some distance
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

/**
 * Main Hero Component
 */
const Hero3D = () => {
  // Configuration for the 7 planets
  const planetsData = useMemo(() => [
    { name: "Mercury", distance: 4, speed: 1.2, size: 0.4, color: "#A5A5A5" },
    { name: "Venus", distance: 6, speed: 0.9, size: 0.6, color: "#E3BB76" },
    { name: "Earth", distance: 9, speed: 0.6, size: 0.7, color: "#22A6B3" },
    { name: "Mars", distance: 12, speed: 0.5, size: 0.5, color: "#FF6B6B" },
    { name: "Jupiter", distance: 17, speed: 0.2, size: 1.8, color: "#DFA669" },
    { name: "Saturn", distance: 23, speed: 0.15, size: 1.5, color: "#F4D03F" },
    { name: "Uranus", distance: 29, speed: 0.1, size: 1.2, color: "#7ED6DF" },
  ], []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#050505' }}>
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        {/* Ambient light for base visibility */}
        <ambientLight intensity={0.1} />
        
        {/* The Starry Background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Scene Contents */}
        <Sun />
        
        {planetsData.map((planet, index) => (
          <Planet
            key={planet.name}
            distance={planet.distance}
            speed={planet.speed}
            size={planet.size}
            color={planet.color}
            offset={index * 2} // Stagger starting positions
          />
        ))}

        {/* Camera Logic */}
        <CameraController />
      </Canvas>
    </div>
  );
};

export default Hero3D;
