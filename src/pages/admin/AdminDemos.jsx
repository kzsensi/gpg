import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { apiAdmin } from '../../services/api';
import {
  Search,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  PlayCircle,
  AlertCircle,
  RefreshCw,
  X,
  Trash2,
  Link as LinkIcon,
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

const MeetingLinkModal = ({ demo, onSave, onClose }) => {
  const [link, setLink] = useState(demo.meeting_link || '');
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900">Set Meeting Link</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <p className="text-xs text-slate-500 mb-4">Enter the Zoom / Google Meet link for this demo session.</p>
        <input
          type="url"
          placeholder="https://zoom.us/j/..."
          value={link}
          onChange={e => setLink(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => onSave(link)} className="flex-1 py-2.5 bg-indigo-600 rounded-xl text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Save Link</button>
        </div>
      </div>
    </div>
  );
};

const STATUS_OPTIONS = ['pending', 'accepted', 'completed', 'declined'];

const getStatusBadge = (status) => {
  const map = {
    accepted: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    completed: 'bg-emerald-100 text-emerald-700',
    declined: 'bg-rose-100 text-rose-700',
  };
  const icons = {
    accepted: <Calendar size={11} />,
    pending: <Clock size={11} />,
    completed: <CheckCircle2 size={11} />,
    declined: <XCircle size={11} />,
  };
  return { cls: map[status] || 'bg-slate-100 text-slate-600', icon: icons[status] };
};

const AdminDemos = () => {
  const [demos, setDemos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [linkTarget, setLinkTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDemos = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await apiAdmin.getAllDemos();
      setDemos(data || []);
    } catch (err) {
      setError('Could not load demos. Check admin RLS policies in Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDemos(); }, [fetchDemos]);

  const handleStatusChange = async (demo, newStatus) => {
    setActionLoading(demo.id + '_status');
    try {
      await apiAdmin.updateDemo(demo.id, { status: newStatus });
      setDemos(prev => prev.map(d => d.id === demo.id ? { ...d, status: newStatus } : d));
    } catch (err) {
      alert('Failed to update: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveLink = async (link) => {
    if (!linkTarget) return;
    setActionLoading(linkTarget.id + '_link');
    try {
      await apiAdmin.updateDemo(linkTarget.id, { meeting_link: link, status: 'accepted' });
      setDemos(prev => prev.map(d => d.id === linkTarget.id ? { ...d, meeting_link: link, status: 'accepted' } : d));
      setLinkTarget(null);
    } catch (err) {
      alert('Failed to save link: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiAdmin.deleteDemo(deleteTarget.id);
      setDemos(prev => prev.filter(d => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
      setDeleteTarget(null);
    }
  };

  const filtered = demos.filter(d => {
    const tutorName = d.tutor_profiles?.name || '';
    const matchSearch = tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.parent_requirements?.student_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout type="admin">
      {deleteTarget && (
        <ConfirmModal
          message="Delete this demo booking? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {linkTarget && (
        <MeetingLinkModal
          demo={linkTarget}
          onSave={handleSaveLink}
          onClose={() => setLinkTarget(null)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Demo Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage all demo sessions.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tutor or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-2.5 px-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white text-slate-700"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <button onClick={fetchDemos} className="p-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATUS_OPTIONS.map(s => {
            const { cls } = getStatusBadge(s);
            const count = demos.filter(d => d.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={`text-left p-3 rounded-xl border transition-all ${statusFilter === s ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                <div className="text-xl font-bold text-slate-900">{count}</div>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${cls}`}>
                  {s}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tutor → Student</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Meeting</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-40 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-full" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-8 bg-slate-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : filtered.map((demo) => {
                  const { cls, icon } = getStatusBadge(demo.status);
                  return (
                    <tr key={demo.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{demo.tutor_profiles?.name || 'Tutor N/A'}</div>
                        <div className="text-xs text-slate-400">→ {demo.parent_requirements?.student_name || 'Student N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{(demo.parent_requirements?.subjects || []).join(', ') || '—'}</div>
                        <div className="text-xs text-slate-400">{demo.parent_requirements?.class_level || '—'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {demo.scheduled_at ? (
                          <div>
                            <div className="text-xs font-medium text-slate-700">{new Date(demo.scheduled_at).toLocaleDateString('en-IN')}</div>
                            <div className="text-xs text-slate-400">{new Date(demo.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not scheduled</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={demo.status}
                          onChange={e => handleStatusChange(demo, e.target.value)}
                          disabled={actionLoading === demo.id + '_status'}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer disabled:opacity-50 ${cls}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {demo.meeting_link ? (
                          <a href={demo.meeting_link} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                            <Video size={12} /> Join
                          </a>
                        ) : (
                          <button
                            onClick={() => setLinkTarget(demo)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <LinkIcon size={12} /> Add link
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setDeleteTarget(demo)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Demo"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-14 text-center text-slate-400">
                      <PlayCircle size={36} className="mx-auto text-slate-200 mb-3" />
                      <p className="font-medium text-slate-500 text-sm">No demos found</p>
                      <p className="text-xs mt-1">Try a different filter or search term</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50">
            <span className="text-xs text-slate-500">
              Showing <strong>{filtered.length}</strong> of <strong>{demos.length}</strong> demos
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDemos;
