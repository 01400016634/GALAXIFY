import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
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
        // The username from URL is used as the document ID (slug)
        const docRef = doc(db, 'portfolios', username);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
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

  if (!data) return null;

  // Determine which theme to render based on the data
  const theme = (data.theme || 'space').toLowerCase();

  switch (theme) {
    case 'lava':
      return <LavaTheme portfolioData={data} />;
    case 'forest':
      return <ForestTheme portfolioData={data} />;
    case 'cyberpunk':
    case 'neon':
      return <NeonTechTheme portfolioData={data} />;
    case 'space':
    case 'galaxy':
    default:
      return <GalaxyTheme portfolioData={data} />;
  }
};

export default PortfolioView;