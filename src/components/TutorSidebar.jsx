import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  User,
  Mail,
  PlayCircle,
  GraduationCap,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { label: 'My Profile', path: '/tutor/profile', icon: User },
  { label: 'Lead Inbox', path: '/tutor/leads', icon: Mail },
  { label: 'Demo Management', path: '/tutor/demos', icon: PlayCircle },
];

const TutorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside
      style={{
        width: '270px',
        minHeight: 'calc(100vh - 80px)',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: '80px',
        flexShrink: 0,
      }}
    >
      {/* Brand label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 24px 24px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
            color: '#fff',
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GraduationCap size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
            Tutor Panel
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Manage your profile
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px' }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: active ? 600 : 500,
                fontFamily: 'inherit',
                color: active ? '#ffffff' : '#475569',
                background: active
                  ? '#0b5ed7'
                  : 'transparent',
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#0b5ed7';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.label === 'Lead Inbox' && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: active ? 'rgba(255,255,255,0.25)' : '#ef4444',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    lineHeight: '1.4',
                  }}
                >
                  3
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px 0', borderTop: '1px solid #e2e8f0', marginTop: '8px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'inherit',
            color: '#ef4444',
            background: 'transparent',
            width: '100%',
            textAlign: 'left',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#fef2f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default TutorSidebar;
