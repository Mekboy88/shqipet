import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Clock, Shield, AlertTriangle, Eye, User } from 'lucide-react';

const AuditTrailDashboard: React.FC = () => {
  const [recentActions] = useState([
    {
      id: 1,
      admin: 'John Smith',
      avatar: 'JS',
      action: 'Updated user permissions',
      target: 'user_12456',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'completed',
      risk: 'medium'
    },
    {
      id: 2,
      admin: 'Sarah Wilson',
      avatar: 'SW',
      action: 'Deleted spam posts',
      target: '15 posts',
      timestamp: new Date(Date.now() - 1000 * 60 * 32),
      status: 'completed',
      risk: 'low'
    },
    {
      id: 3,
      admin: 'Mike Johnson',
      avatar: 'MJ',
      action: 'Modified system settings',
      target: 'auth_config',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'flagged',
      risk: 'high'
    },
    {
      id: 4,
      admin: 'Lisa Chen',
      avatar: 'LC',
      action: 'Created new admin role',
      target: 'moderator_role',
      timestamp: new Date(Date.now() - 1000 * 60 * 67),
      status: 'completed',
      risk: 'medium'
    },
    {
      id: 5,
      admin: 'David Brown',
      avatar: 'DB',
      action: 'Bulk user export',
      target: '2,450 users',
      timestamp: new Date(Date.now() - 1000 * 60 * 89),
      status: 'reverted',
      risk: 'high'
    }
  ]);

  const [adminActivity] = useState([
    { name: 'John Smith', actions: 127, risk_score: 2 },
    { name: 'Sarah Wilson', actions: 89, risk_score: 1 },
    { name: 'Mike Johnson', actions: 156, risk_score: 4 },
    { name: 'Lisa Chen', actions: 73, risk_score: 2 },
    { name: 'David Brown', actions: 45, risk_score: 3 }
  ]);

  const [auditStats, setAuditStats] = useState({
    totalActions: 1247,
    flaggedActions: 8,
    revertedActions: 3,
    avgResolutionTime: 24
  });

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'reverted': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setAuditStats(prev => ({
        ...prev,
        totalActions: prev.totalActions + Math.floor(Math.random() * 3)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Trail Summary</h1>
          <p className="text-muted-foreground">Track and monitor administrative actions</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <FileText className="mr-2 h-4 w-4" />
          📜 View Full Audit Logs
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Actions</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{auditStats.totalActions.toLocaleString()}</div>
            <p className="text-xs text-blue-700">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Flagged Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{auditStats.flaggedActions}</div>
            <p className="text-xs text-red-700">Requiring review</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Reverted Changes</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{auditStats.revertedActions}</div>
            <p className="text-xs text-orange-700">This week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Avg Resolution</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{auditStats.avgResolutionTime}h</div>
            <p className="text-xs text-green-700">Response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions & Admin Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Last 5 Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{action.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{action.admin}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(action.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.action}</p>
                    <p className="text-xs text-muted-foreground">Target: {action.target}</p>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(action.status)}>
                        {action.status}
                      </Badge>
                      <Badge variant="outline" className={getRiskColor(action.risk)}>
                        {action.risk} risk
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Most Active Admins (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={adminActivity} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="actions" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Eye className="h-5 w-5" />
            Security Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">
                {recentActions.filter(a => a.risk === 'high').length}
              </div>
              <p className="text-sm text-purple-700">High Risk Actions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">
                {adminActivity.filter(a => a.risk_score >= 3).length}
              </div>
              <p className="text-sm text-purple-700">Admins to Monitor</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-900">
                {Math.round((recentActions.filter(a => a.status === 'completed').length / recentActions.length) * 100)}%
              </div>
              <p className="text-sm text-purple-700">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditTrailDashboard;