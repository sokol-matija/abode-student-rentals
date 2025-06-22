
import { supabase } from "@/integrations/supabase/client";
import type { Profile, Property } from "@/types/database";

// Profile Services
export const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Property Services
export const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProperties = async (ownerId?: string) => {
  let query = supabase.from('properties').select('*');
  
  if (ownerId) {
    query = query.eq('owner_id', ownerId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getProperty = async (propertyId: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', propertyId)
    .single();

  if (error) throw error;
  return data;
};

export const updateProperty = async (propertyId: string, updates: Partial<Property>) => {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', propertyId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProperty = async (propertyId: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', propertyId);

  if (error) throw error;
};

// Auth Services
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
