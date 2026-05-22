import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Package, Calendar, BookOpen, Briefcase, User, LogOut, Settings, FileText, Star, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function CustomerDashboard() {
    const { username } = useParams();
    const [industry, setIndustry] = useState('');
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('activity');
    const [loading, setLoading] = useState(true);

    // 🚀 NEW: State to hold real data
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserData(user);

            // 1. Get landing page category
            const { data: page } = await supabase
                .from('landing_pages')
                .select('page_data')
                .eq('site_name', username)
                .maybeSingle();

            if (page) {
                setIndustry(page.page_data.setup?.category?.toLowerCase() || 'ecommerce');
            }

            // 🚀 2. FETCH REAL DATA FOR THIS CUSTOMER
            const fetchMyData = async () => {
                const { data } = await supabase
                    .from('client_requests')
                    .select('*')
                    .eq('site_name', username)
                    .eq('customer_email', user.email);
                if (data) setRequests(data);
            };
            await fetchMyData();
            setLoading(false);

            // 🚀 3. REAL-TIME MAGIC: Listen for Owner updates!
            const subscription = supabase
                .channel('realtime-status')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'client_requests', filter: `customer_email=eq.${user.email}` },
                    (payload) => {
                        // Update the screen instantly when the owner changes status
                        setRequests(current => current.map(req => req.id === payload.new.id ? payload.new : req));
                    }
                )
                .subscribe();

            return () => { supabase.removeChannel(subscription); };
        };
        init();
    }, [username]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = `/3DUNIVERSE/${username}`;
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Portal...</div>;

    // Pass the real-time requests down to the views
    const renderIndustryView = () => {
        if (industry.includes('ecommerce') || industry.includes('gadget')) return <EcommerceView requests={requests} />;
        if (industry.includes('real estate')) return <RealEstateView requests={requests} />;
        if (industry.includes('learning')) return <LearningView requests={requests} />;
        if (industry.includes('agency') || industry.includes('service')) return <AgencyView requests={requests} />;
        return <EcommerceView requests={requests} />;
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex font-sans selection:bg-cyan-500/30">
            {/* SIDEBAR NAVIGATION */}
            <aside className="w-64 border-r border-white/10 p-8 hidden md:block">
                <h1 className="text-xl font-black text-cyan-400 mb-10 uppercase tracking-widest border-b border-white/10 pb-4">Portal</h1>
                <nav className="space-y-3">
                    <button onClick={() => setActiveTab('activity')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'activity' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Package size={18} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Settings size={18} /> Profile & Settings
                    </button>
                </nav>
                <div className="absolute bottom-8 left-8">
                    <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-400 transition-colors text-sm">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                <header className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-black capitalize tracking-tight mb-2">
                        {activeTab === 'activity' ? 'Activity Overview' : 'Account Settings'}
                    </h2>
                    <p className="text-gray-400 text-sm">Logged in as: <span className="text-white">{userData?.email}</span></p>
                </header>

                {activeTab === 'activity' ? renderIndustryView() : <ProfileSettings userData={userData} />}
            </main>
        </div>
    );
}

// 🚀 DYNAMIC VIEWS USING REAL DATA
const EcommerceView = ({ requests }) => (
    <div className="space-y-8">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-lg"><Package className="text-cyan-400" /> Order History</h3>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-5 bg-black/40 rounded-xl border border-white/5 flex flex-wrap justify-between items-center gap-4 hover:border-cyan-500/30 transition-colors">
                        <div>
                            <p className="font-black text-lg">Order #{req.id.slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-gray-400 mt-1">Placed on: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <p className="text-gray-500 italic p-4 text-center">No orders found.</p>
                )}
            </div>
        </div>
    </div>
);

const RealEstateView = ({ requests }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="font-bold flex items-center gap-2 text-lg mb-6"><Calendar className="text-cyan-400" /> My Bookings</h3>
        <div className="space-y-4">
            {requests.length > 0 ? requests.map(req => (
                <div key={req.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between gap-6">
                    <div>
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 inline-block">
                            {req.status}
                        </span>
                        <h4 className="font-black text-lg">Property Viewing</h4>
                    </div>
                </div>
            )) : <p className="text-gray-500 italic text-center">No upcoming viewings.</p>}
        </div>
    </div>
);

const AgencyView = ({ requests }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="font-bold flex items-center gap-2 text-lg mb-6"><Briefcase className="text-cyan-400" /> Service Requests</h3>
        <div className="space-y-4">
            {requests.length > 0 ? requests.map(req => (
                <div key={req.id} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex justify-between items-start">
                    <div>
                        <h4 className="font-black text-lg">Project Request</h4>
                        <p className="text-xs text-gray-400 mt-1">ID: #{req.id.slice(0, 8)}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {req.status}
                    </span>
                </div>
            )) : <p className="text-gray-500 italic text-center">No active projects.</p>}
        </div>
    </div>
);

const LearningView = ({ requests }) => (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h3 className="font-bold flex items-center gap-2 text-lg mb-6"><BookOpen className="text-cyan-400" /> Course Enrollments</h3>
        <p className="text-gray-500 italic text-center">Courses will appear here once enrolled.</p>
    </div>
);

//🚀 5. UNIVERSAL PROFILE SETTINGS(FULLY WORKING)
// ==========================================
const ProfileSettings = ({ userData }) => {
    const [profile, setProfile] = useState({ full_name: '', phone: '', address: '', avatar_url: '' });
    const [saving, setSaving] = useState(false);

    // Load existing profile data when the page opens
    useEffect(() => {
        const loadProfile = async () => {
            if (!userData?.id) return;
            const { data } = await supabase.from('profiles').select('*').eq('id', userData.id).single();
            if (data) setProfile(data);
        };
        loadProfile();
    }, [userData]);

    // Save profile data to Supabase
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const { error } = await supabase.from('profiles').upsert({
            id: userData.id, // Matches their auth ID
            full_name: profile.full_name,
            phone: profile.phone,
            address: profile.address,
            avatar_url: profile.avatar_url
        });

        setSaving(false);
        if (error) {
            alert('Error saving profile: ' + error.message);
        } else {
            alert('✅ Profile updated successfully!');
        }
    };

    return (
        <div className="max-w-2xl bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-xl"><User className="text-cyan-400" /> Personal Details</h3>

            <form className="space-y-5" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                        <input type="text" value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Phone Number</label>
                        <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm" placeholder="+1 (555) 000-0000" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Account Email (Read Only)</label>
                    <input type="email" value={userData?.email || ''} readOnly className="w-full bg-black/50 p-4 rounded-xl border border-white/5 outline-none text-gray-600 text-sm cursor-not-allowed" />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Billing / Shipping Address</label>
                    <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm h-24 resize-none" placeholder="123 Main St, City, Country, Zip Code"></textarea>
                </div>

                <div className="pt-4 border-t border-white/10 mt-6">
                    <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 px-8 py-4 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] w-full md:w-auto disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};