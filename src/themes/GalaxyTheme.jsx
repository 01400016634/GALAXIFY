import React from 'react';
import { Mail, Github, Linkedin, ExternalLink, Download } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const GalaxyTheme = ({ portfolioData }) => {
  // 1. Safely unpack all the data from the dashboard
  const {
    personal = {},
    contact = {},
    about = "",
    skills = [],
    experience = [],
    projects = [],
    research = [],
    achievements = [],
    gallery = [],
    publicResumeUrl = ""
  } = portfolioData || {};

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans relative overflow-hidden pb-20">
      {/* 1. PUT YOUR 3D ELEMENT HERE! */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10">
        
        {/* HEADER: Profile Pic, Name, Designation */}
        <header className="text-center mb-16 space-y-6">
          {personal.profilePicture && (
            <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-purple-500 to-cyan-500">
              <img 
                src={personal.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-4 border-[#050510]"
              />
            </div>
          )}
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight mb-2">
              {personal.name || "Your Name"}
            </h1>
            <p className="text-xl text-cyan-400 tracking-widest uppercase font-semibold">
              {personal.designation || "Creative Professional"}
            </p>
          </div>

          {/* CONTACT LINKS */}
          <div className="flex justify-center gap-4 pt-4">
            {contact.email && <a href={`mailto:${contact.email}`} className="text-slate-400 hover:text-white transition-colors"><Mail size={24} /></a>}
            {contact.github && <a href={contact.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Github size={24} /></a>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={24} /></a>}
          </div>

          {publicResumeUrl && (
            <div className="pt-4">
              <a href={publicResumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold transition-all">
                <Download size={18} /> Download CV
              </a>
            </div>
          )}
        </header>

        {/* ABOUT ME */}
        {about && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">About Me</h2>
            <p className="text-slate-300 leading-relaxed">{about}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2 text-slate-300 font-medium">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE */}
        {experience.length > 0 && experience[0].jobTitle && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Experience</h2>
            <div className="space-y-8">
              {experience.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-cyan-500/30 pl-6 relative">
                  <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -left-[7px] top-1.5" />
                  <h3 className="text-xl font-bold text-white">{exp.jobTitle}</h3>
                  <p className="text-cyan-400 font-medium mb-1">{exp.company} <span className="text-slate-500 text-sm ml-2">{exp.date}</span></p>
                  {exp.description && <p className="text-slate-300 text-sm mb-3 mt-2">{exp.description}</p>}
                  {exp.responsibilities && (
                    <p className="text-slate-400 text-sm whitespace-pre-wrap">{exp.responsibilities}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESEARCH */}
        {research.length > 0 && research[0].title && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-pink-400 mb-6">Research & Papers</h2>
            <div className="space-y-6">
              {research.map((item, idx) => (
                <div key={idx} className="bg-black/30 p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  {item.analysis_ai && <p className="text-slate-400 text-sm italic mb-4">"{item.analysis_ai}"</p>}
                  {item.image_url && <img src={item.image_url} alt="Research Graph" className="w-full max-h-64 object-cover rounded-lg mt-4 border border-white/10" />}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ACHIEVEMENTS */}
        {achievements.length > 0 && achievements[0].title && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="bg-black/30 p-4 rounded-xl border border-white/5 flex gap-4 items-start">
                  {ach.image && <img src={ach.image} alt={ach.title} className="w-16 h-16 rounded-lg object-cover" />}
                  <div>
                    <h3 className="text-white font-bold text-sm">{ach.title}</h3>
                    <p className="text-slate-400 text-xs mt-1">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {gallery.length > 0 && gallery[0].image && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-cyan-400 mb-6">Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((item, idx) => (
                item.image ? (
                  <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10">
                    <img src={item.image} alt={item.caption || "Gallery image"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <p className="text-xs text-center text-white">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ) : null
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default GalaxyTheme;