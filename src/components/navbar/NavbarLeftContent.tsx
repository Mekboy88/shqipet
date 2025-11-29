
import React from "react";
import NavbarLogo from "./NavbarLogo";

const NavbarLeftContent = () => {
  return (
    <div className="flex items-center pl-0 space-x-4">
      <div className="flex-shrink-0">
        <NavbarLogo />
      </div>
    </div>
  );
};

export default NavbarLeftContent;
