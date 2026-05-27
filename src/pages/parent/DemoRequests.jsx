import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { PlayCircle, Clock, CheckCircle2, Calendar, MapPin, Video, X, User, Star } from 'lucide-react';

const demoData = [
  { id: 1, teacher: 'Rahul Sharma', subject: 'Physics', date: 'May 28, 2026', time: '5:00 PM', mode: 'Online (Google Meet)', status: 'confirmed', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&q=80', rating: 4.9 },
  { id: 2, teacher: 'Priya Sharma', subject: 'Mathematics', date: 'May 30, 2026', time: '4:00 PM', mode: 'Home Visit', status: 'pending', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80', rating: 4.8 },
  { id: 3, teacher: 'Amit Patel', subject: 'Chemistry', date: 'May 22, 2026', time: '6:00 PM', mode: 'Online (Zoom)', status: 'completed', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80', rating: 4.6 },
  { id: 4, teacher: 'Sneha Gupta', subject: 'English', date: 'May 20, 2026', time: '3:00 PM', mode: 'Online', status: 'completed', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', rating: 4.7 },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={14} /> },
  completed: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: <CheckCircle2 size={14} /> },
};

const DemoRequests = () => {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? demoData : demoData.filter(d => d.status === filter);

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

        <div className="space-y-4">
          {filtered.map((demo) => {
            const st = statusConfig[demo.status];
            return (
              <div key={demo.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-center">
                    <img src={demo.img} alt={demo.teacher} className="w-14 h-14 rounded-full object-cover border border-slate-100" />
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{demo.teacher}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1">
                        <Star size={12} className="fill-amber-400 text-amber-400" /> {demo.rating} • {demo.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Date</div>
                      <div className="text-sm font-bold text-slate-900">{demo.date}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Time</div>
                      <div className="text-sm font-bold text-slate-900">{demo.time}</div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Mode</div>
                      <div className="text-sm font-bold text-slate-900">{demo.mode}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`${st.bg} ${st.text} ${st.border} border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                      {st.icon} {st.label}
                    </span>
                  </div>
                </div>

                {demo.status !== 'completed' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                    {demo.status === 'confirmed' && (
                      <div className="flex flex-col gap-1">
                        <button disabled className="bg-slate-200 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                          <Video size={16} /> Join Session
                        </button>
                        <span className="text-[10px] text-slate-500 font-bold text-center">Link unlocks at scheduled time</span>
                      </div>
                    )}
                    <button className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                      <Calendar size={14} /> Reschedule
                    </button>
                    <button className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                      <X size={14} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
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
