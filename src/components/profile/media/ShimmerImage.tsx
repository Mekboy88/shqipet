import React from 'react';
import '@/components/ui/skeleton-shimmer.css';

interface ShimmerImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ShimmerImage: React.FC<ShimmerImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  onLoad,
  onError 
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
      
      {/* Image */}
      <img
        src={src}
        alt={alt}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
          isLoading || hasError ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-10">
          <span className="text-sm">Failed to load</span>
        </div>
      )}
    </div>
  );
};

export default ShimmerImage;