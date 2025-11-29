
import React from 'react';

interface DragIndicatorsProps {
  isHolding: string | null;
  holdProgress: number;
  isDraggingActive: boolean;
  insertionIndex: number;
}

export const DragIndicators: React.FC<DragIndicatorsProps> = ({
  isHolding,
  holdProgress,
  isDraggingActive,
  insertionIndex
}) => {
  return (
    <>
      {/* Visual indicator when holding */}
      {isHolding && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full text-sm z-50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Hold for 3 seconds to drag...</span>
          </div>
        </div>
      )}
      
      {/* Visual indicator when dragging */}
      {isDraggingActive && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm z-50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="font-medium">📍 Dragging - Release to place</span>
          </div>
        </div>
      )}
      
      {/* Drop zone indicator */}
      {isDraggingActive && insertionIndex >= 0 && (
        <div 
          className="absolute left-0 right-0 z-40 transition-all duration-200 ease-out"
          style={{
            top: `${insertionIndex * 60}px`,
            marginLeft: '2.5%',
            marginRight: '2.5%',
            width: '95%',
            height: '3px',
          }}
        >
          <div className="h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full shadow-lg opacity-90" />
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full blur-sm opacity-60" />
          <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-blue-300 to-transparent rounded-full blur-md opacity-30" />
        </div>
      )}
    </>
  );
};
