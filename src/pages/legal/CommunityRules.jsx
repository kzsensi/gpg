import React from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from '../../components/TopNavigation';
import { Users, ArrowUp } from 'lucide-react';

const CommunityRules = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sections = [
    {
      id: 'code-of-conduct',
      title: '1. Code of Conduct',
      content: (
        <>
          <p>
            GharPeGyan is built on a foundation of trust, respect, and a shared commitment to quality
            education. Every member of our community — teachers, parents, and students — is expected to
            uphold the following principles:
          </p>
          <ul>
            <li>
              <strong>Respect:</strong> Treat all community members with dignity, courtesy, and kindness, regardless of background, religion, caste, gender, or ability
            </li>
            <li>
              <strong>Honesty:</strong> Provide truthful information in profiles, reviews, and all communications
            </li>
            <li>
              <strong>Safety:</strong> Prioritise the safety and well-being of children at all times
            </li>
            <li>
              <strong>Professionalism:</strong> Maintain a professional demeanour during all interactions on the platform
            </li>
            <li>
              <strong>Inclusivity:</strong> Welcome and support learners of all abilities and backgrounds
            </li>
            <li>
              <strong>Accountability:</strong> Take responsibility for your actions and honour your commitments
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'teacher-guidelines',
      title: '2. Teacher Guidelines',
      content: (
        <>
          <p>Teachers on GharPeGyan are expected to maintain the highest standards of professionalism:</p>
          <ul>
            <li>
              <strong>Accurate Profiles:</strong> Ensure your qualifications, experience, and subject expertise are accurately represented
            </li>
            <li>
              <strong>Punctuality:</strong> Arrive on time for all scheduled sessions, including demos. Notify parents at least 2 hours in advance if you need to reschedule
            </li>
            <li>
              <strong>Preparation:</strong> Come prepared with appropriate teaching materials and lesson plans tailored to the student's level
            </li>
            <li>
              <strong>Communication:</strong> Respond to parent messages within 24 hours. Keep parents informed about their child's progress
            </li>
            <li>
              <strong>Boundaries:</strong> Maintain appropriate boundaries with students. Never share personal contact details outside the platform during the initial engagement period
            </li>
            <li>
              <strong>Pricing:</strong> Set fair and transparent pricing. Do not charge fees outside the platform for services booked through GharPeGyan
            </li>
            <li>
              <strong>Feedback:</strong> Accept constructive feedback graciously and work to continuously improve your teaching
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'parent-guidelines',
      title: '3. Parent Guidelines',
      content: (
        <>
          <p>Parents and guardians play a crucial role in creating a positive learning environment:</p>
          <ul>
            <li>
              <strong>Accurate Information:</strong> Provide accurate details about your child's age, grade, learning needs, and any special requirements
            </li>
            <li>
              <strong>Supervision:</strong> Ensure appropriate supervision during sessions, especially for children under 12 years of age
            </li>
            <li>
              <strong>Respect for Teachers:</strong> Treat teachers with respect and professionalism. Value their time and expertise
            </li>
            <li>
              <strong>Timely Communication:</strong> Inform teachers of cancellations at least 4 hours before a scheduled session
            </li>
            <li>
              <strong>Constructive Feedback:</strong> Provide honest and constructive reviews. Avoid personal attacks or defamatory language
            </li>
            <li>
              <strong>Payment:</strong> Make payments promptly through the platform. Do not negotiate off-platform payments
            </li>
            <li>
              <strong>Learning Environment:</strong> Provide a quiet, distraction-free space for your child during sessions
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'prohibited-activities',
      title: '4. Prohibited Activities',
      content: (
        <>
          <p>The following activities are strictly prohibited on GharPeGyan:</p>
          <ul>
            <li>
              <strong>Harassment & Abuse:</strong> Any form of verbal, written, or physical harassment, bullying, or abuse directed at any community member
            </li>
            <li>
              <strong>Discrimination:</strong> Discriminating against any user based on religion, caste, gender, disability, sexual orientation, or socio-economic status
            </li>
            <li>
              <strong>Fraud:</strong> Misrepresenting qualifications, creating fake reviews, or engaging in any deceptive practices
            </li>
            <li>
              <strong>Inappropriate Content:</strong> Sharing obscene, sexually explicit, violent, or otherwise inappropriate content
            </li>
            <li>
              <strong>Spam:</strong> Sending unsolicited promotional messages, advertisements, or repetitive messages
            </li>
            <li>
              <strong>Platform Circumvention:</strong> Attempting to bypass platform fees by conducting transactions outside GharPeGyan
            </li>
            <li>
              <strong>Data Misuse:</strong> Collecting, storing, or misusing other users' personal information
            </li>
            <li>
              <strong>Impersonation:</strong> Creating accounts under false identities or impersonating other users
            </li>
            <li>
              <strong>Illegal Activities:</strong> Using the platform for any purpose that violates Indian law
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'reporting',
      title: '5. Reporting Violations',
      content: (
        <>
          <p>
            If you witness or experience a violation of these community rules, please report it immediately.
            We take every report seriously and investigate promptly.
          </p>
          <h4 className="font-semibold text-slate-800 mt-4 mb-2">How to Report</h4>
          <ul>
            <li>
              <strong>In-App:</strong> Tap the three-dot menu (⋮) on any user profile or message and select "Report"
            </li>
            <li>
              <strong>Email:</strong> Send details to{' '}
              <a href="mailto:safety@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
                safety@gharpegyan.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong> Call our safety helpline at +91 80-4567-8902 (Mon–Sat, 9 AM – 9 PM IST)
            </li>
          </ul>
          <h4 className="font-semibold text-slate-800 mt-4 mb-2">What to Include</h4>
          <ul>
            <li>Your name and account details</li>
            <li>The name or profile of the person you are reporting</li>
            <li>A description of the incident with dates and times</li>
            <li>Screenshots, chat logs, or any other supporting evidence</li>
          </ul>
          <p className="mt-3">
            All reports are treated <strong>confidentially</strong>. Retaliation against anyone who files a
            report in good faith is strictly prohibited and will result in immediate action.
          </p>
        </>
      ),
    },
    {
      id: 'enforcement',
      title: '6. Enforcement & Consequences',
      content: (
        <>
          <p>
            GharPeGyan reserves the right to take action against any user who violates these community rules.
            Actions are proportional to the severity and frequency of the violation:
          </p>
          <div className="overflow-x-auto mt-3">
            <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200">Violation</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 border-b border-slate-200">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-amber-600">Warning</td>
                  <td className="px-4 py-3">Minor first-time offences (late responses, mild language)</td>
                  <td className="px-4 py-3">Written warning via email</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-orange-600">Temporary Suspension</td>
                  <td className="px-4 py-3">Repeated warnings, no-shows, off-platform payments</td>
                  <td className="px-4 py-3">7–30 day account suspension</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-3 font-medium text-red-600">Permanent Ban</td>
                  <td className="px-4 py-3">Harassment, fraud, child safety violations</td>
                  <td className="px-4 py-3">Permanent account termination</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-red-800">Legal Action</td>
                  <td className="px-4 py-3">Illegal activities, threats, data theft</td>
                  <td className="px-4 py-3">Ban + report to law enforcement</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Users who are suspended or banned may appeal the decision by writing to{' '}
            <a href="mailto:appeals@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
              appeals@gharpegyan.com
            </a>{' '}
            within 15 days of the action. Appeals are reviewed by a senior committee and a decision is
            communicated within 10 business days.
          </p>
          <p>
            These rules are designed to keep GharPeGyan a <strong>safe, trustworthy, and enriching</strong>{' '}
            platform for everyone. Thank you for being a responsible member of our community.
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
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-50 rounded-2xl mb-5">
            <Users size={28} className="text-violet-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Community Rules</h1>
          <p className="text-slate-500 text-sm">Last updated: May 15, 2026</p>
        </div>

        {/* mission statement */}
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 md:p-6 mb-8">
          <p className="text-sm text-violet-800 leading-relaxed">
            <strong>Our commitment:</strong> GharPeGyan is a community of passionate teachers, caring
            parents, and eager learners. These rules ensure that every interaction on our platform is safe,
            respectful, and focused on what matters most — quality education at home.
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
              to="/legal/refund-policy"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Refund Policy
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

export default CommunityRules;
