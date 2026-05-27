import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
  ShieldCheck,
  FileCheck,
  UserCheck,
  ClipboardCheck,
  Upload,
  Check,
  Clock,
  AlertCircle,
  ChevronRight,
  FileText,
  Eye,
} from 'lucide-react';

const verificationSteps = [
  {
    id: 1,
    title: 'ID Verification',
    description: 'Upload a government-issued photo ID (Aadhaar, PAN, or Passport)',
    status: 'completed',
    icon: UserCheck,
    uploadedFile: 'aadhaar_card.pdf',
    uploadedDate: '15 May 2026',
  },
  {
    id: 2,
    title: 'Qualification Documents',
    description: 'Upload your highest education degree certificate',
    status: 'pending',
    icon: FileCheck,
    uploadedFile: 'bsc_certificate.pdf',
    uploadedDate: '18 May 2026',
  },
  {
    id: 3,
    title: 'Background Check',
    description: 'We run a third-party background verification for safety',
    status: 'pending',
    icon: ShieldCheck,
    uploadedFile: null,
    uploadedDate: null,
  },
  {
    id: 4,
    title: 'Profile Review',
    description: 'Our team reviews your profile for completeness and quality',
    status: 'not_started',
    icon: ClipboardCheck,
    uploadedFile: null,
    uploadedDate: null,
  },
];

const statusConfig = {
  completed: { label: 'Completed', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: Check },
  pending: { label: 'Pending Review', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', icon: Clock },
  not_started: { label: 'Not Started', color: '#94a3b8', bg: '#f8fafc', border: '#e2e8f0', icon: AlertCircle },
};

const VerificationStatus = () => {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);

  const completedCount = verificationSteps.filter((s) => s.status === 'completed').length;
  const progressPercent = (completedCount / verificationSteps.length) * 100;

  return (
    <DashboardLayout type="tutor">
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a' }}>Verification Status</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Complete all verification steps to get the verified badge on your profile
          </p>
        </div>

        {/* Progress bar card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0b5ed7 0%, #4f46e5 100%)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '28px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-10px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
                Verification Progress
              </h2>
              <p style={{ fontSize: '14px', opacity: 0.85 }}>
                {completedCount} of {verificationSteps.length} steps completed
              </p>
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 800,
                background: 'rgba(255,255,255,0.15)',
                padding: '8px 20px',
                borderRadius: '14px',
              }}
            >
              {Math.round(progressPercent)}%
            </div>
          </div>
          <div
            style={{
              width: '100%',
              height: '10px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#fff',
                borderRadius: '999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Verification steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {verificationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const config = statusConfig[step.status];
            const StatusIcon = config.icon;
            const expanded = expandedStep === step.id;

            return (
              <div
                key={step.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: `1px solid ${expanded ? '#0b5ed7' : '#e2e8f0'}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Step header */}
                <div
                  onClick={() => setExpandedStep(expanded ? null : step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px 24px',
                    cursor: 'pointer',
                  }}
                >
                  {/* Step number circle */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: step.status === 'completed'
                        ? '#16a34a'
                        : step.status === 'pending'
                          ? '#f59e0b'
                          : '#e2e8f0',
                      color: step.status === 'not_started' ? '#94a3b8' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {step.status === 'completed' ? <Check size={20} /> : <StepIcon size={20} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                        {step.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: config.bg,
                          color: config.color,
                          border: `1px solid ${config.border}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <StatusIcon size={12} />
                        {config.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>
                      {step.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={18}
                    style={{
                      color: '#94a3b8',
                      transform: expanded ? 'rotate(90deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Expanded content */}
                {expanded && (
                  <div
                    style={{
                      padding: '0 24px 24px',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '20px',
                    }}
                  >
                    {step.uploadedFile ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 18px',
                          background: '#f8fafc',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} style={{ color: '#0b5ed7' }} />
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                              {step.uploadedFile}
                            </p>
                            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                              Uploaded on {step.uploadedDate}
                            </p>
                          </div>
                        </div>
                        <button
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            background: '#fff',
                            color: '#475569',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          <Eye size={14} /> View
                        </button>
                      </div>
                    ) : null}

                    {step.status !== 'completed' && (
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '14px',
                          padding: '32px',
                          textAlign: 'center',
                          background: '#fafbfc',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#0b5ed7';
                          e.currentTarget.style.background = '#eff6ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.background = '#fafbfc';
                        }}
                      >
                        <Upload size={28} style={{ color: '#0b5ed7', margin: '0 auto 12px' }} />
                        <p style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                          {step.uploadedFile ? 'Re-upload Document' : 'Upload Document'}
                        </p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                          PDF, JPG or PNG · Max 10MB
                        </p>
                      </div>
                    )}

                    {step.status === 'pending' && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginTop: '16px',
                          padding: '12px 16px',
                          background: '#fffbeb',
                          borderRadius: '10px',
                          border: '1px solid #fde68a',
                        }}
                      >
                        <Clock size={16} style={{ color: '#f59e0b' }} />
                        <p style={{ fontSize: '13px', color: '#92400e' }}>
                          Your document is under review. This usually takes 1-2 business days.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info banner */}
        <div
          style={{
            marginTop: '24px',
            padding: '20px 24px',
            background: '#eff6ff',
            borderRadius: '14px',
            border: '1px solid #bfdbfe',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <ShieldCheck size={20} style={{ color: '#0b5ed7', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>
              Why get verified?
            </p>
            <p style={{ fontSize: '13px', color: '#1e40af', lineHeight: 1.6 }}>
              Verified tutors get a trust badge on their profile, appear higher in search results, and receive 3x more leads from parents. Complete your verification today!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VerificationStatus;
