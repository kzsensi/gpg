import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { apiRequirements, apiDemos } from '../../services/api';
import { Mail, PlayCircle, Star, ArrowRight, User } from 'lucide-react';

const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeLeads: 0,
    upcomingDemos: 0,
    rating: profile?.rating || 0
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        setLoading(true);
        // Fetch leads (requirements from parents) — wrap in try/catch individually
        // so one failing doesn't block the other
        let leadsResult = [];
        let demosResult = [];

        try {
          const { data: leadsData } = await apiRequirements.getActiveLeads({ city: profile?.city });
          leadsResult = leadsData || [];
        } catch (e) { console.warn('Could not fetch leads:', e.message); }

        try {
          const { data: demoData } = await apiDemos.getByUser(user.id, 'tutor');
          demosResult = demoData?.filter(d => ['pending', 'accepted'].includes(d.status)) || [];
        } catch (e) { console.warn('Could not fetch demos:', e.message); }

        setStats(prev => ({
          ...prev,
          activeLeads: leadsResult.length,
          upcomingDemos: demosResult.length,
          rating: profile?.rating || 0
        }));
        
        setRecentLeads(leadsResult.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, profile]);

  const firstName = profile?.name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || 'Tutor';

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-5xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-br from-[#0b5ed7] to-teal-500 rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/3"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
            <p className="text-blue-100 max-w-xl text-lg">
              Here is your tutoring dashboard. Stay updated on new leads and manage your upcoming classes.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
            <div className="h-32 bg-slate-100 rounded-2xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Stat Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-[#0b5ed7] shrink-0">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">New Leads</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.activeLeads}</h3>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                <PlayCircle size={28} />
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Upcoming Demos</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.upcomingDemos}</h3>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                <Star size={28} />
              </div>
              <div>
                <p className="text-slate-500 font-medium mb-1">Your Rating</p>
                <h3 className="text-3xl font-bold text-slate-800">{stats.rating || 'N/A'}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions & Recent Leads */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Recent Leads</h2>
                <button onClick={() => navigate('/tutor/leads')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                  View All Leads
                </button>
              </div>
              
              {loading ? (
                 <div className="space-y-4">
                   <div className="h-20 bg-slate-50 rounded-xl"></div>
                   <div className="h-20 bg-slate-50 rounded-xl"></div>
                 </div>
              ) : recentLeads.length > 0 ? (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex flex-col p-4 rounded-xl border border-slate-100 hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">{lead.student_name} - {lead.class_level}</p>
                          <p className="text-sm text-slate-600 font-medium mt-1">
                            {lead.subjects?.join(', ') || 'Subjects not specified'}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          {lead.mode}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50">
                        <span className="text-sm font-semibold text-slate-800">
                          ₹{lead.min_budget} - ₹{lead.max_budget}/mo
                        </span>
                        <span className="text-xs text-slate-500">
                          {lead.city} • {lead.area}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <Mail size={40} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 font-medium">No new leads in your area</p>
                  <p className="text-sm text-slate-400 mt-1">Make sure your profile is complete to attract more students.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/tutor/leads')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#0b5ed7] hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#0b5ed7] flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">View Lead Inbox</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-[#0b5ed7] transition-transform group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => navigate('/tutor/demos')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                      <PlayCircle size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">Manage Demos</span>
                  </div>
                  <ArrowRight size={18} className="text-slate-400 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                </button>

                <button 
                  onClick={() => navigate('/tutor/profile')}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-slate-900">Edit My Profile</span>
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

export default TutorDashboard;
