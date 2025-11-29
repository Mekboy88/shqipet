
import { useEffect, useState, RefObject, useCallback, useRef } from 'react';

interface UseSimplifiedScrollManagerProps {
  pageScrollRef: RefObject<HTMLDivElement>;
  headerRef: RefObject<HTMLDivElement>;
}

export const useSimplifiedScrollManager = ({
  pageScrollRef,
  headerRef
}: UseSimplifiedScrollManagerProps) => {
  const [isNavigationSticky, setIsNavigationSticky] = useState(false);
  
  // Use refs to prevent recreating the callback
  const rafId = useRef<number | null>(null);
  const lastScrollTop = useRef(0);
  const lastUpdate = useRef(0);

  const handleScroll = useCallback(() => {
    const pageScroll = pageScrollRef.current;
    const header = headerRef.current;
    
    if (!pageScroll || !header) return;

    const now = performance.now();
    // Throttle to 60fps
    if (now - lastUpdate.current < 16) return;
    
    const currentScrollTop = pageScroll.scrollTop;
    const scrollDiff = Math.abs(currentScrollTop - lastScrollTop.current);
    
    // Only update if scroll changed significantly
    if (scrollDiff < 3) return;
    
    // Calculate when navigation should be sticky
    // This should match when the navigation reaches the top of the viewport
    const headerHeight = header.offsetHeight;
    const threshold = headerHeight - 60; // Account for navigation height
    const shouldBeSticky = currentScrollTop >= threshold;
    
    console.log('Scroll position:', currentScrollTop, 'Threshold:', threshold, 'Should be sticky:', shouldBeSticky);
    
    // Only update state if it actually changed
    if (shouldBeSticky !== isNavigationSticky) {
      setIsNavigationSticky(shouldBeSticky);
    }
    
    lastScrollTop.current = currentScrollTop;
    lastUpdate.current = now;
  }, [isNavigationSticky]); // Include isNavigationSticky in dependencies

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

  return { isNavigationSticky };
};
