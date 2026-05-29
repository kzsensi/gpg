import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  GraduationCap,
  School,
  BookOpen,
  Edit3,
  Shield,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ParentProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Initialize with empty strings
  const [parentInfo, setParentInfo] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    area: '',
    state: '',
  });

  const [childInfo, setChildInfo] = useState({
    name: '',
    class: '',
    board: '',
    school: '',
    subjects: '',
  });

  // Load actual data from user_metadata when component mounts
  useEffect(() => {
    if (user) {
      setParentInfo({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        city: user.user_metadata?.city || '',
        area: user.user_metadata?.area || '',
        state: user.user_metadata?.state || '',
      });

      setChildInfo({
        name: user.user_metadata?.childName || '',
        class: user.user_metadata?.childClass || '',
        board: user.user_metadata?.childBoard || '',
        school: user.user_metadata?.childSchool || '',
        subjects: user.user_metadata?.childSubjects || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Save all extra details into the auth.users metadata field
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        name: parentInfo.name, // Name is standard
        phone: parentInfo.phone,
        city: parentInfo.city,
        area: parentInfo.area,
        state: parentInfo.state,
        childName: childInfo.name,
        childClass: childInfo.class,
        childBoard: childInfo.board,
        childSchool: childInfo.school,
        childSubjects: childInfo.subjects
      }
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Refresh context so the whole app knows the profile is complete
    await refreshProfile();
    
    setSuccessMsg('Profile updated successfully!');
    setEditing(false);
    setLoading(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'P';
  };

  return (
    <DashboardLayout type="parent">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your profile & child details</p>
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
              onClick={handleSave}
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

      {/* Notifications */}
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

      {/* Warning for incomplete profile */}
      {!user?.user_metadata?.phone && !editing && (
         <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
         <AlertCircle size={20} className="text-amber-600 shrink-0" />
         <p className="text-sm font-medium text-amber-800 leading-tight">
           Please complete your profile details below by clicking "Edit Profile" so tutors can contact you.
         </p>
       </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {getInitial(parentInfo.name)}
              </div>
              <button className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <Camera size={16} className="text-slate-600" />
              </button>
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{parentInfo.name || 'New Parent'}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{parentInfo.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Verified Parent</span>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span className={parentInfo.phone ? "text-slate-700" : "text-slate-400 italic"}>
                  {parentInfo.phone || 'Phone not added'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-slate-400" />
                <span className={parentInfo.area ? "text-slate-700" : "text-slate-400 italic"}>
                  {parentInfo.area ? `${parentInfo.area}, ${parentInfo.city}` : 'Location not added'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-700 truncate">{parentInfo.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parent Info + Child Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parent Information */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User size={18} className="text-[#0b5ed7]" />
              </div>
              <h2 className="font-semibold text-lg text-slate-900">Parent Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Full Name', value: parentInfo.name, key: 'name', type: 'text' },
                { label: 'Phone Number', value: parentInfo.phone, key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
                { label: 'City', value: parentInfo.city, key: 'city', type: 'text', placeholder: 'New Delhi' },
                { label: 'Area / Locality', value: parentInfo.area, key: 'area', type: 'text', placeholder: 'Sector 15' },
                { label: 'State', value: parentInfo.state, key: 'state', type: 'text', placeholder: 'Delhi' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      type={field.type}
                      value={field.value}
                      placeholder={field.placeholder || ''}
                      onChange={(e) =>
                        setParentInfo({ ...parentInfo, [field.key]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  ) : (
                    <p className={`px-4 py-2.5 bg-slate-50 rounded-xl text-sm ${field.value ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {field.value || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
              <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">Email Address</label>
                  <p className="px-4 py-2.5 bg-slate-100 rounded-xl text-sm text-slate-500 cursor-not-allowed">
                     {parentInfo.email}
                  </p>
                  {editing && <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>}
              </div>
            </div>
          </div>

          {/* Child Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
              <div className="p-2 bg-purple-50 rounded-lg">
                <GraduationCap size={18} className="text-purple-600" />
              </div>
              <h2 className="font-semibold text-lg text-slate-900">Child Details</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Child Name', value: childInfo.name, key: 'name', placeholder: 'Arjun Sharma' },
                { label: 'Class / Grade', value: childInfo.class, key: 'class', placeholder: 'Class 10' },
                { label: 'Board', value: childInfo.board, key: 'board', placeholder: 'CBSE' },
                { label: 'School Name', value: childInfo.school, key: 'school', placeholder: 'Delhi Public School' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={field.value}
                      placeholder={field.placeholder}
                      onChange={(e) =>
                        setChildInfo({ ...childInfo, [field.key]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  ) : (
                    <p className={`px-4 py-2.5 bg-slate-50 rounded-xl text-sm ${field.value ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                      {field.value || 'Not provided'}
                    </p>
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Subjects of Interest</label>
                {editing ? (
                  <input
                    type="text"
                    value={childInfo.subjects}
                    placeholder="e.g. Mathematics, Science, English"
                    onChange={(e) => setChildInfo({ ...childInfo, subjects: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {childInfo.subjects ? childInfo.subjects.split(',').map((sub, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-blue-50 text-[#0b5ed7] text-sm font-medium rounded-lg border border-blue-100"
                      >
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

          {/* Verification Badge */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <CheckCircle2 size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Account Active</p>
              <p className="text-sm text-emerald-600 mt-0.5">
                Your parent account is verified and active. Tutors will see your contact details only when you book a demo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentProfile;
