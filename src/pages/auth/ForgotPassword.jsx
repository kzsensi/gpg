import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowLeft,
  Mail,
  Phone,
  KeyRound,
  Send,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState('phone');
  const [contact, setContact] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  const maskedContact =
    inputMethod === 'phone' && contact.length > 4
      ? '•'.repeat(contact.length - 4) + contact.slice(-4)
      : inputMethod === 'email' && contact.includes('@')
      ? contact[0] + '•'.repeat(contact.indexOf('@') - 1) + contact.slice(contact.indexOf('@'))
      : contact;

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
          className="absolute top-20 right-20 w-72 h-72 rounded-full opacity-20"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
        />
        <div
          className="absolute bottom-20 left-20 w-64 h-64 rounded-full opacity-15"
          style={{ background: 'linear-gradient(135deg, #0b5ed7, #7c3aed)' }}
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
          {isSent ? (
            <div className="text-center py-4">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #dbeafe, #ede9fe)',
                }}
              >
                <CheckCircle2 size={40} className="text-[#0b5ed7]" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Check Your {inputMethod === 'phone' ? 'Phone' : 'Inbox'}!
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-2">
                We've sent a password reset{' '}
                {inputMethod === 'phone' ? 'OTP' : 'link'} to
              </p>
              <p className="font-semibold text-slate-700 text-sm mb-8">
                {maskedContact}
              </p>

              <div className="space-y-3">
                {inputMethod === 'phone' && (
                  <button
                    onClick={() =>
                      navigate('/otp-verify', {
                        state: { role: 'parent', contact },
                      })
                    }
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
                    }}
                  >
                    Enter OTP
                    <ArrowRight size={16} />
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsSent(false);
                    setContact('');
                  }}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 transition-all"
                >
                  Didn't receive it? Try again
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-6">
                The {inputMethod === 'phone' ? 'OTP expires' : 'link expires'} in 15 minutes
              </p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  }}
                >
                  <KeyRound size={28} className="text-amber-600" />
                </div>
              </div>

              {/* Heading */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Forgot Password?
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  No worries! Enter your registered{' '}
                  {inputMethod === 'phone' ? 'phone number' : 'email address'} and
                  we'll send you a reset{' '}
                  {inputMethod === 'phone' ? 'OTP' : 'link'}.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Input method toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      {inputMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod(inputMethod === 'phone' ? 'email' : 'phone');
                        setContact('');
                      }}
                      className="text-xs text-[#0b5ed7] font-medium hover:underline flex items-center gap-1"
                    >
                      {inputMethod === 'phone' ? (
                        <>
                          <Mail size={12} /> Use Email
                        </>
                      ) : (
                        <>
                          <Phone size={12} /> Use Phone
                        </>
                      )}
                    </button>
                  </div>

                  {inputMethod === 'phone' ? (
                    <div className="flex gap-2">
                      <div className="flex items-center px-3.5 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        autoFocus
                      />
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!contact.trim() || isSending}
                  className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    contact.trim() && !isSending
                      ? 'shadow-lg hover:shadow-xl'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    background: contact.trim()
                      ? 'linear-gradient(135deg, #0b5ed7, #4f46e5)'
                      : '#94a3b8',
                  }}
                >
                  {isSending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Reset {inputMethod === 'phone' ? 'OTP' : 'Link'}
                    </>
                  )}
                </button>
              </form>

              {/* Help text */}
              <div
                className="mt-6 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed"
                style={{ background: '#fafbfc' }}
              >
                💡 <strong className="text-slate-600">Tip:</strong> Make sure to
                check your spam folder if using email. The reset{' '}
                {inputMethod === 'phone' ? 'OTP' : 'link'} is valid for 15 minutes.
              </div>
            </>
          )}
        </div>

        {/* Back to Login */}
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

export default ForgotPassword;
