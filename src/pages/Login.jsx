import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Globe } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  // 🚀 FIX: Added 'login' here so the function is defined!
  const { currentUser, login } = useAuth();

  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      console.log("User detected, redirecting to dashboard...");
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true); // Added this to show the spinner
    setError('');
    try {
      // Now this function is recognized because we added it to useAuth() above
      await login();
    } catch (error) {
      console.error("Login Error:", error);
      setError("Social login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const { email, password, fullName } = formData;

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        alert("Account Created! Check your email for confirmation, then log in.");
        setAuthMode('login');
      } else if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (authMode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert("Password reset email sent!");
        setAuthMode('login');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

      <div className="z-10 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-cyan-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <Globe className="text-white" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'reset' && 'Reset Password'}
          </h1>
        </div>

        {error && (
          <div className="text-red-400 text-xs text-center mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>
        )}

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors" required />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors" required />
          </div>

          {(authMode === 'login' || authMode === 'signup') && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors" required />
            </div>
          )}

          <button type="submit" disabled={isLoading} className={`w-full bg-cyan-500 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-cyan-400 transition-all mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'Processing...' : (authMode === 'login' ? 'Log In' : authMode === 'signup' ? 'Sign Up' : 'Send Link')}
          </button>
        </form>

        {(authMode === 'login' || authMode === 'signup') && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-gray-500 text-[10px] uppercase">Social Login</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
              {isLoading ? 'Connecting...' : 'Continue with Google'}
            </button>
          </>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          {authMode === 'login' ? (
            <p>Don't have an account? <button onClick={() => setAuthMode('signup')} className="text-cyan-400 font-medium">Sign up</button></p>
          ) : (
            <button onClick={() => setAuthMode('login')} className="text-cyan-400 font-medium">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;