import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  GraduationCap,
  Mail,
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
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || null;
  const { signIn, signUp, authError, setAuthError, role: userRole, isAuthenticated } = useAuth();

  // Redirect logged-in users to their correct dashboard automatically once role is resolved
  React.useEffect(() => {
    if (isAuthenticated && userRole) {
      const destination = redirectTo || (
        userRole === 'admin' ? '/admin/dashboard' :
        userRole === 'tutor' ? '/tutor/dashboard' :
        '/parent/dashboard'
      );
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, userRole, navigate, redirectTo]);
  
  const [activeTab, setActiveTab] = useState('login');
  const [role, setRole] = useState('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (authError) setAuthError(null); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    // Basic Validation
    if (!formData.email || !formData.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'signup') {
        if (!formData.name) {
          setAuthError('Please enter your full name.');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setAuthError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setAuthError('Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        
        // Call real Supabase Auth
        const { data, error } = await signUp(formData.email, formData.password, role, formData.name);
        
        if (!error) {
          // Signup successful. Supabase sends an email confirmation.
          // We redirect to the OTP verification page for them to enter the code or wait for link click.
          navigate('/otp-verify', {
            state: {
              role,
              contact: formData.email, // Passing email instead of phone
            },
          });
        }
      } else {
        // Login flow
        const { data, error } = await signIn(formData.email, formData.password);
        
        if (!error && data?.user) {
          // No need to navigate here directly. The useEffect above will detect
          // the session change, wait for AuthContext to resolve the role, and
          // redirect the user to the correct dashboard.
        }
      }
    } catch (err) {
      setAuthError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
            className="flex bg-slate-100 rounded-xl p-1 mb-6"
            style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}
          >
            {['login', 'signup'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setAuthError(null);
                }}
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

          {/* Error Message Display */}
          {authError && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
              <AlertCircle size={18} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-red-800 leading-tight">{authError}</p>
            </div>
          )}

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
                  id: 'tutor',
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

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
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
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>

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
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group ${
                loading ? 'opacity-70 cursor-wait' : 'shadow-lg hover:shadow-xl'
              }`}
              style={{
                background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
              }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          {/* Terms */}
          {activeTab === 'signup' && (
            <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-[#0b5ed7] hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link to="/privacy" className="text-[#0b5ed7] hover:underline font-medium">
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
                  onClick={() => {
                    setActiveTab('signup');
                    setAuthError(null);
                  }}
                  className="text-[#0b5ed7] font-semibold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setAuthError(null);
                  }}
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
