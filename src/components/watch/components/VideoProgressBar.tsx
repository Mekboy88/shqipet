
import React, { useState, useRef } from "react";

interface VideoProgressBarProps {
  progress: number;
  currentTime: number;
  duration: number;
  videoRef: React.RefObject<HTMLVideoElement>;
  formatTime: (time: number) => string;
}

export default function VideoProgressBar({ 
  progress, 
  currentTime, 
  duration, 
  videoRef, 
  formatTime 
}: VideoProgressBarProps) {
  const [showMiniPiP, setShowMiniPiP] = useState(false);
  const [pipPosition, setPipPosition] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Disabled to prevent Chrome slow motion issues
    return;
  };

  const handleMouseEnter = () => {
    // Disabled to prevent Chrome slow motion issues
    return;
  };

  const handleMouseLeave = () => {
    // Disabled to prevent Chrome slow motion issues
    return;
  };

  return (
    <>
      {/* Mini PiP Window - DISABLED to prevent Chrome slow motion issues */}
    </>
  );
}
