import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import { useAuth } from '../contexts/AuthContext';
import { apiAccount } from '../services/api';
import { Mail, MessageCircle, ChevronDown, ChevronUp, Trash2, AlertTriangle, X, Loader } from 'lucide-react';

const faqs = [
  {
    question: "How do I cancel or reschedule a booked class?",
    answer: "You can reschedule or cancel a class up to 12 hours before the scheduled start time without any penalty. Go to your Dashboard, click on 'My Schedule' or 'Demo Sessions', select the class, and choose 'Reschedule' or 'Cancel'."
  },
  {
    question: "What happens if my tutor doesn't show up?",
    answer: "If a tutor fails to join the session within 15 minutes of the scheduled time, you can report the issue from the session details page. Our team will verify and ensure you are fully refunded or the class is rescheduled."
  },
  {
    question: "Are the first trial classes actually free?",
    answer: "Yes! Your first demo class with any tutor is completely free. This helps you evaluate if the tutor's teaching style is a good fit before you commit to hiring them."
  },
  {
    question: "How does the GharPeGyan payment system work?",
    answer: "Payments are processed securely through our platform. Once you hire a tutor, you will be billed on a monthly cycle. We hold the funds securely and release them to the tutor only after classes are successfully conducted."
  },
  {
    question: "Can I switch tutors if I'm not satisfied?",
    answer: "Absolutely. If you are not satisfied with your current tutor, you can cancel your ongoing tuition and request a new one from your dashboard. Any unused classes for the month will be refunded."
  }
];

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const userEmail = user?.email || '';
  const emailMatches = emailInput.trim().toLowerCase() === userEmail.toLowerCase();

  const openModal = () => {
    setEmailInput('');
    setDeleteError('');
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    if (isDeleting) return; // prevent closing while deleting
    setShowDeleteModal(false);
    setEmailInput('');
    setDeleteError('');
  };

  const handleDeleteAccount = async () => {
    if (!emailMatches || isDeleting) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      await apiAccount.deleteMyAccount();
      // Sign out locally (auth row is already gone in DB)
      await signOut();
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err.message || 'Something went wrong. Please try again or contact support.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />

      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-4">Help &amp; Support</h1>
          <p className="text-slate-500 text-lg">Get answers to common questions or reach out to our team directly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

          {/* Left Column: Contact Methods */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Get in touch</h2>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-50 text-[#0b5ed7] rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
                  <p className="text-sm text-slate-500 mb-4">Drop us an email anytime. We usually respond within 24 hours.</p>
                  <a href="mailto:support@gharpegyan.com" className="text-sm font-bold text-[#0b5ed7] hover:underline">
                    support@gharpegyan.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Chat with us</h3>
                  <p className="text-sm text-slate-500 mb-4">Message us on WhatsApp for quick assistance with bookings or issues.</p>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1.5">
                    <MessageCircle size={16} /> +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: FAQs */}
          <div className="lg:col-span-7">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`border rounded-xl transition-all cursor-pointer overflow-hidden ${
                      isOpen ? 'border-[#0b5ed7] bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-blue-200'
                    }`}
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                  >
                    <div className="flex items-center justify-between p-5">
                      <h4 className={`font-semibold text-[15px] pr-4 ${isOpen ? 'text-[#0b5ed7]' : 'text-slate-800'}`}>
                        {faq.question}
                      </h4>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-blue-50 text-[#0b5ed7]' : 'bg-slate-50 text-slate-400'}`}>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-transparent">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── DANGER ZONE (logged-in users only) ─────────────────── */}
        {isAuthenticated && (
          <div className="mt-20 pt-10 border-t border-slate-200">
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Danger Zone</h2>
              <p className="text-slate-500 text-sm mb-6">Actions here are permanent and cannot be undone.</p>

              <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-red-800 text-[15px] mb-1">Delete My Account</h3>
                    <p className="text-sm text-red-700 leading-relaxed">
                      This will permanently delete your account, profile, and all your data — including messages, bookings, and requirements. This cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={openModal}
                    className="shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── DELETE CONFIRMATION MODAL ───────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 z-10">

            {/* Close button */}
            {!isDeleting && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}

            {/* Warning icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-600" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
              Delete your account?
            </h3>
            <p className="text-sm text-slate-500 text-center leading-relaxed mb-6">
              This will permanently delete everything — your profile, requirements, bookings, and messages. <span className="font-semibold text-slate-700">This cannot be undone.</span>
            </p>

            {/* Email confirmation field */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type your email to confirm
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => { setEmailInput(e.target.value); setDeleteError(''); }}
                placeholder={userEmail}
                disabled={isDeleting}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                autoComplete="off"
              />
              {emailInput.length > 0 && !emailMatches && (
                <p className="text-xs text-red-500 mt-1.5">Email does not match your account email.</p>
              )}
              {emailMatches && (
                <p className="text-xs text-emerald-600 mt-1.5">✓ Email confirmed</p>
              )}
            </div>

            {/* Error message */}
            {deleteError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                {deleteError}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeModal}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={!emailMatches || isDeleting}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition
                  ${emailMatches && !isDeleting
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm cursor-pointer'
                    : 'bg-red-200 text-red-400 cursor-not-allowed'
                  }`}
              >
                {isDeleting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Yes, delete my account
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HelpSupport;
