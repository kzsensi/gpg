import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequirements, apiDemos } from '../../services/api';
import { BookMarked, PlusCircle, CheckCircle2, User, PlayCircle, MapPin, Star, AlertCircle, XCircle } from 'lucide-react';

const ParentRequirements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [demoRequests, setDemoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [closingId, setClosingId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const reqRes = await apiRequirements.getByParent(user.id);
      const demoRes = await apiDemos.getByUser(user.id, 'parent');
      
      setRequirements(reqRes.data || []);
      setDemoRequests(demoRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleAcceptTutor = async (demoId) => {
    setProcessingId(demoId);
    try {
      await apiDemos.updateStatus(demoId, 'accepted');
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Failed to accept tutor:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCloseRequirement = async (reqId) => {
    if (!window.confirm('Are you sure you want to close this requirement? Tutors will no longer be able to apply.')) return;
    setClosingId(reqId);
    try {
      await apiRequirements.updateStatus(reqId, 'closed');
      await fetchData();
    } catch (error) {
      console.error("Failed to close requirement:", error);
      alert('Failed to close requirement: ' + error.message);
    } finally {
      setClosingId(null);
    }
  };

  return (
    <DashboardLayout type="parent">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">My Requirements</h1>
            <p className="text-slate-500 font-medium">Manage your posted tuition needs and review interested tutors.</p>
          </div>
          <button 
            onClick={() => navigate('/parent/post-requirement')}
            className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <PlusCircle size={18} /> Post New Requirement
          </button>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1,2].map(i => <div key={i} className="h-48 bg-white rounded-xl border border-slate-200 animate-pulse"></div>)}
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <BookMarked size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Requirements Posted</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-6">You haven't posted any tuition requirements yet. Post one to start receiving responses from verified tutors.</p>
            <button 
              onClick={() => navigate('/parent/post-requirement')}
              className="bg-[#0b5ed7] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              Post Requirement
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {requirements.map(req => {
              // Find all demo requests for this specific requirement
              const relatedResponses = demoRequests.filter(d => d.requirement_id === req.id);
              const pendingResponses = relatedResponses.filter(d => d.status === 'tutor_interested');
              const acceptedResponses = relatedResponses.filter(d => ['pending', 'accepted', 'hiring_requested', 'hired'].includes(d.status));

              return (
                <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{req.class_level} • {req.subjects?.join(', ')}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5"><MapPin size={14}/> {req.area}, {req.city} • {req.mode}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'}`}>
                        {req.status === 'active' ? 'Live' : 'Closed'}
                      </span>
                      {req.status === 'active' && (
                        <button
                          onClick={() => handleCloseRequirement(req.id)}
                          disabled={closingId === req.id}
                          className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {closingId === req.id ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" /> : <XCircle size={12} />}
                          Close
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <h4 className="text-[15px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <User size={18} className="text-[#0b5ed7]"/> Tutor Responses ({pendingResponses.length})
                    </h4>

                    {acceptedResponses.length > 0 ? (
                       <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-center gap-4">
                         <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle2 size={20}/></div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">Tutor Accepted!</p>
                             <p className="text-sm text-slate-600 font-medium mt-0.5">You accepted <b>{acceptedResponses[0].tutor_profiles?.name}</b>. They will confirm the demo schedule shortly. <span className="text-emerald-700 font-bold">{acceptedResponses[0].status === 'accepted' ? 'Demo scheduled!' : 'Waiting for tutor to confirm.'}</span></p>
                         </div>
                         <button onClick={() => navigate('/parent/demos')} className="ml-auto bg-white text-emerald-700 border border-emerald-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-100 transition-colors">
                           View Demo
                         </button>
                       </div>
                    ) : pendingResponses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingResponses.map(response => {
                           const tutor = response.tutor_profiles;
                           return (
                             <div key={response.id} className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                               <div className="flex gap-4 mb-4">
                                 <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-lg shrink-0">
                                   {tutor?.name?.charAt(0).toUpperCase() || 'T'}
                                 </div>
                                 <div>
                                   <h5 className="font-bold text-slate-900">{tutor?.name || 'Unknown Tutor'}</h5>
                                   <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                      <Star size={12} className="text-amber-400 fill-amber-400"/> {tutor?.rating || 'New'} • {tutor?.city || 'Local'}
                                   </p>
                                 </div>
                               </div>
                               <div className="flex gap-2">
                                 <button onClick={() => navigate(`/teacher/${response.tutor_id}`)} className="flex-1 bg-white text-slate-600 border border-slate-200 px-3 py-2 rounded-md text-sm font-semibold hover:bg-slate-50">
                                   View Profile
                                 </button>
                                 <button 
                                   onClick={() => handleAcceptTutor(response.id)}
                                   disabled={processingId === response.id}
                                   className="flex-1 bg-[#0b5ed7] text-white px-3 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
                                 >
                                   {processingId === response.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Accept Tutor"}
                                 </button>
                               </div>
                             </div>
                           )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                        <p className="text-slate-500 font-medium text-sm">No tutors have responded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ParentRequirements;
