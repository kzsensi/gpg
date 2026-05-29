import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  PlusCircle,
  PlayCircle,
  LogOut,
  GraduationCap,
  Search,
  MessageCircle,
  HelpCircle,
  Settings,
  Users,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo.png';

const menuItems = [
  { label: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
  { label: 'My Requirements', path: '/parent/requirements', icon: PlusCircle },
  { label: 'Find Teachers', path: '/search', icon: Search },
  { label: 'Teacher Matches', path: '/parent/matches', icon: Users },
  { label: 'Upcoming Demos', path: '/parent/demos', icon: PlayCircle },
  { label: 'Messages', path: '/parent/messages', icon: MessageCircle },
  { label: 'Payment History', path: '/parent/payments', icon: CreditCard, disabled: true },
  { label: 'Help & Support', path: '/help', icon: HelpCircle },
];

const ParentSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut();
      window.location.href = '/';
    }
  };

  const displayName = user?.user_metadata?.name || 'New Parent';
  const displayEmail = user?.email || 'No email';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Logo */}
      <div
        className="flex items-center justify-start px-6 py-5 cursor-pointer border-b border-slate-100"
        onClick={() => navigate('/')}
      >
        <img src={logoImg} alt="GharPeGyan Logo" className="h-[64px] translate-y-[3px] object-contain" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (!item.disabled) navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-[#0b5ed7]'
                  : item.disabled
                  ? 'text-slate-400 cursor-not-allowed opacity-60'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User card + Logout */}
      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <LogOut size={18} strokeWidth={2} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ParentSidebar;
