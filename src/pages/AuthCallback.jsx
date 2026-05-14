import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // This listener catches the token and pushes to dashboard
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) navigate('/dashboard');
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <div className="text-center">
                <h2 className="text-xl font-bold text-white tracking-widest uppercase">Syncing Universe</h2>
                <p className="text-gray-500 text-sm mt-2 font-mono animate-pulse">ESTABLISHING SECURE SESSION...</p>
            </div>
        </div>
    );
}