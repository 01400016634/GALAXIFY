import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import {
  Chrome, Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, MessageSquare,
  User, ChevronUp, Download, Briefcase, Award, Monitor, Map, Users, Link2, FileText, CheckCircle2, ArrowRight
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

// 🚀 1. IMPORT YOUR 15 AAA THEMES
import ThemeNeonMall from '../themes/ecommerce/ThemeNeonMall';
import { ThemeSpaceMarket } from '../themes/ecommerce/ThemeSpaceMarket';
import { ThemeGoldenPrestige } from '../themes/ecommerce/ThemeGoldenPrestige';
import { ThemeCyberLab } from '../themes/digital-gadgets/ThemeCyberLab';
import { ThemeTronGrid } from '../themes/digital-gadgets/ThemeTronGrid';
import { ThemePortalDimension } from '../themes/digital-gadgets/ThemePortalDimension';
import { ThemeSkylineEstate } from '../themes/real-estate/ThemeSkylineEstate';
import { ThemeDreamHall } from '../themes/real-estate/ThemeDreamHall';
import { ThemeFrozenPlatinum } from '../themes/real-estate/ThemeFrozenPlatinum';
import { ThemeCosmicLibrary } from '../themes/learning/ThemeCosmicLibrary';
import { ThemeAiSphere } from '../themes/learning/ThemeAiSphere';
import { ThemeGeneticMatrix } from '../themes/learning/ThemeGeneticMatrix';
import { ThemeCommandCenter } from '../themes/agency/ThemeCommandCenter';
import { ThemeCrystalVault } from '../themes/agency/ThemeCrystalVault';
import { ThemeDarkMatter } from '../themes/agency/ThemeDarkMatter';

// Helper component to render dynamic high-end social icons
const SocialIcon = ({ type, className }) => {
  switch (type?.toLowerCase()) {
    case 'facebook': return <Facebook className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'gmail': return <Mail className={className} />;
    case 'whatsapp': return <MessageSquare className={className} />;
    default: return <Chrome className={className} />;
  }
};

// 🚀 2. THE SUPABASE REVIEW COMPONENT
const ReviewSection = ({ siteName }) => {
  const [liveReviews, setLiveReviews] = useState([]);
  const [formData, setFormData] = useState({ name: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLiveReviews = async () => {
      if (!siteName) return;
      try {
        const { data, error } = await supabase.from('reviews').select('*').eq('site_name', siteName);
        if (error) throw error;
        if (data) setLiveReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchLiveReviews();
  }, [siteName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        site_name: siteName, reviewer_name: formData.name, review_text: formData.text, rating: 5
      });
      if (error) throw error;
      alert("🎉 Review sent successfully!");
      setLiveReviews([{ reviewer_name: formData.name, review_text: formData.text, rating: 5 }, ...liveReviews]);
      setFormData({ name: '', text: '' });
    } catch (err) {
      alert("Error submitting review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews" className="w-full max-w-4xl mx-auto mt-20 p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md relative z-20 mb-40">
      <h2 className="text-3xl font-black text-white mb-8 text-center drop-shadow-lg">Customer Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {liveReviews.length > 0 ? liveReviews.map((rev, index) => (
          <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-colors">
            <div className="flex text-yellow-400 mb-3 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">{'★'.repeat(rev.rating || 5)}</div>
            <p className="text-gray-300 italic mb-4">"{rev.review_text}"</p>
            <h4 className="text-cyan-400 font-bold tracking-wide">- {rev.reviewer_name}</h4>
          </div>
        )) : (
          <p className="text-gray-500 text-center col-span-2">No reviews yet. Be the first!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 max-w-md mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-white font-bold text-center">Leave a Verified Review</h3>
        <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/60 p-4 text-white rounded-xl border border-white/10 outline-none focus:border-cyan-500" required />
        <textarea placeholder="Write your feedback..." value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} className="w-full bg-black/60 p-4 text-white rounded-xl border border-white/10 h-28 outline-none focus:border-cyan-500 resize-none" required />
        <button type="submit" disabled={isSubmitting} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-4 rounded-xl font-black uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50">
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

// 🚀 3. THE MASTER PERSONAL BRAND RENDERER
const PersonalBrandRenderer = ({ pb, primaryColor }) => {
  if (!pb) return null;

  // Auto-changing Image Gallery Hook (4 seconds)
  const AutoGallery = ({ title, items, icon: Icon }) => {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      if (!items || items.length <= 1) return;
      const timer = setInterval(() => setIdx(prev => (prev + 1) % items.length), 4000);
      return () => clearInterval(timer);
    }, [items]);

    if (!items || items.length === 0) return null;
    return (
      <div className="bg-black/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-cyan-500/30 transition-all">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2"><Icon className="text-cyan-400" /> {title}</h3>
        <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <img src={items[idx]?.link} alt="Gallery" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
            <h4 className="text-white font-bold text-lg drop-shadow-md">{items[idx]?.title}</h4>
            {items[idx]?.detail && <p className="text-cyan-400 text-sm font-bold">{items[idx]?.detail}</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 space-y-24 pointer-events-auto relative z-10">

      {/* 1. INTRODUCTION */}
      <div className="text-center space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 pt-20">
        <div className="inline-block px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono text-sm font-bold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          {pb.intro?.designation || 'Professional Portfolio'}
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-black text-white leading-tight drop-shadow-2xl tracking-tighter">
          {pb.intro?.name || 'Your Name'}
        </h1>
        <p className="text-xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
          {pb.intro?.headline}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          {pb.intro?.contactBtn && <a href={pb.intro.contactBtnUrl || "#contact"} className="px-8 py-4 rounded-xl text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 transition-all" style={{ backgroundColor: primaryColor }}>{pb.intro.contactBtn}</a>}
          {pb.intro?.workBtn && <a href={pb.intro.workBtnUrl || "#experience"} className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold uppercase tracking-widest border border-white/20 hover:bg-white/20 hover:scale-105 transition-all">{pb.intro.workBtn}</a>}
        </div>
      </div>

      {/* 2. ABOUT ME */}
      <div id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3"><User className="text-cyan-400" size={32} /> About Me</h2>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">{pb.about?.description}</p>
          {pb.about?.cvLink && (
            <a href={pb.about.cvLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold transition-all">
              <Download size={18} /> Download CV
            </a>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 p-6 rounded-2xl text-center shadow-lg">
            <h4 className="text-4xl font-black text-cyan-400 mb-2">{pb.about?.totalExp || '0'}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Experience</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 rounded-2xl text-center shadow-lg">
            <h4 className="text-4xl font-black text-purple-400 mb-2">{pb.about?.totalOrg || '0'}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Organizations</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-6 rounded-2xl text-center shadow-lg sm:col-span-2">
            <h4 className="text-4xl font-black text-green-400 mb-2">{pb.about?.totalWebinars || '0'}</h4>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Trainings & Webinars</p>
          </div>
        </div>
      </div>

      {/* 3. SKILLS */}
      {pb.skills && pb.skills.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center flex items-center justify-center gap-3"><Award className="text-cyan-400" size={32} /> My Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pb.skills.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:border-cyan-500/50 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{s.title}</h4>
                  {s.level && <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-cyan-500/30">{s.level}</span>}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. WORK EXPERIENCE */}
      {pb.workExperience && pb.workExperience.length > 0 && (
        <div id="experience" className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3"><Briefcase className="text-cyan-400" size={32} /> Work Experience</h2>
          <div className="space-y-6">
            {pb.workExperience.map((w, i) => (
              <div key={i} className="bg-black/40 border border-white/10 p-6 md:p-8 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row gap-6 hover:border-cyan-500/30 transition-all">
                <div className="md:w-1/3 shrink-0">
                  <span className="text-cyan-400 font-bold text-sm tracking-widest uppercase bg-cyan-500/10 px-3 py-1 rounded-lg inline-block mb-3 border border-cyan-500/20">{w.period}</span>
                  <h4 className="text-2xl font-black text-white mb-1">{w.role}</h4>
                  <p className="text-gray-400 font-medium text-lg">{w.org}</p>
                </div>
                <div className="md:w-2/3 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. OWN BUSINESS / STARTUP */}
      {pb.businessProfile?.name && (
        <div className="bg-gradient-to-br from-black/80 to-[#0A0A10] border border-cyan-500/30 p-8 md:p-12 rounded-3xl backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
          <span className="text-cyan-400 font-bold text-xs tracking-widest uppercase mb-4 block"><Briefcase className="inline mr-2 mb-1" size={16} /> Business / Startup Profile</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">{pb.businessProfile.name}</h2>
          <p className="text-xl text-gray-400 font-light mb-8 italic">"{pb.businessProfile.punchline}"</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">{pb.businessProfile.desc}</p>
              {pb.businessFeatures && pb.businessFeatures.length > 0 && (
                <ul className="space-y-3">
                  {pb.businessFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                      <CheckCircle2 className="text-cyan-400 shrink-0 mt-0.5" size={18} /> {f.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 h-max">
              <div className="bg-black/50 border border-white/10 p-6 rounded-2xl text-center hover:border-cyan-500/50 transition-colors">
                <Users className="mx-auto text-cyan-400 mb-3" size={28} />
                <h4 className="text-3xl font-black text-white mb-1">{pb.businessProfile.members}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Members</p>
              </div>
              <div className="bg-black/50 border border-white/10 p-6 rounded-2xl text-center hover:border-cyan-500/50 transition-colors">
                <Map className="mx-auto text-cyan-400 mb-3" size={28} />
                <h4 className="text-3xl font-black text-white mb-1">{pb.businessProfile.countries}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CERTIFICATES */}
      {pb.certificates && pb.certificates.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3"><Award className="text-cyan-400" size={32} /> Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pb.certificates.map((c, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col sm:flex-row gap-6 hover:bg-white/10 transition-all backdrop-blur-md">
                {c.link ? (
                  <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-black border border-white/10"><img src={c.link} className="w-full h-full object-cover" alt="Certificate" /></div>
                ) : (
                  <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center text-gray-600"><Award size={40} /></div>
                )}
                <div>
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1 block">{c.year}</span>
                  <h4 className="text-xl font-bold text-white mb-1 leading-tight">{c.title}</h4>
                  <p className="text-sm text-gray-400 font-medium mb-3">{c.source}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TRAININGS & 8. CONSULTANCIES (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {pb.trainings && pb.trainings.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><Users className="text-cyan-400" /> Trainings & Workshops</h2>
            <div className="space-y-4">
              {pb.trainings.map((t, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
                  <h4 className="text-lg font-bold text-white">{t.title}</h4>
                  <p className="text-cyan-400 text-sm mb-2">{t.org}</p>
                  <p className="text-xs text-gray-500 mb-4">{t.start} - {t.end}</p>
                  <p className="text-sm text-gray-300 mb-4">{t.desc}</p>
                  {t.btnLink && <a href={t.btnLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-colors">{t.btnName || 'View'} <ArrowRight size={14} /></a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {pb.consultancies && pb.consultancies.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white flex items-center gap-2"><Briefcase className="text-cyan-400" /> Consultancy Records</h2>
            <div className="space-y-4">
              {pb.consultancies.map((c, i) => (
                <div key={i} className="bg-black/40 border border-white/10 p-6 rounded-2xl hover:border-cyan-500/30 transition-all flex justify-between items-center">
                  <div>
                    <h4 className="text-lg font-bold text-white">{c.title}</h4>
                    <p className="text-cyan-400 text-sm">{c.org}</p>
                  </div>
                  <div className="text-right text-xs text-gray-500 font-mono bg-black/50 px-3 py-2 rounded-lg border border-white/5">
                    {c.start}<br />{c.end}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 9. WEBINARS (Table) */}
      {pb.webinars && pb.webinars.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white flex items-center gap-3"><Monitor className="text-cyan-400" size={28} /> Completed Webinars</h2>
          <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase font-bold text-gray-400 border-b border-white/10">
                <tr><th className="px-6 py-4">S/N</th><th className="px-6 py-4">Webinar Name</th><th className="px-6 py-4 text-right">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pb.webinars.map((w, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-cyan-400">{(i + 1).toString().padStart(2, '0')}</td>
                    <td className="px-6 py-4 font-medium text-white">{w.name}</td>
                    <td className="px-6 py-4 text-right">{w.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. POWER BI DASHBOARDS */}
      {pb.dashboards && pb.dashboards.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-3xl font-black text-white flex items-center gap-3"><BarChart3 className="text-cyan-400" size={28} /> Power BI Dashboards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pb.dashboards.map((d, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md flex justify-between items-center hover:border-cyan-500/50 transition-all group">
                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{d.title}</h4>
                {d.link && <a href={d.link} target="_blank" rel="noreferrer" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg">Preview</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11 & 12. GIS AND TEAMWORK GALLERIES (Auto Carousels) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AutoGallery title="GIS Mapping Gallery" items={pb.gisMapping} icon={Map} />
        <AutoGallery title="Teamwork Gallery" items={pb.teamwork} icon={Users} />
      </div>

      {/* 13. CONTACT ME SECTION */}
      <div id="contact" className="bg-gradient-to-br from-black to-[#0A0A0F] border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-black text-white mb-2">Let's Connect</h2>
            <p className="text-gray-400 leading-relaxed text-lg">{pb.contactLinks?.desc || 'Reach out to discuss opportunities, collaborations, or just to say hello.'}</p>

            <div className="pt-6 flex flex-wrap gap-4">
              {pb.contactLinks?.facebook && <a href={pb.contactLinks.facebook} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/30 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"><Facebook size={20} /></a>}
              {pb.contactLinks?.linkedin && <a href={pb.contactLinks.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/30 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all"><Linkedin size={20} /></a>}
              {pb.contactLinks?.youtube && <a href={pb.contactLinks.youtube} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#FF0000]/10 border border-[#FF0000]/30 flex items-center justify-center text-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all"><Youtube size={20} /></a>}
              {pb.contactLinks?.whatsapp && <a href={`https://wa.me/${pb.contactLinks.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all"><MessageSquare size={20} /></a>}
              {pb.contactLinks?.gmail && <a href={`mailto:${pb.contactLinks.gmail}`} className="w-12 h-12 rounded-full bg-[#EA4335]/10 border border-[#EA4335]/30 flex items-center justify-center text-[#EA4335] hover:bg-[#EA4335] hover:text-white transition-all"><Mail size={20} /></a>}
              {pb.contactLinks?.website && <a href={pb.contactLinks.website} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/10 border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><Link2 size={20} /></a>}
            </div>
          </div>

          <form className="space-y-4 bg-black/50 p-6 rounded-2xl border border-white/5">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Mail className="text-cyan-400" size={18} /> Send a Message</h4>
            <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500" />
            <input type="email" placeholder="Your Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500" />
            <textarea placeholder="Your Message" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500 h-32 resize-none" />
            <button type="button" onClick={() => alert("Message sent via 3D Universe CRM!")} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">Send Message</button>
          </form>
        </div>
      </div>

    </div>
  );
};

// 🚀 4. THE MAIN PORTFOLIO VIEW COMPONENT
const PortfolioView = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const isPreviewMode = new URLSearchParams(window.location.search).get('mode') === 'preview';
        if (isPreviewMode) {
          const draftData = localStorage.getItem('3duniverse_draft');
          if (draftData) {
            setData(JSON.parse(draftData));
            setLoading(false);
            return;
          }
        }
        const { data: fetchedData, error: fetchError } = await supabase.from('landing_pages').select('page_data').eq('site_name', username);
        if (fetchError) throw fetchError;

        const portfolio = fetchedData && fetchedData.length > 0 ? fetchedData[0] : null;
        if (portfolio && portfolio.page_data) {
          setData(portfolio.page_data);
        } else {
          setError('Portfolio not found');
        }
      } catch (err) {
        setError(`Failed to load portfolio: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchPortfolio();
  }, [username]);

  if (loading) return <div className="min-h-screen w-full bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div></div>;
  if (error || !data) return <div className="min-h-screen w-full bg-black flex items-center justify-center text-white"><h1 className="text-2xl">{error || "Portfolio not found"}</h1></div>;

  const selectedTheme = data.setup?.themeId || 'theme-1';
  const primaryColor = data.brand?.colors?.[0] || '#06B6D4';

  const renderLive3DBackground = (themeId) => {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {themeId === 'theme-1' && <ThemeNeonMall />}
        {themeId === 'theme-2' && <ThemeSpaceMarket />}
        {themeId === 'theme-3' && <ThemeGoldenPrestige />}
        {themeId === 'theme-4' && <ThemeCyberLab />}
        {themeId === 'theme-5' && <ThemeTronGrid />}
        {themeId === 'theme-6' && <ThemePortalDimension />}
        {themeId === 'theme-7' && <ThemeSkylineEstate />}
        {themeId === 'theme-8' && <ThemeDreamHall />}
        {themeId === 'theme-9' && <ThemeFrozenPlatinum />}
        {themeId === 'theme-10' && <ThemeCosmicLibrary />}
        {themeId === 'theme-11' && <ThemeAiSphere />}
        {themeId === 'theme-12' && <ThemeGeneticMatrix />}
        {themeId === 'theme-13' && <ThemeCommandCenter />}
        {themeId === 'theme-14' && <ThemeCrystalVault />}
        {themeId === 'theme-15' && <ThemeDarkMatter />}
        {(!themeId || themeId === 'space') && <ThemeNeonMall />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-white scroll-smooth" style={{ fontFamily: data.brand?.font || 'Inter' }}>
      {renderLive3DBackground(selectedTheme)}

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 pointer-events-auto border-b ${isScrolled ? 'bg-black/70 backdrop-blur-xl border-white/10 shadow-lg py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 flex justify-between items-center w-full">
          <a href="#home" className="flex items-center gap-4 group flex-shrink-0">
            {data.brand?.logo && (
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <img src={data.brand.logo} alt="Brand Logo" className="relative h-12 w-12 rounded-full object-cover border-2 border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.8)] bg-black" style={{ borderColor: primaryColor }} />
              </div>
            )}
            <span className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md hidden sm:block" style={{ color: primaryColor }}>{data.brand?.name || 'Your Brand'}</span>
          </a>

          <div className="hidden lg:flex items-center gap-10 bg-black/40 px-8 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {data.hero?.navLinks && data.hero.navLinks.length > 0 ? (
              data.hero.navLinks.map((link, idx) => (
                <a key={idx} href={link.target} className="text-[13px] font-black text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] relative group">
                  {link.label}<span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full group-hover:left-0 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
                </a>
              ))
            ) : (
              <>
                <a href="#home" className="text-[13px] font-black text-white uppercase tracking-[0.2em]">Home</a>
                <a href="#about" className="text-[13px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">About</a>
                <a href="#experience" className="text-[13px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">Experience</a>
              </>
            )}
          </div>

          {/* 🚀 CONDITIONAL SIGN IN: Hidden for Personal Brands */}
          {data.setup?.category !== 'personal-brand' && (
            <button
              onClick={() => window.location.href = `/client-portal/${username}`}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-bold flex items-center gap-2 backdrop-blur-md transition-all"
            >
              <User size={16} /> Sign In
            </button>
          )}
        </div>
      </nav>

      {/* 🚀 CONDITIONAL RENDERING: Personal Brand vs Standard Blocks */}
      {data.setup?.category === 'personal-brand' ? (
        <PersonalBrandRenderer pb={data.personalBrand} primaryColor={primaryColor} />
      ) : (
        <div className="relative z-10 w-full pb-32">
          {/* STANDARD HERO */}
          <div id="home" className="max-w-5xl mx-auto px-8 pt-48 pb-20 text-center flex flex-col items-center justify-center min-h-[90vh] pointer-events-none">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md text-cyan-300 font-mono mb-8 uppercase tracking-widest text-sm pointer-events-auto">
              {data.setup?.category || 'Professional Portfolio'}
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-black text-white mb-6 leading-tight drop-shadow-2xl px-4 break-words">
              {data.hero?.headline || data.setup?.name || '3D Universe'}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-xs sm:max-w-md md:max-w-3xl mx-auto mb-12 font-light px-4">
              {data.hero?.subheadline || 'Explore the digital frontier.'}
            </p>
            {data.hero?.ctaText && (
              <a href={data.hero.ctaLink || "#"} className="text-white px-10 py-5 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-auto hover:scale-110 uppercase tracking-wide" style={{ backgroundColor: primaryColor }}>
                {data.hero.ctaText}
              </a>
            )}
          </div>

          {/* STANDARD BLOCKS */}
          {data.blocks && data.blocks.length > 0 && data.blocks.map((block) => {
            if (block.title.toLowerCase() === 'hero') return null;
            const isProductCard = block.customFields?.productName || block.customFields?.courseTitle || block.customFields?.serviceName;

            return (
              <div id={block.id} key={block.id} className="relative min-h-[60vh] flex flex-col justify-center px-4 md:px-8 py-24 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-10" style={{ textAlign: block.style?.alignment || 'center' }}>
                <div className="max-w-6xl mx-auto w-full pointer-events-auto">
                  {isProductCard ? (
                    <div className="max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-cyan-500/50 hover:-translate-y-2 group">
                      {block.media?.heroImage && <div className="overflow-hidden rounded-2xl mb-6"><img src={block.media.heroImage} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" alt="Product" /></div>}
                      <h2 className="text-2xl font-black text-white">{isProductCard}</h2>
                      <p className="text-cyan-400 text-2xl font-black my-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">${block.customFields.price || '0.00'}</p>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">{block.content?.description}</p>
                      <button onClick={() => setSelectedProduct({ name: isProductCard, price: block.customFields.price || '0.00' })} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black uppercase shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        {block.cta?.buttonText || 'Buy Now'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 text-white font-mono mb-8 uppercase tracking-widest text-xs shadow-lg ${block.style?.alignment === 'left' ? 'mr-auto' : block.style?.alignment === 'right' ? 'ml-auto' : 'mx-auto'}`}>{block.title}</div>
                      <h2 className="text-4xl sm:text-5xl md:text-[4.5rem] font-black text-white mb-4 drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)] leading-tight break-words">{block.content.headline}</h2>
                      <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">{block.content.description}</p>
                      {/* 🚀 NEW: THIS ACTUALLY DISPLAYS THE UPLOADED IMAGES FOR STANDARD BLOCKS! */}
                      {block.media?.heroImage && (
                        <div className="mt-12 w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
                          <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                          <img src={block.media.heroImage} className="w-full max-h-[600px] object-cover hover:scale-105 transition-transform duration-700" alt="Section Media" />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Section */}
      {/* 🚀 CONDITIONAL REVIEWS: Hidden for Personal Brands */}
      {data.setup?.category !== 'personal-brand' && (
        <ReviewSection siteName={username} />
      )}

      {/* FLOATING DOCKS */}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-3 pointer-events-auto">
        {data.contact?.quickChatUrl && (
          <a href={data.contact.quickChatUrl} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative" style={{ backgroundColor: data.contact.quickChatColor || '#25D366', boxShadow: `0 0 20px ${data.contact.quickChatColor || '#25D366'}50` }}>
            <span className="absolute right-16 bg-black/90 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">{data.contact.quickChatLabel || 'Chat with us'}</span>
            <SocialIcon type={data.contact.quickChatPlatform || 'whatsapp'} className="text-white w-7 h-7 drop-shadow-md" />
          </a>
        )}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-14 h-14 bg-black/80 hover:bg-cyan-500 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <ChevronUp size={28} />
        </button>
      </div>

      {data.contact?.activeSocials && data.contact.activeSocials.length > 0 && (
        <div className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 bg-black/50 border border-white/10 rounded-full backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto transition-transform hover:scale-105 max-w-[90vw] overflow-x-auto">
          {data.contact.activeSocials.map(socialId => (
            <a key={socialId} href={data.contact.socialUrls?.[socialId] || '#'} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-full transition-all group hover:bg-cyan-500/20 hover:border-cyan-500/50 relative overflow-hidden" title={socialId}>
              <SocialIcon type={socialId} className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-all" />
            </a>
          ))}
        </div>
      )}

      {selectedProduct && <CheckoutModal product={selectedProduct} pageId={username} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
};

export default PortfolioView;