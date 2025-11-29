import { supabase } from '@/integrations/supabase/client';
export const notifyGlobalAvatarChange = (url: string | null) => {
  // Legacy compatibility - no longer needed with new system
  console.log('Legacy avatar notification (ignored):', url);
};
import { prefetchProfileSettings, updateProfileSettingsCache } from '@/lib/profileSettingsCache';

interface UserDataState {
  userId: string | null;
  avatarUrl: string | null;
  displayName: string;
  firstName: string;
  lastName: string;
  initials: string;
  profileData: any;
}

class UserDataSynchronizer {
  private static instance: UserDataSynchronizer;
  private currentUserId: string | null = null;
  private syncInProgress = false;

  static getInstance(): UserDataSynchronizer {
    if (!UserDataSynchronizer.instance) {
      UserDataSynchronizer.instance = new UserDataSynchronizer();
    }
    return UserDataSynchronizer.instance;
  }

  async syncUserData(userId: string): Promise<void> {
    if (this.syncInProgress || this.currentUserId === userId) {
      return;
    }

    this.syncInProgress = true;
    this.currentUserId = userId;

    try {
      console.log('🔄 UserDataSynchronizer: Starting comprehensive user data sync...');

      // Fetch all user data in parallel for maximum speed
        const [authResult, profileResult] = await Promise.allSettled([
          supabase.auth.getUser(),
          supabase.from('profiles').select('*').or(`auth_user_id.eq.${userId},id.eq.${userId}`).maybeSingle()
        ]);

      const authUser = authResult.status === 'fulfilled' ? authResult.value.data : null;
      const profileData = profileResult.status === 'fulfilled' ? profileResult.value.data : null;
      const settingsData = null; // No separate settings table - use profiles data

      // Combine all data sources for complete user state
      const firstName = profileData?.first_name || authUser?.user?.user_metadata?.first_name || '';
      const lastName = profileData?.last_name || authUser?.user?.user_metadata?.last_name || '';
      const avatarUrl = profileData?.profile_image_url || authUser?.user?.user_metadata?.avatar_url || null;
      
      const fullName = `${firstName} ${lastName}`.trim();
      const displayName = fullName || settingsData?.username || '';
      
      // Generate initials
      const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
      const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
      const initials = `${firstInitial}${lastInitial}` || displayName.charAt(0).toUpperCase() || 'P';

      // Synchronize avatar state
      const avatarState = {
        avatarUrl,
        displayName,
        initials,
        firstName,
        lastName,
        loading: false
      };

      // Notify only if we have a non-null avatar; otherwise preserve existing
      if (avatarUrl) {
        notifyGlobalAvatarChange(avatarUrl);
      } else {
        console.log('ℹ️ UserDataSynchronizer: No avatar from DB/auth; preserving current avatar state');
      }

      // Ensure profile settings are in cache
      if (settingsData || profileData) {
        updateProfileSettingsCache({
          user_id: userId,
          username: settingsData?.username || '',
          first_name: firstName,
          last_name: lastName,
          email: settingsData?.email || profileData?.email || authUser?.user?.email || '',
          city_location: (settingsData as any)?.city_location || (profileData as any)?.city_location || '',
          school: settingsData?.school || '',
          working_at: settingsData?.working_at || '',
          about_me: settingsData?.about_me || '',
          bio: settingsData?.bio || '',
          location: settingsData?.location || '',
        });
      }

      console.log('✅ UserDataSynchronizer: User data synchronized successfully', {
        displayName,
        avatarUrl: !!avatarUrl,
        hasProfile: !!profileData,
        hasSettings: !!settingsData
      });

    } catch (error) {
      console.error('❌ UserDataSynchronizer: Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  clearUserData(): void {
    console.log('🧹 UserDataSynchronizer: Clearing user data...');
    this.currentUserId = null;
    
    // Clear avatar state
    notifyGlobalAvatarChange(null);
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

export const userDataSynchronizer = UserDataSynchronizer.getInstance();