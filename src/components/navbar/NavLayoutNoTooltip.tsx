
import React from "react";
import { Link } from "react-router-dom";
import NavbarCenterSectionNoTooltip from "./NavbarCenterSectionNoTooltip";
import NavbarRightContent from "./NavbarRightContent";

const NavbarLayoutNoTooltip = React.memo(() => {
  return (
    <div 
      className="w-full max-w-none mx-auto h-14 flex items-center justify-between navbar-container"
      style={{
        transition: 'none',
        transform: 'translateZ(0)',
        willChange: 'auto'
      }}
    >
      {/* Left Section - Logo - Responsive width */}
      <div className="flex items-center flex-shrink-0" style={{ width: 'clamp(200px, 25vw, 280px)' }}>
        <Link 
          to="/" 
          className="flex items-center pl-2"
          style={{
            textDecoration: 'none',
            transition: 'none'
          }}
        >
          <img 
            src="/lovable-uploads/b8d269d6-1084-4534-a631-78ffaec299eb.png" 
            alt="Shqipet Chat" 
            className="h-10 w-auto object-contain"
            style={{
              transition: 'none',
              transform: 'translateZ(0)'
            }}
          />
        </Link>
      </div>

      {/* Center Section - Navigation - Fully flexible */}
      <div className="flex-1 flex items-center justify-center min-w-0">
        <NavbarCenterSectionNoTooltip />
      </div>

      {/* Right Section - Actions - Responsive width */}
      <div className="flex items-center justify-end flex-shrink-0" style={{ width: 'clamp(200px, 25vw, 280px)' }}>
        <NavbarRightContent />
      </div>
    </div>
  );
});

NavbarLayoutNoTooltip.displayName = 'NavbarLayoutNoTooltip';

export default NavbarLayoutNoTooltip;
