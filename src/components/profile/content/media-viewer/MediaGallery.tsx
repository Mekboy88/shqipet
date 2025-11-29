import React from 'react';
import { MediaItemProps } from '../photo-layouts/types';
import MediaItem from '../photo-layouts/MediaItem';

interface MediaGalleryProps {
  media: MediaItemProps[];
  onMediaClick: (index: number) => void;
  className?: string;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  media,
  onMediaClick,
  className = ""
}) => {
  // Determine grid layout based on number of media items
  const getGridCols = () => {
    if (media.length === 1) return 'grid-cols-1';
    if (media.length === 2) return 'grid-cols-2';
    if (media.length <= 4) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  const getItemAspectRatio = () => {
    if (media.length === 1) return 'aspect-[4/3]';
    return 'aspect-square';
  };

  return (
    <div className={`grid ${getGridCols()} gap-1 ${className}`}>
      {media.map((item, index) => (
        <div
          key={index}
          className={`${getItemAspectRatio()} cursor-pointer hover:opacity-80 transition-opacity`}
          onClick={() => onMediaClick(index)}
        >
          <MediaItem
            url={item.url}
            isVideo={item.isVideo}
            overlaySize="medium"
          />
        </div>
      ))}
    </div>
  );
};

export default MediaGallery;