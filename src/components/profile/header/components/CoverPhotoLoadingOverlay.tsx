import React from 'react';
import LoadingDots from '@/components/ui/LoadingDots';

interface CoverPhotoLoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

const CoverPhotoLoadingOverlay: React.FC<CoverPhotoLoadingOverlayProps> = ({
  isLoading,
  message = 'Saving changes...'
}) => {
  if (!isLoading) return null;
  return <LoadingDots message={message} variant="light" size="md" />;
};

export default CoverPhotoLoadingOverlay;