import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  PlayCircle,
  Heart,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  Users,
  TrendingUp,
  CalendarCheck,
  Star,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const stats = [
  {
    label: 'Active Requirements',
    value: '2',
    icon: BookOpen,
    color: 'from-blue-500 to-[#0b5ed7]',
    bgLight: 'bg-blue-50',
    textColor: 'text-[#0b5ed7]',
  },
  {
    label: 'Demo Scheduled',
    value: '1',
    icon: CalendarCheck,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    label: 'Saved Tutors',
    value: '5',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50',
    textColor: 'text-pink-600',
  },
];

const activeRequirements = [
  {
    id: 1,
    subject: 'Mathematics — Class 10',
    board: 'CBSE',
    mode: 'Home Tuition',
    postedDate: '3 days ago',
    responses: 7,
    status: 'Active',
    area: 'Sector 15, Gurgaon',
  },
  {
    id: 2,
    subject: 'Science (PCM) — Class 12',
    board: 'CBSE',
    mode: 'Online',
    postedDate: '1 week ago',
    responses: 12,
    status: 'Active',
    area: 'Dwarka, New Delhi',
  },
];

const recentActivity = [
  {
    id: 1,
    icon: MessageSquare,
    text: 'Rahul Kumar responded to your Mathematics requirement',
    time: '2 hours ago',
    color: 'text-[#0b5ed7]',
    bg: 'bg-blue-50',
  },
  {
    id: 2,
    icon: CalendarCheck,
    text: 'Demo scheduled with Priya Singh for Science',
    time: '5 hours ago',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 3,
    icon: Star,
    text: 'You saved Anjali Verma to your favorites',
    time: '1 day ago',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    id: 4,
    icon: CheckCircle2,
    text: 'Your profile has been updated successfully',
    time: '2 days ago',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
  },
];

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout type="parent">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Welcome back, Pooja! 👋
            </h1>
            <p className="text-slate-500 mt-1 text-sm md:text-base">
              Here's what's happening with your tuition search
            </p>
          </div>
          <button
            onClick={() => navigate('/parent/post-requirement')}
            className="flex items-center gap-2 bg-[#0b5ed7] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm cursor-pointer"
          >
            <PlusCircle size={18} />
            Post New Requirement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.bgLight} p-3 rounded-xl`}>
                  <Icon size={22} className={stat.textColor} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Post New Requirement CTA Card */}
        <div
          onClick={() => navigate('/parent/post-requirement')}
          className="bg-gradient-to-br from-[#0b5ed7] to-indigo-600 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <PlusCircle size={28} className="mb-2 opacity-90" />
            <p className="font-semibold text-lg">Post a Request</p>
            <p className="text-sm text-blue-100 mt-0.5">Find the perfect tutor</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium mt-3 text-blue-100 hover:text-white transition-colors">
            Get Started <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {/* Active Requirements */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-lg text-slate-900">Active Requirements</h2>
              <button
                onClick={() => navigate('/parent/requirements')}
                className="text-sm text-[#0b5ed7] font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {activeRequirements.map((req) => (
                <div key={req.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{req.subject}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {req.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-slate-500 flex-wrap">
                        <span>{req.board}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{req.mode}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{req.area}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1.5 text-[#0b5ed7]">
                          <Users size={16} />
                          <span className="text-lg font-bold">{req.responses}</span>
                        </div>
                        <p className="text-xs text-slate-500">Responses</p>
                      </div>
                      <button
                        onClick={() => navigate('/parent/requirements')}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock size={12} />
                    <span>Posted {req.postedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-lg text-slate-900">Recent Activity</h2>
            </div>

            <div className="p-4">
              <div className="space-y-1">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <div className={`${activity.bg} p-2 rounded-lg flex-shrink-0 mt-0.5`}>
                        <Icon size={16} className={activity.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 leading-snug">{activity.text}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-semibold text-lg text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Find Teachers', icon: Users, path: '/search', desc: 'Browse verified tutors' },
            { label: 'Saved Tutors', icon: Heart, path: '/parent/saved', desc: 'View your favorites' },
            { label: 'Demo Requests', icon: PlayCircle, path: '/parent/demos', desc: 'Manage your demos' },
            { label: 'Notifications', icon: TrendingUp, path: '/parent/notifications', desc: 'Stay updated' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#0b5ed7]/30 hover:bg-blue-50/30 transition-all text-left cursor-pointer group"
              >
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-[#0b5ed7]/10 transition-colors">
                  <Icon size={20} className="text-slate-500 group-hover:text-[#0b5ed7] transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-sm text-slate-900">{action.label}</p>
                  <p className="text-xs text-slate-400">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
