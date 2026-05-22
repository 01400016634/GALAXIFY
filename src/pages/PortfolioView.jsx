import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Chrome, Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, MessageSquare, User, ChevronUp } from 'lucide-react';

// 🚀 1. IMPORT YOUR 15 AAA THEMES
import ThemeNeonMall from '../themes/ecommerce/ThemeNeonMall';
import { ThemeSpaceMarket } from '../themes/ecommerce/ThemeSpaceMarket';
import { ThemeGoldenPrestige } from '../themes/ecommerce/ThemeGoldenPrestige';
import { ThemeCyberLab } from '../themes/digital-gadgets/ThemeCyberLab';
import { ThemeTronGrid } from '../themes/digital-gadgets/ThemeTronGrid';
import { ThemePortalDimension } from '../themes/digital-gadgets/ThemePortalDimension';
import { ThemeSkylineEstate } from '../themes/real-estate/ThemeSkylineEstate';
import { ThemeDreamHall } from '../themes/real-estate/ThemeDreamHall';
import { ThemeFrozenPlatinum } from '../themes/real-estate/ThemeFrozenPlatinum';
import { ThemeCosmicLibrary } from '../themes/learning/ThemeCosmicLibrary';
import { ThemeAiSphere } from '../themes/learning/ThemeAiSphere';
import { ThemeGeneticMatrix } from '../themes/learning/ThemeGeneticMatrix';
import { ThemeCommandCenter } from '../themes/agency/ThemeCommandCenter';
import { ThemeCrystalVault } from '../themes/agency/ThemeCrystalVault';
import { ThemeDarkMatter } from '../themes/agency/ThemeDarkMatter';

// Helper component to render dynamic high-end social icons
const SocialIcon = ({ type, className }) => {
  switch (type?.toLowerCase()) {
    case 'facebook': return <Facebook className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'gmail': return <Mail className={className} />;
    case 'whatsapp': return <MessageSquare className={className} />;
    default: return <Chrome className={className} />;
  }
};

