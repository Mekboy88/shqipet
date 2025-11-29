
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface ReelsVideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  thumbnail: string;
  isMuted: boolean;
  onMuteToggle: () => void;
  onVideoEnded: () => void;
  onNext: () => void;
}

const ReelsVideoPlayer: React.FC<ReelsVideoPlayerProps> = ({
  videoRef,
  videoUrl,
  thumbnail,
  isMuted,
  onMuteToggle,
  onVideoEnded,
  onNext
}) => {
  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div 
      className="w-full h-full relative cursor-pointer"
      onClick={onNext}
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop={false}
          muted={isMuted}
          playsInline
          preload="auto"
          onEnded={onVideoEnded}
          onClick={handleVideoClick}
          onCanPlay={() => {
            // Ensure video plays as soon as it can
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(console.error);
            }
          }}
        />
      ) : (
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
      )}
      
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      
      {/* Mute/Unmute button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 text-white hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
    </div>
  );
};

export default ReelsVideoPlayer;
