import { useState, useEffect, useRef } from "react";
import VideoProgressBar from "./components/VideoProgressBar";
import VideoControls from "./components/VideoControls";
import VideoPlayerControls from "./components/VideoPlayerControls";
import { useVideoSettings } from "@/contexts/VideoSettingsContext";
import { useVideoAutoPlay } from "@/hooks/useVideoAutoPlay";
import { validateVideoBeforePlayback, isApprovedVideoSource } from "@/utils/videoSecurity";
import { useVideoThumbnail } from "@/hooks/useVideoThumbnail";

interface FeedVideoPlayerProps {
  src: string;
  className?: string;
  disableScrollPause?: boolean;
  onPictureInPicture?: () => void;
  showPipOverlay?: boolean;
  onClick?: () => void;
}

export default function FeedVideoPlayer({ src, className = "", disableScrollPause = false, onPictureInPicture, showPipOverlay = false, onClick }: FeedVideoPlayerProps) {
  const { settings, activeVideoId, setActiveVideo } = useVideoSettings();
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('720p (HD)');
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [volume, setVolume] = useState(1);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  
  // Use video thumbnail hook to generate poster image
  const { thumbnail } = useVideoThumbnail(src);
  const videoId = `feed-video-${src.split('/').pop()?.replace(/\.[^/.]+$/, '')}`;

  // Start with skeleton visible instantly
  useEffect(() => {
    setVideoLoaded(false); // Always start with skeleton
  }, [src]);
  useVideoAutoPlay({
    videoRef,
    threshold: 0.8,
    disableScrollPause: disableScrollPause || showPipOverlay,
    onPlay: () => {
      // Don't auto-play if user has manually paused
      if (manuallyPaused) {
        console.log('Video centered but manually paused - skipping autoplay:', src);
        return;
      }
      
      console.log('Video centered and auto-playing:', src);
      setIsPlaying(true);
      setHasStartedPlaying(true);
      setActiveVideo(videoId);
      
      // Unmute when playing
      if (videoRef.current) {
        videoRef.current.muted = settings.globalMuted || (activeVideoId !== null && activeVideoId !== videoId);
      }
      
      // Trigger actual video play - always play when centered, handle mute separately
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    },
    onPause: () => {
      console.log('Video no longer centered, pausing:', src);
      setIsPlaying(false);
      
      // Properly pause the video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
        console.log('Video paused at time:', videoRef.current.currentTime);
      }
    }
  });

  // Apply video settings and manage active video
  useEffect(() => {
    if (videoRef.current) {
      // Set video ID for global management
      videoRef.current.setAttribute('data-video-id', videoId);
      
      // Apply global mute state: muted if globally muted OR if this isn't the active video
      const shouldBeMuted = settings.globalMuted || (activeVideoId !== null && activeVideoId !== videoId);
      videoRef.current.muted = shouldBeMuted;
      
      console.log(`Video ${videoId} mute state: ${shouldBeMuted} (global: ${settings.globalMuted}, active: ${activeVideoId})`);
    }
  }, [settings.globalMuted, activeVideoId, videoId]);

  // Effect to ensure manually paused videos stay completely paused
  useEffect(() => {
    if (!manuallyPaused || !videoRef.current) return;
    
    const video = videoRef.current;
    
    // Aggressive pause enforcement without changing currentTime
    const enforcePause = () => {
      if (!video.paused) {
        video.pause();
      }
    };
    
    // Set up interval to ensure video stays paused
    const pauseInterval = setInterval(enforcePause, 50); // Check every 50ms
    
    return () => {
      clearInterval(pauseInterval);
    };
  }, [manuallyPaused]);

  // Pause main video when PiP overlay is showing
  useEffect(() => {
    if (videoRef.current && showPipOverlay) {
      videoRef.current.pause();
      setIsPlaying(false);
      console.log('PiP overlay active - pausing main video');
    }
  }, [showPipOverlay]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (!isPlaying) {
      // User manually playing - resume from current position
      setManuallyPaused(false);
      
      video.play().then(() => {
        setHasStartedPlaying(true);
        setIsPlaying(true);
        console.log('Video resumed from time:', video.currentTime);
      }).catch((error) => {
        console.log("Video play failed:", error);
      });
    } else {
      // User manually pausing - stop instantly without visual glitches
      setManuallyPaused(true);
      setIsPlaying(false);
      video.pause();
      video.muted = true;
      
      console.log('Manual pause - video stopped cleanly');
    }
  };

  const togglePictureInPicture = async () => {
    // Use our custom PiP window instead of browser's native PiP
    if (onPictureInPicture) {
      console.log('Triggering custom PiP window with current time:', currentTime);
      // Store current video time for synchronization
      if (videoRef.current) {
        const videoData = {
          src,
          currentTime: videoRef.current.currentTime,
          isPlaying,
          isMuted: settings.globalMuted
        };
        sessionStorage.setItem('pipVideoData', JSON.stringify(videoData));
      }
      onPictureInPicture();
    } else {
      console.log('No custom PiP callback provided, skipping PiP');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const handleLoopToggle = () => {
    const newLoop = !loop;
    setLoop(newLoop);
    if (videoRef.current) {
      videoRef.current.loop = newLoop;
    }
  };

  const handleAutoplayToggle = () => {
    setAutoplay(!autoplay);
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    setShowControls(false);
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Always trigger onClick when video is clicked, just like photos
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`relative w-full h-full ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
    >
      {/* Very light loading skeleton overlay - minimal and fast */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-20 bg-muted/30 animate-pulse flex items-center justify-center">
          <div className="text-xs text-muted-foreground opacity-60">Duke ngarkuar...</div>
        </div>
      )}

      {/* PiP Overlay */}
      {showPipOverlay && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                <rect x="14" y="14" width="4" height="4" rx="1"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Luhet në PiP</h3>
            <p className="text-gray-300">Video po luhet në dritaren e vogël</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundColor: 'transparent',
          objectFit: 'cover',
          display: 'block',
          filter: 'none',
          transition: 'opacity 0.3s ease-in-out',
          visibility: 'visible'
        }}
        loop={loop}
        playsInline
        controls={false}
        preload="metadata"
        muted={true}
        autoPlay={false}
        poster={thumbnail}
        data-disable-scroll-pause={disableScrollPause}
        data-feed-video="true"
        onPlay={() => {
          // CRITICAL SECURITY CHECK: Validate video source before allowing playback
          if (!validateVideoBeforePlayback(videoRef.current!)) {
            console.error('🚫 SECURITY: Blocked unauthorized video playback');
            return;
          }
          
          setIsPlaying(true);
          setHasStartedPlaying(true);
          console.log('✅ SECURITY: Authorized video started playing:', src, 'Global muted:', settings.globalMuted);
          
          // Set this video as the active one when it starts playing
          setActiveVideo(videoId);
          
          // Handle mute state: only unmute if global is unmuted AND this is centered
          if (!settings.globalMuted && videoRef.current) {
            console.log('Global is unmuted - unmuting this active video');
            
            // Unmute this video immediately
            videoRef.current.muted = false;
            
            // Mute all other videos immediately
            const allVideos = document.querySelectorAll('video');
            allVideos.forEach(video => {
              if (video !== videoRef.current) {
                video.muted = true;
              }
            });
          } else {
            // Global is muted OR not centered - keep this video muted
            if (videoRef.current) {
              videoRef.current.muted = true;
            }
            console.log('Keeping video muted - global muted:', settings.globalMuted);
          }
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => {
          const video = e.target as HTMLVideoElement;
          const percent = (video.currentTime / video.duration) * 100;
          setProgress(percent || 0);
          setCurrentTime(video.currentTime);
        }}
        onLoadedMetadata={(e) => {
          const video = e.target as HTMLVideoElement;
          
          // CRITICAL SECURITY CHECK: Final validation on video load
          if (!isApprovedVideoSource(src)) {
            console.error('🚫 SECURITY CRITICAL: Unauthorized video source detected on load:', src);
            video.pause();
            video.removeAttribute('src');
            video.load();
            return;
          }
          
          setDuration(video.duration);
          setVideoLoaded(true); // Video is ready, hide skeleton
          
          // Always start muted - audio only enabled when playing and globally unmuted
          video.muted = true;
          video.volume = volume;
          
          // Upgrade preload for better performance once metadata is loaded
          video.preload = 'auto';
          
          console.log(`✅ SECURITY: Approved video loaded with first frame ready: ${src}, Starting muted, Global muted: ${settings.globalMuted}`);
        }}
        onError={(e) => {
          console.error('Video loading error:', e);
          console.error('Failed video src:', src);
          setVideoLoaded(true); // Hide skeleton even on error
        }}
        onLoadStart={() => {
          console.log('Video load started:', src);
          setVideoLoaded(false); // Show skeleton while loading
        }}
        onCanPlay={() => {
          console.log('Video can play - all frames ready:', src);
          setVideoLoaded(true); // Video ready, hide skeleton
        }}
        onLoadedData={() => {
          console.log('Video data loaded - buffering complete:', src);
          setVideoLoaded(true); // Data loaded, hide skeleton
        }}
      />
      
      {showControls && (
        <>
          <VideoProgressBar 
            progress={progress} 
            currentTime={currentTime}
            duration={duration}
            videoRef={{ current: videoRef.current }}
            formatTime={formatTime}
          />

          <VideoControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            videoRef={{ current: videoRef.current }}
            onPlayPause={togglePlayPause}
            onPictureInPicture={togglePictureInPicture}
            formatTime={formatTime}
          />

          <VideoPlayerControls
            volume={volume}
            videoRef={{ current: videoRef.current }}
            onVolumeChange={handleVolumeChange}
            onPictureInPicture={togglePictureInPicture}
            videoId={videoId}
          />
        </>
      )}
    </div>
  );
}
