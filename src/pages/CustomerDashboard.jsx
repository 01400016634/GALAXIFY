import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Package, Calendar, BookOpen, Briefcase, User, LogOut, Settings, FileText, Star, Clock, MapPin, CheckCircle } from 'lucide-react';

export default function CustomerDashboard() {
    const { username } = useParams();
    const navigate = useNavigate(); // 🚀 NEW: Faster, smoother page routing
    const [industry, setIndustry] = useState('');
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('activity');
    const [loading, setLoading] = useState(true);

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const init = async () => {
            // 🚀 SECURITY FIX: Safely check for the user
            const { data: { user }, error } = await supabase.auth.getUser();

            // If they aren't logged in, kick them back to the login page immediately!
            if (error || !user) {
                navigate(`/${username}/customer-login`);
                return;
            }

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

            // 2. FETCH REAL DATA FOR THIS CUSTOMER
            const fetchMyData = async () => {
                const { data } = await supabase
                    .from('client_requests')
                    .select('*')
                    .eq('site_name', username)
                    .eq('customer_email', user.email)
                    .order('created_at', { ascending: false }); // Show newest orders first!

                if (data) setRequests(data);
            };
            await fetchMyData();
            setLoading(false);

            // 3. REAL-TIME MAGIC: Listen for Owner updates
            const subscription = supabase
                .channel('realtime-status')
                .on(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'client_requests', filter: `customer_email=eq.${user.email}` },
                    (payload) => {
                        setRequests(current => current.map(req => req.id === payload.new.id ? payload.new : req));
                    }
                )
                .subscribe();

            return () => { supabase.removeChannel(subscription); };
        };

        init();
    }, [username, navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate(`/${username}`); // 🚀 Sends them smoothly back to your store
    };

    if (loading) return (
        <div className="min-h-screen bg-[#050505] text-cyan-400 flex flex-col items-center justify-center font-sans">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-bold tracking-widest uppercase">Loading Portal...</p>
        </div>
    );

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
            <aside className="w-64 border-r border-white/10 p-8 hidden md:block relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
                <h1 className="text-xl font-black text-cyan-400 mb-10 uppercase tracking-widest border-b border-white/10 pb-4">Customer Portal</h1>
                <nav className="space-y-3">
                    <button onClick={() => setActiveTab('activity')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'activity' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Package size={18} /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold ${activeTab === 'profile' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                        <Settings size={18} /> Profile & Settings
                    </button>
                </nav>
                <div className="absolute bottom-8 left-8 w-[calc(100%-4rem)]">
                    <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-bold rounded-xl border border-red-500/20">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto relative">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <header className="mb-10 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                        <h2 className="text-3xl md:text-4xl font-black capitalize tracking-tight mb-2">
                            {activeTab === 'activity' ? 'Activity Overview' : 'Account Settings'}
                        </h2>
                        <p className="text-gray-400 text-sm">Logged in as: <span className="text-cyan-400 font-bold">{userData?.email}</span></p>
                    </header>

                    {activeTab === 'activity' ? renderIndustryView() : <ProfileSettings userData={userData} />}
                </div>
            </main>
        </div>
    );
}

