
import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';

interface TwoPhotosLayoutProps {
  media: MediaItemProps[];
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const TwoPhotosLayout: React.FC<TwoPhotosLayoutProps> = ({ 
  media, 
  withBorders = false,
  onMediaClick 
}) => {
  return (
    <div className="w-full">
      <div className="w-full aspect-[2/1] flex gap-1 rounded-lg overflow-hidden bg-gray-100">
        <div className="w-1/2 h-full cursor-pointer" onClick={() => onMediaClick?.(0)}>
          <MediaItem 
            url={media[0].url} 
            isVideo={media[0].isVideo} 
            aspectRatio="w-full h-full object-cover"
            overlaySize="medium"
          />
        </div>
        <div className="w-1/2 h-full cursor-pointer" onClick={() => onMediaClick?.(1)}>
          <MediaItem 
            url={media[1].url} 
            isVideo={media[1].isVideo} 
            aspectRatio="w-full h-full object-cover"
            overlaySize="medium"
          />
        </div>
      </div>
    </div>
  );
};

export default TwoPhotosLayout;
