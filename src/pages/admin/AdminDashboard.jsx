import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { apiAdmin } from '../../services/api';
import {
  Users, GraduationCap, PlayCircle, FileText, ShieldAlert,
  ShieldCheck, Clock, CheckCircle2, AlertCircle, RefreshCw,
  ArrowRight, TrendingUp,
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTutors: 0, activeRequirements: 0, pendingDemos: 0 });
  const [recentTutors, setRecentTutors] = useState([]);
  const [recentRequirements, setRecentRequirements] = useState([]);
  const [unverifiedTutors, setUnverifiedTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const [platformStats, allTutors, allRequirements] = await Promise.all([
        apiAdmin.getStats(),
        apiAdmin.getAllTutors(),
        apiAdmin.getAllRequirements(),
      ]);
      setStats(platformStats);
      setRecentTutors((allTutors || []).slice(0, 4));
      setUnverifiedTutors((allTutors || []).filter(t => !t.is_verified));
      setRecentRequirements((allRequirements || []).filter(r => r.status === 'active').slice(0, 4));
    } catch (err) {
      setError('Could not load admin data. Run the is_admin() SQL function + RLS policies from the setup guide.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Stat cards ──
  const statCards = [
    {
      label: 'Total Tutors', value: stats.totalTutors,
      icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100',
      link: '/admin/tutors',
    },
    {
      label: 'Unverified', value: unverifiedTutors.length,
      icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100',
      link: '/admin/tutors', urgent: unverifiedTutors.length > 0,
    },
    {
      label: 'Active Requirements', value: stats.activeRequirements,
      icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100',
      link: '/admin/parents',
    },
    {
      label: 'Pending Demos', value: stats.pendingDemos,
      icon: PlayCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100',
      link: '/admin/demos', urgent: stats.pendingDemos > 0,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout type="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-10 h-10 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"
              style={{ borderWidth: '3px', borderStyle: 'solid' }} />
            <p className="text-slate-500 text-sm font-medium">Loading platform data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Live statistics and recent activity from your GharPeGyan platform.</p>
          </div>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Could not load platform data</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Urgent banner: unverified tutors */}
        {!loading && !error && unverifiedTutors.length > 0 && (
          <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <ShieldAlert size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">
                  {unverifiedTutors.length} tutor{unverifiedTutors.length > 1 ? 's' : ''} need verification
                </p>
                <p className="text-xs text-amber-700">
                  Review and grant the verified badge — it shows live on their public profiles.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/tutors')}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg transition-colors"
            >
              Review <ArrowRight size={13} />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <button
              key={i}
              onClick={() => navigate(stat.link)}
              className={`group text-left bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all relative overflow-hidden ${
                stat.urgent ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
              }`}
            >
              {stat.urgent && (
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
              )}
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-4`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500">{stat.label}</div>
              <div className="mt-2 text-[11px] font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                View all <ArrowRight size={10} />
              </div>
            </button>
          ))}
        </div>

        {/* Two-column: Recent Tutors + Recent Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tutor Signups */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap size={16} className="text-indigo-600" />
                Recent Tutor Signups
              </h2>
              <button onClick={() => navigate('/admin/tutors')} className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1">
                Manage all <ArrowRight size={11} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentTutors.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">No tutors registered yet</div>
              ) : recentTutors.map(tutor => (
                <div key={tutor.user_id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{tutor.name || 'Unnamed'}</p>
                    <p className="text-xs text-slate-400 truncate">{(tutor.subjects || []).join(', ') || 'No subjects'} • {tutor.city || 'N/A'}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      tutor.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {tutor.is_verified ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />}
                      {tutor.is_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-blue-600" />
                Active Requirements
              </h2>
              <button onClick={() => navigate('/admin/parents')} className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1">
                View all <ArrowRight size={11} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentRequirements.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">No active requirements</div>
              ) : recentRequirements.map(req => (
                <div key={req.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                    {req.student_name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {(req.subjects || []).join(', ') || '—'} — {req.class_level || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {req.student_name} • {req.city || 'N/A'}
                      {req.max_budget ? ` • up to ₹${req.max_budget}/hr` : ''}
                    </p>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                    <Clock size={11} /> Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
