import React from 'react';
import { UserPlus, MessageCircle, MoreHorizontal, Edit, Camera } from 'lucide-react';

interface ProfileActionButtonsProps {
  isOwnProfile?: boolean;
}

const ProfileActionButtons: React.FC<ProfileActionButtonsProps> = ({ 
  isOwnProfile = true 
}) => {
  if (isOwnProfile) {
    return null;
  }

  return (
    <div className="absolute top-6 right-6 flex items-center space-x-3">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-2 transform hover:-translate-y-0.5">
        <UserPlus className="w-4 h-4" />
        <span>Ndiq</span>
      </button>
      
      <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md border border-white/50 flex items-center space-x-2 transform hover:-translate-y-0.5">
        <MessageCircle className="w-4 h-4" />
        <span>Mesazh</span>
      </button>
      
      <button className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-white/50 transform hover:-translate-y-0.5">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProfileActionButtons;