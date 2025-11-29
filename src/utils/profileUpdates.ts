import { supabase } from '@/integrations/supabase/client';

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  profile_image_url?: string;
  cover_image_url?: string;
}

export interface UserPreferencesData {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: {
    push?: boolean;
    email?: boolean;
    in_app?: boolean;
  };
  content_filters?: Record<string, any>;
}

/**
 * Updates user profile with RLS enforced owner rules
 * Uses auth_user_id for matching the authenticated user
 */
export const updateProfile = async (profileData: ProfileUpdateData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // RLS policy: profiles_owner_update ensures auth_user_id = auth.uid()
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('auth_user_id', user.id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
};

/**
 * Updates or inserts user preferences with RLS enforced owner rules
 * Uses user_id for matching the authenticated user
 */
export const updateUserPreferences = async (preferencesData: UserPreferencesData) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // RLS policy: "Users can manage their own preferences" ensures user_id = auth.uid()
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: user.id,
      ...preferencesData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update preferences: ${error.message}`);
  }

  return data;
};

/**
 * Combined update function for both profile and preferences
 */
export const updateProfileAndPreferences = async (
  profileData?: ProfileUpdateData,
  preferencesData?: UserPreferencesData
) => {
  const results = {
    profile: null as any,
    preferences: null as any,
    errors: [] as string[]
  };

  try {
    if (profileData) {
      results.profile = await updateProfile(profileData);
    }
  } catch (error) {
    results.errors.push(`Profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    if (preferencesData) {
      results.preferences = await updateUserPreferences(preferencesData);
    }
  } catch (error) {
    results.errors.push(`Preferences update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return results;
};

// Example usage functions
export const exampleProfileUpdate = async () => {
  try {
    // Update profile - RLS ensures only owner can update
    const profileResult = await updateProfile({
      first_name: 'Andi',
      bio: 'Software developer from Albania',
      location: 'Tirana, Albania'
    });

    // Update preferences - RLS ensures only owner can update  
    const preferencesResult = await updateUserPreferences({
      theme: 'dark',
      language: 'sq',
      notifications: {
        push: true,
        email: false,
        in_app: true
      }
    });

    return { profileResult, preferencesResult };
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};