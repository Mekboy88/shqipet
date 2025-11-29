
import React from 'react';
import { TabsList as ShadcnTabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsListStyles } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TabsListProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  tabsListStyles: TabsListStyles;
}

const TabsList: React.FC<TabsListProps> = ({
  activeTab,
  setActiveTab,
  tabsListStyles
}) => {
  return (
    <ScrollArea className="w-full max-h-[60px] overflow-x-visible">
      <ShadcnTabsList 
        className={`
          bg-transparent border-0 p-0 h-14 
          flex items-center justify-${tabsListStyles.justifyContent} gap-1
          overflow-${tabsListStyles.overflow}
        `}
        style={{ borderTop: 'none', borderBottom: 'none', border: 'none' }}
      >
        <TabsTrigger
          value="posts"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          Posts
        </TabsTrigger>
        
        <TabsTrigger
          value="about"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          About
        </TabsTrigger>
        
        <TabsTrigger
          value="friends"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          Friends
        </TabsTrigger>
        
        <TabsTrigger
          value="photos"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          Photos
        </TabsTrigger>
        
        <TabsTrigger
          value="videos"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          Videos
        </TabsTrigger>
        
        <TabsTrigger
          value="reels"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          Reels
        </TabsTrigger>
        
        <TabsTrigger
          value="more"
          className={`
            h-14 rounded-none px-4 font-medium text-sm data-[state=active]:bg-transparent 
            data-[state=active]:text-blue-600 data-[state=active]:shadow-none
            data-[state=active]:border-blue-600 data-[state=active]:border-b-[3px]
            hover:bg-gray-100 text-gray-600
          `}
          style={{ borderTop: 'none' }}
        >
          More
        </TabsTrigger>
      </ShadcnTabsList>
    </ScrollArea>
  );
};

export default TabsList;
