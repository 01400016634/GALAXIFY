import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, ChevronRight, MessageCircle } from 'lucide-react';

export default function ChatbotWidget({ faqs = [] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        sender: 'bot',
        text: 'Hi there! 👋 Welcome to 3D Universe. How can I help you today?',
        options: ['FAQ', 'Pricing', 'What is 3D Universe?', 'Ask a Query']
    }]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Hardcoded 3D Universe Information FAQs
    const defaultFaqs = [
        { q: "What features do you offer?", a: "We offer immersive 3D website creation, digital product stores, WebGL rendering, and zero-coding drag-and-drop editors." },
        { q: "Can I sell digital products?", a: "Yes! You can sell GLB/3D models, Videos, PDFs, and full courses directly through your portal." },
        { q: "Is it responsive?", a: "Absolutely. Everything is built to look stunning and run fast on desktop, tablet, and mobile devices." },
        { q: "How do I upgrade?", a: "You can upgrade from your Dashboard overview to our Pro ($49/mo) or Enterprise ($299/mo) plans." }
    ];

    const actualFaqs = faqs.length > 0 ? faqs : defaultFaqs;

    const simulateTyping = (callback) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            callback();
        }, 800);
    };

    const handleOptionClick = (option) => {
        setMessages(prev => [...prev, { sender: 'user', text: option }]);
        
        simulateTyping(() => {
            if (option === 'FAQ') {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'Here are some frequently asked questions. Select one:',
                    options: actualFaqs.map(f => f.q || f.k1 || 'Question')
                }]);
            } else if (option === 'Pricing') {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'Our pricing plans are simple: Free ($0/mo), Pro ($49/mo), and Enterprise ($299/mo). Which one would you like more details on?',
                    options: ['Free Plan', 'Pro Plan', 'Enterprise Plan', 'Back to Main Menu']
                }]);
            } else if (option === 'What is 3D Universe?') {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: '3D Universe is a revolutionary platform allowing you to build immersive 3D websites and digital storefronts in minutes, with zero coding required. We help creators sell digital goods in a true spatial web experience!',
                    options: ['Back to Main Menu']
                }]);
            } else if (option === 'Ask a Query') {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'Please type your specific query below, or email us at support@3duniverse.com. We typically respond within 24 hours.'
                }]);
            } else if (option === 'Back to Main Menu') {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'What else can I help you with?',
                    options: ['FAQ', 'Pricing', 'What is 3D Universe?', 'Ask a Query']
                }]);
            } else if (['Free Plan', 'Pro Plan', 'Enterprise Plan'].includes(option)) {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: `Great choice! The ${option} is fully detailed on our Pricing page. Feel free to upgrade anytime from your dashboard.`,
                    options: ['Back to Main Menu']
                }]);
            } else {
                // Must be a specific FAQ question clicked
                const matchedFaq = actualFaqs.find(f => (f.q || f.k1) === option);
                if (matchedFaq) {
                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: matchedFaq.a || matchedFaq.k2 || 'No answer found.',
                        options: ['Back to Main Menu']
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: 'I received your message. A human agent will get back to you shortly!',
                        options: ['Back to Main Menu']
                    }]);
                }
            }
        });
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

        simulateTyping(() => {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'Thank you for your query! Since I am an automated menu bot, please send an email to support for detailed custom queries, or choose an option below.',
                options: ['Back to Main Menu']
            }]);
        });
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex flex-col items-end pointer-events-auto">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-[#0A0A0E] border border-white/10 w-[95vw] sm:w-[380px] max-w-[400px] h-[60vh] sm:h-[550px] max-h-[75vh] mb-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex justify-between items-center text-white shrink-0 shadow-md relative z-10">
                        <div className="flex items-center gap-2 font-bold">
                            <div className="relative">
                                <MessageCircle size={20} />
                                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-cyan-600"></span>
                            </div>
                            3D Support Agent
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><X size={18} /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 scroll-smooth">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white rounded-br-sm' : 'bg-[#1A1A24] text-gray-200 border border-white/5 rounded-bl-sm'}`}>
                                    {msg.text}
                                </div>
                                {msg.options && (
                                    <div className="flex flex-col gap-2 mt-3 w-full items-start pr-8">
                                        {msg.options.map((opt, oIdx) => (
                                            <button 
                                                key={oIdx} 
                                                onClick={() => handleOptionClick(opt)}
                                                className="text-xs sm:text-sm bg-[#1A1A24] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/50 text-cyan-400 px-4 py-2.5 rounded-xl text-left w-full transition-all flex items-center justify-between group shadow-sm"
                                            >
                                                {opt}
                                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex flex-col items-start">
                                <div className="px-4 py-3 rounded-2xl bg-[#1A1A24] border border-white/5 rounded-bl-sm flex gap-1.5 items-center h-[44px]">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0A0A0E] flex gap-2 shrink-0">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors shadow-inner"
                        />
                        <button type="submit" disabled={!input.trim()} className="bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-all shadow-md">
                            <Send size={18} className="ml-1" />
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-tr from-cyan-500 to-blue-500 text-white p-4 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-105 hover:shadow-[0_0_35px_rgba(6,182,212,0.8)] transition-all flex items-center justify-center relative group"
            >
                {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
                {!isOpen && (
                    <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-[#0A0A0E]"></span>
                    </span>
                )}
            </button>
        </div>
    );
}
