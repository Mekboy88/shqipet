
import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavButtonProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
  customActiveColor?: string;
  onClick?: () => void;
}

const NavButtonNoTooltip = React.memo(({ to, active = false, children, customActiveColor, onClick }: NavButtonProps) => {
  // Use the Home button icon color for all active borders by default
  const homeIconColor = '#1877F2';
  const activeColor = customActiveColor || homeIconColor;
  
  // Check if the active color is a gradient
  const isGradient = activeColor.includes('linear-gradient');
  
  // Add console log to debug
  console.log('NavButton active state:', active, 'for route:', to, 'using color:', activeColor);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`flex items-center justify-center h-14 w-[112px] relative transition-none ${
        active 
          ? 'hover:bg-secondary' 
          : 'hover:bg-secondary/85'
      }`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        transition: 'none',
        transform: 'translateZ(0)',
        willChange: 'auto',
        borderBottom: active ? (isGradient ? undefined : `3px solid ${activeColor}`) : undefined,
        backgroundImage: active && isGradient ? activeColor : undefined,
        backgroundSize: active && isGradient ? '100% 3px' : undefined,
        backgroundRepeat: active && isGradient ? 'no-repeat' : undefined,
        backgroundPosition: active && isGradient ? 'bottom' : undefined
      }}
    >
      <div className="flex items-center justify-center">
        {children}
      </div>
    </Link>
  );
});

NavButtonNoTooltip.displayName = 'NavButtonNoTooltip';

export default NavButtonNoTooltip;
