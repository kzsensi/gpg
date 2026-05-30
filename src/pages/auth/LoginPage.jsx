import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
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

    const emailClean = formData.email.trim().toLowerCase();

    // Basic Validation
    if (!emailClean || !formData.password) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
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
        
        // Call real Supabase Auth with sanitized email
        const { data, error } = await signUp(emailClean, formData.password, role, formData.name);
        
        if (!error) {
          // Signup successful. Supabase sends an email confirmation.
          // We redirect to the OTP verification page for them to enter the code or wait for link click.
          navigate('/otp-verify', {
            state: {
              role,
              contact: emailClean, // Passing sanitized email
            },
          });
        }
      } else {
        // Login flow: try exact casing (trimmed) first, fallback to lowercase if it fails and email had uppercase.
        const emailTrimmed = formData.email.trim();
        let { data, error } = await signIn(emailTrimmed, formData.password);
        
        if (error && emailTrimmed !== emailClean) {
          console.log("Login with exact casing failed. Retrying with lowercase email...");
          const retry = await signIn(emailClean, formData.password);
          if (!retry.error) {
            data = retry.data;
            error = null;
            setAuthError(null);
          }
        }
        
        if (!error && data?.user) {
          // Validate the user's actual role against the selected role on the form
          const userMeta = data.user.user_metadata;
          const actualRole = userMeta?.role;

          // Check if there's a tutor_profiles row for this user (the authoritative source)
          let hasTutorProfile = false;
          try {
            const { data: tp } = await supabase
              .from('tutor_profiles')
              .select('user_id')
              .eq('user_id', data.user.id)
              .maybeSingle();
            if (tp) hasTutorProfile = true;
          } catch (_) {}

          const isActuallyTutor = hasTutorProfile || actualRole === 'tutor';
          const isActuallyParent = !isActuallyTutor && (actualRole === 'parent' || !actualRole);
          const isAdmin = actualRole === 'admin' || data.user.app_metadata?.role === 'admin';

          // Admins can log in from any tab
          if (!isAdmin) {
            if (role === 'parent' && isActuallyTutor) {
              // Tutor trying to log in via parent section
              await supabase.auth.signOut({ scope: 'local' });
              setAuthError('This account is registered as a Teacher. Please select "Teacher / Tutor" and try again.');
              setLoading(false);
              return;
            }
            if (role === 'tutor' && isActuallyParent) {
              // Parent trying to log in via tutor section
              await supabase.auth.signOut({ scope: 'local' });
              setAuthError('This account is registered as a Parent. Please select "Parent / Student" and try again.');
              setLoading(false);
              return;
            }
          }
          // Role matches — the useEffect above will detect the session and redirect.
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
        style={{ background: '#f1f5f9' }}
      >
        {/* Subtle dot-grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center mb-14">
            <img src={logoImg} alt="GharPeGyan Logo" style={{ height: '48px', width: 'auto', maxWidth: '200px' }} className="object-contain" />
          </div>

          <h1
            className="text-4xl xl:text-[42px] font-bold text-slate-900 leading-tight mb-5"
            style={{ lineHeight: '1.2', fontFamily: 'inherit' }}
          >
            Quality Education,
            <br />
            Right at Your
            <br />
            <span style={{ color: '#0b5ed7' }}>Doorstep.</span>
          </h1>

          <p className="text-slate-500 text-base leading-relaxed mb-10 max-w-sm">
            Connect with expert home tutors in your neighbourhood for personalised, one-on-one learning.
          </p>

          <div className="space-y-3.5">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="p-1.5 rounded-lg"
                  style={{ background: '#e0edff' }}
                >
                  <f.icon size={16} style={{ color: '#0b5ed7' }} />
                </div>
                <span className="text-slate-700 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
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
                <img src={logoImg} alt="GharPeGyan Logo" style={{ height: '32px', width: 'auto', maxWidth: '160px' }} className="object-contain" />
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
                background: '#0b5ed7',
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
