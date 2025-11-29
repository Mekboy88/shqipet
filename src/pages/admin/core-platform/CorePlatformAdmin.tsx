import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const CorePlatformAdmin: React.FC = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">🛡️ Admin</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Under Construction</h2>
          <p className="text-yellow-700">This feature is currently being developed and will be available soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CorePlatformAdmin;