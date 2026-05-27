import React from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from '../../components/TopNavigation';
import { ReceiptText, ArrowUp } from 'lucide-react';

const RefundPolicy = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sections = [
    {
      id: 'refund-eligibility',
      title: '1. Refund Eligibility',
      content: (
        <>
          <p>
            At GharPeGyan, we strive to ensure a positive experience for all users. Refunds may be
            applicable in the following circumstances:
          </p>
          <ul>
            <li>Teacher does not show up for a confirmed and paid session</li>
            <li>Session quality is significantly below the standards advertised on the teacher's profile</li>
            <li>Technical issues on our platform prevented the session from taking place</li>
            <li>Duplicate or erroneous payments</li>
            <li>Cancellation by the teacher within the cancellation window</li>
          </ul>
          <p>
            Refund requests must be raised within <strong>7 days</strong> of the session date. Requests
            submitted after this window may not be eligible for a refund.
          </p>
        </>
      ),
    },
    {
      id: 'demo-sessions',
      title: '2. Demo Sessions',
      content: (
        <>
          <p>
            Demo sessions on GharPeGyan are provided <strong>free of charge</strong> to help parents and
            students evaluate a teacher before committing to paid sessions.
          </p>
          <ul>
            <li>No payment is required for demo sessions; therefore, no refund applies</li>
            <li>If a teacher fails to conduct a confirmed demo, you may rebook with the same or a different teacher at no cost</li>
            <li>Repeated no-shows by either party may result in temporary restrictions on the account</li>
          </ul>
          <p>
            If you were incorrectly charged for a demo session, please contact us immediately for a full refund.
          </p>
        </>
      ),
    },
    {
      id: 'subscription-refunds',
      title: '3. Subscription Refunds',
      content: (
        <>
          <p>For subscription-based or bundled session packages:</p>
          <ul>
            <li>
              <strong>Within 48 hours of purchase:</strong> Full refund if no sessions have been utilised
            </li>
            <li>
              <strong>After 48 hours, unused sessions:</strong> Pro-rata refund for unused sessions, minus a 10% processing fee
            </li>
            <li>
              <strong>Partially used packages:</strong> Refund is calculated based on the remaining unused sessions at the per-session rate
            </li>
            <li>
              <strong>Fully used packages:</strong> No refund is available once all sessions have been consumed
            </li>
          </ul>
          <p>
            Promotional or discounted packages may have different refund terms, which will be clearly
            communicated at the time of purchase.
          </p>
        </>
      ),
    },
    {
      id: 'refund-process',
      title: '4. Refund Process',
      content: (
        <>
          <p>To request a refund, follow these steps:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong>Log in</strong> to your GharPeGyan account and navigate to <em>My Dashboard → Payment History</em>
            </li>
            <li>
              <strong>Select the transaction</strong> you wish to request a refund for
            </li>
            <li>
              <strong>Click "Request Refund"</strong> and provide the reason for your request
            </li>
            <li>
              <strong>Upload evidence</strong> if applicable (screenshots, chat logs, etc.)
            </li>
            <li>
              <strong>Submit</strong> your request — you will receive a confirmation email with a ticket number
            </li>
          </ol>
          <p className="mt-3">
            Alternatively, you can email us at{' '}
            <a href="mailto:refunds@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
              refunds@gharpegyan.com
            </a>{' '}
            with your transaction ID, reason, and any supporting evidence.
          </p>
        </>
      ),
    },
    {
      id: 'timeline',
      title: '5. Refund Timeline',
      content: (
        <>
          <p>Once your refund request is approved:</p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200">Payment Method</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200">Processing Time</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3">UPI (Google Pay, PhonePe, Paytm)</td>
                  <td className="px-4 py-3">1–3 business days</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3">Debit / Credit Card</td>
                  <td className="px-4 py-3">5–7 business days</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3">Net Banking</td>
                  <td className="px-4 py-3">5–10 business days</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">GharPeGyan Wallet</td>
                  <td className="px-4 py-3">Instant</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Refunds are always processed to the <strong>original payment method</strong>. In exceptional
            cases, we may offer platform credits instead, with your consent.
          </p>
        </>
      ),
    },
    {
      id: 'contact',
      title: '6. Contact for Refund Queries',
      content: (
        <>
          <p>If you have any questions about our refund policy or need assistance with a refund:</p>
          <div className="bg-slate-50 rounded-xl p-5 mt-3">
            <p className="font-semibold text-slate-800">GharPeGyan Payments Team</p>
            <p>
              Email:{' '}
              <a href="mailto:refunds@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
                refunds@gharpegyan.com
              </a>
            </p>
            <p>Phone: +91 80-4567-8901 (Mon–Sat, 9 AM – 7 PM IST)</p>
            <p>In-app: Go to Help → Payments → Refund Support</p>
          </div>
          <p className="mt-4">
            We aim to resolve all refund queries within <strong>3 business days</strong>. If you are
            unsatisfied with the resolution, you may escalate your complaint to{' '}
            <a href="mailto:grievance@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
              grievance@gharpegyan.com
            </a>
            .
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <TopNavigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 rounded-2xl mb-5">
            <ReceiptText size={28} className="text-amber-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Refund Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: May 15, 2026</p>
        </div>

        {/* quick summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 md:p-6 mb-8">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Quick summary:</strong> Demo sessions are free. Paid session refunds must be requested
            within 7 days. Subscription refunds are pro-rated. Refunds are processed to your original
            payment method within 1–10 business days depending on the method.
          </p>
        </div>

        {/* table of contents */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Table of Contents</h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-[14px] text-[#0b5ed7] hover:underline hover:text-blue-700 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* content */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {s.title}
                </h2>
                <div className="space-y-4 text-[15px] leading-relaxed text-slate-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-slate-600">
                  {s.content}
                </div>
              </section>
            ))}
          </div>
        </article>

        {/* footer links */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
            Other Legal Pages
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/legal/terms-of-service"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Terms of Service
            </Link>
            <Link
              to="/legal/privacy-policy"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Privacy Policy
            </Link>
            <Link
              to="/legal/community-rules"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Community Rules
            </Link>
          </div>
        </div>

        {/* scroll to top */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0b5ed7] transition-colors"
          >
            <ArrowUp size={16} /> Back to top
          </button>
        </div>
      </main>
    </div>
  );
};

export default RefundPolicy;
