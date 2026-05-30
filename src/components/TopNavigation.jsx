import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, Menu, X, HelpCircle,
  PlusCircle, Search, Users, PlayCircle, MessageCircle,
  User, Briefcase, Star, Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo.png';

const parentLinks = [
  { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'My Requirements', path: '/parent/requirements', icon: PlusCircle },
  { label: 'Find Teachers', path: '/search', icon: Search },
  { label: 'Teacher Matches', path: '/parent/matches', icon: Users },
  { label: 'Upcoming Demos', path: '/parent/demos', icon: PlayCircle },
  { label: 'Messages', path: '/parent/messages', icon: MessageCircle },
];

const tutorLinks = [
  { label: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/tutor/profile', icon: User },
  { label: 'My Leads', path: '/tutor/leads', icon: Briefcase },
  { label: 'Demo Sessions', path: '/tutor/demos', icon: PlayCircle },
  { label: 'My Students', path: '/tutor/students', icon: Users },
  { label: 'Messages', path: '/tutor/messages', icon: MessageCircle },
  { label: 'Reviews', path: '/tutor/reviews', icon: Star },
  { label: 'Availability', path: '/tutor/availability', icon: Clock },
];

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
];

const TopNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut();
      window.location.href = '/';
    }
  };

  const displayName = user?.user_metadata?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.photo_url || '';
  const roleLabel = role === 'parent' ? 'Parent' : (role === 'admin' ? 'Admin' : 'Tutor');

  const closeMenu = () => setMobileMenuOpen(false);

  // Pick the right link set based on role
  const navLinks = role === 'tutor' ? tutorLinks
    : role === 'admin' ? adminLinks
    : role === 'parent' ? parentLinks
    : [];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => { closeMenu(); navigate('/'); }}
          >
            <img src={logoImg} alt="GharPeGyan Logo" style={{ height: '36px', width: 'auto', maxWidth: '200px' }} className="object-contain" />
          </div>

          {/* === Desktop Navigation === */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center mx-6">
            {isAuthenticated && navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'text-[#0b5ed7] bg-blue-50'
                      : 'text-slate-600 hover:text-[#0b5ed7] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* === Desktop Right Section === */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <>
                {/* Help icon */}
                <button
                  onClick={() => navigate('/help')}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    isActive('/help')
                      ? 'text-[#0b5ed7] bg-blue-50'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Help & Support"
                >
                  <HelpCircle size={20} />
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-slate-200" />

                {/* User avatar + name */}
                <div
                  className="flex items-center gap-2.5 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
                  onClick={() => navigate(
                    role === 'parent' ? '/parent/dashboard' :
                    role === 'admin' ? '/admin/dashboard' :
                    '/tutor/dashboard'
                  )}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm overflow-hidden border border-slate-200">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-sm font-bold text-slate-900 leading-none">{displayName}</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{roleLabel}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm cursor-pointer"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* === Mobile Hamburger === */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* === Mobile Menu Dropdown === */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg z-50" style={{ maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
          <div className="px-4 py-3 space-y-1">

            {/* If logged in, show user info at top */}
            {isAuthenticated && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm overflow-hidden border border-slate-200">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initial
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{displayName}</p>
                  <p className="text-[12px] text-slate-500 font-medium">{roleLabel}</p>
                </div>
              </div>
            )}

            {/* Navigation links */}
            {isAuthenticated && navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => { closeMenu(); navigate(link.path); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-blue-50 text-[#0b5ed7]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b5ed7]'
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                  {link.label}
                </button>
              );
            })}

            {/* Help & Support for logged-in users */}
            {isAuthenticated && (
              <>
                <button
                  onClick={() => { closeMenu(); navigate('/help'); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium rounded-lg transition-colors ${
                    isActive('/help')
                      ? 'bg-blue-50 text-[#0b5ed7]'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#0b5ed7]'
                  }`}
                >
                  <HelpCircle size={18} strokeWidth={isActive('/help') ? 2.5 : 2} />
                  Help & Support
                </button>

                <div className="h-px bg-slate-100 my-2" />

                <button
                  onClick={() => { closeMenu(); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}

            {/* Not logged in — just show Login */}
            {!isAuthenticated && (
              <>
                <button
                  onClick={() => { closeMenu(); navigate('/login'); }}
                  className="block w-full text-center px-4 py-3 text-base font-bold text-white bg-[#0b5ed7] rounded-lg"
                >
                  Login / Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNavigation;
