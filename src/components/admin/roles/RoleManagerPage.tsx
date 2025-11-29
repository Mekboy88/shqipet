import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, Shield, Settings, Crown, AlertTriangle } from 'lucide-react';
import { useCapabilities } from '@/hooks/useCapabilities';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { CAPABILITY_CODES } from '@/types/rbac';
import { RoleAssignmentDialog } from './RoleAssignmentDialog';
import { UserRolesList } from './UserRolesList';
import { RoleHierarchyView } from './RoleHierarchyView';
import { CapabilityMatrix } from './CapabilityMatrix';

export function RoleManagerPage() {
  const { hasCapability, userLevel } = useCapabilities();
  const { getAllRoles } = useRoleManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if user has permission to manage roles
  const canManageRoles = hasCapability(CAPABILITY_CODES.USERS_ROLES_MANAGE);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      const rolesData = await getAllRoles();
      setRoles(rolesData);
      setLoading(false);
    };

    if (canManageRoles) {
      fetchRoles();
    } else {
      setLoading(false);
    }
  }, [canManageRoles, getAllRoles]);

  if (!canManageRoles) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to manage roles. Contact your administrator if you need access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const roleCategories = [
    { value: 'all', label: 'All Roles', count: roles.length },
    { value: 'core', label: 'Core Authority', count: roles.filter(r => r.level >= 80).length },
    { value: 'security', label: 'Security & Compliance', count: roles.filter(r => r.level >= 70 && r.level < 80).length },
    { value: 'operations', label: 'Operations', count: roles.filter(r => r.level >= 40 && r.level < 70).length },
    { value: 'moderation', label: 'Content Moderation', count: roles.filter(r => r.level >= 20 && r.level < 40).length },
    { value: 'specialized', label: 'Specialized', count: roles.filter(r => r.level > 0 && r.level < 20).length },
  ];

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') return matchesSearch;
    
    const categoryFilters = {
      core: role.level >= 80,
      security: role.level >= 70 && role.level < 80,
      operations: role.level >= 40 && role.level < 70,
      moderation: role.level >= 20 && role.level < 40,
      specialized: role.level > 0 && role.level < 20
    };
    
    return matchesSearch && categoryFilters[selectedCategory as keyof typeof categoryFilters];
  });

  const getRoleBadgeVariant = (level: number) => {
    if (level >= 90) return 'destructive'; // Platform Owner, Super Admin
    if (level >= 70) return 'secondary'; // Security & Compliance
    if (level >= 40) return 'default'; // Operations & Technical
    if (level >= 20) return 'outline'; // Content Moderation
    return 'secondary'; // Specialized & Scoped
  };

  const getRoleIcon = (level: number) => {
    if (level >= 90) return <Crown className="h-4 w-4" />;
    if (level >= 70) return <Shield className="h-4 w-4" />;
    if (level >= 40) return <Settings className="h-4 w-4" />;
    return <Users className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Role Management System</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions across the platform. Your access level: {userLevel}
        </p>
      </div>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roles">Role Directory</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          <TabsTrigger value="hierarchy">Role Hierarchy</TabsTrigger>
          <TabsTrigger value="capabilities">Capability Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search roles by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleCategories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Role Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role.level)}
                      <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
                    </div>
                    <Badge variant={getRoleBadgeVariant(role.level)} className="text-xs">
                      Level {role.level}
                    </Badge>
                  </div>
                  {role.description && (
                    <CardDescription className="text-xs line-clamp-2">
                      {role.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Code: {role.code}
                    </div>
                    <RoleAssignmentDialog role={role} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRoles.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-muted-foreground">
                  No roles found matching your search criteria.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments">
          <UserRolesList />
        </TabsContent>

        <TabsContent value="hierarchy">
          <RoleHierarchyView roles={roles} />
        </TabsContent>

        <TabsContent value="capabilities">
          <CapabilityMatrix />
        </TabsContent>
      </Tabs>
    </div>
  );
}