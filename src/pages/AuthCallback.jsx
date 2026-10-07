import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState("Analyzing Google Token...");
    const [urlData, setUrlData] = useState("");

    useEffect(() => {
        // 1. Grab the raw data Google sent to the URL
        const searchParams = window.location.search;
        const hashParams = window.location.hash;
        setUrlData(`Search Params: ${searchParams || 'None'} \nHash Params: ${hashParams || 'None'}`);

        // If the URL is completely empty, React Router deleted the token
        if (!searchParams && !hashParams) {
            setStatus("CRITICAL ERROR: No token found in URL. Google didn't send it, or the browser deleted it.");
            return;
        }

        const processLogin = async () => {
            // 2. Force Supabase to process the URL
            const { data: { session }, error } = await supabase.auth.getSession();

            if (session?.user) {
                setStatus("Token Accepted! Booting Dashboard...");
                setTimeout(() => navigate('/dashboard', { replace: true }), 500);
            } else if (error) {
                setStatus(`Supabase Rejected Token: ${error.message}`);
            } else {
                setStatus("ERROR: Supabase read the token, but refused to create a session. (Usually a Local Storage / Port mismatch).");
            }
        };

        processLogin();

    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center font-mono">
            <h2 className="text-2xl font-black tracking-widest text-cyan-400 mb-6">DIAGNOSTIC MODE</h2>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl max-w-2xl w-full shadow-2xl">
                <p className="text-lg text-white mb-6 font-bold">{status}</p>

                <div className="text-left">
                    <p className="text-slate-400 text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Raw URL Data Received:</p>
                    <p className="text-cyan-300 text-sm break-all bg-black/50 p-4 rounded border border-white/5">
                        {urlData}
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate('/login')}
                className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-cyan-50 transition-colors"
            >
                Back to Login
            </button>
        </div>
    );
};

export default AuthCallback;