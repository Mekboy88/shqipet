
import React from 'react';
import { useBreakpoint } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

interface ResponsiveAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveAppLayout: React.FC<ResponsiveAppLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const location = useLocation();
  const isMarketplace = location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/');

  return (
    <div className={`min-h-screen ${isMarketplace ? 'bg-transparent' : 'bg-background'} w-full ${className}`}>
      <div className="w-full max-w-none mx-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveAppLayout;
