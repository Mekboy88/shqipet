
import React from 'react';

interface HoldProgressBarProps {
  isHoldingThis: boolean;
  holdProgress: number;
}

export const HoldProgressBar: React.FC<HoldProgressBarProps> = ({
  isHoldingThis,
  holdProgress
}) => {
  if (!isHoldingThis || holdProgress <= 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none rounded-full overflow-hidden">
      <div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transition-all duration-100 ease-out shadow-sm"
        style={{ width: `${holdProgress}%` }}
      />
    </div>
  );
};
