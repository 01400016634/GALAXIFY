import React from 'react';
import { supabase } from '../services/supabase';
import { Rocket } from 'lucide-react'; // Just for a cool icon

const Login = () => {

  const handleGoogleLogin = async () => {
    try {
      // 🚀 THIS IS THE MAGIC 1-LINER! 
      // Supabase handles the entire Google popup, security, and user creation.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Tell Supabase where to send the user after Google says "Yes!"
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans text-white p-6">

      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-8">

        <div>
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Rocket size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-sm">Sign in to access your 3D Universe workspace.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02]"
        >
          {/* A simple Google "G" SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-xs text-slate-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Login;