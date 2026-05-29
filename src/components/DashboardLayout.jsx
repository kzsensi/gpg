import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import ParentSidebar from './ParentSidebar';
import TutorSidebar from './TutorSidebar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../contexts/AuthContext';
import logoImg from '../assets/logo.png';

const DashboardLayout = ({ children, type = 'parent' }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile } = useAuth();

  const Sidebar = type === 'parent' ? ParentSidebar : (type === 'admin' ? AdminSidebar : TutorSidebar);

  // Get the display name based on role
  let displayName = 'User';
  if (type === 'parent') {
    // Parents store their name in user_metadata
    displayName = user?.user_metadata?.name || 'New Parent';
  } else if (type === 'admin') {
    displayName = user?.user_metadata?.name || 'Administrator';
  } else {
    // Tutors store their name in the tutor_profiles table (which AuthContext loads into 'profile')
    displayName = profile?.name || user?.user_metadata?.name || 'New Tutor';
  }

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : (type === 'parent' ? 'P' : (type === 'admin' ? 'A' : 'T'));
  };

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.photo_url || profile?.photo_url || '';

  return (
    <div className="flex h-screen bg-[#f8f9fb] overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-shrink-0">
        <div className="w-64 fixed h-full z-30">
          <Sidebar />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 h-full shadow-2xl" style={{ animation: 'slideIn 0.25s ease-out' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 z-50 text-slate-500 hover:text-slate-900 bg-white rounded-full p-1 shadow"
            >
              <X size={20} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-20">
          {/* Mobile logo on left */}
          <div
            className="lg:hidden flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => navigate('/')}
          >
            <img src={logoImg} alt="GharPeGyan Logo" style={{ height: '36px', width: 'auto', maxWidth: '200px' }} className="object-contain" />
          </div>

          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <button
              onClick={() => {
                if (type === 'admin') navigate('/admin/dashboard');
                else navigate(type === 'parent' ? '/parent/profile' : '/tutor/profile');
              }}
              className="flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors text-left"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight capitalize">{type}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md flex-shrink-0 overflow-hidden border border-slate-200">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  getInitial(displayName)
                )}
              </div>
            </button>

            {/* Mobile hamburger on the right */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="page-enter max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
