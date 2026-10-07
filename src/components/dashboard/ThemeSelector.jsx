import React, { useState } from 'react';
import { X, Layers, ShoppingBag, Cpu, Home, BookOpen, Briefcase } from 'lucide-react';

const ALL_THEMES = [
    // E-COMMERCE CATEGORY
    { id: 'theme-1', name: 'Cyber Neon Mall', category: 'E-Commerce', desc: 'Futuristic retail spaces with vibrant neon highlights.', premium: false, icon: ShoppingBag },
    { id: 'theme-2', name: 'Space Market', category: 'E-Commerce', desc: 'Galactic trade outposts floating in deep orbit.', premium: false, icon: ShoppingBag },
    { id: 'theme-3', name: 'Golden Prestige', category: 'E-Commerce', desc: 'High-end luxury atmosphere with golden reflections.', premium: true, icon: ShoppingBag },

    // DIGITAL GADGETS CATEGORY
    { id: 'theme-4', name: 'Cyber Lab', category: 'Digital Gadgets', desc: 'Tech-heavy server clusters and computational fields.', premium: false, icon: Cpu },
    { id: 'theme-5', name: 'Tron Grid', category: 'Digital Gadgets', desc: 'Massive vector landscape grids with glowing arrays.', premium: false, icon: Cpu },
    { id: 'theme-6', name: 'Portal Dimension', category: 'Digital Gadgets', desc: 'Dynamic energetic vortex cores pulling debris.', premium: true, icon: Cpu },

    // REAL ESTATE CATEGORY
    { id: 'theme-7', name: 'Skyline Estate', category: 'Real Estate', desc: 'Holographic city wireframes and abstract high-rises.', premium: false, icon: Home },
    { id: 'theme-8', name: 'Dream Hall', category: 'Real Estate', desc: 'Minimalist white architecture and floating structures.', premium: false, icon: Home },
    { id: 'theme-9', name: 'Frozen Platinum', category: 'Real Estate', desc: 'Crystalline structures reflecting glacial elements.', premium: true, icon: Home },

    // LEARNING CATEGORY
    { id: 'theme-10', name: 'Cosmic Library', category: 'Learning', desc: 'Constellations of information swirling in space.', premium: false, icon: BookOpen },
    { id: 'theme-11', name: 'Ai Sphere', category: 'Learning', desc: 'Interconnected neural core nodes pulsing data lanes.', premium: false, icon: BookOpen },
    { id: 'theme-12', name: 'Genetic Matrix', category: 'Learning', desc: 'Glowing additive blending biological double-helices.', premium: true, icon: BookOpen },

    // AGENCY CATEGORY
    { id: 'theme-13', name: 'Command Center', category: 'Agency', desc: 'Strategic tactical digital mainframe grid.', premium: false, icon: Briefcase },
    { id: 'theme-14', name: 'Crystal Vault', category: 'Agency', desc: 'Refractive geometric vaults with physical properties.', premium: false, icon: Briefcase },
    { id: 'theme-15', name: 'Dark Matter', category: 'Agency', desc: 'Deep volumetric physics models with dark aesthetics.', premium: true, icon: Briefcase }
];

const CATEGORIES = ['All', 'E-Commerce', 'Digital Gadgets', 'Real Estate', 'Learning', 'Agency'];

export const ThemeSelector = ({ currentTheme, onSelectTheme, onClose }) => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredThemes = activeCategory === 'All'
        ? ALL_THEMES
        : ALL_THEMES.filter(t => t.category === activeCategory);

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-[#09090b] border border-white/10 rounded-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                        <Layers className="text-cyan-400" size={24} />
                        <h2 className="text-2xl font-bold text-white tracking-tight">Theme Gallery</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Category Filters Grid */}
                <div className="p-4 bg-black/10 border-b border-white/5 flex flex-wrap gap-2">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${activeCategory === category
                                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                                : 'bg-transparent border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Themes Grid */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#050507]">
                    {filteredThemes.map((theme) => {
                        const IconComponent = theme.icon;
                        const isSelected = currentTheme === theme.id;

                        return (
                            <div
                                key={theme.id}
                                onClick={() => onSelectTheme(theme.id)}
                                className={`group relative rounded-xl p-5 cursor-pointer flex flex-col justify-between min-h-[180px] transition-all duration-300 border ${isSelected
                                    ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                                    : 'border-white/5 bg-[#0c0c0e] hover:border-white/20 hover:bg-[#121215]'
                                    }`}
                            >
                                {/* Visual Accent Layer */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-xl" />

                                {/* Top Bar inside Card */}
                                <div className="flex items-start justify-between relative z-10">
                                    <div className={`p-3 rounded-lg border ${isSelected ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400' : 'border-white/5 bg-black/40 text-gray-400 group-hover:text-white transition-colors'}`}>
                                        <IconComponent size={20} />
                                    </div>
                                    {theme.premium && (
                                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-black text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-lg">
                                            Pro
                                        </span>
                                    )}
                                </div>

                                {/* Meta Text details */}
                                <div className="mt-8 relative z-10">
                                    <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-500/70 block mb-1">
                                        {theme.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors duration-200">
                                        {theme.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs mt-1.5 leading-relaxed font-light line-clamp-2">
                                        {theme.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};