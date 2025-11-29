import React, { useEffect, useRef, useState } from 'react';

interface ScrollControllerProps {
  children: React.ReactNode;
  loadedPosts: number;
  totalPosts: number;
  isLoadingPost: boolean;
}

const ScrollController: React.FC<ScrollControllerProps> = ({
  children,
  loadedPosts,
  totalPosts,
  isLoadingPost
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
};

export default ScrollController;