import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../services/firebase';
import { generateExperience, generateResearchAnalysis } from '../services/gemini';
import PDFUploader from '../components/dashboard/PDFUploader';
import {
  Wand2, Upload, Link as LinkIcon, Github, Linkedin, Mail,
  Plus, Trash2, Globe, MessageCircle, Facebook, Loader2,
  Save, Eye, Rocket, Layout, Image as ImageIcon, Sparkles, FileText
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  const [formData, setFormData] = useState({
    personal: {
      name: currentUser?.displayName || '',
      designation: '',
      profilePicture: null,
    },
    contact: {
      linkedin: '',
      github: '',
      email: '',
      phone: '',
      facebook: '',
      whatsapp: '',
      personalWebsite: ''
    },
    about: '',
    skills: [
      { name: 'React', level: 80 },
      { name: 'Design', level: 60 }
    ],
    experience: [{ jobTitle: '', company: '', date: '', responsibilities: '', description: '' }],
    projects: [{ title: '', description: '', link: '', image_url: '' }],
    research: [{ title: '', description: '', link: '', analysis_ai: '', picture_url: '' }],
    achievements: [{ title: '', description: '', image: null }],
    gallery: [{ image: null, caption: '' }],
    publicResumeUrl: null,
    isDraft: true,
    theme: 'space',
    publicUrl: 'https://3duniverse.com/p/your-name',
    isPro: false,
    customDomain: ''
  });

  // --- Fetch Existing Data & Sync to MongoDB Admin ---
  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          // 1. Fetch from Firebase
          const docRef = doc(db, "portfolios", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(prev => ({ ...prev, ...docSnap.data() }));
          }

          // 2. Sync to MongoDB Backend
          await fetch('http://localhost:5000/api/admin/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: currentUser.displayName || formData.personal.name,
              email: currentUser.email
            })
          });

        } catch (error) {
          console.error("Error fetching or syncing data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [currentUser]);

  // --- Autosave Logic (Diagnostic Mode) ---
  useEffect(() => {
    console.log("🔄 Autosave Effect Triggered");

    if (!currentUser) return;
    if (isLoading) return;

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const savePortfolioData = async () => {
      setIsSaving(true);
      try {
        const sanitizedData = JSON.parse(JSON.stringify(formData));
        await setDoc(doc(db, "portfolios", currentUser.uid), {
          ...sanitizedData,
          userId: currentUser.uid,
          lastSaved: serverTimestamp()
        }, { merge: true });

        setLastSaved(new Date());
      } catch (error) {
        console.error("🔥 Autosave FAILED:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const timeoutId = setTimeout(() => {
      savePortfolioData();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, currentUser, isLoading]);

  // --- COMPLETELY BYPASS FIREBASE STORAGE ---
  const uploadFileToStorage = async (file, path) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      if (file.size > 1048576) {
        alert(`File ${file.name} is too large! Please keep files under 1MB for the free tier.`);
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // --- Form Handlers ---
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
      if (field) {
        newArray[index] = { ...newArray[index], [field]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addItem = (arrayName, newItem) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : []), newItem]
    }));
  };

  const removeItem = (arrayName, index) => {
    setFormData(prev => {
      const newArray = [...(Array.isArray(prev[arrayName]) ? prev[arrayName] : [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  // --- AI Handlers ---
  const handleExperienceAi = async (index, field) => {
    const exp = formData.experience[index];
    if (!exp?.jobTitle || !exp?.company) {
      alert("Please enter Job Title and Company first.");
      return;
    }
    setGenerating({ type: 'exp', index, field });
    try {
      const currentText = exp[field] || "";
      const type = field === 'responsibilities' ? 'key responsibilities' : 'job description';
      const text = await generateExperience(exp.jobTitle, exp.company, type, currentText);
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
    if (!paper?.title) {
      alert("Please enter Paper Title first.");
      return;
    }
    setGenerating({ type: 'research', index });
    try {
      const currentText = paper.analysis_ai || "";
      const text = await generateResearchAnalysis(paper.title, currentText);
      handleArrayChange('research', index, 'analysis_ai', text);
    } catch (error) {
      console.error(error);
      alert("AI Analysis failed.");
    } finally {
      setGenerating(null);
    }
  };

  // --- File Upload Handlers ---
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFileToStorage(file, `users/${currentUser.uid}/profile_${Date.now()}`);
    if (url) handleFieldChange('personal', 'profilePicture', url);
  };

  const handlePublicCvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFileToStorage(file, `users/${currentUser?.uid}/resume_${Date.now()}.pdf`);
      if (url) {
        setFormData(prev => ({ ...prev, publicResumeUrl: url }));
      }
    } catch (error) {
      console.error("Failed to upload CV immediately:", error);
    }
  };

  const handleResearchImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFileToStorage(file, `users/${currentUser?.uid}/research/${Date.now()}_${file.name}`);
      handleArrayChange('research', index, 'image_url', url);
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleAchievementImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFileToStorage(file, `users/${currentUser.uid}/achievements/${Date.now()}`);
    if (url) handleArrayChange('achievements', index, 'image', url);
  };

  const handleGalleryImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadFileToStorage(file, `users/${currentUser.uid}/gallery/${Date.now()}`);
    if (url) handleArrayChange('gallery', index, 'image', url);
  };

  // --- Action Handlers ---
  const handlePreview = () => {
    if (!currentUser) return;
    window.open(`${window.location.origin}/u/${currentUser.uid}`, '_blank');
  };

  const handlePublish = async () => {
    if (!currentUser) return alert("You must be logged in!");
    if (!db) {
      alert("❌ FIREBASE CRASH: Your database connection is broken.");
      return;
    }

    setIsPublishing(true);

    try {
      const sanitizedData = JSON.parse(JSON.stringify(formData));
      await setDoc(doc(db, "portfolios", currentUser.uid), {
        ...sanitizedData,
        userId: currentUser.uid,
        publishedAt: serverTimestamp(),
        isPublished: true,
      });

      alert(`🚀 Success! Your portfolio is published.`);
    } catch (error) {
      console.error("🔥 PUBLISH ERROR:", error);
      alert(`Failed to publish: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // --- Styles ---
  const glassCard = "bg-white/5 border-b border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden group";
  const inputStyle = "w-full bg-black/40 border border-white/10 text-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-slate-600";
  const labelStyle = "block text-xs font-bold text-cyan-400/80 uppercase tracking-widest mb-2";
  const neonButton = "bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2";

  return (
    <div className="min-h-screen w-full bg-[#0a0e17] text-slate-200 font-sans selection:bg-cyan-500/30 pb-20">

      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#0a0e17]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            3D <span className="text-cyan-400">UNIVERSE</span>
          </h1>
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
          <button onClick={handlePreview} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 border border-white/10">
            <Eye size={18} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button onClick={handlePublish} disabled={isPublishing} className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-2 rounded-full font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2">
            {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Rocket size={18} />}
            Publish
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">

        {/* Grid Area 1: Personal & About (Full Width) */}
        <div className={`col-span-12 ${glassCard} flex flex-col md:flex-row gap-8 items-start`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={formData?.personal?.name || ""}
                  onChange={(e) => handleFieldChange('personal', 'name', e.target.value)}
                  className={`${inputStyle} text-lg font-bold`}
                  placeholder="e.g. Alex Chen"
                />
              </div>
              <div>
                <label className={labelStyle}>Designation</label>
                <input
                  type="text"
                  value={formData?.personal?.designation || ""}
                  onChange={(e) => handleFieldChange('personal', 'designation', e.target.value)}
                  className={inputStyle}
                  placeholder="e.g. Senior Product Designer"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelStyle}>Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                  {formData?.personal?.profilePicture ? (
                    <img
                      src={formData.personal.profilePicture instanceof File ? URL.createObjectURL(formData.personal.profilePicture) : formData.personal.profilePicture}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon size={20} className="text-slate-500" />
                  )}
                </div>
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-4 py-2 rounded-md transition-colors">
                  Upload Photo
                  <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} />
                </label>
              </div>
            </div>

            <div className="relative mt-4">
              <label className={labelStyle}>About Me</label>
              <textarea
                rows={3}
                value={formData?.about || ""}
                onChange={(e) => handleFieldChange('root', 'about', e.target.value)}
                className={`${inputStyle} resize-none`}
                placeholder="Tell your story..."
              />
            </div>

            {/* --- PUBLIC CV UPLOAD UI --- */}
            <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 mt-4">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <FileText size={16} /> Public Downloadable CV
              </span>
              <label className="flex items-center gap-2 cursor-pointer bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border border-cyan-500/50">
                <Upload size={14} />
                {formData.publicResumeUrl ? "Update PDF" : "Upload PDF"}
                <input type="file" accept="application/pdf" className="hidden" onChange={handlePublicCvUpload} />
              </label>
            </div>
          </div>
        </div>

        {/* Grid Area 2: Skills & Research (Left Column) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

          {/* Skills Card */}
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Layout size={18} className="text-purple-400" /> Skills</h3>
              <button onClick={() => addItem('skills', { name: '', level: 50 })} className={neonButton}><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(Array.isArray(formData?.skills) ? formData.skills : []).map((skill, idx) => (
                <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 group">
                  <div className="flex justify-between mb-2">
                    <input
                      type="text"
                      value={skill?.name || ""}
                      onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)}
                      className="bg-transparent border-none text-sm text-white focus:ring-0 p-0 w-full"
                      placeholder="Skill Name"
                    />
                    <button onClick={() => removeItem('skills', idx)} className="text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                  <input
                    type="range"
                    min="0" max="100"
                    value={skill?.level || 0}
                    onChange={(e) => handleArrayChange('skills', idx, 'level', parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Research Card */}
          <div className={glassCard}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Globe size={18} className="text-pink-400" /> Research</h3>
              <button onClick={() => addItem('research', { title: '', description: '', link: '', analysis_ai: '', picture_url: '' })} className={neonButton}><Plus size={14} /> Add</button>
            </div>
            <div className="space-y-4">
              {(Array.isArray(formData?.research) ? formData.research : []).map((paper, idx) => (
                <div key={idx} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3 relative">
                  <button onClick={() => removeItem('research', idx)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  <input
                    type="text"
                    value={paper?.title || ""}
                    onChange={(e) => handleArrayChange('research', idx, 'title', e.target.value)}
                    className={inputStyle}
                    placeholder="Paper Title"
                  />
                  <div className="relative">
                    <textarea
                      rows={3}
                      value={paper?.analysis_ai || ""}
                      onChange={(e) => handleArrayChange('research', idx, 'analysis_ai', e.target.value)}
                      className={`${inputStyle} text-xs`}
                      placeholder="Analysis..."
                    />
                    <button
                      onClick={() => handleResearchAi(idx)}
                      disabled={generating?.type === 'research' && generating?.index === idx}
                      className="absolute bottom-2 right-2 text-cyan-400 hover:text-white"
                    >
                      {generating?.type === 'research' && generating?.index === idx ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <label className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-2 flex items-center justify-center cursor-pointer text-xs text-slate-400 transition-colors">
                      <Upload size={12} className="mr-2" /> {paper?.image_url ? "Graph Uploaded" : "Upload Graph"}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleResearchImageUpload(idx, e)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <PDFUploader setFormData={setFormData} />

        </div>

        {/* Grid Area 3: The Journey - Experience (Right Column) */}
        <div className={`col-span-12 lg:col-span-7 ${glassCard}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Rocket size={20} className="text-cyan-400" /> Experience Journey</h3>
            <button onClick={() => addItem('experience', { jobTitle: '', company: '', date: '', responsibilities: '', description: '' })} className={neonButton}><Plus size={16} /> Add Role</button>
          </div>

          <div className="space-y-8">
            {(Array.isArray(formData?.experience) ? formData.experience : []).map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-white/10 hover:border-cyan-500/50 transition-colors pb-8 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-black border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                <button onClick={() => removeItem('experience', idx)} className="absolute top-0 right-0 text-slate-600 hover:text-red-400"><Trash2 size={16} /></button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelStyle}>Job Title</label>
                    <input
                      type="text"
                      value={exp?.jobTitle || ""}
                      onChange={(e) => handleArrayChange('experience', idx, 'jobTitle', e.target.value)}
                      className={inputStyle}
                      placeholder="Senior Developer"
                    />
                  </div>
                  <div>
                    <label className={labelStyle}>Company</label>
                    <input
                      type="text"
                      value={exp?.company || ""}
                      onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)}
                      className={inputStyle}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className={labelStyle}>Date Range</label>
                  <input
                    type="text"
                    value={exp?.date || ""}
                    onChange={(e) => handleArrayChange('experience', idx, 'date', e.target.value)}
                    className={inputStyle}
                    placeholder="Jan 2020 - Present"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label className={labelStyle}>Responsibilities</label>
                    <textarea
                      rows={4}
                      value={exp?.responsibilities || ""}
                      onChange={(e) => handleArrayChange('experience', idx, 'responsibilities', e.target.value)}
                      className={inputStyle}
                      placeholder="Bullet points..."
                    />
                    <button
                      onClick={() => handleExperienceAi(idx, 'responsibilities')}
                      disabled={generating?.type === 'exp' && generating?.index === idx && generating?.field === 'responsibilities'}
                      className="absolute top-8 right-2 text-cyan-400 hover:text-white p-1"
                    >
                      {generating?.type === 'exp' && generating?.index === idx && generating?.field === 'responsibilities' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className={labelStyle}>Description</label>
                    <textarea
                      rows={4}
                      value={exp?.description || ""}
                      onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)}
                      className={inputStyle}
                      placeholder="Role summary..."
                    />
                    <button
                      onClick={() => handleExperienceAi(idx, 'description')}
                      disabled={generating?.type === 'exp' && generating?.index === idx && generating?.field === 'description'}
                      className="absolute top-8 right-2 text-cyan-400 hover:text-white p-1"
                    >
                      {generating?.type === 'exp' && generating?.index === idx && generating?.field === 'description' ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid Area 4: Bottom Grid (Achievements, Gallery, Contact, Themes) */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Achievements */}
          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Achievements</h3>
            <div className="space-y-2">
              {(Array.isArray(formData?.achievements) ? formData.achievements : []).map((ach, idx) => (
                <div key={idx} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-2 relative">
                  <button onClick={() => removeItem('achievements', idx)} className="absolute top-2 right-2 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                  <input
                    type="text"
                    value={ach?.title || ""}
                    onChange={(e) => handleArrayChange('achievements', idx, 'title', e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 text-sm py-1 focus:border-cyan-500 outline-none font-bold text-slate-200"
                    placeholder="Award Title"
                  />
                  <textarea
                    rows={2}
                    value={ach?.description || ""}
                    onChange={(e) => handleArrayChange('achievements', idx, 'description', e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 text-xs py-1 focus:border-cyan-500 outline-none resize-none text-slate-300"
                    placeholder="Description..."
                  />
                  <label className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 text-slate-300 rounded-md p-1.5 cursor-pointer hover:bg-white/10 transition-colors text-xs">
                    <Upload size={12} />
                    {ach?.image ? (ach.image instanceof File ? ach.image.name : "Image Uploaded") : "Upload Image"}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAchievementImageUpload(idx, e)} />
                  </label>
                </div>
              ))}
              <button onClick={() => addItem('achievements', { title: '', description: '', image: null })} className="text-xs text-cyan-400 hover:text-white mt-2 flex items-center gap-1"><Plus size={12} /> Add Achievement</button>
            </div>
          </div>

          {/* Gallery */}
          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Gallery</h3>
            <div className="grid grid-cols-2 gap-2">
              {(Array.isArray(formData?.gallery) ? formData.gallery : []).map((item, idx) => (
                <div key={idx} className="bg-black/20 p-2 rounded-lg border border-white/5 relative group">
                  <button onClick={() => removeItem('gallery', idx)} className="absolute top-1 right-1 z-10 text-white bg-black/50 rounded-full p-1 hover:bg-red-500/80 transition-colors"><Trash2 size={10} /></button>
                  <div className="aspect-square bg-white/5 rounded-md mb-2 overflow-hidden flex items-center justify-center relative">
                    {item?.image ? (
                      <img src={item.image instanceof File ? URL.createObjectURL(item.image) : item.image} alt="Gallery" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} className="text-slate-600" />
                    )}
                    <label className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                      <Upload size={16} className="text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleGalleryImageUpload(idx, e)} />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={item?.caption || ""}
                    onChange={(e) => handleArrayChange('gallery', idx, 'caption', e.target.value)}
                    className="w-full bg-transparent border-b border-white/10 text-[10px] py-1 focus:border-cyan-500 outline-none text-center text-slate-300"
                    placeholder="Caption"
                  />
                </div>
              ))}
              <button onClick={() => addItem('gallery', { image: null, caption: '' })} className="aspect-square bg-white/5 rounded-lg border border-white/5 border-dashed hover:border-cyan-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-cyan-400">
                <Plus size={20} />
                <span className="text-[10px] mt-1">Add</span>
              </button>
            </div>
          </div>

          {/* Contact */}
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

          {/* Themes Selection */}
          <div className={glassCard}>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Theme</h3>
            <div className="grid grid-cols-2 gap-2">
              {['galaxy', 'lava', 'forest', 'neon'].map(themeOption => (
                <div
                  key={themeOption}
                  onClick={() => setFormData(prev => ({ ...prev, theme: themeOption }))}
                  className={`aspect-video rounded-lg overflow-hidden cursor-pointer relative border-2 transition-all ${formData.theme === themeOption ? 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <span className="text-xs font-bold uppercase text-slate-400">{themeOption}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <label className={labelStyle}>Public URL</label>
              <div className="flex items-center bg-black/40 rounded-lg px-3 py-2 border border-white/10">
                <span className="text-xs text-slate-400 truncate flex-1">{formData?.publicUrl || ""}</span>
                <Eye size={14} className="text-cyan-400 cursor-pointer hover:text-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;