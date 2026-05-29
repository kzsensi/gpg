import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { apiRequirements, apiDemos } from '../../services/api';
import { Mail, PlayCircle, Users, Eye, Clock, MapPin, IndianRupee } from 'lucide-react';

const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    activeLeads: 0,
    upcomingDemos: 0,
    activeStudents: 8, // Placeholder
    profileViews: 128 // Placeholder
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState([]);
  const [pendingDemos, setPendingDemos] = useState([]);
  const [upcomingDemos, setUpcomingDemos] = useState([]);
  const [hiredStudents, setHiredStudents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        setLoading(true);
        let leadsResult = [];
        let demosData = [];

        try {
          const { data: leadsData } = await apiRequirements.getActiveLeads({ city: profile?.city });
          leadsResult = leadsData || [];
        } catch (e) { console.warn('Could not fetch leads:', e.message); }

        try {
          const { data: dData } = await apiDemos.getByUser(user.id, 'tutor');
          demosData = dData || [];
          
          setStats(prev => ({
            ...prev,
            activeLeads: leadsResult.length,
            upcomingDemos: demosData.filter(d => ['pending', 'confirmed'].includes(d.status)).length,
            activeStudents: demosData.filter(d => d.status === 'hired').length
          }));
        } catch (e) { console.warn('Could not fetch demos:', e.message); }
        
        setRecentLeads(leadsResult.slice(0, 3));
        setPendingDemos(demosData.filter(d => d.status === 'pending').slice(0, 3));
        setUpcomingDemos(demosData.filter(d => d.status === 'confirmed').slice(0, 3));
        setHiredStudents(demosData.filter(d => d.status === 'hired').slice(0, 3));
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
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Good morning, {firstName}! 👋</h1>
            <p className="text-slate-500 text-base">
              Here's what's happening with your teaching.
            </p>
          </div>
          <button 
            onClick={() => navigate('/tutor/profile')}
            className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm shrink-0"
          >
            View My Profile
          </button>
        </div>

        {/* Stats Row */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 mb-8 animate-pulse">
            {[1,2].map(i => <div key={i} className="h-28 bg-white border border-slate-200 rounded-xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">New Leads</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.activeLeads}</h3>
              <button onClick={() => navigate('/tutor/leads')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col">
              <p className="text-sm font-semibold text-slate-500 mb-2">Demo Sessions</p>
              <h3 className="text-3xl font-bold text-slate-900 mb-1">{stats.upcomingDemos}</h3>
              <button onClick={() => navigate('/tutor/demos')} className="text-xs font-semibold text-[#0b5ed7] hover:underline self-start mt-auto">View all</button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* New Tuition Leads */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">New Tuition Leads</h2>
              <button onClick={() => navigate('/tutor/leads')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                View all
              </button>
            </div>
            
            {loading ? (
               <div className="space-y-4">
                 {[1,2].map(i => <div key={i} className="h-24 bg-slate-50 rounded-lg animate-pulse"></div>)}
               </div>
            ) : recentLeads.length > 0 ? (
              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex gap-4 p-4 rounded-lg border border-slate-200 hover:border-blue-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0b5ed7] shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-slate-900 text-[15px]">{lead.class_level} • {lead.subjects?.[0] || 'All Subjects'}</p>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap ml-2">{timeAgo(lead.created_at)}</span>
                      </div>
                      <p className="text-[13px] text-slate-500 font-medium mb-1 flex items-center gap-1.5"><MapPin size={12} className="text-slate-400"/> {lead.area}, {lead.city} • {lead.mode}</p>
                      <p className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5"><IndianRupee size={12} className="text-slate-400"/> ₹{lead.min_budget} - ₹{lead.max_budget} / month</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <Mail size={32} className="mx-auto text-slate-400 mb-3" />
                <p className="text-slate-600 font-medium text-sm">No new leads in your area</p>
              </div>
            )}
          </div>

          {/* Pending Demos */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                Action Required: Pending Demos
              </h2>
              <button onClick={() => navigate('/tutor/demos')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                Manage
              </button>
            </div>
            
            {loading ? (
               <div className="space-y-4">
                 {[1,2].map(i => <div key={i} className="h-20 bg-white/50 rounded-lg animate-pulse border border-amber-100"></div>)}
               </div>
            ) : pendingDemos.length > 0 ? (
              <div className="space-y-4">
                {pendingDemos.map((demo) => {
                  const req = demo.parent_requirements || {};
                  const profile = demo.parent_profiles || {};
                  const parentNameMatch = demo.note?.match(/\[From:\s*(.*?)(?:\s*\|\s*For:.*?|)\]/);
                  const noteParent = parentNameMatch ? parentNameMatch[1].trim() : null;
                  const parentName = req.student_name ? `${req.student_name}'s Parent` : (profile.name || noteParent || 'Parent');
                  const cleanNote = demo.note ? demo.note.replace(/\[From:\s*.*?\]\s*/, '') : '';
                  const displayInfo = parentName !== 'Parent' ? `From ${parentName}` : (cleanNote ? `"${cleanNote}"` : 'From Parent');
                  return (
                  <div key={demo.id} className="flex gap-4 p-4 bg-white rounded-lg border border-amber-100 shadow-sm">
                     <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                       <PlayCircle size={18} />
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                         <p className="font-bold text-slate-900 text-[15px]">
                           New Demo Request
                         </p>
                         <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                           Pending
                         </span>
                       </div>
                       <p className="text-[13px] text-slate-600 font-medium mb-1 truncate max-w-[200px] sm:max-w-xs">{displayInfo}</p>
                     </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/50 rounded-lg border border-amber-100 border-dashed">
                <p className="text-slate-500 font-medium text-sm">No pending demo requests</p>
              </div>
            )}
          </div>

          {/* Upcoming Demos */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Demos (Confirmed)</h2>
              <button onClick={() => navigate('/tutor/demos')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                View all
              </button>
            </div>
            
            {loading ? (
               <div className="space-y-4">
                 {[1,2].map(i => <div key={i} className="h-20 bg-slate-50 rounded-lg animate-pulse"></div>)}
               </div>
            ) : upcomingDemos.length > 0 ? (
              <div className="space-y-4">
                {upcomingDemos.map((demo) => {
                  const req = demo.parent_requirements || {};
                  const parentName = req.student_name ? `${req.student_name}'s Parent` : 'Parent';
                  const displayInfo = parentName !== 'Parent' ? `With ${parentName}` : (demo.note ? `"${demo.note}"` : 'With Parent');
                  return (
                  <div key={demo.id} className="flex gap-4 p-4 rounded-lg border border-slate-200">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                       <PlayCircle size={18} />
                     </div>
                     <div className="flex-1">
                       <div className="flex justify-between items-start mb-1">
                         <p className="font-bold text-slate-900 text-[15px]">
                           {demo.scheduled_at ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(demo.scheduled_at)) : 'Scheduled'}
                         </p>
                         <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                           Confirmed
                         </span>
                       </div>
                       <p className="text-[13px] text-slate-500 font-medium mb-1 truncate max-w-[200px] sm:max-w-xs">{displayInfo}</p>
                     </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <PlayCircle size={28} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500 font-medium text-sm">No upcoming demos</p>
              </div>
            )}
          </div>

          {/* Hired Students */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">My Students</h2>
              <button onClick={() => navigate('/tutor/students')} className="text-sm font-semibold text-[#0b5ed7] hover:underline">
                View all students
              </button>
            </div>
            
            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {[1,2,3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-lg animate-pulse"></div>)}
               </div>
            ) : hiredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hiredStudents.map((student) => {
                  const req = student.parent_requirements || {};
                  const studentName = req.student_name || 'Student';
                  return (
                    <div key={student.id} className="flex gap-4 p-4 rounded-lg border border-emerald-100 bg-emerald-50/30">
                       <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold">
                         {studentName.charAt(0).toUpperCase()}
                       </div>
                       <div className="flex-1">
                         <h3 className="font-bold text-slate-900 text-[15px] truncate max-w-[150px]">{studentName}</h3>
                         <p className="text-[13px] text-slate-500 font-medium truncate max-w-[150px]">
                           {req.class_level ? `Class: ${req.class_level}` : (student.note ? `"${student.note}"` : 'Hired')}
                         </p>
                       </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                <Users size={28} className="mx-auto text-slate-400 mb-2" />
                <p className="text-slate-500 font-medium text-sm">You haven't been hired yet. Take more demos!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboard;
