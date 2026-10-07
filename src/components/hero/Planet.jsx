import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PlanetRing = ({ map, radius }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.5, radius * 2.2, 64]} />
      <meshStandardMaterial map={map} transparent={true} side={THREE.DoubleSide} />
    </mesh>
  );
};

const PlanetMoon = ({ map, radius }) => {
  return (
    <mesh position={[radius * 2, 0, 0]}>
      <sphereGeometry args={[radius * 0.2, 32, 32]} />
      <meshStandardMaterial map={map} />
    </mesh>
  );
};

const Planet = ({ radius, distance, speed, map, ringMap, moonMap }) => {
  const groupRef = useRef();
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const x = Math.sin(t * speed) * distance;

    const z = Math.cos(t * speed) * distance;

    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial map={map} roughness={0.7} />
      </mesh>

      {ringMap && <PlanetRing map={ringMap} radius={radius} />}
      {moonMap && <PlanetMoon map={moonMap} radius={radius} />}
    </group>
  );
};

export default Planet;