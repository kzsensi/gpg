import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  Smartphone,
} from 'lucide-react';

const OTPVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role = 'parent', contact = '98765 43210' } = location.state || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move back on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasted[i] || '';
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;

    setIsVerifying(true);

    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      setTimeout(() => {
        navigate(role === 'parent' || role === 'student'
          ? '/parent/dashboard'
          : '/tutor/dashboard'
        );
      }, 1200);
    }, 1500);
  };

  const maskedContact = contact.length > 4
    ? '•'.repeat(contact.length - 4) + contact.slice(-4)
    : contact;

  const otpFilled = otp.every((d) => d !== '');

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
          className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 border border-slate-100"
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

          {/* Success State */}
          {isVerified ? (
            <div className="text-center py-6">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #dcfce7, #d1fae5)',
                }}
              >
                <CheckCircle2 size={40} className="text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verified!</h2>
              <p className="text-slate-500 text-sm">
                Redirecting you to your dashboard...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-1 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
                  }}
                >
                  <Smartphone size={28} className="text-[#0b5ed7]" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Verify Your Number
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We've sent a 6-digit verification code to
                  <br />
                  <span className="font-semibold text-slate-700">{maskedContact}</span>
                </p>
              </div>

              {/* OTP Inputs */}
              <form onSubmit={handleVerify}>
                <div className="flex justify-center gap-2.5 sm:gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none ${
                        digit
                          ? 'border-[#0b5ed7] bg-blue-50/50 text-slate-900'
                          : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                      }`}
                      style={
                        digit
                          ? { boxShadow: '0 0 0 3px rgba(11, 94, 215, 0.1)' }
                          : {}
                      }
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Timer & Resend */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="flex items-center gap-1.5 text-[#0b5ed7] font-semibold text-sm hover:underline transition-colors"
                    >
                      <RefreshCw size={14} />
                      Resend OTP
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center"
                        style={{
                          background: `conic-gradient(#0b5ed7 ${(timer / 30) * 360}deg, #e2e8f0 0deg)`,
                        }}
                      >
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </div>
                      <span>
                        Resend in{' '}
                        <span className="font-semibold text-slate-700">
                          0:{timer.toString().padStart(2, '0')}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={!otpFilled || isVerifying}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    otpFilled && !isVerifying
                      ? 'shadow-lg hover:shadow-xl'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: otpFilled
                      ? 'linear-gradient(135deg, #0b5ed7, #4f46e5)'
                      : '#94a3b8',
                  }}
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Verify & Continue
                    </>
                  )}
                </button>
              </form>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-slate-400">
                <ShieldCheck size={14} />
                <span>Your data is encrypted and secure</span>
              </div>
            </>
          )}
        </div>

        {/* Back Link */}
        {!isVerified && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPVerify;
