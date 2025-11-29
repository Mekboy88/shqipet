import React, { createContext, useContext, useState, useEffect } from 'react';

interface VideoSettings {
  quality: string;
  speed: number;
  loop: boolean;
  autoplay: boolean;
  globalMuted: boolean;
}

interface VideoSettingsContextType {
  settings: VideoSettings;
  activeVideoId: string | null;
  modalVideoId: string | null;
  updateQuality: (quality: string) => void;
  updateSpeed: (speed: number) => void;
  toggleLoop: () => void;
  toggleAutoplay: () => void;
  toggleGlobalMute: () => void;
  setActiveVideo: (videoId: string | null) => void;
  setModalVideo: (videoId: string | null) => void;
}

const VideoSettingsContext = createContext<VideoSettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: VideoSettings = {
  quality: '720p (HD)',
  speed: 1,
  loop: true,
  autoplay: true,
  globalMuted: true,
};

export const VideoSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Track which video should be audible
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  // Track modal video for priority system
  const [modalVideoId, setModalVideoId] = useState<string | null>(null);
  
  // Load settings from localStorage or use defaults
  const [settings, setSettings] = useState<VideoSettings>(() => {
    try {
      const saved = localStorage.getItem('globalVideoSettings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('globalVideoSettings', JSON.stringify(settings));
    console.log('🔄 Global video settings updated:', settings);
    
    // Apply settings to ALL video elements in the page
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video, index) => {
      const videoId = video.getAttribute('data-video-id') || `video-${index}`;
      video.playbackRate = settings.speed;
      video.loop = settings.loop;
      
      // Only the active video should be unmuted, all others muted
      if (settings.globalMuted) {
        video.muted = true;
      } else {
        video.muted = videoId !== activeVideoId;
        
        // Set the first visible playing video as active if none is set
        if (!activeVideoId && !video.paused && video.currentTime > 0) {
          console.log('🎵 Auto-setting active video:', videoId);
          setActiveVideoId(videoId);
        }
      }
    });
  }, [settings, activeVideoId]);

  const updateQuality = (quality: string) => {
    setSettings(prev => ({ ...prev, quality }));
    console.log('🎥 Quality changed globally to:', quality);
  };

  const updateSpeed = (speed: number) => {
    setSettings(prev => ({ ...prev, speed }));
    console.log('⚡ Speed changed globally to:', speed);
  };

  const toggleLoop = () => {
    setSettings(prev => ({ ...prev, loop: !prev.loop }));
    console.log('🔄 Loop toggled globally to:', !settings.loop);
  };

  const toggleAutoplay = () => {
    setSettings(prev => ({ ...prev, autoplay: !prev.autoplay }));
    console.log('▶️ Autoplay toggled globally to:', !settings.autoplay);
  };

  const toggleGlobalMute = () => {
    setSettings(prev => ({ ...prev, globalMuted: !prev.globalMuted }));
    console.log('🔇 Global mute toggled to:', !settings.globalMuted);
  };

  const setActiveVideo = (videoId: string | null) => {
    // Don't allow feed videos to become active when modal has priority
    if (modalVideoId && videoId !== modalVideoId && videoId !== null) {
      console.log('🚫 Blocking feed video from becoming active due to modal priority:', videoId, 'modal:', modalVideoId);
      return;
    }
    console.log('🎵 Active video changed to:', videoId);
    setActiveVideoId(videoId);
  };

  const setModalVideo = (videoId: string | null) => {
    console.log('🎭 Modal video priority changed to:', videoId);
    setModalVideoId(videoId);
    if (videoId) {
      // When modal takes priority, it also becomes the active video
      setActiveVideoId(videoId);
    }
  };

  return (
    <VideoSettingsContext.Provider
      value={{
        settings,
        activeVideoId,
        modalVideoId,
        updateQuality,
        updateSpeed,
        toggleLoop,
        toggleAutoplay,
        toggleGlobalMute,
        setActiveVideo,
        setModalVideo,
      }}
    >
      {children}
    </VideoSettingsContext.Provider>
  );
};

export const useVideoSettings = () => {
  const context = useContext(VideoSettingsContext);
  if (context === undefined) {
    throw new Error('useVideoSettings must be used within a VideoSettingsProvider');
  }
  return context;
};