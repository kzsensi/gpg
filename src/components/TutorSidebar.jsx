import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Mail,
  PlayCircle,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { label: 'Dashboard Home', path: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/tutor/profile', icon: User },
  { label: 'Lead Inbox', path: '/tutor/leads', icon: Mail },
  { label: 'Classes & Meetings', path: '/tutor/demos', icon: PlayCircle },
];

const TutorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut();
      // Force a full page navigation to clear any cached React state
      window.location.href = '/';
    }
  };

  const displayName = profile?.name || user?.user_metadata?.name || 'New Tutor';
  const displayEmail = user?.email || 'No email';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5 cursor-pointer border-b border-slate-100"
        onClick={() => navigate('/')}
      >
        <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
          <GraduationCap size={22} />
        </div>
        <span className="font-sans font-bold text-xl text-slate-900 tracking-tight">
          GharPeGyan
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-[#0b5ed7] text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User card + Logout */}
      <div className="px-3 pb-4 mt-auto">
        <div className="bg-slate-50 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              {initial}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
              <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TutorSidebar;
