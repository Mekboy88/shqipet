
import React from 'react';

interface Reel {
  id: string;
  videoUrl: string;
  thumbnail: string;
  creator: string;
  caption: string;
  views: string;
  title: string;
}

interface ReelsNavigationProps {
  reels: Reel[];
  currentReel: number;
  onReelSelect: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ReelsNavigation: React.FC<ReelsNavigationProps> = ({
  reels,
  currentReel,
  onReelSelect,
  onNext,
  onPrevious
}) => {
  return (
    <>
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {reels.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentReel ? 'bg-white' : 'bg-white/40'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onReelSelect(index);
            }}
          />
        ))}
      </div>

      {/* Navigation arrows positioned at page borders */}
      <button
        className="fixed left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50 w-16 h-16 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
        onClick={onPrevious}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>

      <button
        className="fixed right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-50 w-16 h-16 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
        onClick={onNext}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </>
  );
};

export default ReelsNavigation;
