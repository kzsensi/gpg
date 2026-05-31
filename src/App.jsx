/**
 * App.jsx — The Route Map
 * ========================
 * 
 * Defines every page URL and which component renders for it.
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

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import TeacherSearch from './pages/TeacherSearch';
import TeacherProfile from './pages/TeacherProfile';

// Auth
import LoginPage from './pages/auth/LoginPage';
import OTPVerify from './pages/auth/OTPVerify';

// Parent Dashboard
import ParentDashboard from './pages/parent/ParentDashboard';
import ParentProfile from './pages/parent/ParentProfile';
import PostRequirement from './pages/parent/PostRequirement';
import ParentRequirements from './pages/parent/ParentRequirements';
import DemoRequests from './pages/parent/DemoRequests';
import ParentMatches from './pages/parent/ParentMatches';

// Tutor Dashboard
import TutorDashboard from './pages/tutor/TutorDashboard';
import ProfileBuilder from './pages/tutor/ProfileBuilder';
import LeadInbox from './pages/tutor/LeadInbox';
import TutorDemos from './pages/tutor/TutorDemos';
import TutorStudents from './pages/tutor/TutorStudents';
import TutorReviews from './pages/tutor/TutorReviews';
import TutorAvailability from './pages/tutor/TutorAvailability';
import Messages from './pages/shared/Messages';

// Admin Dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTutors from './pages/admin/AdminTutors';
import AdminParents from './pages/admin/AdminParents';
import AdminDemos from './pages/admin/AdminDemos';

// Legal
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import HelpSupport from './pages/HelpSupport';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
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
    </>
  );
}

export default App;
