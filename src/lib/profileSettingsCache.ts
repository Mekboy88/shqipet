import { supabase } from '@/integrations/supabase/client';

export interface ProfileSettingsData {
  user_id?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  birthday?: string;
  country?: string;
  gender?: string;
  role?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  
  // Personal Information
  about_me?: string;
  location?: string;
  city_location?: string;
  school?: string;
  school_completed?: boolean;
  working_at?: string;
  website?: string;
  
  // Relationship Information
  relationship_status?: string;
  relationship_user_id?: string;
  relationship_visibility?: string;
  
  // Bio and Professional Information
  bio?: string;
  bio_visibility?: string;
  profession?: string;
  profession_visibility?: string;
  company?: string;
  company_visibility?: string;
  
  // Arrays for interests and skills
  languages?: string[];
  languages_visibility?: string;
  hobbies?: string[];
  hobbies_visibility?: string;
  
  // Personal touches
  favorite_quote?: string;
  favorite_quote_visibility?: string;
  school_visibility?: string;
  location_visibility?: string;
  
  // Social Media URLs
  facebook_url?: string;
  twitter_url?: string;
  vkontakte_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  profile_url?: string;
  custom_social_links?: Array<{ id: string; name: string; url: string; section: string }>;
  
  // App Settings
  language?: string;
  timezone?: string;
  two_factor_method?: string;
  
  // Note: Notification settings are now in the notification_preferences table
  // Use the useNotificationPreferences hook to manage them
  
  // Profile Customization
  profile_background_url?: string;
  custom_css?: string;
  affiliate_link?: string;
  
  // Gamification
  points?: number;
  wallet_balance?: number;
  earnings?: number;
  
  // General Settings - Account Status and Verification
  account_status?: string;
  otp_email_pending?: boolean;
  otp_phone_pending?: boolean;
  
  // Additional tracking fields
  last_sign_in_at?: string;
  last_activity_at?: string;
  login_count?: number;
  
  // Security and preferences
  two_factor_enabled?: boolean;
  password_last_changed?: string;
  failed_login_attempts?: number;
  account_locked_until?: string;
  
  // Privacy and visibility preferences
  profile_visibility?: string;
  show_online_status?: boolean;
  allow_friend_requests?: boolean;
  allow_messages?: boolean;
  
  // Communication preferences
  email_notifications?: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
  
  // Profile completion tracking
  profile_completion_percentage?: number;
  onboarding_completed?: boolean;
}

// Simple module-level cache shared across all components with persistence
const PROFILE_CACHE_KEY = 'shqipet_profile_cache';

let cachedUserInfo: ProfileSettingsData = {};
let cachedLoading = true;
let cachedDataFetched = false;
let cachedSaving = false;


// Load cached profile data on module initialization
const loadCachedProfile = () => {
  try {
    const cached = localStorage.getItem(PROFILE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cache is not too old (max 1 hour for profile data)
      if (parsed.timestamp && (Date.now() - parsed.timestamp) < 60 * 60 * 1000) {
        cachedUserInfo = parsed.data || {};
        cachedDataFetched = true;
        cachedLoading = false;
        console.log('✅ Profile cache restored from localStorage');
        return true;
      }
    }
  } catch (error) {
    console.warn('⚠️ Failed to load profile cache:', error);
  }
  return false;
};

// Save profile data to localStorage
const saveProfileToCache = (data: ProfileSettingsData) => {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('⚠️ Failed to save profile cache:', error);
  }
};

// Initialize cached data on module load
loadCachedProfile();

const subscribers = new Set<() => void>();

const notify = () => {
  subscribers.forEach((cb) => {
    try { cb(); } catch {}
  });
};

export const profileSettingsCache = {
  get: () => ({
    userInfo: cachedUserInfo,
    loading: cachedLoading,
    dataFetched: cachedDataFetched,
    saving: cachedSaving,
  }),
  set: (partial: Partial<{ userInfo: ProfileSettingsData; loading: boolean; dataFetched: boolean; saving: boolean }>) => {
    if (partial.userInfo !== undefined) {
      cachedUserInfo = partial.userInfo;
      // Save to localStorage for persistence
      saveProfileToCache(partial.userInfo);
    }
    if (partial.loading !== undefined) cachedLoading = partial.loading;
    if (partial.dataFetched !== undefined) cachedDataFetched = partial.dataFetched;
    if (partial.saving !== undefined) cachedSaving = partial.saving;
    notify();
  },
  subscribe: (cb: () => void) => {
    subscribers.add(cb);
    return () => {
      subscribers.delete(cb);
    };
  }
};

