import React from 'react';
import { Mail, Globe, ExternalLink, Download } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

const GalaxyTheme = ({ portfolioData }) => {
  // 🚀 1. Safely unpack the exact data structure saved by your Dashboard
  const {
    brand = {},
    hero = {},
    contact = {},
    blocks = [],
    media = []
  } = portfolioData || {};

  // Extract primary color, defaulting to cyan if none selected
  const primaryColor = brand.colors?.[0] || '#06B6D4';

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans relative overflow-hidden pb-20">

      {/* 3D BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10">

        {/* HEADER: Logo, Brand Name, Headline */}
        <header className="text-center mb-16 space-y-6">
          {brand.logo && (
            <div className="w-32 h-32 mx-auto rounded-full p-1" style={{ background: `linear-gradient(to top right, #8b5cf6, ${primaryColor})` }}>
              <img
                src={brand.logo}
                alt="Brand Logo"
                className="w-full h-full object-cover rounded-full border-4 border-[#050510]"
              />
            </div>
          )}

          <div>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text tracking-tight mb-2" style={{ backgroundImage: `linear-gradient(to right, #c084fc, ${primaryColor})` }}>
              {brand.name || "Your Brand"}
            </h1>
            <p className="text-xl tracking-widest uppercase font-semibold" style={{ color: primaryColor }}>
              {hero.headline || brand.tagline || "Your Awesome Tagline"}
            </p>
            {hero.subheadline && (
              <p className="text-slate-400 mt-4 max-w-2xl mx-auto">{hero.subheadline}</p>
            )}
          </div>

          {/* CTA BUTTON */}
          {hero.ctaText && (
            <div className="pt-4">
              <a href={hero.ctaLink || "#"} className="inline-flex items-center gap-2 text-black px-8 py-3 rounded-full font-bold transition-all hover:scale-105" style={{ backgroundColor: primaryColor, boxShadow: `0 0 20px ${primaryColor}50` }}>
                {hero.ctaText}
              </a>
            </div>
          )}

          {/* CONTACT LINKS */}
          <div className="flex justify-center gap-4 pt-4">
            {contact.email && <a href={`mailto:${contact.email}`} className="text-slate-400 hover:text-white transition-colors"><Mail size={24} /></a>}

            {/* Map through dynamic social URLs from Dashboard */}
            {Object.entries(contact.socialUrls || {}).map(([platform, url]) => (
              <a key={platform} href={url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors" title={platform}>
                <Globe size={24} />
              </a>
            ))}
          </div>
        </header>

        {/* ABOUT (Brand Short Description) */}
        {brand.aboutShort && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>About Us</h2>
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{brand.aboutShort}</p>
          </section>
        )}

        {/* DYNAMIC BLOCKS FROM SECTION BUILDER */}
        {blocks.map((block, idx) => (
          <section key={block.id || idx} className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>{block.title}</h2>

            {/* Render Features Block */}
            {block.type === 'features' && block.items && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {block.items.map((item, i) => (
                  <div key={i} className="bg-black/30 p-5 rounded-xl border border-white/5">
                    {item.icon && <img src={item.icon} alt={item.title} className="w-10 h-10 mb-3 rounded object-cover" />}
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Render FAQ Block */}
            {block.type === 'faq' && block.items && (
              <div className="space-y-4">
                {block.items.map((item, i) => (
                  <div key={i} className="bg-black/30 p-5 rounded-xl border border-white/5 border-l-4" style={{ borderLeftColor: primaryColor }}>
                    <h3 className="text-white font-bold mb-1">{item.q}</h3>
                    <p className="text-slate-400 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Fallback for other block types */}
            {block.type !== 'features' && block.type !== 'faq' && (
              <p className="text-slate-400 text-sm">Content for {block.type} block will appear here.</p>
            )}
          </section>
        ))}

        {/* MEDIA GALLERY */}
        {media.length > 0 && (
          <section className="mb-16 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6" style={{ color: primaryColor }}>Media Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {media.map((item, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-white/10">
                  {item.type?.includes('image') ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center text-slate-500 text-xs">Video File</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default GalaxyTheme;