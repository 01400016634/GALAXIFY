import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const PersonalBrandBuilder = ({ pageData, setPageData }) => {
    // 🚀 CRASH PROOFING: If data doesn't exist yet, fall back to empty objects
    const pb = pageData?.personalBrand || {};

    // --- SAFE STATE UPDATERS ---
    const updateSection = (section, field, value) => {
        setPageData(prev => {
            const currentPb = prev.personalBrand || {};
            const currentSec = currentPb[section] || {};
            return { ...prev, personalBrand: { ...currentPb, [section]: { ...currentSec, [field]: value } } };
        });
    };

    const addArrayItem = (arrName, emptyObj) => {
        setPageData(prev => {
            const currentPb = prev.personalBrand || {};
            const currentArr = currentPb[arrName] || [];
            return { ...prev, personalBrand: { ...currentPb, [arrName]: [...currentArr, emptyObj] } };
        });
    };

    const updateArrayItem = (arrName, index, field, value) => {
        setPageData(prev => {
            const currentPb = prev.personalBrand || {};
            const currentArr = [...(currentPb[arrName] || [])];
            if (currentArr[index]) currentArr[index] = { ...currentArr[index], [field]: value };
            return { ...prev, personalBrand: { ...currentPb, [arrName]: currentArr } };
        });
    };

    const removeArrayItem = (arrName, index) => {
        setPageData(prev => {
            const currentPb = prev.personalBrand || {};
            const currentArr = (currentPb[arrName] || []).filter((_, i) => i !== index);
            return { ...prev, personalBrand: { ...currentPb, [arrName]: currentArr } };
        });
    };

    // --- MINI UI COMPONENTS (Saves hundreds of lines of code!) ---
    const TextInput = ({ label, value, onChange, placeholder = "" }) => (
        <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
            <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500" />
        </div>
    );

    const TextArea = ({ label, value, onChange }) => (
        <div className="col-span-full">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
            <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500 h-20 resize-none" />
        </div>
    );

    return (
        <div className="space-y-6 pb-20 animate-in fade-in">

            {/* 1. INTRO */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">1. Introduction Section</h3>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Full Name" value={pb.intro?.name} onChange={v => updateSection('intro', 'name', v)} />
                    <TextInput label="Designation" value={pb.intro?.designation} onChange={v => updateSection('intro', 'designation', v)} />
                    <TextInput label="Short Headline" value={pb.intro?.headline} onChange={v => updateSection('intro', 'headline', v)} />
                    <TextInput label="Quick Contact Btn" value={pb.intro?.contactBtn} onChange={v => updateSection('intro', 'contactBtn', v)} />
                </div>
            </div>

            {/* 2. ABOUT ME */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">2. About Me</h3>
                <TextArea label="Full Description" value={pb.about?.description} onChange={v => updateSection('about', 'description', v)} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <TextInput label="Total Experience" value={pb.about?.totalExp} onChange={v => updateSection('about', 'totalExp', v)} />
                    <TextInput label="Total Orgs" value={pb.about?.totalOrg} onChange={v => updateSection('about', 'totalOrg', v)} />
                    <TextInput label="Total Webinars" value={pb.about?.totalWebinars} onChange={v => updateSection('about', 'totalWebinars', v)} />
                    <TextInput label="CV Download Link" value={pb.about?.cvLink} onChange={v => updateSection('about', 'cvLink', v)} />
                </div>
            </div>

            {/* 3. SKILLS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">3. My Skills</h3>
                    <button onClick={() => addArrayItem('skills', { title: '', desc: '', level: '' })} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg text-xs font-bold">+ Add Skill</button>
                </div>
                <div className="space-y-2">
                    {(pb.skills || []).map((s, i) => (
                        <div key={i} className="flex gap-2 bg-black/40 p-2 rounded-lg border border-white/5">
                            <TextInput label="Title" value={s.title} onChange={v => updateArrayItem('skills', i, 'title', v)} />
                            <TextInput label="Desc" value={s.desc} onChange={v => updateArrayItem('skills', i, 'desc', v)} />
                            <TextInput label="Level/Tag" value={s.level} onChange={v => updateArrayItem('skills', i, 'level', v)} />
                            <button onClick={() => removeArrayItem('skills', i)} className="text-red-400 px-2 mt-4 hover:bg-white/5 rounded"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. WORK EXP */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">4. Work Experience</h3>
                    <button onClick={() => addArrayItem('workExperience', { role: '', org: '', period: '', desc: '' })} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg text-xs font-bold">+ Add Exp</button>
                </div>
                <div className="space-y-3">
                    {(pb.workExperience || []).map((w, i) => (
                        <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-black/40 p-4 rounded-lg border border-white/5 relative">
                            <TextInput label="Role" value={w.role} onChange={v => updateArrayItem('workExperience', i, 'role', v)} />
                            <TextInput label="Organization" value={w.org} onChange={v => updateArrayItem('workExperience', i, 'org', v)} />
                            <TextInput label="Period" value={w.period} onChange={v => updateArrayItem('workExperience', i, 'period', v)} />
                            <TextInput label="Description" value={w.desc} onChange={v => updateArrayItem('workExperience', i, 'desc', v)} />
                            <button onClick={() => removeArrayItem('workExperience', i)} className="absolute top-2 right-2 text-red-400 bg-red-500/10 p-1.5 rounded hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 5. OWN BUSINESS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">5. Own Business / Startup</h3>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Company Name" value={pb.businessProfile?.name} onChange={v => updateSection('businessProfile', 'name', v)} />
                    <TextInput label="Punch Line" value={pb.businessProfile?.punchline} onChange={v => updateSection('businessProfile', 'punchline', v)} />
                    <TextArea label="Description" value={pb.businessProfile?.desc} onChange={v => updateSection('businessProfile', 'desc', v)} />
                    <TextInput label="Total Members" value={pb.businessProfile?.members} onChange={v => updateSection('businessProfile', 'members', v)} />
                    <TextInput label="Countries Served" value={pb.businessProfile?.countries} onChange={v => updateSection('businessProfile', 'countries', v)} />
                </div>
            </div>

            {/* 6 to 12. DYNAMIC GALLERIES & LISTS (Maps all requested grids automatically!) */}
            {[
                { id: 'certificates', title: '6. Certificates' },
                { id: 'trainings', title: '7. Training & Workshops' },
                { id: 'consultancies', title: '8. Consultancy Records' },
                { id: 'webinars', title: '9. Completed Webinars' },
                { id: 'dashboards', title: '10. Power BI Dashboards' },
                { id: 'gisMapping', title: '11. GIS Mapping Gallery' },
                { id: 'teamwork', title: '12. Teamwork Gallery' }
            ].map(sec => (
                <div key={sec.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{sec.title}</h3>
                        <button onClick={() => addArrayItem(sec.id, { title: '', detail: '', link: '' })} className="px-3 py-1 bg-cyan-600/20 text-cyan-400 rounded-lg text-xs font-bold">+ Add Item</button>
                    </div>
                    <div className="space-y-3">
                        {(pb[sec.id] || []).map((item, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/40 p-4 rounded-lg border border-white/5 relative">
                                <TextInput label="Title / Name" value={item.title} onChange={v => updateArrayItem(sec.id, i, 'title', v)} />
                                <TextInput label="Detail / Date / Org" value={item.detail} onChange={v => updateArrayItem(sec.id, i, 'detail', v)} />
                                <TextInput label="Image URL / Link" value={item.link} onChange={v => updateArrayItem(sec.id, i, 'link', v)} />
                                <button onClick={() => removeArrayItem(sec.id, i)} className="absolute top-2 right-2 text-red-400 bg-red-500/10 p-1.5 rounded hover:bg-red-500/20 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {/* 13. CONTACT LINKS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-lg font-bold text-white mb-4">13. Contact Links</h3>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Facebook URL" value={pb.contactLinks?.facebook} onChange={v => updateSection('contactLinks', 'facebook', v)} />
                    <TextInput label="LinkedIn URL" value={pb.contactLinks?.linkedin} onChange={v => updateSection('contactLinks', 'linkedin', v)} />
                    <TextInput label="YouTube URL" value={pb.contactLinks?.youtube} onChange={v => updateSection('contactLinks', 'youtube', v)} />
                    <TextInput label="WhatsApp Number" value={pb.contactLinks?.whatsapp} onChange={v => updateSection('contactLinks', 'whatsapp', v)} />
                    <TextInput label="Website URL" value={pb.contactLinks?.website} onChange={v => updateSection('contactLinks', 'website', v)} />
                </div>
            </div>

        </div>
    );
};

export default PersonalBrandBuilder;