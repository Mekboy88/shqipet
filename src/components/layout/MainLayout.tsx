
import React from 'react';
import { useBreakpoint } from '@/hooks/use-mobile';
import { Outlet, useLocation } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isMarketplace = location.pathname === '/marketplace' || location.pathname.startsWith('/marketplace/');
  const { isLaptopOrLarger } = useBreakpoint();
  return (
    <div className={`min-h-screen ${isMarketplace ? 'bg-transparent' : 'bg-background'} w-full border-r border-border`}>
      <div className="w-full max-w-none mx-auto">
        {/* Main content area - no sidebar here, it will be positioned within the feed */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
