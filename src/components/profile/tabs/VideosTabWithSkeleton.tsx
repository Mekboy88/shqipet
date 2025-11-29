import React from 'react';
import { ProfileVideosGridSkeleton } from '../skeletons/ProfileSkeleton';
import VideosTab from '../content/tabs/VideosTab';

interface VideosTabWithSkeletonProps {
  videoItems: any[];
  loading?: boolean;
}

const VideosTabWithSkeleton: React.FC<VideosTabWithSkeletonProps> = ({ 
  videoItems, 
  loading = false 
}) => {
  if (loading || videoItems.length === 0) {
    return <ProfileVideosGridSkeleton />;
  }

  return <VideosTab />;
};

export default VideosTabWithSkeleton;