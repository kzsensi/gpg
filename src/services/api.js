import { supabase } from '../lib/supabase';

// === AUTHENTICATION ===

export const signUp = async (email, password, metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// === TUTORS ===

export const getTutors = async (filters = {}) => {
  let query = supabase.from('tutors').select('*');
  
  if (filters.subject) {
    query = query.contains('subjects', [filters.subject]);
  }
  if (filters.verifiedOnly) {
    query = query.eq('verified', true);
  }
  if (filters.minRating) {
    query = query.gte('rating', filters.minRating);
  }
  
  const { data, error } = await query;
  return { data, error };
};

// === REQUIREMENTS ===

export const createRequirement = async (requirementData) => {
  const { data, error } = await supabase
    .from('requirements')
    .insert([requirementData])
    .select();
  return { data, error };
};

export const getParentRequirements = async (parentId) => {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });
  return { data, error };
};
