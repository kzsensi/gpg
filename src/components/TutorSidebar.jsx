import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  PlayCircle,
  Users,
  IndianRupee,
  MessageCircle,
  Star,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiDemos } from '../services/api';
import logoImg from '../assets/logo.png';

const menuItems = [
  { label: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/tutor/profile', icon: User },
  { label: 'My Leads', path: '/tutor/leads', icon: Briefcase },
  { label: 'Demo Sessions', path: '/tutor/demos', icon: PlayCircle },
  { label: 'My Students', path: '/tutor/students', icon: Users },
  { label: 'Earnings', path: '/tutor/earnings', icon: IndianRupee, disabled: true },
  { label: 'Messages', path: '/tutor/messages', icon: MessageCircle },
  { label: 'Reviews', path: '/tutor/reviews', icon: Star },
  { label: 'Availability', path: '/tutor/availability', icon: Clock },
  { label: 'Help & Support', path: '/help', icon: HelpCircle },
];

const TutorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const [pendingDemosCount, setPendingDemosCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const fetchPendingDemos = async () => {
      try {
        const { data: demos } = await apiDemos.getByUser(user.id, 'tutor');
        const pending = demos?.filter(d => d.status === 'pending').length || 0;
        setPendingDemosCount(pending);
      } catch (err) {
        console.error('Error fetching demos in sidebar', err);
      }
    };
    fetchPendingDemos();
  }, [user]);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await signOut();
      window.location.href = '/';
    }
  };

  const displayName = profile?.name || user?.user_metadata?.name || 'Aman Kumar';
  const displayEmail = user?.email || 'Tutor';
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
          const isDemo = item.path === '/tutor/demos';
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
              <div className="relative">
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {isDemo && pendingDemosCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                )}
              </div>
              <span>{item.label}</span>
              {isDemo && pendingDemosCount > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {pendingDemosCount} New
                </span>
              )}
              {item.disabled && (
                <span className="ml-auto bg-slate-100 text-slate-500 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Soon
                </span>
              )}
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

export default TutorSidebar;
