
import { useState, useEffect, useRef } from 'react';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  caption: string;
  views: string;
  title: string;
}

export const useReelsViewerState = (reels: Reel[], initialIndex: number, onClose: () => void) => {
  const [currentReel, setCurrentReel] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false); // Changed to false to start with volume on
  const [liked, setLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadVideoRef = useRef<HTMLVideoElement>(null);

  const currentReelData = reels[currentReel];
  const nextReelData = reels[(currentReel + 1) % reels.length];

  const handleNext = () => {
    setCurrentReel((prev) => (prev + 1) % reels.length);
    setLiked(false);
  };

  const handlePrevious = () => {
    setCurrentReel((prev) => (prev - 1 + reels.length) % reels.length);
    setLiked(false);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleVideoEnded = () => {
    console.log('Video ended, advancing to next reel');
    handleNext();
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preload next video
  useEffect(() => {
    if (preloadVideoRef.current && nextReelData) {
      preloadVideoRef.current.src = nextReelData.videoUrl;
      preloadVideoRef.current.load();
    }
  }, [nextReelData]);

  // Instant video switching with preloaded content
  useEffect(() => {
    if (videoRef.current && currentReelData) {
      // If we have a preloaded video for this reel, use it
      const isNextReel = currentReel === (initialIndex + 1) % reels.length;
      
      if (isNextReel && preloadVideoRef.current && preloadVideoRef.current.readyState >= 3) {
        // Swap the preloaded video to main video
        const tempSrc = videoRef.current.src;
        videoRef.current.src = preloadVideoRef.current.src;
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(console.error);
        
        // Preload the next video
        preloadVideoRef.current.src = tempSrc;
      } else {
        // Normal loading for non-preloaded videos
        videoRef.current.src = currentReelData.videoUrl;
        videoRef.current.currentTime = 0;
        
        // Check if video is ready to play
        if (videoRef.current.readyState >= 3) {
          videoRef.current.play().catch(console.error);
        } else {
          const handleCanPlay = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
              videoRef.current.removeEventListener('canplay', handleCanPlay);
            }
          };
          videoRef.current.addEventListener('canplay', handleCanPlay);
        }
      }
    }
  }, [currentReel, currentReelData]);

  return {
    currentReel,
    setCurrentReel,
    currentReelData,
    nextReelData,
    isMuted,
    setIsMuted,
    liked,
    setLiked,
    videoRef,
    preloadVideoRef,
    handleNext,
    handlePrevious,
    handleLike,
    handleVideoEnded
  };
};
