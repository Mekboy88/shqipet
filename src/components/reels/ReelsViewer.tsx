
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReelsViewerState } from './hooks/useReelsViewerState';
import ReelsVideoPlayer from './components/ReelsVideoPlayer';
import ReelsContent from './components/ReelsContent';
import ReelsActionButtons from './components/ReelsActionButtons';
import ReelsNavigation from './components/ReelsNavigation';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  caption: string;
  views: string;
  title: string;
}

interface ReelsViewerProps {
  reels: Reel[];
  initialIndex: number;
  onClose: () => void;
}

const ReelsViewer: React.FC<ReelsViewerProps> = ({ reels, initialIndex, onClose }) => {
  const {
    currentReel,
    setCurrentReel,
    currentReelData,
    nextReelData,
    isMuted,
    setIsMuted,
    liked,
    setLiked,
    videoRef,
    preloadVideoRef,
    handleNext,
    handlePrevious,
    handleLike,
    handleVideoEnded
  } = useReelsViewerState(reels, initialIndex, onClose);

  const handleReelSelect = (index: number) => {
    setCurrentReel(index);
    setLiked(false);
  };

  if (!currentReelData) return null;

  return (
    <div 
      className="fixed bg-black z-[9999]" 
      style={{ 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20 z-[10000]"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Main video container - Full screen */}
      <div className="relative w-full h-full max-w-md bg-black mx-auto flex flex-col">
        <ReelsVideoPlayer
          videoRef={videoRef}
          videoUrl={currentReelData.videoUrl}
          thumbnail={currentReelData.thumbnail}
          isMuted={isMuted}
          onMuteToggle={() => setIsMuted(!isMuted)}
          onVideoEnded={handleVideoEnded}
          onNext={handleNext}
        />
        
        {/* Hidden preload video */}
        {nextReelData && (
          <video
            ref={preloadVideoRef}
            src={nextReelData.videoUrl}
            className="hidden"
            muted={isMuted}
            preload="auto"
          />
        )}

        <ReelsContent
          creator={currentReelData.creator}
          caption={currentReelData.caption}
        />

        <ReelsActionButtons
          liked={liked}
          views={currentReelData.views}
          onLike={handleLike}
        />

        <ReelsNavigation
          reels={reels}
          currentReel={currentReel}
          onReelSelect={handleReelSelect}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
};

export default ReelsViewer;
