
import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle,
  XCircle,
  User,
  Edit,
  Lock,
  Shield,
  AlertTriangle,
  Eye,
  Settings,
  Copy
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Avatar from '@/components/Avatar';
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface AdminUsersTableProps {
  users: UserProfile[];
  selectedUsers: string[];
  onSelectUser: (userId: string, isSelected: boolean) => void;
  onSelectAllUsers: (isSelected: boolean) => void;
  onViewDetails: (user: UserProfile) => void;
  onEditUser: (user: UserProfile) => void;
  onResetPassword: (userId: string) => void;
  onChangeStatus: (user: UserProfile) => void;
  onViewPermissions: (user: UserProfile) => void;
  isAllSelected: boolean;
  sortColumn: (column: string) => void;
  sortOrder: 'asc' | 'desc';
  sortBy: string;
  loading: boolean;
}

export function AdminUsersTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAllUsers,
  onViewDetails,
  onEditUser,
  onResetPassword,
  onChangeStatus,
  onViewPermissions,
  isAllSelected,
  sortColumn,
  sortOrder,
  sortBy,
  loading
}: AdminUsersTableProps) {
  // Helper function to render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  // Helper function to render verification status with clear verified/unverified labels
  const renderVerificationStatus = (isVerified: boolean | undefined | null) => {
    if (isVerified === true) {
      return (
        <span className="flex items-center text-green-600 font-medium">
          <CheckCircle className="w-4 h-4 mr-1" /> Verified
        </span>
      );
    } else {
      return (
        <span className="flex items-center text-red-600 font-medium">
          <XCircle className="w-4 h-4 mr-1" /> Unverified
        </span>
      );
    }
  };

  // Helper function to render phone number separately
  const renderPhoneNumber = (phone: string | null) => {
    return (
      <div className="text-sm text-gray-900">
        {phone || 'N/A'}
      </div>
    );
  };

  // Helper function to render account status
  const renderAccountStatus = (status: string | null) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active ✅</Badge>;
      case 'deactivated':
        return <Badge className="bg-yellow-500">Deactivated ⚠️</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">Suspended 🚫</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500">Pending ⏳</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  // Helper function to render admin role badge
  const renderRoleBadge = (role: string | null) => {
    switch(role) {
      case 'supreme_super_admin':
        return <Badge className="bg-[#E2725B] text-white">Supreme Super Admin</Badge>;
      case 'super_admin':
        return <Badge className="bg-[#E17B7B] text-white">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-[#FF6B5A] text-white">Admin</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-600">Moderator</Badge>;
      case 'support':
        return <Badge className="bg-green-600">Support</Badge>;
      default:
        return <Badge className="bg-gray-600">{role || 'Unknown'}</Badge>;
    }
  };

  // Helper function to copy user ID to clipboard
  const copyUserIdToClipboard = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      toast.success('User ID copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy user ID:', error);
      toast.error('Failed to copy user ID');
    }
  };

  // Helper function to copy email to clipboard
  const copyEmailToClipboard = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy email:', error);
      toast.error('Failed to copy email');
    }
  };

  // Helper function to copy phone number to clipboard
  const copyPhoneToClipboard = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success('Phone number copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy phone number:', error);
      toast.error('Failed to copy phone number');
    }
  };

  // Helper function to copy name to clipboard
  const copyNameToClipboard = async (firstName: string, lastName: string) => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
    try {
      await navigator.clipboard.writeText(fullName);
      toast.success('Name copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy name:', error);
      toast.error('Failed to copy name');
    }
  };

  // Render loading skeleton if loading
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4 mb-4">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border w-full">
        <ScrollArea className="w-full">
          <div className="min-w-full">
            <Table>
              <TableCaption>Admin users in the system ({users.length} total).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={isAllSelected}
                      onCheckedChange={onSelectAllUsers}
                      aria-label="Select all admin users"
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('id')}
                  >
                    Admin ID{renderSortIndicator('id')}
                  </TableHead>
                  <TableHead className="w-[100px]">Photo</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('first_name')}
                  >
                    Full Name{renderSortIndicator('first_name')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('username')}
                  >
                    Username{renderSortIndicator('username')}
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email Verification</TableHead>
                  <TableHead>Phone Verification</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('role')}
                  >
                    Admin Role{renderSortIndicator('role')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => sortColumn('account_status')}>
                    Status{renderSortIndicator('account_status')}
                  </TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('last_login')}
                  >
                    Last Active{renderSortIndicator('last_login')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer" 
                    onClick={() => sortColumn('created_at')}
                  >
                    Created{renderSortIndicator('created_at')}
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => onSelectUser(user.id, !!checked)}
                          aria-label={`Select admin ${user.username || user.id}`}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyUserIdToClipboard(user.id)}
                              className="flex items-center gap-1 hover:bg-green-50 hover:text-green-600 rounded px-1 py-0.5 transition-colors group"
                              title="Click to copy full User ID"
                            >
                              <span>{user.id.substring(0, 8)}...</span>
                              <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="h-10 w-10 cursor-pointer" onClick={() => onViewDetails(user)}>
                          <Avatar userId={user.id} size="md" className="h-10 w-10" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => copyNameToClipboard(user.first_name || '', user.last_name || '')}
                              className="hover:bg-green-50 hover:text-green-600 rounded px-1 py-0.5 transition-colors text-left"
                              title="Click to copy name"
                            >
                              {user.first_name || ''} {user.last_name || ''}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to copy</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium cursor-pointer hover:underline" onClick={() => onViewDetails(user)}>
                          {user.username || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.email && user.email !== 'N/A' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyEmailToClipboard(user.email!)}
                                className="text-sm text-gray-900 truncate hover:text-green-600 hover:bg-green-50 rounded px-1 py-0.5 transition-colors cursor-pointer"
                                title={user.email}
                              >
                                {user.email}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="text-sm text-gray-900 truncate">N/A</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.phone_number && user.phone_number !== 'N/A' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyPhoneToClipboard(user.phone_number!)}
                                className="text-sm text-gray-900 hover:text-green-600 hover:bg-green-50 rounded px-1 py-0.5 transition-colors cursor-pointer"
                              >
                                {user.phone_number}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Click to copy</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <div className="text-sm text-gray-900">N/A</div>
                        )}
                      </TableCell>
                      <TableCell>{renderVerificationStatus(user.email_verified)}</TableCell>
                      <TableCell>{renderVerificationStatus(user.phone_verified)}</TableCell>
                      <TableCell>
                        {renderRoleBadge(user.role)}
                      </TableCell>
                      <TableCell>{renderAccountStatus(user.account_status)}</TableCell>
                      <TableCell>
                        {user.two_factor_enabled ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {user.last_login
                              ? format(new Date(user.last_login), 'MMM dd, yyyy')
                              : 'Never'
                            }
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.last_login
                              ? (
                                <div className="space-y-1 text-xs">
                                  <p>{format(new Date(user.last_login), 'MMM dd, yyyy HH:mm:ss')}</p>
                                  <p>IP: {user.last_ip_address || 'Unknown'}</p>
                                  <p>Device: {user.last_device || 'Unknown'}</p>
                                  <p>Location: {user.last_location || 'Unknown'}</p>
                                </div>
                              )
                              : 'Never logged in'
                            }
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            {user.created_at 
                              ? format(new Date(user.created_at), 'MMM dd, yyyy')
                              : 'N/A'
                            }
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Created at: {user.created_at
                              ? format(new Date(user.created_at), 'MMM dd, yyyy HH:mm')
                              : 'Unknown'
                            }</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onViewDetails(user)}
                            title="View Admin Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEditUser(user)}
                            title="Edit Admin"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onResetPassword(user.id)}
                            title="Reset Password"
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onViewPermissions(user)}
                            title="Manage Permissions"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onChangeStatus(user)}
                            title={user.account_status === 'active' ? "Suspend/Deactivate" : "Activate"}
                          >
                            {user.account_status === 'active' ? (
                              <AlertTriangle className="h-4 w-4" />
                            ) : (
                              <Shield className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-8">
                      No admin users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
