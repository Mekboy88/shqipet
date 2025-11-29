
import React from 'react';
import UniversalPhotoGrid from '@/components/shared/UniversalPhotoGrid';
import { PhotoGridProps } from './photo-layouts/types';

interface ExtendedPhotoGridProps extends PhotoGridProps {
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const PhotoGrid: React.FC<ExtendedPhotoGridProps> = ({ 
  images, 
  extraImagesCount, 
  videos = [],
  withBorders = false,
  onMediaClick
}) => {
  console.log('📷 PHOTOGRID: Using UniversalPhotoGrid with', images.length, 'images and', videos.length, 'videos');
  
  return (
    <div className={`w-full h-full ${withBorders ? 'photo-grid-with-borders' : ''}`}>
      <UniversalPhotoGrid 
        media={images}
        videos={videos}
        onMediaClick={onMediaClick}
        className="w-full h-full"
      />
    </div>
  );
};

export default PhotoGrid;
