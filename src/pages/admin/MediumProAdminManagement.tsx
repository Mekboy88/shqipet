import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Filter,
  CreditCard,
  AlertTriangle,
  Eye,
  Gift,
  Settings,
  Mail,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Info
} from 'lucide-react';

const MediumProAdminManagement = () => {
  const [filterTier, setFilterTier] = useState('Medium Pro');
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', plan: 'Medium Pro', joinDate: '2024-01-15', lastPayment: '2024-07-01', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', plan: 'Medium Pro', joinDate: '2024-02-20', lastPayment: '2024-06-30', status: 'Active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', plan: 'Medium Pro', joinDate: '2024-03-10', lastPayment: '2024-07-05', status: 'Flagged' },
  ];

  const paymentHistory = [
    { id: 1, amount: '$19.99', method: 'Stripe', status: 'Success', timestamp: '2024-07-01 14:30', subscription: '2024-07-01 - 2024-08-01' },
    { id: 2, amount: '$19.99', method: 'PayPal', status: 'Success', timestamp: '2024-06-01 10:15', subscription: '2024-06-01 - 2024-07-01' },
    { id: 3, amount: '$19.99', method: 'Stripe', status: 'Failed', timestamp: '2024-05-15 16:45', subscription: 'N/A' },
  ];

  const featureUsage = {
    boostTokensUsed: 8,
    scheduledPosts: 15,
    videoUploads: 23,
    imageUploads: 67,
    monetizationUsage: 12,
    invisibleModeActivations: 5
  };

  const InfoTooltip = ({ children, content, type = 'info', warning }: { 
    children: React.ReactNode, 
    content: string, 
    type?: 'info' | 'warning' | 'danger',
    warning?: string 
  }) => {
    const iconColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
    
    const formatContent = (text: string) => {
      const parts = text.split('CONSEQUENCES:');
      if (parts.length === 1) return <p className="text-sm text-gray-900">{text}</p>;
      
      return (
        <div>
          <p className="text-sm text-gray-900">{parts[0]}</p>
          <p className="text-sm"><span className="text-red-600 font-bold">CONSEQUENCES:</span><span className="text-gray-900">{parts[1]}</span></p>
        </div>
      );
    };
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              {children}
              <Info className={`h-4 w-4 ${iconColor} cursor-help`} />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm">
            <div className="space-y-2">
              {formatContent(content)}
              {warning && (
                <div className="border-t pt-2">
                  <p className="text-sm text-red-500 font-medium">⚠️ CONSEQUENCES:</p>
                  <p className="text-sm text-red-500">{warning}</p>
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medium Pro Admin Management</h1>
            <p className="text-gray-600">Administrative tools and user management for Medium Pro tier</p>
          </div>
        </div>
      </div>

      {/* Filter Users by Tier */}
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5" />
          <h3 className="text-lg font-semibold">📋 Filter Users by Tier</h3>
        </div>
        <p className="text-muted-foreground mb-6">View and manage users by subscription tier</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div className="flex gap-2 mb-4">
            {['All', 'Free', 'Low Pro', 'Medium Pro', 'Super Pro'].map((tier) => (
              <Button
                key={tier}
                variant={filterTier === tier ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterTier(tier)}
              >
                {tier}
              </Button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Plan</th>
                  <th className="text-left p-2">Join Date</th>
                  <th className="text-left p-2">Last Payment</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <Badge variant="outline">{user.plan}</Badge>
                    </td>
                    <td className="p-2">{user.joinDate}</td>
                    <td className="p-2">{user.lastPayment}</td>
                    <td className="p-2">
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Payment History Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-lg font-semibold">💳 Payment History Logs</h3>
          </div>
          <p className="text-muted-foreground mb-4">View individual and group payment histories</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="space-y-2">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <div className="font-medium">{payment.amount}</div>
                    <div className="text-sm text-gray-600">{payment.method} • {payment.timestamp}</div>
                  </div>
                  <Badge variant={payment.status === 'Success' ? 'default' : 'destructive'}>
                    {payment.status === 'Success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">
              📊 View Full Payment Logs
            </Button>
          </div>
        </div>

        {/* Abuse Monitoring */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🚫 Abuse Monitoring</h3>
          </div>
          <p className="text-muted-foreground mb-4">Detect and track abuse patterns</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-red-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Boost Token Spam</span>
                <Badge variant="outline" className="text-orange-600">2 alerts</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">False Flagging</span>
                <Badge variant="outline" className="text-red-600">1 alert</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Upload Violations</span>
                <Badge variant="outline" className="text-green-600">0 alerts</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              🔍 View Detailed Reports
            </Button>
          </div>
        </div>

        {/* Feature Usage Tracking */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📈 Feature Usage Tracking</h3>
          </div>
          <p className="text-muted-foreground mb-4">Monitor how often features are used</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Boost Tokens Used</span>
                <p className="font-semibold">{featureUsage.boostTokensUsed}/10</p>
              </div>
              <div>
                <span className="text-gray-600">Scheduled Posts</span>
                <p className="font-semibold">{featureUsage.scheduledPosts}</p>
              </div>
              <div>
                <span className="text-gray-600">Video Uploads</span>
                <p className="font-semibold">{featureUsage.videoUploads}</p>
              </div>
              <div>
                <span className="text-gray-600">Image Uploads</span>
                <p className="font-semibold">{featureUsage.imageUploads}</p>
              </div>
              <div>
                <span className="text-gray-600">Monetization Usage</span>
                <p className="font-semibold">{featureUsage.monetizationUsage}</p>
              </div>
              <div>
                <span className="text-gray-600">Invisible Mode</span>
                <p className="font-semibold">{featureUsage.invisibleModeActivations}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Feature Toggles */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🎁 Reward Feature Toggles</h3>
          </div>
          <p className="text-muted-foreground mb-4">Reward Medium Pro users with special perks</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                ➕ Add Extra Boost Tokens
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📅 Extend Plan Duration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔓 Unlock Premium Module
              </Button>
            </div>
          </div>
        </div>

        {/* Module Access Control */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🧩 Module Access Control</h3>
          </div>
          <p className="text-muted-foreground mb-4">Manually control access to experimental features</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="AI-powered writing assistant for Medium Pro users. CONSEQUENCES: TURNING OFF: No AI writing help, reduced content quality, manual writing only. TURNING ON: Enhanced content creation, AI suggestions, improved productivity."
                  type="info"
                >
                  <span className="text-sm">✍️ AI Writer</span>
                </InfoTooltip>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Smart profile templates and customization tools. CONSEQUENCES: TURNING OFF: Basic profile options, limited customization, standard layouts. TURNING ON: Advanced templates, custom themes, professional profiles."
                  type="info"
                >
                  <span className="text-sm">🎨 Smart Profiles</span>
                </InfoTooltip>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Exclusive filters and effects for Medium Pro subscribers. CONSEQUENCES: TURNING OFF: Standard filters only, reduced content quality, basic editing. TURNING ON: Premium filters, advanced effects, professional content."
                  type="info"
                >
                  <span className="text-sm">🎥 Pro-only Filters</span>
                </InfoTooltip>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📬 Communication Channels</h3>
          </div>
          <p className="text-muted-foreground mb-4">Send targeted messages to Medium Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                📧 Send Email Blast
              </Button>
              <Button variant="outline" className="w-full justify-start">
                🔔 In-App Notification
              </Button>
              <Button variant="outline" className="w-full justify-start">
                📱 Push Notification
              </Button>
            </div>
            <div className="text-xs text-gray-600">
              <p>Use cases:</p>
              <p>• New Pro feature announcements</p>
              <p>• Reward programs</p>
              <p>• Exclusive event invites</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediumProAdminManagement;