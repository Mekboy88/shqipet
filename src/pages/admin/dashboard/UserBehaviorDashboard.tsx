import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Activity, Eye, Shield } from 'lucide-react';

const UserBehaviorDashboard: React.FC = () => {
  const [behaviorStats, setBehaviorStats] = useState({
    suddenSpikes: 3,
    accountCreations: 247,
    accountDeletions: 12,
    aiFlags: 18
  });

  const [activitySpikes] = useState([
    { time: '09:00', posts: 45, normal: 25 },
    { time: '10:00', posts: 67, normal: 28 },
    { time: '11:00', posts: 156, normal: 30 }, // Spike
    { time: '12:00', posts: 89, normal: 35 },
    { time: '13:00', posts: 203, normal: 32 }, // Spike
    { time: '14:00', posts: 78, normal: 30 },
    { time: '15:00', posts: 142, normal: 33 }, // Spike
    { time: '16:00', posts: 56, normal: 35 }
  ]);

  const [accountPatterns] = useState([
    { date: 'Mon', created: 34, deleted: 2 },
    { date: 'Tue', created: 45, deleted: 3 },
    { date: 'Wed', created: 78, deleted: 1 },
    { date: 'Thu', created: 123, deleted: 8 }, // Unusual pattern
    { date: 'Fri', created: 89, deleted: 12 }, // High deletions
    { date: 'Sat', created: 56, deleted: 4 },
    { date: 'Sun', created: 41, deleted: 2 }
  ]);

  const [suspiciousActivities] = useState([
    {
      id: 1,
      type: 'Mass Posting',
      user: 'user_8472',
      description: '47 posts in 2 minutes',
      severity: 'high',
      time: '12m ago',
      action: 'Auto-restricted'
    },
    {
      id: 2,
      type: 'Account Farming',
      user: 'multiple_accounts',
      description: '15 accounts from same IP',
      severity: 'high',
      time: '28m ago',
      action: 'Investigating'
    },
    {
      id: 3,
      type: 'Spam Pattern',
      user: 'user_9341',
      description: 'Identical comments across 23 posts',
      severity: 'medium',
      time: '45m ago',
      action: 'Flagged'
    },
    {
      id: 4,
      type: 'Bot Behavior',
      user: 'user_1256',
      description: 'Inhuman interaction speed',
      severity: 'medium',
      time: '1h ago',
      action: 'Monitoring'
    }
  ]);

  const [aiDetections] = useState([
    { category: 'Spam Detection', count: 156, accuracy: 94 },
    { category: 'Bot Identification', count: 89, accuracy: 87 },
    { category: 'Fake Accounts', count: 67, accuracy: 91 },
    { category: 'Coordinated Behavior', count: 34, accuracy: 89 },
    { category: 'Content Manipulation', count: 23, accuracy: 93 }
  ]);

  const [behaviorPatterns] = useState([
    { pattern: 'Normal Activity', percentage: 87, color: '#10b981' },
    { pattern: 'Suspicious Posting', percentage: 8, color: '#f59e0b' },
    { pattern: 'Bot-like Behavior', percentage: 3, color: '#ef4444' },
    { pattern: 'Coordinated Activity', percentage: 2, color: '#8b5cf6' }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Auto-restricted': return 'bg-red-100 text-red-800';
      case 'Investigating': return 'bg-blue-100 text-blue-800';
      case 'Flagged': return 'bg-yellow-100 text-yellow-800';
      case 'Monitoring': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBehaviorStats(prev => ({
        ...prev,
        accountCreations: prev.accountCreations + Math.floor(Math.random() * 5),
        aiFlags: prev.aiFlags + Math.floor(Math.random() * 2)
      }));
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Behavior Alerts</h1>
          <p className="text-muted-foreground">Monitor unusual patterns and suspicious activities</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Eye className="mr-2 h-4 w-4" />
          🚨 Investigate User Behavior
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Activity Spikes</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{behaviorStats.suddenSpikes}</div>
            <p className="text-xs text-red-700">Detected today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Account Creation</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{behaviorStats.accountCreations}</div>
            <p className="text-xs text-blue-700">New accounts today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Account Deletions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{behaviorStats.accountDeletions}</div>
            <p className="text-xs text-orange-700">Deleted today</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">AI Flags</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{behaviorStats.aiFlags}</div>
            <p className="text-xs text-purple-700">Users flagged by AI</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Spikes & Account Patterns */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Posting Activity Spikes (Today)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={activitySpikes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="normal" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  name="Normal Range"
                />
                <Area 
                  type="monotone" 
                  dataKey="posts" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="Actual Posts"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Creation/Deletion Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={accountPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="created" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="deleted" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Deleted"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Suspicious Activities Alert */}
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>High Priority:</strong> {suspiciousActivities.filter(a => a.severity === 'high').length} high-severity 
          behavioral anomalies detected requiring immediate attention.
        </AlertDescription>
      </Alert>

      {/* Suspicious Activities & AI Detection */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Suspicious Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suspiciousActivities.map((activity) => (
                <div key={activity.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getSeverityColor(activity.severity)}>
                          {activity.severity}
                        </Badge>
                        <Badge className={getActionColor(activity.action)}>
                          {activity.action}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">User: {activity.user}</p>
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
              <Shield className="h-5 w-5" />
              AI Detection Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiDetections.map((detection, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded border">
                  <div>
                    <p className="font-medium text-sm">{detection.category}</p>
                    <p className="text-xs text-muted-foreground">{detection.count} detections</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{detection.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavior Pattern Analysis */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Activity className="h-5 w-5" />
            User Behavior Pattern Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              {behaviorPatterns.map((pattern, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: pattern.color }}
                    />
                    <span className="text-sm font-medium">{pattern.pattern}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: pattern.color }}>
                    {pattern.percentage}%
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-900">
                  {Math.round(behaviorPatterns
                    .filter(p => p.pattern !== 'Normal Activity')
                    .reduce((sum, p) => sum + p.percentage, 0))}%
                </div>
                <p className="text-sm text-indigo-700">Anomalous Behavior</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-900">
                  {aiDetections.reduce((sum, d) => sum + d.count, 0)}
                </div>
                <p className="text-sm text-indigo-700">Total AI Detections</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorDashboard;