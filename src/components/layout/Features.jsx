import React from 'react';
import { BrainCircuit, Rocket, CloudCog, Code } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const Features = () => {
  const features = [
    {
      icon: <BrainCircuit size={40} className="text-pink-400" />,
      title: "AI-Powered Data Extraction",
      description: "Instantly create content from your resume or job descriptions using AI."
    },
    {
      icon: <Rocket size={40} className="text-orange-400" />,
      title: "Immersive 3D Themes",
      description: "Stand out with dynamic, multi-dimensional themes like Galaxy or Lava."
    },
    {
      icon: <CloudCog size={40} className="text-blue-400" />,
      title: "Easy Deployment & Code Access",
      description: "One-click deployment with a public URL, and download full code (Pro)."
    },
    {
      icon: <Code size={40} className="text-purple-400" />,
      title: "Built for Customization",
      description: "Modern stack (React, Firebase, Gemini), developer-friendly and ready to customize."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {features.map((feature, index) => (
        <GlassCard 
          key={index} 
          className="flex flex-col items-center text-center bg-white/5 backdrop-blur-xl border-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          <div className="mb-4 p-3 rounded-full bg-white/5 border border-white/10">
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
          <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
        </GlassCard>
      ))}
    </div>
  );
};

export default Features;