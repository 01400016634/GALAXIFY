import React, { useState } from 'react';
import { ShieldAlert, Lock, User } from 'lucide-react';

const OwnerLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5001/api/owner/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // 🚀 SUCCESS! Save the "VIP Wristband" (Token) to browser memory
                localStorage.setItem('adminToken', data.token);

                // Refresh the page to load the actual CMS
                window.location.href = '/admin';
            } else {
                // Wrong password
                setError(data.error || 'Access Denied');
            }
        } catch (err) {
            setError('Server is offline. Is port 5001 running?');
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center font-sans">
            <div className="w-full max-w-md p-8 bg-black/50 border border-[#ff003c]/30 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(255,0,60,0.1)]">

                <div className="text-center mb-8 flex flex-col items-center">
                    <ShieldAlert size={48} className="text-[#ff003c] mb-4" />
                    <h1 className="text-2xl font-black text-white tracking-widest">MASTER CONTROL</h1>
                    <p className="text-xs text-[#ff003c] font-mono mt-2 uppercase tracking-[0.3em]">Restricted Access</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Admin ID"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#ff003c] transition-colors"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            placeholder="Passcode"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-[#ff003c] transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#ff003c] hover:bg-red-700 text-white font-black tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)]"
                    >
                        AUTHORIZE
                    </button>
                </form>

            </div>
        </div>
    );
};

export default OwnerLogin;