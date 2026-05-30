import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { apiAdmin } from '../../services/api';
import {
  Search, CheckCircle2, Eye, EyeOff, ShieldCheck, ShieldAlert,
  GraduationCap, AlertCircle, RefreshCw, X, Trash2, Star,
  MapPin, Briefcase, Clock, Phone,
} from 'lucide-react';

// ── Confirm Delete Modal ──
const ConfirmModal = ({ name, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">Delete Tutor Profile?</h3>
      <p className="text-sm text-slate-500 mb-6">
        This will permanently delete <strong>{name}</strong>'s profile. This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-colors">Yes, Delete</button>
      </div>
    </div>
  </div>
);

// ── Tutor Card ──
const TutorCard = ({ tutor, onVerify, onToggleVisible, onDelete, loading }) => {
  const isVerifyLoading = loading === tutor.user_id + '_verify';
  const isVisibleLoading = loading === tutor.user_id + '_visible';
  const isDelLoading = loading === tutor.user_id + '_del';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden ${
      !tutor.is_verified ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200'
    }`}>
      {/* Card Header */}
      <div className={`px-5 py-3 flex items-center justify-between text-xs font-semibold ${
        !tutor.is_verified
          ? 'bg-amber-50 text-amber-700 border-b border-amber-100'
          : 'bg-emerald-50 text-emerald-700 border-b border-emerald-100'
      }`}>
        <div className="flex items-center gap-1.5">
          {tutor.is_verified ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
          {tutor.is_verified ? 'Verified Tutor' : 'Pending Verification'}
        </div>
        <div className={`flex items-center gap-1 ${tutor.is_visible ? 'text-blue-600' : 'text-slate-400'}`}>
          {tutor.is_visible ? <Eye size={12} /> : <EyeOff size={12} />}
          {tutor.is_visible ? 'Public' : 'Hidden'}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
            {tutor.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-base truncate">{tutor.name || 'Unnamed Tutor'}</h3>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(tutor.subjects || []).slice(0, 3).map(s => (
                <span key={s} className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">{s}</span>
              ))}
              {(tutor.subjects || []).length > 3 && (
                <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">+{tutor.subjects.length - 3}</span>
              )}
            </div>
          </div>
          {/* Rating */}
          {tutor.rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold text-amber-700 flex-shrink-0">
              <Star size={11} className="fill-amber-400 text-amber-400" /> {Number(tutor.rating).toFixed(1)}
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-slate-400" />
            <span className="truncate">{tutor.city || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase size={12} className="text-slate-400" />
            <span>{tutor.experience_years ? `${tutor.experience_years} yrs exp` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-bold">₹</span>
            <span>{tutor.hourly_rate ? `${tutor.hourly_rate}/hr` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-slate-400" />
            <span className="truncate">{tutor.phone || '—'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Clock size={12} className="text-slate-400" />
            <span>Joined {tutor.created_at ? new Date(tutor.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</span>
          </div>
        </div>

        {/* Mode Badge */}
        {tutor.mode && (
          <div className="mb-4">
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
              {tutor.mode === 'Both' ? 'Online / Offline' : tutor.mode}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Verify button — prominent */}
          <button
            onClick={() => onVerify(tutor)}
            disabled={!!loading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 ${
              tutor.is_verified
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100'
            }`}
          >
            {isVerifyLoading ? (
              <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : tutor.is_verified ? (
              <><ShieldCheck size={15} /> Revoke Verification</>
            ) : (
              <><ShieldCheck size={15} /> Grant Verification ✓</>
            )}
          </button>

          {/* Secondary row */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggleVisible(tutor)}
              disabled={!!loading}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60 ${
                tutor.is_visible
                  ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isVisibleLoading ? (
                <div className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : tutor.is_visible ? <><Eye size={13} /> Hide</> : <><EyeOff size={13} /> Unhide</>}
            </button>
            <button
              onClick={() => onDelete(tutor)}
              disabled={!!loading}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-60"
            >
              {isDelLoading ? (
                <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
              ) : <Trash2 size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Skeleton Card ──
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 h-8" />
    <div className="p-5 space-y-4">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="flex gap-1.5"><div className="h-5 bg-slate-100 rounded-md w-16" /><div className="h-5 bg-slate-100 rounded-md w-14" /></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded" />)}
      </div>
      <div className="h-9 bg-slate-100 rounded-xl" />
      <div className="flex gap-2"><div className="flex-1 h-8 bg-slate-100 rounded-xl" /><div className="w-16 h-8 bg-slate-100 rounded-xl" /></div>
    </div>
  </div>
);

// ── Main Page ──
const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'unverified' | 'hidden'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchTutors = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await apiAdmin.getAllTutors();
      setTutors(data || []);
    } catch (err) {
      setError('Could not load tutors. Make sure you ran the admin RLS policies (is_admin() function) from the setup guide.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTutors(); }, [fetchTutors]);

  const handleVerify = async (tutor) => {
    setActionLoading(tutor.user_id + '_verify');
    try {
      await apiAdmin.setTutorVerified(tutor.user_id, !tutor.is_verified);
      setTutors(prev => prev.map(t => t.user_id === tutor.user_id ? { ...t, is_verified: !t.is_verified } : t));
    } catch (err) {
      alert('Failed to update verification: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleVisible = async (tutor) => {
    setActionLoading(tutor.user_id + '_visible');
    try {
      await apiAdmin.setTutorVisible(tutor.user_id, !tutor.is_visible);
      setTutors(prev => prev.map(t => t.user_id === tutor.user_id ? { ...t, is_visible: !t.is_visible } : t));
    } catch (err) {
      alert('Failed to update visibility: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.user_id + '_del');
    try {
      await apiAdmin.deleteTutor(deleteTarget.user_id);
      setTutors(prev => prev.filter(t => t.user_id !== deleteTarget.user_id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
      setDeleteTarget(null);
    } finally {
      setActionLoading(null);
    }
  };

  // Computed lists
  const unverified = tutors.filter(t => !t.is_verified);
  const verified = tutors.filter(t => t.is_verified);
  const hidden = tutors.filter(t => !t.is_visible);

  const displayList = (() => {
    let list = tutors;
    if (viewMode === 'unverified') list = unverified;
    else if (viewMode === 'hidden') list = hidden;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(t =>
        (t.name || '').toLowerCase().includes(q) ||
        (t.city || '').toLowerCase().includes(q) ||
        (t.subjects || []).some(s => s.toLowerCase().includes(q))
      );
    }
    return list;
  })();

  const tabs = [
    { key: 'all', label: 'All Tutors', count: tutors.length, color: 'text-slate-700' },
    { key: 'unverified', label: 'Needs Verification', count: unverified.length, color: 'text-amber-600' },
    { key: 'hidden', label: 'Hidden Profiles', count: hidden.length, color: 'text-slate-500' },
  ];

  return (
    <DashboardLayout type="admin">
      {deleteTarget && (
        <ConfirmModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <GraduationCap size={24} className="text-indigo-600" />
              Tutor Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Grant verification badges, control visibility, and manage all tutor profiles.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, subject, city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={fetchTutors} disabled={loading} className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Failed to load data</p>
              <p className="text-xs text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Verification notice banner */}
        {!loading && !error && unverified.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <ShieldAlert size={18} className="text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">
                {unverified.length} tutor{unverified.length > 1 ? 's' : ''} awaiting verification
              </p>
              <p className="text-xs text-amber-700 mt-0.5">Review their profiles and grant the verified badge. It will appear instantly on their public profile.</p>
            </div>
            <button
              onClick={() => setViewMode('unverified')}
              className="flex-shrink-0 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              Review Now →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setViewMode(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                viewMode === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                viewMode === tab.key
                  ? tab.key === 'unverified' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : displayList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
            <GraduationCap size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="font-semibold text-slate-600">
              {searchTerm ? 'No tutors match your search' : viewMode === 'unverified' ? 'All tutors are verified! 🎉' : 'No tutors here'}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {searchTerm ? 'Try different keywords' : 'Switch to "All Tutors" to see everyone'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayList.map(tutor => (
              <TutorCard
                key={tutor.user_id}
                tutor={tutor}
                onVerify={handleVerify}
                onToggleVisible={handleToggleVisible}
                onDelete={setDeleteTarget}
                loading={actionLoading}
              />
            ))}
          </div>
        )}

        {/* Summary Footer */}
        {!loading && !error && (
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-5 py-3">
            <span>Total: <strong className="text-slate-800">{tutors.length}</strong></span>
            <span>Verified: <strong className="text-emerald-700">{verified.length}</strong></span>
            <span>Unverified: <strong className="text-amber-700">{unverified.length}</strong></span>
            <span>Hidden: <strong className="text-slate-700">{hidden.length}</strong></span>
            <span>Showing: <strong className="text-indigo-700">{displayList.length}</strong></span>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminTutors;
