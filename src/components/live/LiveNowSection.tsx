import React, { useRef, useState } from "react";
import LiveSectionHeader from "./components/LiveSectionHeader";
import LiveVideoList from "./components/LiveVideoList";
import LiveVideoGrid from "./components/LiveVideoGrid";
import { useLocalization } from '@/hooks/useLocalization';
import { liveVideos } from './data/liveVideosData';
import "./styles/index.css";

const LiveNowSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [gridLayout, setGridLayout] = useState<"1x1" | "2x2" | "3x3" | "4x4">("1x1");
  const { t } = useLocalization();

  const scrollVideos = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Increased scroll amount for larger cards (approximately one card width)
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      if (direction === 'right') {
        setShowLeftButton(true);
      }
      if (direction === 'left' && scrollContainerRef.current.scrollLeft + scrollAmount <= 0) {
        setShowLeftButton(false);
      }
    }
  };
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
    }
  };
  const getGridClass = () => {
    switch (gridLayout) {
      case "2x2":
        return "grid-layout-2x2";
      case "3x3":
        return "grid-layout-3x3";
      case "4x4":
        return "grid-layout-4x4";
      default:
        return "";
    }
  };
  return <div data-horizontal-scroll="true" className="p-0 m-0 leading-none" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} style={{
    overscrollBehaviorX: 'contain'
  }}>
      <LiveSectionHeader gridLayout={gridLayout} setGridLayout={setGridLayout} />
      
      {gridLayout === "1x1" ? <LiveVideoList videos={liveVideos} showLeftButton={showLeftButton} isHovering={isHovering} onScroll={handleScroll} onScrollLeft={() => scrollVideos('left')} onScrollRight={() => scrollVideos('right')} ref={scrollContainerRef} /> : <LiveVideoGrid videos={liveVideos} gridLayout={gridLayout} getGridClass={getGridClass} />}
    </div>;
};
export default LiveNowSection;