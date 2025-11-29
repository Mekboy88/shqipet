import React, { useState, useEffect, useMemo } from 'react';
import { MediaItemProps } from '@/components/profile/content/photo-layouts/types';
import { detectOrientation } from '@/components/profile/content/photo-layouts/utils/orientationUtils';
import { isSecureVideoFile } from '@/utils/videoSecurity';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import { Play, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentPhotoGridProps {
  media: (string | MediaItemProps)[];
  videos?: string[];
  onMediaClick?: (index: number) => void;
  className?: string;
}

interface ProcessedMedia extends MediaItemProps {
  index: number;
  orientation: 'vertical' | 'horizontal' | 'square';
}

const CommentPhotoGrid: React.FC<CommentPhotoGridProps> = ({ 
  media, 
  videos = [],
  onMediaClick,
  className = ''
}) => {
  const [mediaDimensions, setMediaDimensions] = useState<{[key: string]: {width: number, height: number}}>({});
  const [dimensionsLoaded, setDimensionsLoaded] = useState(false);

  // Convert input to standardized format with enhanced video detection
  const standardizedMedia: MediaItemProps[] = useMemo(() => {
    return media.map((item) => {
      if (typeof item === 'string') {
        // Enhanced video detection - check multiple sources
        const isVideo = isSecureVideoFile(item) || 
                       videos.includes(item) ||
                       item.toLowerCase().includes('.mp4') ||
                       item.toLowerCase().includes('.webm') ||
                       item.toLowerCase().includes('.mov') ||
                       item.toLowerCase().includes('video');
        
        return {
          url: item,
          isVideo,
          width: 300,
          height: 300
        };
      }
      return {
        ...item,
        isVideo: item.isVideo || 
                isSecureVideoFile(item.url) || 
                videos.includes(item.url) ||
                item.url.toLowerCase().includes('.mp4') ||
                item.url.toLowerCase().includes('.webm') ||
                item.url.toLowerCase().includes('.mov') ||
                item.url.toLowerCase().includes('video')
      };
    });
  }, [media, videos]);

  // Quick dimension loading for light performance
  useEffect(() => {
    let isMounted = true;
    
    const loadDimensions = async () => {
      if (standardizedMedia.length === 0) {
        setDimensionsLoaded(true);
        return;
      }
      
      const dimensions: {[key: string]: {width: number, height: number}} = {};
      
      // Set smart defaults instantly
      standardizedMedia.forEach((item, index) => {
        const key = `${index}-${item.url}`;
        dimensions[key] = item.isVideo 
          ? { width: 16, height: 9 }   // Videos default to landscape
          : { width: 3, height: 4 };   // Photos default to portrait
      });
      
      if (isMounted) {
        setMediaDimensions(dimensions);
        setDimensionsLoaded(true);
      }
    };
    
    loadDimensions();
    
    return () => {
      isMounted = false;
    };
  }, [standardizedMedia.length]);

  // Process media with orientation detection
  const processedMedia: ProcessedMedia[] = useMemo(() => {
    return standardizedMedia.map((item, index) => {
      const key = `${index}-${item.url}`;
      const dims = mediaDimensions[key];
      
      let orientation: 'vertical' | 'horizontal' | 'square';
      if (dims) {
        orientation = detectOrientation(dims.width, dims.height);
      } else {
        orientation = 'square';
      }
      
      return {
        ...item,
        orientation,
        index
      };
    });
  }, [standardizedMedia, mediaDimensions]);

  const renderMediaCard = (item: ProcessedMedia, displayIndex: number) => {
    return (
      <div
        key={`${item.index}-${displayIndex}`}
        className="group relative bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => onMediaClick?.(item.index)}
      >
        <div className="aspect-square relative overflow-hidden">
          {item.isVideo ? (
            <div className="relative w-full h-full">
              <video
                src={item.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                preload="metadata"
              />
              {/* Video indicator */}
              <div className="absolute top-2 right-2 bg-white/95 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Play className="w-3 h-3" />
                Video
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {item.url.startsWith('blob:') ? (
                <img
                  src={item.url}
                  alt={`Media ${item.index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <WasabiImageDisplay
                  url={item.url}
                  alt={`Media ${item.index + 1}`}
                  className="w-full h-full object-cover"
                  aspectRatio="aspect-square"
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show minimal loading state
  if (!dimensionsLoaded && standardizedMedia.length > 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (processedMedia.length === 0) {
    return (
      <div className={`w-full text-center py-8 text-gray-400 ${className}`}>
        <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No media to display</p>
      </div>
    );
  }

  // Always show all media - no pagination
  const mediaToShow = processedMedia;

  // Determine grid columns based on count
  const getGridCols = () => {
    if (mediaToShow.length === 1) return 'grid-cols-1';
    if (mediaToShow.length === 2) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  return (
    <div className={`w-full ${className}`} style={{ backgroundColor: 'hsl(0, 0%, 92%)' }}>
      {/* Media grid with vertical scrolling */}
      <div className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent`}>
        <div className={`grid ${getGridCols()} gap-2`}>
          {mediaToShow.map((item, displayIndex) => renderMediaCard(item, displayIndex))}
        </div>
      </div>
    </div>
  );
};

export default CommentPhotoGrid;