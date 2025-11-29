
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import AdminSidebarLogo from './AdminSidebarLogo';

const AdminSidebarHeader: React.FC = () => {
  const { open } = useSidebar();
  
  return (
    <div className="h-14 flex items-center justify-center border-b border-gray-200 overflow-hidden transition-all duration-300 ease-out">
      <AdminSidebarLogo open={open} />
    </div>
  );
};

export default AdminSidebarHeader;
