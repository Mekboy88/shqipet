import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MediaItemProps } from '@/components/profile/content/photo-layouts/types';
import { detectOrientation } from '@/components/profile/content/photo-layouts/utils/orientationUtils';
import { isSecureVideoFile } from '@/utils/videoSecurity';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import { X } from 'lucide-react';
import UnmuteIcon from '@/components/icons/UnmuteIcon';
import './UniversalPhotoGrid.css';

interface UniversalPhotoGridProps {
  media: (string | MediaItemProps)[];
  videos?: string[];
  onMediaClick?: (index: number) => void;
  className?: string;
  stablePreview?: boolean;
}

interface ProcessedMedia extends MediaItemProps {
  index: number;
  orientation: 'vertical' | 'horizontal' | 'square';
}

const UniversalPhotoGrid: React.FC<UniversalPhotoGridProps> = ({ 
  media, 
  videos = [],
  onMediaClick,
  className = '',
  stablePreview = false
}) => {
  const [mediaDimensions, setMediaDimensions] = useState<{[key: string]: {width: number, height: number}}>({});
  const [dimensionsLoaded, setDimensionsLoaded] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  // Convert input to standardized format with proper video detection
  const standardizedMedia: MediaItemProps[] = useMemo(() => {
    return media.map((item) => {
      if (typeof item === 'string') {
        return {
          url: item,
          isVideo: isSecureVideoFile(item) || videos.includes(item),
          width: 1000,
          height: 1000
        };
      }
      return {
        ...item,
        isVideo: item.isVideo || isSecureVideoFile(item.url) || videos.includes(item.url)
      };
    });
  }, [media, videos]);

  // Load dimensions for proper orientation detection
  useEffect(() => {
    if (stablePreview) {
      // Skip async dimension probing in preview to prevent flicker
      setMediaDimensions({});
      setDimensionsLoaded(true);
      return;
    }

    let isMounted = true;
    const loadDimensions = async () => {
      if (standardizedMedia.length === 0) {
        setDimensionsLoaded(true);
        return;
      }
      const dimensions: {[key: string]: {width: number, height: number}} = {};
      const dimensionPromises = standardizedMedia.map((item, index) => {
        return new Promise<void>((resolve) => {
          const key = `${index}-${item.url}`;
          // Set intelligent defaults based on content type
          dimensions[key] = item.isVideo 
            ? { width: 16, height: 9 }   // Videos default to landscape
            : { width: 3, height: 4 };   // Photos default to portrait
          if (item.isVideo) {
            const video = document.createElement('video');
            video.src = item.url;
            video.crossOrigin = 'anonymous';
            const timeout = setTimeout(() => resolve(), 1000);
            video.onloadedmetadata = () => {
              clearTimeout(timeout);
              if (video.videoWidth && video.videoHeight) {
                dimensions[key] = {
                  width: video.videoWidth,
                  height: video.videoHeight
                };
              }
              resolve();
            };
            video.onerror = () => {
              clearTimeout(timeout);
              resolve();
            };
          } else {
            if (item.url.startsWith('blob:') || item.url.startsWith('data:')) {
              const img = new Image();
              const timeout = setTimeout(() => resolve(), 1000);
              img.onload = () => {
                clearTimeout(timeout);
                dimensions[key] = {
                  width: img.naturalWidth || 3,
                  height: img.naturalHeight || 4
                };
                resolve();
              };
              img.onerror = () => {
                clearTimeout(timeout);
                resolve();
              };
              img.src = item.url;
            } else {
              if (item.width && item.height) {
                dimensions[key] = { width: item.width, height: item.height };
              }
              resolve();
            }
          }
        });
      });
      await Promise.all(dimensionPromises);
      if (isMounted) {
        setMediaDimensions(dimensions);
        setDimensionsLoaded(true);
      }
    };

    setDimensionsLoaded(false);
    loadDimensions();
    return () => { isMounted = false; };
  }, [standardizedMedia.length, standardizedMedia[0]?.url, stablePreview]);

  // Process media with orientation detection - show ALL content
  const processedMedia: ProcessedMedia[] = useMemo(() => {
    return standardizedMedia.map((item, index) => {
      const key = `${index}-${item.url}`;
      let orientation: 'vertical' | 'horizontal' | 'square';

      if (stablePreview) {
        // Lock orientation to avoid layout shifts during preview
        orientation = item.isVideo ? 'horizontal' : 'square';
      } else {
        const dims = mediaDimensions[key];
        if (dims) {
          orientation = detectOrientation(dims.width, dims.height);
        } else {
          orientation = detectOrientation(item.width || 1000, item.height || 1000);
        }
      }
      
      return {
        ...item,
        orientation,
        index
      };
    });
  }, [standardizedMedia, mediaDimensions, stablePreview]);

  // Determine layout class based on exact rules
  const getLayoutClass = (media: ProcessedMedia[]): string => {
    const count = media.length;
    if (count === 0) return 'universal-grid-empty';
    
    const orientations = media.map(m => m.orientation);
    const vCount = orientations.filter(o => o === 'vertical').length;
    const hCount = orientations.filter(o => o === 'horizontal').length;
    const sCount = orientations.filter(o => o === 'square').length;
    
    // 1 photo: 1V or 1H
    if (count === 1) {
      return 'universal-grid-1';
    }
    
    // 2 photos
    if (count === 2) {
      if (vCount === 1 && hCount === 1) return 'universal-grid-2-1v1h';  // V left 40% / H right 60%
      if (vCount === 2 || (vCount === 1 && sCount === 1)) return 'universal-grid-2-2v';  // 50/50 columns
      return 'universal-grid-2-2h';  // 50/50 rows
    }
    
    // 3 photos
    if (count === 3) {
      if (vCount === 2 && hCount === 1) return 'universal-grid-3-2v1h';  // V,V top 50/50; H bottom 100%
      if (vCount === 1 && hCount === 2) return 'universal-grid-3-2h1v';  // V left 40%; right has two H stacked 60%
      if (vCount === 3 || (vCount >= 2)) return 'universal-grid-3-3v';     // row of three equal columns
      return 'universal-grid-3-3h';  // top H,H 50/50; bottom H 100%
    }
    
    // 4 photos: clean 2×2 grid
    if (count === 4) {
      return 'universal-grid-4-2x2';
    }
    
    // 5 photos
    if (count === 5) {
      if (vCount === 3 && hCount === 2) return 'universal-grid-5-3v2h';  // left 40% with 3 V; right 60% with 2 H
      if (vCount === 2 && hCount === 3) return 'universal-grid-5-2v3h';  // left 40% with 2 V; right 60% with 3 H
      if (vCount === 4 && hCount === 1) return 'universal-grid-5-4v1h';  // top four V in a row; bottom H 100%
      if (vCount === 1 && hCount === 4) return 'universal-grid-5-4h1v';  // V left 40%; right side 2×2 H
      if (vCount >= 4) return 'universal-grid-5-5v';  // left has 2 V; right has 3 V
      return 'universal-grid-5-5h';  // top has 2 H (50/50); bottom has 3 H (equal thirds)
    }
    
    // 5+ items: use 5-photo layout with +N overlay
    return 'universal-grid-5plus';
  };

  // Sort media for optimal layout
  const getSortedMedia = (media: ProcessedMedia[], layoutClass: string): ProcessedMedia[] => {
    const maxItems = layoutClass.includes('5plus') ? 5 : media.length;
    
    // For mixed layouts, sort verticals first then horizontals for better arrangement
    if (layoutClass.includes('v') && layoutClass.includes('h')) {
      const verticals = media.filter(m => m.orientation === 'vertical');
      const horizontals = media.filter(m => m.orientation === 'horizontal');
      const squares = media.filter(m => m.orientation === 'square');
      
      return [...verticals, ...squares, ...horizontals].slice(0, maxItems);
    }
    
    return media.slice(0, maxItems);
  };

  const renderMediaItem = (item: ProcessedMedia, displayIndex: number, layoutClass: string) => {
    const isLastItem = displayIndex === 4 && processedMedia.length > 5;
    const remainingCount = processedMedia.length - 5;
    
    return (
      <div
        key={`${item.index}-${displayIndex}`}
        className="universal-photo-wrapper group relative"
      >
        {item.isVideo ? (
          (() => {
            const keyId = `${item.index}-${item.url}`;
            const isMuted = mutedMap[keyId] ?? true;
            return (
              <div className="relative w-full h-full">
                <video
                  ref={(el) => { videoRefs.current[keyId] = el; }}
                  src={item.url}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${loadedMap[keyId] ? 'opacity-100' : 'opacity-0'}`}
                  muted={isMuted}
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setLoadedMap((m) => ({ ...m, [keyId]: true }))}
                  onLoadedMetadata={() => setLoadedMap((m) => ({ ...m, [keyId]: true }))}
                />
                {/* Mute/Unmute toggle on left side */}
                <button
                  type="button"
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  onClick={(e) => {
                    e.stopPropagation();
                    const next = !isMuted;
                    setMutedMap((prev) => ({ ...prev, [keyId]: next }));
                    const v = videoRefs.current[keyId];
                    if (v) v.muted = next;
                  }}
                  className="absolute top-2 left-2 bg-black/70 hover:bg-black text-white rounded-full p-2 shadow z-10"
                >
                  <UnmuteIcon className="w-4 h-4" muted={isMuted} />
                </button>
                {/* Video badge on bottom right */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  Video
                </div>
              </div>
            );
          })()
        ) : (
          item.url.startsWith('blob:') || item.url.startsWith('data:') ? (
            <img
              src={item.url}
              alt={`Media ${item.index + 1}`}
              className={`w-full h-full object-cover transition-opacity duration-300 ${loadedMap[`${item.index}-${item.url}`] ? 'opacity-100' : 'opacity-0'}`}
              loading="eager"
              onLoad={() => setLoadedMap((m) => ({ ...m, [`${item.index}-${item.url}`]: true }))}
            />
          ) : (
            <WasabiImageDisplay
              url={item.url}
              alt={`Media ${item.index + 1}`}
              className="w-full h-full object-cover"
              aspectRatio="aspect-auto"
            />
          )
        )}
        
        {/* X button with circle - appears on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMediaClick?.(item.index);
          }}
          className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
        >
          <X className="w-4 h-4" />
        </button>
        
        {isLastItem && remainingCount > 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">+{remainingCount}</span>
          </div>
        )}
      </div>
    );
  };

  // Show minimal loading state
  if (!dimensionsLoaded && standardizedMedia.length > 0 && !stablePreview) {
    return (
      <div className={`universal-photo-grid universal-grid-1 animate-fade-in ${className}`}>
        <div className="universal-photo-wrapper bg-muted/20 flex items-center justify-center">
          <div className="w-3 h-3 border border-muted-foreground/30 rounded-full" />
        </div>
      </div>
    );
  }

  if (processedMedia.length === 0) {
    return (
      <div className={`universal-photo-grid universal-grid-empty ${className}`}>
        <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
          No media to display
        </div>
      </div>
    );
  }

  const layoutClass = getLayoutClass(processedMedia);
  const sortedMedia = getSortedMedia(processedMedia, layoutClass);

  return (
    <div className={`universal-photo-grid ${layoutClass} ${!stablePreview ? 'animate-fade-in' : ''} ${className}`}>
      {sortedMedia.map((item, displayIndex) => 
        renderMediaItem(item, displayIndex, layoutClass)
      )}
    </div>
  );
};

export default UniversalPhotoGrid;