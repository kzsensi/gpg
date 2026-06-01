import React from 'react';
import { Link } from 'react-router-dom';
import TopNavigation from '../../components/TopNavigation';
import { Shield, ArrowUp } from 'lucide-react';

const PrivacyPolicy = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const sections = [
    {
      id: 'information-we-collect',
      title: '1. Information We Collect',
      content: (
        <>
          <p>We collect information to provide and improve our services. The types of information we collect include:</p>
          <h4 className="font-semibold text-slate-800 mt-4 mb-2">a) Information You Provide</h4>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, phone number, city, and profile photograph
            </li>
            <li>
              <strong>Teacher Information:</strong> Qualifications, teaching experience, subject expertise, Aadhaar/PAN for verification, and bank details for payouts
            </li>
            <li>
              <strong>Parent Information:</strong> Children's names, ages, class/grade, and learning requirements
            </li>
            <li>
              <strong>Communications:</strong> Messages exchanged through our in-app chat, feedback, and reviews
            </li>
          </ul>
          <h4 className="font-semibold text-slate-800 mt-4 mb-2">b) Information Collected Automatically</h4>
          <ul>
            <li>Device information (browser type, operating system, device model)</li>
            <li>IP address and approximate location (city-level)</li>
            <li>Usage data (pages visited, features used, session duration)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </>
      ),
    },
    {
      id: 'how-we-use-info',
      title: '2. How We Use Your Information',
      content: (
        <>
          <p>We use the collected information for the following purposes:</p>
          <ul>
            <li>
              <strong>Platform Operations:</strong> To create and manage your account, facilitate connections between teachers and parents, and process payments
            </li>
            <li>
              <strong>Communication:</strong> To send service-related notifications, session reminders, and respond to your queries
            </li>
            <li>
              <strong>Personalisation:</strong> To recommend teachers based on your location, preferences, and search history
            </li>
            <li>
              <strong>Safety & Verification:</strong> To verify teacher identities and qualifications, and maintain platform safety
            </li>
            <li>
              <strong>Improvement:</strong> To analyse usage patterns, fix bugs, and develop new features
            </li>
            <li>
              <strong>Legal Compliance:</strong> To comply with applicable Indian laws, including tax regulations and the Digital Personal Data Protection Act, 2023
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'data-sharing',
      title: '3. Data Sharing',
      content: (
        <>
          <p>
            We do not sell your personal data. We may share your information in the following limited circumstances:
          </p>
          <ul>
            <li>
              <strong>With Other Users:</strong> Teacher profiles (name, qualifications, ratings) are visible to parents. Parent contact details are shared with teachers only after a booking is confirmed.
            </li>
            <li>
              <strong>Payment Processors:</strong> We share necessary payment information with Razorpay/Stripe to process transactions securely.
            </li>
            <li>
              <strong>Service Providers:</strong> We use trusted third-party services for hosting (AWS Mumbai), email (SendGrid), analytics (Google Analytics), and SMS notifications.
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose information when required by Indian law, court order, or government authority.
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the successor entity.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'cookies',
      title: '4. Cookies & Tracking Technologies',
      content: (
        <>
          <p>We use cookies and similar technologies to enhance your experience:</p>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Required for login, session management, and security. Cannot be disabled.
            </li>
            <li>
              <strong>Functional Cookies:</strong> Remember your preferences, language settings, and recently viewed teachers.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand how users interact with the Platform using Google Analytics.
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements. You can opt out of these.
            </li>
          </ul>
          <p>
            You can manage cookie preferences through your browser settings. Disabling certain cookies may affect Platform functionality.
          </p>
        </>
      ),
    },
    {
      id: 'data-security',
      title: '5. Data Security',
      content: (
        <>
          <p>We implement robust security measures to protect your information:</p>
          <ul>
            <li>All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
            <li>Payment information is processed through PCI DSS-compliant payment gateways</li>
            <li>Access to personal data is restricted to authorised personnel on a need-to-know basis</li>
            <li>We conduct regular security audits and vulnerability assessments</li>
            <li>All data is stored on servers located in India (AWS Mumbai region)</li>
            <li>We maintain incident response procedures to address any data breaches promptly</li>
          </ul>
          <p>
            While we take every reasonable precaution, no method of electronic storage or transmission is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.
          </p>
        </>
      ),
    },
    {
      id: 'your-rights',
      title: '6. Your Rights',
      content: (
        <>
          <p>
            Under the Digital Personal Data Protection Act, 2023, and other applicable laws, you have the following rights:
          </p>
          <ul>
            <li>
              <strong>Right to Access:</strong> Request a copy of the personal data we hold about you
            </li>
            <li>
              <strong>Right to Correction:</strong> Request correction of inaccurate or incomplete personal data
            </li>
            <li>
              <strong>Right to Erasure (Account Deletion):</strong> Request deletion of your personal data. You can delete your account and all associated data (including profile, requirements, messages, and bookings) directly via the Delete Account button in the Help & Support page when logged in.
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw your consent for data processing at any time
            </li>
            <li>
              <strong>Right to Grievance Redressal:</strong> File a complaint with our Grievance Officer or the Data Protection Board of India
            </li>
            <li>
              <strong>Right to Nominate:</strong> Nominate another individual to exercise your rights in case of death or incapacity
            </li>
          </ul>
          <p>
            To exercise any of these rights, please contact our Data Protection Officer at{' '}
            <a href="mailto:privacy@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
              privacy@gharpegyan.com
            </a>
            . We will respond to your request within 30 days.
          </p>
        </>
      ),
    },
    {
      id: 'contact-us',
      title: '7. Contact Us',
      content: (
        <>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <div className="bg-slate-50 rounded-xl p-5 mt-3">
            <p className="font-semibold text-slate-800">GharPeGyan Technologies Private Limited</p>
            <p>Data Protection Officer: Arjun Mehta</p>
            <p>
              Email:{' '}
              <a href="mailto:privacy@gharpegyan.com" className="text-[#0b5ed7] font-medium hover:underline">
                privacy@gharpegyan.com
              </a>
            </p>
            <p>Phone: +91 80-4567-8900</p>
            <p>Address: 42, Indiranagar, 12th Main Road, Bengaluru, Karnataka 560038, India</p>
          </div>
          <p className="mt-4">
            You may also write to the Data Protection Board of India if you are unsatisfied with our response.
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
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-5">
            <Shield size={28} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: May 15, 2026</p>
        </div>

        {/* important notice */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 md:p-6 mb-8">
          <p className="text-sm text-emerald-800 leading-relaxed">
            <strong>Your privacy matters.</strong> GharPeGyan is committed to protecting the personal data of
            teachers, parents, and students. This policy explains what data we collect, how we use it, and
            your rights under Indian law, including the Digital Personal Data Protection Act, 2023.
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
              to="/terms"
              className="text-sm text-[#0b5ed7] bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
              Terms of Service
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

export default PrivacyPolicy;
