import React, { useEffect, useRef } from 'react';
import { useBreakpoint } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import LeftSidebarContent from './LeftSidebarContent';
import ReelsViewer from '@/components/reels/ReelsViewer';
import { useLeftSidebarConsole } from './hooks/useLeftSidebarConsole';
interface LeftSidebarContainerProps {
  showReelsViewer: boolean;
  onCloseReelsViewer: () => void;
  reels: any[];
}
const LeftSidebarContainer: React.FC<LeftSidebarContainerProps> = ({
  showReelsViewer,
  onCloseReelsViewer,
  reels
}) => {
  const {
    isLaptopOrLarger
  } = useBreakpoint();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Enable console controls for left sidebar positioning
  useLeftSidebarConsole();

  // Hide sidebar on mobile and tablet, show only on laptop and larger
  if (!isLaptopOrLarger) {
    return null;
  }

  // Check if we're on the watch page
  const isWatchPage = location.pathname === '/watch';
  return <>
      {/* Responsive sidebar content - positioned differently on watch page */}
      <div ref={sidebarRef} className={`h-full overflow-hidden ${isWatchPage ? 'fixed left-[calc(50%-620px)] top-[80px] w-[260px] h-[calc(100vh-100px)] z-30' : 'w-full'}`} style={{
      pointerEvents: 'auto',
      overflow: 'hidden' // Prevent internal scrolling
    }}>
        <div className="h-full w-full overflow-y-auto my-0 mx-0 px-0 py-0">
          <LeftSidebarContent />
        </div>
      </div>

      {/* Reels Viewer Modal */}
      {showReelsViewer && <ReelsViewer reels={reels} initialIndex={0} onClose={onCloseReelsViewer} />}
    </>;
};
export default LeftSidebarContainer;