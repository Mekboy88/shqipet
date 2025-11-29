
import React from "react";
import NavbarLayoutNoTooltip from "./navbar/NavbarLayoutNoTooltip";

const NavbarNoTooltip = React.memo(() => {
  console.log('🚀 NavbarNoTooltip main component rendering');
  
  return (
    <header 
      className="bg-card shadow-sm fixed top-0 w-full border-b border-border"
      style={{
        transition: 'none',
        transform: 'translate3d(0, 0, 0)',
        willChange: 'auto',
        zIndex: 1000,
        position: 'fixed',
        maxWidth: '100vw',
        overflowX: 'hidden'
      }}
    >
      <NavbarLayoutNoTooltip />
    </header>
  );
});

NavbarNoTooltip.displayName = 'NavbarNoTooltip';

export default NavbarNoTooltip;
