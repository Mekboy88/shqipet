
import React from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
interface DropdownMenuItemsProps {
  onChooseCoverPhoto: () => void;
  onUploadClick: () => void;
  onRepositionClick: () => void;
  onRemoveClick: () => void;
  hasCoverPhoto: boolean;
}
const DropdownMenuItems: React.FC<DropdownMenuItemsProps> = ({
  onChooseCoverPhoto,
  onUploadClick,
  onRepositionClick,
  onRemoveClick,
  hasCoverPhoto
}) => {
  return <>
      <DropdownMenuItem onClick={onChooseCoverPhoto} className="px-3 text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none rounded-md transition-colors duration-150 flex items-center gap-3 mx-[15px] py-[5px]">
        <img src="/lovable-uploads/997db93f-9189-4e4b-83bb-e0e4ab88bfe1.png" alt="Zgjedh foton e kopertinës" className="w-8 h-8" />
        Zgjedh foton e kopertinës
      </DropdownMenuItem>
      
      <DropdownMenuItem onClick={onUploadClick} className="px-3 text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none rounded-md transition-colors duration-150 flex items-center gap-3 mx-[15px] py-[5px]">
        <img src="/lovable-uploads/97644cc0-2bd5-4b5e-9ea4-0e79e668c003.png" alt="Ngarko foto" className="w-8 h-8" />
        Ngarko foto
      </DropdownMenuItem>
      
      {hasCoverPhoto && <>
          <DropdownMenuItem onClick={onRepositionClick} className="px-3 text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none rounded-md transition-colors duration-150 flex items-center gap-3 mx-[15px] py-[5px]">
            <img src="/lovable-uploads/180ab2b8-03e3-446e-b233-b83f47160731.png" alt="Rivendos" className="w-8 h-8" />
            Rivendos
          </DropdownMenuItem>
          
          <div className="flex justify-center py-1 px-0 mx-[-25px]">
            <div className="w-4/5 h-px bg-gray-200 bg-gray-300"></div>
          </div>
          
          <DropdownMenuItem onClick={onRemoveClick} className="px-3 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer focus:bg-gray-100 focus:outline-none rounded-md transition-colors duration-150 flex items-center gap-3 mx-[15px]">
            <img src="/lovable-uploads/14bbee8c-16f1-450c-8466-1f1836312889.png" alt="Fshi" className="w-8 h-8" />
            Hiq
          </DropdownMenuItem>
        </>}
    </>;
};
export default DropdownMenuItems;
