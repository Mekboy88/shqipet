
import React from "react";
import NavTabsNoTooltip from "./NavTabsNoTooltip";

const NavbarCenterSectionNoTooltip = React.memo(() => {
  return (
    <div 
      className="h-full flex items-center justify-center"
      style={{
        transition: 'none',
        willChange: 'auto',
        position: 'relative'
      }}
    >
      <NavTabsNoTooltip />
    </div>
  );
});

NavbarCenterSectionNoTooltip.displayName = 'NavbarCenterSectionNoTooltip';

export default NavbarCenterSectionNoTooltip;
