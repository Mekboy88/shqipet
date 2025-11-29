
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminUserActions: React.FC = () => {
  return (
    <AdminLayout title="User Actions" subtitle="Monitor and manage user activities">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">User Actions</h3>
          <p className="text-gray-600">All user actions content has been removed as requested.</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserActions;
