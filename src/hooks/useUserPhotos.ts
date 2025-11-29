import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { userPhotosService, UserPhoto } from '@/services/photos/UserPhotosService';

export const useUserPhotos = (userId?: string) => {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;
  
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all photos
  const loadPhotos = async () => {
    if (!targetUserId) return;

    setLoading(true);
    setError(null);

    try {
      const [allPhotos, gallery] = await Promise.all([
        userPhotosService.getAllPhotosForDisplay(targetUserId),
        userPhotosService.getGalleryPhotos(targetUserId)
      ]);

      setPhotos(allPhotos);
      setGalleryPhotos(gallery);
    } catch (err) {
      setError('Failed to load photos');
      console.error('Error loading user photos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load photos on mount and when user changes
  useEffect(() => {
    loadPhotos();
  }, [targetUserId]);

  // Add a new photo
  const addPhoto = async (
    photoKey: string,
    photoType: 'profile' | 'cover' | 'gallery',
    options: {
      photoUrl?: string;
      originalFilename?: string;
      fileSize?: number;
      contentType?: string;
      isCurrent?: boolean;
    } = {}
  ) => {
    if (!targetUserId) return null;

    const newPhoto = await userPhotosService.addPhoto(
      targetUserId,
      photoKey,
      photoType,
      options
    );

    if (newPhoto) {
      // Refresh the photos list
      await loadPhotos();
    }

    return newPhoto;
  };

  // Delete a photo
  const deletePhoto = async (photoId: string) => {
    const success = await userPhotosService.deletePhoto(photoId);
    if (success) {
      await loadPhotos();
    }
    return success;
  };

  // Get formatted photos for PhotosSection component
  const getPhotosForDisplay = () => {
    return photos.map((photo, index) => ({
      id: index + 1, // Legacy format expected by PhotosSection
      url: photo.photo_key, // Will be resolved by AvatarImage component
      type: photo.photo_type, // Include type for labeling
      photoId: photo.id // Include actual photo ID for deletion
    }));
  };

  // Get gallery photos for display
  const getGalleryPhotosForDisplay = () => {
    return galleryPhotos.map((photo, index) => ({
      id: index + 1,
      url: photo.photo_key
    }));
  };

  return {
    photos,
    galleryPhotos,
    loading,
    error,
    addPhoto,
    deletePhoto,
    loadPhotos,
    getPhotosForDisplay,
    getGalleryPhotosForDisplay,
  };
};