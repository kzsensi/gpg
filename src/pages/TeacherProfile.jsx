import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import { useAuth } from '../contexts/AuthContext';
import { apiTutors, apiDemos, apiReviews } from '../services/api';
import {
  Star, ShieldCheck, MapPin, Briefcase, ArrowLeft,
  PlayCircle, Users, BookMarked, Calendar,
  Activity, Landmark, X, CheckCircle2, AlertCircle,
  MonitorPlay, Home, User, BookOpen, Phone, Clock
} from 'lucide-react';

// ── Skeleton for loading state ──
const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-4 pt-2">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="flex gap-6 mt-4">
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-24" />
            <div className="h-4 bg-slate-100 rounded w-24" />
          </div>
        </div>
      </div>
    </div>
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 h-64" />
        <div className="bg-white rounded-2xl p-8 border border-slate-200 h-48" />
      </div>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 h-48" />
        <div className="bg-white rounded-2xl p-6 border border-slate-200 h-40" />
      </div>
    </div>
  </div>
);

// ── Demo Modal ──
const DemoModal = ({ tutor, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    subject: tutor?.subjects?.[0] || '',
    mode: 'Online',
    note: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/teacher/${tutor.user_id}` } });
      return;
    }
    setLoading(true); setError('');
    try {
      await apiDemos.create({
        parent_id: user.id,
        tutor_id: tutor.user_id,
        status: 'pending',
        subject: form.subject,
        preferred_mode: form.mode,
        note: form.note.trim() || null,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-10 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Demo Requested! 🎉</h3>
        <p className="text-slate-500 mb-6">Your request has been sent to <strong>{tutor.name}</strong>. They'll confirm a time slot soon.</p>
        <button onClick={onClose} className="w-full bg-[#0b5ed7] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Request Free Demo</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">with {tutor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Subject</label>
            <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7]">
              {(tutor.subjects?.length ? tutor.subjects : ['Mathematics', 'Science', 'English']).map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Preferred Mode</label>
            <div className="flex gap-3">
              {['Online', 'Home Visit'].map(m => (
                <button key={m} type="button" onClick={() => setForm({...form, mode: m})}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${form.mode === m ? 'bg-[#0b5ed7] text-white border-[#0b5ed7]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Specific topics? <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea rows={2} value={form.note} onChange={e => setForm({...form, note: e.target.value})}
              placeholder="e.g. Algebra, Organic Chemistry, Chapter 5..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7] resize-none" />
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 font-medium">Your first demo session is completely FREE. No payment required upfront.</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#0b5ed7] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Request...</>
              : <><PlayCircle size={18} /> Schedule Free Demo</>}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ──
const TeacherProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the tutor's user_id
  const { isAuthenticated } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    const fetchTutorAndReviews = async () => {
      if (!id) return;
      setLoading(true); setError('');
      try {
        const [tutorData, reviewsData] = await Promise.all([
          apiTutors.getTutorById(id),
          apiReviews.getByTutor(id).catch(() => []) // Fetch reviews, empty array if fails
        ]);
        
        if (!tutorData) {
          setError('not_found');
        } else {
          setTutor(tutorData);
          setReviews(reviewsData);
        }
      } catch (err) {
        setError(err.message || 'Could not load tutor profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchTutorAndReviews();
  }, [id]);

  const handleDemoClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/teacher/${id}` } });
    } else {
      setShowDemoModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-800 pb-20">
      <TopNavigation />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button onClick={() => navigate('/search')}
          className="flex items-center gap-2 text-slate-500 hover:text-[#0b5ed7] font-medium text-sm mb-6 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Search
        </button>

        {/* Loading */}
        {loading && <ProfileSkeleton />}

        {/* Not Found */}
        {!loading && error === 'not_found' && (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-200">
            <User size={56} className="mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tutor Not Found</h2>
            <p className="text-slate-500 mb-6">This profile may have been removed or the link may be incorrect.</p>
            <button onClick={() => navigate('/search')} className="bg-[#0b5ed7] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
              Browse Tutors
            </button>
          </div>
        )}

        {/* Error */}
        {!loading && error && error !== 'not_found' && (
          <div className="bg-red-50 rounded-2xl p-10 text-center border border-red-200">
            <AlertCircle size={40} className="mx-auto text-red-400 mb-4" />
            <p className="text-red-700 font-medium mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-[#0b5ed7] font-semibold hover:underline text-sm">Try Again</button>
          </div>
        )}

        {/* Tutor Profile (real data) */}
        {!loading && tutor && (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />

              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                {/* Avatar */}
                <div className="relative shrink-0">
                  {tutor.photo_url ? (
                    <img src={tutor.photo_url} alt={tutor.name} className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border-4 border-white" />
                  ) : (
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white">
                      {tutor.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{tutor.name}</h1>
                    {tutor.is_verified && (
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-blue-100">
                        <ShieldCheck size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 font-medium text-base mb-4">
                    {tutor.education || 'Tutor'}{tutor.subjects?.length ? ` • ${tutor.subjects.slice(0,2).join(', ')}` : ''}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                    {tutor.rating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Star className="text-amber-400 fill-amber-400" size={16} />
                        <span className="font-bold text-slate-900">{Number(tutor.rating).toFixed(1)}</span>
                        <span className="text-slate-500">({tutor.total_reviews || 0} reviews)</span>
                      </div>
                    )}
                    {tutor.experience_years > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Briefcase size={16} className="text-slate-400" />
                        <span className="font-bold text-slate-900">{tutor.experience_years} Yrs</span> Experience
                      </div>
                    )}
                    {tutor.city && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span className="font-bold text-slate-900">{tutor.city}</span>
                      </div>
                    )}
                    {tutor.mode && (
                      <div className="flex items-center gap-1.5 text-slate-600">
                        {tutor.mode === 'Online' ? <MonitorPlay size={16} className="text-slate-400" /> : <Home size={16} className="text-slate-400" />}
                        <span className="font-medium text-slate-700">
                          {tutor.mode === 'Both' ? 'Online / Offline' : tutor.mode}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto relative z-10 shrink-0">
                <button onClick={handleDemoClick}
                  className="bg-[#0b5ed7] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-[0_8px_20px_rgba(11,94,215,0.2)] flex items-center gap-2 justify-center">
                  <PlayCircle size={18} /> Schedule Free Demo
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-slate-400 text-center">Login required to book a demo</p>
                )}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left — Main Content */}
              <div className="lg:col-span-2 space-y-8">

                {/* About */}
                {tutor.bio && (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">About Me</h2>
                    <p className="text-slate-600 font-medium leading-relaxed text-[15px]">{tutor.bio}</p>
                  </div>
                )}

                {/* Subjects & Boards */}
                {(tutor.subjects?.length > 0 || tutor.board) && (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Subjects & Boards</h2>
                    {tutor.board && (
                      <div className="mb-5">
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Board</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm">{tutor.board}</span>
                        </div>
                      </div>
                    )}
                    {tutor.subjects?.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.subjects.map(s => (
                            <span key={s} className="px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Education */}
                {tutor.education && (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Education & Qualifications</h2>
                    <div className="relative border-l-2 border-slate-100 ml-3 pl-8 pb-2">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-100 border-2 border-indigo-500" />
                      <h4 className="font-bold text-slate-900">{tutor.education}</h4>
                      {tutor.city && <p className="text-sm text-slate-500 font-medium mt-1">{tutor.city}</p>}
                    </div>
                  </div>
                )}

                {/* No content state */}
                {!tutor.bio && !tutor.subjects?.length && !tutor.education && (
                  <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center">
                    <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">This tutor hasn't completed their profile yet.</p>
                    <p className="text-sm text-slate-400 mt-1">You can still request a demo to learn more.</p>
                  </div>
                )}

                {/* Reviews Section */}
                {reviews.length > 0 && (
                  <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mt-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Star className="text-amber-400 fill-amber-400" size={24} /> 
                      Parent Reviews
                    </h2>
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0">
                                {(review.parent_name || 'P').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900 text-[15px]">{review.parent_name || 'Parent'}</h4>
                                <p className="text-xs text-slate-500 font-medium">
                                  {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(review.created_at))}
                                </p>
                              </div>
                            </div>
                            <div className="flex text-amber-400">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={14} className={star <= review.rating ? 'fill-amber-400' : 'text-slate-200'} />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-slate-700 text-[15px] leading-relaxed ml-13 pl-[52px]">
                              "{review.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Fee Structure */}
                {tutor.hourly_rate > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Landmark className="text-indigo-600" size={20} /> Fee Structure
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600 font-medium">Hourly Rate</span>
                        <span className="font-bold text-slate-900">₹{tutor.hourly_rate}/hr</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-600 font-medium">Monthly Package</span>
                        <span className="font-bold text-[#0b5ed7]">Contact tutor</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Availability / Mode */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                    <Calendar className="text-indigo-600" size={20} /> Teaching Mode
                  </h3>
                  <div className="space-y-3">
                    {(tutor.mode === 'Online' || tutor.mode === 'Both') && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <MonitorPlay size={18} className="text-[#0b5ed7]" />
                        <span className="text-sm font-semibold text-slate-700">Online Tuition</span>
                      </div>
                    )}
                    {(tutor.mode === 'Home Tuition' || tutor.mode === 'Both') && (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <Home size={18} className="text-emerald-600" />
                        <span className="text-sm font-semibold text-slate-700">Home Tuition</span>
                      </div>
                    )}
                    {!tutor.mode && (
                      <p className="text-sm text-slate-500">Mode not specified — ask via demo request.</p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-start gap-2 mt-4 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                    <Activity size={14} className="shrink-0 text-indigo-400 mt-0.5" />
                    Slots subject to availability. Book a demo to secure your preferred time.
                  </p>
                </div>

                {/* Detailed Availability */}
                {tutor.availability && Object.keys(tutor.availability).length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                      <Clock className="text-indigo-600" size={20} /> Availability
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(tutor.availability).filter(([_, times]) => times.length > 0).map(([day, times]) => (
                        <div key={day} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 last:pb-0">
                          <span className="text-slate-700 font-bold text-sm">{day}</span>
                          <div className="flex gap-1.5 flex-wrap justify-end">
                            {times.map(t => (
                              <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded capitalize">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Demo CTA */}
                <div className="bg-gradient-to-br from-[#0b5ed7] to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PlayCircle size={24} className="text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Ready to Start?</h4>
                  <p className="text-blue-100 text-sm mb-4 leading-relaxed">Book a FREE demo session with {tutor.name} and experience their teaching style first-hand.</p>
                  <button onClick={handleDemoClick}
                    className="w-full bg-white text-[#0b5ed7] py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-md text-sm">
                    Book Free Demo
                  </button>
                </div>

                {/* Verified Badge */}
                {tutor.is_verified && (
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-100">
                      <ShieldCheck size={24} className="text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">GharPeGyan Verified</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">Identity and qualifications have been verified by our team.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {showDemoModal && tutor && (
        <DemoModal tutor={tutor} onClose={() => setShowDemoModal(false)} />
      )}
    </div>
  );
};

export default TeacherProfile;
