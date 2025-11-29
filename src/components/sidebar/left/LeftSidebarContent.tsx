import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DropdownSection from './DropdownSection';
import NavigationButtons from './NavigationButtons';
const LeftSidebarContent: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const handleItemClick = (item: string) => {
    if (item === 'Reels') {
      navigate('/interesante');
    } else if (item === 'Shiko') {
      navigate('/watch');
    } else {
      console.log(`Clicked: ${item}`);
    }
  };
  const handleDropdownItemClick = (item: string) => {
    console.log(`Dropdown clicked: ${item}`);
    setIsDropdownOpen(false);
  };
  return <div className="bg-card rounded-lg border border-border shadow-sm h-full overflow-hidden mx-px px-[7px]">
      <DropdownSection isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} onDropdownItemClick={handleDropdownItemClick} />
      
      <div className="overflow-y-auto h-full custom-scrollbar">
        <NavigationButtons onItemClick={handleItemClick} />
      </div>
    </div>;
};
export default LeftSidebarContent;