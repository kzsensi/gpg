import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  PlayCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
  { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Manage Tutors', path: '/admin/tutors', icon: GraduationCap },
  { label: 'Parents & Requests', path: '/admin/parents', icon: Users },
  { label: 'Demo Bookings', path: '/admin/demos', icon: PlayCircle },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    await signOut();
    // Force a full page navigation to clear any cached React state
    window.location.href = '/';
  };

  const displayName = user?.user_metadata?.name || 'Administrator';
  const displayEmail = user?.email || 'admin@gharpegyan.com';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5 cursor-pointer border-b border-slate-800/50"
        onClick={() => navigate('/')}
      >
        <div className="bg-indigo-500 text-white p-2 rounded-xl shadow-md">
          <ShieldCheck size={22} />
        </div>
        <span className="font-sans font-bold text-xl text-white tracking-tight">
          Admin Panel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">
          Management
        </div>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
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
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-inner">
              {initial}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          <span>Secure Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
