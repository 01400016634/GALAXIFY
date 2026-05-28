import React, { useMemo } from 'react';
import { Stars, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';

// 🚀 1. THE BUNDLER FIX: Import all textures directly!
// (If your SolarSystem is in src/components/hero, this ../../ path is perfect)
import sunImg from '../../assets/textures/sun.webp';
import bgImg from '../../assets/textures/stars_milky_way.webp';
import mercuryImg from '../../assets/textures/mercury.webp';
import venusImg from '../../assets/textures/venus.webp';
import earthImg from '../../assets/textures/earth.webp';
import moonImg from '../../assets/textures/moon.webp';
import marsImg from '../../assets/textures/mars.webp';
import jupiterImg from '../../assets/textures/jupiter.webp';
import saturnImg from '../../assets/textures/saturn.webp';
import saturnRingImg from '../../assets/textures/saturn_ring_alpha.webp';
import uranusImg from '../../assets/textures/uranus.webp';
import neptuneImg from '../../assets/textures/neptune.webp';

const SolarSystem = () => {
  // 🚀 2. Feed the imported variables into useTexture (NO quote marks around them!)
  const [
    sunMap, backgroundMap,
    mercuryMap, venusMap, earthMap, moonMap, marsMap, jupiterMap, saturnMap, saturnRingMap, uranusMap, neptuneMap
  ] = useTexture([
    sunImg, bgImg,
    mercuryImg, venusImg, earthImg, moonImg,
    marsImg, jupiterImg, saturnImg, saturnRingImg,
    uranusImg, neptuneImg
  ]);

  const planetsData = useMemo(() => [
    { name: "Mercury", map: mercuryMap, distance: 7, radius: 0.4, speed: 0.8 },
    { name: "Venus", map: venusMap, distance: 10, radius: 0.8, speed: 0.6 },
    { name: "Earth", map: earthMap, distance: 14, radius: 1, speed: 0.5, moonMap: moonMap },
    { name: "Mars", map: marsMap, distance: 18, radius: 0.5, speed: 0.4 },
    { name: "Jupiter", map: jupiterMap, distance: 26, radius: 2.2, speed: 0.2 },
    { name: "Saturn", map: saturnMap, ringMap: saturnRingMap, distance: 34, radius: 1.8, speed: 0.15 },
    { name: "Uranus", map: uranusMap, distance: 42, radius: 1.2, speed: 0.1 },
    { name: "Neptune", map: neptuneMap, distance: 50, radius: 1.1, speed: 0.08 },
  ], [mercuryMap, venusMap, earthMap, marsMap, jupiterMap, saturnMap, saturnRingMap, uranusMap, neptuneMap, moonMap]);

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
      <mesh>
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

// 🚀 3. Preload the imported variables so it stays blazing fast!
useTexture.preload(sunImg);
useTexture.preload(bgImg);
useTexture.preload(mercuryImg);
useTexture.preload(venusImg);
useTexture.preload(earthImg);
useTexture.preload(moonImg);
useTexture.preload(marsImg);
useTexture.preload(jupiterImg);
useTexture.preload(saturnImg);
useTexture.preload(saturnRingImg);
useTexture.preload(uranusImg);
useTexture.preload(neptuneImg);

export default SolarSystem;