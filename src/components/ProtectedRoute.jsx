/**
 * ProtectedRoute — Security guard for dashboard pages
 *
 * Checks:
 * 1. Still loading auth → show spinner
 * 2. Not logged in → redirect to /login (with redirect-back URL)
 * 3. Wrong role → redirect to /
 * 4. Profile incomplete (NEW user, no name at all) → send to profile page
 *
 * IMPORTANT: The profileComplete check is intentionally lenient.
 * We only block if the user has NO name at all (brand new signup).
 * We never block a tutor who has already visited the profile page before.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole, loading, user, profile, profileComplete } = useAuth();
  const location = useLocation();

  // Still checking session — show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <div className="text-center">
          <div
            className="w-10 h-10 border-slate-200 border-t-[#0b5ed7] rounded-full animate-spin mx-auto mb-4"
            style={{ borderWidth: '3px', borderStyle: 'solid' }}
          />
          <p className="text-slate-500 font-medium text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login, save current URL so we redirect back after
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Wrong role → go to homepage
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // Profile check: ONLY redirect brand-new users who have NO name at all.
  // We check user_metadata.name (set at signup) as the primary signal.
  // This avoids blocking tutors who have a profile but RLS prevented loading it.
  const userName = user?.user_metadata?.name || profile?.name;
  const isNewUser = !userName;

  if (isNewUser && userRole !== 'admin') {
    const profilePath = userRole === 'tutor' ? '/tutor/profile' : '/parent/profile';
    // Prevent infinite redirect if they're already on the profile page
    if (location.pathname !== profilePath) {
      return <Navigate to={profilePath} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
