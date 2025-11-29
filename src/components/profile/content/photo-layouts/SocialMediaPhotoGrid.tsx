import React, { useState, useEffect } from 'react';
import { MediaItemProps } from './types';
import { detectOrientation } from './utils/orientationUtils';
import './SocialMediaPhotoGrid.css';

interface SocialMediaPhotoGridProps {
  media: MediaItemProps[];
  onMediaClick?: (index: number) => void;
}

const SocialMediaPhotoGrid: React.FC<SocialMediaPhotoGridProps> = ({ 
  media, 
  onMediaClick 
}) => {
  const [mediaDimensions, setMediaDimensions] = useState<{[key: string]: {width: number, height: number}}>({});
  const [dimensionsLoaded, setDimensionsLoaded] = useState(false);

  // Load image/video dimensions with timeout and stable dependencies
  useEffect(() => {
    let isMounted = true;
    
    const loadDimensions = async () => {
      // Quick exit if no media
      if (media.length === 0) {
        setDimensionsLoaded(true);
        return;
      }
      
      const dimensions: {[key: string]: {width: number, height: number}} = {};
      
      const timeoutPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 800); // Faster timeout to reduce shaking
      });
      
      const dimensionPromises = media.map((item, index) => {
        return new Promise<void>((resolve) => {
          const key = `${index}-${item.url}`;
          
          // Set default dimensions immediately
          dimensions[key] = item.isVideo 
            ? { width: 16, height: 9 } // Default landscape for videos
            : { width: 3, height: 4 }; // Default portrait for images
          
          if (item.isVideo) {
            const video = document.createElement('video');
            video.src = item.url;
            
            const videoTimeout = setTimeout(() => {
              resolve(); // Resolve with default dimensions
            }, 2000);
            
            video.onloadedmetadata = () => {
              clearTimeout(videoTimeout);
              dimensions[key] = {
                width: video.videoWidth || 16,
                height: video.videoHeight || 9
              };
              resolve();
            };
            
            video.onerror = () => {
              clearTimeout(videoTimeout);
              resolve(); // Already has default dimensions
            };
          } else {
            const img = new Image();
            img.src = item.url;
            
            const imgTimeout = setTimeout(() => {
              resolve(); // Resolve with default dimensions
            }, 2000);
            
            img.onload = () => {
              clearTimeout(imgTimeout);
              dimensions[key] = {
                width: img.naturalWidth || 3,
                height: img.naturalHeight || 4
              };
              resolve();
            };
            
            img.onerror = () => {
              clearTimeout(imgTimeout);
              resolve(); // Already has default dimensions
            };
          }
        });
      });
      
      // Race between loading dimensions and timeout
      await Promise.race([
        Promise.all(dimensionPromises),
        timeoutPromise
      ]);
      
      if (isMounted) {
        setMediaDimensions(dimensions);
        setDimensionsLoaded(true);
      }
    };
    
    // Reset loading state when media changes
    setDimensionsLoaded(false);
    loadDimensions();
    
    return () => {
      isMounted = false;
    };
  }, [media.length, media[0]?.url]); // Stable dependencies

  // Detect orientation for each media item
  const mediaWithOrientation = media.map((item, index) => {
    const key = `${index}-${item.url}`;
    const dims = mediaDimensions[key];
    const orientation = dims 
      ? detectOrientation(dims.width, dims.height)
      : detectOrientation(item.width, item.height);
    
    return {
      ...item,
      orientation,
      index: index
    };
  });

  // Show very light loading state without animations
  if (!dimensionsLoaded && media.length > 0) {
    return (
      <div className="photo-grid-container grid-1">
        <div className="photo-wrapper bg-muted/10 flex items-center justify-center">
          <div className="w-4 h-4 border border-muted rounded-full opacity-50" />
        </div>
      </div>
    );
  }

  // Advanced layout class decision with comprehensive rules
  const getLayoutClass = (count: number): string => {
    if (count <= 0) return 'grid-1';
    
    const orientations = mediaWithOrientation.map(m => m.orientation);
    const verticalCount = orientations.filter(o => o === 'vertical').length;
    const horizontalCount = orientations.filter(o => o === 'horizontal').length;
    
    // 1 photo: Single display
    if (count === 1) return 'grid-1';
    
    // 2 photos: 1V+1H, 2V, or 2H
    if (count === 2) {
      if (verticalCount === 1 && horizontalCount === 1) return 'grid-2-1v1h';
      if (verticalCount === 2) return 'grid-2-2v';
      return 'grid-2-2h';
    }
    
    // 3 photos: 2V+1H, 2H+1V, 3V only, 3H only
    if (count === 3) {
      if (verticalCount === 2 && horizontalCount === 1) return 'grid-3-2v1h';
      if (verticalCount === 1 && horizontalCount === 2) return 'grid-3-2h1v';
      if (verticalCount === 3) return 'grid-3-3v';
      return 'grid-3-3h';
    }
    
    // 4 photos: Clean 2×2 grid
    if (count === 4) return 'grid-4-2v2h';
    
    // 5 photos: All combinations
    if (count === 5) {
      if (verticalCount === 3 && horizontalCount === 2) return 'grid-5-3v2h';
      if (verticalCount === 2 && horizontalCount === 3) return 'grid-5-2v3h';
      if (verticalCount === 4 && horizontalCount === 1) return 'grid-5-4v1h';
      if (verticalCount === 1 && horizontalCount === 4) return 'grid-5-4h1v';
      if (verticalCount === 5) return 'grid-5-5v';
      return 'grid-5-5h';
    }
    
    // 5+ photos: Use 5-photo layout with +N overlay
    return 'grid-5-same';
  };

  // Sort media for layout
  const getSortedMedia = (layoutClass: string) => {
    const mediaToShow = mediaWithOrientation.slice(0, 5);
    
    // For mixed layouts, sort vertical first then horizontal
    if (layoutClass.includes('v') && layoutClass.includes('h')) {
      const verticals = mediaWithOrientation.filter(m => m.orientation === 'vertical');
      const horizontals = mediaWithOrientation.filter(m => m.orientation === 'horizontal');
      const squares = mediaWithOrientation.filter(m => m.orientation === 'square');
      
      return [...verticals, ...horizontals, ...squares].slice(0, 5);
    }
    
    return mediaToShow;
  };

  const renderPhoto = (mediaItem: any, displayIndex: number) => {
    const isLastPhoto = displayIndex === 4 && media.length > 5;
    const remainingCount = media.length - 5;
    
    return (
      <div
        key={`${mediaItem.index}-${displayIndex}`}
        className="photo-wrapper relative"
        onClick={() => onMediaClick?.(mediaItem.index)}
      >
        {mediaItem.isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={mediaItem.url}
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
            {/* Remove video play icon overlay completely */}
          </div>
        ) : (
          <img
            src={mediaItem.url}
            alt={`Photo ${mediaItem.index + 1}`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Show +count overlay for 5+ images */}
        {isLastPhoto && remainingCount > 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-xl">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  const layoutClass = getLayoutClass(mediaWithOrientation.length);
  const sortedMedia = getSortedMedia(layoutClass);

  return (
    <div className={`photo-grid-container ${layoutClass}`}>
      {sortedMedia.map((item, displayIndex) => renderPhoto(item, displayIndex))}
    </div>
  );
};

export default SocialMediaPhotoGrid;