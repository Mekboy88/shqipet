
import { useEffect, useState, RefObject, useCallback, useRef } from 'react';

interface ScrollState {
  scrollPosition: number;
  isSidebarSticky: boolean;
  isAtTop: boolean;
}

interface UseOptimizedScrollManagerProps {
  pageScrollRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
}

export const useOptimizedScrollManager = ({
  pageScrollRef,
  headerRef
}: UseOptimizedScrollManagerProps) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollPosition: 0,
    isSidebarSticky: false,
    isAtTop: false
  });

  // Use refs to track previous values and prevent unnecessary updates
  const previousScrollPosition = useRef(0);
  const previousIsSidebarSticky = useRef(false);
  const previousIsAtTop = useRef(false);
  const rafId = useRef<number | null>(null);
  const lastUpdateTime = useRef(0);

  const handleScroll = useCallback(() => {
    const pageScroll = pageScrollRef.current;
    const header = headerRef.current;
    
    if (!pageScroll || !header) return;

    const now = performance.now();
    // Throttle updates to 60fps max
    if (now - lastUpdateTime.current < 16) return;
    
    const currentScrollTop = pageScroll.scrollTop;
    const headerHeight = header.offsetHeight;
    
    // Use a larger buffer to prevent rapid state changes
    const buffer = 50;
    const threshold = Math.max(headerHeight - buffer, 50);
    
    const pastHeader = currentScrollTop >= threshold;
    
    // Only update if there's a significant change
    const scrollDiff = Math.abs(currentScrollTop - previousScrollPosition.current);
    const shouldUpdate = 
      scrollDiff > 10 || 
      pastHeader !== previousIsSidebarSticky.current ||
      pastHeader !== previousIsAtTop.current;

    if (shouldUpdate) {
      // Batch all updates in a single setState call
      setScrollState({
        scrollPosition: currentScrollTop,
        isSidebarSticky: pastHeader,
        isAtTop: pastHeader
      });

      // Update refs
      previousScrollPosition.current = currentScrollTop;
      previousIsSidebarSticky.current = pastHeader;
      previousIsAtTop.current = pastHeader;
      lastUpdateTime.current = now;
    }
  }, [pageScrollRef, headerRef]); // Remove state dependencies

  useEffect(() => {
    const pageScroll = pageScrollRef.current;
    if (!pageScroll) return;

    const throttledHandleScroll = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(handleScroll);
    };

    pageScroll.addEventListener('scroll', throttledHandleScroll, { 
      passive: true 
    });
    
    // Initial call
    setTimeout(handleScroll, 100);
    
    return () => {
      pageScroll.removeEventListener('scroll', throttledHandleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [handleScroll]);

  return scrollState;
};
