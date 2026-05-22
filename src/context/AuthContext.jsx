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

  // 🚀 NEW: Supabase Email & Password Signup
  const signupWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // This tells Supabase where to send the user after they click the email link
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;

    // data.user.identities will be empty if they haven't verified yet
    return data;
  };
  // 🚀 NEW: Supabase Email & Password Login
  const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw error;
    return data;
  };

  // 🚀 NEW: Supabase Password Reset
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, // Where they go after clicking the email link
    });
    if (error) throw error;
    return data;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      loginWithGoogle,
      signupWithEmail,  // <-- Exported for Login.jsx
      loginWithEmail,   // <-- Exported for Login.jsx
      resetPassword,    // <-- Exported for Login.jsx
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}