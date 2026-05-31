import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiDemos, apiReviews } from '../../services/api';
import { PlayCircle, Clock, CheckCircle2, Calendar, MapPin, Video, X, User, AlertCircle, Lock, Star } from 'lucide-react';

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
};

const formatScheduledTime = (isoString) => {
  if (!isoString) return null;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoString));
};

const statusConfig = {
  confirmed: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  accepted: { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', icon: <Clock size={14} /> },
  completed: { label: 'Completed', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: <CheckCircle2 size={14} /> },
  hiring_requested: { label: 'Hiring Requested', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', icon: <CheckCircle2 size={14} /> },
  hired: { label: 'Hired', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: <CheckCircle2 size={14} /> },
  declined: { label: 'Declined', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: <X size={14} /> },
};

/**
 * Determines the state of the "Join Session" button based on is_live
 */
const getJoinState = (demo) => {
  if (demo.is_live) {
    return { enabled: true, label: 'Join Session', sublabel: null };
  }

  const scheduled = demo.scheduled_at ? new Date(demo.scheduled_at) : null;
  if (!scheduled) {
    return { enabled: false, label: 'Waiting for Tutor', sublabel: 'Tutor will start the class when ready' };
  }

  return { 
    enabled: false, 
    label: 'Session Locked', 
    sublabel: `Tutor will start this class around ${formatScheduledTime(demo.scheduled_at)}` 
  };
};

const ReviewModal = ({ tutorId, tutorName, parentId, parentName, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return alert('Please select a rating.');
    try {
      setSubmitting(true);
      await apiReviews.create({
        tutor_id: tutorId,
        parent_id: parentId,
        parent_name: parentName,
        rating,
        review_text: reviewText
      });
      alert('Review submitted successfully!');
      onClose();
    } catch (err) {
      alert('Failed to submit review: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-slate-900 mb-1">Review {tutorName}</h3>
        <p className="text-sm text-slate-500 mb-6">Your feedback helps other parents make good decisions.</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                size={36} 
                className={(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
              />
            </button>
          ))}
        </div>

        <textarea
          placeholder="Share details of your experience with this tutor..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7] mb-6 resize-none"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 bg-[#0b5ed7] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 flex items-center justify-center disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DemoRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joiningId, setJoiningId] = useState(null); // Which demo is currently being joined
  const [reviewingTutor, setReviewingTutor] = useState(null); // { id, name }

  const fetchDemos = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const { data } = await apiDemos.getByUser(user.id, 'parent');
      setDemos(data || []);
    } catch (err) {
      if (!isBackground) setError(err.message);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDemos();
  }, [user]);

  // Auto-refresh every 15 seconds so parent sees when tutor goes live
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchDemos(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleUpdateStatus = async (demoId, newStatus) => {
    try {
      await apiDemos.updateStatus(demoId, newStatus);
      fetchDemos();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleJoinSession = async (demoId) => {
    try {
      setJoiningId(demoId);
      let link = await apiDemos.getSecureLink(demoId);
      if (link) {
        link = link.trim();
        // Ensure the link has a protocol, otherwise browser treats it as a relative path
        if (!/^https?:\/\//i.test(link)) {
          link = 'https://' + link;
        }
        // Use location.href for reliable redirect (window.open gets blocked by popup blockers in async contexts on mobile)
        window.location.href = link;
      }
    } catch (err) {
      alert(err.message || 'Could not get the meeting link.');
    } finally {
      setJoiningId(null);
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
              const scheduledTime = formatScheduledTime(demo.scheduled_at);
              const joinState = getJoinState(demo);
              
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
                          {demo.tutor_profiles?.subjects?.length > 0 && (
                            <span className="ml-2 text-slate-400">• {demo.tutor_profiles.subjects.slice(0, 3).join(', ')}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`${st.bg} ${st.text} ${st.border} border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1`}>
                        {st.icon} {st.label}
                      </span>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center">
                      <div className="text-xs text-slate-500 font-bold uppercase">Requested On</div>
                      <div className="text-sm font-bold text-slate-900">{formatDate(createdDate)}</div>
                    </div>
                    {scheduledTime && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center">
                        <div className="text-xs text-blue-500 font-bold uppercase">Scheduled For</div>
                        <div className="text-sm font-bold text-blue-900">{scheduledTime}</div>
                      </div>
                    )}
                    {!scheduledTime && (demo.status === 'accepted' || demo.status === 'confirmed') && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2 text-center">
                        <div className="text-xs text-amber-500 font-bold uppercase">Schedule</div>
                        <div className="text-sm font-bold text-amber-700">Waiting for tutor</div>
                      </div>
                    )}
                  </div>

                  {/* Note the parent sent */}
                  {demo.note && (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-4">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Your Message</div>
                      <p className="text-sm text-slate-700">{demo.note}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {demo.status !== 'completed' && demo.status !== 'declined' && demo.status !== 'hiring_requested' && demo.status !== 'hired' && (
                    <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100">
                      {(demo.status === 'confirmed' || demo.status === 'accepted') && (
                        <>
                          {joinState.enabled ? (
                            <button 
                              onClick={() => handleJoinSession(demo.id)}
                              disabled={joiningId === demo.id}
                              className="bg-[#0b5ed7] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-70"
                            >
                              {joiningId === demo.id ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Video size={16} />
                              )}
                              Join Session
                            </button>
                          ) : (
                            <div className="flex flex-col">
                              <button disabled className="bg-slate-200 text-slate-500 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                                <Lock size={16} /> {joinState.label}
                              </button>
                              {joinState.sublabel && (
                                <span className="text-[10px] font-semibold text-slate-400 mt-1 ml-1">{joinState.sublabel}</span>
                              )}
                            </div>
                          )}
                        </>
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

                  {(demo.status === 'completed' || demo.status === 'hiring_requested' || demo.status === 'hired') && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                      {demo.status === 'completed' && (
                        <button onClick={() => handleUpdateStatus(demo.id, 'hiring_requested')} className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md">
                           Hire Tutor
                        </button>
                      )}
                      <button 
                        onClick={() => setReviewingTutor({ id: demo.tutor_id, name: tutorName })}
                        className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                        Write Review
                      </button>
                      <button 
                        onClick={() => navigate('/parent/messages', { state: { contactId: demo.tutor_id, contactName: tutorName } })}
                        className="bg-white border border-slate-200 text-[#0b5ed7] px-6 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                      >
                        Message
                      </button>
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

      {reviewingTutor && (
        <ReviewModal
          tutorId={reviewingTutor.id}
          tutorName={reviewingTutor.name}
          parentId={user.id}
          parentName={user?.user_metadata?.name || 'Parent'}
          onClose={() => setReviewingTutor(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default DemoRequests;
