import React, { useState, useEffect } from 'react';

const PageScrollIndicator: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Check if page is scrollable
      const pageScrollable = scrollHeight > 10;
      setIsScrollable(pageScrollable);
      
      if (pageScrollable) {
        const percentage = (scrollTop / scrollHeight) * 100;
        setScrollPercentage(Math.min(100, Math.max(0, percentage)));
      } else {
        setScrollPercentage(0);
      }
    };

    // Initial check
    handleScroll();
    
    // Add listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Don't render if page isn't scrollable
  if (!isScrollable) return null;

  return (
    <>
      {/* Background track */}
      <div
        className="fixed right-0 top-0 w-1 h-full bg-gray-300/40"
        style={{
          zIndex: 10000,
          pointerEvents: 'none'
        }}
      />
      
      {/* Progress indicator */}
      <div
        className="fixed right-0 top-0 w-1 bg-primary transition-all duration-75 ease-out"
        style={{
          height: `${scrollPercentage}%`,
          zIndex: 10001,
          pointerEvents: 'none',
          minHeight: scrollPercentage > 0 ? '12px' : '0px'
        }}
      />
    </>
  );
};

export default PageScrollIndicator;