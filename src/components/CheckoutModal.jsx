import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { X, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

export default function CheckoutModal({ product, pageId, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCompleteOrder = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('client_requests')
                .insert([
                    {
                        site_name: pageId, // 🚀 THIS IS THE MAGIC LINK TO THE CLIENT'S CRM
                        request_type: 'Product Order',
                        customer_email: formData.email,
                        phone_number: formData.phone,
                        delivery_address: formData.address,
                        status: 'Pending', // Client will change this to "Completed/Shipped" later
                        payload: {
                            item: product.name,
                            price: product.price,
                            customer_name: formData.name
                        }
                    }
                ]);

            if (error) throw error;
            setIsSuccess(true);

        } catch (error) {
            alert("Order failed: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-md p-4">
                <div className="bg-[#0A0A0E] border border-green-500/30 p-8 rounded-3xl w-full max-w-md text-center shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={40} className="text-green-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Order Confirmed!</h2>
                    <p className="text-gray-400 mb-8">Thank you, {formData.name}. The seller has received your order and will prepare it for shipment.</p>
                    <button onClick={onClose} className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors">
                        Close & Return to Site
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-[#0A0A0E] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl relative shadow-2xl flex flex-col md:flex-row gap-8">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {/* Left Side: Order Summary */}
                <div className="w-full md:w-1/2 bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <ShoppingBag size={16} /> Order Summary
                    </h3>

                    <div className="flex-1">
                        <h4 className="text-2xl font-black text-white mb-2">{product.name || 'Premium Item'}</h4>
                        <div className="text-3xl font-black text-cyan-400 mb-6">${product.price || '0.00'}</div>

                        <div className="space-y-4 text-sm text-gray-400 border-t border-white/10 pt-6">
                            <p className="flex justify-between"><span>Subtotal</span> <span className="text-white">${product.price || '0.00'}</span></p>
                            <p className="flex justify-between"><span>Shipping</span> <span className="text-green-400">Calculated after</span></p>
                        </div>
                    </div>

                    <div className="mt-6 bg-black/40 p-4 rounded-xl flex items-start gap-3 border border-white/5">
                        <Truck size={20} className="text-gray-500 shrink-0" />
                        <p className="text-xs text-gray-500">Payment will be processed securely. The seller will contact you regarding delivery and final payment methods.</p>
                    </div>
                </div>

                {/* Right Side: Customer Details Form */}
                <div className="w-full md:w-1/2">
                    <h2 className="text-xl font-black text-white mb-6">Delivery Details</h2>

                    <form onSubmit={handleCompleteOrder} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Full Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" placeholder="John Doe" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Email Address</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" placeholder="john@email.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Phone Number</label>
                                <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none" placeholder="+1 234..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Full Delivery Address</label>
                            <textarea required rows="3" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none resize-none" placeholder="Street, City, Zip Code..." />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50">
                            {isSubmitting ? "Processing Order..." : "Confirm Purchase"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}