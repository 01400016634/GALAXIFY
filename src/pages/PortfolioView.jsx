import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';

// 🚀 1. IMPORT YOUR NEW 15 AAA THEMES
// To this (No curly braces):
import ThemeNeonMall from '../themes/ecommerce/ThemeNeonMall'; import { ThemeSpaceMarket } from '../themes/ecommerce/ThemeSpaceMarket';
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

const PortfolioView = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // 🚀 PREVIEW MODE LOGIC (Kept exactly as you wrote it!)
        const isPreviewMode = new URLSearchParams(window.location.search).get('mode') === 'preview';

        if (isPreviewMode) {
          const draftData = localStorage.getItem('3duniverse_draft');
          if (draftData) {
            console.log("🚀 PREVIEW MODE ACTIVATED. DATA:", JSON.parse(draftData));
            setData(JSON.parse(draftData));
            setLoading(false);
            return;
          }
        }

        // 🚀 LIVE SUPABASE DATA LOGIC (Kept exactly as you wrote it!)
        const { data: fetchedData, error: fetchError } = await supabase
          .from('landing_pages')
          .select('page_data')
          .eq('site_name', username)
          .single();

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

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
        <h1 className="text-2xl">{error}</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white font-mono p-6 text-center">
        <h1 className="text-3xl font-bold text-[#ff003c] mb-4">SYSTEM_EMPTY</h1>
        <p className="text-slate-400 mb-6">No portfolio data found for this user.</p>
      </div>
    );
  }

  // 🚀 2. GET THE THEME ID SAVED IN THE DATABASE
  const selectedTheme = data.setup?.themeId || 'theme-1';

  // 🚀 3. RENDER THE CORRECT 3D SCENE
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

        {/* Fallback Theme if none match */}
        {(!themeId || themeId === 'space') && <ThemeNeonMall />}
      </div>
    );
  };

  // Safely extract text to show over the 3D scene
  const headline = data.blocks?.find(b => b.title.includes('Hero'))?.content?.headline || data.setup?.projectName || '3D Universe';
  const subheadline = data.blocks?.find(b => b.title.includes('Hero'))?.content?.subheadline || 'Explore the digital frontier.';

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden relative selection:bg-white/30 selection:text-white">

      {/* BACKGROUND: The 3D Theme */}
      {renderLive3DBackground(selectedTheme)}

      {/* FOREGROUND: The User's Text Data */}
      <div className="relative z-10 w-full animate-in fade-in-up duration-1000 pointer-events-none">
        <div className="max-w-5xl mx-auto px-8 pt-40 pb-32 text-center flex flex-col items-center justify-center min-h-[80vh]">

          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-gray-300 font-mono mb-8 uppercase tracking-widest text-sm pointer-events-auto">
            {data.setup?.category || 'Professional Portfolio'}
          </div>

          <h1 className="text-[5rem] md:text-[8rem] font-black text-white mb-6 drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] tracking-tighter leading-none">
            {headline}
          </h1>

          <p className="text-2xl md:text-3xl text-gray-200 max-w-3xl mb-12 font-light drop-shadow-lg bg-black/20 p-6 rounded-2xl backdrop-blur-sm border border-white/5 pointer-events-auto">
            {subheadline}
          </p>

        </div>
      </div>
    </div>
  );
};

export default PortfolioView;