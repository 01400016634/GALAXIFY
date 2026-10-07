import React, { useState, useEffect } from 'react';
import { Facebook, Linkedin, Youtube, MessageSquare, Mail, Globe } from 'lucide-react';

const PersonalBrandRenderer = ({ data }) => {
    const pb = data.personalBrand || {};

    // Gallery Auto-change logic (for Sections 11 & 12)
    const [gisIndex, setGisIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setGisIndex(prev => (prev + 1) % (pb.galleries?.gis?.length || 1)), 4000);
        return () => clearInterval(timer);
    }, [pb.galleries?.gis]);

    return (
        <div className="space-y-20 py-20 px-4 md:px-12 text-white">
            {/* 1. Introduction */}
            <section className="text-center space-y-6">
                <h1 className="text-6xl md:text-8xl font-black">{pb.intro?.name}</h1>
                <p className="text-xl md:text-2xl text-cyan-400">{pb.intro?.designation}</p>
                <div className="flex gap-4 justify-center">
                    <button className="px-8 py-3 bg-cyan-600 rounded-full font-bold">{pb.intro?.contactBtn}</button>
                    <button className="px-8 py-3 border border-white/20 rounded-full font-bold">{pb.intro?.workBtn}</button>
                </div>
            </section>

            {/* 2. About Me + Glass Stats */}
            <section className="grid md:grid-cols-2 gap-12 items-center">
                <p className="text-lg leading-relaxed text-gray-300">{pb.about?.description}</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Experience', val: pb.about?.totalExp },
                        { label: 'Orgs', val: pb.about?.totalOrg },
                        { label: 'Webinars', val: pb.about?.totalWebinars }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                            <div className="text-3xl font-black text-cyan-400">{stat.val}</div>
                            <div className="text-xs uppercase tracking-widest text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Skills (Glass Grid) */}
            <section>
                <h2 className="text-3xl font-bold mb-8">My Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {(pb.skills || []).map((skill, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-cyan-500 transition-colors">
                            <h3 className="font-bold">{skill.title}</h3>
                            <p className="text-sm text-gray-400 mt-2">{skill.desc}</p>
                            <span className="text-[10px] font-bold text-cyan-400 mt-4 block">{skill.level}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Own Business (Feature List Style) */}
            <section className="bg-gradient-to-br from-cyan-900/20 to-black p-10 rounded-3xl border border-white/10">
                <h2 className="text-3xl font-black mb-4">{pb.businessProfile?.name}</h2>
                <p className="text-xl text-cyan-300 mb-6 italic">"{pb.businessProfile?.punchline}"</p>
                <p className="text-gray-300 mb-8 max-w-2xl">{pb.businessProfile?.desc}</p>

                <div className="flex gap-4">
                    {pb.contactLinks?.facebook && <a href={pb.contactLinks.facebook} className="p-3 bg-blue-600 rounded-full"><Facebook size={20} /></a>}
                    {pb.contactLinks?.linkedin && <a href={pb.contactLinks.linkedin} className="p-3 bg-blue-400 rounded-full"><Linkedin size={20} /></a>}
                    {/* ... Add other icons similarly ... */}
                </div>
            </section>

            {/* 11. GIS Mapping Gallery (Auto-change) */}
            <section>
                <h2 className="text-3xl font-bold mb-8">GIS Mapping</h2>
                <div className="h-64 rounded-2xl overflow-hidden border border-white/10">
                    {pb.galleries?.gis?.[gisIndex] && (
                        <img src={pb.galleries.gis[gisIndex].link} className="w-full h-full object-cover" />
                    )}
                </div>
            </section>

            {/* ... Add other sections (Certificates, Training, etc.) using the same pattern ... */}
        </div>
    );
};

export default PersonalBrandRenderer;