
import React from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  isHovering: boolean;
  isDragging: boolean;
  hoverTime: number;
  hoverX: number;
  progressRef: React.RefObject<HTMLDivElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown: () => void;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
  className?: string;
  showOnHover?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  isHovering,
  isDragging,
  hoverTime,
  hoverX,
  progressRef,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onMouseDown,
  onClick,
  formatTime,
  className = "",
  showOnHover = false
}) => {
  // Always use currentTime for progress display, only use hoverTime for preview
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // For hover preview, show where we would seek to
  const hoverProgressPercentage = duration > 0 ? (hoverTime / duration) * 100 : 0;

  return null;
};

export default ProgressBar;
