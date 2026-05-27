import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
  Eye,
  Users,
  CalendarCheck,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  User,
  BookOpen,
  MapPin,
  ChevronRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Profile Views',
    value: '245',
    change: '+18% this week',
    icon: Eye,
    color: '#0b5ed7',
    bg: '#eff6ff',
  },
  {
    label: 'Leads Received',
    value: '12',
    change: '+3 new today',
    icon: Users,
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    label: 'Demos Scheduled',
    value: '3',
    change: 'Next: Tomorrow 4 PM',
    icon: CalendarCheck,
    color: '#9333ea',
    bg: '#faf5ff',
  },
  {
    label: 'Average Rating',
    value: '4.9',
    change: 'Based on 38 reviews',
    icon: Star,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
];

const recentLeads = [
  {
    id: 1,
    parent: 'Priya Sharma',
    student: 'Ananya Sharma',
    class: 'Class 10',
    subject: 'Mathematics',
    location: 'Koramangala, Bangalore',
    time: '2 hours ago',
    status: 'new',
  },
  {
    id: 2,
    parent: 'Rajesh Gupta',
    student: 'Arjun Gupta',
    class: 'Class 8',
    subject: 'Science',
    location: 'Indiranagar, Bangalore',
    time: '5 hours ago',
    status: 'new',
  },
  {
    id: 3,
    parent: 'Meera Krishnan',
    student: 'Shreya Krishnan',
    class: 'Class 12',
    subject: 'Physics',
    location: 'HSR Layout, Bangalore',
    time: '1 day ago',
    status: 'responded',
  },
  {
    id: 4,
    parent: 'Anil Verma',
    student: 'Rohan Verma',
    class: 'Class 6',
    subject: 'English',
    location: 'Whitefield, Bangalore',
    time: '2 days ago',
    status: 'responded',
  },
];

const quickActions = [
  { label: 'Complete Profile', path: '/tutor/profile-builder', icon: User, color: '#0b5ed7' },
  { label: 'Upload Video', path: '/tutor/media', icon: TrendingUp, color: '#9333ea' },
  { label: 'Set Availability', path: '/tutor/fees', icon: Clock, color: '#16a34a' },
  { label: 'View All Leads', path: '/tutor/leads', icon: Users, color: '#f59e0b' },
];

const TutorDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout type="tutor">
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        {/* Welcome header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0b5ed7 0%, #4f46e5 100%)',
            borderRadius: '20px',
            padding: '32px 40px',
            marginBottom: '28px',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-20px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '120px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
            }}
          />
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
            Welcome back, Rahul! 👋
          </h1>
          <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '500px', lineHeight: 1.6 }}>
            Your profile is performing well this week. You have 3 new leads and 1 upcoming demo session.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, marginBottom: '6px' }}>
                      {stat.label}
                    </p>
                    <p style={{ fontSize: '32px', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
                      {stat.value}
                    </p>
                  </div>
                  <div
                    style={{
                      background: stat.bg,
                      color: stat.color,
                      padding: '10px',
                      borderRadius: '12px',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={12} style={{ color: '#16a34a' }} />
                  {stat.change}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px 20px',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f172a',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    width: '100%',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = action.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${action.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ background: `${action.color}15`, color: action.color, padding: '8px', borderRadius: '10px' }}>
                    <Icon size={18} />
                  </div>
                  {action.label}
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              Recent Leads
            </h2>
            <button
              onClick={() => navigate('/tutor/leads')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: '#0b5ed7',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/tutor/leads')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '16px',
                    flexShrink: 0,
                  }}
                >
                  {lead.parent.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>
                      {lead.parent}
                    </span>
                    {lead.status === 'new' && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#dbeafe',
                          color: '#0b5ed7',
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={12} /> {lead.subject} · {lead.class}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {lead.location}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{lead.time}</span>
                  <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TutorDashboardHome;
