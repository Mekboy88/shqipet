
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Role, ALL_PERMISSIONS, PERMISSION_CATEGORIES, PermissionCategory } from '@/types/role';
import { formatDistanceToNow } from 'date-fns';
import { Shield, Calendar, User, CheckCircle, XCircle, File, Users } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RoleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

export const RoleDetails: React.FC<RoleDetailsProps> = ({ isOpen, onClose, role }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Group permissions by category for display
  const permissionsByCategory = ALL_PERMISSIONS
    .filter(p => role.permissions.includes(p.id))
    .reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = [];
      }
      acc[permission.category].push(permission);
      return acc;
    }, {} as Record<PermissionCategory, typeof ALL_PERMISSIONS>);
  
  // Sample mock users with this role (in a real app, this would come from your backend)
  const mockUsers = Array.from({ length: Math.min(5, role.userCount) }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    assignedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  }));
  
  // Sample mock audit entries for this role
  const mockAuditLogs = [
    {
      id: 'audit-1',
      action: 'Created Role',
      timestamp: role.createdAt,
      admin: role.createdBy,
      details: `Role '${role.name}' was created`,
      ipAddress: '192.168.1.1',
    },
    {
      id: 'audit-2',
      action: 'Updated Permissions',
      timestamp: role.updatedAt,
      admin: role.updatedBy,
      details: `Permissions were updated for role '${role.name}'`,
      ipAddress: '192.168.1.2',
    },
    {
      id: 'audit-3',
      action: 'Assigned User',
      timestamp: new Date(Date.now() - 2000000000).toISOString(),
      admin: {
        id: 'admin-2',
        name: 'John Admin',
      },
      details: `User 'User 3' was assigned the '${role.name}' role`,
      ipAddress: '192.168.1.3',
    },
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle>{role.name}</DialogTitle>
            <Badge
              variant={role.active ? "default" : "secondary"}
              className="ml-2"
            >
              {role.active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users ({role.userCount})</TabsTrigger>
            <TabsTrigger value="audit">Audit History</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 pt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Role Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-md bg-slate-50">
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{role.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(role.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{role.createdBy.name}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(new Date(role.updatedAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Permissions</h3>
              <div className="space-y-4">
                {PERMISSION_CATEGORIES.map(category => {
                  const categoryPermissions = permissionsByCategory[category.id as PermissionCategory];
                  
                  if (!categoryPermissions || categoryPermissions.length === 0) {
                    return null;
                  }
                  
                  return (
                    <div key={category.id} className="rounded-md border p-4">
                      <h4 className="text-md font-medium mb-2">{category.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {categoryPermissions.map(permission => (
                          <div key={permission.id} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{permission.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(permissionsByCategory).length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <XCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p>This role has no permissions assigned</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 pt-4">
            <h3 className="text-lg font-medium">Users with this Role</h3>
            
            {mockUsers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Assigned</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDistanceToNow(new Date(user.assignedAt), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                <p>No users with this role</p>
              </div>
            )}
            
            {role.userCount > 5 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm">
                  View All {role.userCount} Users
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Audit Log</h3>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Action</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead className="hidden md:table-cell">IP Address</TableHead>
                  <TableHead className="w-[150px]">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAuditLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[250px] truncate">
                      {log.details}
                    </TableCell>
                    <TableCell>{log.admin.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{log.ipAddress}</TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={() => {
            onClose();
            // This would lead to opening the edit dialog in a real implementation
          }}>
            Edit Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