export const prefetchProfileSettings = async (userId: string) => {
  if (!userId) return;
  
  // Always fetch gender and other critical fields even if we think we have data
  const currentData = profileSettingsCache.get().userInfo;
  const needsGender = !currentData?.gender || currentData.gender === '';
  const needsUsername = !currentData?.username || (typeof currentData.username === 'string' && currentData.username.trim() === '');
  const needsProfileUrl = !currentData?.profile_url || (typeof currentData.profile_url === 'string' && currentData.profile_url.trim() === '');
  const needsBirthday = !currentData?.birthday;
  const needsCriticalData = needsGender || needsBirthday || needsUsername || needsProfileUrl;
  
  // If already fetched and we have all critical data, skip
  if (cachedDataFetched && !needsCriticalData) return;

  profileSettingsCache.set({ loading: true });

  try {
    const [authResult, profileResult, roleResult] = await Promise.allSettled([
      supabase.auth.getUser(),
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.rpc('get_current_user_role')
    ]);

    const authUser = authResult.status === 'fulfilled' ? authResult.value.data : null;
    const profileData = profileResult.status === 'fulfilled' ? profileResult.value.data : null;
    const roleData = roleResult.status === 'fulfilled' ? roleResult.value.data : null;

    console.log('🔍 Profile data debug:', { 
      profileData, 
      roleData, 
      genderFromDB: profileData?.gender,
      genderFromAuth: authUser?.user?.user_metadata?.gender,
      needsGender,
      needsCriticalData
    });

    const authPhone = authUser?.user?.phone || '';
    const authGender = authUser?.user?.user_metadata?.gender || '';
    const emailVerified = !!authUser?.user?.email_confirmed_at;
    const phoneVerified = !!authUser?.user?.phone_confirmed_at;

    const finalPhoneNumber = profileData?.phone_number || authPhone || '';
    const finalGender = profileData?.gender || authGender || '';

    const possibleBirthdays = [
      profileData?.birthday,  // Check profiles table birthday first
      profileData?.date_of_birth,  // Then check date_of_birth field
      authUser?.user?.user_metadata?.birth_date,
      authUser?.user?.user_metadata?.date_of_birth,
      authUser?.user?.user_metadata?.birthday
    ].filter(Boolean) as string[];

    const finalBirthday = possibleBirthdays[0] || '';

    const pick = (...vals: (string | null | undefined)[]) => {
      for (const v of vals) {
        if (typeof v === 'string') {
          const s = v.trim();
          if (s !== '') return s;
          continue; // skip empty strings
        }
        if (v !== null && v !== undefined) {
          const s = String(v);
          if (s.trim() !== '') return s;
        }
      }
      return '';
    };

    const mergedSettings: ProfileSettingsData = {
      user_id: userId,
      username: pick(profileData?.username, authUser?.user?.user_metadata?.username, ''),
      first_name: pick(profileData?.first_name, authUser?.user?.user_metadata?.first_name, ''),
      last_name: pick(profileData?.last_name, authUser?.user?.user_metadata?.last_name, ''),
      email: pick(profileData?.email, authUser?.user?.email, ''),
      phone_number: pick(profileData?.phone_number, finalPhoneNumber, ''),
      birthday: pick(profileData?.birthday, profileData?.date_of_birth, finalBirthday, ''),
      role: roleData || 'user',
      email_verified: profileData?.email_verified ?? emailVerified,
      phone_verified: profileData?.phone_verified ?? phoneVerified,
      country: pick(profileData?.country, ''),
      gender: (() => { 
        const g = pick(profileData?.gender, authUser?.user?.user_metadata?.gender, ''); 
        const cleanGender = typeof g === 'string' ? g.trim().toLowerCase() : '';
        console.log('🚹 GENDER LOADING DEBUG:', { 
          profileGender: profileData?.gender,
          authGender: authUser?.user?.user_metadata?.gender, 
          finalGender: cleanGender,
          needsGender
        });
        return cleanGender;
      })(),
      about_me: pick(profileData?.about_me, ''),
      location: pick(profileData?.location, ''),
      city_location: pick(profileData?.city_location, ''),
      school: pick(profileData?.school, ''),
      school_completed: profileData?.school_completed || false,
      working_at: pick(profileData?.working_at, ''),
      website: pick(profileData?.website, ''),
      relationship_status: pick(profileData?.relationship_status, 'none'),
      relationship_user_id: pick(profileData?.relationship_user_id, ''),
      relationship_visibility: pick(profileData?.relationship_visibility, 'private'),
      bio: pick(profileData?.bio, ''),
      bio_visibility: pick(profileData?.bio_visibility, 'private'),
      profession: pick(profileData?.profession, ''),
      profession_visibility: pick(profileData?.profession_visibility, 'private'),
      company: pick(profileData?.company, ''),
      company_visibility: pick(profileData?.company_visibility, 'private'),
      languages: profileData?.languages || [],
      languages_visibility: pick(profileData?.languages_visibility, 'private'),
      hobbies: profileData?.hobbies || [],
      hobbies_visibility: pick(profileData?.hobbies_visibility, 'private'),
      favorite_quote: pick(profileData?.favorite_quote, ''),
      favorite_quote_visibility: pick(profileData?.favorite_quote_visibility, 'private'),
      school_visibility: pick(profileData?.school_visibility, 'private'),
      location_visibility: pick(profileData?.location_visibility, 'private'),
      facebook_url: pick(profileData?.facebook_url, ''),
      twitter_url: pick(profileData?.twitter_url, ''),
      vkontakte_url: pick(profileData?.vkontakte_url, ''),
      linkedin_url: pick(profileData?.linkedin_url, ''),
      instagram_url: pick(profileData?.instagram_url, ''),
      youtube_url: pick(profileData?.youtube_url, ''),
      profile_url: pick(profileData?.profile_url, ''),
      custom_social_links: profileData?.custom_social_links || [],
      language: pick(profileData?.language, 'english'),
      timezone: pick(profileData?.timezone, ''),
      two_factor_method: pick(profileData?.two_factor_method, 'email'),
      // Note: Notification settings moved to notification_preferences table
      profile_background_url: pick(profileData?.profile_background_url, ''),
      custom_css: pick(profileData?.custom_css, ''),
      affiliate_link: pick(profileData?.affiliate_link, ''),
      points: profileData?.points || 0,
      wallet_balance: profileData?.wallet_balance || 0,
      earnings: profileData?.earnings || 0,
      // General Settings - Account Status and Verification
      account_status: pick(profileData?.account_status, 'active'),
      otp_email_pending: profileData?.otp_email_pending || false,
      otp_phone_pending: profileData?.otp_phone_pending || false,
      // Additional tracking fields
      last_sign_in_at: pick(profileData?.last_sign_in_at, authUser?.user?.last_sign_in_at, ''),
      last_activity_at: pick(profileData?.last_activity_at, ''),
      login_count: profileData?.login_count || 0,
      // Security and preferences
      two_factor_enabled: profileData?.two_factor_enabled || false,
      password_last_changed: pick(profileData?.password_last_changed, ''),
      failed_login_attempts: profileData?.failed_login_attempts || 0,
      account_locked_until: pick(profileData?.account_locked_until, ''),
      // Privacy and visibility preferences
      profile_visibility: pick(profileData?.profile_visibility, 'public'),
      show_online_status: profileData?.show_online_status !== undefined ? profileData.show_online_status : true,
      allow_friend_requests: profileData?.allow_friend_requests !== undefined ? profileData.allow_friend_requests : true,
      allow_messages: profileData?.allow_messages !== undefined ? profileData.allow_messages : true,
      // Communication preferences
      email_notifications: profileData?.email_notifications !== undefined ? profileData.email_notifications : true,
      sms_notifications: profileData?.sms_notifications !== undefined ? profileData.sms_notifications : false,
      push_notifications: profileData?.push_notifications !== undefined ? profileData.push_notifications : true,
      // Profile completion tracking
      profile_completion_percentage: profileData?.profile_completion_percentage || 0,
      onboarding_completed: profileData?.onboarding_completed || false,
    };

    profileSettingsCache.set({ userInfo: mergedSettings, loading: false, dataFetched: true });

    // Ensure Supabase Auth display name is in sync for dashboard visibility
    try {
      const currentMeta = authUser?.user?.user_metadata || {};
      const wantFull = `${mergedSettings.first_name || ''} ${mergedSettings.last_name || ''}`.trim();
      const hasNames = (mergedSettings.first_name && mergedSettings.first_name.trim() !== '') || (mergedSettings.last_name && mergedSettings.last_name.trim() !== '');
      const needsUpdate = hasNames && (
        currentMeta.first_name !== mergedSettings.first_name ||
        currentMeta.last_name !== mergedSettings.last_name ||
        (currentMeta.full_name || '').trim() !== wantFull
      );
      if (needsUpdate) {
        await supabase.auth.updateUser({
          data: {
            first_name: mergedSettings.first_name || '',
            last_name: mergedSettings.last_name || '',
            full_name: wantFull,
          }
        });
        console.log('✅ Synced Supabase auth display name from profiles/settings');
      }
    } catch (e) {
      console.warn('⚠️ Could not sync auth display name:', e);
    }
  } catch (e) {
    console.error('prefetchProfileSettings error', e);
    profileSettingsCache.set({ loading: false });
  }
};

export const updateProfileSettingsCache = (partial: Partial<ProfileSettingsData>) => {
  const current = profileSettingsCache.get().userInfo || {};
  profileSettingsCache.set({ userInfo: { ...current, ...partial } });
};
