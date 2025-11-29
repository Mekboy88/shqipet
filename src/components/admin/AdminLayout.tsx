
import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "Dashboard", 
  subtitle = "Welcome to the admin panel" 
}) => {
  return (
    <div className="w-full px-4 md:px-6 mx-auto">
      <div className="space-y-4 w-full">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
