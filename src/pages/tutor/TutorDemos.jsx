import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiDemos } from '../../services/api';
import { PlayCircle, Clock, CheckCircle2, Calendar, Video, X, User, MapPin, BookOpen, Phone, Link as LinkIcon, AlertCircle, ExternalLink, MessageSquare } from 'lucide-react';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
};

const formatScheduledTime = (isoString) => {
  if (!isoString) return null;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoString));
};

const statusConfig = {
  pending: { label: 'Pending Approval', bg: 'bg-amber-100 border border-amber-300 shadow-sm', text: 'text-amber-800', icon: <Clock size={16} /> },
  accepted: { label: 'Upcoming', bg: 'bg-blue-100 border border-blue-300 shadow-sm', text: 'text-blue-800', icon: <Calendar size={16} /> },
  completed: { label: 'Completed', bg: 'bg-emerald-100 border border-emerald-300 shadow-sm', text: 'text-emerald-800', icon: <CheckCircle2 size={16} /> },
  hiring_requested: { label: 'Hire Request', bg: 'bg-indigo-100 border border-indigo-300 shadow-sm', text: 'text-indigo-800', icon: <CheckCircle2 size={16} /> },
  hired: { label: 'Hired', bg: 'bg-emerald-100 border border-emerald-400 shadow-md', text: 'text-emerald-800', icon: <CheckCircle2 size={16} /> },
  declined: { label: 'Declined', bg: 'bg-red-100 border border-red-300 shadow-sm', text: 'text-red-800', icon: <X size={16} /> },
};

/**
 * AcceptModal — Shown when tutor clicks "Accept Request"
 * Collects: scheduled date, time, and optional meeting link
 */
