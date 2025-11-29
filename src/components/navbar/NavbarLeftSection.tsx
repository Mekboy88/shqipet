
import React from "react";
import NavbarLogo from "./NavbarLogo";

const NavbarLeftSection = () => {
  return (
    <div className="flex items-center pl-2">
      <div className="flex-shrink-0">
        <NavbarLogo />
      </div>
    </div>
  );
};

export default NavbarLeftSection;
