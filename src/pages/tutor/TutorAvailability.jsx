import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiTutors } from '../../services/api';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = [
  { id: 'morning', label: 'Morning (8AM - 12PM)' },
  { id: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
  { id: 'evening', label: 'Evening (4PM - 8PM)' },
  { id: 'night', label: 'Night (8PM - 10PM)' },
];

const TutorAvailability = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Format: { Monday: ['morning', 'evening'], Tuesday: ['afternoon'] }
  const [availability, setAvailability] = useState({});

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const data = await apiTutors.getTutorById(user.id);
      // Ensure it's an object
      const parsed = data?.availability || {};
      const formatted = Array.isArray(parsed) ? {} : parsed; // If they somehow have an array, reset to {}
      setAvailability(formatted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAvailability();
  }, [user]);

  const handleToggle = (day, timeId) => {
    setAvailability(prev => {
      const currentDayTimes = prev[day] || [];
      if (currentDayTimes.includes(timeId)) {
        return { ...prev, [day]: currentDayTimes.filter(t => t !== timeId) };
      } else {
        return { ...prev, [day]: [...currentDayTimes, timeId] };
      }
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await apiTutors.updateProfile(user.id, { availability });
      alert('Availability saved successfully!');
    } catch (err) {
      setError('Failed to save availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">My Availability</h1>
          <p className="text-slate-500 font-medium">Set the days and times you are available for taking classes.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
            <div className="w-8 h-8 border-4 border-[#0b5ed7] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Loading your schedule...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-700 font-bold mb-2">
                <Clock size={20} className="text-[#0b5ed7]" /> Weekly Schedule
              </div>
              <p className="text-sm text-slate-500">Select the time slots you are usually free to teach.</p>
            </div>
            
            <div className="divide-y divide-slate-100">
              {DAYS.map(day => (
                <div key={day} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-32 shrink-0">
                    <span className="font-bold text-slate-900">{day}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 flex-1">
                    {TIMES.map(time => {
                      const isSelected = (availability[day] || []).includes(time.id);
                      return (
                        <button
                          key={time.id}
                          onClick={() => handleToggle(day, time.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            isSelected 
                              ? 'bg-blue-50 border-[#0b5ed7] text-[#0b5ed7] shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50/50'
                          }`}
                        >
                          {time.label.split(' (')[0]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-[#0b5ed7] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 size={18} />
                )}
                Save Availability
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TutorAvailability;