const AcceptModal = ({ onClose, onSubmit, loading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!date || !time) {
      alert('Please select a date and time for the session.');
      return;
    }
    const scheduledAt = new Date(`${date}T${time}`).toISOString();
    onSubmit({ scheduledAt, meetingLink: link || null });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Schedule Demo Session</h3>
        <p className="text-sm text-slate-500 mb-6">Pick a date & time, and optionally paste a meeting link now.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date *</label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Time *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Meeting Link (optional — add later too)</label>
            <input
              type="url"
              placeholder="https://zoom.us/j/... or https://meet.google.com/..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><CheckCircle2 size={16} /> Accept & Schedule</>
            )}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const TutorDemos = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('upcoming');
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [acceptingId, setAcceptingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const { data } = await apiDemos.getByUser(user.id, 'tutor');
      setDemos(data || []);
      
      // Fetch secure meeting links for all demos
      if (data && data.length > 0) {
        const demoIds = data.map(d => d.id);
        const links = await apiDemos.getTutorLinks(demoIds);
        setMeetingLinks(links);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDemos();
  }, [user]);

  const handleAcceptWithSchedule = async ({ scheduledAt, meetingLink }) => {
    try {
      setSubmitLoading(true);
      await apiDemos.updateStatus(acceptingId, 'accepted', meetingLink, scheduledAt);
      setAcceptingId(null);
      fetchDemos();
    } catch (err) {
      alert('Failed to accept: ' + err.message);
    } finally {
      setSubmitLoading(false);
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

  const handleSaveLink = async (demoId) => {
    const link = meetingLinks[demoId];
    if (!link) return alert('Please enter a meeting link');
    
    try {
      await apiDemos.updateMeetingDetails(demoId, link);
      alert('Meeting link saved securely!');
      fetchDemos();
    } catch (err) {
      alert('Failed to save link: ' + err.message);
    }
  };

  const handleToggleLive = async (demoId, currentLiveStatus) => {
    try {
      const newStatus = !currentLiveStatus;
      await apiDemos.setDemoLive(demoId, newStatus);
      
      // Update local state without full refetch for snappier UI
      setDemos(prev => prev.map(d => d.id === demoId ? { ...d, is_live: newStatus } : d));
    } catch (err) {
      alert('Failed to update live status: ' + err.message);
    }
  };

  const filtered = tab === 'all' 
    ? demos 
    : demos.filter(d => (d.status === 'accepted' ? 'upcoming' : d.status) === tab);

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Classes & Meetings</h1>
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
              const req = demo.parent_requirements || {};
              const profile = demo.parent_profiles || {};
              // Get parent name: prefer parent_profiles DB row, then requirement, then legacy note parse
              const parentDbProfile = demo.parent_profiles || {};
              const legacyNameMatch = demo.note?.match(/\[From:\s*(.*?)(?:\s*\|\s*For:.*?|)\]/);
              const legacyName = legacyNameMatch ? legacyNameMatch[1].trim() : null;
              const parentName = req.student_name
                ? `${req.student_name}'s Parent`
                : (parentDbProfile.name || legacyName || 'Parent');
              // New columns — fallback to requirement data for old records
              const demoSubject = demo.subject || req.subjects?.[0];
              const demoMode = demo.preferred_mode || (req.mode === 'online' ? 'Online' : (req.mode || null));
              // Only show note if it's a clean message (not the old packed [From:...] format)
              const cleanMessage = demo.note && !demo.note.startsWith('[From:') ? demo.note : null;
              const createdDate = new Date(demo.created_at);
              const scheduledTime = formatScheduledTime(demo.scheduled_at);

              return (
                <div key={demo.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-lg shrink-0">
                        {parentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{parentName}</h3>
                        {(req.student_name || req.subjects) ? (
                          <p className="text-sm text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {req.student_name && <span className="flex items-center gap-1"><User size={14} /> {req.student_name}, Class: {req.class_level}</span>}
                            {req.subjects && <span className="flex items-center gap-1"><BookOpen size={14} /> Subjects: {req.subjects?.join(', ')}</span>}
                          </p>
                        ) : (
                          cleanMessage && <p className="text-sm text-slate-500 italic mt-1 max-w-sm">"{cleanMessage}"</p>
                        )}
                      </div>
                    </div>

                    <span className={`${st.bg} ${st.text} text-sm font-bold px-4 py-2 rounded-full flex items-center gap-1.5 self-start md:self-center`}>
                      {st.icon} {st.label}
                    </span>
                  </div>

                  {/* Info pills */}
                  <div className="flex flex-wrap gap-4 mt-4 mb-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Requested On</div>
                      <div className="text-sm font-bold text-slate-900">{formatDate(createdDate)}</div>
                    </div>
                    {scheduledTime && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                        <div className="text-[10px] text-blue-500 font-bold uppercase">Scheduled For</div>
                        <div className="text-sm font-bold text-blue-900">{scheduledTime}</div>
                      </div>
                    )}
                    {demoSubject && (
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                        <div className="text-[10px] text-indigo-500 font-bold uppercase">Subject</div>
                        <div className="text-sm font-bold text-indigo-900">{demoSubject}</div>
                      </div>
                    )}
                    {demoMode && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
                        <div className="text-[10px] text-emerald-600 font-bold uppercase">Preferred Mode</div>
                        <div className="text-sm font-bold text-emerald-900">{demoMode}</div>
                      </div>
                    )}
                    {(req.area || req.city) && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">City / Area</div>
                        <div className="text-sm font-bold text-slate-900">{[req.area, req.city].filter(Boolean).join(', ')}</div>
                      </div>
                    )}
                    {demo.status === 'accepted' && req.phone && (
                      <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Phone</div>
                        <div className="text-sm font-bold text-slate-900">{req.phone}</div>
                      </div>
                    )}
                  </div>

                  {/* Parent's optional note (only show clean messages, not old packed format) */}
                  {cleanMessage && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare size={14} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Parent's Note</span>
                      </div>
                      <p className="text-sm text-slate-700">{cleanMessage}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                    {demo.status === 'accepted' && (
                      <div className="w-full space-y-4">
                        {/* Meeting link input */}
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Meeting Link (For Online Classes)</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Paste Zoom / Google Meet link here" 
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#0b5ed7]" 
                              value={meetingLinks[demo.id] || ''}
                              onChange={(e) => setMeetingLinks(prev => ({...prev, [demo.id]: e.target.value}))}
                            />
                            <button 
                              onClick={() => handleSaveLink(demo.id)}
                              className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 flex items-center gap-2"
                            >
                              <LinkIcon size={16} /> Save Link
                            </button>
                          </div>
                        </div>
                        
                        {/* Tutor's own Join + action buttons */}
                        <div className="flex flex-wrap gap-3 items-center">
                          <button 
                            onClick={() => handleToggleLive(demo.id, demo.is_live)}
                            className={`${demo.is_live ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'} text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2`}
                          >
                            <Video size={16} /> 
                            {demo.is_live ? 'End Class (Lock Link)' : 'Start Class (Allow Parent to Join)'}
                          </button>
                          
                          {meetingLinks[demo.id] && (
                            <a 
                              href={meetingLinks[demo.id]} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[#0b5ed7] bg-blue-50 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 flex items-center gap-2"
                            >
                              <ExternalLink size={14} /> Join Session Myself
                            </a>
                          )}
                          <button onClick={() => handleUpdateStatus(demo.id, 'completed')} className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 flex items-center gap-2 ml-auto">
                            <CheckCircle2 size={14} /> Mark Completed
                          </button>
                          <button onClick={() => handleUpdateStatus(demo.id, 'declined')} className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {demo.status === 'pending' && (
                      <div className="flex gap-3">
                        <button onClick={() => setAcceptingId(demo.id)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2">
                          <CheckCircle2 size={16} /> Accept Request
                        </button>
                        <button onClick={() => handleUpdateStatus(demo.id, 'declined')} className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                          <X size={14} /> Decline
                        </button>
                      </div>
                    )}

                    {demo.status === 'hiring_requested' && (
                      <div className="flex flex-col gap-3">
                         <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-2">
                           <p className="text-sm text-indigo-900 font-bold">The parent has requested to hire you! Approve to add to My Students.</p>
                         </div>
                         <div className="flex gap-3">
                           <button onClick={() => handleUpdateStatus(demo.id, 'hired')} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2">
                             <CheckCircle2 size={16} /> Approve Student
                           </button>
                           <button onClick={() => handleUpdateStatus(demo.id, 'declined')} className="border border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-red-50 flex items-center gap-2">
                             <X size={14} /> Decline
                           </button>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <PlayCircle size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No demos here</h3>
            <p className="text-slate-500 font-medium">No demos match this filter.</p>
          </div>
        )}
      </div>

      {/* Accept & Schedule Modal */}
      {acceptingId && (
        <AcceptModal
          onClose={() => setAcceptingId(null)}
          onSubmit={handleAcceptWithSchedule}
          loading={submitLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default TutorDemos;
