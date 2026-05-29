import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiTutors } from '../../services/api';
import { supabase } from '../../lib/supabase';
import {
  User, BookOpen, Briefcase, Save, Check, ChevronRight, ChevronLeft, AlertCircle, GraduationCap
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Subjects & Boards', icon: BookOpen },
  { id: 3, label: 'Experience', icon: Briefcase },
];

const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accountancy', 'History', 'Geography', 'Political Science', 'Science', 'Social Studies', 'Sanskrit', 'French'];
const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Cambridge'];
const classOptions = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Graduate', 'Competitive Exams'];
const cityOptions = ['New Delhi', 'Gurgaon', 'Noida', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur', 'Chandigarh', 'Lucknow', 'Ahmedabad', 'Indore', 'Bhopal'];
const modeOptions = ['Home Tuition', 'Online', 'Both'];

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    bio: '',
    education: '',
    mode: 'Both',
    experience_years: 2,
    hourly_rate: 500
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedBoards, setSelectedBoards] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  // Pre-populate from existing profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.user_metadata?.name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        bio: profile.bio || '',
        education: profile.education || '',
        mode: profile.mode || 'Both',
        experience_years: profile.experience_years || 2,
        hourly_rate: profile.hourly_rate || 500
      });
      if (profile.subjects?.length) setSelectedSubjects(profile.subjects);
      if (profile.boards?.length) setSelectedBoards(profile.boards);
      if (profile.classes?.length) setSelectedClasses(profile.classes);
    } else if (user) {
      setFormData(prev => ({ ...prev, name: user.user_metadata?.name || '' }));
    }
  }, [profile, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleItem = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const canProceedStep1 = () => !!(formData.name?.trim() && formData.phone?.trim() && formData.city?.trim());
  const canProceedStep2 = () => selectedSubjects.length > 0;
  const canSave = () => canProceedStep1() && canProceedStep2() && formData.experience_years !== '';

  const handleSave = async () => {
    setError(null);
    if (!formData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (selectedSubjects.length === 0) {
      setError('Please select at least one subject you teach.');
      setCurrentStep(2);
      return;
    }

    setLoading(true);
    try {
      // 1. Update user metadata first (this matches Parent Profile flow, works immediately, no RLS block)
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          name: formData.name.trim(),
          phone: formData.phone,
          city: formData.city,
          role: 'tutor',
          subjects: selectedSubjects,
        }
      });

      if (metaError) throw new Error(`Metadata update failed: ${metaError.message}`);

      // 2. Try to save to tutor_profiles table, but with a timeout so it never hangs indefinitely
      const upsertPromise = apiTutors.upsertProfile(user.id, {
        email: user.email,
        name: formData.name.trim(),
        phone: formData.phone,
        city: formData.city,
        bio: formData.bio,
        education: formData.education,
        mode: formData.mode,
        experience_years: parseInt(formData.experience_years) || 0,
        hourly_rate: parseInt(formData.hourly_rate) || 0,
        subjects: selectedSubjects,
        boards: selectedBoards,
        classes: selectedClasses,
        is_visible: true,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database profile table query timed out. Please check if Supabase RLS policies are set up correctly.')), 3500)
      );

      await Promise.race([upsertPromise, timeoutPromise]);
      
      await refreshProfile();
      setIsSaved(true);
      window.scrollTo(0, 0);
    } catch (err) {
      setError(`Error in save: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (isSaved) {
    return (
      <DashboardLayout type="tutor">
        <div className="max-w-3xl mx-auto py-12 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Profile Saved Successfully!</h1>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
            Your tutor profile is now live and visible to parents and students. They can now find you in search results and request demos.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/tutor/dashboard')}
              className="px-6 py-3 bg-[#0b5ed7] text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => setIsSaved(false)}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            >
              Edit Profile Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inputCls = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-50 outline-none transition-all";
  const labelCls = "block text-sm font-semibold text-slate-700 mb-1.5";

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Rahul Mehta"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={inputCls + " cursor-pointer"}
                >
                  <option value="">Select City</option>
                  {cityOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Education / Qualification</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => handleInputChange('education', e.target.value)}
                  placeholder="e.g., B.Tech IIT Delhi, M.Sc Mathematics"
                  className={inputCls}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>Teaching Mode</label>
                <div className="flex gap-3">
                  {modeOptions.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleInputChange('mode', m)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                        formData.mode === m
                          ? 'border-[#0b5ed7] bg-blue-50 text-[#0b5ed7]'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>About You (Bio)</label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Passionate Mathematics and Physics tutor with 5+ years of experience. I specialise in making complex concepts simple..."
                  className={inputCls + " resize-none"}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Subjects */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Subjects You Teach *
                {selectedSubjects.length > 0 && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {selectedSubjects.length} selected
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2.5">
                {subjectOptions.map((subject) => {
                  const sel = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => toggleItem(selectedSubjects, setSelectedSubjects, subject)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all ${
                        sel
                          ? 'border-[#0b5ed7] bg-blue-50 text-[#0b5ed7]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {sel && <Check size={13} />}
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Boards */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Boards You Teach</label>
              <div className="flex flex-wrap gap-2.5">
                {boardOptions.map((board) => {
                  const sel = selectedBoards.includes(board);
                  return (
                    <button
                      key={board}
                      type="button"
                      onClick={() => toggleItem(selectedBoards, setSelectedBoards, board)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all ${
                        sel
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {sel && <Check size={13} />}
                      {board}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Classes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Classes You Teach
                {selectedClasses.length > 0 && (
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                    {selectedClasses.length} selected
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {classOptions.map((cls) => {
                  const sel = selectedClasses.includes(cls);
                  return (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => toggleItem(selectedClasses, setSelectedClasses, cls)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                        sel
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {sel && <Check size={11} />}
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Teaching Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience_years}
                  onChange={(e) => handleInputChange('experience_years', e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-slate-400 mt-1.5">Displayed on your profile as "X years experience"</p>
              </div>
              <div>
                <label className={labelCls}>Hourly Rate (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={formData.hourly_rate}
                    onChange={(e) => handleInputChange('hourly_rate', e.target.value)}
                    className={inputCls + " pl-7"}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Shown as "₹{formData.hourly_rate}/hr" on your public profile</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-800 mb-1">Profile Visibility</p>
              <p className="text-xs text-amber-700">
                Your profile will be <strong>publicly visible</strong> in the tutor search as soon as you save. 
                An admin may verify it to show a ✓ badge.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-slate-700 mb-3">Profile Summary</p>
              <div className="text-sm text-slate-600 space-y-1.5">
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">Name:</span>{formData.name || '—'}</div>
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">City:</span>{formData.city || '—'}</div>
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">Mode:</span>{formData.mode || '—'}</div>
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">Education:</span>{formData.education || '—'}</div>
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">Subjects:</span>{selectedSubjects.length > 0 ? selectedSubjects.join(', ') : '—'}</div>
                <div className="flex gap-2"><span className="font-medium text-slate-800 w-28">Boards:</span>{selectedBoards.length > 0 ? selectedBoards.join(', ') : '—'}</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile Builder</h1>
          <p className="text-sm text-slate-500 mt-1">Build a compelling profile that attracts parents and students</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* Step indicators */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const active = currentStep === step.id;
            const completed = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? 'bg-[#0b5ed7] text-white border-[#0b5ed7] shadow-md'
                      : completed
                      ? 'bg-blue-50 text-[#0b5ed7] border-blue-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {completed ? <Check size={15} /> : <Icon size={15} />}
                  {step.label}
                </button>
                {idx < steps.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full flex-shrink-0 ${completed ? 'bg-[#0b5ed7]' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 mb-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            {React.createElement(steps[currentStep - 1].icon, { size: 20, className: 'text-[#0b5ed7]' })}
            <h2 className="text-lg font-bold text-slate-900">{steps[currentStep - 1].label}</h2>
          </div>
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {currentStep === steps.length ? (
            <button
              onClick={handleSave}
              disabled={loading || !canSave()}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#0b5ed7] to-indigo-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Saving...' : 'Save & Publish Profile'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
              disabled={currentStep === 1 ? !canProceedStep1() : currentStep === 2 ? !canProceedStep2() : false}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0b5ed7] text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileBuilder;
