
import React, { useRef, useEffect, useState } from 'react';
import { MoreVertical, Play } from 'lucide-react';
import { AspectRatio } from '../ui/aspect-ratio';
import { useVideoPosterLoader } from '@/hooks/useVideoPosterLoader';
import '@/components/ui/skeleton-shimmer.css';
interface ReelItemProps {
  reel: {
    id: string;
    videoUrl: string;
    thumbnail?: string;
    creator: string;
    views: string;
    title: string;
    caption: string;
  };
  index: number;
  onClick: () => void;
}

const ReelItem: React.FC<ReelItemProps> = ({
  reel,
  index,
  onClick
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [shouldLoad, setShouldLoad] = useState(index < 6);
  const { loading, markReady } = useVideoPosterLoader(reel.thumbnail);
  const [retryCount, setRetryCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);

  // Lazy-load when item enters viewport
  useEffect(() => {
    if (shouldLoad) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  // Auto-start the 3-second loop when video is loaded
  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoReady(true);
      setIsMediaLoaded(true);
      markReady();
      video.currentTime = 0;
      video.play().catch(() => {
        console.log('Autoplay prevented for video:', reel.id);
      });
      
      // Set up 3-second loop
      intervalRef.current = setInterval(() => {
        if (video && !video.paused) {
          video.currentTime = 0;
        }
      }, 3000);
    };

    const handleCanPlay = () => {
      setVideoReady(true);
      setIsMediaLoaded(true);
      markReady();
      handleLoadedData();
    };

    const handleError = () => {
      console.warn(`Video load attempt ${retryCount + 1} failed for reel: ${reel.id}`);
      if (retryCount < 3) {
        // Silent retry with cache busting
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          if (video && video.src) {
            video.src = `${reel.videoUrl}${reel.videoUrl.includes('?') ? '&' : '?'}retry=${retryCount + 1}&t=${Date.now()}`;
          }
        }, 1000 * (retryCount + 1)); // Progressive delay
      } else {
        // Keep shimmer if failing after retries; optionally show an error state later
        // Do not set isMediaLoaded to true here
      }
    };

    video.addEventListener('loadeddata', handleLoadedData, { once: true });
    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('error', handleError);

    // Cleanup interval on unmount
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [reel.id, reel.videoUrl, shouldLoad, markReady, retryCount]);

  return (
    <div 
      className="flex-shrink-0 w-[291px] mr-2 cursor-pointer h-full" 
      data-reel-id={reel.id} 
      onClick={onClick}
      ref={containerRef}
    >
      <div className="relative rounded-lg overflow-hidden group h-full bg-gray-900">
        <AspectRatio ratio={9 / 16}>
          {/* Video element */}
          <video 
            ref={videoRef}
            src={shouldLoad ? reel.videoUrl : undefined}
            poster={reel.thumbnail}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isMediaLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            muted 
            playsInline
            loop
            autoPlay
            preload={shouldLoad ? 'metadata' : 'none'}
          />
          
          {/* Shimmer loading overlay - only while not loaded, above video (per card) */}
          {!isMediaLoaded && <div className="absolute inset-0 facebook-skeleton pointer-events-none z-20" aria-hidden="true" />}
        </AspectRatio>
        
        <div className="absolute top-4 right-4 z-30">
          <button className="p-2.5 bg-transparent flex flex-col items-center gap-2 opacity-100 transition-opacity">
            <MoreVertical className="w-7 h-7 text-[#FFFFFF]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReelItem;
