
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const ToggleFeatures: React.FC = () => {
  return (
    <AdminLayout title="Enable / Disable Features" subtitle="Control which features are active">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Feature Toggle Management</h3>
          <p className="text-gray-600">Enable or disable various platform features to customize your website's functionality.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ToggleFeatures;
