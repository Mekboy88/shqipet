import React, { useEffect, useRef } from 'react';

interface InfiniteScrollSentinelProps {
  onIntersect: () => void;
  loading: boolean;
  hasMore: boolean;
  threshold?: number;
  rootMargin?: string;
}

export const InfiniteScrollSentinel: React.FC<InfiniteScrollSentinelProps> = ({
  onIntersect,
  loading,
  hasMore,
  threshold = 0.1,
  rootMargin = '200px',
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          onIntersect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, loading, hasMore, threshold, rootMargin]);

  // Don't show anything - silent loading
  return <div ref={sentinelRef} className="h-4" />;
};