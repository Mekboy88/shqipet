
import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { videoSources } from "../constants/videoSources";
import { useVideoSettings } from "@/contexts/VideoSettingsContext";

interface VideoSettingsPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  mini?: boolean; // Add mini prop for PiP mode
}

export default function VideoSettingsPanel({
  videoRef,
  mini = false // Default to false for normal mode
}: VideoSettingsPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Use global video settings
  const { settings, updateQuality, updateSpeed, toggleLoop, toggleAutoplay } = useVideoSettings();
  
  // Apply settings to current video when they change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = settings.speed;
      videoRef.current.loop = settings.loop;
    }
  }, [settings.speed, settings.loop, videoRef]);
  // Handle click outside to close settings AND auto-close after 3 seconds (unless hovering)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    const startAutoCloseTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Only start timer if not hovering
      if (!isHovering) {
        timeoutRef.current = setTimeout(() => {
          setShowSettings(false);
        }, 3000);
      }
    };

    if (showSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      startAutoCloseTimer();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showSettings, isHovering]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuality = e.target.value;
    updateQuality(newQuality);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value);
    updateSpeed(newSpeed);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Clear the auto-close timer when hovering
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Restart the auto-close timer when not hovering
    if (showSettings) {
      timeoutRef.current = setTimeout(() => {
        setShowSettings(false);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className={`${
          showSettings 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-black/60 hover:bg-black/80 text-white'
        } ${mini ? 'p-1' : 'p-2'} rounded transition-colors border ${
          showSettings ? 'border-blue-400' : 'border-transparent'
        }`}
        title={showSettings ? "Close Video Settings" : "Open Video Settings"}
      >
        <Settings size={mini ? 10 : 16} className={showSettings ? 'rotate-45 transition-transform' : 'transition-transform'} />
      </button>

      {showSettings && (
        <div 
          ref={settingsRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`absolute ${mini ? 'bottom-[40px]' : 'bottom-[60px]'} right-0 bg-gray-800/90 backdrop-blur-md text-white rounded-xl shadow-xl ${mini ? 'w-[160px] p-2 space-y-2' : 'w-[200px] p-3 space-y-3'} z-50`}
        >
          <div>
            <label className={`block ${mini ? 'text-xs' : 'text-sm'} mb-1`}>Quality</label>
            <select
              value={settings.quality}
              onChange={handleQualityChange}
              className={`w-full bg-black/40 text-white border border-gray-600/50 rounded ${mini ? 'px-1 py-0.5 text-xs' : 'px-2 py-1'} backdrop-blur-sm`}
            >
              {Object.keys(videoSources).map((res) => (
                <option key={res} value={res} className="bg-gray-900/90">{res}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block ${mini ? 'text-xs' : 'text-sm'} mb-1`}>Speed</label>
            <select
              value={settings.speed}
              onChange={handleSpeedChange}
              className={`w-full bg-black/40 text-white border border-gray-600/50 rounded ${mini ? 'px-1 py-0.5 text-xs' : 'px-2 py-1'} backdrop-blur-sm`}
            >
              {[0.25, 0.5, 1, 1.5, 2].map((rate) => (
                <option key={rate} value={rate} className="bg-gray-900/90">{rate}x</option>
              ))}
            </select>
          </div>

          <div className={`flex justify-between items-center ${mini ? 'text-xs' : 'text-sm'}`}>
            <span>Loop</span>
            <input 
              type="checkbox" 
              checked={settings.loop} 
              onChange={toggleLoop}
              className={mini ? 'scale-75' : ''}
            />
          </div>

          <div className={`flex justify-between items-center ${mini ? 'text-xs' : 'text-sm'}`}>
            <span>Autoplay</span>
            <input 
              type="checkbox" 
              checked={settings.autoplay} 
              onChange={toggleAutoplay}
              className={mini ? 'scale-75' : ''}
            />
          </div>
        </div>
      )}
    </div>
  );
}
