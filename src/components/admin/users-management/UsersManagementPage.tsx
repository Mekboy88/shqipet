// DO NOT EDIT: Critical Admin pagination & auto-recovery. Changing this can reintroduce 'pageSize is not defined' crashes.

/**
 * DO NOT EDIT. This file is locked to maintain perfect sync with SuperBase/Supabase and Admin Settings. 
 * Changes will break real-time accuracy.
 */

import React, { useState, useEffect } from 'react';
import { useAdminUsers } from '@/lib/data/userOverview';
import { useUserMutations } from '@/hooks/users/use-user-mutations';
import { useAdminPagination, sanitizePagination, syncPaginationToUrl, persistPagination } from '@/lib/pagination';
import { AdminErrorBoundary } from '@/components/ErrorBoundary/AdminErrorBoundary';
import { DataLoadingBanner } from '@/hooks/admin/useAdminQuery';

// Runtime lock protection
if (typeof window !== 'undefined' && 
    typeof import.meta !== 'undefined' && 
    import.meta.env?.DEV && 
    import.meta.env?.LOCK_SYNC_FILES === 'true') {
  console.error('🔒 DO NOT CHANGE THIS. This file should not be changed ever.');
}
import AdminLayout from '@/components/admin/AdminLayout';
import { UsersHeader } from './UsersHeader';
import { UsersFiltersSection } from './UsersFiltersSection';
import { UsersBulkActionsSection } from './UsersBulkActionsSection';
import { UsersTableSection } from './UsersTableSection';
import { UsersPaginationSection } from './UsersPaginationSection';
import { UsersDialogSection } from './UsersDialogSection';
import { UserStatsCards } from './UserStatsCards';
import { UserActionPanel } from './UserActionPanel';

