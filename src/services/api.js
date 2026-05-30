/**
 * API Service Layer — The Bridge to Supabase
 * ===========================================
 * 
 * This file contains ALL database queries. 
 * React components should NEVER write `supabase.from(...)` directly.
 * Instead, they import functions from here.
 * 
 * WHY?
 * 1. Maintainability: If we ever change a table name or column, we only update this one file.
 * 2. Reusability: Multiple pages can use `getTutorById` without duplicating code.
 * 3. Security: This enforces correct data structures before sending to the DB.
 */

import { supabase } from '../lib/supabase';
import { PAGE_SIZE, SUBJECTS } from './constants';

// Helper to map search query to database subjects case-insensitively
function getStandardSubject(query) {
  if (!query) return query;
  const trimmed = query.trim().toLowerCase();
  const match = SUBJECTS.find(sub => sub.toLowerCase() === trimmed);
  if (match) return match;
  const partialMatch = SUBJECTS.find(sub => sub.toLowerCase().includes(trimmed));
  if (partialMatch) return partialMatch;
  return query.trim().replace(/\b\w/g, c => c.toUpperCase());
}

// ==========================================
// 1. TUTOR PROFILES
// ==========================================

export const apiTutors = {
  /**
   * Fetch a paginated list of visible tutors (For the Search Page)
   */
  getVisibleTutors: async ({ subject, city, page = 1 } = {}) => {
    let query = supabase
      .from('tutor_profiles')
      .select('id, user_id, name, bio, city, subjects, boards, classes, hourly_rate, rating, total_reviews, experience_years, is_verified, mode, phone, photo_url', { count: 'exact' })
      .eq('is_visible', true);

    if (subject && subject !== 'All Subjects') {
      const normalisedSubject = getStandardSubject(subject);
      query = query.contains('subjects', [normalisedSubject]);
    }
    if (city && city !== 'All Locations') {
      query = query.ilike('city', `%${city}%`);
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    
    query = query.range(from, to).order('rating', { ascending: false });

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);
    
    return { data, count, totalPages: Math.ceil((count || 0) / PAGE_SIZE) };
  },

  /**
   * Get a single tutor's full profile (For the Teacher Profile Page)
   */
  getTutorById: async (userId) => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create or Update a tutor profile (For the Profile Builder)
   */
  upsertProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .upsert(
        { user_id: userId, ...profileData, updated_at: new Date() },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .update({ ...profileData, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },
};

// ==========================================
// 2. PARENT REQUIREMENTS
// ==========================================

export const apiRequirements = {
  /**
   * Create a new requirement (For PostRequirement Page)
   */
  create: async (requirementData) => {
    const { data, error } = await supabase
      .from('parent_requirements')
      .insert([requirementData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get all requirements posted by a specific parent (For Parent Dashboard)
   */
  getByParent: async (parentId) => {
    const { data, error } = await supabase
      .from('parent_requirements')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return { data, error };
  },

  /**
   * Get all active requirements for tutors to browse (For Lead Inbox)
   */
  getActiveLeads: async ({ subject, city } = {}) => {
    let query = supabase
      .from('parent_requirements')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (subject) query = query.contains('subjects', [subject]);
    if (city) query = query.ilike('city', `%${city}%`);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query for active leads timed out. Please check your network or database RLS policies.')), 4000)
    );

    const { data, error } = await Promise.race([query, timeoutPromise]);
    if (error) throw new Error(error.message);
    return { data, error };
  }
};

// ==========================================
// 2b. PARENT PROFILES
// ==========================================

export const apiParents = {
  /**
   * Create or update a parent's profile row in parent_profiles table.
   * Called every time the parent saves their profile.
   */
  upsertProfile: async (userId, profileData) => {
    const { data, error } = await supabase
      .from('parent_profiles')
      .upsert({ user_id: userId, ...profileData, updated_at: new Date() }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Fetch a single parent's profile row (for their own profile page).
   */
  getByUser: async (userId) => {
    const { data, error } = await supabase
      .from('parent_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
};

// ==========================================
// 3. DEMO REQUESTS
// ==========================================

export const apiDemos = {
  /**
   * Parent requests a demo
   */
  create: async (demoData) => {
    const { data, error } = await supabase
      .from('demo_requests')
      .insert([demoData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get demos for a specific user (handles both parents and tutors)
   */
  getByUser: async (userId, role) => {
    const column = role === 'parent' ? 'parent_id' : 'tutor_id';

    // NOTE: parent_profiles is NOT joined via Supabase select because there is no direct FK
    // between demo_requests.parent_id and parent_profiles.user_id in the schema.
    // We enrich with parent profile data via a separate query below.
    const queryPromise = supabase
      .from('demo_requests')
      .select(`
        *,
        tutor_profiles(name, city, subjects, photo_url),
        parent_requirements(student_name, subjects, city, area, class_level, phone, mode)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query for demos timed out. Please check if Supabase RLS policies are set up correctly.')), 4000)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
    if (error) throw new Error(error.message);

    // Enrich each demo with parent_profiles data (separate query, no FK required)
    if (data && data.length > 0) {
      const parentIds = [...new Set(data.map(d => d.parent_id).filter(Boolean))];
      if (parentIds.length > 0) {
        const { data: profiles } = await supabase
          .from('parent_profiles')
          .select('user_id, name, phone, city, photo_url')
          .in('user_id', parentIds);
        if (profiles) {
          const map = Object.fromEntries(profiles.map(p => [p.user_id, p]));
          data.forEach(d => { d.parent_profiles = map[d.parent_id] || null; });
        }
      }
    }

    return { data, error };
  },

  /**
   * Tutor updates demo status (e.g., accepts it)
   */
  updateStatus: async (demoId, status, meetingLink = null, scheduledAt = null) => {
    const updateData = { status, updated_at: new Date() };
    if (scheduledAt) updateData.scheduled_at = scheduledAt;

    const { data, error } = await supabase
      .from('demo_requests')
      .update(updateData)
      .eq('id', demoId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // If meeting link is provided, save it to the secure vault
    if (meetingLink) {
      await apiDemos.updateMeetingDetails(demoId, meetingLink);
    }
    return data;
  },

  /**
   * Update meeting link in the secure vault
   */
  updateMeetingDetails: async (demoId, meetingLink) => {
    const { data, error } = await supabase
      .from('demo_meetings')
      .upsert({ demo_id: demoId, meeting_link: meetingLink })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Toggle is_live status (Allow Join)
   */
  setDemoLive: async (demoId, isLive) => {
    const { data, error } = await supabase
      .from('demo_requests')
      .update({ is_live: isLive, updated_at: new Date() })
      .eq('id', demoId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Parent fetches link securely. Only works if is_live is true due to RLS.
   */
  getSecureLink: async (demoId) => {
    const { data, error } = await supabase
      .from('demo_meetings')
      .select('meeting_link')
      .eq('demo_id', demoId)
      .single();

    if (error) throw new Error('Meeting link is not available yet. Tutor must start the class first.');
    return data.meeting_link;
  },

  /**
   * Fetch all meeting links for a list of demo IDs (Used by Tutor dashboard)
   */
  getTutorLinks: async (demoIds) => {
    if (!demoIds || demoIds.length === 0) return {};
    const { data, error } = await supabase
      .from('demo_meetings')
      .select('demo_id, meeting_link')
      .in('demo_id', demoIds);

    if (error) return {}; // Ignore errors on fetch
    const links = {};
    data.forEach(d => { links[d.demo_id] = d.meeting_link; });
    return links;
  }
};

// ==========================================
// 4. REVIEWS
// ==========================================

export const apiReviews = {
  create: async (reviewData) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ 
        tutor_id: reviewData.tutor_id,
        parent_id: reviewData.parent_id,
        rating: reviewData.rating,
        comment: reviewData.review_text,
        parent_name: reviewData.parent_name
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  getByTutor: async (tutorId) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};

// ==========================================
// 5. MESSAGES (Real-Time Chat)
// ==========================================

export const apiMessages = {
  /**
   * Get all messages between current user and a specific contact
   */
  getConversation: async (userId, contactId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Send a new message
   */
  send: async (senderId, receiverId, content, senderName, senderRole, receiverName, receiverRole) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ 
        sender_id: senderId, 
        receiver_id: receiverId, 
        content,
        sender_name: senderName,
        sender_role: senderRole,
        receiver_name: receiverName,
        receiver_role: receiverRole
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get all unique contacts the user has chatted with
   */
  getContacts: async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    
    // Extract unique contacts and their latest message
    const contactsMap = new Map();
    
    (data || []).forEach(msg => {
      const isSender = msg.sender_id === userId;
      const contactId = isSender ? msg.receiver_id : msg.sender_id;
      const contactName = isSender ? msg.receiver_name : msg.sender_name;
      const contactRole = isSender ? msg.receiver_role : msg.sender_role;
      
      if (!contactId) return;
      
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, {
          id: contactId,
          name: contactName || 'User',
          role: contactRole || 'user',
          lastMessage: msg.content,
          time: msg.created_at
        });
      }
    });

    return Array.from(contactsMap.values());
  }
};

// ==========================================
// 6. ADMIN — Full-access CRUD (requires admin RLS policies in Supabase)
// ==========================================

export const apiAdmin = {
  /**
   * Get ALL tutor profiles (including hidden ones) — Admin only
   */
  getAllTutors: async () => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('id, user_id, name, bio, city, subjects, hourly_rate, rating, total_reviews, experience_years, is_verified, is_visible, mode, phone, created_at')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Toggle tutor verification status — Admin only
   */
  setTutorVerified: async (userId, isVerified) => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .update({ is_verified: isVerified, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Toggle tutor visibility — Admin only
   */
  setTutorVisible: async (userId, isVisible) => {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .update({ is_visible: isVisible, updated_at: new Date() })
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a tutor profile — Admin only
   */
  deleteTutor: async (userId) => {
    const { error } = await supabase
      .from('tutor_profiles')
      .delete()
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
  },

  /**
   * Get ALL parent requirements — Admin only
   */
  getAllRequirements: async () => {
    const { data, error } = await supabase
      .from('parent_requirements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    // Enrich with parent_profiles via separate query (no FK between tables)
    if (data && data.length > 0) {
      const parentIds = [...new Set(data.map(r => r.parent_id).filter(Boolean))];
      if (parentIds.length > 0) {
        const { data: profiles } = await supabase
          .from('parent_profiles')
          .select('user_id, name, phone, photo_url')
          .in('user_id', parentIds);
        if (profiles) {
          const map = Object.fromEntries(profiles.map(p => [p.user_id, p]));
          data.forEach(r => { r.parent_profiles = map[r.parent_id] || null; });
        }
      }
    }
    return data;
  },

  /**
   * Get ALL registered parents (from parent_profiles table) — Admin only
   */
  getAllParents: async () => {
    const { data, error } = await supabase
      .from('parent_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update requirement status — Admin only
   */
  updateRequirementStatus: async (id, status) => {
    const { data, error } = await supabase
      .from('parent_requirements')
      .update({ status, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a requirement — Admin only
   */
  deleteRequirement: async (id) => {
    const { error } = await supabase
      .from('parent_requirements')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Get ALL demo requests with tutor and requirement info — Admin only
   */
  getAllDemos: async () => {
    const { data, error } = await supabase
      .from('demo_requests')
      .select(`
        *,
        tutor_profiles(name, city, subjects, photo_url),
        parent_requirements(student_name, subjects, city, class_level)
      `)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    // Enrich with parent_profiles via separate query (no FK between tables)
    if (data && data.length > 0) {
      const parentIds = [...new Set(data.map(d => d.parent_id).filter(Boolean))];
      if (parentIds.length > 0) {
        const { data: profiles } = await supabase
          .from('parent_profiles')
          .select('user_id, name, phone, city')
          .in('user_id', parentIds);
        if (profiles) {
          const map = Object.fromEntries(profiles.map(p => [p.user_id, p]));
          data.forEach(d => { d.parent_profiles = map[d.parent_id] || null; });
        }
      }
    }
    return data;
  },

  /**
   * Update demo status and/or meeting link — Admin only
   */
  updateDemo: async (id, updates) => {
    const { data, error } = await supabase
      .from('demo_requests')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a demo — Admin only
   */
  deleteDemo: async (id) => {
    const { error } = await supabase
      .from('demo_requests')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  },

  /**
   * Get platform-wide stats: total tutors, parents, active requirements, pending demos
   */
  getStats: async () => {
    const [tutorsRes, parentsRes, requirementsRes, pendingDemosRes] = await Promise.all([
      supabase.from('tutor_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('parent_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('parent_requirements').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    return {
      totalTutors: tutorsRes.count || 0,
      totalParents: parentsRes.count || 0,
      activeRequirements: requirementsRes.count || 0,
      pendingDemos: pendingDemosRes.count || 0,
    };
  },
};
