
import React from 'react';
import { X } from 'lucide-react';

interface PhotoEditDialogHeaderProps {
  onClose: () => void;
}

export const PhotoEditDialogHeader: React.FC<PhotoEditDialogHeaderProps> = ({
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Zgjidh foton e profilit</h2>
      <button 
        onClick={onClose} 
        className="p-1 rounded-full transition-colors bg-gray-300 hover:bg-gray-200"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};
