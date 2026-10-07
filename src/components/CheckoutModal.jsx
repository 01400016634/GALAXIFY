import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Download, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export default function CheckoutModal({ product, pageId, onClose }) {
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // 'form' or 'invoice'
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [userAuth, setUserAuth] = useState({ loading: true, user: null });

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', address: ''
    });

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user) {
                setUserAuth({ loading: false, user: data.session.user });
                setFormData(f => ({ ...f, email: data.session.user.email, name: data.session.user.user_metadata?.full_name || f.name }));
            } else {
                setUserAuth({ loading: false, user: null });
            }
        };
        checkAuth();
    }, []);

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 🚀 Send order securely to the CRM
            const { data, error } = await supabase
                .from('client_requests')
                .insert([{
                    site_name: pageId,
                    request_type: 'Purchase Order',
                    customer_email: formData.email, // Use email from billing section
                    phone_number: formData.phone,
                    delivery_address: formData.address,
                    status: 'Pending',
                    payload: {
                        item: product.name,
                        price: product.price,
                        customer_name: formData.name
                    }
                }])
                .select();

            if (error) throw error;

            // Send Confirmation Email via EmailJS directly from the browser for FREE
            try {
                // We will add the emailjs import dynamically to avoid cluttering if not used
                const emailjs = (await import('@emailjs/browser')).default;
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    {
                        customer_name: formData.name,
                        customer_email: formData.email, // Use email from billing section
                        item_name: product.name,
                        item_price: product.price,
                    },
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );
            } catch (emailErr) {
                console.error("EmailJS sending failed:", emailErr);
                // We don't block the checkout if the email fails
            }

            // Create a clean Invoice ID
            setOrderId(data[0]?.id.split('-')[0].toUpperCase() || `INV-${Date.now().toString().slice(-6)}`);
            setStep('invoice'); // Transition to Receipt Screen

        } catch (err) {
            console.error("Checkout Error:", err);
            alert('Order failed to process. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDownloadInvoice = () => {
        // Create a temporary style tag to hide EVERYTHING except the invoice during print
        const style = document.createElement('style');
        style.innerHTML = `
            @media print {
                html, body {
                    height: 100vh !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                body * {
                    visibility: hidden !important;
                }
                #printable-invoice, #printable-invoice * {
                    visibility: visible !important;
                }
                #printable-invoice {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        window.print();
        setTimeout(() => document.head.removeChild(style), 1000);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">

            {/* ---------------- LOADING AUTH VIEW ---------------- */}
            {step === 'form' && userAuth.loading && (
                <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-lg rounded-3xl p-12 flex justify-center items-center relative shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-10"><X size={20} /></button>
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {/* ---------------- SIGN IN REQUIRED VIEW ---------------- */}
            {step === 'form' && !userAuth.loading && !userAuth.user && (
                 <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-lg rounded-3xl p-10 text-center relative shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-10"><X size={20} /></button>
                    <ShieldCheck className="mx-auto text-cyan-400 mb-6" size={56} />
                    <h3 className="text-3xl font-black text-white mb-2">Sign In Required</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">You need to sign in or create an account to purchase products from this portfolio.</p>
                    <button onClick={() => navigate(`/client-portal/${pageId}?redirect=/3DUNIVERSE/${pageId}`)} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black px-6 py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all w-full flex items-center justify-center gap-2">
                        Sign In / Register
                    </button>
                 </div>
            )}

            {/* ---------------- FORM VIEW ---------------- */}
            {step === 'form' && !userAuth.loading && userAuth.user && (
                <div className="bg-[#0A0A0E] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white bg-black/50 p-2 rounded-full transition-colors z-10"><X size={20} /></button>

                    <div className="bg-gradient-to-br from-cyan-900/40 to-black p-8 border-b border-white/10">
                        <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-2 block flex items-center gap-2"><ShoppingBag size={14} /> Secure Checkout</span>
                        <h2 className="text-3xl font-black text-white">{product.name}</h2>
                        <p className="text-4xl font-black text-cyan-400 mt-2">${product.price}</p>
                    </div>

                    <form onSubmit={handleOrderSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors ${userAuth.user ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="John Doe" readOnly={!!userAuth.user} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                                <input required type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors" placeholder="+1 234 567 890" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Email Address</label>
                            <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={`w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors ${userAuth.user ? 'opacity-60 cursor-not-allowed' : ''}`} placeholder="john@example.com" readOnly={!!userAuth.user} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Delivery / Billing Address</label>
                            <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-colors resize-none h-24" placeholder="123 Digital Avenue..." />
                        </div>

                        <button disabled={isSubmitting} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50">
                            {isSubmitting ? 'Processing...' : <><CreditCard size={18} /> Confirm Order</>}
                        </button>
                        <p className="text-center text-[10px] text-gray-500 flex items-center justify-center gap-1"><ShieldCheck size={12} /> 256-bit encrypted checkout</p>
                    </form>
                </div>
            )}

            {/* ---------------- SUCCESS & INVOICE VIEW ---------------- */}
            {step === 'invoice' && (
                <div id="printable-invoice" className="bg-white text-black w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500 print:shadow-none print:max-w-full print:m-0 print:p-0">
                    <div className="hidden print:block print:text-center print:pt-8 print:pb-4">
                        {/* Company Logo and Name for PDF */}
                        <div className="flex flex-col items-center justify-center gap-2 mb-2">
                            <img src="/logo.png" alt="Company Logo" className="h-16 object-contain" onError={(e) => e.target.style.display = 'none'} />
                            <span className="font-black text-2xl text-black tracking-widest mt-2">3D UNIVERSE</span>
                        </div>
                        <p className="text-gray-500 text-xs">hello@3duniverse.com | 1-800-UNIVERSE</p>
                    </div>

                    <div className="bg-green-500 p-8 text-center print:bg-transparent print:p-4 print:text-black print:border-b print:border-gray-200">
                        <CheckCircle2 size={64} className="text-white mx-auto mb-4 print:hidden" />
                        <h2 className="text-3xl font-black text-white print:text-2xl print:text-black">Order Receipt</h2>
                        <p className="text-green-100 mt-2 font-medium print:hidden">A copy of this receipt has been saved.</p>
                    </div>

                    <div className="p-8 space-y-6 print:p-4 print:space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Invoice Number</p>
                                <p className="text-sm font-black font-mono print:text-black">#{orderId}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                                <p className="text-sm font-bold print:text-black">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-black text-lg border-b border-gray-200 pb-2 print:text-black">Order Details</h3>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700 print:text-black">{product.name}</span>
                                <span className="font-black print:text-black">${product.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 print:text-gray-600">Tax / Processing</span>
                                <span className="font-bold print:text-black">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                                <span className="font-black text-xl uppercase tracking-widest text-gray-400 print:text-gray-600">Total</span>
                                <span className="font-black text-3xl text-cyan-600 print:text-black">${product.price}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 text-sm mt-6">
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Billed To</p>
                            <p className="font-bold">{formData.name}</p>
                            <p className="text-gray-600">{formData.email}</p>
                            <p className="text-gray-600 mt-2">{formData.address}</p>
                        </div>

                        <div className="flex gap-4 pt-4 print:hidden">
                            <button onClick={handleDownloadInvoice} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
                                <Download size={18} /> Save PDF
                            </button>
                            <button onClick={onClose} className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-xl transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}