
import React from 'react';

interface BorderLineProps {
  borderWidth: number;
  maxWidth: number;
  transparent: boolean;
  activeTab: string;
}

const BorderLine: React.FC<BorderLineProps> = ({
  borderWidth = 95,
  maxWidth = 950,
  transparent = true,
  activeTab = 'posts'
}) => {
  // This component has been completely disabled to remove the grey line at the bottom
  console.log('🚫 Profile BorderLine component disabled - will not render anything');
  
  return null;
};

export default BorderLine;
