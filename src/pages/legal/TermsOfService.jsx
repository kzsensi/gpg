import React from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from '../../components/TopNavigation';
import { FileText, ArrowUp } from 'lucide-react';

const TermsOfService = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sections = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: (
        <>
          <p>
            Welcome to GharPeGyan ("we," "our," or "us"). These Terms of Service ("Terms") govern your
            access to and use of the GharPeGyan platform, including our website, mobile applications, and
            all related services (collectively, the "Platform").
          </p>
          <p>
            By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree
            to these Terms, you may not access or use the Platform. These Terms constitute a legally binding
            agreement between you and GharPeGyan Technologies Private Limited, registered in Bengaluru,
            Karnataka, India.
          </p>
        </>
      ),
    },
    {
      id: 'user-accounts',
      title: '2. User Accounts',
      content: (
        <>
          <p>To use certain features of the Platform, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security and confidentiality of your login credentials</li>
            <li>Accept responsibility for all activities that occur under your account</li>
            <li>Notify us immediately of any unauthorised access to your account</li>
          </ul>
          <p>
            You must be at least 18 years of age to create an account. If you are a student under 18 years of age, you may only access the Platform and attend sessions under the supervision and with the explicit consent of a parent or legal guardian who registered the account on your behalf. Teachers must verify their identity and qualifications through our verification process. We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </>
      ),
    },
    {
      id: 'teacher-listings',
      title: '3. Teacher Listings',
      content: (
        <>
          <p>
            Teachers who register on the Platform may create listings for their tutoring services. All
            listings must:
          </p>
          <ul>
            <li>Accurately describe the teacher's qualifications, experience, and areas of expertise</li>
            <li>Clearly state the subjects, levels, and age groups they teach</li>
            <li>Provide honest and up-to-date pricing information in Indian Rupees (₹)</li>
            <li>Include genuine photographs and credentials</li>
            <li>Comply with all applicable Indian laws and regulations</li>
          </ul>
          <p>
            GharPeGyan reserves the right to review, modify, or remove any listing that violates these Terms
            or that we deem inappropriate, misleading, or harmful to the community.
          </p>
        </>
      ),
    },
    {
      id: 'parent-requirements',
      title: '4. Parent Requirements',
      content: (
        <>
          <p>Parents and guardians using the Platform agree to:</p>
          <ul>
            <li>Provide accurate information about their children, including age and learning needs</li>
            <li>Supervise their children during tutoring sessions, especially for younger children</li>
            <li>Communicate respectfully with teachers and other Platform users</li>
            <li>Report any concerns about a teacher's conduct or qualifications promptly</li>
            <li>Honour scheduled sessions and provide reasonable notice for cancellations</li>
          </ul>
          <p>
            Parents are responsible for determining the suitability of a teacher for their child's needs.
            While we verify teacher profiles, we encourage parents to conduct their own assessment during
            demo sessions.
          </p>
        </>
      ),
    },
    {
      id: 'demo-sessions',
      title: '5. Demo Sessions',
      content: (
        <>
          <p>
            GharPeGyan facilitates demo sessions to help parents and students evaluate teachers before
            committing to regular sessions.
          </p>
          <ul>
            <li>Demo sessions are typically 20-30 minutes in duration</li>
            <li>Each parent may book one demo session per teacher, free of charge</li>
            <li>Teachers are expected to demonstrate their teaching style and methodology</li>
            <li>No-shows for confirmed demos may result in restrictions on future bookings</li>
            <li>Demo sessions do not guarantee a commitment from either party</li>
          </ul>
        </>
      ),
    },
    {
      id: 'payments',
      title: '6. Payments',
      content: (
        <>
          <p>All payments on the Platform are processed in Indian Rupees (₹).</p>
          <ul>
            <li>
              Fees are set by individual teachers and clearly displayed on their profiles
            </li>
            <li>
              Payments are processed through secure, third-party payment gateways (Razorpay / Stripe)
            </li>
            <li>
              GharPeGyan charges a platform service fee, which is transparently shown before checkout
            </li>
            <li>Teachers receive payouts within 7 business days of session completion</li>
            <li>All fees are inclusive of applicable GST unless stated otherwise</li>
          </ul>
          <p>
            Refunds are subject to our refund policies (contact support for assistance). Disputes should be raised within 7 days of the transaction.
          </p>
        </>
      ),
    },
    {
      id: 'privacy',
      title: '7. Privacy',
      content: (
        <>
          <p>
            Your privacy is important to us. Our collection and use of personal information is governed by
            our{' '}
            <Link to="/privacy" className="text-[#0b5ed7] font-medium hover:underline">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
          <p>
            By using the Platform, you consent to the collection, processing, and storage of your personal
            data in accordance with our Privacy Policy and applicable Indian data protection laws, including
            the Digital Personal Data Protection Act, 2023.
          </p>
        </>
      ),
    },
    {
      id: 'intellectual-property',
      title: '8. Intellectual Property',
      content: (
        <>
          <p>
            All content on the Platform, including but not limited to text, graphics, logos, icons, images,
            audio clips, and software, is the property of GharPeGyan or its content suppliers and is
            protected by Indian and international copyright, trademark, and other intellectual property laws.
          </p>
          <ul>
            <li>You may not reproduce, distribute, or create derivative works from our content</li>
            <li>Teachers retain ownership of their original teaching materials</li>
            <li>
              By uploading content, teachers grant GharPeGyan a non-exclusive licence to display it on the
              Platform
            </li>
            <li>User-generated reviews and feedback may be used by GharPeGyan for promotional purposes</li>
          </ul>
        </>
      ),
    },
    {
      id: 'limitation-of-liability',
      title: '9. Limitation of Liability',
      content: (
        <>
          <p>
            To the maximum extent permitted by applicable Indian law, GharPeGyan shall not be liable for
            any indirect, incidental, special, consequential, or punitive damages arising out of or related
            to your use of the Platform.
          </p>
          <ul>
            <li>
              GharPeGyan acts as a marketplace connecting teachers and parents; we are not a party to the
              teaching arrangement
            </li>
            <li>We do not guarantee specific learning outcomes or results</li>
            <li>
              Our total liability shall not exceed the amount paid by you to us in the 12 months preceding
              the claim
            </li>
            <li>
              We are not liable for any disputes between teachers and parents/students
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'changes-to-terms',
      title: '10. Changes to Terms',
      content: (
        <>
          <p>
            We reserve the right to modify these Terms at any time. When we make material changes, we will:
          </p>
          <ul>
            <li>Post the updated Terms on the Platform with a new "Last Updated" date</li>
            <li>Notify registered users via email at least 15 days before changes take effect</li>
            <li>Provide a summary of key changes</li>
          </ul>
          <p>
            Your continued use of the Platform after the effective date of any changes constitutes your
            acceptance of the revised Terms. If you do not agree with the changes, you should discontinue
            use of the Platform.
          </p>
          <p>
            For questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
              legal@gharpegyan.com
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
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#0b5ed7]/10 rounded-2xl mb-5">
            <FileText size={28} className="text-[#0b5ed7]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last updated: May 15, 2026</p>
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
          <div className="prose-custom space-y-10">
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
              to="/privacy"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Privacy Policy
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

export default TermsOfService;
