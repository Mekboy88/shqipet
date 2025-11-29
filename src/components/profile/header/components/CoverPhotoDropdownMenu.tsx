import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import PhotoSelectionDialog from './PhotoSelectionDialog';
import DropdownMenuItems from './DropdownMenuItems';

// Camera Icon from uploaded image
const UploadedCameraIcon = ({
  className,
  size = 16
}: {
  className?: string;
  size?: number;
}) => {
  return <img src="/lovable-uploads/bfdcb155-1df0-4a9a-bc25-a4bbcc90b97a.png" alt="Camera" className={className} width={size} height={size} />;
};
interface CoverPhotoDropdownMenuProps {
  onUploadClick: () => void;
  onRepositionClick: () => void;
  onRemoveClick: () => void;
  hasCoverPhoto?: boolean;
  onPhotoSelect?: (photoUrl: string) => void;
}
const CoverPhotoDropdownMenu: React.FC<CoverPhotoDropdownMenuProps> = ({
  onUploadClick,
  onRepositionClick,
  onRemoveClick,
  hasCoverPhoto = false,
  onPhotoSelect
}) => {
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const handleChooseCoverPhoto = () => {
    setShowPhotoDialog(true);
  };
  const handleClosePhotoDialog = () => {
    setShowPhotoDialog(false);
  };
  return <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="absolute right-4 bottom-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 shadow-md cursor-pointer focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 focus:border-0 active:border-0 px-2">
            <UploadedCameraIcon size={32} />
            <span>Ndrysho foton e kopertinës</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="w-96 bg-white shadow-lg border border-gray-200 rounded-lg z-50 p-1 px-0 mx-0 py my-[-9px] py-0">
          <DropdownMenuItems onChooseCoverPhoto={handleChooseCoverPhoto} onUploadClick={onUploadClick} onRepositionClick={onRepositionClick} onRemoveClick={onRemoveClick} hasCoverPhoto={hasCoverPhoto} />
        </DropdownMenuContent>
      </DropdownMenu>

      {showPhotoDialog && <PhotoSelectionDialog onClose={handleClosePhotoDialog} onUploadClick={onUploadClick} onPhotoSelect={onPhotoSelect} />}
    </>;
};
export default CoverPhotoDropdownMenu;