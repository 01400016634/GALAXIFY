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
        // Changed to dashboard so they go straight to the app after Google approves them
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/'; // Send them to the homepage/login after logout
  };

  // 🚀 UPDATED: Supabase Email & Password Signup (Handles Verification)
  const signupWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // If "Confirm Email" is ON in Supabase, session will be null here until they click the link.
    if (data.user && !data.session) {
      return { success: true, message: "Verification email sent! Please check your inbox before logging in." };
    }

    return { success: true, message: "Signup successful!" };
  };

  // 🚀 UPDATED: Supabase Email & Password Login (Catches unverified users)
  const loginWithEmail = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Supabase returns "Invalid login credentials" if the email isn't verified yet
      if (error.message === 'Invalid login credentials') {
        throw new Error("Invalid email/password, OR you haven't verified your email yet!");
      }
      throw new Error(error.message);
    }

    return data;
  };

  // 🚀 UPDATED: Supabase Password Reset
  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
    return { success: true, message: "Password reset link sent to your email!" };
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      loginWithGoogle,
      signupWithEmail,
      loginWithEmail,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}