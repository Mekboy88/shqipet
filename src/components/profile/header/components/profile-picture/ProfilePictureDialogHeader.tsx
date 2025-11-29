
import React from 'react';
import { X } from 'lucide-react';

interface ProfilePictureDialogHeaderProps {
  onClose: () => void;
}

export const ProfilePictureDialogHeader: React.FC<ProfilePictureDialogHeaderProps> = ({
  onClose
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Zgjidh foton e profilit</h2>
      <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
};
