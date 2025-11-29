import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, AlertCircle, X } from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`
      w-full
      /* Mobile first - vertical stack */
      flex flex-col gap-3
      /* Tablet - two column max */
      md:grid md:grid-cols-2 md:gap-4
      /* Desktop - flexible rows with wider layout */
      lg:flex lg:flex-row lg:gap-6 lg:items-start
      xl:gap-8
      ${className}
    `}>
      {children}
    </div>
  );
};

interface DevicePreviewProps {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  children: React.ReactNode;
}

export const DevicePreview: React.FC<DevicePreviewProps> = ({ deviceType, children }) => {
  const deviceStyles = {
    mobile: 'w-64 h-96 bg-gray-900 rounded-3xl p-2',
    tablet: 'w-80 h-64 bg-gray-800 rounded-2xl p-3',
    desktop: 'w-96 h-56 bg-gray-700 rounded-lg p-4'
  };

  const screenStyles = {
    mobile: 'w-full h-full bg-white rounded-2xl overflow-hidden',
    tablet: 'w-full h-full bg-white rounded-xl overflow-hidden', 
    desktop: 'w-full h-full bg-white rounded overflow-hidden'
  };

  const icons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  const Icon = icons[deviceType];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <Icon className="h-4 w-4" />
        {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
      </div>
      <div className={deviceStyles[deviceType]}>
        <div className={screenStyles[deviceType]}>
          <div className="p-2 h-full overflow-hidden text-xs">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};