
import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  isDarkTheme: boolean;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, isDarkTheme }) => {
  const textColor = isDarkTheme ? 'text-white' : 'text-[#2C2928]';
  
  return (
    <h3 className={`text-[20px] font-semibold ${textColor} mb-4 font-sans`}>{children}</h3>
  );
};
