
import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';

interface FourPhotosLayoutProps {
  media: MediaItemProps[];
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const FourPhotosLayout: React.FC<FourPhotosLayoutProps> = ({ 
  media, 
  withBorders = false,
  onMediaClick 
}) => {
  return (
    <div className="w-full">
      <div className="w-full aspect-square grid grid-cols-2 gap-1 rounded-lg overflow-hidden bg-gray-100">
        <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(0)}>
          <MediaItem 
            url={media[0].url} 
            isVideo={media[0].isVideo}
            aspectRatio="w-full h-full object-cover"
            overlaySize="small"
          />
        </div>
        <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(1)}>
          <MediaItem 
            url={media[1].url} 
            isVideo={media[1].isVideo}
            aspectRatio="w-full h-full object-cover"
            overlaySize="small"
          />
        </div>
        <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(2)}>
          <MediaItem 
            url={media[2].url} 
            isVideo={media[2].isVideo}
            aspectRatio="w-full h-full object-cover"
            overlaySize="small"
          />
        </div>
        <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(3)}>
          <MediaItem 
            url={media[3].url} 
            isVideo={media[3].isVideo}
            aspectRatio="w-full h-full object-cover"
            overlaySize="small"
          />
        </div>
      </div>
    </div>
  );
};

export default FourPhotosLayout;
