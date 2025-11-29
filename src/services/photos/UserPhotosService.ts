import { supabase } from '@/integrations/supabase/client';

export interface UserPhoto {
  id: string;
  user_id: string;
  photo_key: string;
  photo_url?: string;
  photo_type: 'profile' | 'cover' | 'gallery';
  original_filename?: string;
  file_size?: number;
  content_type?: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

class UserPhotosService {
  /**
   * Add a photo to the user's collection
   */
  async addPhoto(
    userId: string,
    photoKey: string,
    photoType: 'profile' | 'cover' | 'gallery',
    options: {
      photoUrl?: string;
      originalFilename?: string;
      fileSize?: number;
      contentType?: string;
      isCurrent?: boolean;
    } = {}
  ): Promise<UserPhoto | null> {
    try {
      // If this is a profile or cover photo being set as current,
      // first mark all existing photos of this type as not current
      if (options.isCurrent && (photoType === 'profile' || photoType === 'cover')) {
        await supabase
          .from('user_photos')
          .update({ is_current: false })
          .eq('user_id', userId)
          .eq('photo_type', photoType);
      }

      const { data, error } = await supabase
        .from('user_photos')
        .insert({
          user_id: userId,
          photo_key: photoKey,
          photo_url: options.photoUrl,
          photo_type: photoType,
          original_filename: options.originalFilename,
          file_size: options.fileSize,
          content_type: options.contentType || 'image/jpeg',
          is_current: options.isCurrent || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding user photo:', error);
        return null;
      }

      console.log(`✅ Added ${photoType} photo to collection:`, data);
      return data as UserPhoto;
    } catch (error) {
      console.error('Failed to add user photo:', error);
      return null;
    }
  }

  /**
   * Get all photos for a user
   */
  async getUserPhotos(
    userId: string,
    photoType?: 'profile' | 'cover' | 'gallery'
  ): Promise<UserPhoto[]> {
    try {
      let query = supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (photoType) {
        query = query.eq('photo_type', photoType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching user photos:', error);
        return [];
      }

      return (data as UserPhoto[]) || [];
    } catch (error) {
      console.error('Failed to fetch user photos:', error);
      return [];
    }
  }

  /**
   * Get gallery photos only (excluding profile and cover photos)
   */
  async getGalleryPhotos(userId: string): Promise<UserPhoto[]> {
    return this.getUserPhotos(userId, 'gallery');
  }

  /**
   * Get all photos for photos section (all types)
   */
  async getAllPhotosForDisplay(userId: string): Promise<UserPhoto[]> {
    return this.getUserPhotos(userId);
  }

  /**
   * Get current profile photo
   */
  async getCurrentProfilePhoto(userId: string): Promise<UserPhoto | null> {
    try {
      const { data, error } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', userId)
        .eq('photo_type', 'profile')
        .eq('is_current', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching current profile photo:', error);
        return null;
      }

      return data as UserPhoto | null;
    } catch (error) {
      console.error('Failed to fetch current profile photo:', error);
      return null;
    }
  }

  /**
   * Get current cover photo
   */
  async getCurrentCoverPhoto(userId: string): Promise<UserPhoto | null> {
    try {
      const { data, error } = await supabase
        .from('user_photos')
        .select('*')
        .eq('user_id', userId)
        .eq('photo_type', 'cover')
        .eq('is_current', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching current cover photo:', error);
        return null;
      }

      return data as UserPhoto | null;
    } catch (error) {
      console.error('Failed to fetch current cover photo:', error);
      return null;
    }
  }

  /**
   * Delete a photo from the collection and Wasabi storage
   */
  async deletePhoto(photoId: string): Promise<boolean> {
    try {
      // First, get the photo to retrieve the photo_key for Wasabi deletion
      const { data: photo, error: fetchError } = await supabase
        .from('user_photos')
        .select('photo_key')
        .eq('id', photoId)
        .single();

      if (fetchError || !photo) {
        console.error('Error fetching photo for deletion:', fetchError);
        return false;
      }

      // Delete from Wasabi storage
      try {
        const { error: wasabiError } = await supabase.functions.invoke('wasabi-delete', {
          body: { key: photo.photo_key }
        });

        if (wasabiError) {
          console.warn('Warning: Failed to delete from Wasabi:', wasabiError);
          // Continue with database deletion even if Wasabi deletion fails
        }
      } catch (wasabiErr) {
        console.warn('Warning: Wasabi deletion error:', wasabiErr);
        // Continue with database deletion
      }

      // Delete from database
      const { error } = await supabase
        .from('user_photos')
        .delete()
        .eq('id', photoId);

      if (error) {
        console.error('Error deleting user photo from database:', error);
        return false;
      }

      console.log('✅ Deleted photo from collection and storage:', photoId);
      return true;
    } catch (error) {
      console.error('Failed to delete user photo:', error);
      return false;
    }
  }

  /**
   * Update photo metadata
   */
  async updatePhoto(
    photoId: string,
    updates: Partial<Pick<UserPhoto, 'photo_url' | 'original_filename' | 'is_current'>>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_photos')
        .update(updates)
        .eq('id', photoId);

      if (error) {
        console.error('Error updating user photo:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to update user photo:', error);
      return false;
    }
  }
}

export const userPhotosService = new UserPhotosService();