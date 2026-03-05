import React, { useMemo } from 'react';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

const SolarSystem = () => {
  // Load all textures at the top level to prevent render-phase update warnings in children
  const [
    sunMap, backgroundMap,
    mercuryMap, venusMap, earthMap, moonMap, marsMap, jupiterMap, saturnMap, saturnRingMap, uranusMap, neptuneMap
  ] = useTexture([
    '/textures/sun.jpg', '/textures/stars_milky_way.jpg',
    '/textures/mercury.jpg', '/textures/venus.jpg', '/textures/earth.jpg', '/textures/moon.jpg',
    '/textures/mars.jpg', '/textures/jupiter.jpg', '/textures/saturn.jpg', '/textures/saturn_ring_alpha.png',
    '/textures/uranus.jpg', '/textures/neptune.jpg'
  ]);

  const planetsData = useMemo(() => [
    { name: "Mercury", map: mercuryMap, distance: 7, radius: 0.4, speed: 0.8 },
    { name: "Venus", map: venusMap, distance: 10, radius: 0.8, speed: 0.6 },
    { name: "Earth", map: earthMap,  distance: 14, radius: 1, speed: 0.5 ,moonMap: moonMap},
    { name: "Mars", map: marsMap, distance: 18, radius: 0.5, speed: 0.4 },
    { name: "Jupiter", map: jupiterMap, distance: 26, radius: 2.2, speed: 0.2 },
    { name: "Saturn", map: saturnMap, ringMap: saturnRingMap, distance: 34, radius: 1.8, speed: 0.15 },
    { name: "Uranus", map: uranusMap, distance: 42, radius: 1.2, speed: 0.1 },
    { name: "Neptune", map: neptuneMap, distance: 50, radius: 1.1, speed: 0.08 },
  ], [mercuryMap, venusMap, earthMap,  marsMap, jupiterMap, saturnMap, saturnRingMap, uranusMap, neptuneMap, moonMap]);

  return (

    <>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={1.2} />

      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshBasicMaterial map={sunMap} />
        <pointLight intensity={100} distance={300} decay={1} color="#fffcd4" />
      </mesh>

      {/* Background Sphere */}
      <mesh >
        <sphereGeometry args={[100, 64, 64]} />
        <meshBasicMaterial map={backgroundMap} side={THREE.BackSide} />
      </mesh>

      {/* Planets */}   
      {planetsData.map((planet) => (
        <Planet
          key={planet.name}
          {...planet}
        />
      ))}
    </>

  );
};

export default SolarSystem;