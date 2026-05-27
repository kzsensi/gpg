import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
  Video,
  Camera,
  Upload,
  Play,
  Trash2,
  Plus,
  FileVideo,
  Image,
  Info,
  Check,
  X,
  Film,
} from 'lucide-react';

const existingPhotos = [
  { id: 1, label: 'Profile Photo', uploaded: true },
  { id: 2, label: 'Teaching Setup', uploaded: true },
  { id: 3, label: 'With Students', uploaded: true },
];

const MediaUpload = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(existingPhotos);

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout type="tutor">
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a' }}>Media Upload</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Upload photos and videos to make your profile stand out
          </p>
        </div>

        {/* Introduction Video */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ background: '#eff6ff', color: '#0b5ed7', padding: '8px', borderRadius: '10px' }}>
              <Video size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Introduction Video</h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                A short intro video helps parents know you better
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Video preview placeholder */}
            <div
              style={{
                background: '#0f172a',
                borderRadius: '16px',
                aspectRatio: '16/9',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <Play size={28} style={{ color: '#fff', marginLeft: '4px' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>No video uploaded</p>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Upload a 1-3 minute introduction
              </p>

              {/* Duration indicator */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.6)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              >
                0:00
              </div>
            </div>

            {/* Upload zone */}
            <div
              style={{
                border: '2px dashed #93c5fd',
                borderRadius: '16px',
                padding: '32px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#eff6ff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0b5ed7';
                e.currentTarget.style.background = '#dbeafe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#93c5fd';
                e.currentTarget.style.background = '#eff6ff';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <Upload size={24} style={{ color: '#0b5ed7' }} />
              </div>
              <p style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>
                Drag & Drop Video
              </p>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                or click to browse files
              </p>
              <button
                style={{
                  padding: '10px 24px',
                  background: '#0b5ed7',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileVideo size={16} /> Choose Video
              </button>
            </div>
          </div>
        </div>

        {/* Profile Photos */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '28px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: '#faf5ff', color: '#9333ea', padding: '8px', borderRadius: '10px' }}>
                <Camera size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>Profile Photos</h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  Upload up to 6 photos · {photos.length}/6 uploaded
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px',
            }}
          >
            {photos.map((photo) => (
              <div
                key={photo.id}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>{photo.label}</p>
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      background: '#f0fdf4',
                      color: '#16a34a',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #bbf7d0',
                    }}
                  >
                    <Check size={12} />
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    style={{
                      background: '#fef2f2',
                      color: '#ef4444',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #fecaca',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}

            {/* Add photo slot */}
            {photos.length < 6 && (
              <div
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#fafbfc',
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
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <Plus size={22} style={{ color: '#0b5ed7' }} />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0b5ed7' }}>Add Photo</p>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Info size={18} style={{ color: '#0b5ed7' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
              Upload Guidelines
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Film size={16} style={{ color: '#0b5ed7' }} /> Video Requirements
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Duration: 1-3 minutes',
                  'Format: MP4, MOV, or WebM',
                  'Max file size: 100MB',
                  'Minimum resolution: 720p',
                  'Good lighting and clear audio',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Image size={16} style={{ color: '#9333ea' }} /> Photo Requirements
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  'Format: JPG, PNG, or WebP',
                  'Max file size: 5MB each',
                  'Minimum resolution: 400x400px',
                  'Professional and well-lit',
                  'Face clearly visible in at least one',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <Check size={14} style={{ color: '#16a34a', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MediaUpload;
