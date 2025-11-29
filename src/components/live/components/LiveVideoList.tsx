import React, { forwardRef } from "react";
import { LiveVideo } from "../types";
import LiveVideoCard from "./LiveVideoCard";
import NavigationButtons from "./NavigationButtons";

interface LiveVideoListProps {
  videos: LiveVideo[];
  showLeftButton: boolean;
  isHovering: boolean;
  onScroll: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

const LiveVideoList = forwardRef<HTMLDivElement, LiveVideoListProps>(({
  videos,
  showLeftButton,
  isHovering,
  onScroll,
  onScrollLeft,
  onScrollRight
}, ref) => {
  return (
    <div className="relative">
      <NavigationButtons 
        showLeftButton={showLeftButton} 
        isHovering={isHovering} 
        onScrollLeft={onScrollLeft} 
        onScrollRight={onScrollRight} 
      />
      
      <div 
        ref={ref} 
        onScroll={onScroll}
        className="overflow-x-auto pb-4 -mx-1 px-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
      >
        <div className="flex space-x-2">
          {videos.slice(0, 16).map(video => (
            <div key={video.id} className="flex-shrink-0 w-1/2">
              <LiveVideoCard video={video} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

LiveVideoList.displayName = "LiveVideoList";
export default LiveVideoList;
