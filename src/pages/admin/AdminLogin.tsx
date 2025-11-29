import React from 'react';
import AdminLoginFactory from '@/components/admin/AdminLoginFactory';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const { user, userProfile } = useAuth();
  
  // Platform owner login portal
  const adminEmail = user?.email || userProfile?.email || "admin@shqipet.com";
  return (
    <div className="relative">
      <AdminLoginFactory
        adminEmail={adminEmail}
        allowedRole="platform_owner_root"
        portalTitle="Admin Portal"
        portalIcon={<Shield className="h-6 w-6 text-blue-600" />}
        colorScheme={{
          primary: '#2563eb',
          secondary: '#1d4ed8',
          background: '#f8fafc'
        }}
      />
    </div>
  );
};

export default AdminLogin;
