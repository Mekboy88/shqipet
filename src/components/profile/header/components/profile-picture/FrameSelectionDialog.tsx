import React, { useState, useEffect } from 'react';
import { X, Search, Move, ChevronDown } from 'lucide-react';
import { DiscardConfirmationDialog } from '../photo-edit/DiscardConfirmationDialog';

interface Frame {
  id: string;
  name: string;
  author: string;
  icon: string;
  color: string;
}
interface FrameSelectionDialogProps {
  onClose: () => void;
  onFrameSelect: (frame: Frame) => void;
}
export const FrameSelectionDialog: React.FC<FrameSelectionDialogProps> = ({
  onClose,
  onFrameSelect
}) => {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(50);
  const [isZooming, setIsZooming] = useState(false);
  const [showRepositionHint, setShowRepositionHint] = useState(true);
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0
  });
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [selectedTimeOption, setSelectedTimeOption] = useState('Asnjëherë');
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const timeOptions = ['1 orë', '1 ditë', 'Asnjëherë'];

  // Enhanced scroll prevention - targets both body and profile containers
  useEffect(() => {
    // Get the current scroll position
    const scrollY = window.scrollY;

    // Save current styles for body
    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyPosition = document.body.style.position;
    const originalBodyTop = document.body.style.top;
    const originalBodyWidth = document.body.style.width;

    // Find profile scroll containers
    const profileScrollContainer = document.querySelector('[data-scroll-container="true"]') as HTMLElement;
    const profilePageScrollRef = document.querySelector('.profile-scroll-container') as HTMLElement;

    // Save original styles for profile containers
    const originalProfileOverflow = profileScrollContainer?.style.overflow;
    const originalPageOverflow = profilePageScrollRef?.style.overflow;

    // Apply styles to prevent scrolling on body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Apply styles to prevent scrolling on profile containers
    if (profileScrollContainer) {
      profileScrollContainer.style.overflow = 'hidden';
    }
    if (profilePageScrollRef) {
      profilePageScrollRef.style.overflow = 'hidden';
    }

    // Prevent wheel and touch events on the document
    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Add event listeners to prevent scrolling
    document.addEventListener('wheel', preventDefault, {
      passive: false,
      capture: true
    });
    document.addEventListener('touchmove', preventDefault, {
      passive: false,
      capture: true
    });
    document.addEventListener('scroll', preventDefault, {
      passive: false,
      capture: true
    });

    // Also prevent scrolling on profile containers
    if (profileScrollContainer) {
      profileScrollContainer.addEventListener('wheel', preventDefault, {
        passive: false,
        capture: true
      });
      profileScrollContainer.addEventListener('touchmove', preventDefault, {
        passive: false,
        capture: true
      });
    }
    if (profilePageScrollRef) {
      profilePageScrollRef.addEventListener('wheel', preventDefault, {
        passive: false,
        capture: true
      });
      profilePageScrollRef.addEventListener('touchmove', preventDefault, {
        passive: false,
        capture: true
      });
    }

    // Cleanup function to restore scrolling
    return () => {
      // Restore body styles
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalBodyPosition;
      document.body.style.top = originalBodyTop;
      document.body.style.width = originalBodyWidth;

      // Restore profile container styles
      if (profileScrollContainer && originalProfileOverflow !== undefined) {
        profileScrollContainer.style.overflow = originalProfileOverflow;
      }
      if (profilePageScrollRef && originalPageOverflow !== undefined) {
        profilePageScrollRef.style.overflow = originalPageOverflow;
      }

      // Remove event listeners from document
      document.removeEventListener('wheel', preventDefault, true);
      document.removeEventListener('touchmove', preventDefault, true);
      document.removeEventListener('scroll', preventDefault, true);

      // Remove event listeners from profile containers
      if (profileScrollContainer) {
        profileScrollContainer.removeEventListener('wheel', preventDefault, true);
        profileScrollContainer.removeEventListener('touchmove', preventDefault, true);
      }
      if (profilePageScrollRef) {
        profilePageScrollRef.removeEventListener('wheel', preventDefault, true);
        profilePageScrollRef.removeEventListener('touchmove', preventDefault, true);
      }

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, []);
  const frames: Frame[] = [{
    id: '1',
    name: 'Zemra Letër',
    author: 'Nga Facebook',
    icon: '💕',
    color: '#FFB6C1'
  }, {
    id: '2',
    name: 'Duke Sjellë Paqe',
    author: 'Nga Facebook',
    icon: '🕊️',
    color: '#E6E6FA'
  }, {
    id: '3',
    name: 'Ruaj Planetin Tonë',
    author: 'Nga Facebook',
    icon: '🌍',
    color: '#98FB98'
  }, {
    id: '4',
    name: 'Më Mirë Së Bashku',
    author: 'Nga Facebook',
    icon: '🤝',
    color: '#87CEEB'
  }, {
    id: '5',
    name: 'Dashuro Tokën',
    author: 'Nga Facebook',
    icon: '🌱',
    color: '#90EE90'
  }, {
    id: '6',
    name: 'Paqe në Tokë',
    author: 'Nga Facebook',
    icon: '☮️',
    color: '#DDA0DD'
  }, {
    id: '7',
    name: 'Dashuria Na Bashkon',
    author: 'Nga Facebook',
    icon: '❤️',
    color: '#FF6B6B'
  }, {
    id: '8',
    name: 'Përkujtim',
    author: 'Nga Facebook',
    icon: '🎗️',
    color: '#FF4500'
  }];
  const filteredFrames = frames.filter(frame => frame.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleFrameClick = (frame: Frame) => {
    setSelectedFrame(frame);
  };
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowDiscardDialog(true);
    }
  };
  const handleCloseClick = () => {
    setShowDiscardDialog(true);
  };
  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setZoom(value);
    setIsZooming(true);
    setShowRepositionHint(false);
    setTimeout(() => setIsZooming(false), 1000);
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    setShowRepositionHint(false);
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
  const handleTimeOptionSelect = (option: string) => {
    setSelectedTimeOption(option);
    setShowTimeDropdown(false);
  };
  const handleDiscardChanges = () => {
    setShowDiscardDialog(false);
    // Close everything including the main ProfilePictureDialog
    onClose();
  };
  const handleKeepChanges = () => {
    setShowDiscardDialog(false);
  };

  // Handle the three dots button - directly close everything
  const handleFrameOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Directly close all dialogs without showing confirmation
    onClose();
  };
  return <>
      <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
        <div className="bg-white rounded-lg shadow-xl w-[900px] h-[800px] flex flex-col" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Shto një kornizë në foton e profilit</h2>
            <button onClick={handleCloseClick} className="p-1 rounded-full transition-colors bg-gray-300 hover:bg-gray-200 text-base">
              <X className="w-7 h-7 text-gray-800" />
            </button>
          </div>

          <div className="flex flex-1">
            {/* Left Panel - Frame Selection */}
            <div className="w-[350px] border-gray-200 flex flex-col">
              {/* Choose a frame section */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Zgjidh një kornizë</h3>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Kërko korniza" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-300" />
                </div>
              </div>

              {/* Frame List */}
              <div className="flex-1 overflow-y-auto">
                {filteredFrames.map(frame => <div key={frame.id} onClick={() => handleFrameClick(frame)} className={`flex items-center p-3 cursor-pointer mx-2 rounded-lg hover:bg-gray-200 hover:shadow-sm transition-all duration-200 border-l-2 ${selectedFrame?.id === frame.id ? 'border-red-600 bg-gradient-to-r from-red-50 to-red-100' : 'border-transparent'}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3" style={{
                  backgroundColor: frame.color
                }}>
                      {frame.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{frame.name}</div>
                      <div className="text-xs text-gray-500">{frame.author}</div>
                    </div>
                    <button onClick={handleFrameOptionsClick} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <span className="text-gray-400">⋯</span>
                    </button>
                  </div>)}
              </div>
            </div>

            {/* Right Panel */}
            <div className="w-[550px] flex flex-col">
              {/* Description with gray background */}
              <div className="p-4 bg-gray-300 my-0 py-[46px]">
                <input type="text" placeholder="Përshkrimi" className="w-full p-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none bg-white transition-all duration-300 hover:shadow-[0_0_0_2px_#fecaca] hover:border-transparent" />
              </div>

              {/* Preview Section */}
              <div className="p-6 flex flex-col items-center relative flex-1 bg-gray-300 py-[20px]">
                {/* Background area */}
                <div className="absolute top-6 left-6 right-6 bottom-20 rounded-lg overflow-hidden bg-white my-[-55px] mx-[-6px] py-0 px-[8px]" />
                
                {/* Preview text positioned at top-left of white area */}
                <h4 className="absolute top-2 left-2 text-gray-900 z-20 mx-[17px] my-[-30px] font-extrabold text-base">Paraparje</h4>
                
                <div className="relative mb-6 z-10 mt-8">
                  <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="relative w-80 h-80 mx-0 px-0">
                    {/* Photo container */}
                    <div className="w-full h-full relative cursor-move overflow-hidden rounded-full" onMouseDown={handleMouseDown}>
                      {/* Background photo */}
                      <img src="/lovable-uploads/2db6f792-ddb2-46da-8acf-f6f54396655a.png" alt="Paraparje e profilit" className="w-full h-full object-cover select-none pointer-events-none" style={{
                      transform: `scale(${1 + zoom / 100}) translate(${position.x}px, ${position.y}px)`,
                      transformOrigin: 'center center'
                    }} draggable={false} />
                      
                      {/* Frame Overlay - Updated to be thicker and go all around with bigger horizontal spread */}
                      {selectedFrame && <div className="absolute rounded-full pointer-events-none z-10" style={{
                      top: '-8px',
                      left: '-12px',
                      right: '-12px',
                      bottom: '-8px',
                      border: `16px solid ${selectedFrame.color}`,
                      boxSizing: 'border-box'
                    }}>
                          <div className="absolute top-6 right-6 text-2xl bg-white rounded-full w-10 h-10 flex items-center justify-center">
                            {selectedFrame.icon}
                          </div>
                        </div>}
                      
                      {/* Drag to reposition overlay */}
                      {!isZooming && showRepositionHint && !isDragging && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-lg flex items-center gap-2 z-40 py-[4px] px-[8px] text-xs">
                          <Move size={12} />
                          <span>Zvarrit për të rivendosur</span>
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Zoom Slider - moved to bottom */}
                <div className="w-full max-w-md z-10 relative absolute bottom-8">
                  <div className="flex items-center justify-between mb-2 px-0 py-px my-0">
                    <span className="text-gray-400 mx-0 px-0 py-0 my-[56px] text-3xl">-</span>
                    <style>
                      {`
                        .slider-custom-frame {
                          background: linear-gradient(to right, rgba(139, 69, 19, 0.3) 0%, rgba(139, 69, 19, 0.3) ${zoom}%, #e5e7eb ${zoom}%, #e5e7eb 100%);
                        }
                        .slider-custom-frame::-webkit-slider-thumb {
                          appearance: none;
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: rgba(139, 69, 19, 0.8);
                          cursor: pointer;
                          border: 2px solid white;
                          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        }
                        .slider-custom-frame::-moz-range-thumb {
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-custom-frame"
                    />
                    <span className="text-gray-950 my-0 py-0 text-2xl font-semibold">+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-white border-t border-gray-200">
            <div className="px-6 py-4 flex items-center justify-end">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Kthehu tek fotografia e mëparshme e profilit në</span>
                  <div className="relative">
                    <div onClick={() => setShowTimeDropdown(!showTimeDropdown)} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded bg-gray-300">
                      <span className="font-medium">{selectedTimeOption}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    
                    {/* Dropdown Menu */}
                    {showTimeDropdown && <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[100px]">
                        {timeOptions.map(option => <div key={option} className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg" onClick={() => handleTimeOptionSelect(option)}>
                            {option}
                          </div>)}
                      </div>}
                  </div>
                </div>
                
                <button onClick={() => selectedFrame && onFrameSelect(selectedFrame)} disabled={!selectedFrame} className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-700 hover:to-red-950 text-white disabled:bg-gray-300 disabled:text-gray-500 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-sm min-w-[160px]">
                  Përdor si foto profili
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      <DiscardConfirmationDialog isOpen={showDiscardDialog} onConfirm={handleDiscardChanges} onCancel={handleKeepChanges} />
    </>;
};
