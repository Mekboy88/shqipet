import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Flag, Clock, Shield, AlertTriangle, TrendingDown, CheckCircle } from 'lucide-react';

const ContentModerationDashboard: React.FC = () => {
  const [moderationStats, setModerationStats] = useState({
    pendingReports: 23,
    postsToday: 47,
    avgResolutionTime: 18,
    falsePositives: 3
  });

  const [reportCategories] = useState([
    { name: 'Spam', value: 35, color: '#ef4444' },
    { name: 'Harassment', value: 28, color: '#f97316' },
    { name: 'Inappropriate Content', value: 20, color: '#eab308' },
    { name: 'Copyright', value: 12, color: '#3b82f6' },
    { name: 'Other', value: 5, color: '#8b5cf6' }
  ]);

  const [resolutionTrend] = useState([
    { day: 'Mon', resolved: 45, pending: 12 },
    { day: 'Tue', resolved: 52, pending: 18 },
    { day: 'Wed', resolved: 38, pending: 23 },
    { day: 'Thu', resolved: 61, pending: 15 },
    { day: 'Fri', resolved: 47, pending: 23 },
    { day: 'Sat', resolved: 29, pending: 19 },
    { day: 'Sun', resolved: 34, pending: 16 }
  ]);

  const [recentReports] = useState([
    {
      id: 1,
      type: 'Spam',
      content: 'Multiple promotional posts by user @spammer123',
      reporter: 'user_4567',
      time: '15m ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      type: 'Harassment',
      content: 'Threatening messages in comments',
      reporter: 'user_8901',
      time: '32m ago',
      status: 'investigating',
      priority: 'high'
    },
    {
      id: 3,
      type: 'Inappropriate',
      content: 'NSFW content without warning',
      reporter: 'user_2345',
      time: '1h ago',
      status: 'resolved',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'Copyright',
      content: 'Unauthorized music in video',
      reporter: 'rights_holder',
      time: '2h ago',
      status: 'pending',
      priority: 'medium'
    }
  ]);

  const [aiModerationStats] = useState({
    autoResolved: 156,
    humanReview: 23,
    accuracy: 94.2,
    falsePositives: 3
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setModerationStats(prev => ({
        ...prev,
        postsToday: prev.postsToday + Math.floor(Math.random() * 3),
        pendingReports: Math.max(0, prev.pendingReports + Math.floor(Math.random() * 2) - 1)
      }));
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Moderation Snapshot</h1>
          <p className="text-muted-foreground">Monitor reports and moderation activities</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <Shield className="mr-2 h-4 w-4" />
          🧹 Go to Moderation Center
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{moderationStats.pendingReports}</div>
            <p className="text-xs text-red-700">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Posts Flagged Today</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{moderationStats.postsToday}</div>
            <p className="text-xs text-orange-700">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{moderationStats.avgResolutionTime}m</div>
            <p className="text-xs text-blue-700">-8% improvement</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">AI Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{aiModerationStats.accuracy}%</div>
            <p className="text-xs text-green-700">Auto-moderation rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Resolution Trend (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={resolutionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Resolved"
                />
                <Line 
                  type="monotone" 
                  dataKey="pending" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={reportCategories}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports & AI Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{report.time}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{report.type}</p>
                      <p className="text-xs text-muted-foreground">{report.content}</p>
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
              AI Moderation Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-Resolved</span>
              <span className="text-2xl font-bold text-green-600">{aiModerationStats.autoResolved}</span>
            </div>
            <Progress value={85} className="w-full" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Human Review Required</span>
              <span className="text-2xl font-bold text-blue-600">{aiModerationStats.humanReview}</span>
            </div>
            <Progress value={15} className="w-full" />

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Accuracy Rate</span>
                <span className="text-lg font-bold">{aiModerationStats.accuracy}%</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">False Positives</span>
                <span className="text-lg font-bold text-red-600">{aiModerationStats.falsePositives}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentModerationDashboard;