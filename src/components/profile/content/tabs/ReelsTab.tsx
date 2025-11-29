
import React from 'react';
import EmptyTabContent from '@/components/profile/EmptyTabContent';

const ReelsTab: React.FC = () => {
  return (
    <EmptyTabContent 
      title="Reels" 
      description="Reels you create will appear here" 
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 md:h-16 md:w-16 text-gray-300 mb-4">
          <path d="m22 8-6 4 6 4V8Z"></path>
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
        </svg>
      } 
    />
  );
};

export default ReelsTab;
