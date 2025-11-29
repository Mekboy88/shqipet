
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Minimize2, Maximize2 } from 'lucide-react';
import VideoSettingsMenu from './VideoSettingsMenu';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  showControls: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onTogglePiP: () => void;
  onToggleFullscreen: () => void;
  formatTime: (time: number) => string;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  showControls,
  onTogglePlay,
  onToggleMute,
  onTogglePiP,
  onToggleFullscreen,
  formatTime
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleMute();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePlay();
  };

  const handlePiPClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePiP();
  };

  const handleFullscreenClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFullscreen();
  };

  return (
    <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={handlePlayClick}
            className="bg-white/20 hover:bg-white/30 rounded-full p-4 md:p-6 transition-all"
          >
            <Play size={32} className="md:w-12 md:h-12 text-white" />
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 md:p-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              onClick={handlePlayClick}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? (
                <Pause size={20} className="md:w-7 md:h-7" />
              ) : (
                <Play size={20} className="md:w-7 md:h-7" />
              )}
            </button>
            
            <div className="text-white text-sm md:text-lg font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-6">
            <button 
              onClick={handleMuteClick}
              className="text-white hover:text-gray-300 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={20} className="md:w-7 md:h-7" />
              ) : (
                <Volume2 size={20} className="md:w-7 md:h-7" />
              )}
            </button>
            
            <VideoSettingsMenu
              isOpen={showSettings}
              onToggle={() => setShowSettings(!showSettings)}
              onClose={() => setShowSettings(false)}
            />
            
            <button 
              onClick={handlePiPClick}
              className="text-white hover:text-gray-300 transition-colors" 
              title="Picture-in-Picture"
            >
              <Minimize2 size={20} className="md:w-7 md:h-7" />
            </button>
            
            <button 
              onClick={handleFullscreenClick}
              className="text-white hover:text-gray-300 transition-colors" 
              title="Fullscreen"
            >
              <Maximize2 size={20} className="md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
