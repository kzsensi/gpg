import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { apiReviews } from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';

const TutorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await apiReviews.getByTutor(user.id);
      setReviews(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchReviews();
  }, [user]);

  const averageRating = reviews.length 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 0;

  return (
    <DashboardLayout type="tutor">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">My Reviews</h1>
          <p className="text-slate-500 font-medium">See what parents are saying about your classes.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center">
            <div className="text-5xl font-black text-slate-900 mb-2">{averageRating}</div>
            <div className="flex text-amber-400 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={20} className={star <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-200'} />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Average Rating</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center justify-center md:col-span-2">
             <div className="text-3xl font-black text-slate-900 mb-2">{reviews.length}</div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">Total Reviews</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>)}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center">
                      {(review.parent_name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{review.parent_name || 'Parent'}</h4>
                      <p className="text-xs text-slate-500">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(review.created_at))}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} className={star <= review.rating ? 'fill-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-2">No reviews yet</h3>
            <p className="text-slate-500 font-medium">After you complete demos and get hired, parents can leave you reviews here.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TutorReviews;
