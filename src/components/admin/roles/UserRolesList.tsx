import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, UserX, Clock, AlertCircle } from 'lucide-react';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { UserRoleWithDetails } from '@/types/rbac';
import { format } from 'date-fns';
import supabase from '@/lib/relaxedSupabase';

export function UserRolesList() {
  const { revokeUserRole, loading } = useRoleManagement();
  const [userRoles, setUserRoles] = useState<UserRoleWithDetails[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<UserRoleWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchAllUserRoles();
  }, []);

  useEffect(() => {
    const filtered = userRoles.filter(userRole =>
      userRole.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userRole.role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userRole.scope_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [userRoles, searchTerm]);

  const fetchAllUserRoles = async () => {
    try {
      setFetchLoading(true);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          roles!inner(*)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUserRoles(data as UserRoleWithDetails[]);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    const success = await revokeUserRole(userRoleId);
    if (success) {
      // Refresh the list
      fetchAllUserRoles();
    }
  };

  const isExpired = (expiresAt: string | null) => {
    return expiresAt ? new Date(expiresAt) < new Date() : false;
  };

  const isExpiringSoon = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    const expiry = new Date(expiresAt);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return expiry <= sevenDaysFromNow && expiry > now;
  };

  const getScopeBadgeVariant = (scopeType: string) => {
    switch (scopeType) {
      case 'global': return 'default';
      case 'regional': return 'secondary';
      case 'resource': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleBadgeVariant = (level: number) => {
    if (level >= 90) return 'destructive';
    if (level >= 70) return 'secondary';
    if (level >= 40) return 'default';
    return 'outline';
  };

  if (fetchLoading) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading user role assignments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Role Assignments</CardTitle>
          <CardDescription>
            View and manage all active role assignments across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user ID, role name, or scope..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredRoles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No role assignments match your search.' : 'No active role assignments found.'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Granted</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.map((userRole) => (
                    <TableRow key={userRole.id}>
                      <TableCell className="font-mono text-xs">
                        {userRole.user_id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{userRole.role.name}</div>
                          <Badge variant={getRoleBadgeVariant(userRole.role.level)} className="text-xs">
                            Level {userRole.role.level}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={getScopeBadgeVariant(userRole.scope_type)} className="text-xs">
                            {userRole.scope_type}
                          </Badge>
                          {userRole.scope_value && (
                            <div className="text-xs text-muted-foreground">
                              {userRole.scope_value}
                            </div>
                          )}
                          {userRole.resource_type && (
                            <div className="text-xs text-muted-foreground">
                              {userRole.resource_type}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(userRole.granted_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {userRole.expires_at ? (
                          <div className="space-y-1">
                            <div className={`text-xs ${
                              isExpired(userRole.expires_at) 
                                ? 'text-destructive' 
                                : isExpiringSoon(userRole.expires_at)
                                ? 'text-yellow-600'
                                : 'text-muted-foreground'
                            }`}>
                              {format(new Date(userRole.expires_at), 'MMM d, yyyy')}
                            </div>
                            {isExpired(userRole.expires_at) && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Expired
                              </Badge>
                            )}
                            {isExpiringSoon(userRole.expires_at) && !isExpired(userRole.expires_at) && (
                              <Badge variant="outline" className="text-xs text-yellow-600">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires Soon
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No expiration</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevokeRole(userRole.id)}
                          disabled={loading}
                          className="text-xs"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}