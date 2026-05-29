import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { apiRequirements, apiDemos } from '../../services/api';
import { BookMarked, PlayCircle, PlusCircle, ArrowRight, User } from 'lucide-react';

const ParentDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeRequirements: 0,
    upcomingDemos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentDemos, setRecentDemos] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        setLoading(true);
        let reqCount = 0;
        let upcomingList = [];

        try {
          const { data: reqData } = await apiRequirements.getByParent(user.id);
          reqCount = reqData?.filter(r => r.status === 'active')?.length || 0;
        } catch (e) { console.warn('Could not fetch requirements:', e.message); }

        try {
          const { data: demoData } = await apiDemos.getByUser(user.id, 'parent');
          upcomingList = demoData?.filter(d => ['pending', 'accepted'].includes(d.status)) || [];
        } catch (e) { console.warn('Could not fetch demos:', e.message); }
        
        setStats({
          activeRequirements: reqCount,
          upcomingDemos: upcomingList.length
        });
        
        setRecentDemos(upcomingList.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Parent';

  return (
    <DashboardLayout type="parent">
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#0b5ed7] to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/3"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Manage your tuition requirements and upcoming demo classes all in one place.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#0b5ed7] shrink-0">
                <BookMarked size={28} />
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Active Requirements</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.activeRequirements}</h3>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <PlayCircle size={28} />
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Upcoming Demos</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.upcomingDemos}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions & Recent Demos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Upcoming Demo Classes</h2>
                <button onClick={() => navigate('/parent/demos')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                  View All
                </button>
              </div>
              
              {loading ? (
                 <div className="space-y-4">
                   <div className="h-20 bg-slate-50 rounded-xl"></div>
                   <div className="h-20 bg-slate-50 rounded-xl"></div>
                 </div>
              ) : recentDemos.length > 0 ? (
                <div className="space-y-4">
                  {recentDemos.map((demo) => (
                    <div key={demo.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{demo.tutor_profiles?.name || 'Tutor'}</p>
                          <p className="text-sm text-slate-500">
                            {demo.scheduled_at 
                              ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(demo.scheduled_at))
                              : 'Waiting for tutor to schedule'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        demo.status === 'accepted' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {demo.status === 'accepted' ? 'Scheduled' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <PlayCircle size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No upcoming demos</p>
                  <button onClick={() => navigate('/search')} className="mt-4 text-sm font-semibold text-[#0b5ed7] hover:underline">
                    Find a tutor to request one
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/parent/post-requirement')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#0b5ed7] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0b5ed7] flex items-center justify-center">
                      <PlusCircle size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">Post Requirement</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-[#0b5ed7] transition-transform group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => navigate('/search')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">Find Teachers</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
