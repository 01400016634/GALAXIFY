import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect if we are returning from a Google OAuth redirect
    const isRedirecting =
      window.location.search.includes('code=') ||
      window.location.hash.includes('access_token');

    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setCurrentUser(session.user);
      }

      // Do not stop loading if Google is passing us a token
      if (!isRedirecting) {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for Supabase to finish processing the token
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
        } else {
          setCurrentUser(null);
        }

        // Once the token is processed, it is safe to unblock the UI
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 🚀 THIS IS THE MISSING FUNCTION THAT CAUSED THE CRASH
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    // Line 80: It is now safely exporting the function defined above
    <AuthContext.Provider value={{ currentUser, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}