import { supabase } from "@/integrations/supabase/client";

/**
 * Repairs profile avatar_url and cover_url by restoring them from user_photos table.
 * This fixes issues where test uploads or other operations may have overwritten profile images.
 */
export const profileRepairService = {
  /**
   * Restores avatar_url and cover_url for the current user from their latest user_photos entries
   */
  async repairCurrentUserProfile(): Promise<{
    success: boolean;
    repairedAvatar: boolean;
    repairedCover: boolean;
    error?: string;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, repairedAvatar: false, repairedCover: false, error: 'No authenticated user' };
      }

      return await this.repairUserProfile(user.id);
    } catch (error) {
      console.error('Failed to repair profile:', error);
      return { 
        success: false, 
        repairedAvatar: false, 
        repairedCover: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  /**
   * Restores avatar_url and cover_url for a specific user from their latest user_photos entries
   */
  async repairUserProfile(userId: string): Promise<{
    success: boolean;
    repairedAvatar: boolean;
    repairedCover: boolean;
    error?: string;
  }> {
    try {
      let repairedAvatar = false;
      let repairedCover = false;

      // Find latest is_current=true avatar
      const { data: avatarPhoto } = await supabase
        .from('user_photos')
        .select('photo_key')
        .eq('user_id', userId)
        .eq('photo_type', 'profile')
        .eq('is_current', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (avatarPhoto?.photo_key) {
        const { error: avatarError } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarPhoto.photo_key })
          .eq('id', userId);

        if (!avatarError) {
          console.log('✅ Restored avatar_url:', avatarPhoto.photo_key);
          repairedAvatar = true;
        }
      }

      // Find latest is_current=true cover
      const { data: coverPhoto } = await supabase
        .from('user_photos')
        .select('photo_key')
        .eq('user_id', userId)
        .eq('photo_type', 'cover')
        .eq('is_current', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (coverPhoto?.photo_key) {
        const { error: coverError } = await supabase
          .from('profiles')
          .update({ cover_url: coverPhoto.photo_key })
          .eq('id', userId);

        if (!coverError) {
          console.log('✅ Restored cover_url:', coverPhoto.photo_key);
          repairedCover = true;
        }
      }

      return {
        success: repairedAvatar || repairedCover,
        repairedAvatar,
        repairedCover,
      };
    } catch (error) {
      console.error('Failed to repair user profile:', error);
      return { 
        success: false, 
        repairedAvatar: false, 
        repairedCover: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },
};
