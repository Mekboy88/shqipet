import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Crown, 
  TrendingUp, 
  Calendar, 
  Globe, 
  Upload, 
  Zap, 
  BarChart3, 
  Palette, 
  MessageCircle, 
  DollarSign, 
  Star, 
  Shield,
  Filter,
  CreditCard,
  AlertTriangle,
  Gift,
  Settings,
  Mail,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  Info,
  Wifi,
  WifiOff
} from 'lucide-react';

const MediumProUserSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    currentPlan: 'Medium Pro',
    autoTranslate: true,
    prioritySupport: true,
    invisibleMode: false,
    hideFollowerCount: false,
    hideLastSeen: true,
    profilePreview: true,
    monetizationEnabled: true,
    featuredDiscovery: true,
    insightsDigest: true,
    boostTokensRemaining: 7
  });

  const [filterTier, setFilterTier] = useState('Medium Pro');
  const [selectedUser, setSelectedUser] = useState(null);

  // Pricing configuration state
  const [pricingSettings, setPricingSettings] = useState({
    planName: 'Medium Pro',
    currency: 'GBP',
    monthlyPrice: 4.99,
    quarterlyPrice: 13.99,
    yearlyPrice: 44.99,
    freeTrialDays: 7,
    autoRenewal: true,
    enableManualRewards: true,
    allowCustomDiscounts: true
  });

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

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePricingChange = async (field: string, value: any) => {
    setPricingSettings(prev => ({ ...prev, [field]: value }));
    // Here you would typically save to backend
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
    <div className="space-y-6 p-6">
      {/* Real-time Status Indicator */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-900">Real-time Sync Enabled</span>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Medium Pro User Settings Configuration
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-blue-600" />
            <span className="font-medium text-lg">🔥 Medium Pro User Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Crown className="w-4 h-4 mr-1" />
              🟦 Medium Pro
            </Badge>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/general-config/medium-pro-admin')}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              👨‍💼 Admin Management
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">Advanced features for Medium Pro subscribers</p>
      </div>

      {/* Flexible Pricing System Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5" />
          <h2 className="text-xl font-semibold">💳 Flexible Pricing System (Admin Panel Configuration)</h2>
        </div>
        <p className="text-muted-foreground mb-6">Configure pricing details for the Medium Pro tier</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <input
                type="text"
                className="w-full border rounded-md px-3 py-2"
                placeholder="Medium Pro"
                value={pricingSettings.planName}
                onChange={(e) => handlePricingChange('planName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <select 
                className="w-full border rounded-md px-3 py-2"
                value={pricingSettings.currency}
                onChange={(e) => handlePricingChange('currency', e.target.value)}
              >
                <option value="GBP">GBP (£)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="ALL">ALL (Lek)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Monthly Price</Label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-md px-3 py-2"
                placeholder="4.99"
                value={pricingSettings.monthlyPrice}
                onChange={(e) => handlePricingChange('monthlyPrice', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Quarterly Price</Label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-md px-3 py-2"
                placeholder="13.99"
                value={pricingSettings.quarterlyPrice}
                onChange={(e) => handlePricingChange('quarterlyPrice', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Yearly Price</Label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded-md px-3 py-2"
                placeholder="44.99"
                value={pricingSettings.yearlyPrice}
                onChange={(e) => handlePricingChange('yearlyPrice', parseFloat(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Free Trial (Days)</Label>
              <input
                type="number"
                className="w-full border rounded-md px-3 py-2"
                placeholder="7"
                value={pricingSettings.freeTrialDays}
                onChange={(e) => handlePricingChange('freeTrialDays', parseInt(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Enable automatic subscription renewal for users. CONSEQUENCES: TURNING OFF: Users must manually renew, potential revenue loss, subscription lapses. TURNING ON: Automatic billing, consistent revenue, seamless user experience."
                type="info"
              >
                <Label htmlFor="auto-renewal-medium">Auto-Renewal Toggle</Label>
              </InfoTooltip>
              <Switch 
                id="auto-renewal-medium" 
                checked={pricingSettings.autoRenewal}
                onCheckedChange={(checked) => handlePricingChange('autoRenewal', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Allow admin to grant time/boosts manually to users. CONSEQUENCES: TURNING OFF: No manual reward capability, reduced customer service options. TURNING ON: Flexible reward system, better customer retention, manual incentives."
                type="info"
              >
                <Label htmlFor="manual-rewards-medium">Enable Manual Rewards</Label>
              </InfoTooltip>
              <Switch 
                id="manual-rewards-medium" 
                checked={pricingSettings.enableManualRewards}
                onCheckedChange={(checked) => handlePricingChange('enableManualRewards', checked)}
              />
            </div>
          </div>
          
          {/* Live Pricing Preview */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">💰 Live Pricing Preview</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Monthly</span>
                <p className="font-semibold">
                  {pricingSettings.currency === 'GBP' ? '£' : 
                   pricingSettings.currency === 'USD' ? '$' : 
                   pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                  {pricingSettings.monthlyPrice}/month
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Quarterly</span>
                <p className="font-semibold">
                  {pricingSettings.currency === 'GBP' ? '£' : 
                   pricingSettings.currency === 'USD' ? '$' : 
                   pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                  {pricingSettings.quarterlyPrice}/quarter
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Yearly</span>
                <p className="font-semibold">
                  {pricingSettings.currency === 'GBP' ? '£' : 
                   pricingSettings.currency === 'USD' ? '$' : 
                   pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                  {pricingSettings.yearlyPrice}/year
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5" />
            <h3 className="text-lg font-semibold">💼 Current Plan</h3>
          </div>
          <p className="text-muted-foreground mb-4">Your active subscription tier and upgrade options</p>
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan Status</span>
              <Badge className="bg-blue-100 text-blue-800">🟦 Medium Pro</Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                ➖ Downgrade to Low/Free
              </Button>
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
              >
                ➕ Upgrade to Super Pro
              </Button>
            </div>
          </div>
        </div>

        {/* Monthly Boost Tokens */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📤 Monthly Boost Tokens</h3>
          </div>
          <p className="text-muted-foreground mb-4">Use tokens to boost post visibility and engagement</p>
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="flex items-center justify-between">
              <span className="font-medium">Tokens Remaining</span>
              <Badge variant="outline">{settings.boostTokensRemaining}/10</Badge>
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium" 
              variant="outline"
            >
              🚀 Boost Current Post
            </Button>
          </div>
        </div>

        {/* Extended Analytics */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📈 Extended Post Analytics</h3>
          </div>
          <p className="text-muted-foreground mb-4">Detailed insights and performance metrics</p>
          <div className="space-y-4 pl-4 border-l-2 border-red-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Impressions</span>
                <p className="font-semibold">2,847</p>
              </div>
              <div>
                <span className="text-gray-600">Engagement Rate</span>
                <p className="font-semibold">12.4%</p>
              </div>
              <div>
                <span className="text-gray-600">CTR</span>
                <p className="font-semibold">3.2%</p>
              </div>
              <div>
                <span className="text-gray-600">Saves</span>
                <p className="font-semibold">156</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              📊 View Full Analytics
            </Button>
          </div>
        </div>

        {/* Unlimited Drafts & Scheduled Posts */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🧵 Unlimited Drafts & Scheduled Posts</h3>
          </div>
          <p className="text-muted-foreground mb-4">No limits on drafts and post scheduling</p>
          <div className="space-y-4 pl-4 border-l-2 border-blue-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Saved Drafts</span>
                <p className="font-semibold">23</p>
              </div>
              <div>
                <span className="text-gray-600">Scheduled Posts</span>
                <p className="font-semibold">8</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              📝 Manage Drafts & Schedule
            </Button>
          </div>
        </div>

        {/* Smart Auto-Translate */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🧠 Smart Auto-Translate</h3>
          </div>
          <p className="text-muted-foreground mb-4">Automatically translate posts for global audience</p>
          <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Automatically translate posts for global reach. CONSEQUENCES: TURNING OFF: Limited audience reach, language barriers, missed engagement opportunities. TURNING ON: Global accessibility, wider audience, automatic language detection."
                type="info"
              >
                <Label htmlFor="auto-translate">Enable Auto-Translate</Label>
              </InfoTooltip>
              <Switch
                id="auto-translate"
                checked={settings.autoTranslate}
                onCheckedChange={(checked) => handleSettingChange('autoTranslate', checked)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Posts will be automatically translated based on viewer preferences
            </p>
          </div>
        </div>

        {/* Higher Upload Limits */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🎥 Higher Upload Limits</h3>
          </div>
          <p className="text-muted-foreground mb-4">Enhanced upload capabilities for premium content</p>
          <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Video</span>
                <p className="font-semibold">Up to 1 GB</p>
              </div>
              <div>
                <span className="text-gray-600">Audio</span>
                <p className="font-semibold">Up to 200 MB</p>
              </div>
              <div>
                <span className="text-gray-600">Photos</span>
                <p className="font-semibold">Up to 50 MB</p>
              </div>
              <div>
                <span className="text-gray-600">Resolution</span>
                <p className="font-semibold">HD 1080p</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Digest */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📚 Insights Digest</h3>
          </div>
          <p className="text-muted-foreground mb-4">Weekly performance summaries and trends</p>
          <div className="space-y-4 pl-4 border-l-2 border-pink-200">
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Weekly performance digest and analytics summary. CONSEQUENCES: TURNING OFF: Miss performance insights, no data-driven improvements, reduced content optimization. TURNING ON: Regular analytics reports, performance tracking, data-driven content strategy."
                type="info"
              >
                <Label htmlFor="insights-digest">Weekly Digest</Label>
              </InfoTooltip>
              <Switch
                id="insights-digest"
                checked={settings.insightsDigest}
                onCheckedChange={(checked) => handleSettingChange('insightsDigest', checked)}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>• Top 3 performing posts</p>
              <p>• Best posting times</p>
              <p>• Audience trends & growth</p>
            </div>
          </div>
        </div>

        {/* Premium Module Access */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🧩 Premium Module Access</h3>
          </div>
          <p className="text-muted-foreground mb-4">Early access to exclusive features and tools</p>
          <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>🤖 AI Writer Assistant</span>
                <Badge variant="outline" className="text-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>🎨 Smart Profile Templates</span>
                <Badge variant="outline" className="text-green-600">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>📸 Pro-only Filters</span>
                <Badge variant="outline" className="text-green-600">Active</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Profile Layout */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-rose-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🌐 Advanced Profile Layout</h3>
          </div>
          <p className="text-muted-foreground mb-4">Enhanced customization and profile features</p>
          <div className="space-y-4 pl-4 border-l-2 border-rose-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>✅ Custom Tabs/Sections</div>
              <div>✅ Themes & Backgrounds</div>
              <div>✅ Layout Modes</div>
              <div>✅ Header Animation</div>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              🎨 Customize Profile
            </Button>
          </div>
        </div>

        {/* Priority Chat Support */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5" />
            <h3 className="text-lg font-semibold">💬 Priority Chat Support</h3>
          </div>
          <p className="text-muted-foreground mb-4">Faster response times and dedicated support</p>
          <div className="space-y-4 pl-4 border-l-2 border-teal-200">
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Priority customer support for Medium Pro users. CONSEQUENCES: TURNING OFF: Standard support queue, longer wait times, general assistance. TURNING ON: Priority badge, faster response, dedicated support team."
                type="info"
              >
                <Label htmlFor="priority-support">Priority Support</Label>
              </InfoTooltip>
              <Switch
                id="priority-support"
                checked={settings.prioritySupport}
                onCheckedChange={(checked) => handleSettingChange('prioritySupport', checked)}
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>⚡ Pro Priority badge in chat</p>
              <p>🕒 Estimated wait time: &lt;5 min</p>
            </div>
            <Button 
              variant="outline" 
              className="w-full bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border border-teal-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
            >
              💬 Contact Support
            </Button>
          </div>
        </div>

        {/* Monetization Tools */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-amber-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🛠️ Monetization Tools (Basic)</h3>
          </div>
          <p className="text-muted-foreground mb-4">Start earning through your content</p>
          <div className="space-y-4 pl-4 border-l-2 border-amber-200">
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Enable basic monetization features for content creators. CONSEQUENCES: TURNING OFF: No revenue generation, missed earning opportunities, limited creator tools. TURNING ON: Tip buttons, donation links, affiliate tracking, revenue potential."
                type="info"
              >
                <Label htmlFor="monetization">Enable Monetization</Label>
              </InfoTooltip>
              <Switch
                id="monetization"
                checked={settings.monetizationEnabled}
                onCheckedChange={(checked) => handleSettingChange('monetizationEnabled', checked)}
              />
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>💰 Tip button on posts</p>
              <p>🔗 Donation links (Ko-fi, Patreon)</p>
              <p>📈 Affiliate link tracking</p>
            </div>
          </div>
        </div>

        {/* Featured Discovery */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-400 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5" />
            <h3 className="text-lg font-semibold">📣 Featured Discovery Spot</h3>
          </div>
          <p className="text-muted-foreground mb-4">Increased visibility in explore and trending</p>
          <div className="space-y-4 pl-4 border-l-2 border-orange-200">
            <div className="flex items-center justify-between">
              <InfoTooltip 
                content="Feature content in discovery and trending sections. CONSEQUENCES: TURNING OFF: Standard visibility, organic reach only, reduced discovery. TURNING ON: Enhanced visibility, trending placement, increased reach and engagement."
                type="info"
              >
                <Label htmlFor="featured-discovery">Featured Discovery</Label>
              </InfoTooltip>
              <Switch
                id="featured-discovery"
                checked={settings.featuredDiscovery}
                onCheckedChange={(checked) => handleSettingChange('featuredDiscovery', checked)}
              />
            </div>
            <p className="text-sm text-gray-600">
              Occasionally appear on explore/trending based on engagement
            </p>
          </div>
        </div>

        {/* Privacy Features */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-violet-400 p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-semibold">🔒 Privacy Features Expanded</h3>
          </div>
          <p className="text-muted-foreground mb-4">Enhanced privacy controls for serious users</p>
          <div className="space-y-4 pl-4 border-l-2 border-violet-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Hide your online status and activity from other users. CONSEQUENCES: TURNING OFF: Visible online status, activity tracking, social presence indicators. TURNING ON: Complete invisibility, privacy protection, anonymous browsing."
                  type="info"
                >
                  <Label htmlFor="invisible-mode">Invisible Mode</Label>
                </InfoTooltip>
                <Switch
                  id="invisible-mode"
                  checked={settings.invisibleMode}
                  onCheckedChange={(checked) => handleSettingChange('invisibleMode', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Hide follower count from public profile display. CONSEQUENCES: TURNING OFF: Public follower metrics, social proof visible, transparency. TURNING ON: Hidden metrics, privacy focus, reduced social pressure."
                  type="info"
                >
                  <Label htmlFor="hide-followers">Hide Followers Count</Label>
                </InfoTooltip>
                <Switch
                  id="hide-followers"
                  checked={settings.hideFollowerCount}
                  onCheckedChange={(checked) => handleSettingChange('hideFollowerCount', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Hide when you were last active on the platform. CONSEQUENCES: TURNING OFF: Last seen timestamp visible, activity tracking, engagement indicators. TURNING ON: Private activity, no timestamp, enhanced privacy."
                  type="info"
                >
                  <Label htmlFor="hide-last-seen">Hide Last Seen</Label>
                </InfoTooltip>
                <Switch
                  id="hide-last-seen"
                  checked={settings.hideLastSeen}
                  onCheckedChange={(checked) => handleSettingChange('hideLastSeen', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <InfoTooltip 
                  content="Enable profile preview before visiting full profile. CONSEQUENCES: TURNING OFF: Direct profile access, immediate viewing, no preview protection. TURNING ON: Preview mode, controlled access, enhanced privacy control."
                  type="info"
                >
                  <Label htmlFor="profile-preview">Profile Preview Mode</Label>
                </InfoTooltip>
                <Switch
                  id="profile-preview"
                  checked={settings.profilePreview}
                  onCheckedChange={(checked) => handleSettingChange('profilePreview', checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MediumProUserSettings;