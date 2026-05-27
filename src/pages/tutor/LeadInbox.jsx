import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Mail, MessageCircle, Clock, CheckCircle2, X, MapPin, GraduationCap, BookOpen, Phone, Send, Filter } from 'lucide-react';

const leadsData = [
  { id: 1, parent: 'Pooja Singh', student: 'Aarav Singh', class: 'Class 11', subject: 'Physics', board: 'CBSE', mode: 'Online', city: 'New Delhi', message: 'Looking for a tutor who can help with JEE preparation alongside school syllabus. My son needs help with Mechanics and Thermodynamics.', time: '30 min ago', status: 'new', phone: '+91 98765 43210' },
  { id: 2, parent: 'Meera Joshi', student: 'Ananya Joshi', class: 'Class 10', subject: 'Mathematics', board: 'ICSE', mode: 'Home Visit', city: 'South Delhi', message: 'Need a tutor for board exam preparation. Student struggles with Trigonometry and Coordinate Geometry.', time: '2 hours ago', status: 'new', phone: '+91 87654 32109' },
  { id: 3, parent: 'Rajesh Kumar', student: 'Karan Kumar', class: 'Class 12', subject: 'Physics', board: 'CBSE', mode: 'Online', city: 'Mumbai', message: 'Need regular classes for NEET preparation, focusing on Modern Physics and Optics.', time: 'Yesterday', status: 'accepted', phone: '+91 76543 21098' },
  { id: 4, parent: 'Sunita Agarwal', student: 'Priti Agarwal', class: 'Class 9', subject: 'Mathematics', board: 'State Board', mode: 'Home Visit', city: 'Delhi', message: 'My daughter needs foundation classes in algebra. She is weak in basics.', time: '2 days ago', status: 'declined', phone: '+91 65432 10987' },
];

const statusColors = {
  new: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
  accepted: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Accepted' },
  declined: { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' },
};

const LeadInbox = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const filtered = filter === 'all' ? leadsData : leadsData.filter(l => l.status === filter);
  const newCount = leadsData.filter(l => l.status === 'new').length;

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
              Lead Inbox
              {newCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{newCount} new</span>}
            </h1>
            <p className="text-slate-500 font-medium">Parent inquiries and tuition requests sent to you.</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'all', label: 'All' }, { key: 'new', label: 'New' }, { key: 'accepted', label: 'Accepted' }, { key: 'declined', label: 'Declined' }].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === tab.key ? 'bg-[#0b5ed7] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map((lead) => {
            const st = statusColors[lead.status];
            const expanded = expandedId === lead.id;
            return (
              <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md ${lead.status === 'new' ? 'border-[#0b5ed7]/30' : 'border-slate-200'}`}>
                <div className="p-6 cursor-pointer" onClick={() => setExpandedId(expanded ? null : lead.id)}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0">
                        {lead.parent.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{lead.parent}</h3>
                        <p className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="flex items-center gap-1"><GraduationCap size={14} /> {lead.student}, {lead.class}</span>
                          <span className="flex items-center gap-1"><BookOpen size={14} /> {lead.subject} ({lead.board})</span>
                          <span className="flex items-center gap-1"><MapPin size={14} /> {lead.city} • {lead.mode}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-1"><Clock size={12} /> {lead.time}</span>
                      <span className={`${st.bg} ${st.text} text-xs font-bold px-3 py-1.5 rounded-full`}>{st.label}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 font-medium mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{lead.message}"
                  </p>
                </div>

                {expanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-2 text-slate-600 font-medium"><Phone size={14} className="text-slate-400" /> {lead.phone}</span>
                    </div>

                    {lead.status === 'new' && (
                      <div className="flex gap-3">
                        <button className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center gap-2">
                          <CheckCircle2 size={16} /> Accept Lead
                        </button>
                        <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                          <MessageCircle size={16} /> Reply
                        </button>
                        <button className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                          <X size={16} /> Decline
                        </button>
                      </div>
                    )}

                    {lead.status === 'accepted' && (
                      <div className="flex gap-3">
                        <button onClick={() => navigate('/chat')} className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-100 flex items-center gap-2">
                          <MessageCircle size={16} /> Open Chat
                        </button>
                        <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
                          <Phone size={16} /> Call Parent
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Mail size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No leads found</h3>
            <p className="text-slate-500 font-medium">No inquiries match this filter.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeadInbox;
