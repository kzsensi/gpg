import React, { useState } from 'react';
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
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const ParentProfile = () => {
  const [editing, setEditing] = useState(false);

  const [parentInfo, setParentInfo] = useState({
    name: 'Pooja Sharma',
    email: 'pooja.sharma@gmail.com',
    phone: '+91 98765 43210',
    city: 'Gurgaon',
    area: 'Sector 15, Gurgaon',
    state: 'Haryana',
  });

  const [childInfo, setChildInfo] = useState({
    name: 'Arjun Sharma',
    class: 'Class 10',
    board: 'CBSE',
    school: 'Delhi Public School, Gurgaon',
    subjects: 'Mathematics, Science, English',
  });

  return (
    <DashboardLayout type="parent">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your profile & child details</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
            editing
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {editing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#0b5ed7] to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                P
              </div>
              <button className="absolute bottom-1 right-1 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <Camera size={16} className="text-slate-600" />
              </button>
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{parentInfo.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{parentInfo.email}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Shield size={14} className="text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Verified Parent</span>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span className="text-slate-700">{parentInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-slate-400" />
                <span className="text-slate-700">{parentInfo.area}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span className="text-slate-700">{parentInfo.email}</span>
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
                { label: 'Full Name', value: parentInfo.name, key: 'name' },
                { label: 'Email Address', value: parentInfo.email, key: 'email' },
                { label: 'Phone Number', value: parentInfo.phone, key: 'phone' },
                { label: 'City', value: parentInfo.city, key: 'city' },
                { label: 'Area / Locality', value: parentInfo.area, key: 'area' },
                { label: 'State', value: parentInfo.state, key: 'state' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        setParentInfo({ ...parentInfo, [field.key]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-800">{field.value}</p>
                  )}
                </div>
              ))}
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
                { label: 'Child Name', value: childInfo.name, key: 'name', icon: User },
                { label: 'Class / Grade', value: childInfo.class, key: 'class', icon: BookOpen },
                { label: 'Board', value: childInfo.board, key: 'board', icon: School },
                { label: 'School Name', value: childInfo.school, key: 'school', icon: School },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                  {editing ? (
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        setChildInfo({ ...childInfo, [field.key]: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                    />
                  ) : (
                    <p className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm text-slate-800">{field.value}</p>
                  )}
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Subjects of Interest</label>
                {editing ? (
                  <input
                    type="text"
                    value={childInfo.subjects}
                    onChange={(e) => setChildInfo({ ...childInfo, subjects: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-[#0b5ed7] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {childInfo.subjects.split(',').map((sub, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-blue-50 text-[#0b5ed7] text-sm font-medium rounded-lg border border-blue-100"
                      >
                        {sub.trim()}
                      </span>
                    ))}
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
              <p className="font-semibold text-emerald-800">Profile Verified</p>
              <p className="text-sm text-emerald-600 mt-0.5">
                Your profile has been verified. Teachers can see your verified badge.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentProfile;
