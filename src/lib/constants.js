/**
 * Constants — The Single Source of Truth
 * =======================================
 * 
 * WHAT THIS FILE DOES:
 * Stores all dropdown options, status types, and configuration values
 * in ONE place. Every form, filter, and display reads from here.
 * 
 * WHY IT MATTERS FOR MAINTENANCE:
 * If you ever need to add a new subject (e.g., "Artificial Intelligence"),
 * you change it HERE and the entire app updates automatically —
 * the search filters, the profile builder, and the post requirement form
 * will all show the new subject instantly.
 * 
 * RULE: Never hardcode a subject/board/class list in a page component.
 * Always import from this file.
 */

// ── Subjects available on the platform ───────────────
export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Sanskrit',
  'Social Studies', 'History', 'Geography', 'Political Science',
  'Computer Science', 'Economics', 'Accountancy',
  'French', 'German',
  'Music', 'Art & Craft',
];

// ── Education boards ─────────────────────────────────
export const BOARDS = [
  'CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Cambridge', 'Other',
];

// ── Class/Grade levels ───────────────────────────────
export const CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12',
  'Graduate', 'Post Graduate',
  'Competitive Exams',
];

// ── Cities where GharPeGyan operates ─────────────────
export const CITIES = [
  'New Delhi', 'Gurgaon', 'Noida', 'Mumbai', 'Bangalore',
  'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur',
  'Chandigarh', 'Lucknow', 'Ahmedabad', 'Indore', 'Bhopal',
];

// ── Tutoring modes ───────────────────────────────────
export const MODES = ['Home Tuition', 'Online', 'Group Class'];

// ── Requirement statuses ─────────────────────────────
export const REQUIREMENT_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  MATCHED: 'matched',
};

// ── Demo session statuses ────────────────────────────
export const DEMO_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// ── User roles ───────────────────────────────────────
export const ROLES = {
  PARENT: 'parent',
  TUTOR: 'tutor',
  ADMIN: 'admin',
};

// ── Pagination ───────────────────────────────────────
export const PAGE_SIZE = 12; // Number of tutor cards per page on the search page

// ── Validation limits ────────────────────────────────
export const LIMITS = {
  BIO_MAX_LENGTH: 500,
  COMMENT_MAX_LENGTH: 1000,
  PHONE_LENGTH: 10,
  PASSWORD_MIN_LENGTH: 6,
  MAX_SUBJECTS: 10,
  RATE_MIN: 50,
  RATE_MAX: 10000,
  PHOTO_MAX_SIZE_MB: 5,
  VIDEO_MAX_SIZE_MB: 50,
};

// ── Allowed meeting link prefixes ────────────────────
export const ALLOWED_MEETING_LINKS = [
  'https://zoom.us/',
  'https://meet.google.com/',
];

// ── Experience options for filters ───────────────────
export const EXPERIENCE_OPTIONS = [
  { label: 'Any Experience', value: 'Any' },
  { label: '3+ Years', value: '3' },
  { label: '5+ Years', value: '5' },
  { label: '10+ Years', value: '10' },
];

// ── Preferred time options ───────────────────────────
export const TIME_PREFERENCES = [
  { key: 'morning', label: 'Morning' },
  { key: 'evening', label: 'Evening' },
  { key: 'flexible', label: 'Flexible' },
];
