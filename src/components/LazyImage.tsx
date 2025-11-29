import React, { useState, useEffect, useRef } from 'react';
import { WasabiImageDisplay } from '@/components/fallback/WasabiImageDisplay';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'aspect-auto'
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before image enters viewport
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [shouldLoad]);

  if (!shouldLoad) {
    return (
      <div ref={imageRef} className={`${className} ${aspectRatio}`}>
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div ref={imageRef} className={`${className} ${aspectRatio}`}>
      {src.startsWith('blob:') ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <WasabiImageDisplay
          url={src}
          alt={alt}
          className="w-full h-full object-cover"
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
};

export default LazyImage;