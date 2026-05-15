import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { ExternalLink, Mail, MapPin, Calendar, Award, BookOpen, Briefcase, GraduationCap } from 'lucide-react';
import GalaxyTheme from '../themes/GalaxyTheme';
import LavaTheme from '../themes/LavaTheme';
import ForestTheme from '../themes/ForestTheme';
import NeonTechTheme from '../themes/NeonTechTheme';

const PortfolioView = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // 🚀 1. CHECK FOR PREVIEW MODE (This part is perfect!)
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

        // 🚀 2. FETCH LIVE DATA (The Fix is right here 👇)
        const { data: fetchedData, error: fetchError } = await supabase
          .from('landing_pages')
          .select('page_data')
          // 🔥 CHANGED: We now search the 'site_name' column instead of 'id'
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
        <p className="text-sm text-slate-500 max-w-md">
          If you are testing Preview Mode, make sure you clicked the "Preview" button inside the Dashboard so it can save your draft to memory!
        </p>
      </div>
    );
  }

  // Determine which theme to render based on the data
  const theme = (data.theme?.themeId || data.setup?.themeId || 'space').toLowerCase();

  switch (theme) {
    case 'theme-2':
    case 'lava':
      return <LavaTheme portfolioData={data} />;
    case 'theme-3':
    case 'forest':
      return <ForestTheme portfolioData={data} />;
    case 'theme-4':
    case 'cyberpunk':
    case 'neon':
      return <NeonTechTheme portfolioData={data} />;
    case 'theme-1':
    case 'space':
    case 'galaxy':
    default:
      return <GalaxyTheme portfolioData={data} />;
  }
};

export default PortfolioView;