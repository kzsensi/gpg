import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo.png';

const TopNavigation = () => {
  const navigate = useNavigate();
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
  const dashboardPath = role === 'parent' ? '/parent/dashboard' : (role === 'admin' ? '/admin/dashboard' : '/tutor/dashboard');
  const roleLabel = role === 'parent' ? 'Parent' : (role === 'admin' ? 'Admin' : 'Tutor');

  const closeMenu = () => setMobileMenuOpen(false);

  const navLinks = [];
  if (!role || role === 'parent') {
    navLinks.push({ label: 'Find a Teacher', path: '/search' });
    navLinks.push({ label: 'Post Requirement', path: '/parent/post-requirement' });
  } else if (role === 'tutor') {
    navLinks.push({ label: 'Go to Dashboard', path: '/tutor/dashboard' });
  } else if (role === 'admin') {
    navLinks.push({ label: 'Go to Dashboard', path: '/admin/dashboard' });
  }

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 relative">
          
          {/* Logo (Starts from left side on all screens) */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer z-10 shrink-0" 
            onClick={() => { closeMenu(); navigate('/'); }}
          >
            <img src={logoImg} alt="GharPeGyan Logo" style={{ height: '36px', width: 'auto', maxWidth: '200px' }} className="object-contain" />
          </div>

          {/* Center Links (Desktop only) */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link, idx) => (
              <button 
                key={idx}
                onClick={() => navigate(link.path)} 
                className="text-slate-600 hover:text-[#0b5ed7] font-semibold text-[15px] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side container (Desktop Auth / Mobile Hamburger) */}
          <div className="flex items-center gap-4 z-10">
            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate(dashboardPath)}
                    className="flex items-center gap-2 text-slate-700 font-medium px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm cursor-pointer"
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>

                  <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm overflow-hidden border border-slate-200">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initial
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-none">{displayName}</p>
                      <p className="text-[12px] text-slate-500 font-medium mt-1">{roleLabel}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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

            {/* Mobile Menu Button (Right side on mobile) */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link, idx) => (
              <button 
                key={idx}
                onClick={() => { closeMenu(); navigate(link.path); }} 
                className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0b5ed7] rounded-lg"
              >
                {link.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <>
                <div className="h-px bg-slate-100 my-2"></div>
                <button
                  onClick={() => { closeMenu(); navigate(dashboardPath); }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
                <button
                  onClick={() => { closeMenu(); handleLogout(); }}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-slate-100 my-2"></div>
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