// 🚀 2. THE REVIEW COMPONENT
// 🚀 2. THE SUPABASE REVIEW COMPONENT
const ReviewSection = ({ siteName }) => {
  const [liveReviews, setLiveReviews] = useState([]);
  const [formData, setFormData] = useState({ name: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews directly from Supabase
  useEffect(() => {
    const fetchLiveReviews = async () => {
      if (!siteName) return;
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('site_name', siteName)


        if (error) throw error;
        if (data) setLiveReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    fetchLiveReviews();
  }, [siteName]);

  // Submit review directly to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        site_name: siteName,
        reviewer_name: formData.name,
        review_text: formData.text,
        rating: 5
      });

      if (error) throw error;

      alert("🎉 Review sent successfully!");

      // Instantly update the UI without needing to refresh
      setLiveReviews([{
        reviewer_name: formData.name,
        review_text: formData.text,
        rating: 5
      }, ...liveReviews]);

      setFormData({ name: '', text: '' });
    } catch (err) {
      alert("Error submitting review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews" className="w-full max-w-4xl mx-auto mt-20 p-8 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md relative z-20 mb-40">
      <h2 className="text-3xl font-black text-white mb-8 text-center drop-shadow-lg">Customer Feedback</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {liveReviews.length > 0 ? liveReviews.map((rev, index) => (
          <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-colors">
            <div className="flex text-yellow-400 mb-3 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]">{'★'.repeat(rev.rating || 5)}</div>
            <p className="text-gray-300 italic mb-4">"{rev.review_text}"</p>
            <h4 className="text-cyan-400 font-bold tracking-wide">- {rev.reviewer_name}</h4>
          </div>
        )) : (
          <p className="text-gray-500 text-center col-span-2">No reviews yet. Be the first!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-4 max-w-md mx-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <h3 className="text-white font-bold text-center">Leave a Verified Review</h3>
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-black/60 p-4 text-white rounded-xl border border-white/10 outline-none focus:border-cyan-500 transition-colors"
          required
        />
        <textarea
          placeholder="Write your feedback..."
          value={formData.text}
          onChange={e => setFormData({ ...formData, text: e.target.value })}
          className="w-full bg-black/60 p-4 text-white rounded-xl border border-white/10 h-28 outline-none focus:border-cyan-500 resize-none transition-colors"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors text-white px-4 py-4 rounded-xl font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

// 🚀 3. THE MAIN PORTFOLIO VIEW COMPONENT
const PortfolioView = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const [showScrollTop, setShowScrollTop] = useState(false);

  // Update your existing scroll listener to track this new state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400); // Shows the Up button after scrolling down 400px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll listener for sticky navbar glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const isPreviewMode = new URLSearchParams(window.location.search).get('mode') === 'preview';

        if (isPreviewMode) {
          const draftData = localStorage.getItem('3duniverse_draft');
          if (draftData) {
            setData(JSON.parse(draftData));
            setLoading(false);
            return;
          }
        }

        const { data: fetchedData, error: fetchError } = await supabase
          .from('landing_pages')
          .select('page_data')
          .eq('site_name', username)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (fetchedData && fetchedData.page_data) {
          setData(fetchedData.page_data);
        } else {
          setError('Portfolio not found');
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        setError('Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchPortfolio();
  }, [username]);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;
    } catch (err) {
      alert('Google Sign-in failed. Please check your Supabase Auth settings.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
        <h1 className="text-2xl">{error || "Portfolio not found"}</h1>
      </div>
    );
  }
  // 🚀 SMART CHECKOUT ENGINE
  const handleCheckout = async (block) => {
    // 1. Get current user
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to complete your purchase!');
      window.location.href = `/client-portal/${username}`;
      return;
    }

    // 2. Identify the item and price (using the dynamic fields)
    const itemName = block.customFields?.productName || block.customFields?.courseTitle || block.customFields?.serviceName || 'Item';
    const price = block.customFields?.price || '0';

    // 3. Send to Supabase 'client_requests' table (The Bridge to your CRM)
    const { error } = await supabase.from('client_requests').insert({
      site_name: username,
      customer_email: session.user.email,
      industry: data.setup?.category || 'ecommerce',
      request_type: 'order',
      status: 'Pending',
      payload: { item: itemName, price: price }
    });

    if (error) alert("Checkout failed: " + error.message);
    else alert("✅ Success! Your order has been placed. Track it in your Portal.");
  };

  const selectedTheme = data.setup?.themeId || 'theme-1';
  const primaryColor = data.brand?.colors?.[0] || '#06B6D4';

  const renderLive3DBackground = (themeId) => {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {themeId === 'theme-1' && <ThemeNeonMall />}
        {themeId === 'theme-2' && <ThemeSpaceMarket />}
        {themeId === 'theme-3' && <ThemeGoldenPrestige />}
        {themeId === 'theme-4' && <ThemeCyberLab />}
        {themeId === 'theme-5' && <ThemeTronGrid />}
        {themeId === 'theme-6' && <ThemePortalDimension />}
        {themeId === 'theme-7' && <ThemeSkylineEstate />}
        {themeId === 'theme-8' && <ThemeDreamHall />}
        {themeId === 'theme-9' && <ThemeFrozenPlatinum />}
        {themeId === 'theme-10' && <ThemeCosmicLibrary />}
        {themeId === 'theme-11' && <ThemeAiSphere />}
        {themeId === 'theme-12' && <ThemeGeneticMatrix />}
        {themeId === 'theme-13' && <ThemeCommandCenter />}
        {themeId === 'theme-14' && <ThemeCrystalVault />}
        {themeId === 'theme-15' && <ThemeDarkMatter />}
        {(!themeId || themeId === 'space') && <ThemeNeonMall />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-white scroll-smooth" style={{ fontFamily: data.brand?.font || 'Inter' }}>

      {renderLive3DBackground(selectedTheme)}

      {/* 🚀 1. DYNAMIC NAVBAR WITH GOOGLE SIGN IN */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 pointer-events-auto border-b ${isScrolled ? 'bg-black/70 backdrop-blur-xl border-white/10 shadow-lg py-3' : 'bg-transparent border-transparent py-6'}`}>
        <div className="max-w-[90rem] mx-auto px-6 flex justify-between items-center">

          {/* Glowing Circular Logo & Brand */}
          <a href="#home" className="flex items-center gap-4 group flex-shrink-0">
            {data.brand?.logo && (
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <img src={data.brand.logo} alt="Brand Logo" className="relative h-12 w-12 rounded-full object-cover border-2 border-white/20 shadow-[0_0_15px_rgba(6,182,212,0.8)] bg-black" style={{ borderColor: primaryColor }} />
              </div>
            )}
            <span className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md hidden sm:block" style={{ color: primaryColor }}>
              {data.brand?.name || 'Your Brand'}
            </span>
          </a>

          {/* 🚀 OWNER-CONFIGURED NAVIGATION LINKS */}
          <div className="hidden lg:flex items-center gap-10 bg-black/40 px-8 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {data.hero?.navLinks && data.hero.navLinks.length > 0 ? (
              data.hero.navLinks.map((link, idx) => (
                <a key={idx} href={link.target} className="text-[13px] font-black text-gray-300 hover:text-white transition-colors uppercase tracking-[0.2em] relative group">
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full group-hover:left-0 rounded-full shadow-[0_0_10px_#22d3ee]"></span>
                </a>
              ))
            ) : (
              /* Fallback if the owner hasn't set up custom links yet */
              <>
                <a href="#home" className="text-[13px] font-black text-white uppercase tracking-[0.2em]">Home</a>
                {data.blocks?.slice(0, 4).map(block => {
                  if (block.title.toLowerCase() === 'hero') return null;
                  return (
                    <a key={block.id} href={`#${block.id}`} className="text-[13px] font-black text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em]">
                      {block.title}
                    </a>
                  )
                })}
              </>
            )}
          </div>

          {/* 🚀 CUSTOMER SIGN IN BUTTON */}
          <button
            onClick={() => window.location.href = `/client-portal/${username}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black text-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] flex-shrink-0 uppercase tracking-wider border border-white/20"
            style={{ backgroundColor: primaryColor }}
          >
            <User size={16} className="text-white" /> Sign In
          </button>

        </div>
      </nav>

      {/* FOREGROUND DATA */}
      <div className="relative z-10 w-full pb-32">

        {/* MAIN HERO SECTION */}
        <div id="home" className="max-w-5xl mx-auto px-8 pt-48 pb-20 text-center flex flex-col items-center justify-center min-h-[90vh] pointer-events-none">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md text-cyan-300 font-mono mb-8 uppercase tracking-widest text-sm pointer-events-auto">
            {data.setup?.category || 'Professional Portfolio'}
          </div>
          <h1 className="text-[4rem] md:text-[6rem] lg:text-[7rem] font-black text-white mb-6 drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] tracking-tighter leading-tight pointer-events-auto">
            {data.hero?.headline || data.setup?.name || '3D Universe'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-12 font-light drop-shadow-lg bg-black/40 p-6 rounded-2xl backdrop-blur-sm border border-white/5 pointer-events-auto">
            {data.hero?.subheadline || 'Explore the digital frontier.'}
          </p>
          {data.hero?.ctaText && (
            <a href={data.hero.ctaLink || "#"} className="text-white px-10 py-5 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] pointer-events-auto hover:scale-110 uppercase tracking-wide" style={{ backgroundColor: primaryColor }}>
              {data.hero.ctaText}
            </a>
          )}
        </div>

        // 🚀 DYNAMIC BLOCKS MAPPER
        {data.blocks && data.blocks.length > 0 && (
          data.blocks.map((block) => {
            if (block.title.toLowerCase() === 'hero') return null;

            // Check if it's a product/service card (Has name/title/serviceName)
            const isProductCard = block.customFields?.productName || block.customFields?.courseTitle || block.customFields?.serviceName;

            return (
              <div
                id={block.id}
                key={block.id}
                className="relative min-h-[60vh] flex flex-col justify-center px-4 md:px-8 py-24 border-t border-white/5 bg-black/20 backdrop-blur-sm mt-10"
                style={{ textAlign: block.style?.alignment || 'center' }}
              >
                <div className="max-w-6xl mx-auto w-full pointer-events-auto">

                  {/* 🚀 PRODUCT/SERVICE CARD RENDERER */}
                  {isProductCard ? (
                    <div className="max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] hover:-translate-y-2 group">

                      {/* Image */}
                      {block.media?.heroImage && (
                        <div className="overflow-hidden rounded-2xl mb-6">
                          <img src={block.media.heroImage} className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110" alt="Product" />
                        </div>
                      )}

                      <h2 className="text-2xl font-black text-white">{isProductCard}</h2>
                      <p className="text-cyan-400 text-2xl font-black my-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                        ${block.customFields.price || '0.00'}
                      </p>
                      <p className="text-gray-400 mb-8 text-sm leading-relaxed">{block.content?.description}</p>

                      {/* Pop Button */}
                      <button
                        onClick={() => handleCheckout(block)}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {block.cta?.buttonText || 'Buy Now'}
                      </button>
                    </div>
                  ) : (
                    // Standard Content Block (Non-Product)
                    <>
                      <div className={`inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 text-white font-mono mb-8 uppercase tracking-widest text-xs shadow-lg ${block.style?.alignment === 'left' ? 'mr-auto' : block.style?.alignment === 'right' ? 'ml-auto' : 'mx-auto'}`}>
                        {block.title}
                      </div>
                      <h2 className="text-[3rem] md:text-[4.5rem] font-black text-white mb-4 drop-shadow-[0_5px_20px_rgba(0,0,0,0.8)] leading-tight">
                        {block.content.headline}
                      </h2>
                      {/* ... existing content rendering ... */}
                    </>
                  )}

                </div>
              </div>
            );
          })
        )}

        <ReviewSection siteName={username} />
      </div>

      {/* 🚀 FLOATING ACTION BUTTONS (ALWAYS VISIBLE) */}
      <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-3 pointer-events-auto">

        {/* 1. Quick Chat Button (Shows if owner adds a link) */}
        {data.contact?.quickChatUrl && (
          <a
            href={data.contact.quickChatUrl}
            target="_blank"
            rel="noreferrer"
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative"
            style={{
              backgroundColor: data.contact.quickChatColor || '#25D366',
              boxShadow: `0 0 20px ${data.contact.quickChatColor || '#25D366'}50`
            }}
          >
            <span className="absolute right-16 bg-black/90 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10">
              {data.contact.quickChatLabel || 'Chat with us'}
            </span>
            <SocialIcon type={data.contact.quickChatPlatform || 'whatsapp'} className="text-white w-7 h-7 drop-shadow-md" />
          </a>
        )}

        {/* 2. Scroll to Top Button (ALWAYS VISIBLE NOW) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-black/80 hover:bg-cyan-500 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.8)]"
        >
          <ChevronUp size={28} />
        </button>

      </div>

      {/* 🚀 HIGH-END GLOWING SOCIAL DOCK */}
      {data.contact?.activeSocials && data.contact.activeSocials.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 p-2.5 bg-black/50 border border-white/10 rounded-full backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] pointer-events-auto transition-transform hover:scale-105">
          {data.contact.activeSocials.map(socialId => {
            const url = data.contact.socialUrls?.[socialId] || '#';
            return (
              <a
                key={socialId}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-white/5 rounded-full transition-all group border border-transparent hover:bg-cyan-500/20 hover:border-cyan-500/50 relative overflow-hidden"
                title={socialId}
              >
                <div className="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity"></div>
                <SocialIcon type={socialId} className="relative z-10 w-5 h-5 text-gray-300 group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0)] group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all" />
              </a>
            )
          })}
        </div>

      )}

    </div>

  );
};

export default PortfolioView;