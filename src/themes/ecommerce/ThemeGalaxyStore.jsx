import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Environment, useTexture } from '@react-three/drei';

// This component handles the 3D Product "Planet"
const ProductPlanet = ({ textureUrl, position, label }) => {
    const texture = useTexture(textureUrl); // Use your WebP here
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh position={position}>
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial map={texture} roughness={0.2} metalness={0.8} />
            </mesh>
        </Float>
    );
};

export default function ThemeGalaxyStore() {
    return (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 15] }}>
            <Suspense fallback={null}>
                {/* AAA Lighting for product realism */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} intensity={1} />
                <Environment preset="studio" /> {/* Gives professional reflections */}

                <ProductPlanet textureUrl="/textures/product1.webp" position={[-5, 0, 0]} />
                <ProductPlanet textureUrl="/textures/product2.webp" position={[5, 0, 0]} />

                <Stars radius={100} depth={50} count={5000} />
            </Suspense>
            <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
    );
}