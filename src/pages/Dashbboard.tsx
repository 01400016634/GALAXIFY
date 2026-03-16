import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { generateExperience, generateResearchAnalysis } from '../services/gemini';
import PDFUploader from '../components/dashboard/PDFUploader';
import { 
  Wand2, Link as LinkIcon, Github, Linkedin, Mail, 
  Plus, Trash2, Globe, Loader2, Save, Eye, Rocket, Layout, 
  Image as ImageIcon, Sparkles, FileText
} from 'lucide-react';

// --- ANTI-FREEZE HELPER ---
// Forces Firebase to stop loading if it takes longer than 5 seconds
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out.")), ms))
  ]);
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [generating, setGenerating] = useState(null);

  const [formData, setFormData] = useState({
    personal: {
      name: currentUser?.displayName || '',
      designation: '',
      profilePicture: '', // Now expects a URL string
    },
    contact: { linkedin: '', github: '', email: '' },
    about: '',
    skills: [
      { name: 'React', level: 80 },
      { name: 'Design', level: 60 }
    ],
    experience: [{ jobTitle: '', company: '', date: '', responsibilities: '', description: '' }],
    research: [{ title: '', description: '', link: '', analysis_ai: '', image_url: '' }],
    achievements: [{ title: '', description: '', image: '' }],
    gallery: [{ image: '', caption: '' }],
    publicResumeUrl: '', // Now expects a URL string (e.g., Google Drive)
    theme: 'space',
    publicUrl: `https://galaxify.ai/p/${currentUser?.uid?.substring(0,8) || 'user'}`
  });

  // --- SAFE AUTOSAVE LOGIC ---
  useEffect(() => {
    if (!currentUser) return;

    const savePortfolioData = async () => {
      setIsSaving(true);
      try {
        const sanitizedData = JSON.parse(JSON.stringify(formData));
        await withTimeout(setDoc(doc(db, "portfolios", currentUser.uid), {
          ...sanitizedData,
          userId: currentUser.uid,
          lastSaved: serverTimestamp()
        }, { merge: true }));
        setLastSaved(new Date());
      } catch (error) {
        console.error("Autosave timeout/error:", error.message);
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(() => savePortfolioData(), 2500);
    return () => clearTimeout(timeoutId);
  }, [formData, currentUser]);


  // --- FORM HANDLERS ---
  const handleFieldChange = (section, field, value) => {
    setFormData(prev => {
      if (section === 'personal') return { ...prev, personal: { ...prev.personal, [field]: value } };
      if (section === 'root') return { ...prev, [field]: value };
      if (section === 'contact') return { ...prev, contact: { ...prev.contact, [field]: value } };
      return prev;
    });
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : [])];
      if (field) newArray[index] = { ...newArray[index], [field]: value };
      else newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addItem = (arrayName, newItem) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : []), newItem] }));
  };

  const removeItem = (arrayName, index) => {
    setFormData(prev => {
      const newArray = [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  // --- AI HANDLERS ---
  const handleExperienceAi = async (index, field) => {
    const exp = formData.experience[index];
    if (!exp?.jobTitle || !exp?.company) return alert("Enter Job Title and Company first.");
    setGenerating({ type: 'exp', index, field });
    try {
      const type = field === 'responsibilities' ? 'key responsibilities' : 'job description';
      const text = await generateExperience(exp.jobTitle, exp.company, type, exp[field] || "");
      handleArrayChange('experience', index, field, text);
    } catch (error) {
      console.error(error);
      alert("AI Generation failed.");
    } finally {
      setGenerating(null);
    }
  };

  const handleResearchAi = async (index) => {
    const paper = formData.research[index];
    if (!paper?.title) return alert("Enter Paper Title first.");
    setGenerating({ type: 'research', index });
    try {
      const text = await generateResearchAnalysis(paper.title, paper.analysis_ai || "");
      handleArrayChange('research', index, 'analysis_ai', text);
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed.");
    } finally {
      setGenerating(null);
    }
  };

  // --- ACTION HANDLERS ---
  const handlePreview = () => {
    if (!currentUser) return;
    if (isSaving) return alert("Still syncing to database. Please wait 2 seconds.");
    window.open(`${window.location.origin}/u/${currentUser.uid}`, '_blank');
  };

  const handlePublish = async () => {
    if (!currentUser) return alert("You must be logged in!");
    
    // 1. Turn on the Publish button spinner
    setIsPublishing(true);

    try {
      // 2. Hard check: Is Firebase even initialized?
      if (!db) {
        throw new Error("Database connection broken. Check your firebase.js config.");
      }

      console.log(`Attempting to publish for user: ${currentUser.uid}`);

      // 3. Clean the data to prevent Firebase formatting errors
      const sanitizedData = JSON.parse(JSON.stringify(formData));
      
      // 4. Send to Firebase using your anti-freeze timeout wrapper
      await withTimeout(setDoc(doc(db, "portfolios", currentUser.uid), {
        ...sanitizedData,
        userId: currentUser.uid,
        publishedAt: serverTimestamp(),
        isPublished: true,
      }));

      alert(`Success! Your portfolio is published.`);

    } catch (error) {
      console.error("Publishing failed:", error);
      // Show the exact error message to the user so you know if it timed out or went offline
      alert(`Publishing failed: ${error.message}`); 
    } finally {
      // 5. GUARANTEED to stop the loading spinner, even if Firebase crashes
      setIsPublishing(false);
    }
  };

  // --- STYLES ---
  const glassCard = "bg-white/5 border-b border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden group";
  const inputStyle = "w-full bg-black/40 border border-white/10 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-all text-sm";
  const labelStyle = "block text-xs font-bold text-cyan-400/80 uppercase tracking-widest mb-2";
  const neonButton = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2";

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] text-slate-200 font-sans pb-20">
      
      <header className="sticky top-0 z-50 bg-[#0a0e17]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white">GALAXIFY <span className="text-cyan-400">AI</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden md:block">
            <span className="block text-xs text-slate-400">Auto-save Status</span>
            {isSaving ? (
              <span className="text-xs text-yellow-400 flex items-center justify-end gap-1"><Loader2 size={10} className="animate-spin" /> Saving...</span>
            ) : (
              <span className="text-xs text-green-400 flex items-center justify-end gap-1"><Save size={10} /> Saved {lastSaved?.toLocaleTimeString()}</span>
            )}
          </div>
          <button onClick={handlePreview} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Eye size={18} /> Preview
          </button>
          <button onClick={handlePublish} disabled={isPublishing} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2">
            {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />} Publish
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* SECTION 1: Personal Details */}
        <div className={`col-span-12 ${glassCard} flex flex-col md:flex-row gap-8`}>
          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input type="text" value={formData?.personal?.name || ""} onChange={(e) => handleFieldChange('personal', 'name', e.target.value)} className={`${inputStyle} text-lg font-bold`} />
              </div>
              <div>
                <label className={labelStyle}>Designation</label>
                <input type="text" value={formData?.personal?.designation || ""} onChange={(e) => handleFieldChange('personal', 'designation', e.target.value)} className={inputStyle} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Profile Picture URL</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  <input type="text" value={formData?.personal?.profilePicture || ""} onChange={(e) => handleFieldChange('personal', 'profilePicture', e.target.value)} className={`${inputStyle} pl-9`} placeholder="https://..." />
                </div>
              </div>
              <div>
                <label className={labelStyle}>Public CV Link (Google Drive, etc.)</label>
                <div className="relative">
                  <FileText size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  <input type="text" value={formData?.publicResumeUrl || ""} onChange={(e) => handleFieldChange('root', 'publicResumeUrl', e.target.value)} className={`${inputStyle} pl-9`} placeholder="https://..." />
                </div>
              </div>
            </div>
            
            <div className="relative">
              <label className={labelStyle}>About Me</label>
              <textarea rows={3} value={formData?.about || ""} onChange={(e) => handleFieldChange('root', 'about', e.target.value)} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* SECTION 2: Skills & Research */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Layout size={18} className="text-purple-400" /> Skills</h3>
              <button onClick={() => addItem('skills', { name: '', level: 50 })} className={neonButton}><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(Array.isArray(formData?.skills) ? formData.skills : []).map((skill, idx) => (
                <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5">
                  <div className="flex justify-between mb-2">
                    <input type="text" value={skill?.name || ""} onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)} className="bg-transparent border-none text-sm text-white p-0 w-full outline-none" placeholder="Skill Name" />
                    <button onClick={() => removeItem('skills', idx)} className="text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                  <input type="range" min="0" max="100" value={skill?.level || 0} onChange={(e) => handleArrayChange('skills', idx, 'level', parseInt(e.target.value))} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                </div>
              ))}
            </div>
          </div>

          <div className={glassCard}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Globe size={18} className="text-pink-400" /> Research</h3>
              <button onClick={() => addItem('research', { title: '', analysis_ai: '', image_url: '' })} className={neonButton}><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-4">
              {(Array.isArray(formData?.research) ? formData.research : []).map((paper, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative">
                  <button onClick={() => removeItem('research', idx)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  <input type="text" value={paper?.title || ""} onChange={(e) => handleArrayChange('research', idx, 'title', e.target.value)} className={inputStyle} placeholder="Paper Title" />
                  <div className="relative">
                    <textarea rows={2} value={paper?.analysis_ai || ""} onChange={(e) => handleArrayChange('research', idx, 'analysis_ai', e.target.value)} className={`${inputStyle} text-xs`} placeholder="AI Analysis..." />
                    <button onClick={() => handleResearchAi(idx)} disabled={generating?.index === idx} className="absolute bottom-2 right-2 text-cyan-400 hover:text-white">
                      {generating?.type === 'research' && generating?.index === idx ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    </button>
                  </div>
                  <div className="relative">
                    <LinkIcon size={12} className="absolute left-3 top-3.5 text-slate-500" />
                    <input type="text" value={paper?.image_url || ""} onChange={(e) => handleArrayChange('research', idx, 'image_url', e.target.value)} className={`${inputStyle} text-xs pl-8 py-2`} placeholder="Graph Image URL" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <PDFUploader setFormData={setFormData} />
        </div>

        {/* SECTION 3: Experience */}
        <div className={`col-span-12 lg:col-span-7 ${glassCard}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Rocket size={20} className="text-cyan-400" /> Experience Journey</h3>
            <button onClick={() => addItem('experience', { jobTitle: '', company: '', date: '', responsibilities: '', description: '' })} className={neonButton}><Plus size={16} /> Add Role</button>
          </div>
          
          <div className="space-y-8">
            {(Array.isArray(formData?.experience) ? formData.experience : []).map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-white/10 pb-6 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-cyan-500" />
                <button onClick={() => removeItem('experience', idx)} className="absolute top-0 right-0 text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input type="text" value={exp?.jobTitle || ""} onChange={(e) => handleArrayChange('experience', idx, 'jobTitle', e.target.value)} className={inputStyle} placeholder="Job Title" />
                  <input type="text" value={exp?.company || ""} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} className={inputStyle} placeholder="Company" />
                </div>
                <input type="text" value={exp?.date || ""} onChange={(e) => handleArrayChange('experience', idx, 'date', e.target.value)} className={`${inputStyle} mb-4`} placeholder="Date Range" />
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <textarea rows={3} value={exp?.responsibilities || ""} onChange={(e) => handleArrayChange('experience', idx, 'responsibilities', e.target.value)} className={inputStyle} placeholder="Responsibilities..." />
                    <button onClick={() => handleExperienceAi(idx, 'responsibilities')} className="absolute top-3 right-3 text-cyan-400"><Wand2 size={16} /></button>
                  </div>
                  <div className="relative">
                    <textarea rows={3} value={exp?.description || ""} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} className={inputStyle} placeholder="Description..." />
                    <button onClick={() => handleExperienceAi(idx, 'description')} className="absolute top-3 right-3 text-cyan-400"><Wand2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Achievements, Gallery, Contact, Themes */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Achievements</h3>
            <div className="space-y-2">
              {(Array.isArray(formData?.achievements) ? formData.achievements : []).map((ach, idx) => (
                <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2 relative">
                  <button onClick={() => removeItem('achievements', idx)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  <input type="text" value={ach?.title || ""} onChange={(e) => handleArrayChange('achievements', idx, 'title', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-sm py-1 outline-none font-bold" placeholder="Title" />
                  <textarea rows={2} value={ach?.description || ""} onChange={(e) => handleArrayChange('achievements', idx, 'description', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-xs py-1 outline-none resize-none" placeholder="Description..." />
                  <input type="text" value={ach?.image || ""} onChange={(e) => handleArrayChange('achievements', idx, 'image', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-[10px] py-1 outline-none" placeholder="Image URL" />
                </div>
              ))}
              <button onClick={() => addItem('achievements', { title: '', description: '', image: '' })} className="text-xs text-cyan-400 hover:text-white mt-2 flex items-center gap-1"><Plus size={12} /> Add</button>
            </div>
          </div>

          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Gallery</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(formData?.gallery) ? formData.gallery : []).map((item, idx) => (
                <div key={idx} className="bg-black/20 p-2 rounded-lg border border-white/5 relative group">
                  <button onClick={() => removeItem('gallery', idx)} className="absolute top-1 right-1 z-10 text-white bg-black/50 rounded-full p-1"><Trash2 size={10} /></button>
                  <div className="aspect-square bg-white/5 rounded-md mb-2 overflow-hidden flex items-center justify-center">
                    {item?.image ? <img src={item.image} alt="Gallery" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-slate-600" />}
                  </div>
                  <input type="text" value={item?.image || ""} onChange={(e) => handleArrayChange('gallery', idx, 'image', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-[10px] py-1 outline-none mb-1" placeholder="Image URL" />
                  <input type="text" value={item?.caption || ""} onChange={(e) => handleArrayChange('gallery', idx, 'caption', e.target.value)} className="w-full bg-transparent border-b border-white/10 text-[10px] py-1 outline-none text-center" placeholder="Caption" />
                </div>
              ))}
              <button onClick={() => addItem('gallery', { image: '', caption: '' })} className="aspect-square bg-white/5 rounded-lg border border-white/5 border-dashed flex flex-col items-center justify-center text-slate-500 hover:text-cyan-400">
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Contact</h3>
            <div className="space-y-3">
              <div className="relative">
                <Linkedin size={14} className="absolute left-3 top-3 text-slate-500" />
                <input type="text" value={formData?.contact?.linkedin || ""} onChange={(e) => handleFieldChange('contact', 'linkedin', e.target.value)} className={`${inputStyle} pl-9 py-2 text-sm`} placeholder="LinkedIn" />
              </div>
              <div className="relative">
                <Github size={14} className="absolute left-3 top-3 text-slate-500" />
                <input type="text" value={formData?.contact?.github || ""} onChange={(e) => handleFieldChange('contact', 'github', e.target.value)} className={`${inputStyle} pl-9 py-2 text-sm`} placeholder="GitHub" />
              </div>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
                <input type="text" value={formData?.contact?.email || ""} onChange={(e) => handleFieldChange('contact', 'email', e.target.value)} className={`${inputStyle} pl-9 py-2 text-sm`} placeholder="Email" />
              </div>
            </div>
          </div>

          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {['galaxy', 'lava', 'forest', 'neon'].map(theme => (
                <div key={theme} onClick={() => setFormData(prev => ({ ...prev, theme }))} className={`aspect-video rounded-lg overflow-hidden cursor-pointer relative border-2 ${formData.theme === theme ? 'border-cyan-500' : 'border-transparent opacity-60'}`}>
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><span className="text-xs font-bold uppercase text-slate-400">{theme}</span></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;