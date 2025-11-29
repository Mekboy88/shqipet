import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Megaphone, 
  Settings, 
  CheckCircle, 
  UserPlus, 
  Activity,
  MessageSquare,
  Users,
  Shield,
  Wrench
} from 'lucide-react';
import { toast } from 'sonner';

interface MaintenanceStatus {
  enabled: boolean;
  message: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

const QuickActionsDashboard: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceStatus>({
    enabled: false,
    message: 'System maintenance in progress. We\'ll be back shortly.'
  });
  
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });

  const [userPromotion, setUserPromotion] = useState({
    username: '',
    role: '' as string
  });

  const [pendingReports] = useState([
    { id: '1', type: 'spam', reporter: '@user123', reported: '@spammer456', timestamp: '2 mins ago' },
    { id: '2', type: 'harassment', reporter: '@victim789', reported: '@bully123', timestamp: '15 mins ago' },
    { id: '3', type: 'inappropriate_content', reporter: '@moderator1', reported: '@poster321', timestamp: '1 hour ago' }
  ]);

  const handleMaintenanceToggle = () => {
    setMaintenanceMode(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
    toast.success(`Maintenance mode ${!maintenanceMode.enabled ? 'enabled' : 'disabled'}`);
  };

  const handleCreateAnnouncement = () => {
    if (!announcement.title || !announcement.content) {
      toast.error('Please fill in all announcement fields');
      return;
    }
    
    toast.success('Announcement created and published!');
    setAnnouncement({ title: '', content: '', type: 'info' });
  };

  const handlePromoteUser = () => {
    if (!userPromotion.username || !userPromotion.role) {
      toast.error('Please enter username and select role');
      return;
    }
    
    toast.success(`User ${userPromotion.username} promoted to ${userPromotion.role}`);
    setUserPromotion({ username: '', role: '' });
  };

  const handleApproveReport = (reportId: string) => {
    toast.success(`Report ${reportId} approved and action taken`);
  };

  const handleRejectReport = (reportId: string) => {
    toast.info(`Report ${reportId} rejected`);
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'spam': return 'bg-yellow-100 text-yellow-800';
      case 'harassment': return 'bg-red-100 text-red-800';
      case 'inappropriate_content': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">⚡ Quick Admin Actions</h1>
          <p className="text-muted-foreground">Streamlined tools for immediate administrative tasks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-green-500 animate-pulse" />
          <span className="text-sm text-green-600">Real-time Actions</span>
        </div>
      </div>

      {/* Maintenance Mode Toggle */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <span>Maintenance Mode</span>
            <Badge className={maintenanceMode.enabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {maintenanceMode.enabled ? 'ACTIVE' : 'INACTIVE'}
            </Badge>
          </CardTitle>
          <CardDescription>Toggle site maintenance mode for system updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Switch
              checked={maintenanceMode.enabled}
              onCheckedChange={handleMaintenanceToggle}
            />
            <span className="text-sm font-medium">
              {maintenanceMode.enabled ? 'Maintenance mode is ON' : 'Maintenance mode is OFF'}
            </span>
          </div>
          {maintenanceMode.enabled && (
            <Alert className="mt-4">
              <AlertDescription>
                🚧 The site is currently in maintenance mode. Users will see the maintenance page.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Create Announcement */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Megaphone className="h-5 w-5 text-blue-600" />
            <span>Create New Announcement</span>
          </CardTitle>
          <CardDescription>Broadcast important messages to all users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Announcement Title</label>
            <Input
              placeholder="Enter announcement title..."
              value={announcement.title}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Message Content</label>
            <Textarea
              placeholder="Enter announcement content..."
              value={announcement.content}
              onChange={(e) => setAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={announcement.type}
                onValueChange={(value) => setAnnouncement(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <Button onClick={handleCreateAnnouncement} className="bg-blue-600 hover:bg-blue-700">
              🚀 Publish Announcement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Promotion and Pending Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Promotion */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              <span>Promote User to Admin</span>
            </CardTitle>
            <CardDescription>Grant administrative privileges to users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Username</label>
              <Input
                placeholder="@username or email"
                value={userPromotion.username}
                onChange={(e) => setUserPromotion(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Admin Role</label>
              <Select
                value={userPromotion.role}
                onValueChange={(value) => setUserPromotion(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePromoteUser} className="w-full bg-green-600 hover:bg-green-700">
              👤 Promote User
            </Button>
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span>Pending Reports</span>
              <Badge className="bg-red-100 text-red-800">{pendingReports.length}</Badge>
            </CardTitle>
            <CardDescription>Review and approve user reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingReports.map((report) => (
                <div key={report.id} className="p-3 border rounded-lg bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge className={getReportTypeColor(report.type)}>
                        {report.type.replace('_', ' ')}
                      </Badge>
                      <p className="text-sm mt-1">
                        <span className="font-medium">{report.reporter}</span> reported{' '}
                        <span className="font-medium text-red-600">{report.reported}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{report.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveReport(report.id)}
                      className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                      ✅ Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRejectReport(report.id)}
                      className="text-xs"
                    >
                      ❌ Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wrench className="h-5 w-5 text-gray-600" />
            <span>Quick System Stats</span>
          </CardTitle>
          <CardDescription>At-a-glance system information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-800">1,234</div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-800">5,678</div>
              <div className="text-sm text-green-600">Total Posts</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-800">89</div>
              <div className="text-sm text-purple-600">Online Now</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-800">99.9%</div>
              <div className="text-sm text-orange-600">Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionsDashboard;