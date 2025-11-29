import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';
import { detectOrientation, analyzeMediaOrientations, getLayoutType, MediaWithOrientation } from './utils/orientationUtils';

interface SixPhotosLayoutProps {
  media: MediaItemProps[];
  extraImagesCount?: number;
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const SixPhotosLayout: React.FC<SixPhotosLayoutProps> = ({ 
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
  
  console.log('🔄 Six Photos Layout Analysis:', { analysis, layoutType });

  const renderThreeVerticalThreeHorizontal = () => {
    const horizontalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'horizontal')
      .map(({ index }) => index)
      .slice(0, 3); // Take first 3 horizontal

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
          {/* Three horizontal photos at bottom */}
          <div className="grid grid-cols-3 gap-1 h-full">
            {horizontalIndices.map((idx, i) => (
              <div key={i} className="h-full cursor-pointer" onClick={() => onMediaClick?.(idx)}>
                <MediaItem 
                  url={media[idx].url} 
                  isVideo={media[idx].isVideo}
                  aspectRatio="w-full h-full object-cover"
                  overlaySize="small"
                  extraCount={i === 2 ? extraImagesCount : undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderOneVerticalFiveHorizontal = () => {
    const verticalIndex = mediaWithOrientation.findIndex(m => m.orientation === 'vertical');
    const horizontalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'horizontal')
      .map(({ index }) => index)
      .slice(0, 5); // Take first 5 horizontal

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
          
          {/* Right side - grid for 5 horizontal photos */}
          <div className="w-1/2 h-full grid grid-cols-2 gap-1">
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndices[0])}>
              <MediaItem 
                url={media[horizontalIndices[0]].url} 
                isVideo={media[horizontalIndices[0]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
              />
            </div>
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndices[1])}>
              <MediaItem 
                url={media[horizontalIndices[1]].url} 
                isVideo={media[horizontalIndices[1]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
              />
            </div>
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndices[2])}>
              <MediaItem 
                url={media[horizontalIndices[2]].url} 
                isVideo={media[horizontalIndices[2]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
              />
            </div>
            <div className="h-full cursor-pointer col-span-2" onClick={() => onMediaClick?.(horizontalIndices[3])}>
              <MediaItem 
                url={media[horizontalIndices[3]].url} 
                isVideo={media[horizontalIndices[3]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
                extraCount={horizontalIndices[4] ? extraImagesCount : undefined}
              />
            </div>
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
          
          {/* Right side - grid for remaining 5 photos */}
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
            <div className="h-full cursor-pointer col-span-2" onClick={() => onMediaClick?.(4)}>
              <MediaItem 
                url={media[4].url} 
                isVideo={media[4].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="small"
              />
            </div>
            <div className="h-full cursor-pointer col-span-2" onClick={() => onMediaClick?.(5)}>
              <MediaItem 
                url={media[5].url} 
                isVideo={media[5].isVideo}
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
    case 'three-vertical-three-horizontal':
      return renderThreeVerticalThreeHorizontal();
    case 'one-vertical-five-horizontal':
      return renderOneVerticalFiveHorizontal();
    default:
      return renderDefaultGrid();
  }
};

export default SixPhotosLayout;