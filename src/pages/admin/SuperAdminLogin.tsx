
import React from 'react';
import AdminLoginFactory from '@/components/admin/AdminLoginFactory';
import { Settings } from 'lucide-react';

const SuperAdminLogin: React.FC = () => {
  return (
    <AdminLoginFactory
      adminEmail="superadmin@shqipet.com" // Replace with actual super admin email
      allowedRole="super_admin"
      portalTitle="Super Admin Portal"
      portalIcon={<Settings className="h-6 w-6 text-[#E17B7B]" />}
      colorScheme={{
        primary: '#E17B7B',
        secondary: '#D16B6B',
        background: '#fff8f8'
      }}
    />
  );
};

export default SuperAdminLogin;
