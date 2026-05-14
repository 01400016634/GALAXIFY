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
    // 1. Initial Session Check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser({
            uid: session.user.id,
            email: session.user.email,
            displayName: session.user.user_metadata?.full_name || 'Galaxify User',
          });
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        // Only stop loading if we aren't waiting for a hash token
        if (!window.location.hash.includes('access_token')) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);

      if (session?.user) {
        setCurrentUser({
          uid: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.full_name || 'Galaxify User',
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    window.location.href = '/';
  };

  const value = {
    currentUser,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}