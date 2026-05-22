import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { User, Crown, CheckCircle, X } from 'lucide-react';

const Pricing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // 🚀 The State that controls the popup form!
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Intercept the Buy Button Click
  const handleBuyPro = () => {
    if (!currentUser) {
      alert("Please log in or sign up to upgrade.");
      navigate('/login');
      return;
    }
    // STOP the instant success! Open the form instead.
    setShowCheckoutForm(true);
  };

  // 2. Submit the Order directly to your CRM
  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('client_requests')
        .insert([
          {
            user_id: currentUser.id,
            site_name: 'page-1', // Matches your CRM dropdown!
            request_type: 'Pro Upgrade',
            customer_email: currentUser.email,
            phone_number: phone,
            delivery_address: address,
            status: 'Pending',
            payload: { item: 'Pro User Upgrade', price: 15 } // Shows in CRM nicely
          }
        ]);

      if (error) throw error;

      alert("🎉 Order successful! You can view it in your Dashboard.");
      setShowCheckoutForm(false);
      navigate('/dashboard');

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
        {/* Free Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center">
          <Crown className="text-gray-300 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-6">Free User</h3>
          <button className="mt-auto w-full py-2 rounded-lg border border-white/20 text-white">Current Plan</button>
        </div>

        {/* Pro Card */}
        <div className="bg-gradient-to-b from-white/10 to-transparent border border-orange-500/50 rounded-2xl p-8 text-center flex flex-col items-center">
          <Crown className="text-yellow-400 mb-4" size={32} />
          <h3 className="text-xl font-bold text-white mb-6">Pro User ($15)</h3>

          {/* 🚀 THIS BUTTON TRIGGERS THE FORM */}
          <button
            onClick={handleBuyPro}
            className="mt-auto w-full py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-bold"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* 🚀 THE CHECKOUT MODAL FORM */}
      {showCheckoutForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0A0A0E] border border-white/10 p-8 rounded-3xl w-full max-w-md relative shadow-2xl">

            <button onClick={() => setShowCheckoutForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-white mb-6">Complete Order</h2>

            <form onSubmit={handleCompleteOrder} className="space-y-5">
              <input
                type="tel"
                placeholder="Phone Number (e.g. +880...)"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-orange-500"
              />

              <textarea
                placeholder="Full Delivery Address..."
                required
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-4 bg-black/50 border border-white/10 rounded-xl text-white outline-none focus:border-orange-500 resize-none"
              />

              <button type="submit" disabled={isSubmitting} className="w-full py-4 rounded-xl bg-orange-500 text-black font-bold disabled:opacity-50">
                {isSubmitting ? "Processing..." : "Confirm & Upgrade"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;