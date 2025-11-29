
import { useEffect, useRef } from 'react';

interface UseVideoAutoPlayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onPlay?: () => void;
  onPause?: () => void;
  threshold?: number;
  disableScrollPause?: boolean;
}

export const useVideoAutoPlay = ({ 
  videoRef, 
  onPlay, 
  onPause, 
  threshold = 0.5,
  disableScrollPause = false
}: UseVideoAutoPlayProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If scroll pause is disabled, don't create the intersection observer at all
    if (disableScrollPause) {
      console.log('Scroll-based auto-pause is completely disabled');
      return;
    }

    // Create intersection observer only when scroll pause is enabled
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            // Check if video is actually centered on the page  
            const rect = entry.boundingClientRect;
            const viewportHeight = window.innerHeight;
            const videoCenter = rect.top + rect.height / 2;
            const viewportCenter = viewportHeight / 2;
            
            // More lenient centering: video center should be within 40% of viewport center
            const centerThreshold = viewportHeight * 0.4;
            const isCentered = Math.abs(videoCenter - viewportCenter) <= centerThreshold;
            
            console.log('Video autoplay check:', {
              videoSrc: video.src.split('/').pop(),
              intersectionRatio: entry.intersectionRatio,
              isCentered,
              videoCenter,
              viewportCenter,
              difference: Math.abs(videoCenter - viewportCenter),
              centerThreshold,
              willPlay: isCentered
            });
            
            if (isCentered) {
              // Video is centered, trigger play callback
              console.log('🎬 Video is centered - triggering autoplay');
              onPlay?.();
            } else {
              // Video is visible but not centered, pause it
              console.log('⏸️ Video visible but not centered - pausing');
              onPause?.();
            }
          } else {
            // Video is out of view, trigger pause callback
            console.log('⏸️ Video out of view - pausing');
            onPause?.();
          }
        });
      },
      {
        threshold: threshold,
        rootMargin: '0px'
      }
    );

    // Start observing the video
    observerRef.current.observe(video);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videoRef, onPlay, onPause, threshold, disableScrollPause]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
};
