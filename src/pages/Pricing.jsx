import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Crown, CheckCircle } from 'lucide-react';

const Pricing = () => {
  // 1. Grab the currently logged-in user
  const { currentUser } = useAuth();

  // 2. Add the Payment Logic
  const handleBuyPro = async () => {
    if (!currentUser) {
      alert("Please log in to upgrade.");
      window.location.href = '/login'; // Redirect to login if they aren't logged in
      return;
    }

    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: currentUser.uid, plan: 'pro' })
      });

      if (response.ok) {
        alert("🎉 Successfully Upgraded to PRO!");
        // Instantly redirect them to their dashboard to see the green PRO box!
        window.location.href = '/dashboard';
      } else {
        alert("Server failed to update database.");
      }
    } catch (error) {
      alert("Payment gateway connection failed. Is Port 5001 running?");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-white text-center mb-8">Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free User Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center hover:border-white/20 transition-all">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <User className="text-gray-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-6">Free User</h3>

          <ul className="space-y-3 mb-8 w-full text-left">
            <li className="flex items-center gap-3 text-gray-300 text-sm">
              <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />
              <span>username.3duniverse.com</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300 text-sm">
              <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />
              <span>Powered by 3D UNIVERSE watermarked</span>
            </li>
          </ul>

          <button className="mt-auto w-full py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
            Get Started
          </button>
        </div>

        {/* Pro User Card */}
        <div className="relative bg-gradient-to-b from-white/10 to-transparent border border-orange-500/50 rounded-2xl p-8 text-center flex flex-col items-center overflow-hidden group">
          {/* Glow effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-50" />

          <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 border border-orange-500/30">
            <Crown className="text-yellow-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-6">Pro User</h3>

          <ul className="space-y-3 mb-8 w-full text-left">
            <li className="flex items-center gap-3 text-gray-200 text-sm">
              <CheckCircle size={16} className="text-yellow-500 flex-shrink-0" />
              <span>Custom Domain</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200 text-sm">
              <CheckCircle size={16} className="text-yellow-500 flex-shrink-0" />
              <span>Unlock all Themes</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200 text-sm">
              <CheckCircle size={16} className="text-yellow-500 flex-shrink-0" />
              <span>Download React Code</span>
            </li>
            <li className="flex items-center gap-3 text-gray-200 text-sm">
              <CheckCircle size={16} className="text-yellow-500 flex-shrink-0" />
              <span>No Watermarks</span>
            </li>
          </ul>

          {/* 3. Wire the button to the function! */}
          <button
            onClick={handleBuyPro}
            className="mt-auto w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;