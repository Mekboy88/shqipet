

import { Play, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  onPlayPause: () => void;
  onPictureInPicture: () => void;
  formatTime: (time: number) => string;
}

export default function VideoControls({
  isPlaying,
  currentTime,
  duration,
  progress,
  videoRef,
  onPlayPause,
  onPictureInPicture,
  formatTime
}: VideoControlsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showMiniPiP, setShowMiniPiP] = useState(false);
  const [pipPosition, setPipPosition] = useState({ x: 0, y: 0 });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  // Sync mini PiP video with hover time
  useEffect(() => {
    if (pipVideoRef.current && videoRef.current && showMiniPiP) {
      pipVideoRef.current.currentTime = hoverTime;
    }
  }, [hoverTime, showMiniPiP]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const time = (percent / 100) * duration;
    
    setHoverTime(time);
    // Position the PiP just above the progress bar
    setPipPosition({ x: e.clientX, y: rect.top - 160 });
    
    if (isDragging) {
      handleSeek(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSeek = (e: React.MouseEvent) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const time = (percent / 100) * duration;
    
    videoRef.current.currentTime = time;
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
    setShowMiniPiP(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setShowMiniPiP(false);
    setIsDragging(false);
  };

  const displayTime = isDragging ? hoverTime : (showTooltip ? hoverTime : currentTime);
  const displayProgress = isDragging ? (hoverTime / duration) * 100 : progress;

  return (
    <div 
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
    >
      {/* Mini PiP Window - positioned just above the progress bar with full video visible and no empty sides */}
      {showMiniPiP && videoRef.current && (
        <div
          className="fixed transform -translate-x-1/2 bg-black rounded-lg overflow-hidden shadow-lg border border-gray-600 pointer-events-none z-50"
          style={{ 
            left: `${pipPosition.x}px`,
            top: `${pipPosition.y}px`,
            width: '80px',
            height: '140px'
          }}
        >
          <video
            ref={pipVideoRef}
            className="w-full h-full object-contain"
            src={videoRef.current.src}
            muted
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.currentTime = hoverTime;
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
            <div className="text-white text-xs text-center">
              {formatTime(hoverTime)}
            </div>
          </div>
        </div>
      )}

      <div 
        className="flex items-center gap-3 w-full pr-32"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
      >
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
          }}
          className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors flex-shrink-0"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Time Display */}
        <div 
          className="bg-black/70 text-white px-2 py-1 rounded text-sm font-medium flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* Progress Bar with Extended Hover Area - takes up remaining space with padding */}
        <div className="flex-1 min-w-0">
          {/* Extended hover area that goes above and below the progress bar */}
          <div 
            className="relative cursor-pointer group py-2"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e);
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
          >
            <div 
              ref={progressBarRef}
              className="relative h-1 bg-gray-600 rounded overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 h-full bg-red-400 transition-all duration-150"
                style={{ width: `${displayProgress}%` }}
              />
              
              {/* Draggable handle */}
              <div 
                className="absolute top-1/2 w-2 h-2 bg-red-400 rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${displayProgress}%` }}
              />
              
              {/* Time tooltip */}
              {(showTooltip || isDragging) && (
                <div
                  className="absolute -top-8 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50"
                  style={{ left: `${isDragging ? (hoverTime / duration) * 100 : (hoverTime / duration) * 100}%` }}
                >
                  {formatTime(displayTime)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

