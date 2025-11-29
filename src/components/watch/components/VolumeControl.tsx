
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useVideoSettings } from "@/contexts/VideoSettingsContext";

interface VolumeControlProps {
  volume: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onVolumeChange: (volume: number) => void;
  videoId?: string; // Optional video ID for tracking active video
}

export default function VolumeControl({ 
  volume, 
  videoRef, 
  onVolumeChange,
  videoId = "main-video"
}: VolumeControlProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { settings, activeVideoId, toggleGlobalMute, setActiveVideo } = useVideoSettings();

  // Set this video as active when interacting with volume controls
  const handleMuteToggle = () => {
    if (!settings.globalMuted) {
      // If currently unmuted, set this video as active before toggling
      setActiveVideo(videoId); 
    }
    
    // INSTANT RESPONSE: Immediately update the video element for no delay
    if (videoRef.current) {
      const newMutedState = !settings.globalMuted;
      videoRef.current.muted = newMutedState;
      console.log('🎵 INSTANT: Set video muted to:', newMutedState);
      
      // If unmuting, set this as the active video immediately
      if (!newMutedState) {
        setActiveVideo(videoId);
        // Mute all other videos immediately
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach((video, index) => {
          const vId = video.getAttribute('data-video-id') || `video-${index}`;
          if (vId !== videoId) {
            video.muted = true;
          }
        });
      }
    }
    
    // Update global state (this will sync other components)
    toggleGlobalMute();
  };

  // Update video element mute state based on global settings
  useEffect(() => {
    if (videoRef.current) {
      // Add video ID attribute for global management
      videoRef.current.setAttribute('data-video-id', videoId);
      
      // Apply mute state: muted if globally muted OR if this isn't the active video
      videoRef.current.muted = settings.globalMuted || (videoId !== activeVideoId);
    }
  }, [settings.globalMuted, activeVideoId, videoId, videoRef]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    onVolumeChange(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      <button
        onClick={handleMuteToggle}
        className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
      >
        {settings.globalMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      
      {/* Volume Slider: vertical and persistent during interaction */}
      {showVolumeSlider && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-1 h-24 appearance-none bg-red-400 rounded cursor-pointer"
          style={{ 
            WebkitAppearance: 'slider-vertical',
            background: '#f87171',
            accentColor: '#f87171'
          }}
        />
      )}
    </div>
  );
}
