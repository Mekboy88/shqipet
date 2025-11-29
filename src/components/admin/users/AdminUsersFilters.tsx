
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  accountStatusOptions, 
  verificationStatusOptions 
} from '@/types/user';

interface AdminUsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  accountStatus: string;
  emailVerification: string;
  phoneVerification: string;
  role: string;
}

export function AdminUsersFilters({
  search,
  onSearchChange,
  onFilterChange,
  onResetFilters,
  accountStatus,
  emailVerification,
  phoneVerification,
  role
}: AdminUsersFiltersProps) {
  // Admin-specific role options - now includes supreme_super_admin
  const adminRoleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'supreme_super_admin', label: 'Supreme Super Admin' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' },
    { value: 'support', label: 'Support' }
  ];

  return (
    <div className="space-y-4 bg-white p-4 rounded-md border">
      <div className="flex flex-wrap gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admins by name, email, ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        {/* Account Status Filter */}
        <div className="w-40">
          <Select 
            value={accountStatus} 
            onValueChange={(value) => onFilterChange('accountStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {accountStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Email Verification Filter */}
        <div className="w-40">
          <Select 
            value={emailVerification} 
            onValueChange={(value) => onFilterChange('emailVerification', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Email Status" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Phone Verification Filter */}
        <div className="w-40">
          <Select 
            value={phoneVerification} 
            onValueChange={(value) => onFilterChange('phoneVerification', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Phone Status" />
            </SelectTrigger>
            <SelectContent>
              {verificationStatusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Role Filter - Admin specific roles including supreme_super_admin */}
        <div className="w-40">
          <Select 
            value={role} 
            onValueChange={(value) => onFilterChange('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Admin Role" />
            </SelectTrigger>
            <SelectContent>
              {adminRoleOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Button */}
        <Button 
          variant="outline" 
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
