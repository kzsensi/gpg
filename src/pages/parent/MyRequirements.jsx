import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookMarked,
  Clock,
  Users,
  Edit3,
  Trash2,
  Eye,
  MapPin,
  Monitor,
  Home,
  Filter,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const requirements = [
  {
    id: 1,
    subject: 'Mathematics',
    class: 'Class 10',
    board: 'CBSE',
    mode: 'Home Tuition',
    area: 'Sector 15, Gurgaon',
    sessions: '3 per week',
    fee: '₹5,000 - ₹8,000/mo',
    postedDate: '24 May 2026',
    responses: 7,
    status: 'Active',
    notes: 'Need help with Trigonometry and Algebra',
  },
  {
    id: 2,
    subject: 'Science (PCM)',
    class: 'Class 12',
    board: 'CBSE',
    mode: 'Online',
    area: 'Dwarka, New Delhi',
    sessions: '5 per week',
    fee: '₹8,000 - ₹15,000/mo',
    postedDate: '20 May 2026',
    responses: 12,
    status: 'Urgent',
    notes: 'Board exam preparation needed urgently',
  },
  {
    id: 3,
    subject: 'English Speaking',
    class: 'Class 8',
    board: 'ICSE',
    mode: 'Home Tuition',
    area: 'Indiranagar, Bangalore',
    sessions: '2 per week',
    fee: '₹3,000 - ₹5,000/mo',
    postedDate: '15 May 2026',
    responses: 4,
    status: 'Active',
    notes: '',
  },
  {
    id: 4,
    subject: 'Hindi Literature',
    class: 'Class 9',
    board: 'CBSE',
    mode: 'Online',
    area: 'Noida',
    sessions: '2 per week',
    fee: '₹2,500 - ₹4,000/mo',
    postedDate: '10 May 2026',
    responses: 9,
    status: 'Closed',
    notes: 'Found a tutor, thank you!',
  },
];

const statusConfig = {
  Active: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  Urgent: { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle },
  Closed: { color: 'bg-slate-100 text-slate-500 border-slate-200', icon: XCircle },
};

const MyRequirements = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? requirements : requirements.filter((r) => r.status === filter);

  return (
    <DashboardLayout type="parent">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">My Requirements</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage all your posted tuition requirements</p>
        </div>
        <button
          onClick={() => navigate('/parent/post-requirement')}
          className="flex items-center gap-2 bg-[#0b5ed7] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md text-sm cursor-pointer"
        >
          <PlusCircle size={18} />
          Post New
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['All', 'Active', 'Urgent', 'Closed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#0b5ed7] text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab}
            {tab !== 'All' && (
              <span className={`ml-1.5 ${filter === tab ? 'text-blue-200' : 'text-slate-400'}`}>
                ({requirements.filter((r) => r.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filtered.map((req) => {
          const statusStyle = statusConfig[req.status];
          const StatusIcon = statusStyle.icon;

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">{req.subject} — {req.class}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.color}`}>
                        <StatusIcon size={13} />
                        {req.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BookMarked size={14} className="text-slate-400" />
                        <span>{req.board}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {req.mode === 'Home Tuition' ? (
                          <Home size={14} className="text-slate-400" />
                        ) : (
                          <Monitor size={14} className="text-slate-400" />
                        )}
                        <span>{req.mode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        <span>{req.area}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        <span>{req.sessions}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="text-slate-400 text-xs font-bold">₹</span>
                        <span>{req.fee}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <p className="mt-3 text-sm text-slate-500 italic bg-slate-50 px-3 py-2 rounded-lg">
                        "{req.notes}"
                      </p>
                    )}
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-row md:flex-col items-center gap-3">
                    {/* Response count */}
                    <div className="bg-blue-50 rounded-xl px-4 py-3 text-center min-w-[80px]">
                      <div className="flex items-center justify-center gap-1 text-[#0b5ed7]">
                        <Users size={16} />
                        <span className="text-xl font-bold">{req.responses}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Responses</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-[#0b5ed7] hover:border-[#0b5ed7]/30 hover:bg-blue-50 transition-all cursor-pointer" title="View">
                        <Eye size={16} />
                      </button>
                      {req.status !== 'Closed' && (
                        <>
                          <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50 transition-all cursor-pointer" title="Edit">
                            <Edit3 size={16} />
                          </button>
                          <button className="p-2.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all cursor-pointer" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} />
                    Posted on {req.postedDate}
                  </span>
                  {req.status === 'Active' && (
                    <button className="text-xs text-[#0b5ed7] font-medium hover:underline cursor-pointer">
                      View Tutor Responses →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <BookMarked size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-slate-700">No requirements found</h3>
          <p className="text-sm text-slate-500 mt-1">Try changing the filter or post a new requirement</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyRequirements;
