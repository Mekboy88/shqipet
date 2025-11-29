
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Pencil, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileActionsProps {
  onAddStoryClick: () => void;
  onEditProfileClick: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  onAddStoryClick,
  onEditProfileClick
}) => {
  const navigate = useNavigate();

  const handleEditProfileClick = () => {
    navigate('/profile/settings?section=general');
  };

  return (
    <>
      <div className="flex gap-2 mt-4 md:mt-0 my-[4px] py-0">
        <Button 
          className="bg-gradient-to-r from-[#ff2b2b] to-[#8b0000] hover:from-[#d92525] hover:to-[#700000]"
          onClick={onAddStoryClick}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Shto rrëfim
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-gray-100 hover:bg-gray-200"
          onClick={handleEditProfileClick}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Ndrysho profilin
        </Button>
        
        <Button variant="outline" className="bg-gray-100 hover:bg-gray-200 px-[11px]">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ProfileActions;
