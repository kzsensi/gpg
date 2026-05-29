import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TopNavigation = () => {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const displayName = user?.user_metadata?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const dashboardPath = role === 'parent' ? '/parent/dashboard' : (role === 'admin' ? '/admin/dashboard' : '/tutor/dashboard');
  const roleLabel = role === 'parent' ? 'Parent' : (role === 'admin' ? 'Admin' : 'Tutor');

  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-[#0b5ed7] to-indigo-600 text-white p-2 rounded-xl shadow-md">
              <GraduationCap size={22} />
            </div>
            <span className="font-sans font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              GharPeGyan
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Dashboard button */}
                <button
                  onClick={() => navigate(dashboardPath)}
                  className="hidden sm:flex items-center gap-2 text-slate-700 font-medium px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </button>

                {/* User avatar + name */}
                <div className="flex items-center gap-2.5 pl-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {initial}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{roleLabel}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-[#0b5ed7] to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