export default function UsersManagementPage() {
  // Safe pagination initialization
  const { initialPageSize, initialPage } = useAdminPagination();
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [page, setPage] = useState<number>(initialPage);
  
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    email_verified: undefined,
    phone_verified: undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
    accountStatus: 'all',
    emailVerification: 'all',
    phoneVerification: 'all',
    dateStart: null as Date | null,
    dateEnd: null as Date | null
  });
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Sync pagination changes to filters, URL, and storage
  useEffect(() => {
    const safePagination = sanitizePagination({ page, pageSize });
    
    if (safePagination.page !== page) setPage(safePagination.page);
    if (safePagination.pageSize !== pageSize) setPageSize(safePagination.pageSize);
    
    setFilters(prev => ({
      ...prev,
      limit: safePagination.pageSize,
      offset: (safePagination.page - 1) * safePagination.pageSize
    }));
    
    syncPaginationToUrl(safePagination);
    persistPagination(safePagination);
  }, [page, pageSize]);
  
  // Use real-time admin users data with safe error handling
  const { users: adminUsers, isLoading, error, refreshAdminUsers } = useAdminUsers(filters);
  
  const users = adminUsers || [];
  const totalCount = users.length;
  const loading = isLoading;

  // Add debugging for admin users data
  console.log('🔍 Admin Users Page Debug:', {
    adminUsers,
    usersCount: users.length,
    totalCount,
    loading,
    error,
    filters
  });

  const { updateUser, resetPassword } = useUserMutations();

  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [statusChangeUser, setStatusChangeUser] = useState<any | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<string | null>(null);
  
  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const handleEditUser = async (updatedUser: any) => {
    updateUser(updatedUser);
  };
  
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // Placeholder for delete functionality
      console.log('Delete user:', userId);
    }
  };

  const handleResetPassword = async (userId: string, reason: string) => {
    resetPassword({ userId, reason });
  };

  const handleSelectUser = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };
  
  const handleSelectAllUsers = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSortColumn = (column: string) => {
    setFilters({
      ...filters,
      sortBy: column,
      sortOrder: filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1);
  };

  const handleDateChange = (key: string, date: Date | null) => {
    setFilters({ ...filters, [key]: date });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      email_verified: undefined,
      phone_verified: undefined,
      limit: pageSize,
      offset: 0,
      sortBy: 'created_at',
      sortOrder: 'desc' as 'asc' | 'desc',
      accountStatus: 'all',
      emailVerification: 'all',
      phoneVerification: 'all',
      dateStart: null as Date | null,
      dateEnd: null as Date | null
    });
    setPage(1);
  };

  const handleStatusChange = async (userId: string, status: string, reason: string) => {
    // Placeholder for status change functionality
    console.log('Status change:', { userId, status, reason });
  };

  const handleRoleChange = async (userId: string, role: string) => {
    // Placeholder for role change functionality
    console.log('Role change:', { userId, role });
    await refreshAdminUsers();
  };

  // Placeholder functions for missing functionality
  const exportUserData = (format: string) => {
    console.log('Export data:', format);
  };

  const bulkUpdateStatus = (userIds: string[], status: string, reason: string) => {
    console.log('Bulk update:', { userIds, status, reason });
  };

  return (
    <AdminErrorBoundary>
      <AdminLayout 
        title="User Management"
        subtitle="Manage and monitor all user accounts"
      >
        <UserStatsCards />
        
        <DataLoadingBanner 
          isLoading={loading} 
          error={error} 
          hasData={users.length > 0} 
        />
        
        {/* Debug info for admin */}
        {import.meta.env.DEV && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-4">
            <h4 className="font-semibold text-blue-900">Admin Debug Info:</h4>
            <div className="text-sm text-blue-800 mt-2">
              <p>Users loaded: {users.length}</p>
              <p>Total count: {totalCount}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Error: {error ? error.message : 'None'}</p>
              <button 
                onClick={() => refreshAdminUsers()} 
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Force Refresh Data
              </button>
            </div>
          </div>
        )}
        
        <div className="w-full overflow-hidden">
          <UsersHeader onExportCSV={() => exportUserData('csv')} onExportJSON={() => exportUserData('json')} />

          <div className="space-y-4 max-w-full overflow-x-auto pb-4">
            <UsersFiltersSection
              search={filters.search || ''}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
              onDateChange={handleDateChange}
              onResetFilters={handleResetFilters}
              accountStatus={filters.accountStatus || 'all'}
              emailVerification={filters.emailVerification || 'all'}
              phoneVerification={filters.phoneVerification || 'all'}
              role={filters.role || 'all'}
              dateStart={filters.dateStart}
              dateEnd={filters.dateEnd}
            />
            
            {users.length === 0 && !loading && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <p className="text-yellow-800 text-center">
                  No users found. Try adjusting your filters.
                </p>
              </div>
            )}
            
            {selectedUsers.length > 0 && (
              <UsersBulkActionsSection
                selectedCount={selectedUsers.length}
                onActivateUsers={(reason) => bulkUpdateStatus(selectedUsers, 'active', reason)}
                onSuspendUsers={(reason) => bulkUpdateStatus(selectedUsers, 'suspended', reason)}
                onDeactivateUsers={(reason) => bulkUpdateStatus(selectedUsers, 'deactivated', reason)}
                onExportCSV={() => exportUserData('csv')}
                onExportJSON={() => exportUserData('json')}
                onClearSelection={() => setSelectedUsers([])}
              />
            )}
            
            <UsersTableSection
              users={users as any}
              selectedUsers={selectedUsers}
              onSelectUser={handleSelectUser}
              onSelectAllUsers={handleSelectAllUsers}
              onViewDetails={setViewingUser}
              onEditUser={setEditingUser}
              onDeleteUser={handleDeleteUser}
              onResetPassword={setResetPasswordUserId}
              onChangeStatus={setStatusChangeUser}
              isAllSelected={users.length > 0 && selectedUsers.length === users.length}
              sortColumn={handleSortColumn}
              sortOrder={filters.sortOrder || 'desc'}
              sortBy={filters.sortBy || 'created_at'}
              loading={loading}
            />
            
            {totalPages > 1 && (
              <UsersPaginationSection
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                setPage={setPage}
              />
            )}
            
            <UsersDialogSection
              viewingUser={null}
              editingUser={editingUser}
              statusChangeUser={statusChangeUser}
              resetPasswordUserId={resetPasswordUserId}
              onCloseViewDialog={() => setViewingUser(null)}
              onCloseEditDialog={() => setEditingUser(null)}
              onCloseStatusDialog={() => setStatusChangeUser(null)}
              onCloseResetDialog={() => setResetPasswordUserId(null)}
              onEditUser={setEditingUser}
              onSaveUser={handleEditUser}
              onStatusChange={handleStatusChange}
              onResetPassword={handleResetPassword}
            />
            
            <UserActionPanel 
              user={viewingUser}
              onClose={() => setViewingUser(null)}
              onStatusChange={handleStatusChange}
              onRoleChange={handleRoleChange}
            />
          </div>
        </div>
      </AdminLayout>
    </AdminErrorBoundary>
  );
}