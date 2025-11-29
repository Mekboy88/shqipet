import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const GeneralConfiguration: React.FC = () => {
  return (
    <AdminLayout title="General Configuration" subtitle="Configure platform settings and modules">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">General Configuration</h3>
          <p className="text-gray-600">All configuration content has been removed as requested.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GeneralConfiguration;
