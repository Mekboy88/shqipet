
import React from 'react';
import { Play } from 'lucide-react';

interface VideoOverlayProps {
  size?: 'small' | 'medium' | 'large';
}

const VideoOverlay: React.FC<VideoOverlayProps> = ({ size = 'medium' }) => {
  // Different sizes for different grid positions
  const sizeClasses = {
    small: {
      wrapper: 'w-6 h-6',
      icon: 'w-3 h-3'
    },
    medium: {
      wrapper: 'w-10 h-10',
      icon: 'w-5 h-5'
    },
    large: {
      wrapper: 'w-12 h-12',
      icon: 'w-6 h-6'
    }
  };
  
  const { wrapper, icon } = sizeClasses[size];
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all">
      <div className={`${wrapper} rounded-full bg-black bg-opacity-60 flex items-center justify-center`}>
        <Play className={`${icon} text-white`} fill="white" />
      </div>
    </div>
  );
};

export default VideoOverlay;
