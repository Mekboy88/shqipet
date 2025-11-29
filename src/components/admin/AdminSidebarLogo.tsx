
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { Logo } from '@/components/common/Logo';

interface AdminSidebarLogoProps {
  open: boolean;
}

const AdminSidebarLogo: React.FC<AdminSidebarLogoProps> = ({ open }) => {
  const { setOpen } = useSidebar();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent sidebar click handler
    setOpen(!open); // Toggle sidebar state
  };

  return (
    <div className="flex items-center justify-center relative w-full h-12">
      {/* Single logo container with overflow hidden for smooth sliding */}
      <div 
        onClick={handleLogoClick}
        className="cursor-pointer h-12 flex items-center justify-center overflow-hidden"
        style={{ width: open ? '200px' : '48px' }} // Smooth width transition
      >
        <div 
          className="transition-transform duration-300 ease-out flex items-center justify-center h-full"
          style={{
            transform: open ? 'translateX(0px)' : 'translateX(-152px)', // Slide to show only "S"
            width: '200px' // Fixed width for the text container
          }}
        >
          <span className="logo-text admin-logo-text">
            <span className="inline-block text-[32px] font-bold font-cinzel whitespace-nowrap">
              {Array.from('Shqipet').map((char, i) => (
                <span 
                  key={i} 
                  className="inline-block hover:text-rose-500 transition-colors"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </span>
        </div>
        
        {/* Standalone S letter that appears when sidebar is closed */}
        <div 
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
            open ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="logo-text admin-logo-text text-[32px] font-bold font-cinzel hover:text-rose-500 transition-colors cursor-pointer">
            S
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarLogo;
