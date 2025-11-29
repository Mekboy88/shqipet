import React, { useState, useRef, useEffect } from 'react';
import Post from './Post';
import './ui/skeleton-shimmer.css';

interface ProgressivePostProps {
  post: any;
  showPiP?: boolean;
  index: number;
  onLoadComplete?: (index: number) => void;
  shouldLoad?: boolean;
  instantLoad?: boolean;
}

const ProgressivePost: React.FC<ProgressivePostProps> = ({
  post,
  showPiP = false,
  index,
  onLoadComplete,
  shouldLoad = false,
  instantLoad = false
}) => {
  const [isLoaded, setIsLoaded] = useState(instantLoad);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  // Intersection Observer - Facebook style
  useEffect(() => {
    if (instantLoad) {
      // Ensure in-view state to trigger load logic, but we already initialize loaded
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setIsInView(true);
          }
        });
      },
      {
        threshold: [0.1],
        rootMargin: '200px 0px 200px 0px' // Pre-load content before user sees it
      }
    );

    if (postRef.current) {
      observer.observe(postRef.current);
    }

    return () => observer.disconnect();
  }, [instantLoad]);

  // Facebook-style progressive loading: one by one from top to bottom
  useEffect(() => {
    if ((instantLoad || isInView || shouldLoad) && !isLoaded && !hasError) {
      // Immediate if instantLoad, otherwise staggered
      const loadDelay = instantLoad ? 0 : (index === 0 ? 0 : Math.min(index * 150, 800));
      
      const timer = setTimeout(() => {
        try {
          setIsLoaded(true);
          onLoadComplete?.(index);
        } catch (error) {
          setHasError(true);
        }
      }, loadDelay);

      return () => clearTimeout(timer);
    }
  }, [instantLoad, isInView, shouldLoad, isLoaded, hasError, index, onLoadComplete]);

  // Ensure loaded state if instantLoad toggles on later
  useEffect(() => {
    if (instantLoad) setIsLoaded(true);
  }, [instantLoad]);

  // Facebook-style error handling
  if (hasError) {
    return (
      <div 
        ref={postRef}
        className="bg-card rounded-lg shadow-sm border border-border mb-3 p-8 text-center"
        style={{ minHeight: '200px' }}
      >
        <div className="text-muted-foreground mb-4">
          <div className="text-lg mb-2">Something went wrong</div>
          <div className="text-sm">We couldn't load this post</div>
        </div>
        <button
          onClick={() => {
            setHasError(false);
            setIsLoaded(false);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Facebook-style skeleton - exact dimensions (header: 48px, media varies)
  if (!isLoaded) {
    return (
      <div 
        ref={postRef}
        className="bg-card rounded-lg shadow-sm border border-border mb-3"
        style={{ minHeight: '500px' }} // Facebook post average height
      >
        {/* Header - exactly 48px like Facebook */}
        <div className="p-4 pb-3">
          <div className="flex items-center space-x-3" style={{ height: '48px' }}>
            <div className="h-10 w-10 rounded-full facebook-skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 facebook-skeleton rounded" />
              <div className="h-2 w-20 facebook-skeleton rounded" />
            </div>
          </div>
        </div>
        
        {/* Text content - Facebook style bars */}
        <div className="px-4 pb-3">
          <div className="space-y-2">
            <div className="h-3 w-full facebook-skeleton rounded" />
            <div className="h-3 w-4/5 facebook-skeleton rounded" />
            <div className="h-3 w-3/5 facebook-skeleton rounded" />
          </div>
        </div>
        
        {/* Media area - Facebook standard size */}
        <div className="w-full facebook-skeleton" style={{ height: '300px' }} />
        
        {/* Action buttons - Facebook dimensions */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-5 w-12 facebook-skeleton rounded" />
              <div className="h-5 w-16 facebook-skeleton rounded" />
              <div className="h-5 w-12 facebook-skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Actual post with optional Facebook fade-in animation
  return (
    <div ref={postRef} className={instantLoad ? '' : 'facebook-fade-in'}>
      <Post post={post} showPiP={showPiP} />
    </div>
  );
};

export default ProgressivePost;