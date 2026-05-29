import React, { useState } from 'react';
import TopNavigation from '../components/TopNavigation';
import { Mail, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a202c] mb-4">Help & Support</h1>
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
      </div>
    </div>
  );
};

export default HelpSupport;
