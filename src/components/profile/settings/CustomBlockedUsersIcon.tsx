import React from 'react';

interface CustomBlockedUsersIconProps {
  className?: string;
}

const CustomBlockedUsersIcon: React.FC<CustomBlockedUsersIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg viewBox="0 0 400 400.00001" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0 -652.36)">
        {/* Background circle */}
        <circle 
          style={{
            display: "inline", 
            opacity: 1, 
            fill: "#ff8282", 
            fillOpacity: 1, 
            stroke: "none"
          }} 
          cx="199.99959" 
          cy="852.35999" 
          r="197.29538" 
        />
        
        {/* Block/prohibition symbol */}
        <path 
          d="m 199.99908,694.52368 c -87.05304,0 -157.836303,70.78264 -157.836303,157.8363 0,87.05382 70.783263,157.83632 157.836303,157.83632 87.05303,0 157.8363,-70.7825 157.8363,-157.83632 0,-87.05366 -70.78327,-157.8363 -157.8363,-157.8363 z m 0,19.72954 c 34.63717,0 66.2581,12.68893 90.47492,33.68053 L 95.573002,942.83538 c -20.992228,-24.21809 -33.680688,-55.83791 -33.680688,-90.4754 0,-76.39103 61.715576,-138.10676 138.106766,-138.10676 z m 104.42607,47.63136 c 20.99223,24.21809 33.68069,55.83791 33.68069,90.4754 0,76.39119 -61.71557,138.10676 -138.10676,138.10676 -34.63718,0 -66.25653,-12.68893 -90.47493,-33.68053 l 194.901,-194.90163 z" 
          style={{
            color: "#000000",
            fill: "#ffffff",
            fillOpacity: 1,
            stroke: "none"
          }}
        />
      </g>
    </svg>
  );
};

export default CustomBlockedUsersIcon;