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
import { PAGE_SIZE } from './constants';

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
      .select('id, user_id, name, bio, city, subjects, boards, classes, hourly_rate, rating, total_reviews, experience_years, is_verified, mode, phone', { count: 'exact' })
      .eq('is_visible', true);

    if (subject && subject !== 'All Subjects') {
      query = query.contains('subjects', [subject]);
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
  }
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
    
    // Join tutor_profiles so parent can see tutor name, and parent_requirements so tutor can see requirement details
    const queryPromise = supabase
      .from('demo_requests')
      .select(`
        *,
        tutor_profiles(name, city, subjects),
        parent_requirements(student_name, subjects, city, area, class_level, phone, mode)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Query for demos timed out. Please check if Supabase RLS policies are set up correctly.')), 4000)
    );

    const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

    if (error) throw new Error(error.message);
    return { data, error };
  },

  /**
   * Tutor updates demo status (e.g., accepts it and adds Zoom link)
   */
  updateStatus: async (demoId, status, meetingLink = null) => {
    const updateData = { status, updated_at: new Date() };
    if (meetingLink) updateData.meeting_link = meetingLink;

    const { data, error } = await supabase
      .from('demo_requests')
      .update(updateData)
      .eq('id', demoId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
};

// ==========================================
// 4. ADMIN — Full-access CRUD (requires admin RLS policies in Supabase)
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
        tutor_profiles(name, city, subjects),
        parent_requirements(student_name, subjects, city, class_level)
      `)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
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
    const [tutorsRes, requirementsRes, pendingDemosRes] = await Promise.all([
      supabase.from('tutor_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('parent_requirements').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('demo_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);
    return {
      totalTutors: tutorsRes.count || 0,
      activeRequirements: requirementsRes.count || 0,
      pendingDemos: pendingDemosRes.count || 0,
    };
  },
};
