import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase'; // 🚀 Added Supabase import
import { useNavigate } from 'react-router-dom'; // 🚀 Added React Router navigation
import { User, Crown, CheckCircle, X } from 'lucide-react';

const Pricing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 🚀 Form State for the Checkout Modal
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Intercept the Buy Button Click
  const handleBuyPro = () => {
    if (!currentUser) {
      alert("Please log in or sign up to upgrade.");
      navigate('/login'); // Safer than window.location.href for Vercel
      return;
    }
    // If logged in, open the form instead of calling localhost!
    setShowCheckoutForm(true);
  };

  // 2. Submit the Order directly to Supabase CRM
  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([
          {
            user_id: currentUser.id, // Links directly to this customer
            user_email: currentUser.email,
            product_name: 'Pro User Upgrade',
            phone_number: phone,
            delivery_address: address,
            status: 'pending' // Admin sees this as pending in the CMS
          }
        ]);

      if (error) throw error;

      alert("🎉 Order successful! You can view it in your Dashboard.");
      setShowCheckoutForm(false);
      navigate('/dashboard'); // Take them straight to their dashboard

    } catch (error) {
      alert("Order failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 relative">
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
              <CheckCircle size={16} className="text-cyan-400 flex-shrink-0" />
              <span>username.3duniverse.com</span>
            </li>
            <li className="flex items-center gap-3 text-gray-300 text-sm">
              <CheckCircle size={16} className="text-cyan-400 flex-shrink-0" />
              <span>Powered by 3D UNIVERSE watermarked</span>
            </li>
          </ul>

          <button className="mt-auto w-full py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors font-medium">
            Get Started
          </button>
        </div>

        {/* Pro User Card */}
        <div className="relative bg-gradient-to-b from-white/10 to-transparent border border-orange-500/50 rounded-2xl p-8 text-center flex flex-col items-center overflow-hidden group">
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

          <button
            onClick={handleBuyPro}
            className="mt-auto w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* 🚀 THE CHECKOUT MODAL FORM */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0A0A0E] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">

            {/* Close Button */}
            <button
              onClick={() => setShowCheckoutForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                <Crown className="text-yellow-400" size={20} />
              </div>
              <h2 className="text-2xl font-black text-white">Complete Order</h2>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Please provide your contact details to finalize your Pro User upgrade.
            </p>

            <form onSubmit={handleCompleteOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. +880 1..."
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery Address</label>
                <textarea
                  placeholder="Enter your full address..."
                  required
                  rows="3"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Upgrade"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;