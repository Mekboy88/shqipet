
import { useState, useRef, useEffect } from 'react';

export const useVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPiP, setShowPiP] = useState(() => {
    return localStorage.getItem('pipActive') === 'true';
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showMainProgress, setShowMainProgress] = useState(false);

  // Progress bar hover states
  const [isHoveringMainProgress, setIsHoveringMainProgress] = useState(false);
  const [isHoveringPipProgress, setIsHoveringPipProgress] = useState(false);
  const [mainProgressHoverX, setMainProgressHoverX] = useState(0);
  const [pipProgressHoverX, setPipProgressHoverX] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [pipHoverTime, setPipHoverTime] = useState(0);
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingPip, setIsDraggingPip] = useState(false);

  // Video refs
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const mainProgressRef = useRef<HTMLDivElement>(null);
  const pipProgressRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const syncVideoTime = () => {
    const activeVideo = showPiP ? pipVideoRef.current : mainVideoRef.current;
    const inactiveVideo = showPiP ? mainVideoRef.current : pipVideoRef.current;
    
    if (activeVideo && inactiveVideo) {
      setCurrentTime(activeVideo.currentTime);
      inactiveVideo.currentTime = activeVideo.currentTime;
    }
  };

  const togglePlay = () => {
    const activeVideo = showPiP ? pipVideoRef.current : mainVideoRef.current;
    if (activeVideo) {
      if (isPlaying) {
        activeVideo.pause();
        setIsPlaying(false);
      } else {
        console.log('🎬 Playing video, ensuring proper audio state');
        
        // CRITICAL: When playing, check if globally unmuted to enable sound
        if (!isMuted) {
          console.log('🎵 Global unmute is active, unmuting this video');
          activeVideo.muted = false;
          
          // Mute all other videos
          const allVideos = document.querySelectorAll('video');
          allVideos.forEach(video => {
            if (video !== activeVideo) {
              video.muted = true;
            }
          });
        } else {
          activeVideo.muted = true;
        }
        
        activeVideo.play().catch(error => {
          console.log("Video play failed:", error);
        });
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    const mainVideo = mainVideoRef.current;
    const pipVideo = pipVideoRef.current;
    
    if (mainVideo && pipVideo) {
      const newMutedState = !isMuted;
      
      // INSTANT RESPONSE: Update video elements immediately
      mainVideo.muted = newMutedState;
      pipVideo.muted = newMutedState;
      
      setIsMuted(newMutedState);
      
      console.log('🎵 INSTANT: Video mute toggled to:', newMutedState);
      
      // If unmuting, set the active video as the currently playing one and mute others
      if (!newMutedState) {
        const activeVideo = showPiP ? pipVideo : mainVideo;
        const activeVideoId = activeVideo.getAttribute('data-video-id') || 'main-video';
        
        // Mute all other videos on the page instantly
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((video, index) => {
          const videoId = video.getAttribute('data-video-id') || `video-${index}`;
          if (video !== mainVideo && video !== pipVideo) {
            video.muted = true;
          }
        });
        console.log('🔇 Muted all other videos on page');
      }
    }
  };

  const togglePiP = async () => {
    // Store current video state before switching
    const activeVideo = showPiP ? pipVideoRef.current : mainVideoRef.current;
    if (activeVideo) {
      sessionStorage.setItem('pipVideoData', JSON.stringify({
        currentTime: activeVideo.currentTime,
        isPlaying: !activeVideo.paused,
        isMuted: activeVideo.muted
      }));
    }
    
    syncVideoTime();
    const newPipState = !showPiP;
    
    setShowPiP(newPipState);
    localStorage.setItem('pipActive', newPipState.toString());
    
    // Improved video transition for seamless experience
    setTimeout(() => {
      const activeVideo = newPipState ? pipVideoRef.current : mainVideoRef.current;
      const inactiveVideo = newPipState ? mainVideoRef.current : pipVideoRef.current;
      
      if (activeVideo && inactiveVideo) {
        // Restore video state from session storage
        const storedData = sessionStorage.getItem('pipVideoData');
        if (storedData) {
          try {
            const videoData = JSON.parse(storedData);
            activeVideo.currentTime = videoData.currentTime;
            activeVideo.muted = videoData.isMuted;
            
            if (videoData.isPlaying) {
              activeVideo.play().catch(error => {
                console.log("Video play failed:", error);
              });
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
            
            console.log('🔄 Restored video state:', videoData);
          } catch (error) {
            console.error('Error restoring video state:', error);
            // Fallback to sync
            activeVideo.currentTime = currentTime;
            activeVideo.muted = isMuted;
          }
        } else {
          // Fallback sync
          activeVideo.currentTime = currentTime;
          activeVideo.muted = isMuted;
        }
        
        // Always pause the inactive video
        inactiveVideo.pause();
        
        console.log('Video transition completed. PiP state:', newPipState);
      }
    }, 100);
  };

  const toggleFullscreen = () => {
    const video = mainVideoRef.current;
    if (video && video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  // Sync mute state when videos are loaded and add event listeners
  useEffect(() => {
    if (mainVideoRef.current && pipVideoRef.current) {
      mainVideoRef.current.muted = isMuted;
      pipVideoRef.current.muted = isMuted;
      
      // Add play event listeners to auto-unmute when playing
      const handleMainVideoPlay = () => {
        if (!isMuted && mainVideoRef.current) {
          console.log('🎵 Main video started playing, auto-unmuting');
          mainVideoRef.current.muted = false;
          
          // Mute all other videos
          const allVideos = document.querySelectorAll('video');
          allVideos.forEach(video => {
            if (video !== mainVideoRef.current) {
              video.muted = true;
            }
          });
        }
      };
      
      const handlePipVideoPlay = () => {
        if (!isMuted && pipVideoRef.current) {
          console.log('🎵 PiP video started playing, auto-unmuting');
          pipVideoRef.current.muted = false;
          
          // Mute all other videos
          const allVideos = document.querySelectorAll('video');
          allVideos.forEach(video => {
            if (video !== pipVideoRef.current) {
              video.muted = true;
            }
          });
        }
      };
      
      mainVideoRef.current.addEventListener('play', handleMainVideoPlay);
      pipVideoRef.current.addEventListener('play', handlePipVideoPlay);
      
      return () => {
        if (mainVideoRef.current) {
          mainVideoRef.current.removeEventListener('play', handleMainVideoPlay);
        }
        if (pipVideoRef.current) {
          pipVideoRef.current.removeEventListener('play', handlePipVideoPlay);
        }
      };
    }
  }, [isMuted]);

  return {
    // State
    isPlaying,
    isMuted,
    showPiP,
    currentTime,
    duration,
    showControls,
    showMainProgress,
    isHoveringMainProgress,
    isHoveringPipProgress,
    mainProgressHoverX,
    pipProgressHoverX,
    hoverTime,
    pipHoverTime,
    isDraggingMain,
    isDraggingPip,
    
    // Refs
    mainVideoRef,
    pipVideoRef,
    mainProgressRef,
    pipProgressRef,
    
    // Actions
    setIsPlaying,
    setIsMuted,
    setShowPiP,
    setCurrentTime,
    setDuration,
    setShowControls,
    setShowMainProgress,
    setIsHoveringMainProgress,
    setIsHoveringPipProgress,
    setMainProgressHoverX,
    setPipProgressHoverX,
    setHoverTime,
    setPipHoverTime,
    setIsDraggingMain,
    setIsDraggingPip,
    
    // Functions
    formatTime,
    syncVideoTime,
    togglePlay,
    toggleMute,
    togglePiP,
    toggleFullscreen
  };
};
