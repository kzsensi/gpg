import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequirements } from '../../services/api';
import {
  User, Phone, MapPin, BookOpen, Monitor, Home, Clock, IndianRupee, FileText, Send, Shield, CheckCircle2, Headphones, PlayCircle, Users, MessageCircle, ChevronDown, Sun, Moon, Zap, AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const cities = ['New Delhi', 'Gurgaon', 'Noida', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Chandigarh', 'Lucknow', 'Ahmedabad', 'Indore', 'Bhopal'];
const classesList = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Graduate', 'Post Graduate', 'Competitive Exams'];
const subjectsList = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Studies', 'Computer Science', 'Accounts', 'Economics', 'Sanskrit', 'French', 'German', 'Music', 'Art & Craft'];
const boardsList = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'];

const PostRequirement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    studentName: user?.user_metadata?.name || '',
    phone: '',
    city: '',
    area: '',
    studentClass: '',
    board: '',
    notes: ''
  });

  const [mode, setMode] = useState('home');
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [preferredTime, setPreferredTime] = useState('flexible');
  const [feeRange, setFeeRange] = useState([3000, 8000]);
  const [freeDemo, setFreeDemo] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const toggleSubject = (sub) => {
    setSelectedSubjects((prev) => prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!formData.studentName || !formData.phone || !formData.city || !formData.area || !formData.studentClass || selectedSubjects.length === 0) {
      setError("Please fill in all required fields marked with *");
      setShowErrors(true);

      // Find first empty field and scroll to it
      let firstEmptyId = '';
      if (!formData.studentName) firstEmptyId = 'studentName';
      else if (!formData.phone) firstEmptyId = 'phone';
      else if (!formData.city) firstEmptyId = 'city';
      else if (!formData.area) firstEmptyId = 'area';
      else if (!formData.studentClass) firstEmptyId = 'studentClass';
      else if (selectedSubjects.length === 0) firstEmptyId = 'subjects';

      if (firstEmptyId) {
        const el = document.getElementById(firstEmptyId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => el.focus?.(), 300);
        }
      }
      return;
    }

    setLoading(true);
    try {
      await apiRequirements.create({
        parent_id: user.id,
        student_name: formData.studentName,
        phone: formData.phone,
        city: formData.city,
        area: formData.area,
        class_level: formData.studentClass,
        // board is intentionally omitted as it's not in the DB schema
        subjects: selectedSubjects,
        mode: mode,
        sessions_per_week: sessionsPerWeek,
        preferred_time: preferredTime,
        min_budget: feeRange[0],
        max_budget: feeRange[1],
        status: 'active'
      });
      setSuccess(true);
      setShowErrors(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to post requirement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout type="parent">
      <div className="mb-8">
        <div className="bg-gradient-to-r from-[#0b5ed7] to-indigo-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20" />
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-bold">Post Your Tuition Requirement</h1>
            <p className="text-blue-100 mt-2 text-sm md:text-base max-w-xl">
              Tell us what you need and we'll connect you with verified, experienced tutors in your area
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {success ? (
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Requirement Posted Successfully!</h2>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                Your requirement is now live. Verified tutors in {formData.city} will start applying soon. You can track applications in your dashboard.
              </p>
              <button 
                onClick={() => navigate('/parent/requirements')}
                className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Go to My Requirements
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-600 shrink-0" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                )}

                {/* Parent/Student Info */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><User size={18} className="text-[#0b5ed7]" /> Parent / Student Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Parent / Student Name *</label>
                      <input
                        id="studentName"
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => handleInputChange('studentName', e.target.value)}
                        placeholder="e.g., Pooja Sharma"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:border-[#0b5ed7] outline-none transition-all ${
                          showErrors && !formData.studentName ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Mobile Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 bg-slate-50 border border-r-0 border-slate-200 rounded-l-xl text-sm text-slate-600 font-medium">+91</span>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="98765 43210"
                          className={`w-full px-4 py-2.5 rounded-r-xl border text-sm text-slate-800 focus:border-[#0b5ed7] outline-none transition-all ${
                            showErrors && !formData.phone ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-[#0b5ed7]" /> Location Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Country</label>
                      <div className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">🇮🇳 India</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">City *</label>
                      <div className="relative">
                        <select
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:border-[#0b5ed7] outline-none appearance-none cursor-pointer transition-all ${
                            showErrors && !formData.city ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                          }`}
                        >
                          <option value="">Select City</option>
                          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Area / Sector *</label>
                      <input
                        id="area"
                        type="text"
                        value={formData.area}
                        onChange={(e) => handleInputChange('area', e.target.value)}
                        placeholder="e.g., Sector 15"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:border-[#0b5ed7] outline-none transition-all ${
                          showErrors && !formData.area ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><BookOpen size={18} className="text-[#0b5ed7]" /> Academic Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Class / Level *</label>
                      <div className="relative">
                        <select
                          id="studentClass"
                          value={formData.studentClass}
                          onChange={(e) => handleInputChange('studentClass', e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 focus:border-[#0b5ed7] outline-none appearance-none cursor-pointer transition-all ${
                            showErrors && !formData.studentClass ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                          }`}
                        >
                          <option value="">Select Class</option>
                          {classesList.map((cls) => <option key={cls} value={cls}>{cls}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Board (optional)</label>
                      <div className="relative">
                        <select value={formData.board} onChange={(e) => handleInputChange('board', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] outline-none appearance-none cursor-pointer">
                          <option value="">Select Board</option>
                          {boardsList.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Subject(s) *</label>
                      <div
                        id="subjects"
                        className={`min-h-[44px] px-4 py-2 rounded-xl border text-sm cursor-pointer flex flex-wrap gap-2 items-center focus-within:border-[#0b5ed7] transition-all ${
                          showErrors && selectedSubjects.length === 0 ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                        }`}
                        onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                      >
                        {selectedSubjects.length === 0 && <span className="text-slate-400">Select subjects...</span>}
                        {selectedSubjects.map((sub) => (
                          <span key={sub} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#0b5ed7] text-xs font-medium rounded-lg border border-blue-100">
                            {sub}
                            <button onClick={(e) => { e.stopPropagation(); toggleSubject(sub); }} className="hover:text-red-500 transition-colors ml-0.5 cursor-pointer">×</button>
                          </span>
                        ))}
                      </div>
                      {showSubjectDropdown && (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 shadow-lg max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {subjectsList.map((sub) => (
                              <button key={sub} onClick={() => toggleSubject(sub)} className={`text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${selectedSubjects.includes(sub) ? 'bg-[#0b5ed7] text-white font-medium' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Monitor size={18} className="text-[#0b5ed7]" /> Tuition Mode</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setMode('home')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all cursor-pointer ${mode === 'home' ? 'border-[#0b5ed7] bg-blue-50 text-[#0b5ed7]' : 'border-slate-200 text-slate-600'}`}><Home size={18} /> Home Tuition</button>
                    <button onClick={() => setMode('online')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all cursor-pointer ${mode === 'online' ? 'border-[#0b5ed7] bg-blue-50 text-[#0b5ed7]' : 'border-slate-200 text-slate-600'}`}><Monitor size={18} /> Online Tuition</button>
                  </div>
                </div>

                {/* Sessions & Time */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Clock size={18} className="text-[#0b5ed7]" /> Schedule Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-1.5">Sessions per Week</label>
                      <div className="relative">
                        <select value={sessionsPerWeek} onChange={(e) => setSessionsPerWeek(Number(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] outline-none appearance-none cursor-pointer">
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'session' : 'sessions'}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-600 mb-3">Preferred Time</label>
                      <div className="flex gap-2">
                        {[{ key: 'morning', label: 'Morning', icon: Sun }, { key: 'evening', label: 'Evening', icon: Moon }, { key: 'flexible', label: 'Flexible', icon: Zap }].map((time) => {
                          const Icon = time.icon;
                          return (
                            <button key={time.key} onClick={() => setPreferredTime(time.key)} className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${preferredTime === time.key ? 'border-[#0b5ed7] bg-blue-50 text-[#0b5ed7]' : 'border-slate-200 text-slate-500'}`}>
                              <Icon size={16} />{time.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Range */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><IndianRupee size={18} className="text-[#0b5ed7]" /> Expected Fee Range (₹/month)</h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-[#0b5ed7]">₹{feeRange[0].toLocaleString()} — ₹{feeRange[1].toLocaleString()}</span>
                      <span className="text-xs text-slate-500">per month</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Minimum</label>
                        <input type="range" min="500" max="25000" step="500" value={feeRange[0]} onChange={(e) => setFeeRange([Math.min(Number(e.target.value), feeRange[1]), feeRange[1]])} className="w-full accent-[#0b5ed7] cursor-pointer" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">Maximum</label>
                        <input type="range" min="500" max="25000" step="500" value={feeRange[1]} onChange={(e) => setFeeRange([feeRange[0], Math.max(Number(e.target.value), feeRange[0])])} className="w-full accent-[#0b5ed7] cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <PlayCircle size={20} className="text-emerald-600" />
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Free Demo Required?</p>
                      <p className="text-xs text-slate-500">Request a free trial class before hiring</p>
                    </div>
                  </div>
                  <button onClick={() => setFreeDemo(!freeDemo)} className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${freeDemo ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${freeDemo ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5"><span className="flex items-center gap-2"><FileText size={16} className="text-[#0b5ed7]" /> Additional Notes (optional)</span></label>
                  <textarea rows={4} value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} placeholder="Any special requirements, preferred teaching style, specific topics to focus on..." className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] outline-none transition-all placeholder:text-slate-400 resize-none" />
                </div>

                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-[#0b5ed7] to-indigo-600 text-white rounded-xl font-semibold text-base hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send size={18} /> Submit Requirement</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-5">
          {/* What Happens Next */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-semibold text-slate-900 mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'We Review Your Requirement', desc: 'Our team reviews and matches you with the best tutors in your area within 2 hours.', icon: CheckCircle2, color: 'text-[#0b5ed7]', bg: 'bg-blue-50' },
                { step: '2', title: 'Tutors Respond to You', desc: 'Verified tutors send you their profiles, experience details, and proposed fees.', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { step: '3', title: 'Schedule a Free Demo', desc: 'Pick your preferred tutor and schedule a free demo class before committing.', icon: PlayCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex gap-3">
                    <div className={`${item.bg} w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}><Icon size={18} className={item.color} /></div>
                    <div><p className="font-medium text-sm text-slate-900">{item.title}</p><p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '10,000+', label: 'Happy Parents' }, { value: '5,000+', label: 'Verified Tutors' },
                { value: '50+', label: 'Cities Covered' }, { value: '4.8★', label: 'Average Rating' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 bg-slate-50 rounded-xl">
                  <p className="text-lg font-bold text-slate-900">{stat.value}</p><p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostRequirement;
