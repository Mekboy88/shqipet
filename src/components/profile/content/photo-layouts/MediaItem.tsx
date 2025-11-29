import React from 'react';
import { MediaItemProps } from './types';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import { processWasabiUrl, isWasabiKey } from '@/services/media/LegacyMediaService';
import { Skeleton } from '@/components/ui/skeleton';
import '@/components/ui/skeleton-shimmer.css';

interface Props extends MediaItemProps {
  aspectRatio?: string;
  overlaySize?: 'small' | 'medium' | 'large';
  extraCount?: number;
}

const MediaItem: React.FC<Props> = ({ 
  url, 
  isVideo, 
  aspectRatio = "aspect-square", 
  overlaySize = "medium",
  extraCount
}) => {
  console.log('🖼️ MediaItem rendering:', {
    url,
    isVideo,
    aspectRatio,
    isWasabiKey: isWasabiKey(url)
  });

  return (
    <div className={`relative h-full overflow-hidden cursor-pointer rounded-md group transition-opacity duration-200 hover:opacity-90`}>
      {/* Shimmer background - only visible while loading */}
      <div className="facebook-skeleton absolute inset-0" />
      
      {!isVideo ? (
        <WasabiImageDisplay
          url={url}
          alt="Media content"
          className="relative z-10 rounded-md w-full h-full transition-opacity duration-300"
          aspectRatio="w-full h-full"
        />
      ) : (
        <WasabiVideoPlayer 
          url={url}
          className="relative z-10 w-full h-full object-cover rounded-md transition-opacity duration-300"
        />
      )}
      
      {/* Removed VideoOverlay - no play button overlay needed */}
      
      {extraCount !== undefined && extraCount > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
          <span className="text-white font-semibold text-xl">
            +{extraCount}
          </span>
        </div>
      )}
    </div>
  );
};

// Component for handling video URLs that might need presigning
const WasabiVideoPlayer: React.FC<{ url: string; className: string }> = ({ url, className }) => {
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    const generateVideoUrl = async () => {
      try {
        const processedUrl = await processWasabiUrl(url, 900);
        setVideoUrl(processedUrl);
      } catch (error) {
        console.error('❌ Failed to generate video URL:', error);
        setVideoUrl(url); // Fallback to original
      } finally {
        setLoading(false);
      }
    };

    generateVideoUrl();
  }, [url]);

  const handleLoadedData = () => {
    setImageLoaded(true);
    // Hide the skeleton background when video loads
    setTimeout(() => {
      const parent = document.querySelector(`[data-video-url="${url}"]`)?.parentElement;
      const skeleton = parent?.querySelector('.facebook-skeleton');
      if (skeleton) skeleton.remove();
    }, 100);
  };

  if (loading || !videoUrl) {
    return null; // Let the parent skeleton show
  }

  return (
    <video
      src={videoUrl}
      className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
      muted
      playsInline
      preload="metadata"
      onLoadedData={handleLoadedData}
      data-video-url={url}
    />
  );
};

export default MediaItem;