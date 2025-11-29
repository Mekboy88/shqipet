
import React from 'react';

interface LaptopLayoutProps {
  children: React.ReactNode;
}

const LaptopLayout: React.FC<LaptopLayoutProps> = ({ children }) => {
  return (
    <div className="laptop-layout min-h-screen bg-gray-100 w-full">
      <div className="laptop-container w-full min-w-0 max-w-none">
        <div className="w-full h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LaptopLayout;
