import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SlidingMenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlidingMenuPanel: React.FC<SlidingMenuPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate 24 empty cards (4x6 grid)
  const emptyCards = Array.from({ length: 24 }, (_, index) => index);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose} 
      />
      
      {/* Sliding Panel */}
      <div 
        className={`fixed top-12 right-0 h-[calc(100vh-3rem)] w-[420px] bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-3 overflow-hidden">
          <div className="grid grid-cols-4 grid-rows-6 gap-x-1.5 gap-y-2 h-full">
            {emptyCards.map((cardIndex) => (
              <div key={cardIndex} className="relative">
                {cardIndex === 0 ? (
                  <Link 
                    to="/tasks" 
                    className="relative w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex items-center justify-center cursor-pointer"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                      background: 'linear-gradient(45deg, #FFF0C4 0%, #FFF5D6 25%, #FFFAE8 50%, #FFFFFF 75%, #F0EFEF 100%)'
                    }}
                    onClick={onClose}
                  >
                    <div className="w-12 h-12">
                      <svg 
                        version="1.1" 
                        id="Layer_1" 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 512 512" 
                        xmlSpace="preserve" 
                        fill="#000000"
                        className="w-full h-full"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                          <polygon style={{fill:"#FFE08F"}} points="394.894,503.83 427.574,503.83 427.574,8.17 394.894,8.17 373.106,256" />
                          <polygon style={{fill:"#FFEAB2"}} points="264.17,503.83 394.894,503.83 394.894,8.17 362.213,8.17" />
                          <polygon style={{fill:"#FFF3D4"}} points="362.213,8.17 362.213,405.787 285.957,426.583 329.532,8.17" />
                          <polygon style={{fill:"#FFFFFF"}} points="329.532,8.17 329.532,404.796 264.17,503.83 8.17,503.83 8.17,8.17" />
                          <polygon style={{fill:"#E26142"}} points="460.255,8.17 460.255,51.745 482.043,73.532 503.83,51.745 503.83,8.17" />
                          <polygon style={{fill:"#D8D1D0"}} points="460.255,51.745 460.255,95.319 482.043,117.106 503.83,95.319 503.83,51.745" />
                          <polygon style={{fill:"#FFAB97"}} points="482.04,503.83 503.83,438.468 482.043,416.681 460.255,438.468" />
                          <rect x="460.255" y="95.319" style={{fill:"#3891E9"}} width="43.574" height="343.149"></rect>
                          <polygon style={{fill:"#FFD159"}} points="264.17,405.787 264.17,503.83 362.213,405.787" />
                          <path d="M427.574,0c-4.512,0-8.17,3.657-8.17,8.17v495.66c0,4.513,3.658,8.17,8.17,8.17c4.512,0,8.17-3.657,8.17-8.17V8.17 C435.745,3.657,432.087,0,427.574,0z"></path>
                          <path d="M370.383,405.787V8.17c0-4.513-3.658-8.17-8.17-8.17H8.17C3.658,0,0,3.657,0,8.17v495.66c0,4.513,3.658,8.17,8.17,8.17h256 c2.167,0,4.245-0.861,5.777-2.392l98.043-98.043C369.522,410.031,370.383,407.954,370.383,405.787z M16.34,16.34h337.702v381.277 H264.17c-4.512,0-8.17,3.657-8.17,8.17v89.872H16.34V16.34z M342.489,413.957l-70.148,70.148v-70.148H342.489z"></path>
                          <path d="M394.894,0c-4.512,0-8.17,3.657-8.17,8.17V495.66h-76.336c-4.512,0-8.17,3.657-8.17,8.17s3.658,8.17,8.17,8.17h84.506 c4.512,0,8.17-3.657,8.17-8.17V8.17C403.064,3.657,399.406,0,394.894,0z"></path>
                          <path d="M503.83,0h-43.574c-4.512,0-8.17,3.657-8.17,8.17v430.298c0,0.878,0.142,1.749,0.419,2.583l21.785,65.362 c1.112,3.337,4.234,5.587,7.751,5.587s6.639-2.25,7.751-5.586l21.789-65.362c0.278-0.833,0.419-1.705,0.419-2.584V8.17 C512,3.657,508.342,0,503.83,0z M468.426,430.298V103.489h27.234v326.809H468.426z M468.426,59.915h27.234v27.234h-27.234V59.915z M495.66,16.34v27.234h-27.234V16.34H495.66z M482.041,477.993l-10.451-31.355h20.904L482.041,477.993z"></path>
                        </g>
                      </svg>
                    </div>
                    <div className="absolute bottom-1 left-1 right-1 text-[10px] text-gray-700 text-center pointer-events-none">
                      Detyrat
                    </div>
                  </Link>
                ) : (
                  <div
                    className="relative w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex items-center justify-center"
                    style={{
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div className="text-center text-gray-400">
                      <div className="w-6 h-6 mx-auto mb-1 bg-gray-100 rounded-full"></div>
                      <div className="text-xs">Empty</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SlidingMenuPanel;