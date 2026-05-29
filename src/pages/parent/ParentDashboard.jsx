import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { apiRequirements, apiDemos, apiMessages } from '../../services/api';
import { BookMarked, PlayCircle, PlusCircle, ArrowRight, User, Users, MessageCircle, Clock, Search } from 'lucide-react';

const ParentDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeRequirements: 0,
    upcomingDemos: 0,
    teacherMatches: 0,
    messagesCount: 0
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
        let matchesCount = 0;
        let messageCount = 0;

        try {
          const { data: reqData } = await apiRequirements.getByParent(user.id);
          reqCount = reqData?.filter(r => r.status === 'active')?.length || 0;
        } catch (e) { console.warn('Could not fetch requirements:', e.message); }

        try {
          const { data: demoData } = await apiDemos.getByUser(user.id, 'parent');
          upcomingList = demoData?.filter(d => ['pending', 'accepted'].includes(d.status)) || [];
          
          const uniqueTutors = new Set();
          (demoData || []).forEach(demo => {
            if (['confirmed', 'completed', 'hired'].includes(demo.status) && demo.tutor_id) {
              uniqueTutors.add(demo.tutor_id);
            }
          });
          matchesCount = uniqueTutors.size;
        } catch (e) { console.warn('Could not fetch demos:', e.message); }

        try {
          const contacts = await apiMessages.getContacts(user.id);
          messageCount = contacts?.length || 0;
        } catch (e) { console.warn('Could not fetch contacts:', e.message); }
        
        setStats({
          activeRequirements: reqCount,
          upcomingDemos: upcomingList.length,
          teacherMatches: matchesCount,
          messagesCount: messageCount
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Good morning, {firstName}! 👋</h1>
            <p className="text-slate-500 text-base">
              Let's find the best teacher for your child.
            </p>
          </div>
          <button 
            onClick={() => navigate('/parent/post-requirement')}
            className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <PlusCircle size={18} /> Post Requirement
          </button>
        </div>

        {/* Stats Row */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">Active Requirements</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.activeRequirements}</h3>
              <button onClick={() => navigate('/parent/post-requirement')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">Upcoming Demos</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.upcomingDemos}</h3>
              <button onClick={() => navigate('/parent/demos')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">Teacher Matches</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.teacherMatches}</h3>
              <button onClick={() => navigate('/parent/matches')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">Messages</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.messagesCount}</h3>
              <button onClick={() => navigate('/parent/messages')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Upcoming Demos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Upcoming Demo</h2>
            
            {loading ? (
               <div className="h-32 bg-slate-50 rounded-lg animate-pulse"></div>
            ) : recentDemos.length > 0 ? (
              <div className="space-y-4">
                {recentDemos.slice(0, 1).map((demo) => (
                  <div key={demo.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{demo.tutor_profiles?.name || 'Tutor'}</p>
                        <p className="text-[13px] text-slate-500 font-medium">Maths Tutor • 6 Yrs Exp</p>
                        <p className="text-[13px] font-semibold text-slate-700 mt-1 flex items-center gap-1.5">
                          <Clock size={14} className="text-slate-400" />
                          {demo.scheduled_at 
                            ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(demo.scheduled_at))
                            : 'Waiting to schedule'}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => navigate('/parent/demos')} className="bg-[#0b5ed7] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors shadow-sm shrink-0">
                      View Demo
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <PlayCircle size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600 font-medium text-sm">No upcoming demos</p>
                <button onClick={() => navigate('/search')} className="mt-3 text-sm font-semibold text-[#0b5ed7] hover:underline">
                  Find a teacher to request one
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/parent/post-requirement')}
                className="w-full flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 hover:border-[#0b5ed7] transition-colors"
              >
                <PlusCircle size={20} className="text-[#0b5ed7]" />
                <span className="font-semibold text-slate-700 text-sm">Post New Requirement</span>
              </button>
              <button 
                onClick={() => navigate('/search')}
                className="w-full flex items-center gap-3 p-3.5 rounded-lg border border-slate-200 hover:border-[#0b5ed7] transition-colors"
              >
                <Search size={20} className="text-[#0b5ed7]" />
                <span className="font-semibold text-slate-700 text-sm">Find Teachers</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
