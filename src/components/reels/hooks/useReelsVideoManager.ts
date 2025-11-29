
import { useRef, useState, useEffect } from 'react';

export const useReelsVideoManager = (reels: any[]) => {
  const [videoLoadErrors, setVideoLoadErrors] = useState<Set<string>>(new Set());
  const [videosLoaded, setVideosLoaded] = useState<Set<string>>(new Set());
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const cleanupFunctions = useRef<Map<string, () => void>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup video 3-second loop
  const setupVideoLoop = (video: HTMLVideoElement, reelId: string) => {
    // Clean up any existing listener for this video
    const existingCleanup = cleanupFunctions.current.get(reelId);
    if (existingCleanup) {
      existingCleanup();
    }

    const PREVIEW_DURATION = 3; // 3 seconds
    
    const handleTimeUpdate = () => {
      if (video.currentTime >= PREVIEW_DURATION) {
        video.currentTime = 0; // Loop back to start
        console.log(`Looping video for reel: ${reelId} at ${video.currentTime}s`);
      }
    };
    
    const handleLoadedData = () => {
      video.currentTime = 0;
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadeddata', handleLoadedData);
    
    // Store cleanup function
    const cleanup = () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
    cleanupFunctions.current.set(reelId, cleanup);
    
    console.log(`Setup 3-second loop for reel: ${reelId}`);
    return cleanup;
  };

  // Function to start playing a video
  const startVideoPlayback = async (video: HTMLVideoElement, reelId: string) => {
    try {
      // Ensure video is muted for autoplay compliance
      video.muted = true;
      video.currentTime = 0;
      
      // Setup the loop first
      setupVideoLoop(video, reelId);
      
      // Start playing
      await video.play();
      console.log(`Started playing preview for reel: ${reelId}`);
    } catch (error) {
      console.log('Play failed:', error);
      // Try again with a small delay
      setTimeout(async () => {
        try {
          await video.play();
          console.log(`Started playing preview for reel: ${reelId} (retry)`);
        } catch (retryError) {
          console.log('Retry play failed:', retryError);
        }
      }, 100);
    }
  };

  // Function to stop playing a video
  const stopVideoPlayback = (video: HTMLVideoElement, reelId: string) => {
    video.pause();
    video.currentTime = 0;
    
    // Clean up loop listener when not visible
    const cleanup = cleanupFunctions.current.get(reelId);
    if (cleanup) {
      cleanup();
      cleanupFunctions.current.delete(reelId);
    }
    
    console.log(`Stopped playing preview for reel: ${reelId}`);
  };

  // Setup intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const reelId = entry.target.getAttribute('data-reel-id');
        if (reelId) {
          const video = videoRefs.current.get(reelId);
          console.log(`Intersection change for reel ${reelId}:`, {
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            hasVideo: !!video,
            videoReady: video ? video.readyState >= 2 : false
          });
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setVisibleVideos(prev => new Set([...prev, reelId]));
            if (video && video.readyState >= 2) {
              startVideoPlayback(video, reelId);
            }
          } else {
            setVisibleVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(reelId);
              return newSet;
            });
            if (video) {
              stopVideoPlayback(video, reelId);
            }
          }
        }
      });
    }, {
      threshold: [0, 0.5, 1.0],
      rootMargin: '0px'
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Clean up all listeners on unmount
      cleanupFunctions.current.forEach(cleanup => cleanup());
      cleanupFunctions.current.clear();
    };
  }, []);

  // Observe video elements when they're added
  useEffect(() => {
    if (!observerRef.current) return;
    
    const timer = setTimeout(() => {
      const videoElements = document.querySelectorAll('[data-reel-id]');
      console.log(`Found ${videoElements.length} reel elements to observe`);
      
      videoElements.forEach(el => {
        if (observerRef.current) {
          observerRef.current.observe(el);
          console.log(`Observing reel element:`, el.getAttribute('data-reel-id'));
        }
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [reels]);

  const handleVideoError = (reelId: string) => {
    console.error('Video failed to load for reel:', reelId);
    setVideoLoadErrors(prev => new Set([...prev, reelId]));
  };

  const handleVideoLoad = (reelId: string) => {
    console.log('Video loaded successfully for reel:', reelId);
    setVideosLoaded(prev => new Set([...prev, reelId]));
    setVideoLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(reelId);
      return newSet;
    });
  };

  const handleVideoCanPlay = (reelId: string) => {
    console.log('Video can play for reel:', reelId);
    setVideosLoaded(prev => new Set([...prev, reelId]));
    
    // Start playing if video is visible
    const video = videoRefs.current.get(reelId);
    if (video && visibleVideos.has(reelId)) {
      startVideoPlayback(video, reelId);
    }
  };

  return {
    videoLoadErrors,
    videosLoaded,
    visibleVideos,
    videoRefs,
    handleVideoError,
    handleVideoLoad,
    handleVideoCanPlay
  };
};
