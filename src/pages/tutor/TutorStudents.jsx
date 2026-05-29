import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiDemos } from '../../services/api';
import { Users, User, BookOpen, MapPin, MessageCircle, Calendar, CheckCircle2, Video, Link as LinkIcon } from 'lucide-react';
import UserAvatar from '../../components/UserAvatar';

const ScheduleModal = ({ onClose, onSubmit, loading }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [link, setLink] = useState('');

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
        <h3 className="text-xl font-bold text-slate-900 mb-1">Schedule Class</h3>
        <p className="text-sm text-slate-500 mb-6">Pick a date & time, and paste a meeting link.</p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Date *</label>
              <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7]" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Time *</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Meeting Link</label>
            <input type="url" placeholder="https://zoom.us/j/..." value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0b5ed7]" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-emerald-600 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><CheckCircle2 size={16} /> Schedule</>}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const TutorStudents = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [schedulingId, setSchedulingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [meetingLinks, setMeetingLinks] = useState({});

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await apiDemos.getByUser(user.id, 'tutor');
      const hiredStudents = data?.filter(d => d.status === 'hired') || [];
      setStudents(hiredStudents);
      
      const ids = hiredStudents.map(s => s.id);
      const links = await apiDemos.getTutorLinks(ids);
      setMeetingLinks(links || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStudents();
  }, [user]);

  const handleSchedule = async ({ scheduledAt, meetingLink }) => {
    setSubmitLoading(true);
    try {
      await apiDemos.updateStatus(schedulingId, 'hired', meetingLink, scheduledAt);
      setSchedulingId(null);
      fetchStudents();
    } catch (err) {
      alert('Failed to schedule class: ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveLink = async (demoId) => {
    const link = meetingLinks[demoId];
    if (!link) return alert('Please enter a meeting link');
    try {
      await apiDemos.updateMeetingDetails(demoId, link);
      alert('Meeting link saved securely!');
      fetchStudents();
    } catch (err) {
      alert('Failed to save link: ' + err.message);
    }
  };

  const handleToggleLive = async (demoId, currentLiveStatus) => {
    try {
      const newStatus = !currentLiveStatus;
      await apiDemos.setDemoLive(demoId, newStatus);
      setStudents(prev => prev.map(d => d.id === demoId ? { ...d, is_live: newStatus } : d));
    } catch (err) {
      alert('Failed to update live status: ' + err.message);
    }
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">My Students</h1>
          <p className="text-slate-500 font-medium">Manage your active students and schedule classes.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>)}
          </div>
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {students.map((studentRecord) => {
              const req = studentRecord.parent_requirements || {};
              const profile = studentRecord.parent_profiles || {};
              const parentNameMatch = studentRecord.note?.match(/\[From:\s*(.*?)(?:\s*\|\s*For:.*?|)\]/);
              const childNameMatch = studentRecord.note?.match(/\|\s*For:\s*(.*?)\]/);
              
              const noteParent = parentNameMatch ? parentNameMatch[1].trim() : null;
              const noteChild = childNameMatch ? childNameMatch[1].trim() : noteParent;

              const parentName = req.student_name ? `${req.student_name}'s Parent` : (profile.name || noteParent || 'Parent');
              const studentName = req.student_name || noteChild || profile.name || 'Student';
              const hasLink = !!meetingLinks[studentRecord.id];
              const scheduledTime = studentRecord.scheduled_at 
                ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(studentRecord.scheduled_at)) 
                : null;
              
              return (
                <div key={studentRecord.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 bg-emerald-50/30 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">
                    <div className="flex gap-4 items-center mb-4">
                      <UserAvatar
                        userId={studentRecord.parent_id}
                        name={studentName}
                        sizeClass="w-14 h-14 text-2xl"
                        bgClass="bg-emerald-100 text-emerald-700"
                      />
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">{studentName}</h3>
                        {req.class_level && <p className="text-sm font-medium text-emerald-700">Class: {req.class_level}</p>}
                      </div>
                    </div>
                    {(req.subjects || req.area || studentRecord.note) && (
                      <div className="space-y-2 mt-2">
                        {req.subjects && <p className="text-sm text-slate-700 flex items-center gap-2"><BookOpen size={14} className="text-slate-400" /> {req.subjects?.join(', ')}</p>}
                        {req.area && <p className="text-sm text-slate-700 flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {req.area}, {req.city}</p>}
                        {studentRecord.note && (
                          <p className="text-sm text-slate-500 italic mt-2">"{studentRecord.note.replace(/\[From:\s*.*?\]\s*/, '')}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:w-2/3 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-1">Parent Contact</p>
                        <p className="font-semibold text-slate-900">{parentName}</p>
                      </div>
                      <button 
                        onClick={() => navigate('/tutor/messages', { state: { contactId: studentRecord.parent_id, contactName: parentName } })}
                        className="bg-blue-50 text-[#0b5ed7] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-100 transition-colors"
                      >
                        <MessageCircle size={16} /> Message
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-auto">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Calendar size={16} className="text-indigo-500" /> Next Class: {scheduledTime || 'Not Scheduled'}
                        </p>
                        <button 
                          onClick={() => setSchedulingId(studentRecord.id)}
                          className="text-xs font-bold text-indigo-600 hover:underline"
                        >
                          {scheduledTime ? 'Reschedule' : 'Schedule Now'}
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LinkIcon size={14} className="text-slate-400" />
                          </div>
                          <input 
                            type="url" 
                            placeholder="Enter meeting link (Zoom, Meet)" 
                            value={meetingLinks[studentRecord.id] || ''}
                            onChange={(e) => setMeetingLinks(prev => ({ ...prev, [studentRecord.id]: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#0b5ed7] transition-colors"
                          />
                        </div>
                        <button 
                          onClick={() => handleSaveLink(studentRecord.id)}
                          className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-300 transition-colors whitespace-nowrap"
                        >
                          Save Link
                        </button>
                      </div>

                      {hasLink && (
                        <div className={`mt-3 p-3 rounded-lg border flex items-center justify-between ${studentRecord.is_live ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-100 border-slate-200'}`}>
                          <div className="flex items-center gap-2">
                            <Video size={16} className={studentRecord.is_live ? 'text-emerald-600' : 'text-slate-400'} />
                            <div>
                              <p className={`text-sm font-bold ${studentRecord.is_live ? 'text-emerald-900' : 'text-slate-700'}`}>
                                {studentRecord.is_live ? 'Class is Live' : 'Class is Not Live'}
                              </p>
                              <p className={`text-xs ${studentRecord.is_live ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {studentRecord.is_live ? 'Student can now join the meeting' : 'Student cannot join yet'}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleLive(studentRecord.id, studentRecord.is_live)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                              studentRecord.is_live 
                                ? 'bg-white text-red-600 border border-red-200 hover:bg-red-50' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                            }`}
                          >
                            {studentRecord.is_live ? 'End Class' : 'Start Class'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Users size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No active students yet</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">
              Once a parent hires you after a successful demo, they will appear here.
            </p>
          </div>
        )}
      </div>

      {schedulingId && (
        <ScheduleModal 
          onClose={() => setSchedulingId(null)} 
          onSubmit={handleSchedule}
          loading={submitLoading}
        />
      )}
    </DashboardLayout>
  );
};

export default TutorStudents;
