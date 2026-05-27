import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { User, Lock, Mail, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

export default function ClientLogin() {
    const { username } = useParams(); // Gets the creator's site name from the URL
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: ''
    });

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // 🚀 FIXED: Now sends them to the Customer Dashboard instead of back to the login page!
                    redirectTo: `${window.location.origin}/customer-dashboard/${username}`
                }
            });
            if (error) throw error;
        } catch (err) {
            alert('Sign-in failed.');
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isSignUp) {
                // Register new customer
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            portal_origin: username // Tracks which creator's page they signed up on
                        }
                    }
                });

                if (error) throw error;
                setSuccess('Registration successful! You can now sign in.');
                setIsSignUp(false);
            } else {
                // Login existing customer
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;

                // Redirect to a customer dashboard after login
                navigate(`/customer-dashboard/${username}`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden font-sans selection:bg-cyan-500/30">

            {/* Cinematic Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md p-8">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <User size={28} className="text-cyan-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
                        {username}'s Portal
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? 'Create your account to access premium services.' : 'Sign in to manage your purchases and services.'}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm text-center flex items-center justify-center gap-2">
                            <ShieldCheck size={18} /> {success}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-5">

                        {isSignUp && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-cyan-500 outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-cyan-500 outline-none transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:border-cyan-500 outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50 mt-4"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Secure Sign In')}
                            {!loading && <ArrowRight size={18} />}
                        </button>

                    </form>

                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>
                    </div>

                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <p className="text-gray-400 text-sm">
                            {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 text-cyan-400 font-bold hover:text-white transition-colors"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}