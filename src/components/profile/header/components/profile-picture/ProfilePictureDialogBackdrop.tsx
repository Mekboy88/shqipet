
import React from 'react';

interface ProfilePictureDialogBackdropProps {
  children: React.ReactNode;
  onBackdropClick: (e: React.MouseEvent) => void;
  onBackdropWheel: (e: React.WheelEvent) => void;
}

export const ProfilePictureDialogBackdrop: React.FC<ProfilePictureDialogBackdropProps> = ({
  children,
  onBackdropClick,
  onBackdropWheel
}) => {
  return (
    <div 
      onClick={onBackdropClick} 
      onWheel={onBackdropWheel} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/[0.73]"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-[750px] max-h-[750px] flex flex-col" 
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
