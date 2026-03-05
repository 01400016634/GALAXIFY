import React, { useState } from 'react';
import { Wand2, Upload, Link as LinkIcon, Github, Linkedin, Mail, Plus, Trash2, Globe, MessageCircle, Facebook, Loader2 } from 'lucide-react';
import { generateExperience, generateResearchAnalysis } from '../../services/gemini';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

const PortfolioForm = ({ formData, setFormData }) => {
  const { currentUser } = useAuth();
  const [generating, setGenerating] = useState(null);
  const [uploading, setUploading] = useState(null); // Track which field is uploading

  // Handle simple field updates (root level or contact object)
  const handleFieldChange = (section, field, value) => {
    setFormData(prev => {
      if (section === 'personal') return { ...prev, personal: { ...prev.personal, [field]: value } };
      if (section === 'root') return { ...prev, [field]: value }; // For 'about'
      if (section === 'contact') return { ...prev, contact: { ...prev.contact, [field]: value } };
      return prev;
    });
  };

  // Handle array updates (skills, experience, projects, achievements)
  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      if (field) {
        newArray[index] = { ...newArray[index], [field]: value };
      } else {
        newArray[index] = value;
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Add new blank items
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { name: '', level: 50 }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { jobTitle: '', company: '', date: '', responsibilities: '', description: '' }]
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { title: '', description: '', link: '', image_url: '' }]
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({ ...prev, achievements: [...(prev.achievements || []), ''] }));
  };

  const addResearch = () => {
    setFormData(prev => ({ ...prev, research: [...(prev.research || []), { title: '', journal: '', link: '', image_url: '', analysis_ai: '' }] }));
  };

  const removeItem = (arrayName, index) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleAiGenerate = async (index, field) => {
    const exp = formData.experience[index];
    if (!exp?.jobTitle || !exp?.company) {
      alert("Please enter Job Title and Company first.");
      return;
    }

    setGenerating({ index, field });
    try {
      const type = field === 'responsibilities' ? 'key responsibilities' : 'job description';
      const text = await generateExperience(exp.jobTitle, exp.company, type);
      handleArrayChange('experience', index, field, text);
    } catch (error) {
      console.error(error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setGenerating(null);
    }
  };

  const handleResearchAiGenerate = async (index) => {
    const paper = formData.research[index];
    if (!paper?.title) {
      alert("Please enter Paper Title first.");
      return;
    }

    setGenerating({ index, field: 'research_analysis' });
    try {
      const text = await generateResearchAnalysis(paper.title);
      handleArrayChange('research', index, 'analysis_ai', text);
    } catch (error) {
      console.error(error);
      alert("Failed to generate analysis.");
    } finally {
      setGenerating(null);
    }
  };

  // --- Immediate File Upload Handlers ---

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading('profile');
    try {
      const url = await uploadFile(file, `users/${currentUser.uid}/profile_${Date.now()}`);
      handleFieldChange('personal', 'profilePicture', url);
    } catch (error) {
      console.error("Profile upload failed", error);
    } finally {
      setUploading(null);
    }
  };

  const handleAchievementUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, `users/${currentUser.uid}/achievements/${Date.now()}_${file.name}`);
      handleArrayChange('achievements', index, 'image', url);
    } catch (error) {
      console.error("Achievement upload failed", error);
    }
  };

  const handleGalleryUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadFile(file, `users/${currentUser.uid}/gallery/${Date.now()}_${file.name}`);
      handleArrayChange('gallery', index, 'image', url);
    } catch (error) {
      console.error("Gallery upload failed", error);
    }
  };

  const handleResearchImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `research/${currentUser.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      handleArrayChange('research', index, 'image_url', downloadURL);
    } catch (error) {
      console.error("Error uploading research image:", error);
      alert("Failed to upload image.");
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-slate-300 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm";
  const labelClass = "block text-xs text-slate-400 mb-1 font-medium uppercase tracking-wider";
  const sectionClass = "bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col gap-6 shadow-xl h-fit";
  const aiButtonClass = "absolute top-2 right-2 p-1.5 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white transition-all";

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 w-full">
      
      {/* Column 1: Personal & Skills */}
      <div className="xl:col-span-1 space-y-6">
        <div className={sectionClass}>
          <h3 className="text-lg font-semibold text-white mb-2 border-b border-white/10 pb-2">Personal Details</h3>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input 
                type="text" 
                value={formData?.personal?.name || ""}
                onChange={(e) => handleFieldChange('personal', 'name', e.target.value)}
                className={inputClass}
                placeholder="e.g. Sarah Connor"
              />
            </div>
            <div>
              <label className={labelClass}>Designation</label>
              <input 
                type="text" 
                value={formData?.personal?.designation || ""}
                onChange={(e) => handleFieldChange('personal', 'designation', e.target.value)}
                className={inputClass}
                placeholder="e.g. Senior UX Designer"
              />
            </div>
            
            <div>
              <label className={labelClass}>Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {formData?.personal?.profilePicture ? (
                    <img src={formData.personal.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <Upload size={20} className="text-slate-500" />
                  )}
                </div>
                <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-md transition-colors">
                  {uploading === 'profile' ? "Uploading..." : "Upload Photo"}
                  <input type="file" className="hidden" onChange={handleProfileUpload} disabled={uploading === 'profile'} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <label className={labelClass}>About Me</label>
          <div className="relative">
            <textarea 
              rows={4}
              value={formData?.about || ""}
              onChange={(e) => handleFieldChange('root', 'about', e.target.value)}
              className={`${inputClass} resize-none`}
              placeholder="Tell your story..."
            />
            <button className={aiButtonClass} title="Generate with AI">
              <Wand2 size={14} />
            </button>
          </div>
        </div>

        <div className={sectionClass}>
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
            <button onClick={addSkill} className="text-blue-400 hover:text-white flex items-center gap-1 text-xs"><Plus size={14} /> Add</button>
          </div>
          <div className="space-y-4">
            {(Array.isArray(formData?.skills) ? formData.skills : []).map((skill, idx) => (
              <div key={idx} className="space-y-1 relative group">
                <div className="flex justify-between">
                  <input 
                    type="text" 
                    value={skill?.name || ""}
                    onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)}
                    className="bg-transparent border-none text-xs text-slate-300 focus:ring-0 p-0 w-1/2 placeholder-slate-600"
                    placeholder="Skill Name"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{skill?.level || 0}%</span>
                    <button onClick={() => removeItem('skills', idx)} className="text-red-500/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={skill?.level || 0}
                  onChange={(e) => handleArrayChange('skills', idx, 'level', parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Experience (NOW WITH THE PROPER MAP LOOP!) */}
      <div className={`${sectionClass} xl:col-span-1`}>
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
          <h3 className="text-lg font-semibold text-white">Experience</h3>
          <button onClick={addExperience} className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-md text-xs transition-colors">
            + Add Experience
          </button>
        </div>
        
        <div className="space-y-8">
          {(Array.isArray(formData?.experience) ? formData.experience : []).map((exp, idx) => (
            <div key={idx} className="space-y-4 relative pb-6 border-b border-white/5 last:border-0 last:pb-0">
              <button onClick={() => removeItem('experience', idx)} className="absolute -top-2 right-0 text-red-500/50 hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
              
              <div>
                <label className={labelClass}>Job Title</label>
                <input 
                  type="text" 
                  value={exp?.jobTitle || ""}
                  onChange={(e) => handleArrayChange('experience', idx, 'jobTitle', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company</label>
                  <input 
                    type="text" 
                    value={exp?.company || ""}
                    onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Tech Corp"
                  />
                </div>
                <div>
                  <label className={labelClass}>Date</label>
                  <input 
                    type="text" 
                    value={exp?.date || ""}
                    onChange={(e) => handleArrayChange('experience', idx, 'date', e.target.value)}
                    className={inputClass}
                    placeholder="2020 - Present"
                  />
                </div>
              </div>

              <div className="relative">
                <label className={labelClass}>Key Responsibilities</label>
                <div className="relative">
                  <textarea 
                    rows={4}
                    value={exp?.responsibilities || ""}
                    onChange={(e) => handleArrayChange('experience', idx, 'responsibilities', e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="List your key duties..."
                  />
                  <button 
                    onClick={() => handleAiGenerate(idx, 'responsibilities')}
                    className={aiButtonClass} 
                    title="Generate with AI"
                    disabled={generating?.index === idx && generating?.field === 'responsibilities'}
                  >
                    {generating?.index === idx && generating?.field === 'responsibilities' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className={labelClass}>Job Description</label>
                <div className="relative">
                  <textarea 
                    rows={4}
                    value={exp?.description || ""}
                    onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Describe your role and impact..."
                  />
                  <button 
                    onClick={() => handleAiGenerate(idx, 'description')}
                    className={aiButtonClass} 
                    title="Generate with AI"
                    disabled={generating?.index === idx && generating?.field === 'description'}
                  >
                    {generating?.index === idx && generating?.field === 'description' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 3: Projects, Gallery & Contact */}
      <div className={`${sectionClass} xl:col-span-1`}>
        
        {/* Projects (NOW WITH THE PROPER MAP LOOP!) */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
            <h3 className="text-lg font-semibold text-white">Projects & Papers</h3>
            <button onClick={addProject} className="text-blue-400 hover:text-white flex items-center gap-1 text-xs"><Plus size={14} /> Add</button>
          </div>
          
          <div className="space-y-6">
            {(Array.isArray(formData?.projects) ? formData.projects : []).map((proj, idx) => (
              <div key={idx} className="space-y-4 relative pb-6 border-b border-white/5 last:border-0 last:pb-0">
                <button onClick={() => removeItem('projects', idx)} className="absolute -top-2 right-0 text-red-500/50 hover:text-red-400 p-1">
                  <Trash2 size={16} />
                </button>

                <div className="relative mt-2">
                  <label className={labelClass}>AI Description</label>
                  <div className="relative">
                    <textarea 
                      rows={3}
                      value={proj?.description || ""}
                      onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="Describe your project..."
                    />
                    <button className={aiButtonClass} title="Generate with AI">
                      <Wand2 size={14} />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className={labelClass}>Project Link</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-3 text-slate-500" />
                    <input 
                      type="text" 
                      value={proj?.link || ""}
                      onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)}
                      className={`${inputClass} pl-9`}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Showcase Image</label>
                  <div className="border-2 border-dashed border-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-slate-500 hover:border-blue-500/50 hover:bg-white/5 transition-all cursor-pointer h-24">
                    <Upload size={20} className="mb-1" />
                    <span className="text-[10px]">Upload Showcase</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">Contact Links</h3>
          <div className="space-y-3">
            <div className="relative">
              <Linkedin size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={formData?.contact?.linkedin || ""}
                onChange={(e) => handleFieldChange('contact', 'linkedin', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="LinkedIn URL"
              />
            </div>
            <div className="relative">
              <Github size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={formData?.contact?.github || ""}
                onChange={(e) => handleFieldChange('contact', 'github', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="GitHub URL"
              />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="email" 
                value={formData?.contact?.email || ""}
                onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Email Address"
              />
            </div>
            <div className="relative">
              <Facebook size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={formData?.contact?.facebook || ""}
                onChange={(e) => handleFieldChange('contact', 'facebook', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Facebook URL"
              />
            </div>
            <div className="relative">
              <MessageCircle size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={formData?.contact?.whatsapp || ""}
                onChange={(e) => handleFieldChange('contact', 'whatsapp', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="WhatsApp Number"
              />
            </div>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                value={formData?.contact?.personalWebsite || ""}
                onChange={(e) => handleFieldChange('contact', 'personalWebsite', e.target.value)}
                className={`${inputClass} pl-9`}
                placeholder="Personal Website"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioForm;