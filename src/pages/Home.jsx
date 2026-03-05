import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import SolarSystem from '../components/hero/SolarSystem';
import { useAuth } from '../context/AuthContext';
import Features from '../components/layout/Features';
import ThemeShowcase from '../components/layout/ThemeShowcase';
import InfoSection from '../components/layout/InfoSection';
import ErrorBoundary from '../components/hero/ErrorBoundary';
import CanvasLoader from '../components/hero/CanvasLoader';
import Pricing from '../components/layout/Pricing';

const Home = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background 3D Scene */}
      {/* SolarSystem already contains the Canvas and takes up 100% width/height */}
      <div className="absolute inset-0 z-0">
        <ErrorBoundary>
          <Canvas camera={{ position: [0, 20, 35], fov: 45 }}>
            <Suspense fallback={<CanvasLoader />}>
              <SolarSystem />
            </Suspense>
          </Canvas>
        </ErrorBoundary>
      </div>

      {/* Foreground UI Overlay */}
      {/* pointer-events-none ensures clicks pass through to the 3D scene where there is no UI */}
      <div className="relative z-10 pointer-events-none h-full w-full overflow-y-auto">

        {/* Hero Section */}
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 pointer-events-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">3D Portfolio</span> <br /> with AI
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 drop-shadow-md">
            Transform your projects into an immersive galactic experience in seconds. 
            No 3D coding skills required.
          </p>
          <button onClick={handleLogin} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105">
            Get Started
          </button>
        </main>

        {/* Main Content Overlay */}
        <div className="container mx-auto px-6 py-12 space-y-16 pointer-events-auto">
          <Features />
          <ThemeShowcase />
          <Pricing />
          <InfoSection />
        </div>
      </div>
    </div>
  );
};

export default Home;