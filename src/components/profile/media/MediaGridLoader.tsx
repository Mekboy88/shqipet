import React from 'react';
import { ProfilePhotosGridSkeleton, ProfileVideosGridSkeleton } from '../skeletons/ProfileSkeleton';

interface MediaGridLoaderProps {
  mediaType: 'photos' | 'videos';
  isLoading: boolean;
  hasMedia: boolean;
  children: React.ReactNode;
}

const MediaGridLoader: React.FC<MediaGridLoaderProps> = ({ 
  mediaType, 
  isLoading, 
  hasMedia, 
  children 
}) => {
  if (isLoading || !hasMedia) {
    return mediaType === 'photos' ? (
      <ProfilePhotosGridSkeleton />
    ) : (
      <ProfileVideosGridSkeleton />
    );
  }

  return <>{children}</>;
};

export default MediaGridLoader;