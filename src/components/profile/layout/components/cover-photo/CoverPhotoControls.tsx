
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CoverPhotoControlsProps {
  isDragMode: boolean;
  isSaving?: boolean;
  buttonColor: string;
  onDragModeToggle: () => void;
  onSaveChanges: () => void;
  onCancelChanges: () => void;
  onEditCoverClick: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onButtonColorChange: (color: string) => void;
  isOwnProfile?: boolean; // Only show controls if viewing own profile
  miniMode?: boolean; // Smaller controls for settings page
}

const CoverPhotoControls: React.FC<CoverPhotoControlsProps> = ({
  isDragMode,
  isSaving = false,
  buttonColor,
  onDragModeToggle,
  onSaveChanges,
  onCancelChanges,
  onEditCoverClick,
  onMouseDown,
  onButtonColorChange,
  isOwnProfile = true, // Default to true for backwards compatibility
  miniMode = false // Default to false for normal size
}) => {
  // Don't render controls if not viewing own profile
  if (!isOwnProfile) {
    return null;
  }
  const navigate = useNavigate();
  
  const colorOptions = [
    { name: 'White (transparent)', value: 'rgba(255, 255, 255, 0.1)' },
    { name: 'Dark', value: 'rgba(0, 0, 0, 0.5)' },
    { name: 'Blue', value: 'rgba(59, 130, 246, 0.7)' },
    { name: 'Green', value: 'rgba(34, 197, 94, 0.7)' },
    { name: 'Red', value: 'rgba(239, 68, 68, 0.7)' },
    { name: 'Purple', value: 'rgba(168, 85, 247, 0.7)' },
  ];
  const handleDragModeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // In miniMode, this should open settings panel instead of drag mode
    onDragModeToggle();
  };

  const handleEditCoverClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEditCoverClick();
  };

  const handleSaveChanges = (e: React.MouseEvent) => {
    console.log('🔄 Save button clicked!', { onSaveChanges: !!onSaveChanges });
    e.preventDefault();
    e.stopPropagation();
    onSaveChanges();
  };

  const handleCancelChanges = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCancelChanges();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMouseDown(e);
  };

  const handleRedaktoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/profile/settings');
  };

  return (
    <div 
      className="absolute bottom-4 right-4 flex gap-2"
      onClick={(e) => e.stopPropagation()} // Prevent cover photo click when clicking anywhere in this area
    >
      {/* Redakto Button - Only show when not in drag mode and not in settings page (miniMode) */}
      {!isDragMode && !miniMode && (
        <div 
          className={`bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 ${miniMode ? 'p-2' : 'p-3'}`}
          onClick={handleRedaktoClick}
        >
          <svg viewBox="0 0 1024 1024" className={miniMode ? 'w-4 h-4' : 'w-6 h-6'} xmlns="http://www.w3.org/2000/svg">
            <path d="M539.4 550.9m-164.7 0a164.7 164.7 0 1 0 329.4 0 164.7 164.7 0 1 0-329.4 0Z" fill="#e6e6e6"/>
            <path d="M679.3 405.4c-8.9-14-27.4-18.2-41.4-9.3-14 8.9-18.2 27.4-9.3 41.4 14 22.1 21.4 47.7 21.4 74 0 16.6 13.4 30 30 30s30-13.4 30-30c0-37.7-10.6-74.4-30.7-106.1z" fill="#e6e6e6"/>
            <path d="M607.4 611.4c-25.9 24.9-60 38.6-96 38.6-76.4 0-138.5-62.1-138.5-138.5S435 373 511.4 373c22.9 0 44.7 5.4 64.8 16 14.6 7.8 32.8 2.2 40.6-12.5 7.8-14.6 2.2-32.8-12.5-40.6-28.4-15.1-60.5-23-92.9-23-109.5 0-198.5 89.1-198.5 198.5C312.9 620.9 402 710 511.5 710c51.5 0 100.4-19.7 137.5-55.4 11.9-11.5 12.3-30.5 0.8-42.4-11.4-11.9-30.4-12.3-42.4-0.8z" fill="#e6e6e6"/>
            <path d="M853.7 370.4c-17.4-42.2-14.2-90.5 7.7-138.6a448.25 448.25 0 0 0-68.7-69c-48.2 21.8-96.6 24.9-138.8 7.4-42.3-17.6-74.3-54.2-92.8-104-16.4-1.8-33-2.7-49.8-2.7-15.9 0-31.6 0.8-47.1 2.5-18.7 49.8-50.7 86.4-93.1 104-42.5 17.6-91.2 14.1-139.7-8.2-25.2 20.2-48.1 43-68.4 68.1 22.3 48.6 25.6 97.3 7.9 139.9-17.7 42.6-54.6 74.6-104.9 93.1-1.7 16-2.6 32.3-2.6 48.7 0 16.1 0.9 32 2.5 47.6 50.2 18.6 87.1 50.8 104.7 93.4 17.6 42.6 14.1 91.3-8.2 139.9 20.2 25.1 43.1 48 68.3 68.3 48.6-22.2 97.3-25.5 139.8-7.8 42.4 17.6 74.3 54.3 92.9 104.2 15.8 1.7 31.9 2.6 48.2 2.6 16.5 0 32.7-0.9 48.7-2.6 18.7-49.8 50.7-86.3 93.1-103.8 42.2-17.4 90.6-14.2 138.8 7.7 25.4-20.4 48.5-43.5 68.9-68.9-21.8-48.2-24.9-96.5-7.3-138.7 17.5-42.1 53.9-74 103.3-92.5 1.8-16.2 2.7-32.7 2.7-49.3 0-16.3-0.9-32.4-2.6-48.2-49.8-19-86-50.9-103.5-93.1zM798 630.3c-21.8 52.5-21 110.8 0.6 168.3-57.5-21.7-115.8-22.7-168.3-1-52.6 21.7-93.2 63.5-118.6 119.4-25.3-56-65.8-97.9-118.3-119.7-25.8-10.7-53.1-16-80.9-16-28.8 0-58.2 5.6-87.4 16.6 21.7-57.5 22.7-115.8 1-168.3-21.7-52.6-63.5-93.2-119.4-118.6 56-25.3 97.9-65.8 119.7-118.3 21.8-52.5 21-110.8-0.6-168.3 29.4 11.1 59 16.8 87.9 16.8 27.7 0 54.7-5.2 80.4-15.8 52.6-21.7 93.2-63.5 118.6-119.4 25.3 56 65.8 97.9 118.3 119.7 52.5 21.8 110.8 21 168.3-0.6-21.7 57.5-22.7 115.8-1 168.3C820 446 861.8 486.6 917.7 512c-56 25.2-97.9 65.7-119.7 118.3z" fill="#e6e6e6"/>
          </svg>
        </div>
      )}
      
      {/* Move/Expand Icon */}
      {!isDragMode ? (
        <div 
          className={`bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 flex items-center gap-2 ${miniMode ? 'p-2' : 'p-3'}`}
          onClick={handleDragModeToggle}
        >
          <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" className={miniMode ? 'w-4 h-4' : 'w-6 h-6'}>
            <g>
              <path fill="#e6e6e6" d="M16 8l-3-3v2h-4v-4h2l-3-3-3 3h2v4h-4v-2l-3 3 3 3v-2h4v4h-2l3 3 3-3h-2v-4h4v2z"></path>
            </g>
          </svg>
        </div>
      ) : (
        <div className={`flex items-center ${miniMode ? 'gap-1' : 'gap-2'}`}>
          {/* Color Picker for Button */}
          <div className={`bg-black bg-opacity-50 rounded-lg flex items-center gap-2 ${miniMode ? 'p-1.5' : 'p-2'}`}>
            <span className={`text-white font-medium ${miniMode ? 'text-[10px]' : 'text-xs'}`}>Ngjyra e butonit:</span>
            <div className="flex gap-1">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onButtonColorChange(option.value)}
                  className={`${miniMode ? 'w-6 h-6' : 'w-8 h-8'} rounded border-2 transition-all ${
                    buttonColor === option.value ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.name}
                />
              ))}
            </div>
          </div>

          {/* Active Drag Icon */}
          <div 
            className={`bg-blue-600 bg-opacity-80 rounded-lg cursor-grab hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2 ${miniMode ? 'p-2' : 'p-3'}`}
            onMouseDown={handleMouseDown}
          >
            <svg viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000" className={miniMode ? 'w-4 h-4' : 'w-6 h-6'}>
              <g>
                <path fill="#ffffff" d="M16 8l-3-3v2h-4v-4h2l-3-3-3 3h2v4h-4v-2l-3 3 3 3v-2h4v4h-2l3 3 3-3h-2v-4h4v2z"></path>
              </g>
            </svg>
            <span className={`text-white font-medium ${miniMode ? 'text-xs' : 'text-sm'}`}>Zvarrit për të rregulluar</span>
          </div>
          
          {/* Save Changes Button */}
          <Button 
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            aria-busy={isSaving}
            className={`bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 ${miniMode ? 'px-3 py-1.5 text-xs' : 'px-4 py-2'}`}
          >
            <Save className={miniMode ? 'w-3 h-3' : 'w-4 h-4'} />
            {isSaving ? 'Duke ruajtur…' : 'Ruaj ndryshimet'}
          </Button>

          {/* Cancel Changes Button */}
          <Button 
            type="button"
            onClick={handleCancelChanges}
            disabled={isSaving}
            variant="outline"
            className={`bg-red-600 hover:bg-red-700 text-white border-red-600 rounded-lg flex items-center gap-1 ${miniMode ? 'px-2 py-1.5' : 'px-3 py-2'}`}
          >
            <X className={miniMode ? 'w-3 h-3' : 'w-4 h-4'} />
          </Button>
        </div>
      )}

      {/* Edit Icon - Only show when not in drag mode */}
      {!isDragMode && (
        <div 
          className={`bg-black bg-opacity-30 rounded-lg cursor-pointer hover:bg-opacity-50 transition-all duration-200 ${miniMode ? 'p-2' : 'p-3'}`}
          onClick={handleEditCoverClick}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={miniMode ? 'w-4 h-4' : 'w-6 h-6'}>
            <g>
              <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M14.35 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V9" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M22.3098 3.16996L17.2098 8.26005C16.7098 8.77005 15.2098 8.99996 14.8698 8.66996C14.5298 8.33996 14.7598 6.82999 15.2698 6.31999L20.3599 1.23002C20.6171 0.964804 20.9692 0.812673 21.3386 0.807047C21.7081 0.80142 22.0646 0.942731 22.3298 1.19999C22.5951 1.45725 22.7472 1.8093 22.7529 2.17875C22.7585 2.5482 22.6171 2.90475 22.3599 3.16996H22.3098Z" stroke="#e6e6e6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
          </svg>
        </div>
      )}
    </div>
  );
};

export default CoverPhotoControls;
