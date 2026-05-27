import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Settings, Bell, Lock, Mail, Phone, Globe, LogOut, Shield, Moon, Sun, Trash2, Star, CheckCircle2 } from 'lucide-react';

const ParentSettings = () => {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const Toggle = ({ on, toggle }) => (
    <button onClick={toggle} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-[#0b5ed7]' : 'bg-slate-300'}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <DashboardLayout type="parent">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500 font-medium mb-8">Manage your account, notifications, and preferences.</p>

        {/* My Reviews Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Star size={20} className="text-amber-500" /> My Reviews</h2>
          <div className="space-y-4">
            {[
              { teacher: 'Rahul Sharma', subject: 'Physics', rating: 5, review: 'Excellent tutor! My son improved significantly in just 2 months.', date: 'May 15, 2026' },
              { teacher: 'Priya Sharma', subject: 'Mathematics', rating: 4, review: 'Great teaching methodology. Very patient and thorough.', date: 'April 28, 2026' },
            ].map((r, i) => (
              <div key={i} className="border border-slate-100 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{r.teacher}</h4>
                    <p className="text-xs text-slate-500 font-medium">{r.subject} • {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, si) => <Star key={si} size={14} className={si < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />)}
                  </div>
                </div>
                <p className="text-sm text-slate-600 font-medium">{r.review}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Bell size={20} className="text-[#0b5ed7]" /> Notification Preferences</h2>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-slate-800">Email Notifications</h4>
                <p className="text-xs text-slate-500 font-medium">Receive updates about demos, inquiries, and leads via email.</p>
              </div>
              <Toggle on={notifEmail} toggle={() => setNotifEmail(!notifEmail)} />
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-slate-800">SMS Notifications</h4>
                <p className="text-xs text-slate-500 font-medium">Receive OTP, demo reminders, and urgent alerts via SMS.</p>
              </div>
              <Toggle on={notifSMS} toggle={() => setNotifSMS(!notifSMS)} />
            </div>
            <hr className="border-slate-100" />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-sm text-slate-800">Push Notifications</h4>
                <p className="text-xs text-slate-500 font-medium">Browser push notifications for real-time updates.</p>
              </div>
              <Toggle on={notifPush} toggle={() => setNotifPush(!notifPush)} />
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Lock size={20} className="text-slate-600" /> Account Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-slate-500" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Email</h4>
                  <p className="text-xs text-slate-500 font-medium">pooja.singh@email.com</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-[#0b5ed7] hover:underline">Change</button>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-slate-500" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Phone</h4>
                  <p className="text-xs text-slate-500 font-medium">+91 98765 43210</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-[#0b5ed7] hover:underline">Change</button>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-slate-500" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">Password</h4>
                  <p className="text-xs text-slate-500 font-medium">Last changed 30 days ago</p>
                </div>
              </div>
              <button className="text-sm font-semibold text-[#0b5ed7] hover:underline">Update</button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2"><Trash2 size={20} /> Danger Zone</h2>
          <p className="text-sm text-slate-600 font-medium mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <div className="flex gap-3">
            <button className="text-sm font-bold border border-red-200 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors">
              Delete Account
            </button>
            <button className="text-sm font-bold border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentSettings;
