
import React from 'react';
import MediaItem from './MediaItem';
import { MediaItemProps } from './types';
import { detectOrientation, analyzeMediaOrientations, getLayoutType, MediaWithOrientation } from './utils/orientationUtils';

interface ThreePhotosLayoutProps {
  media: MediaItemProps[];
  withBorders?: boolean;
  onMediaClick?: (index: number) => void;
}

const ThreePhotosLayout: React.FC<ThreePhotosLayoutProps> = ({ 
  media, 
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
  
  console.log('🔄 Three Photos Layout Analysis:', { analysis, layoutType });

  const renderTwoVerticalOneHorizontal = () => {
    // Find the horizontal photo
    const horizontalIndex = mediaWithOrientation.findIndex(m => m.orientation === 'horizontal');
    const verticalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'vertical')
      .map(({ index }) => index);

    return (
      <div className="w-full">
        <div className="w-full aspect-[4/3] grid grid-rows-2 gap-1 rounded-lg overflow-hidden bg-gray-100">
          {/* Two vertical photos side by side at top */}
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(verticalIndices[0])}>
              <MediaItem 
                url={media[verticalIndices[0]].url} 
                isVideo={media[verticalIndices[0]].isVideo} 
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
              />
            </div>
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(verticalIndices[1])}>
              <MediaItem 
                url={media[verticalIndices[1]].url} 
                isVideo={media[verticalIndices[1]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
              />
            </div>
          </div>
          {/* One horizontal photo full width at bottom */}
          <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndex)}>
            <MediaItem 
              url={media[horizontalIndex].url} 
              isVideo={media[horizontalIndex].isVideo}
              aspectRatio="w-full h-full object-cover"
              overlaySize="large"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderOneVerticalTwoHorizontal = () => {
    // Find the vertical photo
    const verticalIndex = mediaWithOrientation.findIndex(m => m.orientation === 'vertical');
    const horizontalIndices = mediaWithOrientation
      .map((m, i) => ({ media: m, index: i }))
      .filter(({ media }) => media.orientation === 'horizontal')
      .map(({ index }) => index);

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
          {/* Two horizontal photos stacked on right side */}
          <div className="w-1/2 h-full grid grid-rows-2 gap-1">
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndices[0])}>
              <MediaItem 
                url={media[horizontalIndices[0]].url} 
                isVideo={media[horizontalIndices[0]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
              />
            </div>
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(horizontalIndices[1])}>
              <MediaItem 
                url={media[horizontalIndices[1]].url} 
                isVideo={media[horizontalIndices[1]].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
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
        <div className="w-full aspect-[4/3] grid grid-rows-2 gap-1 rounded-lg overflow-hidden bg-gray-100">
          <div className="grid grid-cols-2 gap-1 h-full">
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(0)}>
              <MediaItem 
                url={media[0].url} 
                isVideo={media[0].isVideo} 
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
              />
            </div>
            <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(1)}>
              <MediaItem 
                url={media[1].url} 
                isVideo={media[1].isVideo}
                aspectRatio="w-full h-full object-cover"
                overlaySize="medium"
              />
            </div>
          </div>
          <div className="h-full cursor-pointer" onClick={() => onMediaClick?.(2)}>
            <MediaItem 
              url={media[2].url} 
              isVideo={media[2].isVideo}
              aspectRatio="w-full h-full object-cover"
              overlaySize="large"
            />
          </div>
        </div>
      </div>
    );
  };

  switch (layoutType) {
    case 'two-vertical-one-horizontal':
      return renderTwoVerticalOneHorizontal();
    case 'one-vertical-two-horizontal':
      return renderOneVerticalTwoHorizontal();
    default:
      return renderDefaultGrid();
  }
};

export default ThreePhotosLayout;
