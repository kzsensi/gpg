import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from './pages/HomePage';
import TeacherSearch from './pages/TeacherSearch';
import TeacherProfile from './pages/TeacherProfile';
import ChatPage from './pages/ChatPage';

// Auth
import LoginPage from './pages/auth/LoginPage';
import OTPVerify from './pages/auth/OTPVerify';
import ForgotPassword from './pages/auth/ForgotPassword';

// Parent Dashboard
import ParentDashboardHome from './pages/parent/DashboardHome';
import ParentProfile from './pages/parent/ParentProfile';
import PostRequirement from './pages/parent/PostRequirement';
import MyRequirements from './pages/parent/MyRequirements';
import SavedTeachers from './pages/parent/SavedTeachers';
import DemoRequests from './pages/parent/DemoRequests';
import ParentNotifications from './pages/parent/Notifications';
import ParentSettings from './pages/parent/ParentSettings';

// Tutor Dashboard
import TutorDashboardHome from './pages/tutor/TutorDashboardHome';
import ProfileBuilder from './pages/tutor/ProfileBuilder';
import VerificationStatus from './pages/tutor/VerificationStatus';
import MediaUpload from './pages/tutor/MediaUpload';
import LeadInbox from './pages/tutor/LeadInbox';
import TutorDemos from './pages/tutor/TutorDemos';
import FeeAvailability from './pages/tutor/FeeAvailability';

// Legal
import TermsOfService from './pages/legal/TermsOfService';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import CommunityRules from './pages/legal/CommunityRules';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<TeacherSearch />} />
      <Route path="/teacher/:id" element={<TeacherProfile />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verify" element={<OTPVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Parent Dashboard */}
      <Route path="/parent/dashboard" element={<ParentDashboardHome />} />
      <Route path="/parent/profile" element={<ParentProfile />} />
      <Route path="/parent/post-requirement" element={<PostRequirement />} />
      <Route path="/parent/requirements" element={<MyRequirements />} />
      <Route path="/parent/saved" element={<SavedTeachers />} />
      <Route path="/parent/demos" element={<DemoRequests />} />
      <Route path="/parent/notifications" element={<ParentNotifications />} />
      <Route path="/parent/settings" element={<ParentSettings />} />

      {/* Tutor Dashboard */}
      <Route path="/tutor/dashboard" element={<TutorDashboardHome />} />
      <Route path="/tutor/profile-builder" element={<ProfileBuilder />} />
      <Route path="/tutor/verification" element={<VerificationStatus />} />
      <Route path="/tutor/media" element={<MediaUpload />} />
      <Route path="/tutor/leads" element={<LeadInbox />} />
      <Route path="/tutor/demos" element={<TutorDemos />} />
      <Route path="/tutor/fees" element={<FeeAvailability />} />

      {/* Chat */}
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:conversationId" element={<ChatPage />} />

      {/* Legal */}
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />
      <Route path="/community-rules" element={<CommunityRules />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
