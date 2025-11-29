import React from 'react';
import { ProfilePhotosGridSkeleton } from '../skeletons/ProfileSkeleton';
import PhotosTab from '../content/tabs/PhotosTab';
import EmptyTabContent from '../EmptyTabContent';

interface PhotosTabWithSkeletonProps {
  photoItems: any[];
  loading?: boolean;
}

const PhotosTabWithSkeleton: React.FC<PhotosTabWithSkeletonProps> = ({ 
  photoItems, 
  loading = false 
}) => {
  if (loading) {
    return <ProfilePhotosGridSkeleton />;
  }

  if (photoItems.length === 0) {
    return (
      <EmptyTabContent 
        title="Photos" 
        description="Photos you upload will appear here" 
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
        } 
      />
    );
  }

  return <PhotosTab photoItems={photoItems} />;
};

export default PhotosTabWithSkeleton;