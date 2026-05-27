import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Bell, PlayCircle, MessageCircle, CheckCircle2, Star, Users, Mail, ShieldCheck, Check } from 'lucide-react';

const notificationsData = [
  { id: 1, type: 'demo', title: 'Demo Confirmed', message: 'Your demo with Rahul Sharma for Physics is confirmed for May 28 at 5:00 PM.', time: '2 hours ago', read: false, icon: <PlayCircle size={18} />, color: 'bg-blue-100 text-[#0b5ed7]' },
  { id: 2, type: 'message', title: 'New Message', message: 'Priya Sharma replied to your Mathematics inquiry: "Thank you for reaching out! I would love to..."', time: '5 hours ago', read: false, icon: <MessageCircle size={18} />, color: 'bg-emerald-100 text-emerald-600' },
  { id: 3, type: 'response', title: 'New Response to Your Requirement', message: 'A verified tutor (Kavita Reddy) has responded to your "Class 10 Mathematics - CBSE" requirement.', time: 'Yesterday', read: false, icon: <Users size={18} />, color: 'bg-purple-100 text-purple-600' },
  { id: 4, type: 'review', title: 'Review Reminder', message: 'You had a demo with Amit Patel last week. How was your experience? Leave a review!', time: '2 days ago', read: true, icon: <Star size={18} />, color: 'bg-amber-100 text-amber-600' },
  { id: 5, type: 'verification', title: 'Profile Verified', message: 'Sneha Gupta\'s profile has been verified by our team. You can now proceed with confidence.', time: '3 days ago', read: true, icon: <ShieldCheck size={18} />, color: 'bg-teal-100 text-teal-600' },
  { id: 6, type: 'system', title: 'System Update', message: 'We\'ve improved our matching algorithm! You\'ll now see more relevant tutor suggestions.', time: '1 week ago', read: true, icon: <Bell size={18} />, color: 'bg-slate-100 text-slate-600' },
  { id: 7, type: 'demo', title: 'Demo Completed', message: 'Your demo session with Amit Patel (Chemistry) has been marked as completed.', time: '1 week ago', read: true, icon: <CheckCircle2 size={18} />, color: 'bg-emerald-100 text-emerald-600' },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.read);

  return (
    <DashboardLayout type="parent">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Notifications</h1>
            <p className="text-slate-500 font-medium">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm font-semibold text-[#0b5ed7] hover:underline flex items-center gap-1">
              <Check size={16} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'all', label: 'All' }, { key: 'unread', label: `Unread (${unreadCount})` }, { key: 'read', label: 'Read' }].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === tab.key ? 'bg-[#0b5ed7] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`bg-white rounded-2xl border p-5 flex gap-4 items-start cursor-pointer transition-all hover:shadow-md ${!notif.read ? 'border-[#0b5ed7]/30 shadow-sm bg-blue-50/30' : 'border-slate-200 shadow-sm'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.color}`}>
                {notif.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className={`font-bold text-sm ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>{notif.title}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-sm text-slate-600 font-medium mt-1 line-clamp-2">{notif.message}</p>
              </div>
              {!notif.read && <div className="w-2.5 h-2.5 bg-[#0b5ed7] rounded-full shrink-0 mt-2"></div>}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Bell size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No notifications</h3>
            <p className="text-slate-500 font-medium">Nothing to see here yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
