import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const InfoSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "How secure is my data?",
      answer: "All data is securely stored in Firebase with end-to-end encryption."
    },
    {
      question: "What are the requirements?",
      answer: "You just need a modern web browser. No coding skills required."
    },
    {
      question: "Can I customize the themes further?",
      answer: "Yes, Pro users can access advanced customization options and export code."
    },
    {
      question: "What is a custom domain?",
      answer: "A custom domain allows you to use your own URL (e.g., yourname.com) instead of ours."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: About Us */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-gray-200">
          <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
          <p className="leading-relaxed text-sm text-gray-300">
            Our mission is to make powerful 3D portfolios accessible to everyone, combining immersive visuals and cutting-edge AI to empower your personal website.
          </p>
        </div>

        {/* Column 2: FAQ */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-gray-200">
          <h3 className="text-xl font-bold text-white mb-4">FAQ</h3>
          <div className="space-y-1">
            {faqData.map((item, index) => (
              <div key={index} className="border-b border-white/10 py-3 last:border-0">
                <button 
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center cursor-pointer hover:text-white transition-colors group text-left"
                >
                  <span className="text-sm font-medium">{item.question}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 group-hover:text-white transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openIndex === index && (
                  <p className="text-sm text-gray-400 mt-2">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-gray-200">
          <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Name" 
              className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
            />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
            />
            <textarea 
              placeholder="Message" 
              rows={3}
              className="w-full bg-transparent border border-white/20 rounded-md p-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors resize-none"
            />
            <button className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-md py-2 font-medium hover:opacity-90 transition-opacity shadow-lg shadow-orange-500/20">
              Quick Connect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;