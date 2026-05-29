import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiDemos } from '../../services/api';
import { PlayCircle, Clock, CheckCircle2, Calendar, MapPin, Video, X, User, Star, AlertCircle } from 'lucide-react';
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
};

const statusConfig = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  accepted: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={14} /> },
  completed: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: <CheckCircle2 size={14} /> },
  declined: { label: 'Declined', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: <X size={14} /> },
};

const DemoRequests = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchDemos();
  }, [user]);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const { data } = await apiDemos.getByUser(user.id, 'parent');
      setDemos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (demoId, newStatus) => {
    try {
      await apiDemos.updateStatus(demoId, newStatus);
      fetchDemos();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const filtered = filter === 'all' 
    ? demos 
    : demos.filter(d => (d.status === 'accepted' ? 'confirmed' : d.status) === filter);

  return (
    <DashboardLayout type="parent">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Demo Requests</h1>
            <p className="text-slate-500 font-medium">Manage your scheduled demo sessions with tutors.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'all', label: 'All' }, { key: 'pending', label: 'Pending' }, { key: 'confirmed', label: 'Confirmed' }, { key: 'completed', label: 'Completed' }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === tab.key ? 'bg-[#0b5ed7] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-[#0b5ed7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading your demo requests...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((demo) => {
              const st = statusConfig[demo.status] || statusConfig.pending;
              const tutorName = demo.tutor_profiles?.name || 'Tutor';
              const createdDate = new Date(demo.created_at);
              
              return (
                <div key={demo.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl">
                        {tutorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{tutorName}</h3>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                          <MapPin size={12} /> {demo.tutor_profiles?.city || 'Remote'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase">Requested On</div>
                        <div className="text-sm font-bold text-slate-900">{formatDate(createdDate)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`${st.bg} ${st.text} ${st.border} border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>

                  {demo.status !== 'completed' && demo.status !== 'declined' && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                      {(demo.status === 'confirmed' || demo.status === 'accepted') && (
                        <div className="flex flex-col gap-1">
                          {demo.meeting_link ? (
                            <a href={demo.meeting_link} target="_blank" rel="noreferrer" className="bg-[#0b5ed7] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                              <Video size={16} /> Join Session
                            </a>
                          ) : (
                            <button disabled className="bg-slate-200 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                              <Video size={16} /> Awaiting Link
                            </button>
                          )}
                        </div>
                      )}
                      
                      {demo.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(demo.id, 'declined')}
                          className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2 transition-colors"
                        >
                          <X size={14} /> Cancel Request
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <PlayCircle size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No demos found</h3>
            <p className="text-slate-500 font-medium">No demo requests match this filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DemoRequests;
