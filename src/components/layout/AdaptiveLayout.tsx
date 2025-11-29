
import React from 'react';
import { useBreakpoint } from '@/hooks/use-mobile';

interface AdaptiveLayoutProps {
  children: React.ReactNode;
  mobileLayout?: React.ComponentType<{ children: React.ReactNode }>;
  tabletLayout?: React.ComponentType<{ children: React.ReactNode }>;
  laptopLayout?: React.ComponentType<{ children: React.ReactNode }>;
  desktopLayout?: React.ComponentType<{ children: React.ReactNode }>;
  className?: string;
}

const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  mobileLayout: MobileLayout,
  tabletLayout: TabletLayout,
  laptopLayout: LaptopLayout,
  desktopLayout: DesktopLayout,
  className = ''
}) => {
  const { isMobile, isTablet, isLaptop, isDesktop } = useBreakpoint();

  // Determine which layout component to use based on unified breakpoints
  let LayoutComponent: React.ComponentType<{ children: React.ReactNode }> | null = null;

  if (isMobile && MobileLayout) {
    LayoutComponent = MobileLayout;
  } else if (isTablet && TabletLayout) {
    LayoutComponent = TabletLayout;
  } else if (isLaptop && LaptopLayout) {
    LayoutComponent = LaptopLayout;
  } else if (isDesktop && DesktopLayout) {
    LayoutComponent = DesktopLayout;
  }

  // If no specific layout is provided, use a default responsive container
  if (!LayoutComponent) {
    return (
      <div className={`adaptive-layout ${className}`}>
        <div className="container mx-auto px-responsive">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`adaptive-layout ${className}`}>
      <LayoutComponent>
        {children}
      </LayoutComponent>
    </div>
  );
};

export default AdaptiveLayout;
