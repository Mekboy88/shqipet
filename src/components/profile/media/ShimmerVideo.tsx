import React from 'react';
import '@/components/ui/skeleton-shimmer.css';

interface ShimmerVideoProps {
  src: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
}

const ShimmerVideo: React.FC<ShimmerVideoProps> = ({ 
  src, 
  className = "", 
  onLoad,
  onError,
  controls = false,
  autoPlay = false,
  muted = true
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Shimmer background - only visible while loading */}
      {isLoading && <div className="absolute inset-0 facebook-skeleton rounded-md" />}
      
      {/* Video */}
      <video
        src={src}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
          isLoading || hasError ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadedData={handleLoad}
        onError={handleError}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        playsInline
        preload="metadata"
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
          <span className="text-sm">Failed to load video</span>
        </div>
      )}
    </div>
  );
};

export default ShimmerVideo;