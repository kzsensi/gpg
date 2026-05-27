import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Landmark, Clock, Save, CheckCircle2, IndianRupee, Monitor, Home, Calendar } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM', '6-8 PM', '8-10 PM'];

const defaultAvailability = {
  Monday: ['4-6 PM', '6-8 PM'],
  Tuesday: ['4-6 PM', '6-8 PM'],
  Wednesday: ['4-6 PM', '6-8 PM', '8-10 PM'],
  Thursday: ['4-6 PM', '6-8 PM'],
  Friday: ['4-6 PM', '6-8 PM'],
  Saturday: ['10-12 PM', '12-2 PM', '2-4 PM', '4-6 PM'],
  Sunday: ['10-12 PM', '12-2 PM', '2-4 PM'],
};

const FeeAvailability = () => {
  const [availability, setAvailability] = useState(defaultAvailability);
  const [saved, setSaved] = useState(false);

  const toggleSlot = (day, slot) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const newSlots = daySlots.includes(slot) ? daySlots.filter(s => s !== slot) : [...daySlots, slot];
      return { ...prev, [day]: newSlots };
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Fee & Availability</h1>
          <p className="text-slate-500 font-medium">Set your pricing and weekly schedule so parents can book sessions.</p>
        </div>

        {/* Fee Structure */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Landmark size={20} className="text-[#0b5ed7]" /> Fee Structure</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Online Rates */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Monitor size={18} className="text-[#0b5ed7]" />
                <h3 className="font-bold text-slate-900">Online Tutoring</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Hourly Rate (₹)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input type="number" defaultValue={800} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">min</span>
                    </div>
                    <span className="self-center text-slate-400 font-bold">—</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input type="number" defaultValue={1000} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">max</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Monthly Package (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input type="number" defaultValue={6000} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">/month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Home Rates */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Home size={18} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900">Home Tutoring</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Hourly Rate (₹)</label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input type="number" defaultValue={1000} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">min</span>
                    </div>
                    <span className="self-center text-slate-400 font-bold">—</span>
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                      <input type="number" defaultValue={1500} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">max</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">Monthly Package (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">₹</span>
                    <input type="number" defaultValue={8000} className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-4 py-3 text-sm font-bold outline-none focus:border-[#0b5ed7]" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
            <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-medium">Tip: Competitive pricing attracts more leads. Check what other tutors in your area charge for similar subjects.</p>
          </div>
        </div>

        {/* Weekly Availability Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2"><Calendar size={20} className="text-[#0b5ed7]" /> Weekly Availability</h2>
          <p className="text-sm text-slate-500 font-medium mb-6">Click time slots to toggle your availability. Green = Available.</p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide py-2 w-28"></th>
                  {timeSlots.map(slot => (
                    <th key={slot} className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-wide py-2 px-1">{slot}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(day => (
                  <tr key={day} className="border-t border-slate-100">
                    <td className="py-2 pr-3">
                      <span className="text-sm font-bold text-slate-800">{day.slice(0, 3)}</span>
                    </td>
                    {timeSlots.map(slot => {
                      const active = (availability[day] || []).includes(slot);
                      return (
                        <td key={slot} className="py-2 px-1">
                          <button
                            onClick={() => toggleSlot(day, slot)}
                            className={`w-full h-9 rounded-lg text-[10px] font-bold transition-all ${active
                              ? 'bg-emerald-100 border border-emerald-300 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-50 border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                              }`}
                          >
                            {active ? '✓' : '—'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <CheckCircle2 size={18} /> Changes saved successfully!
            </div>
          )}
          <button onClick={handleSave} className="bg-[#0b5ed7] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeeAvailability;
