import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, ExternalLink, Bot, Filter, Bookmark, Archive, Eye, AlertCircle, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface AlertRecord {
  id: string;
  timestamp: Date;
  type: string;
  severity: 'Critical' | 'Warning' | 'Info';
  description: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  location?: string;
  status: 'Unresolved' | 'Investigating' | 'Resolved' | 'Archived';
  bookmarked: boolean;
  category: 'Login' | 'Verification' | 'Role' | 'Settings' | 'Security';
  aiSuggestions: string[];
  contextLinks: {
    userProfile?: string;
    sessionLogs?: string;
    auditTrail?: string;
  };
}

const mockAlerts: AlertRecord[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'SuspiciousLoginDetected',
    severity: 'Critical',
    description: 'User logged in from 3 different countries within 30 minutes',
    userId: 'user_123',
    userName: 'john.doe',
    ipAddress: '192.168.1.100',
    location: 'Russia',
    status: 'Unresolved',
    bookmarked: true,
    category: 'Login',
    aiSuggestions: ['Similar to incident last week', 'Same IP cluster pattern', 'Potential credential stuffing'],
    contextLinks: {
      userProfile: '/admin/users/user_123',
      sessionLogs: '/admin/logs/sessions/user_123',
      auditTrail: '/admin/audit/user_123'
    }
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'VerificationSpamDetected',
    severity: 'Warning',
    description: '12 verification attempts from same IP in 5 minutes',
    ipAddress: '203.0.113.42',
    location: 'China',
    status: 'Investigating',
    bookmarked: false,
    category: 'Verification',
    aiSuggestions: ['Part of larger botnet', 'Similar pattern detected 3 days ago'],
    contextLinks: {
      sessionLogs: '/admin/logs/ip/203.0.113.42'
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    type: 'SettingsChangeAlert',
    severity: 'Info',
    description: 'Admin changed MFA requirement settings',
    userId: 'admin_456',
    userName: 'admin.sarah',
    status: 'Resolved',
    bookmarked: false,
    category: 'Settings',
    aiSuggestions: ['Standard admin operation', 'No anomalies detected'],
    contextLinks: {
      userProfile: '/admin/users/admin_456',
      auditTrail: '/admin/audit/admin_456'
    }
  }
];

export function AlertViewerPanelFeatures() {
  const [alerts, setAlerts] = useState<AlertRecord[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getSeverityColor = (severity: AlertRecord['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-destructive/10 border-destructive text-destructive';
      case 'Warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'Info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status: AlertRecord['status']) => {
    switch (status) {
      case 'Unresolved':
        return 'bg-red-100 text-red-800';
      case 'Investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: AlertRecord['category']) => {
    const colors = {
      Login: 'bg-purple-100 text-purple-800',
      Verification: 'bg-blue-100 text-blue-800',
      Role: 'bg-green-100 text-green-800',
      Settings: 'bg-orange-100 text-orange-800',
      Security: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const toggleBookmark = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, bookmarked: !alert.bookmarked }
        : alert
    ));
  };

  const updateStatus = (alertId: string, newStatus: AlertRecord['status']) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: newStatus }
        : alert
    ));
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSearch = 
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || alert.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;

      const matchesDateRange = 
        (!dateRange.from || alert.timestamp >= dateRange.from) &&
        (!dateRange.to || alert.timestamp <= dateRange.to);

      return matchesSearch && matchesStatus && matchesCategory && matchesSeverity && matchesDateRange;
    });
  }, [alerts, searchTerm, statusFilter, categoryFilter, severityFilter, dateRange]);

  const unresolvedCount = filteredAlerts.filter(a => a.status === 'Unresolved').length;
  const bookmarkedCount = filteredAlerts.filter(a => a.bookmarked).length;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            📘 Alert Viewer Panel Features
            <Badge variant="outline">{filteredAlerts.length} Alerts</Badge>
            {unresolvedCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unresolvedCount} Unresolved
              </Badge>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            Enhanced UX for reviewing, filtering, and investigating alert history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Archive className="h-4 w-4 mr-2" />
            Archive Selected
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmarked ({bookmarkedCount})
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search & Filter Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Alert Search Bar */}
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">Alert Search Bar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, IP, keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="text-xs text-green-600 mt-1">✅ Needs Implementation → Implemented</div>
            </div>

            {/* Date Range Picker */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Date Range Picker</label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
                      ) : (
                        format(dateRange.from, 'MMM dd, yyyy')
                      )
                    ) : (
                      'Pick date range'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
                  <CalendarComponent
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange(range || {})}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <div className="text-xs text-yellow-600 mt-1">🔄 In Progress → Completed</div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Unresolved">Unresolved</SelectItem>
                  <SelectItem value="Investigating">Investigating</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Verification">Verification</SelectItem>
                  <SelectItem value="Role">Role</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No alerts match your current filters.</p>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`hover:shadow-md transition-all border-l-4 ${getSeverityColor(alert.severity)} ${
                alert.status === 'Unresolved' ? 'ring-2 ring-destructive/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(alert.category)}>
                          {alert.category}
                        </Badge>
                        <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'outline'}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                        {alert.bookmarked && (
                          <Bookmark className="h-4 w-4 text-blue-600 fill-current" />
                        )}
                      </div>
                      <h4 className="font-medium">{alert.type.replace(/([A-Z])/g, ' $1').trim()}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => toggleBookmark(alert.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${alert.bookmarked ? 'fill-current text-blue-600' : ''}`} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {alert.bookmarked ? 'Remove bookmark' : 'Bookmark alert'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Context Information */}
                  {(alert.userId || alert.ipAddress || alert.location) && (
                    <div className="flex gap-4 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      {alert.userId && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          User: {alert.userName || alert.userId}
                        </span>
                      )}
                      {alert.ipAddress && (
                        <span>IP: {alert.ipAddress}</span>
                      )}
                      {alert.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                      )}
                    </div>
                  )}

                  {/* AI Suggestions */}
                  {alert.aiSuggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Bot className="h-4 w-4 text-blue-600" />
                        AI Suggestion Tagging
                        <Badge variant="outline" className="text-xs">Add AI Features → Enhanced</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {alert.aiSuggestions.map((suggestion, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex gap-2">
                      {/* Linked Context Buttons */}
                      {alert.contextLinks.userProfile && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" asChild>
                              <a href={alert.contextLinks.userProfile} target="_blank" rel="noopener noreferrer">
                                <User className="h-3 w-3 mr-1" />
                                Profile
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Jump to user profile</TooltipContent>
                        </Tooltip>
                      )}
                      {alert.contextLinks.sessionLogs && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" asChild>
                              <a href={alert.contextLinks.sessionLogs} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-3 w-3 mr-1" />
                                Logs
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View session logs</TooltipContent>
                        </Tooltip>
                      )}
                      {alert.contextLinks.auditTrail && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline" asChild>
                              <a href={alert.contextLinks.auditTrail} target="_blank" rel="noopener noreferrer">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Audit
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View audit trail</TooltipContent>
                        </Tooltip>
                      )}
                      <Badge variant="outline" className="text-xs text-green-600">
                        Design Ready → Implemented
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Select value={alert.status} onValueChange={(value) => updateStatus(alert.id, value as AlertRecord['status'])}>
                        <SelectTrigger className="h-8 text-xs bg-background w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="Unresolved">Unresolved</SelectItem>
                          <SelectItem value="Investigating">Investigating</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
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