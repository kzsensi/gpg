import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import { useAuth } from '../contexts/AuthContext';
import { apiTutors, apiDemos } from '../services/api';
import { SUBJECTS, CITIES, BOARDS, PAGE_SIZE } from '../services/constants';
import {
  Search, MapPin, GraduationCap, ChevronDown, Filter,
  CheckCircle2, Briefcase, Star, ShieldCheck, MonitorPlay,
  ChevronLeft, ChevronRight, X, PlayCircle, BookOpen, AlertCircle
} from 'lucide-react';

// ── Loading Skeleton Card ──
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse">
    <div className="flex gap-4 mb-5">
      <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="h-4 bg-slate-200 rounded w-2/3" />
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-6 w-20 bg-slate-100 rounded-md" />
          <div className="h-6 w-16 bg-slate-100 rounded-md" />
        </div>
      </div>
    </div>
    <div className="space-y-2 mb-5">
      <div className="h-3 bg-slate-100 rounded w-full" />
      <div className="h-3 bg-slate-100 rounded w-3/4" />
    </div>
    <div className="flex gap-3">
      <div className="flex-1 h-10 bg-slate-100 rounded-xl" />
      <div className="flex-1 h-10 bg-blue-100 rounded-xl" />
    </div>
  </div>
);

// ── Demo Request Modal ──
const DemoModal = ({ tutor, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ subject: tutor?.subjects?.[0] || '', mode: 'Online', note: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login', { state: { from: `/teacher/${tutor.user_id}` } }); return; }
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
      setError(err.message || 'Failed to send demo request. Please try again.');
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
        <h3 className="text-xl font-bold text-slate-900 mb-2">Demo Requested!</h3>
        <p className="text-slate-500 mb-6">Your demo request has been sent to <strong>{tutor.name}</strong>. They will confirm the time soon.</p>
        <button onClick={onClose} className="w-full bg-[#0b5ed7] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">Done</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Request Free Demo</h3>
            <p className="text-sm text-slate-500 font-medium mt-0.5">with {tutor.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><X size={20} /></button>
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
              {(tutor.subjects?.length ? tutor.subjects : SUBJECTS).map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Mode</label>
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
            <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Any specific topics? <span className="text-slate-400 font-normal">(optional)</span></label>
            <textarea rows={2} value={form.note} onChange={e => setForm({...form, note: e.target.value})}
              placeholder="e.g. Algebra, Newton's Laws..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0b5ed7] resize-none" />
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 font-medium">Your first demo session is completely FREE. No payment required.</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#0b5ed7] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : <><PlayCircle size={18} /> Request Demo</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const TeacherSearch = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  // Search bar state
  const [subjectQuery, setSubjectQuery] = useState(searchParams.get('subject') || '');
  const [locationQuery, setLocationQuery] = useState('');
  const [debouncedSubject, setDebouncedSubject] = useState(subjectQuery);
  const [debouncedCity, setDebouncedCity] = useState('');

  // Filter state
  const [tutoringMode, setTutoringMode] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minExperience, setMinExperience] = useState('Any');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [sortBy, setSortBy] = useState('Rating');

  // Data state
  const [tutors, setTutors] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [demoTutor, setDemoTutor] = useState(null);

  // Debounce subject input (500ms)
  const debounceTimer = useRef(null);
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSubject(subjectQuery);
      setDebouncedCity(locationQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(debounceTimer.current);
  }, [subjectQuery, locationQuery]);

  // Fetch tutors from Supabase
  const fetchTutors = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await apiTutors.getVisibleTutors({
        subject: debouncedSubject || undefined,
        city: debouncedCity || undefined,
        page: currentPage,
      });
      setTutors(result.data || []);
      setTotalCount(result.count || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      setError('Could not load tutors. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSubject, debouncedCity, currentPage]);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  // Client-side filtering on top of API results
  const filteredTutors = tutors.filter(t => {
    if (verifiedOnly && !t.is_verified) return false;
    if (minRating > 0 && (t.rating || 0) < minRating) return false;
    if (minExperience !== 'Any' && (t.experience_years || 0) < parseInt(minExperience)) return false;
    if (priceRange.min && (t.hourly_rate || 0) < parseInt(priceRange.min)) return false;
    if (priceRange.max && (t.hourly_rate || 0) > parseInt(priceRange.max)) return false;
    if (selectedBoards.length > 0 && !selectedBoards.some(b => t.boards?.includes(b))) return false;
    if (tutoringMode !== 'All') {
      if (tutoringMode === 'Online' && t.mode !== 'Online' && t.mode !== 'Both') return false;
      if (tutoringMode === 'Home' && t.mode !== 'Home Tuition' && t.mode !== 'Both') return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'Price') return (a.hourly_rate || 0) - (b.hourly_rate || 0);
    return 0;
  });

  const toggleBoard = (board) => setSelectedBoards(prev => prev.includes(board) ? prev.filter(b => b !== board) : [...prev, board]);

  const clearAll = () => {
    setSubjectQuery(''); setLocationQuery('');
    setDebouncedSubject(''); setDebouncedCity('');
    setTutoringMode('All'); setVerifiedOnly(false);
    setMinRating(0); setMinExperience('Any');
    setPriceRange({ min: '', max: '' }); setSelectedBoards([]);
    setSortBy('Rating'); setCurrentPage(1);
  };

  const handleDemoClick = (tutor) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/search' } });
      return;
    }
    setDemoTutor(tutor);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 pb-20">
      <TopNavigation />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find your perfect tutor</h1>
        <p className="text-slate-500 mb-6">Search from verified tutors across India</p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl md:rounded-full shadow-sm border border-slate-200 flex flex-col md:flex-row items-center p-2 mb-8 gap-2 md:gap-0">
          <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-2 w-full md:border-r border-slate-200">
            <Search className="text-slate-400 shrink-0" size={20} />
            <input type="text" placeholder="Subject (e.g. Mathematics, Physics)"
              value={subjectQuery} onChange={e => setSubjectQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400" />
            {subjectQuery && <button onClick={() => setSubjectQuery('')}><X size={16} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>
          <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-2 w-full md:border-r border-slate-200">
            <MapPin className="text-slate-400 shrink-0" size={20} />
            <input type="text" placeholder="City (e.g. Mumbai, Delhi)"
              value={locationQuery} onChange={e => setLocationQuery(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400" />
            {locationQuery && <button onClick={() => setLocationQuery('')}><X size={16} className="text-slate-400 hover:text-slate-600" /></button>}
          </div>
          <button onClick={() => { setDebouncedSubject(subjectQuery); setDebouncedCity(locationQuery); setCurrentPage(1); }}
            className="w-full md:w-36 h-12 rounded-xl md:rounded-full bg-[#0b5ed7] text-white font-semibold hover:bg-blue-700 transition-all shrink-0 shadow-md flex items-center justify-center gap-2">
            <Search size={16} /> Search
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2 text-slate-800"><Filter size={18} /> Filters</h3>
                <button onClick={clearAll} className="text-sm text-[#0b5ed7] font-medium hover:underline">Clear all</button>
              </div>
              <div className="space-y-6">
                {/* Mode */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Tutoring Mode</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    {['All', 'Online', 'Home'].map(mode => (
                      <button key={mode} onClick={() => setTutoringMode(mode)}
                        className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${tutoringMode === mode ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-800'}`}>
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Verified */}
                <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setVerifiedOnly(!verifiedOnly)}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${verifiedOnly ? 'bg-[#0b5ed7]' : 'bg-slate-200'}`}>
                    {verifiedOnly && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">Verified Tutors Only</span>
                </label>
                <hr className="border-slate-100" />
                {/* Rating */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-4 flex justify-between">
                    Minimum Rating <span className="text-[#0b5ed7]">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                  </label>
                  <input type="range" min="0" max="5" step="0.5" value={minRating}
                    onChange={e => setMinRating(parseFloat(e.target.value))}
                    className="w-full accent-[#0b5ed7]" />
                </div>
                {/* Experience */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Experience (Years)</label>
                  <select value={minExperience} onChange={e => setMinExperience(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-3 outline-none focus:border-[#0b5ed7]">
                    <option value="Any">Any Experience</option>
                    <option value="2">2+ Years</option>
                    <option value="5">5+ Years</option>
                    <option value="10">10+ Years</option>
                  </select>
                </div>
                {/* Price */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Fee Range (₹/hr)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={priceRange.min}
                      onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#0b5ed7]" />
                    <input type="number" placeholder="Max" value={priceRange.max}
                      onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 outline-none focus:border-[#0b5ed7]" />
                  </div>
                </div>
                {/* Boards */}
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-3 block">Board</label>
                  <div className="flex flex-wrap gap-2">
                    {BOARDS.map(board => {
                      const isSelected = selectedBoards.includes(board);
                      return (
                        <button key={board} onClick={() => toggleBoard(board)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isSelected ? 'bg-[#0b5ed7] text-white' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-[#0b5ed7] hover:text-[#0b5ed7]'}`}>
                          {board}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Sort bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <p className="text-slate-600 font-medium">
                {loading ? 'Searching...' : (
                  <><span className="text-slate-900 font-bold">{totalCount}</span> tutors found{subjectQuery && <> for <span className="text-[#0b5ed7] font-bold">"{subjectQuery}"</span></>}</>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                Sort by:
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer">
                  <option value="Rating">Rating (High to Low)</option>
                  <option value="Price">Price (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
                <AlertCircle size={32} className="mx-auto text-red-400 mb-3" />
                <p className="text-red-700 font-medium">{error}</p>
                <button onClick={fetchTutors} className="mt-3 text-[#0b5ed7] font-semibold hover:underline text-sm">Try again</button>
              </div>
            )}

            {/* Skeletons */}
            {loading && (
              <div className="grid lg:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredTutors.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center shadow-sm">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No tutors found</h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                  {totalCount === 0
                    ? 'No tutors have registered yet. Be the first to sign up as a tutor!'
                    : 'Try adjusting your filters or search terms to see more results.'}
                </p>
                {totalCount > 0 && (
                  <button onClick={clearAll} className="mt-6 text-[#0b5ed7] font-semibold hover:underline">Clear all filters</button>
                )}
              </div>
            )}

            {/* Tutor cards */}
            {!loading && !error && filteredTutors.length > 0 && (
              <>
                <div className="grid lg:grid-cols-2 gap-6">
                  {filteredTutors.map(tutor => (
                    <div key={tutor.user_id || tutor.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
                      <div className="flex gap-4 mb-4">
                        <div className="relative shrink-0">
                          {tutor.photo_url ? (
                            <img
                              src={tutor.photo_url}
                              alt={tutor.name}
                              className="w-16 h-16 rounded-full object-cover shadow-md border border-slate-100"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                              {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                            </div>
                          )}
                          {tutor.is_verified && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                              <ShieldCheck size={16} className="text-emerald-500 fill-emerald-100" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <h3 className="font-bold text-lg text-slate-900 truncate">{tutor.name}</h3>
                              <p className="text-xs text-slate-500 font-medium truncate">{tutor.education || 'Tutor'}</p>
                            </div>
                            {tutor.rating > 0 && (
                              <div className="shrink-0 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-700 border border-amber-100">
                                <Star size={12} className="fill-amber-400 text-amber-400" /> {Number(tutor.rating).toFixed(1)}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {(tutor.subjects || []).slice(0, 3).map(sub => (
                              <span key={sub} className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">{sub}</span>
                            ))}
                            {(tutor.subjects?.length || 0) > 3 && (
                              <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">+{tutor.subjects.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2.5 mb-5 text-sm">
                        <div className="text-slate-600 flex items-center gap-2 font-medium col-span-2">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">{tutor.city || 'Location not set'} • {tutor.mode === 'Both' ? 'Online / Offline' : (tutor.mode || 'Online / Offline')}</span>
                        </div>
                        {tutor.hourly_rate > 0 && (
                          <div className="text-slate-800 font-bold">
                            <span className="text-slate-400 font-normal text-xs mr-1">₹</span>{tutor.hourly_rate}/hr
                          </div>
                        )}
                        {tutor.experience_years > 0 && (
                          <div className="text-slate-600 flex items-center gap-1.5 font-medium">
                            <Briefcase size={14} className="text-slate-400 shrink-0" />
                            {tutor.experience_years} yrs exp
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
                        <button onClick={() => navigate(`/teacher/${tutor.user_id}`)}
                          className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors text-sm">
                          View Profile
                        </button>
                        <button onClick={() => handleDemoClick(tutor)}
                          className="flex-1 bg-[#0b5ed7] text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm text-sm">
                          Request Demo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-semibold text-slate-700 px-4">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Demo Modal */}
      {demoTutor && (
        <DemoModal tutor={demoTutor} onClose={() => setDemoTutor(null)} onSuccess={() => setDemoTutor(null)} />
      )}
    </div>
  );
};

export default TeacherSearch;
