import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check the URL for Supabase error hashes (like expired links)
    useEffect(() => {
        const hash = window.location.hash;
        if (hash && hash.includes('error=')) {
            const params = new URLSearchParams(hash.substring(1));
            const errorMsg = params.get('error_description') || 'Invalid or expired link.';
            setError(errorMsg.replace(/\+/g, ' '));
        }
    }, []);

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Supabase securely updates the password for the user holding this session
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            setMessage('Password successfully updated! Redirecting to login...');

            // Send them back to the homepage/login after 2 seconds
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-cyan-500/30">
            <div className="w-full max-w-md bg-[#0A0A0E] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">

                {/* Glow Effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500 blur-[80px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-xl flex items-center justify-center mb-6">
                        <Lock className="text-cyan-400" size={24} />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create New Password</h2>
                    <p className="text-gray-400 text-sm mb-8">Enter a strong, secure password for your account.</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3">
                            <AlertCircle size={18} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-4 rounded-xl mb-6 flex items-center gap-3">
                            <CheckCircle2 size={18} className="shrink-0" />
                            <p>{message}</p>
                        </div>
                    )}

                    <form onSubmit={handlePasswordReset} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors"
                                disabled={loading || !!message || error.includes('expired')}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!message || error.includes('expired')}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Password'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <a href="/" className="text-gray-500 text-xs hover:text-white transition-colors">Return to login</a>
                    </div>
                </div>
            </div>
        </div>
    );
}