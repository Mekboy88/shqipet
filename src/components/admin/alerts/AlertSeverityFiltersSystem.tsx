import React, { useState, useMemo } from 'react';
import { Filter, AlertTriangle, Info, Clock, User, Settings, Search, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

interface AlertSeverity {
  level: 'Critical' | 'Warning' | 'Info';
  example: string;
  benefit: string;
  behavior: string;
  color: string;
  icon: React.ReactNode;
}

interface AlertFilter {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: Date;
  affectedUser: string;
  adminHandler: string;
  category: 'Login' | 'Verification' | 'Role' | 'Settings';
  title: string;
  description: string;
}

const severityLevels: AlertSeverity[] = [
  {
    level: 'Critical',
    example: 'Multi-country login spike',
    benefit: 'Instant email + admin badge shown in dashboard',
    behavior: 'Flash notification, block interaction until resolved',
    color: 'bg-destructive/10 border-destructive text-destructive',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    level: 'Warning',
    example: '3 failed verification attempts',
    benefit: 'Logged silently; admin reviews later',
    behavior: 'Yellow alert ribbon; does not interrupt UX',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    level: 'Info',
    example: 'Session refresh or logout logs',
    benefit: 'Non-urgent logs for history or audit',
    behavior: 'Silent logging; available in audit trail',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="h-4 w-4" />
  }
];

const mockAlerts: AlertFilter[] = [
  {
    id: '1',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    affectedUser: 'user_123',
    adminHandler: 'John Smith',
    category: 'Login',
    title: 'Multi-country login detected',
    description: 'User logged in from US, Russia, and China within 30 minutes'
  },
  {
    id: '2',
    severity: 'Warning',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    affectedUser: 'user_456',
    adminHandler: 'Sarah Wilson',
    category: 'Verification',
    title: 'Multiple verification failures',
    description: '5 failed verification attempts from same IP'
  },
  {
    id: '3',
    severity: 'Info',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    affectedUser: 'user_789',
    adminHandler: 'Mike Johnson',
    category: 'Settings',
    title: 'Session refreshed',
    description: 'User successfully refreshed JWT token'
  },
  {
    id: '4',
    severity: 'Critical',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    affectedUser: 'user_101',
    adminHandler: 'Jane Doe',
    category: 'Role',
    title: 'Unauthorized role elevation',
    description: 'Attempt to grant admin role without proper authorization'
  }
];

type SortField = 'severity' | 'timestamp' | 'affectedUser' | 'adminHandler' | 'category';
type SortDirection = 'asc' | 'desc';

export function AlertSeverityFiltersSystem() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const getSeverityBadge = (severity: 'Critical' | 'Warning' | 'Info') => {
    switch (severity) {
      case 'Critical':
        return <Badge variant="destructive" className="animate-pulse">Critical</Badge>;
      case 'Warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Warning</Badge>;
      case 'Info':
        return <Badge variant="secondary">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = mockAlerts.filter(alert => {
      const matchesSearch = 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.affectedUser.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
      
      return matchesSearch && matchesSeverity && matchesCategory;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'severity':
          const severityOrder = { Critical: 3, Warning: 2, Info: 1 };
          aValue = severityOrder[a.severity];
          bValue = severityOrder[b.severity];
          break;
        case 'timestamp':
          aValue = a.timestamp.getTime();
          bValue = b.timestamp.getTime();
          break;
        case 'affectedUser':
          aValue = a.affectedUser;
          bValue = b.affectedUser;
          break;
        case 'adminHandler':
          aValue = a.adminHandler;
          bValue = b.adminHandler;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, severityFilter, categoryFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const criticalCount = filteredAndSortedAlerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            ⚙️ Alert Severity & Filters System
            <Badge variant="outline">{filteredAndSortedAlerts.length} Alerts</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Structured categorization and filtering for prioritized admin attention
          </p>
        </div>
      </div>

      {criticalCount > 0 && (
        <Alert className="border-destructive bg-destructive/10 animate-fade-in">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-medium">
            {criticalCount} critical alert{criticalCount > 1 ? 's' : ''} require immediate attention!
          </AlertDescription>
        </Alert>
      )}

      {/* Severity Levels Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {severityLevels.map((severity) => (
          <Card key={severity.level} className={`border-l-4 ${severity.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                {severity.icon}
                {severity.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <div>
                <span className="text-xs font-medium">Example:</span>
                <p className="text-xs text-muted-foreground">{severity.example}</p>
              </div>
              <div>
                <span className="text-xs font-medium">Benefit:</span>
                <p className="text-xs text-muted-foreground">{severity.benefit}</p>
              </div>
              <div>
                <span className="text-xs font-medium">Behavior:</span>
                <p className="text-xs text-muted-foreground">{severity.behavior}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Filter Controls */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="font-medium">Filter Controls</span>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Severity</label>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All severities" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="Warning">Warning</SelectItem>
                <SelectItem value="Info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Login">Login</SelectItem>
                <SelectItem value="Verification">Verification</SelectItem>
                <SelectItem value="Role">Role</SelectItem>
                <SelectItem value="Settings">Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium">Sort By</label>
            <div className="flex gap-1">
              {(['severity', 'timestamp', 'category'] as SortField[]).map((field) => (
                <Button
                  key={field}
                  variant={sortField === field ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSort(field)}
                  className="flex items-center gap-1 text-xs"
                >
                  {field === 'timestamp' ? <Clock className="h-3 w-3" /> :
                   field === 'severity' ? <AlertTriangle className="h-3 w-3" /> :
                   <Settings className="h-3 w-3" />}
                  {field}
                  {sortField === field && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Alerts */}
      <div className="space-y-3">
        {filteredAndSortedAlerts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No alerts match your current filters.</p>
          </Card>
        ) : (
          filteredAndSortedAlerts.map((alert) => (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(alert.severity)}
                      <Badge variant="outline">{alert.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        User: {alert.affectedUser}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        Handler: {alert.adminHandler}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}