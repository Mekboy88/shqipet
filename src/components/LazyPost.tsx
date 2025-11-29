import React, { useState, useEffect, useRef, useCallback } from 'react';
import Post from './Post';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyPostProps {
  post: any;
  showPiP?: boolean;
  index: number;
  preloadThreshold?: number; // Number of posts to preload ahead
}

const LazyPost: React.FC<LazyPostProps> = ({ 
  post, 
  showPiP = false, 
  index,
  preloadThreshold = 5 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  // Load content when post comes into viewport or is within preload threshold
  useEffect(() => {
    // For first 5 posts, load immediately (progressive from top)
    if (index < preloadThreshold) {
      setShouldLoad(true);
      return;
    }

    // For other posts, use intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before post enters viewport
        threshold: 0.1
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [index, preloadThreshold]);

  // Render loading skeleton for posts that haven't loaded yet
  if (!shouldLoad) {
    return (
      <div ref={postRef} className="bg-card rounded-lg shadow-sm border border-border mb-6 w-full">
        {/* Post skeleton - lightweight */}
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-[120px]" />
              <Skeleton className="h-2 w-[80px]" />
            </div>
          </div>
          
          {/* Content placeholder */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          
          {/* Media placeholder */}
          <Skeleton className="w-full h-[300px] rounded-lg mb-3" />
          
          {/* Actions placeholder */}
          <div className="flex items-center space-x-6">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      </div>
    );
  }

  // Render actual post when loaded
  return (
    <div ref={postRef}>
      <Post post={post} showPiP={showPiP} />
    </div>
  );
};

export default LazyPost;