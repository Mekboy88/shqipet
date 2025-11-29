
import React from 'react';
import AdminLoginFactory from '@/components/admin/AdminLoginFactory';
import { Shield } from 'lucide-react';

const ModeratorLogin: React.FC = () => {
  return (
    <AdminLoginFactory
      adminEmail="moderator@shqipet.com" // Replace with actual moderator email
      allowedRole="moderator"
      portalTitle="Moderator Portal"
      portalIcon={<Shield className="h-6 w-6 text-blue-600" />}
      colorScheme={{
        primary: '#2563eb',
        secondary: '#1d4ed8',
        background: '#f8fafc'
      }}
    />
  );
};

export default ModeratorLogin;
