import React from 'react';
import { GlobalSkeleton } from '@/components/ui/GlobalSkeleton';

// Light skeleton component - no heavy loading animations
const LoadingScreen: React.FC = () => {
  return <GlobalSkeleton />;
};

export default LoadingScreen;