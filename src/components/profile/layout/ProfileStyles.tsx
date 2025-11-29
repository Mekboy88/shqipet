
import React from 'react';

const ProfileStyles: React.FC = () => {
  return (
    <style>
      {`
        /* SIMPLIFIED PROFILE STYLES - FLEXIBLE LAYOUT LIKE MAIN PAGE */
        
        /* Keep profile container scrollable */
        .profile-scroll-container {
          overflow-y: auto !important;
          scrollbar-width: none !important;
        }
        
        .profile-scroll-container::-webkit-scrollbar {
          display: none !important;
        }

        /* SIMPLE FLEXIBLE LAYOUT - NO FIXED WIDTHS */
        .profile-cover-container,
        .profile-info-container {
          width: auto !important;
          max-width: 1200px !important;
          margin: 0 auto !important;
        }

        /* REMOVE ALL COMPLEX RESPONSIVE OVERRIDES */
        /* Let Tailwind and natural CSS flow handle responsiveness */
      `}
    </style>
  );
};

export default ProfileStyles;
