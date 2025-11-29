import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Settings, Users, Wrench, Eye } from 'lucide-react';
import { Role } from '@/types/rbac';

interface RoleHierarchyViewProps {
  roles: Role[];
}

export function RoleHierarchyView({ roles }: RoleHierarchyViewProps) {
  const rolesByLevel = roles.reduce((acc, role) => {
    const levelGroup = getLevelGroup(role.level);
    if (!acc[levelGroup]) {
      acc[levelGroup] = [];
    }
    acc[levelGroup].push(role);
    return acc;
  }, {} as Record<string, Role[]>);

  function getLevelGroup(level: number): string {
    if (level >= 90) return 'Core Authority (90-100)';
    if (level >= 70) return 'Security & Compliance (70-89)';
    if (level >= 40) return 'Operations & Technical (40-69)';
    if (level >= 20) return 'Content Moderation (20-39)';
    if (level > 0) return 'Specialized Roles (1-19)';
    return 'Basic Users (0)';
  }

  function getLevelIcon(levelGroup: string) {
    if (levelGroup.includes('Core Authority')) return <Crown className="h-5 w-5 text-yellow-600" />;
    if (levelGroup.includes('Security')) return <Shield className="h-5 w-5 text-red-600" />;
    if (levelGroup.includes('Operations')) return <Settings className="h-5 w-5 text-blue-600" />;
    if (levelGroup.includes('Moderation')) return <Eye className="h-5 w-5 text-green-600" />;
    if (levelGroup.includes('Specialized')) return <Wrench className="h-5 w-5 text-purple-600" />;
    return <Users className="h-5 w-5 text-gray-600" />;
  }

  function getLevelColor(levelGroup: string): string {
    if (levelGroup.includes('Core Authority')) return 'border-yellow-200 bg-yellow-50';
    if (levelGroup.includes('Security')) return 'border-red-200 bg-red-50';
    if (levelGroup.includes('Operations')) return 'border-blue-200 bg-blue-50';
    if (levelGroup.includes('Moderation')) return 'border-green-200 bg-green-50';
    if (levelGroup.includes('Specialized')) return 'border-purple-200 bg-purple-50';
    return 'border-gray-200 bg-gray-50';
  }

  const levelOrder = [
    'Core Authority (90-100)',
    'Security & Compliance (70-89)',
    'Operations & Technical (40-69)',
    'Content Moderation (20-39)',
    'Specialized Roles (1-19)',
    'Basic Users (0)'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy Overview</CardTitle>
          <CardDescription>
            Organizational structure of all platform roles ordered by authority level
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {levelOrder.map(levelGroup => {
          const groupRoles = rolesByLevel[levelGroup] || [];
          if (groupRoles.length === 0) return null;

          // Sort roles within group by level (descending)
          const sortedRoles = groupRoles.sort((a, b) => b.level - a.level);

          return (
            <Card key={levelGroup} className={`${getLevelColor(levelGroup)} border-2`}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {getLevelIcon(levelGroup)}
                  <div>
                    <CardTitle className="text-lg">{levelGroup}</CardTitle>
                    <CardDescription>
                      {groupRoles.length} role{groupRoles.length !== 1 ? 's' : ''} in this tier
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {sortedRoles.map((role) => (
                    <div
                      key={role.id}
                      className="p-3 bg-white rounded-md border shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm leading-tight">{role.name}</h4>
                        <Badge variant="outline" className="text-xs ml-2">
                          {role.level}
                        </Badge>
                      </div>
                      {role.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {role.description}
                        </p>
                      )}
                      <div className="text-xs font-mono text-muted-foreground">
                        {role.code}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Hierarchy Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Hierarchy Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Authority Principles</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Higher level roles can manage lower level roles</li>
                <li>• Platform Owner (100) has ultimate authority</li>
                <li>• Super Admin (99) manages all except Platform Owner</li>
                <li>• Break-glass access for emergency situations</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Scope & Limitations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Global scope overrides regional/resource scope</li>
                <li>• Resource-scoped roles limited to specific items</li>
                <li>• Read-only roles cannot make changes</li>
                <li>• Emergency roles bypass normal restrictions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}