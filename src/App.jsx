import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import TeacherSearch from './pages/TeacherSearch';
import TeacherProfile from './pages/TeacherProfile';

// Auth
import LoginPage from './pages/auth/LoginPage';
import OTPVerify from './pages/auth/OTPVerify';

// Parent Dashboard
import ParentProfile from './pages/parent/ParentProfile';
import PostRequirement from './pages/parent/PostRequirement';
import DemoRequests from './pages/parent/DemoRequests';

// Tutor Dashboard
import ProfileBuilder from './pages/tutor/ProfileBuilder';
import LeadInbox from './pages/tutor/LeadInbox';
import TutorDemos from './pages/tutor/TutorDemos';

// Legal
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<TeacherSearch />} />
      <Route path="/teacher/:id" element={<TeacherProfile />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verify" element={<OTPVerify />} />

      {/* Parent Dashboard */}
      <Route path="/parent/profile" element={<ParentProfile />} />
      <Route path="/parent/post-requirement" element={<PostRequirement />} />
      <Route path="/parent/demos" element={<DemoRequests />} />

      {/* Tutor Dashboard */}
      <Route path="/tutor/profile" element={<ProfileBuilder />} />
      <Route path="/tutor/leads" element={<LeadInbox />} />
      <Route path="/tutor/demos" element={<TutorDemos />} />

      {/* Legal */}
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
