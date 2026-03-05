import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { User } from 'lucide-react';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
      {/* Left Side (Brand) */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-slate-200 font-semibold text-lg tracking-wide">GALAXIFY</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-400 font-bold text-lg">AI</span>
        <span className="text-white text-lg hidden sm:block">Web Portfolio Generator</span>
      </Link>

      {/* Right Side (Menu & Action) */}
      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-6">
          {["Features", "Themes", "Pricing", "About Us", "FAQ", "Contact Us"].map((item) => (
            <a 
              key={item} 
              href="#" 
              className="text-gray-300 hover:text-white transition-colors text-sm"
            >
              {item}
            </a>
          ))}
        </div>
        
        {currentUser ? (
          <Link 
            to="/dashboard" 
            className="bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/20 transition text-white"
          >
            <User size={16} />
            <span className="text-sm font-medium">{currentUser.displayName || 'Dashboard'}</span>
          </Link>
        ) : (
          <Link 
            to="/login" 
            className="bg-[#80c4e9] text-slate-900 rounded-lg px-5 py-2 font-medium hover:brightness-110 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;