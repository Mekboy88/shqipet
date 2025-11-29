import React from 'react';

interface CustomMyPointsIconProps {
  className?: string;
}

const CustomMyPointsIcon: React.FC<CustomMyPointsIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 1024 1024" 
      className={className} 
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#F44336"></path>
        <path d="M512 234.666667l83.2 168.533333 185.6 27.733333-134.4 130.133334 32 185.6-166.4-87.466667-166.4 87.466667 32-185.6-134.4-130.133334 185.6-27.733333z" fill="#FFCA28"></path>
      </g>
    </svg>
  );
};

export default CustomMyPointsIcon;