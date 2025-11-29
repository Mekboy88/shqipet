
import React from 'react';
import Avatar from '@/components/Avatar';
import { useUniversalUser } from '@/hooks/useUniversalUser';

interface NavigationProfileProps {
  userProfilePhoto?: string;
  userName?: string;
  isNavigationSticky: boolean;
}

const NavigationProfile: React.FC<NavigationProfileProps> = ({
  isNavigationSticky
}) => {
  // Use the global avatar system for 100% synchronization
  const { displayName } = useUniversalUser();

  return (
    <div className="flex items-center" style={{
      // Align with the Posts button positioning
      marginLeft: '0px',
      paddingLeft: '17px', // Match the NavigationTabs padding
      height: '40px', // Match navigation height
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.2s ease-in-out'
    }}>
      <div className="flex items-center" style={{
        transition: 'all 0.2s ease-in-out'
      }}>
        <Avatar 
          size="sm"
          className="mr-3"
          style={{
            transition: 'all 0.2s ease-in-out'
          }}
        />
        <span className="text-lg font-semibold" style={{
          transition: 'all 0.2s ease-in-out'
        }}>{displayName || "User"}</span>
      </div>
    </div>
  );
};

export default NavigationProfile;
