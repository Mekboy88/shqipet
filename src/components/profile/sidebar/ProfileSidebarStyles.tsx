
import React from 'react';

const ProfileSidebarStyles: React.FC = () => {
  return (
    <style>
      {`
        .profile-sidebar {
          max-width: 540px; /* Increased from 432px back to 540px for more horizontal space */
          /* Custom scrollbar styling */
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        .profile-sidebar::-webkit-scrollbar {
          width: 0px;
          display: none;
        }
        
        .profile-sidebar::-webkit-scrollbar-track {
          display: none;
        }
        
        .profile-sidebar::-webkit-scrollbar-thumb {
          display: none;
        }
      `}
    </style>
  );
};

export default ProfileSidebarStyles;
