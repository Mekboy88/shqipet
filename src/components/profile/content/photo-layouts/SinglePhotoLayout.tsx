
import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';

interface SinglePhotoLayoutProps {
  media: MediaItemProps;
  onMediaClick?: (index: number) => void;
}

const SinglePhotoLayout: React.FC<SinglePhotoLayoutProps> = ({ media, onMediaClick }) => {
  return (
    <div className="w-full cursor-pointer" onClick={() => onMediaClick?.(0)}>
      <div className="w-full h-full rounded-lg overflow-hidden bg-gray-100">
        <MediaItem 
          url={media.url} 
          isVideo={media.isVideo} 
          aspectRatio="w-full h-full object-cover"
          overlaySize="large"
        />
      </div>
    </div>
  );
};

export default SinglePhotoLayout;
