import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiDemos } from '../../services/api';
import { MessageCircle, Star, Calendar, Users, MapPin, IndianRupee } from 'lucide-react';

const ParentMatches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const { data: demos } = await apiDemos.getByUser(user.id, 'parent');
        
        // Filter out pending and rejected demos
        const activeDemos = (demos || []).filter(d => d.status === 'confirmed' || d.status === 'completed' || d.status === 'hired');
        
        // Extract unique tutors
        const uniqueTutors = new Map();
        activeDemos.forEach(demo => {
          if (demo.tutor_profiles && !uniqueTutors.has(demo.tutor_id)) {
            uniqueTutors.set(demo.tutor_id, {
              tutor: demo.tutor_profiles,
              tutor_user_id: demo.tutor_id,
              demoStatus: demo.status,
              demoId: demo.id
            });
          }
        });
        
        setMatches(Array.from(uniqueTutors.values()));
      } catch (err) {
        console.error(err);
        setError('Failed to load your teacher matches.');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchMatches();
  }, [user]);

  return (
    <DashboardLayout role="parent">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-gradient-to-br from-[#0b5ed7] to-indigo-600 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Your Teacher Matches</h1>
            <p className="text-blue-100 font-medium max-w-xl text-sm md:text-base leading-relaxed">
              Here are the teachers you have hired or taken a demo with. You can message them, review them, or schedule your next classes directly from here.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {matches.map(({ tutor, tutor_user_id, demoStatus }) => (
              <div key={tutor_user_id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="shrink-0 flex justify-center">
                  {tutor.photo_url ? (
                    <img src={tutor.photo_url} alt={tutor.name} className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-sm border-2 border-white" />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-sm border-2 border-white">
                      {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 cursor-pointer hover:text-[#0b5ed7] transition-colors" onClick={() => navigate(`/teacher/${tutor_user_id}`)}>{tutor.name}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-[#0b5ed7] bg-blue-50 px-2 py-0.5 rounded-md">
                          {tutor.subjects?.[0] || 'Tutor'}
                        </span>
                        {demoStatus === 'hired' ? (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            Hired
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                            Demo Taken
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mt-2 mb-4">
                    <span className="flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> {tutor.city || 'Online'}</span>
                    <span className="flex items-center gap-1"><IndianRupee size={14} className="text-slate-400" /> ₹{tutor.hourly_rate || 'N/A'}/hr</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-auto">
                    <button 
                      onClick={() => navigate(`/parent/messages`)}
                      className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[#0b5ed7] text-white px-4 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                    >
                      <MessageCircle size={16} /> Message
                    </button>
                    <button 
                      onClick={() => navigate('/parent/demos')}
                      className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-sm text-sm"
                    >
                      <Star size={16} className="text-amber-500" /> Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm px-6">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Teacher Matches Yet</h3>
            <p className="text-slate-500 font-medium mb-6 max-w-md mx-auto">
              Once you book a demo or hire a teacher, they will appear here so you can message them or schedule classes.
            </p>
            <button 
              onClick={() => navigate('/search')}
              className="bg-[#0b5ed7] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md inline-flex items-center gap-2"
            >
              <Users size={18} /> Browse Teachers
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParentMatches;
