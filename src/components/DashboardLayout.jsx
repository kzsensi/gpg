import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, X, GraduationCap, Search } from 'lucide-react';
import ParentSidebar from './ParentSidebar';
import TutorSidebar from './TutorSidebar';

const DashboardLayout = ({ children, type = 'parent' }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = type === 'parent' ? ParentSidebar : TutorSidebar;

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
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu size={22} />
            </button>

            {/* Mobile logo */}
            <div
              className="lg:hidden flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                <GraduationCap size={18} />
              </div>
              <span className="font-bold text-lg text-slate-900">GharPeGyan</span>
            </div>

            {/* Search bar (desktop) */}
            <div className="hidden md:flex items-center bg-slate-50 rounded-xl px-4 py-2 w-80 border border-slate-200 focus-within:border-[#0b5ed7] focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <Search size={16} className="text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search teachers, requirements..."
                className="bg-transparent outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={() => navigate(type === 'parent' ? '/parent/notifications' : '/tutor/notifications')}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white notification-badge" />
            </button>

            {/* User Avatar */}
            <button
              onClick={() => navigate(type === 'parent' ? '/parent/profile' : '/tutor/profile-builder')}
              className="flex items-center gap-2.5 pl-3 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {type === 'parent' ? 'Pooja S.' : 'Tutor'}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight capitalize">{type}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {type === 'parent' ? 'P' : 'T'}
              </div>
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
