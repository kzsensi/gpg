import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequirements, apiDemos } from '../../services/api';
import { Mail, Clock, CheckCircle2, MapPin, GraduationCap, BookOpen, AlertCircle } from 'lucide-react';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const LeadInbox = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    if (user) fetchLeads();
  }, [user]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Fetch all active leads. In a real app we'd filter by tutor's city/subjects.
      const { data } = await apiRequirements.getActiveLeads();
      setLeads(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptLead = async (lead) => {
    setProcessingId(lead.id);
    setSuccessId(null);
    try {
      await apiDemos.create({
        parent_id: lead.parent_id,
        tutor_id: user.id,
        requirement_id: lead.id,
        status: 'pending'
      });
      setSuccessId(lead.id);
      // Remove from list after short delay
      setTimeout(() => setLeads(prev => prev.filter(l => l.id !== lead.id)), 1500);
    } catch (err) {
      setError(err.message || 'Failed to express interest');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1 flex items-center gap-3">
              Lead Inbox
              {leads.length > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">{leads.length} new</span>}
            </h1>
            <p className="text-slate-500 font-medium">Parent inquiries and tuition requests in your area.</p>
          </div>
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
            <p className="text-slate-500">Loading leads...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const expanded = expandedId === lead.id;
              const datePosted = new Date(lead.created_at);
              const timeAgoStr = timeAgo(datePosted);
              
              return (
                <div key={lead.id} className={`bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md border-[#0b5ed7]/30`}>
                  <div className="p-6 cursor-pointer" onClick={() => setExpandedId(expanded ? null : lead.id)}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0">
                          {lead.student_name ? lead.student_name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{lead.student_name}</h3>
                          <p className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            <span className="flex items-center gap-1"><GraduationCap size={14} /> Class: {lead.class_level}</span>
                            <span className="flex items-center gap-1"><BookOpen size={14} /> Subjects: {lead.subjects?.join(', ')}</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {lead.area}, {lead.city} • {lead.mode}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1"><Clock size={12} /> {timeAgoStr}</span>
                        <span className={`bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full`}>New</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 font-medium mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      Budget: ₹{lead.min_budget} - ₹{lead.max_budget} / month • {lead.sessions_per_week} sessions/week • {lead.preferred_time}
                    </p>
                  </div>

                  {expanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-4">
                      <div className="flex gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAcceptLead(lead); }}
                          disabled={processingId === lead.id || successId === lead.id}
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 disabled:opacity-70 transition-colors ${
                            successId === lead.id
                              ? 'bg-emerald-600 text-white cursor-not-allowed'
                              : 'bg-[#0b5ed7] text-white hover:bg-blue-700'
                          }`}
                        >
                          {processingId === lead.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 size={16} />}
                          {processingId === lead.id ? 'Sending...' : successId === lead.id ? 'Interest Sent!' : 'Express Interest'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {leads.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Mail size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">No new leads</h3>
                <p className="text-slate-500 font-medium">There are currently no active requirements in your area.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeadInbox;
