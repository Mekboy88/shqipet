
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Filter, 
  UserCheck,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

// Layout and UI Components
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Custom components
import { ImpersonationTable } from './components/ImpersonationTable';
import { ImpersonationModal } from './components/ImpersonationModal';

// Types and hooks
import type { ImpersonateReasons } from './types/impersonation-types';
import { useImpersonationLogic } from './hooks/useImpersonationLogic';
import { useUsersList } from './hooks/useUsersList';

// Main component
const AdminUserImpersonate: React.FC = () => {
  const impersonation = useImpersonationLogic();
  const usersList = useUsersList();
  
  // Predefined reasons for impersonation
  const impersonateReasons: ImpersonateReasons = {
    'technical-issue': 'Technical Issue Investigation',
    'bug-verification': 'User-reported Bug Verification',
    'account-support': 'Account Management/Support',
    'compliance-check': 'Compliance Check/Audit',
    'other': 'Other (please specify)',
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    usersList.updateFilters({ ...usersList.filters, search: e.target.value });
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    usersList.updateFilters({ ...usersList.filters, [key]: value });
  };

  // Start impersonation with session data
  const handleStartImpersonation = async (reason: string) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData.session?.user.id;
    
    if (!adminId) {
      console.error('Admin ID not found');
      return;
    }
    
    await impersonation.startImpersonation(reason, adminId);
  };

  // Calculate total pages for pagination
  const totalPages = Math.ceil(usersList.totalCount / usersList.pageSize);

  return (
    <AdminLayout 
      title="Impersonate User" 
      subtitle="Log in as a user to troubleshoot and provide support"
    >
      {/* Impersonation Banner (when active) */}
      {impersonation.isImpersonating && impersonation.currentUser && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 mb-6 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            <span className="font-medium">
              You are currently impersonating: {' '}
              <strong>{impersonation.currentUser.username || impersonation.currentUser.email}</strong>
            </span>
          </div>
          <Button 
            onClick={impersonation.endImpersonation} 
            variant="default"
          >
            End Impersonation
          </Button>
        </div>
      )}

      {/* Search and filters bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            placeholder="Search by username, email, or ID..."
            className="pl-10"
            value={usersList.filters.search || ''}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter size={16} />
                Filter
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={() => handleFilterChange('accountStatus', 'active')}>
                Active Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('accountStatus', 'suspended')}>
                Suspended Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange('accountStatus', 'deactivated')}>
                Deactivated Users
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => usersList.updateFilters({})}>
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Warning notice */}
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 mb-6 rounded-md flex items-start">
        <ShieldAlert className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium mb-1">Important Security Notice</h3>
          <p className="text-sm">
            User impersonation is strictly for troubleshooting and support purposes. All actions performed while 
            impersonating will be logged and audited. Use this feature responsibly and only when necessary.
          </p>
        </div>
      </div>
      
      {/* Users table */}
      <ImpersonationTable
        users={usersList.users}
        loading={usersList.loading}
        isImpersonating={impersonation.isImpersonating}
        onImpersonateClick={impersonation.openModal}
      />

      {/* Pagination */}
      {!usersList.loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {Math.min((usersList.page - 1) * usersList.pageSize + 1, usersList.totalCount)} to {Math.min(usersList.page * usersList.pageSize, usersList.totalCount)} of {usersList.totalCount} users
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => usersList.setPage(p => Math.max(1, p - 1))}
              disabled={usersList.page === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNumber = usersList.page <= 3 
                ? i + 1 
                : usersList.page >= totalPages - 2 
                  ? totalPages - 4 + i
                  : usersList.page - 2 + i;
                  
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={usersList.page === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => usersList.setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => usersList.setPage(p => Math.min(totalPages, p + 1))}
              disabled={usersList.page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Impersonation Modal */}
      <ImpersonationModal
        isOpen={impersonation.isModalOpen}
        onClose={impersonation.closeModal}
        selectedUser={impersonation.selectedUser}
        onStartImpersonation={handleStartImpersonation}
        impersonateReasons={impersonateReasons}
      />
    </AdminLayout>
  );
};

export default AdminUserImpersonate;
