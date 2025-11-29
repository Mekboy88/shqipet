
import React from 'react';

interface PhotoDialogContainerProps {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onWheel: (e: React.WheelEvent) => void;
  children: React.ReactNode;
}

const PhotoDialogContainer: React.FC<PhotoDialogContainerProps> = ({
  onMouseEnter,
  onMouseLeave,
  onWheel,
  children
}) => {
  return (
    <div 
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        width: '90vw',
        maxWidth: '600px',
        height: '85vh',
        maxHeight: '700px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        touchAction: 'auto'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    >
      {children}
    </div>
  );
};

export default PhotoDialogContainer;
