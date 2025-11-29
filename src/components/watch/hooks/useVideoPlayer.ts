import { useEffect, useRef, useState } from "react";
import { videoSources } from "../constants/videoSources";
import { useVideoSettings } from '@/contexts/VideoSettingsContext';

export const useVideoPlayer = (src: string, disableScrollPause: boolean = false) => {
  const { settings, activeVideoId, setActiveVideo, modalVideoId } = useVideoSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(settings.globalMuted);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('720p (HD)');
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [videoUrl, setVideoUrl] = useState(src);
  const [volume, setVolume] = useState(1);
  const videoId = useRef(`video-${Date.now()}-${Math.random()}`).current;

  // Format time helper function
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Intersection observer for autoplay - only if scroll pause is NOT disabled
  useEffect(() => {
    if (disableScrollPause) {
      console.log('Scroll-based video control disabled for PiP');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [disableScrollPause]);

  // Video property effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Only control play/pause based on visibility if scroll pause is not disabled
    if (!disableScrollPause) {
      if (isVisible && autoplay) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
    
    // Don't override mute state here - let global system handle it
    video.loop = loop;
    video.volume = volume;
  }, [isVisible, autoplay, loop, volume, disableScrollPause]);

  // Sync with global settings
  useEffect(() => {
    setIsMuted(settings.globalMuted);
    if (videoRef.current) {
      // Apply global mute state or check if this is the active video
      const shouldBeMuted = settings.globalMuted || (activeVideoId !== videoId);
      videoRef.current.muted = shouldBeMuted;
      console.log(`🎵 Video ${videoId} mute state updated:`, shouldBeMuted);
    }
  }, [settings.globalMuted, activeVideoId, videoId]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      
      // CRITICAL: Respect modal priority - only modal video can control audio when modal has priority
      if (modalVideoId && videoId !== modalVideoId) {
        console.log('🚫 Feed video blocked from audio control due to modal priority:', videoId, 'modal:', modalVideoId);
        // Keep this video muted when modal has priority
        video.muted = true;
        return;
      }
      
      // CRITICAL: Auto-set as active video when playing (only if no modal conflict)
      if (!settings.globalMuted) {
        console.log('🎵 Video started playing, setting as active:', videoId);
        setActiveVideo(videoId);
        
        // Instantly unmute this video and mute others
        video.muted = false;
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((otherVideo, index) => {
          const otherId = otherVideo.getAttribute('data-video-id') || `video-${index}`;
          if (otherVideo !== video && otherId !== videoId) {
            otherVideo.muted = true;
          }
        });
      } else {
        // Global mute is on, keep video muted
        video.muted = true;
      }
    };
    
    const handlePause = () => setIsPlaying(false);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      // Set video ID attribute for global management
      video.setAttribute('data-video-id', videoId);
    };
    const updateProgress = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent || 0);
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", updateProgress);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", updateProgress);
    };
  }, [settings.globalMuted, setActiveVideo, videoId, modalVideoId]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const togglePictureInPicture = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.log('Picture-in-Picture not supported or failed:', error);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    setVideoUrl(videoSources[newQuality]);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const handleLoopToggle = () => {
    setLoop(!loop);
  };

  const handleAutoplayToggle = () => {
    setAutoplay(!autoplay);
  };

  return {
    videoRef,
    isMuted,
    isPlaying,
    progress,
    currentTime,
    duration,
    quality,
    speed,
    loop,
    autoplay,
    videoUrl,
    volume,
    formatTime,
    togglePlayPause,
    togglePictureInPicture,
    handleMuteToggle,
    handleVolumeChange,
    handleQualityChange,
    handleSpeedChange,
    handleLoopToggle,
    handleAutoplayToggle,
  };
};
