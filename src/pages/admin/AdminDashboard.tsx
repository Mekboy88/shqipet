
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardSettingsSheet from '@/components/admin/dashboard-settings/DashboardSettingsSheet';
import AdminErrorBoundary from '@/components/admin/AdminErrorBoundary';

import ShqipetAIInterface from '@/components/admin/shqipet/ShqipetAIInterface';
import ChatWindow from '@/components/admin/ChatWindow';

import { SidebarProvider } from '@/components/ui/sidebar';

const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const [shqipetModalOpen, setShqipetModalOpen] = useState(false);
  
  console.log('🚀 [DEBUG] AdminDashboard rendering with Luna AI Interface');
  console.log('🔧 [ROUTE-DEBUG] Current admin location:', location.pathname);

  const handleShqipetClick = () => {
    setShqipetModalOpen(true);
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-white overflow-hidden" style={{ borderLeft: 'none' }}>
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area - This is now the scroll container */}
        <div className="flex flex-col flex-1 transition-all duration-300 overflow-y-auto" style={{ borderLeft: 'none', marginLeft: 0 }}>
          {/* Admin Header/Navbar - Sticky at top of scroll container */}
          <div className="sticky top-0 z-30 bg-white">
            <AdminHeader />
          </div>
          
          {/* Content Area with Error Boundary */}
          <div className="flex-1 bg-gray-50 p-6 min-h-0">
            <AdminErrorBoundary>
              <Outlet key={location.pathname} />
            </AdminErrorBoundary>
          </div>
        </div>
        
        {/* Shqipet AI Interface - New Advanced Interface */}
        <ShqipetAIInterface 
          isVisible={shqipetModalOpen} 
          onClose={() => setShqipetModalOpen(false)} 
        />
        
        {/* Dashboard Settings Sheet */}
        <DashboardSettingsSheet />
        
        {/* Chat Window at Bottom of Page */}
        <ChatWindow />
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