// 🚀 DYNAMIC VIEWS USING REAL DATA
const EcommerceView = ({ requests }) => (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-xl"><Package className="text-cyan-400" /> Order History</h3>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap justify-between items-center gap-4 hover:border-cyan-500/30 transition-colors shadow-lg">
                        <div>
                            <p className="font-black text-xl text-cyan-400">{req.payload?.item || 'Premium Item'}</p>
                            <p className="text-sm font-bold text-gray-300 mt-1">Order #{req.id.slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">Placed on: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-2xl font-black text-white">${req.payload?.price || '0.00'}</p>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${req.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-black/20 border border-white/5 border-dashed rounded-2xl">
                        <Package size={32} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400 font-bold">No orders found.</p>
                        <p className="text-xs text-gray-500 mt-1">When you make a purchase, it will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const RealEstateView = ({ requests }) => (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="font-bold flex items-center gap-2 text-xl mb-6"><Calendar className="text-cyan-400" /> My Bookings</h3>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap justify-between items-center gap-4 hover:border-cyan-500/30 transition-colors shadow-lg">
                        <div>
                            <p className="font-black text-xl text-cyan-400">{req.payload?.item || 'Property Viewing'}</p>
                            <p className="text-sm font-bold text-gray-300 mt-1">Booking #{req.id.slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">Requested on: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-2xl font-black text-white">${req.payload?.price || '0.00'}</p>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${req.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-black/20 border border-white/5 border-dashed rounded-2xl">
                        <Calendar size={32} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400 font-bold">No upcoming viewings.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const AgencyView = ({ requests }) => (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="font-bold flex items-center gap-2 text-xl mb-6"><Briefcase className="text-cyan-400" /> Service Requests</h3>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap justify-between items-center gap-4 hover:border-cyan-500/30 transition-colors shadow-lg">
                        <div>
                            <p className="font-black text-xl text-cyan-400">{req.payload?.item || 'Project Request'}</p>
                            <p className="text-sm font-bold text-gray-300 mt-1">Request #{req.id.slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">Date: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-2xl font-black text-white">${req.payload?.price || '0.00'}</p>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${req.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-black/20 border border-white/5 border-dashed rounded-2xl">
                        <Briefcase size={32} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400 font-bold">No active projects.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const LearningView = ({ requests }) => (
    <div className="space-y-8 animate-in fade-in duration-300">
        <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="font-bold flex items-center gap-2 text-xl mb-6"><BookOpen className="text-cyan-400" /> Course Enrollments</h3>
            <div className="space-y-4">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="p-6 bg-black/40 rounded-2xl border border-white/5 flex flex-wrap justify-between items-center gap-4 hover:border-cyan-500/30 transition-colors shadow-lg">
                        <div>
                            <p className="font-black text-xl text-cyan-400">{req.payload?.item || 'Course Enrollment'}</p>
                            <p className="text-sm font-bold text-gray-300 mt-1">Enrollment #{req.id.slice(0, 6).toUpperCase()}</p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">Enrolled on: {new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <p className="text-2xl font-black text-white">${req.payload?.price || '0.00'}</p>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${req.status === 'Completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                {req.status}
                            </span>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center bg-black/20 border border-white/5 border-dashed rounded-2xl">
                        <BookOpen size={32} className="mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-400 font-bold">No courses enrolled yet.</p>
                    </div>
                )}
            </div>
        </div>
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
            const { data } = await supabase.from('profiles').select('*').eq('id', userData.id).maybeSingle();
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
        <div className="animate-in fade-in duration-300 bg-white/5 p-6 md:p-8 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-xl"><User className="text-cyan-400" /> Personal Details</h3>

            <form className="space-y-6" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                        <input type="text" value={profile.full_name || ''} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm shadow-inner" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                        <input type="tel" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm shadow-inner" placeholder="+1 (555) 000-0000" />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Account Email (Read Only)</label>
                    <input type="email" value={userData?.email || ''} readOnly className="w-full bg-black/50 p-4 rounded-xl border border-white/5 outline-none text-gray-600 text-sm cursor-not-allowed shadow-inner" />
                </div>

                <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Billing / Shipping Address</label>
                    <textarea value={profile.address || ''} onChange={e => setProfile({ ...profile, address: e.target.value })} className="w-full bg-black/50 p-4 rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors text-sm h-28 resize-none shadow-inner" placeholder="123 Main St, City, Country, Zip Code"></textarea>
                </div>

                <div className="pt-6 border-t border-white/10 mt-8">
                    <button type="submit" disabled={saving} className="bg-cyan-600 hover:bg-cyan-500 px-10 py-4 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] w-full md:w-auto disabled:opacity-50 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                        {saving ? 'Saving...' : 'Save Profile Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};