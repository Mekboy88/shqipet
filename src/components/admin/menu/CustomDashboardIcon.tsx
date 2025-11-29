import React, { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';

export const CustomDashboardIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ size = 24, color = "currentColor", strokeWidth = 2, absoluteStrokeWidth, className, ...props }, ref) => {
    return (
      <svg 
        ref={ref}
        fill="currentColor" 
        viewBox="0 0 24 24" 
        width={size}
        height={size}
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <g>
          <path 
            d="M22,4V7a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h5A2,2,0,0,1,22,4ZM9,15H4a2,2,0,0,0-2,2v3a2,2,0,0,0,2,2H9a2,2,0,0,2-2V17A2,2,0,0,0,9,15Z" 
            style={{fill: '#2ca9bc'}}
          />
          <path 
            d="M11,4v7a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2H9A2,2,0,0,1,11,4Zm9,7H15a2,2,0,0,0-2,2v7a2,2,0,0,0,2,2h5a2,2,0,0,2-2V13A2,2,0,0,0,20,11Z" 
            style={{fill: 'currentColor'}}
          />
        </g>
      </svg>
    );
  }
);

CustomDashboardIcon.displayName = "CustomDashboardIcon";