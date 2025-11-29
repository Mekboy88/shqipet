
import React from 'react';
import { Upload, Plus, Pencil } from 'lucide-react';

interface ProfilePictureDialogTabsProps {
  activeTab: 'upload' | 'frame';
  onTabChange: (tab: 'upload' | 'frame') => void;
  onUploadClick: () => void;
  onFrameClick: () => void;
  onEditClick: () => void;
}

export const ProfilePictureDialogTabs: React.FC<ProfilePictureDialogTabsProps> = ({
  activeTab,
  onTabChange,
  onUploadClick,
  onFrameClick,
  onEditClick
}) => {
  return (
    <div className="flex items-center justify-center gap-3 p-4 mx-[4px] px-[16px] my-0 py-[17px]">
      <button 
        onClick={onUploadClick} 
        className={`flex items-center justify-center gap-2 flex-1 py-3 text-sm font-medium text-center transition-all duration-200 rounded-xl ${
          activeTab === 'upload' 
            ? 'text-red-700 bg-gradient-to-r from-red-50 via-red-100 to-red-200 shadow-md border border-red-300' 
            : 'text-gray-900 bg-gray-100 hover:bg-gray-200 shadow-sm border border-gray-200'
        }`}
      >
        <Upload className="w-4 h-4" />
        Ngarko foto
      </button>
      
      <button 
        onClick={onFrameClick}
        className={`flex items-center justify-center gap-2 flex-1 py-3 text-sm font-medium text-center transition-all duration-200 rounded-xl ${
          activeTab === 'frame' 
            ? 'text-blue-600 bg-blue-50 shadow-md border border-blue-200' 
            : 'text-gray-900 bg-gray-100 hover:bg-gray-200 shadow-sm border border-gray-200'
        }`}
      >
        <Plus className="w-4 h-4" />
        Shto kornizë
      </button>
      
      <button 
        onClick={onEditClick}
        className="flex items-center justify-center flex-1 py-3 text-gray-900 bg-gray-100 hover:bg-gray-200 transition-all duration-200 rounded-xl shadow-sm border border-gray-200 text-center text-sm font-medium" 
        title="Ndrysho"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
};
