
import React from 'react';
import { Play } from 'lucide-react';

interface VideoIconProps {
  className?: string;
}

const VideoIcon = ({ className }: VideoIconProps) => (
  <Play className={className} size={20} />
);

export default VideoIcon;
