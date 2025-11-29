import { useState, useEffect, useCallback } from 'react';
import { ultraStableUserFetching } from '@/services/userFetchingService';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  user_id: string;
  auth_user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  cover_photo_url?: string;
  role?: string;
  account_status?: string;
  phone_number?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
}

interface UseUltraStableUserReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  avatar: string | null;
  displayName: string;
  initials: string;
  refreshProfile: () => Promise<void>;
  isOnline: boolean;
}

export const useUltraStableUser = (userId: string | null): UseUltraStableUserReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Main profile fetching
  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!userId) {
      setProfile(null);
      setAvatar(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 useUltraStableUser: Fetching profile for ${userId}`);

      // Fetch profile with ultra-stable service
      const fetchedProfile = await ultraStableUserFetching.getUserProfile(userId, forceRefresh);
      
      if (fetchedProfile) {
        setProfile(fetchedProfile);
        setError(null);

        // Fetch avatar separately for better performance
        try {
          const avatarUrl = await ultraStableUserFetching.getUserAvatar(userId);
          setAvatar(avatarUrl);
        } catch (avatarError) {
          console.warn(`⚠️ Avatar fetch failed for ${userId}:`, avatarError);
          setAvatar(null);
        }
      } else {
        setProfile(null);
        setAvatar(null);
        setError('Profile not found');
      }
    } catch (err: any) {
      console.error(`❌ Profile fetch failed for ${userId}:`, err);
      setError(err.message || 'Failed to fetch profile');
      
      // Show user-friendly error
      if (!isOnline) {
        toast.error('You are offline', {
          description: 'Profile will be loaded when connection is restored',
        });
      } else {
        toast.error('Failed to load profile', {
          description: 'Please try again or check your connection',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [userId, isOnline]);

  // Initial fetch and userId change handling
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Real-time updates
  useEffect(() => {
    if (!userId) return;

    let unsubscribe: (() => void) | null = null;

    const setupRealtime = async () => {
      unsubscribe = ultraStableUserFetching.setupRealtimeUpdates((updatedProfile) => {
        const profileUserId = updatedProfile.auth_user_id || updatedProfile.user_id || updatedProfile.id;
        
        if (profileUserId === userId) {
          console.log(`🔄 Real-time profile update for ${userId}`);
          setProfile(updatedProfile);
          
          // Update avatar if needed
          if (updatedProfile.profile_image_url !== avatar) {
            setAvatar(updatedProfile.profile_image_url || null);
          }
        }
      });
    };

    setupRealtime();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId, avatar]);

  // Refresh function
  const refreshProfile = useCallback(async () => {
    await fetchProfile(true);
  }, [fetchProfile]);

  // Generate display name and initials
  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User'
    : 'User';

  const initials = profile
    ? `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'U'
    : 'L';

  return {
    profile,
    loading,
    error,
    avatar,
    displayName,
    initials,
    refreshProfile,
    isOnline
  };
};