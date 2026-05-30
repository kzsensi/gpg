import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { apiAdmin } from '../../services/api';
import {
  Search, CheckCircle2, Trash2, Users, FileText, Clock,
  MapPin, AlertCircle, RefreshCw, X, Phone, GraduationCap,
} from 'lucide-react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Trash2 size={20} className="text-red-600" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2">Confirm Delete</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 rounded-xl text-sm font-semibold text-white hover:bg-red-700 transition-colors">Delete</button>
      </div>
    </div>
  </div>
);

const AdminParents = () => {
  const [activeTab, setActiveTab] = useState('parents');
  const [parents, setParents] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [parentsData, reqData] = await Promise.all([
        apiAdmin.getAllParents(),
        apiAdmin.getAllRequirements(),
      ]);
      setParents(parentsData || []);
      setRequirements(reqData || []);
    } catch (err) {
      setError('Could not load data. Check admin RLS policies in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusToggle = async (req) => {
    const newStatus = req.status === 'active' ? 'closed' : 'active';
    setActionLoading(req.id);
    try {
      await apiAdmin.updateRequirementStatus(req.id, newStatus);
      setRequirements(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReq = async () => {
    if (!deleteTarget) return;
    try {
      await apiAdmin.deleteRequirement(deleteTarget.id);
      setRequirements(prev => prev.filter(r => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
      setDeleteTarget(null);
    }
  };

  const filteredParents = parents.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.phone || '').includes(searchTerm)
  );

  const filteredReqs = requirements.filter(r =>
    (r.student_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.subjects || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const statusColors = {
    active: 'bg-blue-100 text-blue-700',
    filled: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
  };

  return (
    <DashboardLayout type="admin">
      {deleteTarget && (
        <ConfirmModal
          message={`Delete requirement for "${deleteTarget.student_name}"? This cannot be undone.`}
          onConfirm={handleDeleteReq}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Parents & Requirements</h1>
            <p className="text-sm text-slate-500 mt-1">View registered parents and manage tutoring requirements.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'parents' ? 'Search name, city, phone...' : 'Search student, city, subject...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <button onClick={fetchData} className="flex flex-shrink-0 p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: 'parents', label: `Registered Parents (${parents.length})`, icon: <Users size={15} /> },
            { key: 'requirements', label: `Requirements (${requirements.length})`, icon: <FileText size={15} /> },
          ].map(t => (
            <button key={t.key} onClick={() => { setActiveTab(t.key); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === t.key ? 'bg-[#0b5ed7] text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* ── PARENTS TAB ── */}
        {activeTab === 'parents' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Parent</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">City / Area</th>
                    <th className="px-6 py-4">Child</th>
                    <th className="px-6 py-4">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-slate-100" /><div className="h-4 w-28 bg-slate-100 rounded" /></div></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                      </tr>
                    ))
                  ) : filteredParents.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.photo_url ? (
                            <img src={p.photo_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
                              {p.name?.charAt(0) || 'P'}
                            </div>
                          )}
                          <div className="font-semibold text-slate-900">{p.name || '—'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-600 text-xs">
                          <Phone size={11} className="text-slate-400" />
                          {p.phone || <span className="text-slate-400">Not set</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <MapPin size={11} className="text-slate-400" />
                          {[p.area, p.city].filter(Boolean).join(', ') || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <GraduationCap size={11} className="text-slate-400" />
                          {p.child_name
                            ? `${p.child_name}${p.child_class ? ` • ${p.child_class}` : ''}`
                            : <span className="text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {p.created_at
                          ? new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredParents.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-14 text-center text-slate-400">
                        <Users size={36} className="mx-auto text-slate-200 mb-3" />
                        <p className="font-medium text-slate-500 text-sm">No registered parents yet</p>
                        <p className="text-xs mt-1">Parents appear here after they complete their profile</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500">
                Showing <strong>{filteredParents.length}</strong> of <strong>{parents.length}</strong> parents
              </span>
            </div>
          </div>
        )}

        {/* ── REQUIREMENTS TAB ── */}
        {activeTab === 'requirements' && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Parent</th>
                    <th className="px-6 py-4">Subjects</th>
                    <th className="px-6 py-4">Class & Location</th>
                    <th className="px-6 py-4">Budget</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {loading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-28 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                        <td className="px-6 py-4"><div className="h-6 w-16 bg-slate-100 rounded-full" /></td>
                        <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-100 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : filteredReqs.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                            {req.student_name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{req.student_name || 'Unknown'}</div>
                            <div className="text-xs text-slate-400">{req.mode || 'Home Tuition'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-medium text-slate-700">{req.parent_profiles?.name || '—'}</div>
                        <div className="text-xs text-slate-400">{req.parent_profiles?.phone || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[140px]">
                          {(req.subjects || []).slice(0, 3).map(s => (
                            <span key={s} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 text-xs">{req.class_level || '—'}</div>
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} /> {req.city || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-amber-700 text-xs">
                          {req.min_budget && req.max_budget ? `₹${req.min_budget}–₹${req.max_budget}/hr` : '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(req)}
                          disabled={actionLoading === req.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors disabled:opacity-50 cursor-pointer ${statusColors[req.status] || 'bg-slate-100 text-slate-600'}`}
                          title="Click to toggle status"
                        >
                          {req.status === 'active' ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                          {req.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(req)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Requirement"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loading && filteredReqs.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-14 text-center text-slate-400">
                        <FileText size={36} className="mx-auto text-slate-200 mb-3" />
                        <p className="font-medium text-slate-500 text-sm">No requirements found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500">
                Showing <strong>{filteredReqs.length}</strong> of <strong>{requirements.length}</strong> requirements
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminParents;
