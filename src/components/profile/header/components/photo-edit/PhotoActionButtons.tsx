import React from 'react';
import { Crop, Clock } from 'lucide-react';
interface PhotoActionButtonsProps {
  isTemporary: boolean;
  onTemporaryToggle: () => void;
}
export const PhotoActionButtons: React.FC<PhotoActionButtonsProps> = ({
  isTemporary,
  onTemporaryToggle
}) => {
  return <div className="flex items-center gap-4 mb-6 z-10 relative mx-[161px]">
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300 my-[15px]">
        <Crop className="w-4 h-4" />
        Prit foton
      </button>
      
      <button onClick={onTemporaryToggle} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors border ${isTemporary ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'}`}>
        <Clock className="w-4 h-4" />
        Bëje të përkohshme
      </button>
    </div>;
};