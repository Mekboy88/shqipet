// User Details Dialog - uses useUserQueries for logs/actions

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { UserProfile, UserActivityLog, AdminAction, formatBytes } from '@/types/user';
import { useUserQueries } from '@/hooks/users';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface UserDetailsDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: UserProfile) => void;
}

export function UserDetailsDialog({
  user,
  isOpen,
  onClose,
  onEdit
}: UserDetailsDialogProps) {
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const [adminActions, setAdminActions] = useState<AdminAction[]>([]);
  const [activeTab, setActiveTab] = useState('personal');
  const { fetchUserActivityLogs, fetchAdminActions } = useUserQueries({
    setUsers: () => {},
    setLoading: () => {},
    setTotalCount: () => {},
    page: 1,
    pageSize: 10,
    filters: {}
  });

  useEffect(() => {
    if (isOpen && user) {
      const loadLogs = async () => {
        const logs = await fetchUserActivityLogs(user.id);
        setActivityLogs(logs);
      };
      
      const loadAdminActions = async () => {
        const actions = await fetchAdminActions(user.id);
        setAdminActions(actions);
      };
      
      loadLogs();
      loadAdminActions();
    }
  }, [isOpen, user, fetchUserActivityLogs, fetchAdminActions]);

  if (!user) return null;

  const storagePercentage = user.storage_limit 
    ? Math.min(100, (user.storage_used || 0) / user.storage_limit * 100) 
    : 0;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={user.profile_image_url || user.profile_photo_url || ''} 
                alt={user.username || 'User'} 
              />
              <AvatarFallback>
                {(user.first_name?.[0] || '') + (user.last_name?.[0] || '') || 'U'}
              </AvatarFallback>
            </Avatar>
            {fullName}
            <Badge variant={user.account_status === 'active' ? 'default' : 'destructive'} className="ml-2">
              {user.account_status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            User ID: <span className="font-mono">{user.id}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="storage">Storage & Account</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>User's personal details and profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Full Name</h4>
                    <p className="text-base">{fullName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Username</h4>
                    <p className="text-base">{user.username || 'Not set'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{user.email || 'Not provided'}</p>
                      {user.email_verified !== undefined && (
                        <Badge variant={user.email_verified ? 'default' : 'outline'}>
                          {user.email_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phone Number</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{user.phone_number || 'Not provided'}</p>
                      {user.phone_verified !== undefined && (
                        <Badge variant={user.phone_verified ? 'default' : 'outline'}>
                          {user.phone_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Phone Number</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{user.phone_number || 'Not provided'}</p>
                      {user.phone_verified !== undefined && (
                        <Badge variant={user.phone_verified ? 'default' : 'outline'}>
                          {user.phone_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                    <p className="text-base">
                      {user.date_of_birth 
                        ? format(new Date(user.date_of_birth), 'MMMM dd, yyyy')
                        : 'Not provided'
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                    <p className="text-base capitalize">{user.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Nationality</h4>
                    <p className="text-base">{user.nationality || 'Not specified'}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Languages</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.languages && user.languages.length > 0 ? (
                      user.languages.map((lang, i) => (
                        <Badge key={i} variant="outline">{lang}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No languages specified</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
                <CardDescription>User's recent activities and system logs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Recent activity logs for this user.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>User Agent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            {log.created_at 
                              ? format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')
                              : 'Unknown'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.details ? JSON.stringify(log.details) : 'No details'}</TableCell>
                          <TableCell className="font-mono text-xs">{log.ip_address || 'N/A'}</TableCell>
                          <TableCell className="text-xs">{log.user_agent || 'Unknown'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No activity logs found for this user.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
                <CardDescription>Actions performed on this user account by administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Admin actions on this account.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Action Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Admin ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminActions.length > 0 ? (
                      adminActions.map((action) => (
                        <TableRow key={action.id}>
                          <TableCell>
                            {action.created_at 
                              ? format(new Date(action.created_at), 'yyyy-MM-dd HH:mm:ss')
                              : 'Unknown'
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              action.action_type.includes('suspend') ? 'destructive' : 'outline'
                            }>
                              {action.action_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{action.reason || 'No reason provided'}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {action.actor_id ? action.actor_id.substring(0, 8) + '...' : 'Unknown'}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No admin actions recorded for this user.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Security settings and login information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Login</h4>
                    <p className="text-base">
                      {user.last_login 
                        ? format(new Date(user.last_login), 'yyyy-MM-dd HH:mm:ss')
                        : 'Never logged in'
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Account Created</h4>
                    <p className="text-base">
                      {user.created_at 
                        ? format(new Date(user.created_at), 'yyyy-MM-dd HH:mm:ss')
                        : 'Unknown'
                      }
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Two-Factor Authentication</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-base">{user.two_factor_enabled ? 'Enabled' : 'Disabled'}</p>
                      <Badge variant={user.two_factor_enabled ? 'default' : 'outline'}>
                        {user.two_factor_enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Registration Method</h4>
                    <p className="text-base">{user.registration_method || 'Email/Password'}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last IP Address</h4>
                    <p className="text-base font-mono text-xs">{user.last_ip_address || 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Device</h4>
                    <p className="text-base">{user.last_device || 'Unknown'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Last Location</h4>
                    <p className="text-base">{user.last_location || 'Unknown'}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Connected Apps</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {user.connected_apps && user.connected_apps.length > 0 ? (
                      user.connected_apps.map((app, i) => (
                        <Badge key={i} variant="outline">{app}</Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No connected apps</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account & Storage</CardTitle>
                <CardDescription>Subscription and storage information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Primary Role</h4>
                    <div className="flex items-center gap-2">
                      <p className="text-base capitalize">{user.primary_role || 'User'}</p>
                      <Badge variant={user.primary_role === 'platform_owner_root' ? 'default' : 'outline'}>
                        {user.primary_role || 'user'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Subscription Expires</h4>
                    <p className="text-base">
                      {user.subscription_expiry 
                        ? format(new Date(user.subscription_expiry), 'MMMM dd, yyyy')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Storage Usage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Used: {formatBytes(user.storage_used || 0)}</span>
                      <span>
                        Limit: {formatBytes(user.storage_limit || 1073741824)}
                      </span>
                    </div>
                    <Progress value={storagePercentage} className="w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => user && onEdit(user)}>Edit User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
