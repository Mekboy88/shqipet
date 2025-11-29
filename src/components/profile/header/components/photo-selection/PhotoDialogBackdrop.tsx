
import React from 'react';

interface PhotoDialogBackdropProps {
  onBackdropClick: (e: React.MouseEvent) => void;
  onEscapeKey: (e: React.KeyboardEvent) => void;
  onBackdropWheel: (e: React.WheelEvent) => void;
  children: React.ReactNode;
}

const PhotoDialogBackdrop: React.FC<PhotoDialogBackdropProps> = ({
  onBackdropClick,
  onEscapeKey,
  onBackdropWheel,
  children
}) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none'
      }} 
      onClick={onBackdropClick} 
      onKeyDown={onEscapeKey} 
      onWheel={onBackdropWheel}
      tabIndex={0}
      className="bg-white/80"
    >
      {children}
    </div>
  );
};

export default PhotoDialogBackdrop;
