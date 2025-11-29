
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface TabContentProps {
  contentId: string;
  active: string;
  children: React.ReactNode;
}

const TabContent: React.FC<TabContentProps> = ({
  contentId,
  active,
  children
}) => {
  const isActive = active === contentId;
  
  return (
    <TabsContent 
      value={contentId} 
      className={`w-full p-0 m-0 ${isActive ? 'block' : 'hidden'}`}
    >
      {children}
    </TabsContent>
  );
};

export default TabContent;
