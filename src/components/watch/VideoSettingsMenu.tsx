
import React, { useState } from 'react';
import { Settings, Check } from 'lucide-react';

interface VideoSettingsMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const VideoSettingsMenu: React.FC<VideoSettingsMenuProps> = ({
  isOpen,
  onToggle,
  onClose
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [annotations, setAnnotations] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  const playbackSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = ['Auto', '1080p', '720p', '480p', '360p'];

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    // Apply to video element
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.playbackRate = speed;
    });
    console.log(`Playback speed changed to: ${speed}x`);
  };

  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    console.log(`Quality changed to: ${newQuality}`);
    // Note: In a real app, this would trigger a video source change
  };

  const handleAnnotationsToggle = () => {
    const newState = !annotations;
    setAnnotations(newState);
    console.log(`Annotations ${newState ? 'enabled' : 'disabled'}`);
  };

  const handleAutoplayToggle = () => {
    const newState = !autoplay;
    setAutoplay(newState);
    console.log(`Autoplay ${newState ? 'enabled' : 'disabled'}`);
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={handleSettingsClick}
        className="text-white hover:text-gray-300 transition-colors hidden md:block"
        title="Settings"
      >
        <Settings size={20} className="md:w-7 md:h-7" />
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={handleSettingsClick}
        className="text-white hover:text-gray-300 transition-colors hidden md:block"
        title="Settings"
      >
        <Settings size={20} className="md:w-7 md:h-7" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={onClose}
          />
          <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-md shadow-xl border border-gray-700 min-w-44 z-50">
            {/* Playback Speed Section */}
            <div className="p-2 border-b border-gray-700">
              <h4 className="text-white text-xs font-medium mb-1">Speed</h4>
              <div className="space-y-0.5">
                {playbackSpeeds.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
                  >
                    <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
                    {playbackSpeed === speed && (
                      <Check size={12} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Section */}
            <div className="p-2 border-b border-gray-700">
              <h4 className="text-white text-xs font-medium mb-1">Quality</h4>
              <div className="space-y-0.5">
                {qualityOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQualityChange(option)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
                  >
                    <span>{option}</span>
                    {quality === option && (
                      <Check size={12} className="text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="p-2">
              <h4 className="text-white text-xs font-medium mb-1">Options</h4>
              <div className="space-y-0.5">
                <button 
                  onClick={handleAnnotationsToggle}
                  className="w-full flex items-center justify-between px-2 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
                >
                  <span>Annotations</span>
                  <span className={`text-xs ${annotations ? 'text-green-400' : 'text-gray-400'}`}>
                    {annotations ? 'On' : 'Off'}
                  </span>
                </button>
                <button 
                  onClick={handleAutoplayToggle}
                  className="w-full flex items-center justify-between px-2 py-1 text-xs text-white hover:bg-white/20 rounded transition-colors"
                >
                  <span>Autoplay</span>
                  <span className={`text-xs ${autoplay ? 'text-green-400' : 'text-gray-400'}`}>
                    {autoplay ? 'On' : 'Off'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoSettingsMenu;
