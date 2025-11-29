import React, { useState } from 'react';
import { Move } from 'lucide-react';
interface PhotoPreviewSectionProps {
  photoUrl: string;
  zoomLevel: number;
  onZoomChange: (value: number) => void;
}
export const PhotoPreviewSection: React.FC<PhotoPreviewSectionProps> = ({
  photoUrl,
  zoomLevel,
  onZoomChange
}) => {
  const [showRepositionHint, setShowRepositionHint] = useState(true);
  const handleMouseDown = () => {
    setShowRepositionHint(false);
  };
  const handleZoomChange = (value: number) => {
    setShowRepositionHint(false);
    onZoomChange(value);
  };
  return <div className="p-6 flex flex-col items-center relative">
      {/* Background photo (full image) - clear and sharp */}
      <div className="absolute inset-0" style={{
      backgroundImage: `url(${photoUrl})`,
      backgroundSize: `${100 + zoomLevel}%`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'none'
    }} />
      
      <div className="relative mb-6 z-10">
        <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white shadow-lg relative cursor-move" style={{
        backgroundImage: `url(${photoUrl})`,
        backgroundSize: `${100 + zoomLevel}%`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'none'
      }} onMouseDown={handleMouseDown}>
          {/* Drag to reposition overlay - Albanian text */}
          {showRepositionHint && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-lg flex items-center gap-2 z-40 py-[4px] px-[8px] text-xs">
              <Move size={12} />
              <span>Zvarrit për të rivendosur</span>
            </div>}
        </div>
      </div>

      {/* Zoom Slider */}
      <div className="w-full max-w-md mb-6 z-10 relative">
        <div className="flex items-center justify-between mb-2 bg-white/[0.71] py-0 my-0 rounded-full">
          <span className="text-4xl text-gray-800">-</span>
          <style>
            {`
              .slider-custom-photo {
                background: linear-gradient(to right, rgba(220, 38, 38, 0.3) 0%, rgba(220, 38, 38, 0.3) ${zoomLevel}%, #e5e7eb ${zoomLevel}%, #e5e7eb 100%);
              }
              .slider-custom-photo::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(220, 38, 38, 0.8);
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              .slider-custom-photo::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: rgba(220, 38, 38, 0.8);
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
            `}
          </style>
          <input type="range" min="0" max="100" value={zoomLevel} onChange={e => handleZoomChange(Number(e.target.value))} className="flex-1 mx-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-custom-photo" />
          <span className="text-2xl text-gray-800">+</span>
        </div>
      </div>
    </div>;
};