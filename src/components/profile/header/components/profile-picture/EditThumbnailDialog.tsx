
import React, { useState } from 'react';
import { X } from 'lucide-react';
interface EditThumbnailDialogProps {
  onClose: () => void;
  onSave: () => void;
}
export const EditThumbnailDialog: React.FC<EditThumbnailDialogProps> = ({
  onClose,
  onSave
}) => {
  const [zoom, setZoom] = useState(50);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoom(Number(e.target.value));
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[700px] flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Redakto miniaturën</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Profile Picture Preview with Much Larger Padding Area */}
          <div className="relative mb-8 mx-0 px-32 sm:px-48 md:px-64 lg:px-80 pt-32">
            {/* Background image in padding area with white shade */}
            <div className="absolute inset-0 overflow-hidden">
              <img src="/lovable-uploads/2db6f792-ddb2-46da-8acf-f6f54396655a.png" alt="Pamja e sfondit" className="w-full h-full object-cover select-none pointer-events-none opacity-50" style={{
              transform: `scale(${1 + zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center'
            }} draggable={false} />
              <div className="absolute inset-0 bg-white/20"></div>
            </div>
            
            {/* Main circular preview */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 mx-auto overflow-hidden rounded-full cursor-move z-10" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
              <img src="/lovable-uploads/2db6f792-ddb2-46da-8acf-f6f54396655a.png" alt="Pamja e profilit" className="w-full h-full object-cover select-none pointer-events-none" style={{
              transform: `scale(${1 + zoom / 100}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center'
            }} draggable={false} />
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="w-full max-w-md mb-8 px-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-3xl">-</span>
              <div className="flex-1 mx-6 relative">
                <style>
                  {`
                    .slider-custom {
                      background: linear-gradient(to right, rgba(139, 69, 19, 0.3) 0%, rgba(139, 69, 19, 0.3) ${zoom}%, #e5e7eb ${zoom}%, #e5e7eb 100%);
                    }
                    .slider-custom::-webkit-slider-thumb {
                      appearance: none;
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: rgba(139, 69, 19, 0.8);
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                    .slider-custom::-moz-range-thumb {
                      width: 20px;
                      height: 20px;
                      border-radius: 50%;
                      background: rgba(139, 69, 19, 0.8);
                      cursor: pointer;
                      border: 2px solid white;
                      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    }
                  `}
                </style>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={zoom} 
                  onChange={handleZoomChange} 
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-custom"
                />
              </div>
              <span className="text-gray-950 text-2xl font-semibold">+</span>
            </div>
          </div>

          {/* Privacy Notice - positioned in bottom left */}
          <div className="absolute bottom-8 left-8 flex items-center text-lg text-gray-600 my-[-30px]">
            <div className="w-5 h-5 rounded-full flex items-center justify-center mr-3">
              <img src="/lovable-uploads/438e5a55-9654-4efb-8f71-394cac58ac22.png" alt="Ikona publike" className="w-5 h-5" />
            </div>
            <span>Fotoja e profilit tënd është publike.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <button onClick={onClose} className="px-6 py-3 text-base font-medium text-gray-700 rounded-md transition-colors bg-gray-300 hover:bg-gray-200">
            Anulo
          </button>
          <button onClick={onSave} className="px-6 py-3 text-white rounded-md transition-all font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105" style={{
          background: 'linear-gradient(to right, #dc2626, #b91c1c, #991b1b, #7f1d1d)',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
        }}>
            Ruaj
          </button>
        </div>
      </div>
    </div>;
};
