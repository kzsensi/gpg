import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { PlayCircle, Clock, CheckCircle2, Calendar, Video, X, User, MapPin, BookOpen, Phone, Link as LinkIcon } from 'lucide-react';

const demosData = [
  { id: 1, parent: 'Pooja Singh', student: 'Aarav Singh', subject: 'Physics', class: 'Class 11', date: 'May 28, 2026', time: '5:00 PM', mode: 'Online (Google Meet)', status: 'upcoming', phone: '+91 98765 43210' },
  { id: 2, parent: 'Meera Joshi', student: 'Ananya Joshi', subject: 'Mathematics', class: 'Class 10', date: 'May 29, 2026', time: '4:00 PM', mode: 'Home Visit - South Delhi', status: 'upcoming', phone: '+91 87654 32109' },
  { id: 3, parent: 'Rajesh Kumar', student: 'Karan Kumar', subject: 'Physics', class: 'Class 12', date: 'May 25, 2026', time: '6:00 PM', mode: 'Online (Zoom)', status: 'completed', phone: '+91 76543 21098' },
  { id: 4, parent: 'Sunita Agarwal', student: 'Priti Agarwal', subject: 'Mathematics', class: 'Class 9', date: 'May 30, 2026', time: '3:00 PM', mode: 'Home Visit - Dwarka', status: 'pending', phone: '+91 65432 10987' },
];

const statusConfig = {
  upcoming: { label: 'Upcoming', bg: 'bg-blue-100', text: 'text-blue-700', icon: <Calendar size={14} /> },
  pending: { label: 'Pending Approval', bg: 'bg-amber-100', text: 'text-amber-700', icon: <Clock size={14} /> },
  completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <CheckCircle2 size={14} /> },
};

const TutorDemos = () => {
  const [tab, setTab] = useState('upcoming');

  const filtered = tab === 'all' ? demosData : demosData.filter(d => d.status === tab);

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Demo Management</h1>
          <p className="text-slate-500 font-medium">Manage your upcoming and past demo sessions.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'upcoming', label: 'Upcoming' }, { key: 'pending', label: 'Pending' }, { key: 'completed', label: 'History' }, { key: 'all', label: 'All' }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-[#0b5ed7] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Demo Cards */}
        <div className="space-y-4">
          {filtered.map((demo) => {
            const st = statusConfig[demo.status];
            return (
              <div key={demo.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0">
                      {demo.parent.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{demo.parent}</h3>
                      <p className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <span className="flex items-center gap-1"><User size={14} /> {demo.student}, {demo.class}</span>
                        <span className="flex items-center gap-1"><BookOpen size={14} /> {demo.subject}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`${st.bg} ${st.text} text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 self-start`}>
                    {st.icon} {st.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 mb-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Date</div>
                    <div className="text-sm font-bold text-slate-900">{demo.date}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Time</div>
                    <div className="text-sm font-bold text-slate-900">{demo.time}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Mode</div>
                    <div className="text-sm font-bold text-slate-900">{demo.mode}</div>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Phone</div>
                    <div className="text-sm font-bold text-slate-900">{demo.phone}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                  {demo.status === 'upcoming' && (
                    <div className="w-full">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Meeting Link</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Paste Zoom / Google Meet link here" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0b5ed7]" defaultValue={demo.mode.includes('Online') ? 'https://zoom.us/j/1234567890' : ''} />
                        <button className="bg-[#0b5ed7] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2">
                          <LinkIcon size={16} /> Save Link
                        </button>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <button className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                          <Calendar size={14} /> Reschedule
                        </button>
                        <button className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  {demo.status === 'pending' && (
                    <div className="flex gap-3">
                      <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2">
                        <CheckCircle2 size={16} /> Accept
                      </button>
                      <button className="border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                        <Calendar size={14} /> Suggest Time
                      </button>
                      <button className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                        <X size={14} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <PlayCircle size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No demos here</h3>
            <p className="text-slate-500 font-medium">No demos match this filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TutorDemos;
