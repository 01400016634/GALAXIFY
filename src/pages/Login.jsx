import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Rocket, Sparkles } from 'lucide-react';

const Login = () => {
  // Pulling all our powerful Supabase Auth functions from the context!
  const { loginWithGoogle, signupWithEmail, loginWithEmail, resetPassword } = useAuth();

  // States for our form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle standard Email/Password submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegistering) {
        await signupWithEmail(email, password);
        alert("Account Created! You can now log in.");
        setIsRegistering(false); // Switch view back to Login
      } else {
        await loginWithEmail(email, password);
        // Supabase will automatically log them in and redirect them based on AuthContext
      }
    } catch (error) {
      if (error.message === "Email not confirmed") {
        alert("Please check your email and click the verification link before logging in.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }

  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) return alert("Please type your email in the box first to reset your password.");
    try {
      await resetPassword(email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans text-white p-6 selection:bg-cyan-500/30">

      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl text-center">

        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <Rocket size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-slate-400 text-sm">
            {isRegistering ? "Sign up to start building your universe." : "Sign in to access your 3D Universe workspace."}
          </p>
        </div>

        {/* EMAIL & PASSWORD FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500 text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? "Processing..." : (isRegistering ? "Sign Up" : "Sign In")}
          </button>
        </form>

        {/* FORGOT PASSWORD LINK */}
        {!isRegistering && (
          <button type="button" onClick={handleForgotPassword} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors mb-6">
            Forgot Password?
          </button>
        )}

        {/* DIVIDER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          type="button"
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-200 px-6 py-4 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* TOGGLE LOGIN / SIGNUP */}
        <p className="text-center text-sm text-slate-400 mt-8">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-cyan-400 font-bold hover:underline">
            {isRegistering ? "Log in here" : "Sign up here"}
          </button>
        </p>

        <p className="text-[10px] text-slate-600 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Login;