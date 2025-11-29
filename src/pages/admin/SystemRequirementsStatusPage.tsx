
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SystemRequirementsStatus from './SystemRequirementsStatus';

const SystemRequirementsStatusPage: React.FC = () => {
  return (
    <AdminLayout>
      <SystemRequirementsStatus />
    </AdminLayout>
  );
};

export default SystemRequirementsStatusPage;
