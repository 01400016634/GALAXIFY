import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const PersonalBrandBuilder = ({ pageData, setPageData }) => {

    // Helper to update simple text fields
    const updateSection = (section, field, value) => {
        setPageData(prev => ({
            ...prev,
            personalBrand: {
                ...prev.personalBrand,
                [section]: { ...prev.personalBrand[section], [field]: value }
            }
        }));
    };

    // Helper to add a new item to an array (like Skills)
    const addArrayItem = (arrayName, emptyObject) => {
        setPageData(prev => ({
            ...prev,
            personalBrand: {
                ...prev.personalBrand,
                [arrayName]: [...(prev.personalBrand[arrayName] || []), emptyObject]
            }
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-20">

            {/* 1. INTRODUCTION SECTION */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">1. Introduction Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Designation</label>
                        <input
                            type="text"
                            value={pageData.personalBrand?.intro?.designation || ''}
                            onChange={(e) => updateSection('intro', 'designation', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                            placeholder="e.g. 3D Web Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Short Headline</label>
                        <input
                            type="text"
                            value={pageData.personalBrand?.intro?.headline || ''}
                            onChange={(e) => updateSection('intro', 'headline', e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500"
                            placeholder="Building the immersive web..."
                        />
                    </div>
                </div>
            </div>

            {/* 3. SKILLS SECTION (Array Example) */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">3. My Skills</h3>
                    <button
                        onClick={() => addArrayItem('skills', { title: '', level: 'Beginner' })}
                        className="px-3 py-1.5 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                    >
                        <Plus size={14} /> Add Skill
                    </button>
                </div>

                <div className="space-y-3">
                    {(pageData.personalBrand?.skills || []).map((skill, index) => (
                        <div key={index} className="grid grid-cols-3 gap-3 bg-black/30 p-3 rounded-xl border border-white/5">
                            <input
                                type="text"
                                placeholder="Skill Title (e.g. React)"
                                value={skill.title}
                                onChange={(e) => {
                                    const newArray = [...pageData.personalBrand.skills];
                                    newArray[index].title = e.target.value;
                                    setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, skills: newArray } }));
                                }}
                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                            />
                            <input
                                type="text"
                                placeholder="Skill Tag (e.g. Expert)"
                                value={skill.level}
                                onChange={(e) => {
                                    const newArray = [...pageData.personalBrand.skills];
                                    newArray[index].level = e.target.value;
                                    setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, skills: newArray } }));
                                }}
                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                            />
                            <button
                                onClick={() => {
                                    const newArray = pageData.personalBrand.skills.filter((_, i) => i !== index);
                                    setPageData(prev => ({ ...prev, personalBrand: { ...prev.personalBrand, skills: newArray } }));
                                }}
                                className="text-red-400 hover:text-red-300 flex justify-end items-center px-4"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PersonalBrandBuilder;