import React from 'react';

interface RootLoadingWrapperProps {
  children: React.ReactNode;
}

const RootLoadingWrapper: React.FC<RootLoadingWrapperProps> = ({ children }) => {
  // No loading delays - show content immediately
  return <>{children}</>;
};

export default RootLoadingWrapper;