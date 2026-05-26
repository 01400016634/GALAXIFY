import React, { useState } from 'react';
import { Plus, Trash2, User, Briefcase, Award, Monitor, Map, Users, Link2, FileText, CheckCircle2 } from 'lucide-react';

const TextInput = ({ label, value, onChange, placeholder = "", type = "text" }) => (
    <div className="w-full">
        <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5">{label}</label>
        <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition-colors shadow-inner" />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder = "" }) => (
    <div className="w-full">
        <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5">{label}</label>
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 min-h-[80px] resize-y transition-colors shadow-inner" />
    </div>
);

// 🚀 REAL UPLOAD BUTTON FOR PERSONAL BRAND
const ImageUpload = ({ label, value, onChange, uploadFile }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        try {
            if (!uploadFile) { alert("Upload function not connected!"); return; }
            const url = await uploadFile(e.target.files[0]);
            if (url) onChange(url);
        } catch (err) { alert("Upload failed."); }
        finally { setUploading(false); }
    };

    return (
        <div className="w-full">
            <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5">{label}</label>
            {value ? (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-xl">
                    <span className="text-xs text-green-400 truncate flex-1">📎 Image Attached</span>
                    <button onClick={() => onChange('')} className="text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wider">Remove</button>
                </div>
            ) : (
                <div className="relative">
                    <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="bg-black/60 border border-white/10 border-dashed rounded-xl px-4 py-3 text-sm text-center text-gray-400 hover:border-cyan-500 transition-colors">
                        {uploading ? 'Uploading...' : '📁 Click to Upload Image'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function PersonalBrandBuilder({ pageData, setPageData, uploadFileToStorage }) {
    const pb = pageData?.personalBrand || {};

    const updateSection = (sec, field, val) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [sec]: { ...(prev.personalBrand?.[sec] || {}), [field]: val } } }));
    const addArrayItem = (arr, obj) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [arr]: [...(prev.personalBrand?.[arr] || []), obj] } }));
    const updateArrayItem = (arr, i, field, val) => setPageData(prev => { const newArr = [...(prev.personalBrand?.[arr] || [])]; newArr[i] = { ...newArr[i], [field]: val }; return { ...prev, personalBrand: { ...prev.personalBrand, [arr]: newArr } } });
    const removeArrayItem = (arr, i) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [arr]: (prev.personalBrand?.[arr] || []).filter((_, index) => index !== i) } }));

    const ArraySection = ({ id, title, icon: Icon, emptyObj, fields }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg md:text-xl font-black text-white flex items-center gap-2"><Icon className="text-cyan-400" size={20} /> {title}</h3>
                <button onClick={() => addArrayItem(id, emptyObj)} className="px-4 py-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"><Plus size={14} /> Add New</button>
            </div>
            <div className="space-y-4">
                {(pb[id] || []).map((item, i) => (
                    <div key={i} className="bg-black/40 p-5 rounded-xl border border-white/5 relative group hover:border-cyan-500/30 transition-colors pt-8 md:pt-5">
                        <button onClick={() => removeArrayItem(id, i)} className="absolute top-3 right-3 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-0 md:pr-10">
                            {fields.map((field, fIdx) => (
                                <div key={fIdx} className={field.span === 'full' ? "col-span-1 md:col-span-2 lg:col-span-3" : field.span === 'half' ? "col-span-1 md:col-span-2 lg:col-span-2" : "col-span-1"}>
                                    {field.type === 'textarea' ? (
                                        <TextArea label={field.label} value={item[field.key]} onChange={v => updateArrayItem(id, i, field.key, v)} placeholder={field.placeholder} />
                                    ) : field.type === 'image' ? (
                                        <ImageUpload label={field.label} value={item[field.key]} onChange={v => updateArrayItem(id, i, field.key, v)} uploadFile={uploadFileToStorage} />
                                    ) : (
                                        <TextInput label={field.label} type={field.inputType || 'text'} value={item[field.key]} onChange={v => updateArrayItem(id, i, field.key, v)} placeholder={field.placeholder} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {(!pb[id] || pb[id].length === 0) && <div className="text-center py-8 bg-black/20 rounded-xl border border-white/5 border-dashed"><p className="text-gray-500 text-sm">No items added yet.</p></div>}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in pb-20 w-full">
            {/* 1. INTRO */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                <h3 className="text-lg md:text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><User className="text-cyan-400" size={20} /> 1. Introduction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <TextInput label="Full Name" value={pb.intro?.name} onChange={v => updateSection('intro', 'name', v)} />
                    <TextInput label="Designation" value={pb.intro?.designation} onChange={v => updateSection('intro', 'designation', v)} />
                    <div className="sm:col-span-2"><TextInput label="Short Headline" value={pb.intro?.headline} onChange={v => updateSection('intro', 'headline', v)} /></div>
                    <TextInput label="Quick Contact Btn Text" value={pb.intro?.contactBtn} onChange={v => updateSection('intro', 'contactBtn', v)} placeholder="e.g. Hire Me" />
                    <TextInput label="Contact Btn Link URL" value={pb.intro?.contactBtnUrl} onChange={v => updateSection('intro', 'contactBtnUrl', v)} placeholder="e.g. #contact or https://..." />
                    <TextInput label="View Work Btn Text" value={pb.intro?.workBtn} onChange={v => updateSection('intro', 'workBtn', v)} placeholder="e.g. View Portfolio" />
                    <TextInput label="View Work Link URL" value={pb.intro?.workBtnUrl} onChange={v => updateSection('intro', 'workBtnUrl', v)} placeholder="e.g. #experience or https://..." />
                </div>
            </div>

            {/* 2. ABOUT ME */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                <h3 className="text-lg md:text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><FileText className="text-cyan-400" size={20} /> 2. About Me Stats</h3>
                <div className="space-y-5 w-full">
                    <TextArea label="Full Description" value={pb.about?.description} onChange={v => updateSection('about', 'description', v)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <TextInput label="Total Experience" value={pb.about?.totalExp} onChange={v => updateSection('about', 'totalExp', v)} placeholder="e.g. 5+ Years" />
                        <TextInput label="Organizations" value={pb.about?.totalOrg} onChange={v => updateSection('about', 'totalOrg', v)} placeholder="e.g. 12" />
                        <TextInput label="Webinars/Trainings" value={pb.about?.totalWebinars} onChange={v => updateSection('about', 'totalWebinars', v)} placeholder="e.g. 30+" />
                        <TextInput label="CV Download URL" value={pb.about?.cvLink} onChange={v => updateSection('about', 'cvLink', v)} placeholder="https://..." />
                    </div>
                </div>
            </div>

            {/* 3. SKILLS */}
            <ArraySection
                id="skills" title="3. My Skills" icon={Award}
                emptyObj={{ title: '', desc: '', level: '' }}
                fields={[
                    { key: 'title', label: 'Skill Name' }, { key: 'level', label: 'Level / Tag' },
                    { key: 'desc', label: 'Short Description', span: 'full', type: 'textarea' }
                ]}
            />

            {/* 4. WORK EXP */}
            <ArraySection
                id="workExperience" title="4. Work Experience" icon={Briefcase}
                emptyObj={{ role: '', org: '', period: '', desc: '' }}
                fields={[
                    { key: 'role', label: 'Role / Designation', span: 'half' }, { key: 'org', label: 'Organization Name' },
                    { key: 'period', label: 'Working Period (e.g. 2020-2023)' },
                    { key: 'desc', label: 'Job Description', span: 'full', type: 'textarea' }
                ]}
            />

            {/* 5. OWN BUSINESS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg">
                <h3 className="text-lg md:text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><Briefcase className="text-cyan-400" size={20} /> 5. Own Business / Startup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <TextInput label="Company Name" value={pb.businessProfile?.name} onChange={v => updateSection('businessProfile', 'name', v)} />
                    <TextInput label="Punch Line" value={pb.businessProfile?.punchline} onChange={v => updateSection('businessProfile', 'punchline', v)} />
                    <div className="sm:col-span-2"><TextArea label="Description" value={pb.businessProfile?.desc} onChange={v => updateSection('businessProfile', 'desc', v)} /></div>
                    <TextInput label="Total Members" value={pb.businessProfile?.members} onChange={v => updateSection('businessProfile', 'members', v)} />
                    <TextInput label="Countries/Orgs Served" value={pb.businessProfile?.countries} onChange={v => updateSection('businessProfile', 'countries', v)} />
                </div>
                {/* Business Features Array */}
                <div className="mt-8 border-t border-white/5 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase">Business Features (Bullet Points)</label>
                        <button onClick={() => addArrayItem('businessFeatures', { text: '' })} className="text-cyan-400 text-xs font-bold bg-cyan-500/10 px-3 py-1 rounded">+ Add Feature</button>
                    </div>
                    <div className="space-y-2">
                        {(pb.businessFeatures || []).map((feat, i) => (
                            <div key={i} className="flex gap-2">
                                <input type="text" value={feat.text} onChange={e => updateArrayItem('businessFeatures', i, 'text', e.target.value)} placeholder="Feature description..." className="flex-1 bg-black/60 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-cyan-500" />
                                <button onClick={() => removeArrayItem('businessFeatures', i)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. CERTIFICATES */}
            <ArraySection
                id="certificates" title="6. Certificates" icon={Award}
                emptyObj={{ title: '', source: '', year: '', detail: '', link: '' }}
                fields={[
                    { key: 'title', label: 'Certificate Title', span: 'half' }, { key: 'year', label: 'Year' },
                    { key: 'source', label: 'Institution / Source', span: 'half' },
                    { key: 'detail', label: 'Short Achievement Details', span: 'full', type: 'textarea' },
                    { key: 'link', label: 'Upload PNG/Image', span: 'full', type: 'image' }
                ]}
            />

            {/* 7. TRAININGS */}
            <ArraySection
                id="trainings" title="7. Training & Workshops" icon={Users}
                emptyObj={{ title: '', org: '', start: '', end: '', desc: '', btnName: '', btnLink: '' }}
                fields={[
                    { key: 'title', label: 'Workshop Title', span: 'half' }, { key: 'org', label: 'Organization' },
                    { key: 'start', label: 'Start Date', inputType: 'date' }, { key: 'end', label: 'End Date', inputType: 'date' },
                    { key: 'desc', label: 'Short Description', span: 'full', type: 'textarea' },
                    { key: 'btnName', label: 'Custom Button Name' }, { key: 'btnLink', label: 'Button Link URL' }
                ]}
            />

            {/* 8. CONSULTANCIES */}
            <ArraySection
                id="consultancies" title="8. Consultancy Records" icon={Briefcase}
                emptyObj={{ title: '', org: '', start: '', end: '' }}
                fields={[
                    { key: 'title', label: 'Consultancy Title', span: 'half' }, { key: 'org', label: 'Organization' },
                    { key: 'start', label: 'Start Date', inputType: 'date' }, { key: 'end', label: 'End Date', inputType: 'date' }
                ]}
            />

            {/* 9. WEBINARS */}
            <ArraySection
                id="webinars" title="9. Completed Webinars" icon={Monitor}
                emptyObj={{ name: '', date: '' }}
                fields={[
                    { key: 'name', label: 'Webinar Name', span: 'half' }, { key: 'date', label: 'Date', inputType: 'date' }
                ]}
            />

            {/* 10-12. GALLERIES & DASHBOARDS */}
            {[
                { id: 'dashboards', title: '10. Power BI Dashboards', icon: Monitor, f1: 'Dashboard Title', f2: 'Dashboard Embed Link' },
                { id: 'gisMapping', title: '11. GIS Mapping Gallery', icon: Map, f1: 'Gallery Title', f2: 'Upload Photo' },
                { id: 'teamwork', title: '12. Teamwork Gallery', icon: Users, f1: 'Gallery Title', f2: 'Upload Photo' }
            ].map(sec => (
                <ArraySection
                    key={sec.id} id={sec.id} title={sec.title} icon={sec.icon}
                    emptyObj={{ title: '', link: '' }}
                    fields={[
                        { key: 'title', label: sec.f1, span: 'half' },
                        { key: 'link', label: sec.f2, span: 'half', type: sec.id !== 'dashboards' ? 'image' : 'text' }
                    ]}
                />
            ))}

            {/* 13. CONTACT LINKS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 shadow-lg mb-10">
                <h3 className="text-lg md:text-xl font-black text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><Link2 className="text-cyan-400" size={20} /> 13. Contact Links & Socials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    <div className="sm:col-span-2"><TextArea label="Contact Description Text" value={pb.contactLinks?.desc} onChange={v => updateSection('contactLinks', 'desc', v)} /></div>
                    <TextInput label="Facebook URL" value={pb.contactLinks?.facebook} onChange={v => updateSection('contactLinks', 'facebook', v)} />
                    <TextInput label="LinkedIn URL" value={pb.contactLinks?.linkedin} onChange={v => updateSection('contactLinks', 'linkedin', v)} />
                    <TextInput label="YouTube URL" value={pb.contactLinks?.youtube} onChange={v => updateSection('contactLinks', 'youtube', v)} />
                    <TextInput label="WhatsApp Number" value={pb.contactLinks?.whatsapp} onChange={v => updateSection('contactLinks', 'whatsapp', v)} />
                    <TextInput label="Website URL" value={pb.contactLinks?.website} onChange={v => updateSection('contactLinks', 'website', v)} />
                    <TextInput label="Gmail Address" value={pb.contactLinks?.gmail} onChange={v => updateSection('contactLinks', 'gmail', v)} />
                </div>
            </div>

        </div>
    );
}