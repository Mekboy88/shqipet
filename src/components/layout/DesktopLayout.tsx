
import React from 'react';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  return (
    <div className="desktop-layout min-h-screen bg-gray-200 w-full">
      <div className="desktop-container w-full min-w-0 max-w-none">
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;
