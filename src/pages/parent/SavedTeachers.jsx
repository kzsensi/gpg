import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Star, MapPin, Briefcase, ShieldCheck, Heart, MessageCircle, PlayCircle } from 'lucide-react';

const savedTutors = [
  { id: 1, name: 'Priya Sharma', subject: 'Mathematics', qualification: 'M.Sc. Mathematics, B.Ed.', rating: 4.9, reviews: 48, location: 'Andheri West, Mumbai', price: '₹800 - ₹1200/hr', experience: '8 yrs', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 2, name: 'Rahul Sharma', subject: 'Physics', qualification: 'B.Tech IIT Delhi', rating: 4.7, reviews: 32, location: 'Online Only', price: '₹1000 - ₹1500/hr', experience: '5 yrs', img: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 3, name: 'Sneha Gupta', subject: 'English Literature', qualification: 'M.A. English, Cambridge CELTA', rating: 4.8, reviews: 56, location: 'Koramangala, Bangalore', price: '₹600 - ₹900/hr', experience: '6 yrs', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 4, name: 'Amit Patel', subject: 'Chemistry', qualification: 'M.Sc. Chemistry, Ph.D.', rating: 4.6, reviews: 21, location: 'Bandra, Mumbai', price: '₹900 - ₹1300/hr', experience: '10 yrs', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80' },
  { id: 5, name: 'Kavita Reddy', subject: 'Biology / NEET', qualification: 'MBBS, M.D.', rating: 4.9, reviews: 73, location: 'Hyderabad (Or Online)', price: '₹1200 - ₹1800/hr', experience: '7 yrs', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80' },
];

const SavedTeachers = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout type="parent">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Saved Teachers</h1>
            <p className="text-slate-500 font-medium">You have {savedTutors.length} teachers saved for later.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {savedTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col relative group">
              <button className="absolute top-4 right-4 text-rose-500 hover:text-rose-700 transition-colors" title="Remove from saved">
                <Heart size={20} className="fill-rose-500" />
              </button>

              <div className="flex gap-4 mb-4">
                <div className="relative">
                  <img src={tutor.img} alt={tutor.name} className="w-14 h-14 rounded-full object-cover border border-slate-100" />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <ShieldCheck size={14} className="text-emerald-500 fill-emerald-100" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-base truncate">{tutor.name}</h3>
                  <p className="text-xs text-slate-500 font-medium truncate">{tutor.qualification}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-700">{tutor.rating}</span>
                    <span className="text-xs text-slate-400">({tutor.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 flex-1">
                <div className="text-sm text-slate-600 flex items-center gap-2 font-medium">
                  <MapPin size={14} className="text-slate-400 shrink-0" /> {tutor.location}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-800 font-bold">{tutor.price}</span>
                  <span className="text-slate-500 flex items-center gap-1"><Briefcase size={14} className="text-slate-400" /> {tutor.experience}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button onClick={() => navigate(`/teacher/${tutor.id}`)} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 bg-[#0b5ed7] text-white font-semibold py-2 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1">
                  <PlayCircle size={14} /> Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedTeachers;
