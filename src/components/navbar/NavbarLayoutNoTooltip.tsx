import React from "react";
import NavbarLeftContent from "./NavbarLeftContent";
import NavbarCenterSectionNoTooltip from "./NavbarCenterSectionNoTooltip";
import NavbarRightContent from "./NavbarRightContent";
const NavbarLayoutNoTooltip = () => {
  console.log('🏗️ NavbarLayoutNoTooltip rendering');
  return <nav className="flex items-center w-full h-14 relative py-0 px-2 sm:px-4 md:px-6 max-w-none mx-auto">
      {/* Left Section - Logo - Responsive width */}
      <div className="flex items-center flex-shrink-0 w-auto sm:w-[180px] lg:w-[220px] xl:w-[280px]">
        <NavbarLeftContent />
      </div>
      
      {/* Center Section - Navigation - Fully flexible and centered */}
      <div className="flex-1 flex items-center justify-center min-w-0 mx-2 sm:mx-4 lg:ml-[320px] lg:mr-[20px]">
        <NavbarCenterSectionNoTooltip />
      </div>
      
      {/* Right Section - Actions - Responsive width */}
      <div className="flex items-center justify-end flex-shrink-0 w-auto sm:w-[180px] lg:w-[220px] xl:w-[280px]">
        <NavbarRightContent />
      </div>
    </nav>;
};
export default NavbarLayoutNoTooltip;