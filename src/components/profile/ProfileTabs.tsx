
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import TabsList from './tabs/TabsList';
import ActionsButton from './tabs/ActionsButton';
import useTabsStyles from './tabs/useTabsStyles';
import { TabsListStyles } from './tabs/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabsListStyles: TabsListStyles;
  setIsEditingProfile: (isEditing: boolean) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  tabsListStyles,
  setIsEditingProfile
}) => {
  const isMobile = useIsMobile();

  // Use the custom hook for global tabs styling
  useTabsStyles(tabsListStyles);
  
  return (
    <div className="w-full flex flex-col items-center px-0 overflow-hidden relative z-20" style={{ borderTop: 'none', borderBottom: 'none' }}>
      <div className="flex justify-center w-full" style={{ borderTop: 'none', borderBottom: 'none' }}>
        <div className={`w-full max-w-[${tabsListStyles.maxWidth}px] flex justify-between items-center`} style={{ borderTop: 'none', borderBottom: 'none' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1" style={{ borderTop: 'none', borderBottom: 'none' }}>
            <TabsList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabsListStyles={tabsListStyles}
            />
          </Tabs>
          <ActionsButton setIsEditingProfile={setIsEditingProfile} />
        </div>
      </div>
    </div>
  );
};

export default ProfileTabs;
