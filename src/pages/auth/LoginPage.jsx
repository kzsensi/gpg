import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Users,
  BookOpen,
  Sparkles,
  Star,
  CheckCircle2,
  Shield,
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('parent');
  const [inputMethod, setInputMethod] = useState('phone');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/otp-verify', {
      state: {
        role,
        contact: inputMethod === 'phone' ? formData.phone : formData.email,
      },
    });
  };

  const handleGoogleLogin = () => {
    navigate(role === 'parent' ? '/parent/dashboard' : '/tutor/dashboard');
  };

  const features = [
    { icon: CheckCircle2, text: 'Verified & background-checked tutors' },
    { icon: Star, text: 'Personalised 1-on-1 home tutoring' },
    { icon: Shield, text: 'Safe & secure learning environment' },
    { icon: Sparkles, text: 'Track progress with smart reports' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafc' }}>
      {/* ── Left Branding Panel ── */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b5ed7 0%, #4f46e5 50%, #7c3aed 100%)',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'white' }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'white' }}
        />
        <div
          className="absolute top-1/2 right-10 w-32 h-32 rounded-full opacity-5"
          style={{ background: 'white' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <GraduationCap size={28} className="text-white" />
            </div>
            <span className="font-sans font-bold text-2xl text-white tracking-tight">
              GharPeGyan
            </span>
          </div>

          <h1
            className="font-serif text-4xl xl:text-[42px] font-bold text-white leading-tight mb-6"
            style={{ lineHeight: '1.2' }}
          >
            Quality Education,
            <br />
            Right at Your
            <br />
            <span className="text-amber-300">Doorstep.</span>
          </h1>

          <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-sm">
            Connect with expert tutors in your neighbourhood for personalised
            home tuition that transforms learning.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="bg-white/15 backdrop-blur-sm p-1.5 rounded-lg">
                  <f.icon size={16} className="text-amber-300" />
                </div>
                <span className="text-white/90 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badge */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex -space-x-2">
              {['bg-amber-400', 'bg-emerald-400', 'bg-rose-400', 'bg-blue-300'].map(
                (bg, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${bg} border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {['A', 'R', 'P', 'S'][i]}
                  </div>
                )
              )}
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-amber-300 fill-amber-300" />
              ))}
            </div>
          </div>
          <p className="text-white/90 text-sm">
            Trusted by <span className="font-bold text-white">10,000+</span> families across
            Delhi, Mumbai & Bengaluru
          </p>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative">
        <Link to="/" className="absolute top-6 left-6 hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors bg-white/50 backdrop-blur-sm p-2 pr-3 rounded-xl hover:bg-white shadow-sm border border-transparent hover:border-slate-200">
           <ArrowLeft size={18} /> <span>Back to Home</span>
        </Link>
        
        <div className="w-full max-w-[460px]">
          {/* Mobile back button & logo */}
          <div className="flex sm:hidden items-center justify-between mb-8">
            <Link to="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 bg-white rounded-full shadow-sm border border-slate-100">
                <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
                <div
                  className="p-1.5 rounded-lg shadow-sm text-white"
                  style={{ background: '#4f46e5' }}
                >
                  <GraduationCap size={18} />
                </div>
                <span className="font-sans font-bold text-lg text-slate-900 tracking-tight">
                  GharPeGyan
                </span>
            </div>
            <div className="w-9"></div>{/* Spacer for center alignment */}
          </div>

          {/* Tab Switcher */}
          <div
            className="flex bg-slate-100 rounded-xl p-1 mb-8"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
          >
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              {activeTab === 'login' ? 'Welcome back!' : 'Create your account'}
            </h2>
            <p className="text-slate-500 text-sm">
              {activeTab === 'login'
                ? 'Sign in to continue your learning journey'
                : 'Join thousands of families & tutors on GharPeGyan'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  id: 'parent',
                  label: 'Parent / Student',
                  icon: Users,
                  desc: 'Find tutors',
                  gradient: 'from-blue-50 to-indigo-50',
                  activeGradient: 'linear-gradient(135deg, #eff6ff, #eef2ff)',
                },
                {
                  id: 'teacher',
                  label: 'Teacher / Tutor',
                  icon: BookOpen,
                  desc: 'Start teaching',
                  gradient: 'from-emerald-50 to-teal-50',
                  activeGradient: 'linear-gradient(135deg, #ecfdf5, #f0fdfa)',
                },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 group ${
                    role === r.id
                      ? 'border-[#0b5ed7] shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                  style={role === r.id ? { background: r.activeGradient } : {}}
                >
                  {role === r.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2
                        size={18}
                        className="text-[#0b5ed7] fill-blue-100"
                      />
                    </div>
                  )}
                  <r.icon
                    size={22}
                    className={`mb-2 transition-colors ${
                      role === r.id ? 'text-[#0b5ed7]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <div
                    className={`font-semibold text-sm ${
                      role === r.id ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {r.label}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            )}

            {/* Input method toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {inputMethod === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setInputMethod(inputMethod === 'phone' ? 'email' : 'phone')
                  }
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                {activeTab === 'login' && (
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#0b5ed7] font-medium hover:underline"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (signup only) */}
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              style={{
                background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
              }}
            >
              {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">or continue with</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-sm hover:bg-slate-50 hover:shadow-sm transition-all duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </button>

          {/* Terms */}
          {activeTab === 'signup' && (
            <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-[#0b5ed7] hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link to="/terms" className="text-[#0b5ed7] hover:underline font-medium">
                Privacy Policy
              </Link>
            </p>
          )}

          {/* Switch prompt */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {activeTab === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-[#0b5ed7] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-[#0b5ed7] font-semibold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
