import React from 'react';
import { Plus, Trash2, User, Briefcase, Award, Monitor, Map, Users, Link2, FileText, BarChart3, Image as ImageIcon } from 'lucide-react';

const TextInput = ({ label, value, onChange, placeholder = "" }) => (
    <div className="w-full">
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
    </div>
);

const TextArea = ({ label, value, onChange }) => (
    <div className="w-full">
        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">{label}</label>
        <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-white min-h-[80px]" />
    </div>
);

export default function PersonalBrandBuilder({ pageData, setPageData }) {
    const pb = pageData?.personalBrand || {};

    const updateSection = (sec, field, val) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [sec]: { ...(prev.personalBrand?.[sec] || {}), [field]: val } } }));
    const addArrayItem = (arr, obj) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [arr]: [...(prev.personalBrand?.[arr] || []), obj] } }));
    const updateArrayItem = (arr, i, field, val) => setPageData(prev => { const newArr = [...(prev.personalBrand?.[arr] || [])]; newArr[i] = { ...newArr[i], [field]: val }; return { ...prev, personalBrand: { ...prev.personalBrand, [arr]: newArr } } });
    const removeArrayItem = (arr, i) => setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, [arr]: (prev.personalBrand?.[arr] || []).filter((_, index) => index !== i) } }));

    return (
        <div className="space-y-8 p-6 bg-black/20 rounded-2xl border border-white/5">
            {/* 1. Intro */}
            <section className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-white/10 pb-2">1. Introduction</h3>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Name" value={pb.intro?.name} onChange={v => updateSection('intro', 'name', v)} />
                    <TextInput label="Designation" value={pb.intro?.designation} onChange={v => updateSection('intro', 'designation', v)} />
                    <TextInput label="Headline" value={pb.intro?.headline} onChange={v => updateSection('intro', 'headline', v)} />
                    <TextInput label="Contact Btn" value={pb.intro?.contactBtn} onChange={v => updateSection('intro', 'contactBtn', v)} />
                    <TextInput label="View Work Btn" value={pb.intro?.workBtn} onChange={v => updateSection('intro', 'workBtn', v)} />
                </div>
            </section>

            {/* 2. About */}
            <section className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-white/10 pb-2">2. About Me</h3>
                <TextArea label="Full Description" value={pb.about?.description} onChange={v => updateSection('about', 'description', v)} />
                <div className="grid grid-cols-2 gap-4">
                    <TextInput label="Total Experience" value={pb.about?.totalExp} onChange={v => updateSection('about', 'totalExp', v)} />
                    <TextInput label="Total Orgs" value={pb.about?.totalOrg} onChange={v => updateSection('about', 'totalOrg', v)} />
                    <TextInput label="Total Webinars" value={pb.about?.totalWebinars} onChange={v => updateSection('about', 'totalWebinars', v)} />
                    <TextInput label="CV Link" value={pb.about?.cvLink} onChange={v => updateSection('about', 'cvLink', v)} />
                </div>
            </section>

            {/* 3. Skills */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-white">3. My Skills</h3>
                    <button onClick={() => addArrayItem('skills', { title: '', desc: '', level: '' })} className="text-cyan-400 text-xs font-bold">+ Add Skill</button>
                </div>
                {pb.skills?.map((s, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <TextInput label="Title" value={s.title} onChange={v => updateArrayItem('skills', i, 'title', v)} />
                        <TextInput label="Desc" value={s.desc} onChange={v => updateArrayItem('skills', i, 'desc', v)} />
                        <TextInput label="Level" value={s.level} onChange={v => updateArrayItem('skills', i, 'level', v)} />
                        <button onClick={() => removeArrayItem('skills', i)} className="text-red-500"><Trash2 size={16} /></button>
                    </div>
                ))}
            </section>

            {/* 4. Work Experience */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-black text-white">4. Work Experience</h3>
                    <button onClick={() => addArrayItem('workExperience', { role: '', org: '', period: '', desc: '' })} className="text-cyan-400 text-xs font-bold">+ Add Entry</button>
                </div>
                {pb.workExperience?.map((w, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 mb-4 bg-white/5 p-4 rounded-xl">
                        <TextInput label="Role" value={w.role} onChange={v => updateArrayItem('workExperience', i, 'role', v)} />
                        <TextInput label="Organization" value={w.org} onChange={v => updateArrayItem('workExperience', i, 'org', v)} />
                        <TextInput label="Period" value={w.period} onChange={v => updateArrayItem('workExperience', i, 'period', v)} />
                        <TextInput label="Description" value={w.desc} onChange={v => updateArrayItem('workExperience', i, 'desc', v)} />
                        <button onClick={() => removeArrayItem('workExperience', i)} className="text-red-500 col-span-2">Remove</button>
                    </div>
                ))}
            </section>

            {/* 5. Business */}
            <section className="space-y-2">
                <h3 className="text-xl font-black text-white">5. Own Business</h3>
                <TextInput label="Company Name" value={pb.businessProfile?.name} onChange={v => updateSection('businessProfile', 'name', v)} />
                <TextInput label="Punch Line" value={pb.businessProfile?.punchline} onChange={v => updateSection('businessProfile', 'punchline', v)} />
                <TextArea label="Description" value={pb.businessProfile?.desc} onChange={v => updateSection('businessProfile', 'desc', v)} />
            </section>

            {/* 6. Certificates */}
            <section>
                <h3 className="text-xl font-black text-white">6. Certificates</h3>
                {pb.certificates?.map((c, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                        <TextInput label="Title" value={c.title} onChange={v => updateArrayItem('certificates', i, 'title', v)} />
                        <TextInput label="Institution" value={c.source} onChange={v => updateArrayItem('certificates', i, 'source', v)} />
                    </div>
                ))}
                <button onClick={() => addArrayItem('certificates', { title: '', source: '' })} className="text-cyan-400 text-xs font-bold">+ Add Certificate</button>
            </section>

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
                { id: 'gisMapping', title: '11. GIS Mapping Gallery', icon: Map, f1: 'Gallery Title', f2: 'Photo URL' },
                { id: 'teamwork', title: '12. Teamwork Gallery', icon: Users, f1: 'Gallery Title', f2: 'Photo URL' }
            ].map(sec => (
                <ArraySection
                    key={sec.id} id={sec.id} title={sec.title} icon={sec.icon}
                    emptyObj={{ title: '', link: '' }}
                    fields={[
                        { key: 'title', label: sec.f1, span: 'half' }, { key: 'link', label: sec.f2, span: 'half' }
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
};

