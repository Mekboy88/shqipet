
import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';
import { detectOrientation, analyzeMediaOrientations, getLayoutType, MediaWithOrientation } from './utils/orientationUtils';

interface FivePhotosLayoutProps {
  media: MediaItemProps[];
  extraImagesCount?: number;
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const FivePhotosLayout: React.FC<FivePhotosLayoutProps> = ({ 
  media, 
  extraImagesCount,
  withBorders = false,
  onMediaClick 
}) => {
  // Convert media to include orientation analysis
  const mediaWithOrientation: MediaWithOrientation[] = media.map(item => ({
    ...item,
    orientation: detectOrientation(item.width, item.height)
  }));

  const analysis = analyzeMediaOrientations(mediaWithOrientation);
  const layoutType = getLayoutType(analysis);
  
  console.log('🔄 Five Photos Layout Analysis:', { analysis, layoutType });

  const renderThreeVerticalTwoHorizontal = () => {
    const horizontalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'horizontal')
      .map(({ index }) => index)
      .slice(0, 2); // Take first 2 horizontal

    const verticalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'vertical')
      .map(({ index }) => index)
      .slice(0, 3); // Take first 3 vertical

    return (
      <div className="w-full">
        <div className="w-full aspect-[4/3] grid grid-rows-2 gap-1 rounded-lg overflow-hidden bg-gray-100">
          {/* Three vertical photos at top */}
          <div className="grid grid-cols-3 gap-1 h-full">
            {verticalIndices.map((idx, i) => (
              <div key={i} className="h-full cursor-pointer" onClick={() => onMediaClick?.(idx)}>
                <MediaItem 
                  url={media[idx].url} 
                  isVideo={media[idx].isVideo} 
                  aspectRatio="w-full h-full object-cover"
                  overlaySize="small"
                />
              </div>
            ))}
          </div>
          {/* Two horizontal photos at bottom */}
          <div className="grid grid-cols-2 gap-1 h-full">
            {horizontalIndices.map((idx, i) => (
              <div key={i} className="h-full cursor-pointer" onClick={() => onMediaClick?.(idx)}>
                <MediaItem 
                  url={media[idx].url} 
                  isVideo={media[idx].isVideo}
                  aspectRatio="w-full h-full object-cover"
                  overlaySize="medium"
                  extraCount={i === 1 ? extraImagesCount : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOneVerticalFourHorizontal = () => {
    const verticalIndex = mediaWithOrientation.findIndex(m => m.orientation === 'vertical');
    const horizontalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'horizontal')
      .map(({ index }) => index)
      .slice(0, 4); // Take first 4 horizontal

    return (
      <div className="w-full">
        <div className="w-full aspect-[4/3] flex gap-1 rounded-lg overflow-hidden bg-gray-100">
          {/* One vertical photo on left side */}
          <div className="w-1/2 h-full cursor-pointer" onClick={() => onMediaClick?.(verticalIndex)}>
            <MediaItem 
              url={media[verticalIndex].url} 
              isVideo={media[verticalIndex].isVideo} 
              aspectRatio="w-full h-full object-cover"
              overlaySize="large"
            />
          </div>
          {/* Four horizontal photos in 2x2 grid on right side */}
          <div className="w-1/2 h-full grid grid-cols-2 gap-1">
            {horizontalIndices.map((idx, i) => (
              <div key={i} className="h-full cursor-pointer" onClick={() => onMediaClick?.(idx)}>
                <MediaItem 
                  url={media[idx].url} 
                  isVideo={media[idx].isVideo}
                  aspectRatio="w-full h-full object-cover"
                  overlaySize="small"
                  extraCount={i === 3 ? extraImagesCount : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderDefaultGrid = () => {
    // Fallback to standard grid layout
    return (
      <div className="w-full">
        <div className="w-full aspect-[4/3] flex gap-1 rounded-lg overflow-hidden bg-gray-100">
          {/* Left side - first photo taking 1/2 width */}
          <div className="w-1/2 h-full cursor-pointer" onClick={() => onMediaClick?.(0)}>
            <MediaItem 
              url={media[0].url} 
              isVideo={media[0].isVideo}
              aspectRatio="w-full h-full object-cover"
              overlaySize="large"
            />
          </div>
          
          {/* Right side - grid of remaining 4 photos */}
          <div className="w-1/2 h-full grid grid-cols-2 gap-1">
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
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(4)}>
              <MediaItem 
                url={media[4].url} 
                isVideo={media[4].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
                extraCount={extraImagesCount}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  switch (layoutType) {
    case 'three-vertical-two-horizontal':
      return renderThreeVerticalTwoHorizontal();
    case 'one-vertical-four-horizontal':
      return renderOneVerticalFourHorizontal();
    default:
      return renderDefaultGrid();
  }
};

export default FivePhotosLayout;
