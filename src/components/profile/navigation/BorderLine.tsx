
import React, { useEffect } from 'react';

interface BorderLineProps {
  className?: string;
  activeTab?: string;
  borderColor?: string;
  borderWidth?: string;
  marginTop?: string;
  id?: string;
  width?: string;
  marginLeft?: string;
  marginRight?: string;
}

const BorderLine: React.FC<BorderLineProps> = ({
  className = "",
  activeTab = 'posts',
  borderColor = "border-gray-300",
  borderWidth = "border-t",
  marginTop = "mt-0",
  id = "profile-border-line",
  width = "w-full",
  marginLeft = "ml-0",
  marginRight = "mr-0"
}) => {
  // Console logging to identify this border
  useEffect(() => {
    console.log('🚫 Profile Navigation BorderLine component DISABLED - will not render');
  }, []);

  // Component completely disabled - returns nothing
  return null;
};

export default BorderLine;
