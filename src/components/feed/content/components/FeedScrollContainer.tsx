
import React from "react";
interface FeedScrollContainerProps {
  children: React.ReactNode;
  feedContainerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}
const FeedScrollContainer: React.FC<FeedScrollContainerProps> = ({
  children,
  feedContainerRef,
  className
}) => {
  return <div ref={feedContainerRef} style={{
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    height: '100%',
    position: 'relative',
    overscrollBehaviorY: 'contain',
    overscrollBehaviorX: 'none',
    margin: 0,
    padding: 0
  }} data-scroll-container="true" onWheel={e => {
    // Check if the target is within a horizontal scroll container
    const target = e.target as HTMLElement;
    const horizontalScrollContainer = target.closest('[data-horizontal-scroll="true"]');
    if (horizontalScrollContainer) {
      // Allow horizontal container to handle its own scrolling
      e.stopPropagation();
      return;
    }

    // Check if this is horizontal scrolling
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      // This is horizontal scrolling, don't interfere
      e.stopPropagation();
      return;
    }

    // Allow vertical scrolling to bubble up to the global handler
  }} className="m-0 p-0">
      {children}
    </div>;
};
export default FeedScrollContainer;
