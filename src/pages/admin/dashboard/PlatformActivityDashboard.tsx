import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Video, 
  Upload, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface PlatformMetrics {
  postsToday: number;
  postsWeek: number;
  postsMonth: number;
  videosToday: number;
  videosWeek: number;
  videosMonth: number;
  filesUploaded: number;
  comments: number;
  messages: number;
  activeModules: Array<{ name: string; usage: number; color: string }>;
}

const mockData = [
  { name: 'Mon', posts: 12, videos: 5, files: 8 },
  { name: 'Tue', posts: 19, videos: 8, files: 12 },
  { name: 'Wed', posts: 15, videos: 6, files: 10 },
  { name: 'Thu', posts: 22, videos: 10, files: 15 },
  { name: 'Fri', posts: 18, videos: 7, files: 11 },
  { name: 'Sat', posts: 25, videos: 12, files: 18 },
  { name: 'Sun', posts: 20, videos: 9, files: 14 }
];

const PlatformActivityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics>({
    postsToday: 45,
    postsWeek: 312,
    postsMonth: 1234,
    videosToday: 23,
    videosWeek: 156,
    videosMonth: 567,
    filesUploaded: 89,
    comments: 234,
    messages: 567,
    activeModules: [
      { name: 'AI Tools', usage: 85, color: 'bg-gradient-to-r from-blue-500 to-purple-600' },
      { name: 'Marketplace', usage: 72, color: 'bg-gradient-to-r from-green-500 to-emerald-600' },
      { name: 'Social Feed', usage: 68, color: 'bg-gradient-to-r from-orange-500 to-red-600' },
      { name: 'Messaging', usage: 54, color: 'bg-gradient-to-r from-pink-500 to-rose-600' },
      { name: 'File Storage', usage: 41, color: 'bg-gradient-to-r from-indigo-500 to-blue-600' }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        postsToday: prev.postsToday + Math.floor(Math.random() * 3),
        videosToday: prev.videosToday + Math.floor(Math.random() * 2),
        comments: prev.comments + Math.floor(Math.random() * 5),
        messages: prev.messages + Math.floor(Math.random() * 8)
      }));
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">📈 Platform Activity</h1>
          <p className="text-muted-foreground">Real-time platform usage and content metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-500 animate-pulse" />
          <span className="text-sm text-green-600">Live Updates</span>
        </div>
      </div>

      {/* Posts Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Posts Created</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">Today</span>
                <span className="text-2xl font-bold text-blue-800">{metrics.postsToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">This Week</span>
                <span className="text-lg font-semibold text-blue-700">{metrics.postsWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600">This Month</span>
                <span className="text-lg font-semibold text-blue-700">{metrics.postsMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Videos Uploaded</CardTitle>
            <Video className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">Today</span>
                <span className="text-2xl font-bold text-purple-800">{metrics.videosToday}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">This Week</span>
                <span className="text-lg font-semibold text-purple-700">{metrics.videosWeek}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-600">This Month</span>
                <span className="text-lg font-semibold text-purple-700">{metrics.videosMonth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Files & Engagement</CardTitle>
            <Upload className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">Files Uploaded</span>
                <span className="text-xl font-bold text-green-800">{metrics.filesUploaded}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">Comments</span>
                <span className="text-lg font-semibold text-green-700">{metrics.comments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-600">Messages</span>
                <span className="text-lg font-semibold text-green-700">{metrics.messages}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Weekly Activity Trends</span>
          </CardTitle>
          <CardDescription>Daily breakdown of platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#3B82F6" name="Posts" />
              <Bar dataKey="videos" fill="#8B5CF6" name="Videos" />
              <Bar dataKey="files" fill="#10B981" name="Files" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Most Active Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Most Active Modules</CardTitle>
          <CardDescription>Module usage statistics with activity levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.activeModules.map((module, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${module.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{module.name}</span>
                    <span className="text-sm text-muted-foreground">{module.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${module.color}`}
                      style={{ width: `${module.usage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformActivityDashboard;