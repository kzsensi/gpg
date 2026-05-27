import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User, ArrowRight } from 'lucide-react';

const TopNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md">
              <GraduationCap size={24} />
            </div>
            <span className="font-sans font-bold text-2xl text-slate-900 tracking-tight">
              GharPeGyan
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-slate-700 text-[15px]">
            <button onClick={() => navigate('/')} className={`transition-colors ${location.pathname === '/' ? 'text-[#0b5ed7] font-semibold border-b-2 border-[#0b5ed7] pb-1' : 'hover:text-[#0b5ed7]'}`}>Home</button>
            <button onClick={() => navigate('/search')} className={`transition-colors ${isActive('/search') ? 'text-[#0b5ed7] font-semibold border-b-2 border-[#0b5ed7] pb-1' : 'hover:text-[#0b5ed7]'}`}>Find Teachers</button>
            <button onClick={() => navigate('/parent/dashboard')} className={`transition-colors ${isActive('/parent') ? 'text-[#0b5ed7] font-semibold border-b-2 border-[#0b5ed7] pb-1' : 'hover:text-[#0b5ed7]'}`}>My Dashboard</button>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => navigate('/tutor/dashboard')} className="hidden lg:flex items-center gap-2 text-slate-700 font-medium px-4 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
              <User size={18} /> Tutor Panel
            </button>
            <button onClick={() => navigate('/login')} className="bg-[#0b5ed7] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 text-sm shadow-md">
              Login <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavigation;
