/**
 * AuthContext — The Authentication Brain of GharPeGyan
 * ====================================================
 * 
 * WHAT THIS FILE DOES:
 * This file creates a "wrapper" that surrounds the entire app.
 * It constantly knows: Is anyone logged in? What role are they? Is their profile complete?
 * Every component in the app can access this info using the useAuth() hook.
 * 
 * HOW IT WORKS:
 * 1. On app load → checks if a session already exists in localStorage
 * 2. If yes → restores the user and fetches their profile
 * 3. If no → user is treated as a guest (not logged in)
 * 4. Listens for auth events (login, logout, token refresh) in real-time
 * 
 * HOW TO USE IN ANY COMPONENT:
 *   import { useAuth } from '../contexts/AuthContext';
 *   const { user, role, isAuthenticated, signOut } = useAuth();
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Create the context — think of this as a "data channel" that any component can tune into
const AuthContext = createContext(null);

/**
 * Custom hook to access auth state from any component.
 * Usage: const { user, role, signOut } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider. Make sure <AuthProvider> wraps your <App />.');
  }
  return context;
};

/**
 * AuthProvider — Wraps the entire app and provides auth state to all children.
 * This is placed in main.jsx around <App />.
 */
export const AuthProvider = ({ children }) => {
  // ── State ──────────────────────────────────────────────
  const [user, setUser] = useState(null);            // The Supabase user object (contains id, email, etc.)
  const [role, setRole] = useState(null);             // 'parent' or 'tutor' (read from user_metadata)
  const [profile, setProfile] = useState(null);       // The user's profile data from the database
  const [profileComplete, setProfileComplete] = useState(false); // Has the user filled in their profile?
  const [loading, setLoading] = useState(true);       // True while we're checking if a session exists
  const [authError, setAuthError] = useState(null);   // Stores the last auth error message

  // ── Derived state ──────────────────────────────────────
  const isAuthenticated = !!user;

  /**
   * Fetches the user's profile from the database.
   * Called after login to check if their profile is complete.
   * 
   * WHY: If a user signs up but closes the browser before filling their profile,
   * we need to redirect them back to the profile page on next login.
   */
  const fetchProfile = useCallback(async (currentUser) => {
    if (!currentUser) return;

    const userRole = currentUser.user_metadata?.role;

    try {
      if (userRole === 'admin') {
        // Admin has no profile table — use metadata, always mark complete
        setProfile(currentUser.user_metadata || null);
        setProfileComplete(true);
      } else if (userRole === 'tutor') {
        const fetchPromise = supabase
          .from('tutor_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout')), 2500)
        );

        let data = null;
        let fetchError = null;

        try {
          const result = await Promise.race([fetchPromise, timeoutPromise]);
          data = result.data;
          fetchError = result.error;
        } catch (timeoutErr) {
          fetchError = timeoutErr;
        }

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.warn('Could not fetch tutor profile (may be RLS):', fetchError.message);
        }

        // Set profile to DB row if available, otherwise fallback to user_metadata
        setProfile(data || currentUser.user_metadata || null);
        
        // Complete = has name (from DB row OR from signup metadata)
        const hasName = !!(data?.name || currentUser.user_metadata?.name);
        const hasSubjects = !!(data?.subjects?.length || currentUser.user_metadata?.subjects?.length);
        setProfileComplete(hasName && hasSubjects);
      } else if (userRole === 'parent') {
        const hasName = !!currentUser.user_metadata?.name;
        setProfileComplete(hasName);
        setProfile(currentUser.user_metadata || null);
      } else {
        // Unknown role — treat as incomplete but don't block
        const hasName = !!currentUser.user_metadata?.name;
        setProfileComplete(hasName);
        setProfile(null);
      }
    } catch (err) {
      console.warn('fetchProfile error (non-fatal):', err.message);
      // Don't throw — just set safe defaults so the app doesn't freeze
      setProfile(currentUser?.user_metadata || null);
      // If we can't read the DB, assume profile is complete to avoid redirect loops
      const hasName = !!currentUser?.user_metadata?.name;
      setProfileComplete(hasName);
    }
  }, []);

  /**
   * Processes a Supabase session — extracts user info and fetches profile.
   * Called on initial load AND whenever the auth state changes.
   */
  const handleSession = useCallback(async (session) => {
    if (session?.user) {
      const currentUser = session.user;
      setUser(currentUser);
      setRole(currentUser.user_metadata?.role || null);
      await fetchProfile(currentUser);
    } else {
      // No session = not logged in
      setUser(null);
      setRole(null);
      setProfile(null);
      setProfileComplete(false);
    }
  }, [fetchProfile]);

  // ── Initialize on app load ─────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Safety net: if loading hasn't resolved in 8s, force it to false
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn('Auth init timed out — forcing loading=false');
        setLoading(false);
      }
    }, 8000);

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.warn('getSession error:', error.message);
        if (mounted) {
          await handleSession(session);
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await handleSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
          setProfile(null);
          setProfileComplete(false);
          setLoading(false);
        }
        // INITIAL_SESSION fires on page load — ensure loading is cleared
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
          clearTimeout(safetyTimer);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  // ── Auth Actions ───────────────────────────────────────

  /**
   * Sign up a new user with email and password.
   * @param {string} email
   * @param {string} password
   * @param {string} userRole - 'parent' or 'tutor'
   * @param {string} name - User's full name
   * @returns {{ data, error }}
   */
  const signUp = async (email, password, userRole, name) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userRole,  // Stored in user_metadata — accessible everywhere
          name: name,
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      return { data: null, error };
    }

    return { data, error: null };
  };

  /**
   * Sign in an existing user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {{ data, error }}
   */
  const signIn = async (email, password) => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
      return { data: null, error };
    }

    return { data, error: null };
  };

  /**
   * Sign in with Google OAuth.
   * Supabase redirects to Google, then back to your site.
   * The role must be set AFTER the redirect (handled in a callback page or via onAuthStateChange).
   */
  const signInWithGoogle = async () => {
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`, // Come back to homepage after Google login
      },
    });

    if (error) {
      setAuthError(error.message);
    }

    return { data, error };
  };

  /**
   * Sign out the current user.
   * Clears the session from localStorage and resets all state.
   */
  const signOut = async () => {
    setAuthError(null);

    // Clear state IMMEDIATELY — don't wait for onAuthStateChange
    // This makes the UI respond instantly when logout is clicked
    setUser(null);
    setRole(null);
    setProfile(null);
    setProfileComplete(false);

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('signOut error (state already cleared):', err.message);
    }

    return { error: null };
  };

  /**
   * Refresh the user's profile data from the database.
   * Call this after the user saves their profile to update the context.
   */
  const refreshProfile = async () => {
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (freshUser) {
      setUser(freshUser);
      await fetchProfile(freshUser);
    }
  };

  // ── Context value (what every component can access) ────
  const value = {
    // State
    user,                // Supabase user object (id, email, user_metadata)
    role,                // 'parent' | 'tutor' | null
    profile,             // Profile data from database
    profileComplete,     // boolean — has the user filled in their profile?
    loading,             // boolean — true while checking initial session
    isAuthenticated,     // boolean — is anyone logged in?
    authError,           // string | null — last error message

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    refreshProfile,
    setAuthError,        // Allow components to clear the error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
