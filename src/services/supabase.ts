import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Favorite {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  overview: string;
  created_at: string;
}

export interface ContinueWatching {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  progress: number; // percentage watched
  last_watched: string;
  season_number?: number; // for TV shows
  episode_number?: number; // for TV shows
  episode_id?: number; // TMDB episode ID
}

// Auth functions
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

export const signOut = async () => {
  try {
    // First check if there's an active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No active session, just clear local storage and return
      console.log('No active session found, clearing local storage');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in signOut:', error);
    // Even if there's an error, we should clear local storage
    // This handles cases where the session is invalid or expired
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
    } catch (clearError) {
      console.error('Error clearing storage:', clearError);
    }
    throw error;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Favorites functions
export const getFavorites = async (userId: string): Promise<Favorite[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    // If RLS is not enabled, we'll get an error, so return empty array
    if (error.message?.includes('RLS') || error.message?.includes('policy')) {
      console.warn('RLS not enabled, returning empty favorites');
      return [];
    }
    throw error;
  }

  return data || [];
};

export const addToFavorites = async (favorite: Omit<Favorite, 'id' | 'created_at'>): Promise<Favorite> => {
  const { data, error } = await supabase
    .from('favorites')
    .insert([favorite])
    .select()
    .single();

  if (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }

  return data;
};

export const removeFromFavorites = async (userId: string, tmdbId: number, mediaType: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType);

  if (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

export const isFavorite = async (userId: string, tmdbId: number, mediaType: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('tmdb_id', tmdbId)
    .eq('media_type', mediaType)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error checking favorite status:', error);
    throw error;
  }

  return !!data;
};

// Continue watching functions
export const getContinueWatching = async (userId: string): Promise<ContinueWatching[]> => {
  const { data, error } = await supabase
    .from('continue_watching')
    .select('*')
    .eq('user_id', userId)
    .order('last_watched', { ascending: false });

  if (error) {
    console.error('Error fetching continue watching:', error);
    // If RLS is not enabled, we'll get an error, so return empty array
    if (error.message?.includes('RLS') || error.message?.includes('policy')) {
      console.warn('RLS not enabled, returning empty continue watching');
      return [];
    }
    throw error;
  }

  return data || [];
};

export const updateContinueWatching = async (item: Omit<ContinueWatching, 'id'>): Promise<ContinueWatching> => {
  // For TV shows, we need to match by season and episode as well
  const matchConditions = {
    user_id: item.user_id,
    tmdb_id: item.tmdb_id,
    media_type: item.media_type,
  };

  // Add season and episode conditions for TV shows
  if (item.media_type === 'tv' && item.season_number && item.episode_number) {
    Object.assign(matchConditions, {
      season_number: item.season_number,
      episode_number: item.episode_number,
    });
  }

  // First try to update existing record
  const { data: existingData, error: selectError } = await supabase
    .from('continue_watching')
    .select('id')
    .match(matchConditions)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error('Error checking continue watching:', selectError);
    throw selectError;
  }

  if (existingData) {
    // Update existing record
    const updateData: any = {
      progress: item.progress,
      last_watched: item.last_watched,
    };

    // Update season/episode info if provided
    if (item.season_number !== undefined) updateData.season_number = item.season_number;
    if (item.episode_number !== undefined) updateData.episode_number = item.episode_number;
    if (item.episode_id !== undefined) updateData.episode_id = item.episode_id;

    const { data, error } = await supabase
      .from('continue_watching')
      .update(updateData)
      .eq('id', existingData.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating continue watching:', error);
      throw error;
    }

    return data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('continue_watching')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Error inserting continue watching:', error);
      throw error;
    }

    return data;
  }
}; 