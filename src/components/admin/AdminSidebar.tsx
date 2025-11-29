
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '@/components/ui/sidebar';
import AdminSidebarHeader from './AdminSidebarHeader';
import AdminSidebarUserInfo from './AdminSidebarUserInfo';
import AdminSidebarMenu from './AdminSidebarMenu';

const AdminSidebar: React.FC = () => {
  const { open, setOpen } = useSidebar();
  
  const handleSidebarClick = (e: React.MouseEvent) => {
    // Close sidebar when clicking inside it (except on interactive elements)
    if (open && !e.defaultPrevented) {
      setOpen(false);
    }
  };
  
  return (
    <div className="relative">
      <Sidebar 
        className={`${open ? 'w-64' : 'w-16'} transition-all duration-300 ease-out bg-white text-gray-800 overflow-hidden`} 
        collapsible="icon" 
        side="left"
        onClick={handleSidebarClick}
      >
        <SidebarHeader>
          <AdminSidebarHeader />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-[calc(100vh-56px)] py-[5px] overflow-hidden" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <style>{`
            .sidebar-content::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="flex-1 overflow-y-auto">
            <AdminSidebarMenu />
          </div>
          <div className="mt-auto">
            <AdminSidebarUserInfo />
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AdminSidebar;
