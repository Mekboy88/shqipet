import React, { useEffect, useRef, useCallback } from 'react';

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 800, // Facebook loads when ~3 posts from bottom
  children,
  loadingComponent,
  scrollContainerRef
}) => {
  const loadingRef = useRef<HTMLDivElement>(null);
  const pendingRef = useRef(false);
  
  // Facebook-style loading check - simple and effective
  const checkIfNeedLoad = useCallback(() => {
    if (isLoading || !hasMore || pendingRef.current) return;

    const container = scrollContainerRef?.current;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (container) {
      scrollTop = container.scrollTop;
      scrollHeight = container.scrollHeight;
      clientHeight = container.clientHeight;
    } else {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      console.log('🔄 Loading more posts (Facebook style)');
      pendingRef.current = true;
      onLoadMore();
      // Prevent spamming load requests
      setTimeout(() => { pendingRef.current = false; }, 500);
    }
  }, [hasMore, isLoading, onLoadMore, threshold, scrollContainerRef]);

  useEffect(() => {
    const handleScroll = () => {
      checkIfNeedLoad();
    };

    // Facebook uses simple throttling
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    const targetEl = scrollContainerRef?.current || window;

    if (targetEl instanceof Window) {
      window.addEventListener('scroll', throttledScroll, { passive: true });
    } else if (targetEl) {
      targetEl.addEventListener('scroll', throttledScroll, { passive: true } as any);
    }
    
    // Initial check in case content doesn't fill container
    setTimeout(checkIfNeedLoad, 100);
    
    return () => {
      if (targetEl instanceof Window) {
        window.removeEventListener('scroll', throttledScroll as any);
      } else if (targetEl) {
        targetEl.removeEventListener('scroll', throttledScroll as any);
      }
    };
  }, [checkIfNeedLoad]);

  return (
    <div>
      {children}
      
      {/* Facebook-style loading at bottom (shows skeleton posts) */}
      {isLoading && hasMore && loadingComponent && (
        <div ref={loadingRef} className="mt-4">
          {loadingComponent}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;