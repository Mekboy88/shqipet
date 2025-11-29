import React from "react";
import { useBreakpoint } from '@/hooks/use-mobile';

interface FeedContainerProps {
  children: React.ReactNode;
  className?: string;
}

const FeedContainer: React.FC<FeedContainerProps> = ({
  children,
  className
}) => {
  const {
    isMobile,
    isTablet,
    isLaptop
  } = useBreakpoint();

  // Debug: Log what's being rendered
  console.log('🎨 FeedContainer rendering with responsive grid layout');

  return (
    <div 
      className={`w-full ${className || ''}`}
      style={{ 
        marginTop: isMobile || isTablet ? '40px' : '64px', // Match sidebar top-16 (64px)
        padding: isMobile || isTablet ? '0 clamp(0.5rem, 2vw, 1.5rem)' : '0',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        minHeight: '100vh' // Prevent layout shifts
      }}
    >
      <div className="w-full max-w-none mx-auto">
        {children}
      </div>
    </div>
  );
};

export default FeedContainer;