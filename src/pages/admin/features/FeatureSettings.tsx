
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const FeatureSettings: React.FC = () => {
  return (
    <AdminLayout title="Feature Settings" subtitle="Configure feature-specific options">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Feature Configuration</h3>
          <p className="text-gray-600">Configure detailed settings for individual features and modules.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FeatureSettings;
