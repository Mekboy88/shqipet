
import { useCallback, useRef, RefObject } from 'react';

interface UseScrollHandlerProps {
  pageScrollRef: RefObject<HTMLDivElement>;
  sidebarScrollRef?: RefObject<HTMLDivElement>;
  rightSideScrollRef?: RefObject<HTMLDivElement>;
  mainContentRef?: RefObject<HTMLDivElement>;
  getThreshold: () => number;
  updateStickyState: (shouldBeSticky: boolean) => void;
  onScrollStart?: () => void;
}

export const useScrollHandler = ({
  pageScrollRef,
  sidebarScrollRef,
  rightSideScrollRef,
  mainContentRef,
  getThreshold,
  updateStickyState,
  onScrollStart
}: UseScrollHandlerProps) => {
  const isScrollingProgrammatically = useRef(false);
  const lastStickyState = useRef<boolean | null>(null);

  const getCurrentActiveTab = () => {
    return window.location.pathname === '/profile' && window.location.hash !== '#about' ? 'posts' : 'other';
  };

  const handleScroll = useCallback((event: WheelEvent) => {
    const pageScroll = pageScrollRef.current;
    
    if (!pageScroll) return;

    const currentScrollTop = pageScroll.scrollTop;
    const threshold = getThreshold();
    
    // Don't prevent default - allow natural smooth scrolling
    // event.preventDefault();
    
    if (isScrollingProgrammatically.current) return;
    
    onScrollStart?.();
    
    // Use natural scroll behavior with smooth transitions
    const scrollDirection = event.deltaY > 0 ? 'down' : 'up';
    const scrollAmount = Math.abs(event.deltaY) * 0.8; // Much smaller multiplier for smoother feel
    
    // Use natural browser scrolling - don't override
    if (scrollDirection === 'down') {
      if (currentScrollTop < threshold) {
        // Allow natural scrolling but update sticky state
        if (currentScrollTop >= threshold * 0.9 && lastStickyState.current !== true) {
          lastStickyState.current = true;
          updateStickyState(true);
        }
      }
    } else {
      if (currentScrollTop < threshold && lastStickyState.current !== false) {
        lastStickyState.current = false;
        updateStickyState(false);
      }
    }
    
    // Immediate reset for maximum responsiveness
    isScrollingProgrammatically.current = false;
  }, [pageScrollRef, getThreshold, sidebarScrollRef, rightSideScrollRef, mainContentRef, updateStickyState, onScrollStart]);

  return { handleScroll };
};
