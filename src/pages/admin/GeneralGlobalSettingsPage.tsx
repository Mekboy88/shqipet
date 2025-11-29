
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const GeneralGlobalSettingsPage: React.FC = () => {
  return (
    <AdminLayout title="Global System Settings" subtitle="Control overall platform availability and basic configuration">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Global System Settings</h3>
          <p className="text-gray-600">All global settings content has been removed as requested.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GeneralGlobalSettingsPage;
