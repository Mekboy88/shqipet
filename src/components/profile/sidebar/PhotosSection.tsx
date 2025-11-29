import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { AvatarImage } from '@/components/ui/avatar';

interface Photo {
  id: number;
  url: string;
  type?: 'profile' | 'cover' | 'gallery';
  photoId?: string;
}

interface PhotosSectionProps {
  photos?: Photo[]; // Made optional since we'll load from database
}

const PhotosSection: React.FC<PhotosSectionProps> = ({
  photos: propPhotos = []
}) => {
  const navigate = useNavigate();
  const { getPhotosForDisplay, loading } = useUserPhotos();
  const [displayedPhotos, setDisplayedPhotos] = useState<Photo[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);
  const maxPhotosToDisplay = 9; // 3x3 grid

  // Use photos from database if available, otherwise use prop photos
  const photos = getPhotosForDisplay().length > 0 ? getPhotosForDisplay() : propPhotos;

  // Function to get the next batch of photos
  const getNextPhotoBatch = useCallback(() => {
    if (photos.length <= maxPhotosToDisplay) {
      return photos;
    } else {
      const startIndex = photoIndex % photos.length;
      const batch = [];
      for (let i = 0; i < maxPhotosToDisplay; i++) {
        const index = (startIndex + i) % photos.length;
        batch.push(photos[index]);
      }
      return batch;
    }
  }, [photos, photoIndex, maxPhotosToDisplay]);

  // Initialize displayed photos only when photos change
  useEffect(() => {
    if (photos.length > 0) {
      setDisplayedPhotos(getNextPhotoBatch());
    }
  }, [photos, getNextPhotoBatch]);

  // Set up rotation timer - only when we have enough photos
  useEffect(() => {
    if (photos.length <= maxPhotosToDisplay) return;
    const intervalTime = 86400000; // 24 hours in milliseconds

    const intervalId = setInterval(() => {
      setPhotoIndex(prevIndex => {
        const newIndex = (prevIndex + maxPhotosToDisplay) % photos.length;
        return newIndex;
      });
    }, intervalTime);
    return () => clearInterval(intervalId);
  }, [photos.length, maxPhotosToDisplay]);

  if (loading) {
    return (
      <Card className="p-4 shadow-sm bg-card rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Fotot</h2>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: maxPhotosToDisplay }).map((_, i) => (
            <div key={`loading-${i}`} className="aspect-square rounded-md bg-muted animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 shadow-sm bg-card rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Fotot</h2>
          {photos.length > 0 && (
            <button 
              type="button"
              onClick={() => navigate('/photos/gallery')}
              className="text-blue-500 text-sm font-medium hover:underline cursor-pointer"
            >
              See All Photos
            </button>
          )}
      </div>
      
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1">
          {displayedPhotos.map(photo => (
            <div key={photo.id} className="aspect-square rounded-md overflow-hidden relative group">
              <AvatarImage 
                src={photo.url} 
                alt={`Photo ${photo.id}`} 
                className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer" 
              />
              {/* Albanian label for avatar and cover photos only */}
              {photo.type && (photo.type === 'profile' || photo.type === 'cover') && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center">
                  {photo.type === 'profile' ? 'foto avatari' : 'foto kopertine'}
                </div>
              )}
            </div>
          ))}
          
          {/* Add empty placeholders if we have less than 9 photos */}
          {Array.from({
            length: Math.max(0, maxPhotosToDisplay - displayedPhotos.length)
          }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square rounded-md bg-gray-100"></div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No photos yet</p>
          <p className="text-sm">Upload a profile or cover photo to get started</p>
        </div>
      )}
    </Card>
  );
};

export default PhotosSection;