import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useRobustVideoLoader } from '@/hooks/useRobustVideoLoader';

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  caption: string;
  viewsCount: number;
  title: string;
}

interface VideoCardProps {
  video: VideoItem;
  index: number;
  onOpen: (index: number) => void;
  formatViews: (n: number) => string;
  isVisible: boolean;
}

const VideoCard: React.FC<VideoCardProps> = React.memo(({ video, index, onOpen, formatViews, isVisible }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mounted, setMounted] = useState(false);
  const [realTimeViews, setRealTimeViews] = useState(video.viewsCount);
  const [nearVisible, setNearVisible] = useState(false);
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  
  const { loading, error, ready, markReady, markError } = useRobustVideoLoader({
    videoUrl: video.videoUrl,
    posterUrl: video.thumbnail,
    timeout: 15000,
    maxRetries: 2,
  });

  // Observe when card is near viewport (~2 viewports) and mount
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setNearVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '200% 0px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mount when visible or near-visible
  useEffect(() => {
    if ((isVisible || nearVisible) && !mounted) {
      setMounted(true);
    }
  }, [isVisible, nearVisible, mounted]);

  // Keep views synced to server value (no random increments to avoid flicker)
  useEffect(() => {
    setRealTimeViews(video.viewsCount);
  }, [video.viewsCount]);

  // Video management
  useEffect(() => {
    if (!mounted) return;

    const video = videoRef.current;
    if (!video) return;

    const safety = setTimeout(() => {
      // If metadata still not ready after 15s, stop shimmer
      markReady();
    }, 15000);

    const handleLoadedMetadata = () => {
      setIsMediaLoaded(true);
      markReady();
    };

    const handleCanPlay = () => {
      setIsMediaLoaded(true);
      markReady();
    };

    const handleError = () => {
      // Keep shimmer if video/poster fails; do not hide overlay
      // Optionally still mark loader ready for other logic
      markReady();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      clearTimeout(safety);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, video.videoUrl, markReady]);

  // Don't render anything until mounted and visible  
  if (!mounted) {
    // Show skeleton placeholder without visible loading
    return (
      <div className="mb-0" ref={containerRef}>
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden facebook-skeleton" />
          <div className="p-3">
            <div className="h-4 w-2/3 rounded-md facebook-skeleton" />
            <div className="mt-2 h-4 w-1/3 rounded-md facebook-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer group"
      onClick={() => onOpen(index)}
      ref={containerRef}
      aria-busy={!ready}
    >
      <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Media area */}
        <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl">
          <video 
            ref={videoRef}
            src={video.videoUrl}
            poster={video.thumbnail}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isMediaLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            muted 
            playsInline
            loop
            autoPlay={false}
            preload="metadata"
          />
          
          {/* Shimmer loading overlay - only show when not loaded (per card) */}
          {!isMediaLoaded && (
            <div className="absolute inset-0 facebook-skeleton pointer-events-none z-20" aria-hidden="true" />
          )}
          
          {/* Play icon on hover - only show when loaded */}
          {isMediaLoaded && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-90 transition-opacity duration-200">
              <div className="w-12 h-12 rounded-full bg-black/35 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Info overlay - with non-flickering view count */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent p-3">
          <div className="text-white text-sm font-medium truncate drop-shadow mb-1">
            {video.creator}
          </div>
          <div className="text-white/90 text-xs truncate">
            📹 <span className="tabular-nums">{formatViews(realTimeViews)}</span> shikime
          </div>
        </div>

        {/* Save button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button 
            className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow"
            onClick={(e) => {
              e.stopPropagation();
              // Add save functionality here
            }}
          >
            Ruaj
          </button>
        </div>
      </div>
    </div>
  );
});

VideoCard.displayName = 'VideoCard';

interface VirtualizedVideoGridProps {
  videos: VideoItem[];
  onVideoOpen: (index: number) => void;
  formatViews: (n: number) => string;
}

export const VirtualizedVideoGrid: React.FC<VirtualizedVideoGridProps> = ({
  videos,
  onVideoOpen,
  formatViews,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 24 });

  // Calculate visible items based on scroll position
  const updateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // Determine how many items are visible based on viewport
    const itemHeight = 400; // Approximate height of each card
    const itemsPerRow = Math.floor(container.clientWidth / 300); // Approximate width
    const rowsVisible = Math.ceil(viewportHeight / itemHeight);
    const bufferRows = 2; // Load 2 rows above and below viewport
    
    const totalVisibleItems = itemsPerRow * (rowsVisible + bufferRows * 2);
    const startIndex = Math.max(0, Math.floor(container.scrollTop / itemHeight) * itemsPerRow - itemsPerRow * bufferRows);
    const endIndex = Math.min(videos.length, startIndex + totalVisibleItems);
    
    setVisibleRange({ start: startIndex, end: endIndex });
  }, [videos.length]);

  // Listen to scroll events for virtualization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      updateVisibleRange();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    updateVisibleRange(); // Initial calculation

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [updateVisibleRange]);

  // Update visible range when videos change
  useEffect(() => {
    updateVisibleRange();
  }, [videos.length, updateVisibleRange]);

  const visibleVideos = useMemo(() => {
    // Render all cards; each card mounts itself when near viewport via IntersectionObserver
    return videos.map((video, index) => ({
      video,
      index,
      isVisible: false,
    }));
  }, [videos]);

  return (
    <div 
      ref={containerRef}
      className="w-full grid [grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))] gap-4"
    >
      {visibleVideos.map(({ video, index, isVisible }) => (
        <VideoCard
          key={video.id}
          video={video}
          index={index}
          onOpen={onVideoOpen}
          formatViews={formatViews}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
};