import React from 'react';

interface CustomSocialLinksIconProps {
  className?: string;
}

const CustomSocialLinksIcon: React.FC<CustomSocialLinksIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M14.5,9.5a3.54,3.54,0,0,1,0,5l-5,5a3.54,3.54,0,0,1-5,0h0a3.54,3.54,0,0,1,0-5" 
        stroke="#2ca9bc" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2"
      />
      <path 
        d="M19.5,9.5a3.54,3.54,0,0,0,0-5h0a3.54,3.54,0,0,0-5,0l-5,5a3.54,3.54,0,0,0,0,5h0" 
        stroke="#000000" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2"
      />
    </svg>
  );
};

export default CustomSocialLinksIcon;