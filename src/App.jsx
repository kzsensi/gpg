/**
 * App.jsx — The Route Map
 * ========================
 * 
 * Defines every page URL and which component renders for it.
 * 
 * PERFORMANCE:
 * - All route components are lazy-loaded using React.lazy()
 * - Only the code for the current page is loaded on demand
 * - A minimal spinner shows during chunk loading
 * 
 * SECURITY:
 * - Public routes (/, /search, /teacher/:id) → accessible by everyone
 * - Auth routes (/login, /otp-verify) → accessible by everyone
 * - Parent routes (/parent/*) → wrapped in ProtectedRoute with role="parent"
 * - Tutor routes (/tutor/*) → wrapped in ProtectedRoute with role="tutor"
 * 
 * If a user is not logged in and tries to access a protected route,
 * ProtectedRoute automatically redirects them to /login.
 * If they're logged in but with the wrong role, they go to /.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// ─── Lazy-loaded Page Components ────────────────────────────────
// Each import() creates a separate JS chunk that loads only when the route is visited.

// Public Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TeacherSearch = lazy(() => import('./pages/TeacherSearch'));
const TeacherProfile = lazy(() => import('./pages/TeacherProfile'));

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const OTPVerify = lazy(() => import('./pages/auth/OTPVerify'));

// Parent Dashboard
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard'));
const ParentProfile = lazy(() => import('./pages/parent/ParentProfile'));
const PostRequirement = lazy(() => import('./pages/parent/PostRequirement'));
const ParentRequirements = lazy(() => import('./pages/parent/ParentRequirements'));
const DemoRequests = lazy(() => import('./pages/parent/DemoRequests'));
const ParentMatches = lazy(() => import('./pages/parent/ParentMatches'));

// Tutor Dashboard
const TutorDashboard = lazy(() => import('./pages/tutor/TutorDashboard'));
const ProfileBuilder = lazy(() => import('./pages/tutor/ProfileBuilder'));
const LeadInbox = lazy(() => import('./pages/tutor/LeadInbox'));
const TutorDemos = lazy(() => import('./pages/tutor/TutorDemos'));
const TutorStudents = lazy(() => import('./pages/tutor/TutorStudents'));
const TutorReviews = lazy(() => import('./pages/tutor/TutorReviews'));
const TutorAvailability = lazy(() => import('./pages/tutor/TutorAvailability'));
const Messages = lazy(() => import('./pages/shared/Messages'));

// Admin Dashboard
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminTutors = lazy(() => import('./pages/admin/AdminTutors'));
const AdminParents = lazy(() => import('./pages/admin/AdminParents'));
const AdminDemos = lazy(() => import('./pages/admin/AdminDemos'));

// Legal
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const HelpSupport = lazy(() => import('./pages/HelpSupport'));

// ─── Loading Spinner (shown while a lazy chunk downloads) ───────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-[3px] border-[#0b5ed7] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-400 font-medium">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* ── Public Pages ── */}
        {/* Anyone can see these, logged in or not */}
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<TeacherSearch />} />
        <Route path="/teacher/:id" element={<TeacherProfile />} />

        {/* ── Auth Pages ── */}
        {/* Login/signup — accessible by everyone */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp-verify" element={<OTPVerify />} />

        {/* ── Parent Dashboard (Protected) ── */}
        {/* Only logged-in users with role="parent" can access these */}
        <Route path="/parent/dashboard" element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/parent/profile" element={
          <ProtectedRoute role="parent">
            <ParentProfile />
          </ProtectedRoute>
        } />
        <Route path="/parent/post-requirement" element={
          <ProtectedRoute role="parent">
            <PostRequirement />
          </ProtectedRoute>
        } />
        <Route path="/parent/requirements" element={
          <ProtectedRoute role="parent">
            <ParentRequirements />
          </ProtectedRoute>
        } />
        <Route path="/parent/demos" element={
          <ProtectedRoute role="parent">
            <DemoRequests />
          </ProtectedRoute>
        } />
        <Route path="/parent/matches" element={
          <ProtectedRoute role="parent">
            <ParentMatches />
          </ProtectedRoute>
        } />
        <Route path="/parent/messages" element={
          <ProtectedRoute role="parent">
            <Messages type="parent" />
          </ProtectedRoute>
        } />

        {/* ── Tutor Dashboard (Protected) ── */}
        {/* Only logged-in users with role="tutor" can access these */}
        <Route path="/tutor/dashboard" element={
          <ProtectedRoute role="tutor">
            <TutorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/tutor/messages" element={
          <ProtectedRoute role="tutor">
            <Messages type="tutor" />
          </ProtectedRoute>
        } />
        <Route path="/tutor/profile" element={
          <ProtectedRoute role="tutor">
            <ProfileBuilder />
          </ProtectedRoute>
        } />
        <Route path="/tutor/leads" element={
          <ProtectedRoute role="tutor">
            <LeadInbox />
          </ProtectedRoute>
        } />
        <Route path="/tutor/demos" element={
          <ProtectedRoute role="tutor">
            <TutorDemos />
          </ProtectedRoute>
        } />
        <Route path="/tutor/students" element={
          <ProtectedRoute role="tutor">
            <TutorStudents />
          </ProtectedRoute>
        } />
        <Route path="/tutor/reviews" element={
          <ProtectedRoute role="tutor">
            <TutorReviews />
          </ProtectedRoute>
        } />
        <Route path="/tutor/availability" element={
          <ProtectedRoute role="tutor">
            <TutorAvailability />
          </ProtectedRoute>
        } />

        {/* ── Admin Dashboard (Protected) ── */}
        {/* Only logged-in users with role="admin" can access these */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/tutors" element={
          <ProtectedRoute role="admin">
            <AdminTutors />
          </ProtectedRoute>
        } />
        <Route path="/admin/parents" element={
          <ProtectedRoute role="admin">
            <AdminParents />
          </ProtectedRoute>
        } />
        <Route path="/admin/demos" element={
          <ProtectedRoute role="admin">
            <AdminDemos />
          </ProtectedRoute>
        } />

        {/* ── Legal Pages ── */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<HelpSupport />} />

        {/* ── Fallback ── */}
        {/* Any unknown URL redirects to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </>
  );
}

export default App;
