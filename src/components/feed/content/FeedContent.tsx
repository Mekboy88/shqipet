
import React from 'react';
import MainFeedContent from './MainFeedContent';

interface FeedContentProps {
  showPiP?: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

const FeedContent: React.FC<FeedContentProps> = ({ showPiP = false, scrollContainerRef }) => {
  return (
    <MainFeedContent 
      showPiP={showPiP}
      scrollContainerRef={scrollContainerRef}
    />
  );
};

export default FeedContent;
