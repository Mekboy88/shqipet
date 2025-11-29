
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const GeneralModuleControlPage: React.FC = () => {
  return (
    <AdminLayout title="Module Control" subtitle="Enable or disable platform modules and features">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Module Control</h3>
          <p className="text-gray-600">All module control content has been removed as requested.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GeneralModuleControlPage;
