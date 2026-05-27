import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import {
  User,
  BookOpen,
  GraduationCap,
  Briefcase,
  Lightbulb,
  Save,
  Eye,
  Upload,
  Plus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Camera,
} from 'lucide-react';

const steps = [
  { id: 1, label: 'Personal Info', icon: User },
  { id: 2, label: 'Subjects & Boards', icon: BookOpen },
  { id: 3, label: 'Education', icon: GraduationCap },
  { id: 4, label: 'Experience', icon: Briefcase },
  { id: 5, label: 'Methodology', icon: Lightbulb },
];

const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Computer Science', 'Economics', 'Accountancy', 'History', 'Geography', 'Political Science'];
const boardOptions = ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Cambridge'];

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSubjects, setSelectedSubjects] = useState(['Mathematics', 'Physics']);
  const [selectedBoards, setSelectedBoards] = useState(['CBSE']);
  const [education, setEducation] = useState([
    { id: 1, degree: 'B.Sc. Mathematics', university: 'Delhi University', year: '2018' },
  ]);

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const toggleBoard = (board) => {
    setSelectedBoards((prev) =>
      prev.includes(board)
        ? prev.filter((b) => b !== board)
        : [...prev, board]
    );
  };

  const addEducation = () => {
    setEducation((prev) => [
      ...prev,
      { id: Date.now(), degree: '', university: '', year: '' },
    ]);
  };

  const removeEducation = (id) => {
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#0f172a',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '6px',
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Photo upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                  border: '3px dashed #93c5fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <Camera size={28} style={{ color: '#0b5ed7' }} />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    background: '#0b5ed7',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} />
                </div>
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>Profile Photo</p>
                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                  Upload a professional photo. JPG or PNG, max 5MB
                </p>
                <button
                  style={{
                    marginTop: '8px',
                    padding: '8px 16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    background: '#fff',
                    color: '#0b5ed7',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={14} /> Upload Photo
                </button>
              </div>
            </div>

            {/* Name fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input type="text" placeholder="Rahul" defaultValue="Rahul" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input type="text" placeholder="Mehta" defaultValue="Mehta" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>City</label>
                <input type="text" placeholder="Bangalore" defaultValue="Bangalore" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bio</label>
              <textarea
                rows={4}
                placeholder="Tell parents about yourself, your teaching style, and what makes you unique..."
                defaultValue="Passionate Mathematics and Physics tutor with 5+ years of experience. I believe in building strong fundamentals and making learning fun and engaging for students."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              />
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                Tip: A good bio helps parents understand your teaching philosophy
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
              <label style={{ ...labelStyle, fontSize: '15px', marginBottom: '14px' }}>
                Select Subjects You Teach
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {subjectOptions.map((subject) => {
                  const selected = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      onClick={() => toggleSubject(subject)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '999px',
                        border: `1.5px solid ${selected ? '#0b5ed7' : '#e2e8f0'}`,
                        background: selected ? '#eff6ff' : '#fff',
                        color: selected ? '#0b5ed7' : '#475569',
                        fontWeight: selected ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {selected && <Check size={14} />}
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={{ ...labelStyle, fontSize: '15px', marginBottom: '14px' }}>
                Boards / Curricula
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {boardOptions.map((board) => {
                  const selected = selectedBoards.includes(board);
                  return (
                    <button
                      key={board}
                      onClick={() => toggleBoard(board)}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '999px',
                        border: `1.5px solid ${selected ? '#4f46e5' : '#e2e8f0'}`,
                        background: selected ? '#eef2ff' : '#fff',
                        color: selected ? '#4f46e5' : '#475569',
                        fontWeight: selected ? 600 : 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {selected && <Check size={14} />}
                      {board}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Classes You Teach (e.g., 6-12)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '12px', color: '#94a3b8' }}>From</label>
                  <select defaultValue="6" style={inputStyle}>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '12px', color: '#94a3b8' }}>To</label>
                  <select defaultValue="12" style={inputStyle}>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                Education Timeline
              </p>
              <button
                onClick={addEducation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#eff6ff',
                  color: '#0b5ed7',
                  border: '1px solid #bfdbfe',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Plus size={14} /> Add Degree
              </button>
            </div>

            {education.map((edu, index) => (
              <div
                key={edu.id}
                style={{
                  background: '#f8fafc',
                  borderRadius: '14px',
                  padding: '20px',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                }}
              >
                {education.length > 1 && (
                  <button
                    onClick={() => removeEducation(edu.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: '#fee2e2',
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: '#dbeafe', color: '#0b5ed7', padding: '6px', borderRadius: '8px' }}>
                    <GraduationCap size={16} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                    Qualification {index + 1}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Degree / Course</label>
                    <input type="text" defaultValue={edu.degree} placeholder="e.g., B.Sc. Mathematics" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>University / Institution</label>
                    <input type="text" defaultValue={edu.university} placeholder="e.g., Delhi University" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Year of Completion</label>
                    <input type="text" defaultValue={edu.year} placeholder="e.g., 2018" style={inputStyle} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Total Teaching Experience</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <select defaultValue="5" style={inputStyle}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, '10+', '15+', '20+'].map((y) => (
                    <option key={y} value={y}>{y} {typeof y === 'number' ? (y === 1 ? 'year' : 'years') : 'years'}</option>
                  ))}
                </select>
                <select defaultValue="both" style={inputStyle}>
                  <option value="online">Online Only</option>
                  <option value="offline">Offline Only</option>
                  <option value="both">Both Online & Offline</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Current / Previous Organizations</label>
              <input
                type="text"
                defaultValue="Freelance Home Tutor, Vedantu (part-time)"
                placeholder="e.g., ABC Coaching, XYZ School"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Key Achievements</label>
              <textarea
                rows={4}
                defaultValue="• Helped 50+ students score 90%+ in board exams&#10;• 3 students cracked IIT-JEE in 2023&#10;• Rated 4.9/5 by parents on GharPeGyan"
                placeholder="List your key achievements..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Students Taught (approximate)</label>
              <input type="text" defaultValue="200+" placeholder="e.g., 150+" style={inputStyle} />
            </div>
          </div>
        );

      case 5:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={labelStyle}>Teaching Methodology</label>
              <textarea
                rows={5}
                defaultValue="I follow a structured approach combining conceptual clarity with problem-solving practice. Each session includes a quick revision of previous topics, followed by new concepts explained with real-world examples. I assign weekly practice sheets and conduct monthly tests to track progress."
                placeholder="Describe your teaching approach in detail..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
              />
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                Parents love tutors who can clearly explain their methodology
              </p>
            </div>

            <div>
              <label style={labelStyle}>Specialization / USP</label>
              <textarea
                rows={3}
                defaultValue="Specializing in competitive exam preparation (IIT-JEE, NEET). I create personalized study plans based on each student's strengths and weaknesses."
                placeholder="What makes you stand out?"
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Materials Provided</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
                {['Study Notes', 'Practice Sheets', 'Video Recordings', 'Doubt Clearing Sessions', 'Progress Reports', 'Mock Tests'].map((item) => (
                  <label
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      color: '#475569',
                      fontWeight: 500,
                    }}
                  >
                    <input type="checkbox" defaultChecked={['Study Notes', 'Practice Sheets', 'Progress Reports'].includes(item)} />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout type="tutor">
      <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a' }}>Profile Builder</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
            Build a compelling profile that attracts parents and students
          </p>
        </div>

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '32px',
            overflowX: 'auto',
            paddingBottom: '4px',
          }}
        >
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const active = currentStep === step.id;
            const completed = currentStep > step.id;
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setCurrentStep(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: 600,
                    background: active ? '#0b5ed7' : completed ? '#eff6ff' : '#f8fafc',
                    color: active ? '#fff' : completed ? '#0b5ed7' : '#94a3b8',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {completed ? <Check size={16} /> : <Icon size={16} />}
                  {step.label}
                </button>
                {idx < steps.length - 1 && (
                  <div
                    style={{
                      width: '32px',
                      height: '2px',
                      background: completed ? '#0b5ed7' : '#e2e8f0',
                      borderRadius: '999px',
                      flexShrink: 0,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step content card */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #e2e8f0',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            {React.createElement(steps[currentStep - 1].icon, { size: 20, style: { color: '#0b5ed7' } })}
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
              {steps[currentStep - 1].label}
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: 'auto' }}>
              Step {currentStep} of {steps.length}
            </span>
          </div>
          {renderStep()}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: '#fff',
              color: currentStep === 1 ? '#cbd5e1' : '#475569',
              fontWeight: 600,
              fontSize: '14px',
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            {currentStep === steps.length ? (
              <>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#fff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <Eye size={16} /> Preview Profile
                </button>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 28px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0b5ed7, #4f46e5)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 14px rgba(11,94,215,0.3)',
                  }}
                >
                  <Save size={16} /> Save Profile
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 28px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#0b5ed7',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileBuilder;
