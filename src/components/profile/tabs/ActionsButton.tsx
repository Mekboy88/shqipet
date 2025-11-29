
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ActionsButtonProps {
  setIsEditingProfile: (isEditing: boolean) => void;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({
  setIsEditingProfile
}) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    navigate('/profile/settings?section=general');
  };

  return (
    <>
      <div className="flex items-center px-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gray-100 hover:bg-gray-200 border-gray-200 rounded-md"
          onClick={handleEditClick}
        >
          <Pencil className="h-5 w-5 mr-1" />
          <span>Ndrysho profilin</span>
        </Button>
      </div>
    </>
  );
};

export default ActionsButton;
