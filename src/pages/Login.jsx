import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from 'firebase/auth';
import { Mail, Lock, User } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'reset'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      if (error.message.includes("api-key-not-valid")) {
        setError("Configuration Error: Invalid Firebase API Key. Check Google Cloud Console restrictions.");
      } else {
        setError(error.message.replace('Firebase: ', ''));
      }
    } finally {
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
        navigate('/dashboard');
      } else if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else if (authMode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent!");
        setAuthMode('login');
      }
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>
      
      {/* Container */}
      <div className="z-10 p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {authMode === 'login' && 'Welcome Back'}
            {authMode === 'signup' && 'Create Account'}
            {authMode === 'reset' && 'Reset Password'}
          </h1>
          <p className="text-gray-400 text-sm">
            {authMode === 'login' && 'Enter your details to access your portfolio.'}
            {authMode === 'signup' && 'Start building your 3D galaxy today.'}
            {authMode === 'reset' && 'We will send you a recovery link.'}
          </p>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center mb-4 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          
          {/* Full Name - Signup Only */}
          {authMode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          {/* Email - All Modes */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Password - Login & Signup */}
          {(authMode === 'login' || authMode === 'signup') && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="password" 
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 text-white rounded-lg py-2.5 pl-10 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          {/* Main Action Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-900/20 hover:brightness-110 transition-all mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : (authMode === 'login' && 'Log In')}
            {!isLoading && authMode === 'signup' && 'Sign Up'}
            {!isLoading && authMode === 'reset' && 'Send Reset Link'}
          </button>
        </form>

        {/* Google Auth - Login & Signup Only */}
        {(authMode === 'login' || authMode === 'signup') && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-gray-500 text-xs uppercase">OR</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full bg-white text-slate-900 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </>
        )}

        {/* Bottom Toggles */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {authMode === 'login' && (
            <div className="flex flex-col gap-2">
              <button onClick={() => setAuthMode('reset')} className="hover:text-white transition-colors">
                Forgot Password?
              </button>
              <p>
                Don't have an account?{' '}
                <button onClick={() => setAuthMode('signup')} className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </button>
              </p>
            </div>
          )}

          {(authMode === 'signup' || authMode === 'reset') && (
            <button onClick={() => setAuthMode('login')} className="text-blue-400 hover:text-blue-300 font-medium">
              Back to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;