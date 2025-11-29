import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeSwitch } from '@/components/admin/settings/RealTimeSwitch';
import { RealTimeSelect } from '@/components/admin/settings/RealTimeSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Palette, Eye, Calendar, BarChart3, Shield, Settings, Mail, Award, MessageCircle, Brain, Zap, Gift, Target, Repeat, Pin, Type, Coins, Users, Sparkles, Edit, FileUp, Activity, Clock, Filter, Focus, Ticket, DollarSign, CreditCard, Percent, Search, Table, AlertTriangle, TrendingUp, Send, Bell, Smartphone, Globe, Info, Wifi, WifiOff } from 'lucide-react';

const LowProUserSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    profileBoosting: true,
    hideAds: false,
    unlimitedDrafts: true,
    hideLastSeen: false,
    blockNonFollowerDMs: false,
    invisibleBrowsing: false,
    emailDigest: true,
    proSupport: true,
    proBadge: true,
    premiumComments: false,
    // User Control/Experience
    customizableFeedPriorities: true,
    suggestedFriendsByInterests: true,
    oneClickRepost: true,
    // AI & Tools
    basicAiDigest: true,
    aiPostAssistant: true,
    // Interaction Boost
    pinnedComments: true,
    commentFormattingTools: true,
    // Monetization
    dailyReward: true,
    monthlyUnlockToken: true,
    // Exclusive Access
    proOnlyGroupJoin: true,
    proDiscussionThreads: true,
    // Profile & Appearance
    proThemeSlot: true,
    profileAnimationBadge: false,
    // Post & Profile Tools
    editPostsAfterPublish: true,
    attachLargerFiles: true,
    // Activity Insights
    seeWhoViewedProfile: true,
    engagementByTimeOfDay: true,
    // Platform Tools
    cleanFeedMode: true,
    saveFiltersAsDefault: true,
    // Bonus Monetization
    lowProTokens: true
  });

  const [subscriptionStatus] = useState('Active'); // This would come from actual subscription data
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Pricing configuration state
  const [pricingSettings, setPricingSettings] = useState({
    planName: 'Low Pro',
    currency: 'GBP',
    monthlyPrice: 1.99,
    quarterlyPrice: 5.49,
    yearlyPrice: 19.99,
    freeTrialDays: 7,
    autoRenewal: true,
    enableManualRewards: true,
    allowCustomDiscounts: true
  });

  // User management state
  const [selectedTier, setSelectedTier] = useState('All');
  const [selectedCommunicationType, setSelectedCommunicationType] = useState('email');

  // Mock data for user management
  const mockUsers = [
    {
      id: 1,
      name: 'Emma Johnson',
      email: 'emma.johnson@email.com',
      plan: 'Low Pro',
      joinDate: '2024-01-15',
      lastPayment: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      plan: 'Low Pro',
      joinDate: '2024-02-03',
      lastPayment: '2024-02-03',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      plan: 'Low Pro',
      joinDate: '2024-01-28',
      lastPayment: '2024-01-28',
      status: 'Cancelled'
    }
  ];

  const mockPaymentHistory = [
    {
      id: 1,
      user: 'Emma Johnson',
      amount: '£1.99',
      method: 'Stripe',
      status: 'Success',
      date: '2024-01-15',
      subscriptionStart: '2024-01-15',
      subscriptionEnd: '2024-02-15'
    },
    {
      id: 2,
      user: 'Michael Chen',
      amount: '£1.99',
      method: 'PayPal',
      status: 'Success',
      date: '2024-02-03',
      subscriptionStart: '2024-02-03',
      subscriptionEnd: '2024-03-03'
    }
  ];

  const mockAbuseAlerts = [
    {
      id: 1,
      user: 'Anonymous User #1234',
      type: 'Spam Detection',
      description: 'Rapid posting detected - 15 posts in 2 minutes',
      severity: 'Medium',
      date: '2024-01-20'
    }
  ];

  const mockFeatureUsage = [
    {
      feature: 'Profile Boosting',
      usage: '45 times this month',
      trend: '+12%'
    },
    {
      feature: 'Scheduled Posts',
      usage: '23 posts scheduled',
      trend: '+8%'
    },
    {
      feature: 'Invisible Browsing',
      usage: '67 sessions',
      trend: '+25%'
    }
  ];

  const currencyOptions = [
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'ALL', label: 'ALL (Lek)' }
  ];

  const themeOptions = [
    { value: 'default', label: 'Default Theme' },
    { value: 'ocean', label: 'Ocean Blue' },
    { value: 'sunset', label: 'Sunset Orange' },
    { value: 'forest', label: 'Forest Green' }
  ];

  const handleSettingChange = async (settingKey: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [settingKey]: value }));
    // Here you would typically save to backend
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    // Here you would typically save to backend
  };

  const handlePricingChange = async (field: string, value: any) => {
    setPricingSettings(prev => ({ ...prev, [field]: value }));
    // Here you would typically save to backend
  };

  const handleManageSubscription = () => {
    // Navigate to billing/upgrade page
    console.log('Navigate to subscription management');
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
    <AdminLayout>
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
            Low Pro User Settings Configuration
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              <span className="font-medium text-lg">🌟 Low Pro User Settings</span>
            </div>
            <Badge variant="secondary">
              Low Pro - {subscriptionStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">Enhanced features for Low Pro subscribers</p>
        </div>

        {/* Pricing Configuration Section */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold">💰 Low Pro Tier – Pricing & Positioning</h2>
          </div>
          <p className="text-muted-foreground mb-6">Configure pricing for the Low Pro subscription tier (£1.99 – £3.99/month range)</p>
          
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="plan-name" className="text-sm font-medium">
                  Plan Name
                </label>
                <Input
                  id="plan-name"
                  value={pricingSettings.planName}
                  onChange={(e) => handlePricingChange('planName', e.target.value)}
                  placeholder="Low Pro / Starter Pro / Pro Lite"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="currency" className="text-sm font-medium">
                  Currency
                </label>
                <RealTimeSelect
                  id="currency"
                  label=""
                  value={pricingSettings.currency}
                  onValueChange={(value) => handlePricingChange('currency', value)}
                  options={currencyOptions}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="monthly-price" className="text-sm font-medium">
                  Monthly Price
                </label>
                <Input
                  id="monthly-price"
                  type="number"
                  step="0.01"
                  value={pricingSettings.monthlyPrice}
                  onChange={(e) => handlePricingChange('monthlyPrice', parseFloat(e.target.value))}
                  placeholder="1.99"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="quarterly-price" className="text-sm font-medium">
                  Quarterly Price (Optional)
                </label>
                <Input
                  id="quarterly-price"
                  type="number"
                  step="0.01"
                  value={pricingSettings.quarterlyPrice}
                  onChange={(e) => handlePricingChange('quarterlyPrice', parseFloat(e.target.value))}
                  placeholder="5.49"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="yearly-price" className="text-sm font-medium">
                  Yearly Price (Optional)
                </label>
                <Input
                  id="yearly-price"
                  type="number"
                  step="0.01"
                  value={pricingSettings.yearlyPrice}
                  onChange={(e) => handlePricingChange('yearlyPrice', parseFloat(e.target.value))}
                  placeholder="19.99"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="free-trial" className="text-sm font-medium">
                  Free Trial (Days)
                </label>
                <Input
                  id="free-trial"
                  type="number"
                  value={pricingSettings.freeTrialDays}
                  onChange={(e) => handlePricingChange('freeTrialDays', parseInt(e.target.value))}
                  placeholder="7"
                />
              </div>
            </div>

            <div className="space-y-4">
              <RealTimeSwitch
                id="auto-renewal-toggle"
                label="Auto-Renewal Toggle"
                description="Enable automatic subscription renewal for users"
                checked={pricingSettings.autoRenewal}
                onCheckedChange={(value) => handlePricingChange('autoRenewal', value)}
              />
              
              <RealTimeSwitch
                id="enable-manual-rewards"
                label="Enable Manual Rewards"
                description="Allow admin to grant time/boosts manually to users"
                checked={pricingSettings.enableManualRewards}
                onCheckedChange={(value) => handlePricingChange('enableManualRewards', value)}
              />

              <RealTimeSwitch
                id="allow-custom-discounts"
                label="Allow Custom Discounts"
                description="Enable admin ability to apply custom discount codes and promotions"
                checked={pricingSettings.allowCustomDiscounts}
                onCheckedChange={(value) => handlePricingChange('allowCustomDiscounts', value)}
              />

              <div className="bg-white rounded-lg p-4 border">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Current Pricing Preview
                </h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <div className="font-semibold text-lg">
                      {pricingSettings.currency === 'GBP' ? '£' : 
                       pricingSettings.currency === 'USD' ? '$' : 
                       pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                      {pricingSettings.monthlyPrice}
                    </div>
                    <div className="text-sm text-gray-600">Monthly</div>
                  </div>
                  {pricingSettings.quarterlyPrice > 0 && (
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">
                        {pricingSettings.currency === 'GBP' ? '£' : 
                         pricingSettings.currency === 'USD' ? '$' : 
                         pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                        {pricingSettings.quarterlyPrice}
                      </div>
                      <div className="text-sm text-gray-600">Quarterly</div>
                    </div>
                  )}
                  {pricingSettings.yearlyPrice > 0 && (
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="font-semibold text-lg">
                        {pricingSettings.currency === 'GBP' ? '£' : 
                         pricingSettings.currency === 'USD' ? '$' : 
                         pricingSettings.currency === 'EUR' ? '€' : 'Lek '}
                        {pricingSettings.yearlyPrice}
                      </div>
                      <div className="text-sm text-gray-600">Yearly</div>
                    </div>
                  )}
                </div>
                {pricingSettings.freeTrialDays > 0 && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {pricingSettings.freeTrialDays} Days Free Trial
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                💾 Save Pricing Configuration
              </Button>
              <Button variant="outline">
                🔄 Reset to Defaults
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Profile Enhancements */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5" />
            <h2 className="text-xl font-semibold">👤 Profile Enhancements</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Gives your profile slightly higher visibility in search results and user recommendations. This is a basic algorithmic boost that helps more users discover your content. CONSEQUENCES: TURNING OFF: Reduced discoverability, fewer followers, less engagement. Profile becomes harder to find. TURNING ON: Increases profile views by 15-25%, better search ranking, more follower growth."
                type="warning"
              >
                <div>
                  <label className="font-medium">✅ Basic Profile Boosting</label>
                  <p className="text-sm text-gray-500">Slightly higher visibility in search and recommendations</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.profileBoosting}
                onCheckedChange={(value) => handleSettingChange('profileBoosting', value)}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Access to additional profile color themes and visual customizations. Choose from Ocean Blue, Sunset Orange, Forest Green themes to personalize your profile appearance. CONSEQUENCES: TURNING OFF: Stuck with default theme only, no visual personalization. TURNING ON: Full access to premium themes, better profile aesthetics, improved personal branding."
              >
                <div>
                  <label className="font-medium">🎨 Theme Picker</label>
                  <p className="text-sm text-gray-500">Choose from additional profile color themes</p>
                </div>
              </InfoTooltip>
              <select 
                value={selectedTheme} 
                onChange={(e) => handleThemeChange(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {themeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Removes all banner and feed advertisements from your browsing experience. Creates a cleaner, distraction-free interface. Premium feature that improves user experience significantly. CONSEQUENCES: TURNING OFF: You see all ads including banners, pop-ups, feed ads - distracting experience. TURNING ON: Clean ad-free experience, faster loading, better focus on content."
                type="warning"
              >
                <div>
                  <label className="font-medium">🚫 Hide Ads Toggle</label>
                  <p className="text-sm text-gray-500">Remove banner and feed ads from your experience</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.hideAds}
                onCheckedChange={(value) => handleSettingChange('hideAds', value)}
              />
            </div>
          </div>
        </div>

        {/* Post Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5" />
            <h2 className="text-xl font-semibold">📅 Post Settings</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Save unlimited draft posts that you can work on over time. No limits on how many drafts you can create and store. Essential for content planning and preparation. CONSEQUENCES: TURNING OFF: Limited to 3 drafts maximum, lose content planning ability. TURNING ON: Unlimited drafts, better content planning, no storage limits."
              >
                <div>
                  <label className="font-medium">🧵 Save Unlimited Drafts</label>
                  <p className="text-sm text-gray-500">Keep as many draft posts as you need</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.unlimitedDrafts}
                onCheckedChange={(value) => handleSettingChange('unlimitedDrafts', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Schedule up to 5 posts per week in advance. Perfect for consistent content publishing without manual posting. Automated posting at optimal times increases engagement. CONSEQUENCES: TURNING OFF: Must post manually every time, inconsistent posting schedule, missed opportunities. TURNING ON: Automated posting, better engagement timing, consistent presence."
              >
                <div>
                  <h4 className="font-medium">📬 Post Scheduling</h4>
                  <p className="text-sm text-gray-500">Schedule up to 5 posts per week</p>
                </div>
              </InfoTooltip>
              <Badge variant="outline">5 posts/week</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="View basic analytics including likes, reach count, and shares for your posts. Essential data to understand content performance and audience engagement patterns. CONSEQUENCES: TURNING OFF: No performance insights, can't optimize content, posting blindly. TURNING ON: Data-driven content strategy, better engagement, audience insights."
              >
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    📈 Basic Post Analytics
                  </h4>
                  <p className="text-sm text-gray-500">View likes, reach count, and shares</p>
                </div>
              </InfoTooltip>
              <Badge variant="outline">Basic Metrics</Badge>
            </div>
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🔒 Privacy Controls</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-red-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Hide your 'last seen' timestamp from other users. Protects your privacy by not revealing when you were last active on the platform. Other users won't see when you were online. CONSEQUENCES: TURNING OFF: Everyone sees when you were last online, reduced privacy. TURNING ON: Complete privacy of your activity times, others can't track your usage patterns."
              >
                <div>
                  <label className="font-medium">👀 Hide Last Seen</label>
                  <p className="text-sm text-gray-500">Don't show when you were last online</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.hideLastSeen}
                onCheckedChange={(value) => handleSettingChange('hideLastSeen', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Block direct messages from users you don't follow. Reduces spam and unwanted messages while allowing communication from trusted connections only. CONSEQUENCES: TURNING OFF: Receive all DMs including spam, harassment, unwanted solicitations. TURNING ON: Only followers can message you, significantly reduces spam and harassment."
                type="warning"
              >
                <div>
                  <label className="font-medium">🚫 Block DMs from Non-Followers</label>
                  <p className="text-sm text-gray-500">Only receive direct messages from people you follow</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.blockNonFollowerDMs}
                onCheckedChange={(value) => handleSettingChange('blockNonFollowerDMs', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Browse other profiles invisibly - they won't see that you visited their profile. Perfect for private research, competitive analysis, or discreet browsing without leaving digital footprints. CONSEQUENCES: TURNING OFF: Others see all your profile visits, reduced privacy, potential awkwardness. TURNING ON: Complete browsing privacy, no visit tracking, freedom to explore without detection."
              >
                <div>
                  <label className="font-medium">🕵️ Invisible Browsing</label>
                  <p className="text-sm text-gray-500">Hide your profile visits from others</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.invisibleBrowsing}
                onCheckedChange={(value) => handleSettingChange('invisibleBrowsing', value)}
              />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">📌 Account Settings</h2>
          </div>
          <p className="text-muted-foreground mb-6">Manage your subscription and account status</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-blue-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Shows current subscription status and billing information. Active status means all Low Pro features are available. CONSEQUENCES: TURNING OFF: Lose all premium features, downgrade to free tier immediately. TURNING ON: Access to all Low Pro features, enhanced functionality."
                type="info"
              >
                <div>
                  <label className="font-medium">📦 Subscription Status</label>
                  <p className="text-sm text-gray-500">Low Pro - {subscriptionStatus}</p>
                </div>
              </InfoTooltip>
              <Badge variant={subscriptionStatus === 'Active' ? 'default' : 'destructive'}>
                {subscriptionStatus}
              </Badge>
            </div>

            <Button 
              onClick={handleManageSubscription}
              className="w-full"
              variant="outline"
            >
              🛠 Manage Subscription
            </Button>
          </div>
        </div>

        {/* Communication Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5" />
            <h2 className="text-xl font-semibold">📩 Communication Settings</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Receive weekly email digests with your performance stats, trending content in your niche, and personalized tips to grow your audience. CONSEQUENCES: TURNING OFF: Miss important platform updates, growth opportunities, trending topics that could boost engagement. TURNING ON: Stay informed about your performance, get growth tips, discover trending content opportunities."
                type="danger"
              >
                <div>
                  <label className="font-medium">📣 Email Digest Toggle</label>
                  <p className="text-sm text-gray-500">Weekly summary of posts, likes, and friends activity</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.emailDigest}
                onCheckedChange={(value) => handleSettingChange('emailDigest', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Get priority customer support with faster response times and dedicated Pro support team. Skip the regular support queue. CONSEQUENCES: TURNING OFF: Regular support queue, slower responses, no priority handling. TURNING ON: Faster support, dedicated Pro team, priority issue resolution."
                type="danger"
              >
                <div>
                  <label className="font-medium">✉️ Pro Support Access</label>
                  <p className="text-sm text-gray-500">Faster support queue with priority badge</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.proSupport}
                onCheckedChange={(value) => handleSettingChange('proSupport', value)}
              />
            </div>
          </div>
        </div>

        {/* Visual Effects */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🎖️ Visual Effects</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Display a special Pro badge on your profile showing your subscription status. Increases credibility and trust with other users. CONSEQUENCES: TURNING OFF: No subscription status visibility, less credibility, missed networking opportunities. TURNING ON: Enhanced profile credibility, better networking potential, professional appearance."
                type="danger"
              >
                <div>
                  <label className="font-medium">🟦 "Low Pro" Badge</label>
                  <p className="text-sm text-gray-500">Subtle badge visible on profile and posts</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.proBadge}
                onCheckedChange={(value) => handleSettingChange('proBadge', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Add a premium highlighted border around your comments to make them stand out. Draws more attention to your replies and increases engagement. CONSEQUENCES: TURNING OFF: Comments blend in, less visibility, reduced engagement. TURNING ON: Comments stand out, better visibility, increased interaction and recognition."
                type="danger"
              >
                <div>
                  <label className="font-medium">💬 Premium Highlighted Comments</label>
                  <p className="text-sm text-gray-500">Faint border glow around your replies</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.premiumComments}
                onCheckedChange={(value) => handleSettingChange('premiumComments', value)}
              />
            </div>
          </div>
        </div>

        {/* User Control & Experience */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5" />
            <h2 className="text-xl font-semibold">✅ User Control / Experience</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Customize what content types appear more in your home feed. Choose priority for text posts, status updates, marketplace items, or reels. CONSEQUENCES: TURNING OFF: Algorithm decides everything, no personalization, random content mix. TURNING ON: Personalized feed, see more of what you want, better content experience."
                type="danger"
              >
                <div>
                  <label className="font-medium">🧬 Customizable Home Feed Priorities</label>
                  <p className="text-sm text-gray-500">Choose what content types you see more of</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.customizableFeedPriorities}
                onCheckedChange={(value) => handleSettingChange('customizableFeedPriorities', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Get AI-powered friend suggestions based on pages and groups you both visit. More accurate recommendations than basic mutual friends. CONSEQUENCES: TURNING OFF: Generic friend suggestions, miss relevant connections, slower network growth. TURNING ON: Better friend recommendations, faster network building, more relevant connections."
                type="danger"
              >
                <div>
                  <label className="font-medium">🎯 Suggested Friends by Interests</label>
                  <p className="text-sm text-gray-500">AI-based suggestions from similar interests</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.suggestedFriendsByInterests}
                onCheckedChange={(value) => handleSettingChange('suggestedFriendsByInterests', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Repost any public content with one click, similar to Twitter's retweet feature. Gives proper credit to original poster automatically. CONSEQUENCES: TURNING OFF: Must manually share content, slower sharing, missed viral opportunities. TURNING ON: Quick content sharing, viral potential, easy engagement with trending posts."
                type="danger"
              >
                <div>
                  <label className="font-medium">🔄 One-Click Content Repost</label>
                  <p className="text-sm text-gray-500">Repost with credit, like Twitter retweet</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.oneClickRepost}
                onCheckedChange={(value) => handleSettingChange('oneClickRepost', value)}
              />
            </div>
          </div>
        </div>

        {/* AI & Tools (Basic Level) */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🧠 AI & Tools (Basic Level)</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Get AI-powered weekly insights showing your most viewed posts and most engaged followers. Helps understand what content works best. CONSEQUENCES: TURNING OFF: No performance insights, posting blindly, missed optimization opportunities. TURNING ON: Data-driven content strategy, better engagement, audience understanding."
                type="danger"
              >
                <div>
                  <label className="font-medium">📊 Basic AI Digest</label>
                  <p className="text-sm text-gray-500">Weekly insights on top posts and engaged followers</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.basicAiDigest}
                onCheckedChange={(value) => handleSettingChange('basicAiDigest', value)}
              />
            </div>

             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="AI writing assistant helps create engaging posts with 3 monthly uses. Perfect for when you're stuck or need inspiration. CONSEQUENCES: TURNING OFF: No AI writing help, struggle with writer's block, less engaging content. TURNING ON: AI-powered writing assistance, better post quality, overcome creative blocks."
                 type="warning"
               >
                 <div>
                   <label className="font-medium">✍️ AI Post Assistant (Lite)</label>
                   <p className="text-sm text-gray-500">Help writing posts — 3 uses per month</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">3 uses/month</Badge>
             </div>
          </div>
        </div>

        {/* Interaction Boost */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5" />
            <h2 className="text-xl font-semibold">💬 Interaction Boost</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-pink-200">
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Pin one important comment to the top of each post to highlight key information or responses. Great for FAQs or important announcements. CONSEQUENCES: TURNING OFF: No comment pinning ability, important replies get buried. TURNING ON: Highlight key comments, better engagement organization, improved post management."
                 type="info"
               >
                 <div>
                   <label className="font-medium">💬 Pinned Comments</label>
                   <p className="text-sm text-gray-500">Ability to pin 1 comment per post</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">1 pin/post</Badge>
             </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Use rich text formatting in comments including bold, italic, emojis, and custom spacing to make your comments more engaging and expressive. CONSEQUENCES: TURNING OFF: Plain text comments only, less visual appeal, reduced engagement. TURNING ON: Rich formatted comments, better visual impact, increased interaction."
                type="info"
              >
                <div>
                  <label className="font-medium">💎 Comment Formatting Tools</label>
                  <p className="text-sm text-gray-500">Use bold/italic text, emojis, and custom spacing in comments</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.commentFormattingTools}
                onCheckedChange={(value) => handleSettingChange('commentFormattingTools', value)}
              />
            </div>
          </div>
        </div>

        {/* Bonus Monetization & Rewards */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="h-5 w-5" />
            <h2 className="text-xl font-semibold">💸 Bonus Monetization & Rewards</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Earn daily rewards including tokens, boosts, or special features for consistent platform engagement. Builds loyalty and provides ongoing value. CONSEQUENCES: TURNING OFF: Miss daily rewards, no bonus tokens, reduced platform benefits. TURNING ON: Daily bonus rewards, extra tokens, increased engagement incentives."
                type="warning"
              >
                <div>
                  <label className="font-medium">💰 Low Pro Daily Reward</label>
                  <p className="text-sm text-gray-500">Claim daily bonus coins/tokens to boost posts, highlight profile, or unlock themes</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.dailyReward}
                onCheckedChange={(value) => handleSettingChange('dailyReward', value)}
              />
            </div>

             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Get a free 7-day trial of Medium Pro features once per year. Perfect way to experience premium features before upgrading. CONSEQUENCES: TURNING OFF: No free trial access, must pay to test Medium Pro features. TURNING ON: Free annual trial, test premium features, informed upgrade decisions."
                 type="info"
               >
                 <div>
                   <label className="font-medium">🎫 Free 7-day Medium Pro Trial</label>
                   <p className="text-sm text-gray-500">Once per year trial of Medium Pro features</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">1x/year</Badge>
             </div>

             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Unlock any Medium Pro feature for 24 hours each month. Try analytics, extra scheduling, or other premium features temporarily. CONSEQUENCES: TURNING OFF: No temporary premium access, can't test features. TURNING ON: Monthly premium feature access, explore upgrades, temporary boost capabilities."
                 type="info"
               >
                 <div>
                   <label className="font-medium">🔓 Monthly Unlock Token</label>
                   <p className="text-sm text-gray-500">Unlock a Medium Pro feature for 24h (analytics, extra scheduler)</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">1x/month</Badge>
             </div>
          </div>
        </div>

        {/* Exclusive Access */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🧩 Exclusive Access</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Access exclusive Pro-only groups like 'Entrepreneurs Network' or 'Creative Writers' with verified members only. Premium networking opportunity. CONSEQUENCES: TURNING OFF: Miss exclusive networking, no access to premium communities, reduced professional connections. TURNING ON: Access to elite groups, better networking, verified member interactions."
                type="info"
              >
                <div>
                  <label className="font-medium">🔒 Pro-Only Group Join</label>
                  <p className="text-sm text-gray-500">Access to 1 exclusive Pro-only group</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.proOnlyGroupJoin}
                onCheckedChange={(value) => handleSettingChange('proOnlyGroupJoin', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Participate in exclusive Pro discussion threads like Reddit AMAs or Twitter Spaces (text-only). Engage with industry leaders and premium members. CONSEQUENCES: TURNING OFF: Miss exclusive discussions, no access to expert conversations, reduced learning opportunities. TURNING ON: Join premium discussions, network with experts, exclusive content access."
                type="info"
              >
                <div>
                  <label className="font-medium">🧵 Pro Discussion Threads</label>
                  <p className="text-sm text-gray-500">Post or comment on exclusive community threads</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.proDiscussionThreads}
                onCheckedChange={(value) => handleSettingChange('proDiscussionThreads', value)}
              />
            </div>
          </div>
        </div>

        {/* Profile & Appearance */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-rose-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🖼️ Profile & Appearance</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-rose-200">
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Choose 1 custom theme from dark gold, gradient blue, or soft pastel options. Personalize your profile with premium color schemes. CONSEQUENCES: TURNING OFF: Stuck with default theme, plain appearance, no personalization. TURNING ON: Premium theme access, enhanced visual appeal, professional customization."
                 type="info"
               >
                 <div>
                   <label className="font-medium">🎨 1 Pro Theme Slot</label>
                   <p className="text-sm text-gray-500">Choose 1 custom theme (dark gold, gradient blue, or soft pastel)</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">1 theme</Badge>
             </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Add a subtle glowing or pulsing icon next to your name that indicates Pro status. Can be disabled in settings for minimalist preference. CONSEQUENCES: TURNING OFF: No visual Pro status indicator, missed recognition opportunities. TURNING ON: Subtle Pro badge animation, enhanced credibility, professional appearance."
                type="warning"
              >
                <div>
                  <label className="font-medium">🧬 Profile Animation Badge (Subtle)</label>
                  <p className="text-sm text-gray-500">A glowing or pulsing icon next to your name (can be turned off in settings)</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.profileAnimationBadge}
                onCheckedChange={(value) => handleSettingChange('profileAnimationBadge', value)}
              />
            </div>
          </div>
        </div>
        {/* Post & Profile Tools */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Edit className="h-5 w-5" />
            <h2 className="text-xl font-semibold">💼 Post & Profile Tools</h2>
          </div>
          
          <div className="space-y-4 pl-4 border-l-2 border-teal-200">
             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Edit your posts up to 10 minutes after publishing to fix typos or add missing information. Free users cannot edit published posts. CONSEQUENCES: TURNING OFF: Cannot fix mistakes after posting, typos stay permanent, missed correction opportunities. TURNING ON: 10-minute edit window, fix typos and errors, improve post quality."
                 type="warning"
               >
                 <div>
                   <label className="font-medium">🔄 Edit Posts After Publish (Limited)</label>
                   <p className="text-sm text-gray-500">Edit a post up to 10 minutes after it's published (Free users: no edit)</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">10 min window</Badge>
             </div>

             <div className="flex items-center justify-between p-4 border rounded-lg">
               <InfoTooltip 
                 content="Upload larger files up to 100MB compared to 25MB limit for free users. Perfect for high-quality images, longer videos, and detailed documents. CONSEQUENCES: TURNING OFF: Limited to 25MB uploads, can't share high-quality content, reduced file sharing capability. TURNING ON: 100MB upload limit, share high-quality media, better content capabilities."
                 type="info"
               >
                 <div>
                   <label className="font-medium">📎 Attach Larger Files</label>
                   <p className="text-sm text-gray-500">Slightly increased upload size: 100MB vs 25MB for Free</p>
                 </div>
               </InfoTooltip>
               <Badge variant="outline">100MB limit</Badge>
             </div>
          </div>
        </div>

        {/* Activity Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-amber-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5" />
            <h2 className="text-xl font-semibold">📊 Activity Insights</h2>
          </div>
          <p className="text-muted-foreground mb-6">Detailed analytics and visitor tracking</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-amber-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="See who visited your profile recently - shows last 3 visitors with their names and when they viewed your profile. Very popular on LinkedIn-style networks for networking. CONSEQUENCES: TURNING OFF: No visitor tracking, miss networking opportunities, can't see who's interested in your profile. TURNING ON: Track profile visitors, identify networking opportunities, understand profile reach."
                type="info"
              >
                <div>
                  <label className="font-medium">🔁 See Who Viewed Profile (Last 3 Visitors)</label>
                  <p className="text-sm text-gray-500">Very popular on LinkedIn-style networks</p>
                </div>
              </InfoTooltip>
              <Badge variant="outline">Last 3 visitors</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Chart showing when your posts perform best throughout the day. Helps optimize posting times for maximum engagement. CONSEQUENCES: TURNING OFF: No timing insights, post at random times, miss peak engagement hours. TURNING ON: Optimize posting schedule, increase engagement, data-driven timing strategy."
                type="warning"
              >
                <div>
                  <label className="font-medium">🕒 Engagement by Time of Day</label>
                  <p className="text-sm text-gray-500">Chart showing when your posts perform best</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.engagementByTimeOfDay}
                onCheckedChange={(value) => handleSettingChange('engagementByTimeOfDay', value)}
              />
            </div>
          </div>
        </div>

        {/* Platform Tools */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🔧 Platform Tools</h2>
          </div>
          <p className="text-muted-foreground mb-6">Advanced filtering and feed customization</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-teal-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Hide promoted content, trending distractions for a focus-only view. Creates a clean, distraction-free feed experience. CONSEQUENCES: TURNING OFF: See all promoted content, ads, trending distractions, cluttered experience. TURNING ON: Clean focused feed, no distractions, better productivity and content focus."
                type="info"
              >
                <div>
                  <label className="font-medium">🧼 Clean Feed Mode</label>
                  <p className="text-sm text-gray-500">Hide promoted content, trending distractions — focus-only view</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.cleanFeedMode}
                onCheckedChange={(value) => handleSettingChange('cleanFeedMode', value)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Save your own default filters like only posts from groups, or only Reels from friends. Customize your default viewing experience. CONSEQUENCES: TURNING OFF: Manual filtering every time, inconsistent feed experience, time-consuming setup. TURNING ON: Automated filtering, consistent personalized feed, time-saving preset filters."
                type="info"
              >
                <div>
                  <label className="font-medium">🧭 Save Filters as Default</label>
                  <p className="text-sm text-gray-500">Save your own default filters (e.g., only posts from groups, or only Reels from friends)</p>
                </div>
              </InfoTooltip>
              <Switch
                checked={settings.saveFiltersAsDefault}
                onCheckedChange={(value) => handleSettingChange('saveFiltersAsDefault', value)}
              />
            </div>
          </div>
        </div>

        {/* Low Pro Bonus Monetization Tools */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Ticket className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🪙 Low Pro Bonus Monetization Tools</h2>
          </div>
          <p className="text-muted-foreground mb-6">Token system and gamification features</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <InfoTooltip 
                content="Earn 5 tokens per month to use for special features like pinning posts, highlighting comments, requesting AI post boosts, or sending anonymous feedback. CONSEQUENCES: TURNING OFF: No token system, miss special feature access, reduced engagement tools. TURNING ON: Monthly tokens, access to premium features, enhanced engagement capabilities."
                type="info"
              >
                <div>
                  <label className="font-medium">🎟️ Low Pro Tokens</label>
                  <p className="text-sm text-gray-500">Earn 5 tokens/month to: Pin a post, Highlight comment, Request AI post boost, Send anonymous feedback</p>
                </div>
              </InfoTooltip>
              <Badge variant="outline">5 tokens/month</Badge>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-medium mb-2">Token Usage Options:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>• Pin a post</div>
                <div>• Highlight comment</div>
                <div>• Request AI post boost</div>
                <div>• Send anonymous feedback suggestion</div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Logic Implementation */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5" />
            <h2 className="text-xl font-semibold">🔐 Feature Access Logic</h2>
          </div>
          <p className="text-muted-foreground mb-6">Current feature configuration for Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-mono text-sm font-medium mb-2">if (user.plan === "low_pro") &#123;</h4>
              <div className="ml-4 space-y-1 text-sm font-mono text-muted-foreground">
                <div>show: [</div>
                <div className="ml-4">theme_picker,</div>
                <div className="ml-4">hide_ads,</div>
                <div className="ml-4">schedule_post_limit_5,</div>
                <div className="ml-4">AI_digest_lite,</div>
                <div className="ml-4">invisible_mode,</div>
                <div className="ml-4">basic_post_analytics,</div>
                <div className="ml-4">comment_pin_limit_1,</div>
                <div className="ml-4">daily_rewards,</div>
                <div className="ml-4">monthly_unlock_token</div>
                <div>]</div>
              </div>
              <div className="font-mono text-sm font-medium">&#125;</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* ===== ADMIN MANAGEMENT TOOLS FOR LOW PRO USERS ===== */}
        
        {/* Filter Users by Tier */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">📋 Filter Users by Tier</h2>
          </div>
          <p className="text-muted-foreground mb-6">View and manage Low Pro users with advanced filtering</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-blue-200">
            <div className="flex gap-2 flex-wrap">
              {['All', 'Free', 'Low', 'Medium', 'Super'].map((tier) => (
                <Button
                  key={tier}
                  variant={selectedTier === tier ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTier(tier)}
                >
                  {tier}
                </Button>
              ))}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3">
                <div className="grid grid-cols-6 gap-4 font-medium text-sm">
                  <div>Name</div>
                  <div>Email</div>
                  <div>Plan</div>
                  <div>Join Date</div>
                  <div>Last Payment</div>
                  <div>Status</div>
                </div>
              </div>
              <div className="divide-y">
                {mockUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-6 gap-4 p-3 text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground">{user.email}</div>
                    <div>
                      <Badge variant="secondary">{user.plan}</Badge>
                    </div>
                    <div>{user.joinDate}</div>
                    <div>{user.lastPayment}</div>
                    <div>
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <CreditCard className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold">💳 Payment History Logs</h2>
          </div>
          <p className="text-muted-foreground mb-6">View individual and group payment histories for Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-green-200">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted p-3">
                <div className="grid grid-cols-7 gap-3 font-medium text-sm">
                  <div>User</div>
                  <div>Amount</div>
                  <div>Method</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Start Date</div>
                  <div>End Date</div>
                </div>
              </div>
              <div className="divide-y">
                {mockPaymentHistory.map((payment) => (
                  <div key={payment.id} className="grid grid-cols-7 gap-3 p-3 text-sm">
                    <div className="font-medium">{payment.user}</div>
                    <div className="text-green-600 font-medium">{payment.amount}</div>
                    <div>
                      <Badge variant="outline">{payment.method}</Badge>
                    </div>
                    <div>
                      <Badge variant={payment.status === 'Success' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                    </div>
                    <div>{payment.date}</div>
                    <div>{payment.subscriptionStart}</div>
                    <div>{payment.subscriptionEnd}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Abuse Monitoring */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold">🚫 Abuse Monitoring</h2>
          </div>
          <p className="text-muted-foreground mb-6">Detect and track abuse patterns among Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-red-200">
            <div className="grid gap-4">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Monitoring Categories:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700">
                  <div>• Spamming boost tokens</div>
                  <div>• Flagging posts falsely</div>
                  <div>• Upload limits violations</div>
                  <div>• Excessive content reporting</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recent Alerts:</h4>
                {mockAbuseAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{alert.user}</div>
                      <div className="text-sm text-muted-foreground">{alert.type}: {alert.description}</div>
                      <div className="text-xs text-muted-foreground">{alert.date}</div>
                    </div>
                    <Badge 
                      variant={alert.severity === 'High' ? 'destructive' : 
                              alert.severity === 'Medium' ? 'secondary' : 'outline'}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Usage Tracking */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">📈 Feature Usage Tracking</h2>
          </div>
          <p className="text-muted-foreground mb-6">Monitor how Low Pro features are being utilized</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-purple-200">
            <div className="grid gap-4">
              {mockFeatureUsage.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.feature}</div>
                    <div className="text-sm text-muted-foreground">{item.usage}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {item.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Additional Metrics:</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>• Monthly unlock tokens used: 78%</div>
                <div>• Clean feed mode usage: 42%</div>
                <div>• Theme customization: 65%</div>
                <div>• Profile animation badges: 23%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward Feature Toggles */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Gift className="h-5 w-5 text-pink-600" />
            <h2 className="text-xl font-semibold">🎁 Reward Feature Toggles</h2>
          </div>
          <p className="text-muted-foreground mb-6">Grant special rewards and bonuses to Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-pink-200">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">User Reward Controls:</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Add extra boost tokens</span>
                    <Button size="sm" variant="outline">
                      <Gift className="h-4 w-4 mr-1" />
                      Grant 5 tokens
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Extend plan duration</span>
                    <Button size="sm" variant="outline">
                      <Clock className="h-4 w-4 mr-1" />
                      +1 month free
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Unlock Medium Pro trial</span>
                    <Button size="sm" variant="outline">
                      <Crown className="h-4 w-4 mr-1" />
                      7-day trial
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Bulk Reward Actions:</h4>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Reward All Active Users
                  </Button>
                  <Button size="sm" variant="outline">
                    Holiday Bonus Campaign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Access Control */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold">🧩 Module Access Control</h2>
          </div>
          <p className="text-muted-foreground mb-6">Manually enable/disable experimental or premium modules for Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-orange-200">
            <div className="grid gap-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <InfoTooltip 
                    content="Enhanced AI writing assistance for Low Pro users. Provides better content suggestions and writing help. CONSEQUENCES: TURNING OFF: Users lose AI writing assistance, reduced content quality support. TURNING ON: Enhanced writing tools, better content creation support."
                    type="info"
                  >
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <div>
                        <label className="font-medium">AI Writer ✍️</label>
                        <p className="text-sm text-gray-500">Enhanced AI writing assistance</p>
                      </div>
                    </div>
                  </InfoTooltip>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <InfoTooltip 
                    content="Advanced profile customization features for Low Pro users. Allows deeper personalization options. CONSEQUENCES: TURNING OFF: Limited profile customization, basic appearance only. TURNING ON: Advanced customization, enhanced profile personalization."
                    type="info"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <div>
                        <label className="font-medium">Smart Profiles 🎨</label>
                        <p className="text-sm text-gray-500">Advanced profile customization</p>
                      </div>
                    </div>
                  </InfoTooltip>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <InfoTooltip 
                    content="Advanced content filtering capabilities exclusive to Pro users. Better content curation and feed management. CONSEQUENCES: TURNING OFF: Basic filtering only, limited content control. TURNING ON: Advanced filtering, better content curation."
                    type="warning"
                  >
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5 text-green-600" />
                      <div>
                        <label className="font-medium">Pro-only Filters 🎥</label>
                        <p className="text-sm text-gray-500">Advanced content filtering</p>
                      </div>
                    </div>
                  </InfoTooltip>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">Beta Features (Low Pro):</h4>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex items-center justify-between">
                    <span>• Enhanced comment threading</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Smart notification grouping</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• Advanced post scheduling</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Send className="h-5 w-5 text-indigo-600" />
            <h2 className="text-xl font-semibold">📬 Communication Channels</h2>
          </div>
          <p className="text-muted-foreground mb-6">Send targeted messages to Low Pro users</p>
          
          <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
            <div className="grid gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Message Type:</h4>
                <div className="flex gap-2">
                  {[
                    { value: 'email', label: 'Email Blast', icon: Mail },
                    { value: 'app', label: 'In-App Notification', icon: Bell },
                    { value: 'push', label: 'Push Notification', icon: Smartphone }
                  ].map((type) => (
                    <Button
                      key={type.value}
                      variant={selectedCommunicationType === type.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCommunicationType(type.value)}
                    >
                      <type.icon className="h-4 w-4 mr-1" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Message Content:</h4>
                <Input
                  placeholder="Subject line or notification title"
                  className="w-full"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message body:</label>
                  <textarea
                    className="w-full p-3 border rounded-lg resize-none"
                    rows={4}
                    placeholder="Enter your message for Low Pro users..."
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">Common Use Cases:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-indigo-700">
                  <div>• New Low Pro features announcement</div>
                  <div>• Exclusive event invitations</div>
                  <div>• Reward program updates</div>
                  <div>• Feedback surveys</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send to All Low Pro Users
                </Button>
                <Button variant="outline">
                  <Globe className="h-4 w-4 mr-2" />
                  Preview Message
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default LowProUserSettings;