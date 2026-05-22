import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Vercel-Safe Authentication using Environment Variables
        const validUser = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
        const validPass = import.meta.env.VITE_ADMIN_PASSWORD || '3duniverse2026';

        setTimeout(() => {
            if (username === validUser && password === validPass) {
                // Save a secure token to the browser
                localStorage.setItem('adminToken', 'secure_3d_universe_admin_session');
                // Force a page reload to trigger the App.jsx route guard
                window.location.href = '/owner-panel';
            } else {
                setError('Invalid admin credentials. Access Denied.');
                setIsLoading(false);
            }
        }, 800); // Small delay for security/UX feel
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-slate-200">
            <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                {/* Visual branding for 3D UNIVERSE */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[60px] pointer-events-none" />

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <ShieldAlert size={48} className="text-cyan-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">3D UNIVERSE <span className="text-cyan-500">OWNER</span></h1>
                    <p className="text-slate-400 text-sm mt-1">Authorized Personnel Only</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5 relative z-10">
                    <div className="relative">
                        <UserIcon size={18} className="absolute left-3 top-3.5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Admin Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock size={18} className="absolute left-3 top-3.5 text-slate-500" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'SECURE LOGIN'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;