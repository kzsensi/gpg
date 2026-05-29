import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from 'lucide-react';

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contact = '' } = location.state || {}; // contact is the email address

  // If someone navigates here directly without coming from login/signup, kick them back
  useEffect(() => {
    if (!contact) {
      navigate('/login');
    }
  }, [contact, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #faf5ff 50%, #f0fdf4 100%)',
      }}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'linear-gradient(135deg, #0b5ed7, #7c3aed)' }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #0b5ed7)' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div
          className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 border border-slate-100 text-center"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              className="p-2.5 rounded-xl text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)' }}
            >
              <GraduationCap size={24} />
            </div>
            <span className="font-sans font-bold text-xl text-slate-900 tracking-tight">
              GharPeGyan
            </span>
          </div>

          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
            }}
          >
            <Mail size={40} className="text-[#0b5ed7]" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Check Your Email!</h2>
          
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            We've sent a verification link to<br />
            <span className="font-semibold text-slate-700">{contact}</span><br /><br />
            Please click the link in that email to activate your account.
          </p>

          <Link
            to="/login"
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
            }}
          >
            <CheckCircle2 size={18} />
            I've verified my email, let's login
          </Link>
          
          <p className="text-xs text-slate-400 mt-6">
            Don't see the email? Check your spam folder.
          </p>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTPVerify;
