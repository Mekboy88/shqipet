
import React from 'react';

interface ProfileScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ProfileScrollContainer: React.FC<ProfileScrollContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  // Simple container - no custom scrolling logic
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export default ProfileScrollContainer;
