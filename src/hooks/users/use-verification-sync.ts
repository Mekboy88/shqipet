
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVerificationSync = () => {
  const syncUserVerification = useCallback(async (userId: string) => {
    try {
      console.log(`🔄 Syncing verification status for user: ${userId}`);
      
      // Get user verification status from auth.users using auth_user_id
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      if (authError) {
        console.warn('Could not fetch auth user data:', authError);
        return;
      }

      // Update profile with auth verification status using auth_user_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email_verified: !!authUser.user.email_confirmed_at,
          phone_verified: !!authUser.user.phone_confirmed_at,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', userId); // Now using auth_user_id for proper linking

      if (updateError) {
        console.error('Error syncing verification status:', updateError);
      } else {
        console.log(`✅ Verification sync completed for user: ${userId}`);
      }
    } catch (error) {
      console.error('Error in syncUserVerification:', error);
    }
  }, []);

  const syncAllUsersVerification = useCallback(async () => {
    try {
      console.log('🔄 Starting bulk verification sync using database function...');
      
      // Use the database function for efficient bulk sync
      const { error } = await supabase.rpc('sync_user_verification_status');
      
      if (error) {
        console.error('Error in bulk sync:', error);
        // Fallback to manual sync if database function fails
        console.log('Fallback: Manual sync for all users...');
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('auth_user_id');
        
        if (profilesError) {
          console.error('Error fetching profiles for manual sync:', profilesError);
          return;
        }

        // Sync each user individually as fallback
        for (const profile of profiles || []) {
          await syncUserVerification(profile.auth_user_id);
        }
      } else {
        console.log('✅ Bulk verification sync completed successfully');
      }
    } catch (error) {
      console.error('Error in syncAllUsersVerification:', error);
    }
  }, [syncUserVerification]);

  return {
    syncUserVerification,
    syncAllUsersVerification
  };
};
