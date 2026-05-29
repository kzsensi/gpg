import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequirements, apiDemos } from '../../services/api';
import { Mail, Clock, CheckCircle2, MapPin, User, IndianRupee, FileText } from 'lucide-react';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

const LeadInbox = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('new');
  const [processingId, setProcessingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await apiRequirements.getActiveLeads();
      // Wait, we also need to know which ones the tutor is already "interested" in.
      // For now, we will fetch all active leads.
      setLeads(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLeads();
  }, [user]);

  const handleAcceptLead = async (lead) => {
    setProcessingId(lead.id);
    setSuccessId(null);
    try {
      await apiDemos.create({
        parent_id: lead.parent_id,
        tutor_id: user.id,
        requirement_id: lead.id,
        status: 'pending' // 'pending' means Tutor is interested but Parent hasn't accepted yet
      });
      setSuccessId(lead.id);
      setTimeout(() => setLeads(prev => prev.filter(l => l.id !== lead.id)), 1500);
    } catch (err) {
      setError(err.message || 'Failed to express interest');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectLead = (leadId) => {
      // Just visually remove it from the 'new' list for this session
      setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">My Leads</h1>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 mb-8">
            <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'new' ? 'border-[#0b5ed7] text-[#0b5ed7]' : 'border-transparent text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('new')}>New ({leads.length})</button>
            <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'interested' ? 'border-[#0b5ed7] text-[#0b5ed7]' : 'border-transparent text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('interested')}>Interested (0)</button>
            <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'contacted' ? 'border-[#0b5ed7] text-[#0b5ed7]' : 'border-transparent text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('contacted')}>Contacted (0)</button>
            <button className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'closed' ? 'border-[#0b5ed7] text-[#0b5ed7]' : 'border-transparent text-slate-500 hover:text-slate-800'}`} onClick={() => setActiveTab('closed')}>Closed (0)</button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-slate-200 animate-pulse"></div>)}
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => {
              const datePosted = new Date(lead.created_at);
              const formattedDate = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(datePosted);
              const isExpanded = expandedId === lead.id;
              
              return (
                <div key={lead.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                           {lead.class_level} • {lead.subjects?.join(', ') || 'All Subjects'}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                          <MapPin size={14} className="text-slate-400" /> {lead.area}, {lead.city} • {lead.mode}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                        New Lead
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                       <div>
                         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Budget</p>
                         <p className="text-sm font-semibold text-slate-900">₹{lead.min_budget} - ₹{lead.max_budget} / mo</p>
                       </div>
                       <div>
                         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sessions</p>
                         <p className="text-sm font-semibold text-slate-900">{lead.sessions_per_week} per week</p>
                       </div>
                       <div>
                         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Timing</p>
                         <p className="text-sm font-semibold text-slate-900 capitalize">{lead.preferred_time}</p>
                       </div>
                       <div>
                         <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Posted</p>
                         <p className="text-sm font-semibold text-slate-900">{formattedDate}</p>
                       </div>
                    </div>
                    
                    {!isExpanded && (
                        <button onClick={() => setExpandedId(lead.id)} className="w-full sm:w-auto bg-[#0b5ed7] text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                            View Details
                        </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium"><User size={16}/> Parent Name</div>
                            <div className="text-sm font-semibold text-slate-900">{lead.student_name}</div>
                        </div>
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium"><User size={16}/> Student Class</div>
                            <div className="text-sm font-semibold text-slate-900">{lead.class_level}</div>
                        </div>
                        <div className="flex items-start justify-between border-b border-slate-100 pb-3 md:col-span-2">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium"><FileText size={16}/> Additional Notes</div>
                            <div className="text-sm font-medium text-slate-800 text-right max-w-md">{lead.notes || 'None provided'}</div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => handleRejectLead(lead.id)}
                          className="flex-1 bg-white text-slate-700 border border-slate-200 px-6 py-3 rounded-lg text-[15px] font-semibold hover:bg-slate-50 transition-colors"
                        >
                          Not Interested
                        </button>
                        <button 
                          onClick={() => handleAcceptLead(lead)}
                          disabled={processingId === lead.id || successId === lead.id}
                          className={`flex-1 px-6 py-3 rounded-lg text-[15px] font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-colors ${
                            successId === lead.id ? 'bg-emerald-600 text-white cursor-not-allowed' : 'bg-[#0b5ed7] text-white hover:bg-blue-700'
                          }`}
                        >
                          {processingId === lead.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                          {successId === lead.id ? <><CheckCircle2 size={18}/> Request Sent</> : "I'm Interested"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {leads.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
                <Mail size={40} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No new leads</h3>
                <p className="text-slate-500 text-sm font-medium">There are currently no active requirements in your area.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeadInbox;
