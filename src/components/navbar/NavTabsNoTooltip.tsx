import React from "react";
import { useLocation } from "react-router-dom";
import HomeButtonNoTooltip from "./HomeButtonNoTooltip";
import WatchButtonNoTooltip from "./WatchButtonNoTooltip";
import MarketplaceButtonNoTooltip from "./MarketplaceButtonNoTooltip";
import GroupsButtonNoTooltip from "./GroupsButtonNoTooltip";
import GamingButtonNoTooltip from "./GamingButtonNoTooltip";
import SearchBar from "./SearchBar";

const NavTabsNoTooltip = React.memo(() => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div 
      className="flex items-center justify-center h-full w-full"
      style={{
        transition: 'none',
        willChange: 'auto'
      }}
    >
      <div 
        className="flex justify-center items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6"
        style={{
          transition: 'transform 0.3s ease-in-out',
          transform: currentPath === "/profile" ? 'translateX(-15%)' : 'none',
          willChange: 'auto'
        }}
      >
        <HomeButtonNoTooltip active={currentPath === "/"} />
        <WatchButtonNoTooltip active={currentPath === "/watch"} />
        <MarketplaceButtonNoTooltip active={currentPath === "/marketplace"} />
        <GroupsButtonNoTooltip active={currentPath === "/groups"} />
        <GamingButtonNoTooltip active={currentPath === "/gaming"} />
        <div className="ml-1">
          <SearchBar />
        </div>
      </div>
    </div>
  );
});

NavTabsNoTooltip.displayName = 'NavTabsNoTooltip';

export default NavTabsNoTooltip;