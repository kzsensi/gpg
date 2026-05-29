import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Camera, Save, GraduationCap, School, BookOpen, Edit3, Shield, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Check
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { uploadAvatar } from '../../lib/imageUpload';

const ParentProfile = () => {
  const { user, profile, profileComplete, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const fileInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const url = await uploadAvatar(user.id, file);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: url }
      });
      if (updateError) throw updateError;
      
      await refreshProfile();
      setSuccessMsg('Profile picture updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError('Failed to upload profile picture: ' + err.message);
    } finally {
      setUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };
  
  const [isWizard, setIsWizard] = useState(!profileComplete);
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState('parent'); // 'parent' or 'student'
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    area: '',
    state: '',
    childName: '',
    childClass: '',
    childBoard: '',
    childSchool: '',
    childSubjects: '',
  });

  useEffect(() => {
    if (user) {
      const m = user.user_metadata || {};
      setFormData({
        name: m.name || '',
        phone: m.phone || '',
        city: m.city || '',
        area: m.area || '',
        state: m.state || '',
        childName: m.childName || '',
        childClass: m.childClass || '',
        childBoard: m.childBoard || '',
        childSchool: m.childSchool || '',
        childSubjects: m.childSubjects || '',
      });
      if (m.childName && m.childName === m.name) {
        setAccountType('student');
      }
    }
  }, [user]);

  // Sync if profile completes externally
  useEffect(() => {
    if (profileComplete && isWizard && currentStep === 1 && !loading) {
      setIsWizard(false);
    }
  }, [profileComplete, isWizard, currentStep, loading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (isFromWizard = false) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // If student account, childName is same as user name
      const finalChildName = accountType === 'student' ? formData.name : formData.childName;
      
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          area: formData.area,
          state: formData.state,
          childName: finalChildName,
          childClass: formData.childClass,
          childBoard: formData.childBoard,
          childSchool: formData.childSchool,
          childSubjects: formData.childSubjects
        }
      });

      if (updateError) throw updateError;

      await refreshProfile();
      
      if (isFromWizard) {
        setIsWizard(false);
        navigate('/parent/dashboard');
      } else {
        setSuccessMsg('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : 'P';

  // WIZARD VALIDATION
  const canProceedToStep2 = () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.area.trim()) return false;
    return true;
  };

  const canProceedToStep3 = () => {
    if (accountType === 'parent' && !formData.childName.trim()) return false;
    if (!formData.childClass.trim() || !formData.childSubjects.trim()) return false;
    return true;
  };

  // ----------------------------------------------------
  // WIZARD UI
  // ----------------------------------------------------
  if (isWizard) {
    return (
      <DashboardLayout type="parent">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Complete Your Profile</h1>
            <p className="text-slate-500 mt-1 text-sm">Please provide a few details so tutors can understand your requirements.</p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { id: 1, label: 'Account Setup' },
              { id: 2, label: 'Academic Details' },
              { id: 3, label: 'Review & Finish' }
            ].map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  currentStep === step.id 
                    ? 'bg-[#0b5ed7] text-white shadow-md' 
                    : currentStep > step.id 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {currentStep > step.id ? <Check size={16} /> : <span>{step.id}</span>}
                  {step.label}
                </div>
                {idx < 2 && <ChevronRight size={16} className="text-slate-300 shrink-0" />}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm font-medium text-red-800 leading-tight">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-3">Who is this platform for? <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setAccountType('parent')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        accountType === 'parent' ? 'border-[#0b5ed7] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h3 className={`font-bold ${accountType === 'parent' ? 'text-[#0b5ed7]' : 'text-slate-700'}`}>For My Child</h3>
                      <p className="text-sm text-slate-500 mt-1">I am looking for a tutor for my son/daughter.</p>
                    </button>
                    <button
                      onClick={() => setAccountType('student')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        accountType === 'student' ? 'border-[#0b5ed7] bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <h3 className={`font-bold ${accountType === 'student' ? 'text-[#0b5ed7]' : 'text-slate-700'}`}>For Myself</h3>
                      <p className="text-sm text-slate-500 mt-1">I am a student looking for a tutor for myself.</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{accountType === 'parent' ? "Your Full Name (Parent)" : "Your Full Name"} <span className="text-red-500">*</span></label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">City <span className="text-red-500">*</span></label>
                    <input name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. New Delhi" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Area / Locality <span className="text-red-500">*</span></label>
                    <input name="area" value={formData.area} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Vasant Kunj" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Delhi" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                {accountType === 'parent' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Child's Name <span className="text-red-500">*</span></label>
                    <input name="childName" value={formData.childName} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Arjun Sharma" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Class / Grade <span className="text-red-500">*</span></label>
                    <input name="childClass" value={formData.childClass} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Class 10" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Board / University</label>
                    <input name="childBoard" value={formData.childBoard} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. CBSE" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">School Name</label>
                    <input name="childSchool" value={formData.childSchool} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Delhi Public School" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subjects you need help with <span className="text-red-500">*</span></label>
                  <input name="childSubjects" value={formData.childSubjects} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none" placeholder="e.g. Mathematics, Science, English" />
                  <p className="text-xs text-slate-500 mt-1.5">Separate multiple subjects with commas.</p>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-200 pb-3">Review Your Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">{formData.name}</span></div>
                    <div><span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-800">{formData.phone}</span></div>
                    <div><span className="text-slate-500">Location:</span> <span className="font-semibold text-slate-800">{formData.area}, {formData.city}</span></div>
                    {accountType === 'parent' && <div><span className="text-slate-500">Child's Name:</span> <span className="font-semibold text-slate-800">{formData.childName}</span></div>}
                    <div><span className="text-slate-500">Class:</span> <span className="font-semibold text-slate-800">{formData.childClass}</span></div>
                    <div className="md:col-span-2"><span className="text-slate-500">Subjects:</span> <span className="font-semibold text-slate-800">{formData.childSubjects}</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium">
                  <CheckCircle2 className="shrink-0 text-blue-600 mt-0.5" size={18} />
                  <p>By saving, your profile will be marked complete and you can start exploring and booking demos with tutors!</p>
                </div>
              </div>
            )}

            {/* WIZARD FOOTER */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button onClick={() => setCurrentStep(prev => prev - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors">
                  <ChevronLeft size={18} /> Back
                </button>
              ) : <div></div>}

              {currentStep < 3 ? (
                <button 
                  onClick={() => setCurrentStep(prev => prev + 1)} 
                  disabled={currentStep === 1 ? !canProceedToStep2() : !canProceedToStep3()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#0b5ed7] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                >
                  Next Step <ChevronRight size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => handleSave(true)} 
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md disabled:opacity-50 transition-all"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                  Complete Profile
                </button>
              )}
            </div>

          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ----------------------------------------------------
  // STANDARD PROFILE VIEW (Editing existing profile)
  // ----------------------------------------------------
  return (
    <DashboardLayout type="parent">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your profile & {accountType === 'parent' ? 'child' : 'academic'} details</p>
        </div>
        
        {editing ? (
          <div className="flex gap-3">
             <button
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 text-white hover:bg-emerald-700 shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
          >
            <Edit3 size={18} /> Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-red-800 leading-tight">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <p className="text-sm font-medium text-emerald-800 leading-tight">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4 group">
              {uploadingPhoto ? (
                <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-lg">
                  <div className="w-8 h-8 border-4 border-[#0b5ed7] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : user?.user_metadata?.avatar_url || user?.user_metadata?.photo_url ? (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.photo_url}
                  alt={formData.name}
                  className="w-28 h-28 rounded-full object-cover shadow-lg border-2 border-slate-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {getInitial(formData.name)}
                </div>
              )}
              <button
                type="button"
                onClick={handlePhotoUploadClick}
                disabled={uploadingPhoto}
                className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                title="Change profile picture"
              >
                <Camera size={16} className="text-slate-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{formData.name || 'Student'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{user?.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Verified {accountType === 'student' ? 'Student' : 'Parent'}</span>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span className={formData.phone ? "text-slate-700" : "text-slate-400 italic"}>
                  {formData.phone || 'Phone not added'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-slate-400" />
                <span className={formData.area ? "text-slate-700" : "text-slate-400 italic"}>
                  {formData.area ? `${formData.area}, ${formData.city}` : 'Location not added'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User size={18} className="text-[#0b5ed7]" />
              </div>
              <h2 className="font-semibold text-lg text-slate-900">Personal Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', name: 'name', type: 'text' },
                { label: 'Phone Number', name: 'phone', type: 'tel' },
                { label: 'City', name: 'city', type: 'text' },
                { label: 'Area / Locality', name: 'area', type: 'text' },
                { label: 'State', name: 'state', type: 'text' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  ) : (
                    <p className={`px-4 py-2.5 bg-slate-50 rounded-xl text-sm ${formData[field.name] ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {formData[field.name] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
              <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
                  <p className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                     {user?.email}
                  </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-purple-50 rounded-lg">
                <GraduationCap size={18} className="text-purple-600" />
              </div>
              <h2 className="font-semibold text-lg text-slate-900">Academic Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {accountType === 'parent' && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Child's Name</label>
                  {editing ? (
                    <input
                      name="childName"
                      type="text"
                      value={formData.childName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0b5ed7] outline-none"
                    />
                  ) : (
                    <p className={`px-4 py-2.5 bg-slate-50 rounded-xl text-sm ${formData.childName ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {formData.childName || 'Not provided'}
                    </p>
                  )}
                </div>
              )}
              
              {[
                { label: 'Class / Grade', name: 'childClass' },
                { label: 'Board', name: 'childBoard' },
                { label: 'School Name', name: 'childSchool' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      name={field.name}
                      type="text"
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0b5ed7] outline-none"
                    />
                  ) : (
                    <p className={`px-4 py-2.5 bg-slate-50 rounded-xl text-sm ${formData[field.name] ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {formData[field.name] || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Subjects of Interest</label>
                {editing ? (
                  <input
                    name="childSubjects"
                    type="text"
                    value={formData.childSubjects}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#0b5ed7] outline-none"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.childSubjects ? formData.childSubjects.split(',').map((sub, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-[#0b5ed7] text-sm font-medium rounded-lg border border-blue-100">
                        {sub.trim()}
                      </span>
                    )) : (
                      <span className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-400 italic w-full">
                        Not provided
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentProfile;
