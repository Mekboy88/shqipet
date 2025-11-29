import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Crown, 
  Brain, 
  Briefcase, 
  Camera, 
  BarChart3, 
  Beaker, 
  Shield,
  Zap,
  Upload,
  Calendar,
  Palette,
  DollarSign,
  MessageSquare,
  Star,
  Video,
  Music,
  Sparkles,
  Users,
  Heart,
  Settings,
  Mail,
  Bell,
  Lock,
  Info,
  Wifi,
  WifiOff
} from 'lucide-react';

const SuperProUserSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('core');
  const [settings, setSettings] = useState({
    // Core Features
    enabled: true,
    ultraHdVideo: true,
    unlimitedBoostTokens: true,
    maxVideoUpload: 5000, // MB (5GB)
    maxVideoResolution: '4K',
    advancedScheduler: true,
    aiSchedulingSuggestions: true,
    
    // AI Features
    aiWriterPro: true,
    aiHashtagGenerator: true,
    autoReplyEngine: true,
    aiSuggestedImprovements: true,
    aiFeedPersonalization: true,
    aiEnhancedBadge: true,
    
    // Business Tools
    proStorefront: true,
    stripeIntegration: true,
    paypalIntegration: true,
    revenueTracking: true,
    coursesMonetization: true,
    affiliateEarnings: true,
    
    // Content & Media
    contentReplication: true,
    crossPlatformPosting: true,
    creatorWorkspace: true,
    draftManager: true,
    goalTracker: true,
    editorialCalendar: true,
    collaborationNotes: true,
    
    // Analytics & Insights
    premiumAnalytics: true,
    revenueDashboard: true,
    engagementHeatmaps: true,
    downloadableReports: true,
    
    // Experimental
    multiAccountManagement: true,
    maxLinkedProfiles: 5,
    allModulesAccess: true,
    loyaltyRewards: true,
    
    // Admin Controls
    prioritySupport: true,
    premiumDiscovery: true,
    verifiedBadge: true,
    animatedBadge: true,
    profileGlowEffect: true,
    elitePartnerBadge: true,
    trainingHub: true,
    contentVault: true,
    vaultStorageSize: 20, // GB
    
    // Elite-Level Features
    audienceSegmentationAi: true,
    smartSegments: true,
    targetedPosting: true,
    segmentAnalytics: true,
    contentLicensing: true,
    takedownRequestPanel: true,
    autoWatermark: true,
    apiAccess: true,
    personalApiKeys: true,
    webhooks: true,
    developerAnalytics: true,
    affiliateLinkBuilder: true,
    marketplaceBoosts: true,
    revenueSplits: true,
    bundleBuilder: true,
    oneClickBuy: true,
    gatedAccess: true,
    clientAccountManager: true,
    approvalWorkflow: true,
    invoiceExport: true,
    
    // AI Co-Pilot Assistant
    smartContentDrafting: true,
    aiCalendarManager: true,
    goalTrackingAssistant: true,
    
    // Global Promotion Engine
    crossUserBoostNetwork: true,
    weeklySpotlightNewsletter: true,
    trendingBoardPriority: true,
    
    // Cloud Workspace Expansion
    expandableCloudVault: true,
    encryptedCollaborationFolders: true,
    autoSyncDesktop: true,
    
    // Enterprise Identity & Branding
    verifiedBrandId: true,
    modularBrandingTemplates: true,
    whiteLabelProfileLink: true,
    
    // Innovation Additions (Elite-Level)
    aiTrendRadar: true,
    trendWatchFeed: true,
    forecastAlerts: true,
    topicGenerator: true,
    creatorAcademyPartner: true,
    becomeInstructor: true,
    revenueShareTracker: true,
    privateCourseEnrollment: true,
    aiLocalizationEngine: true,
    languageVariants: true,
    culturalAdjustments: true,
    publishPerRegion: true,
    digitalAgencyWorkspace: true,
    teamRoles: true,
    billClientsFromDashboard: true,
    sharedContentCalendar: true,
    contentInsurance: true,
    archiveBackup: true,
    repostMonitoring: true,
    contentInsuranceBadge: true,
    
    // Additional Elite Features
    smartCollaborationHub: true,
    inviteCollaborators: true,
    revenuePerCollaborator: true,
    coCreatorBadge: true,
    aiPoweredAudienceCoach: true,
    engagementOptimization: true,
    hashtagCategoryOptimization: true,
    audienceReactionLearning: true,
    customAutomationRules: true,
    noCodeFlowBuilder: true,
    conditionalAutomations: true,
    tokenBasedEconomy: true,
    platformTokens: true,
    tokenEarning: true,
    tokenSpending: true,
    offlineSyncPublishing: true,
    offlineContentEditing: true,
    autoPublishOnReconnect: true,
    
    // AI Voice & Video Clone Studio
    aiVoiceVideoStudio: true,
    voiceCloneNarration: true,
    aiGeneratedVideos: true,
    avatarMultilingual: true,
    consentLicensingControl: true,
    
    // Emotion-Based Feed Tuning
    emotionBasedFeedTuning: true,
    upliftingContentPriority: true,
    personalizedFocusMode: true,
    moodDetectionOptIn: true,
    
    // Plugin Marketplace
    pluginMarketplace: true,
    extraAnalyticsTools: true,
    dashboardWidgets: true,
    developerSDK: true,
    
    // Branded Workspace Builder
    brandedWorkspaceBuilder: true,
    dragDropUIPanels: true,
    customLogosColors: true,
    teamClientSharing: true,
    
    // Smart Licensing Blockchain Record
    smartLicensingBlockchain: true,
    nftStyleRecord: true,
    originalityTimestamp: true,
    publicLicenseOption: true,
    
    // Global Sync Dashboard
    globalSyncDashboard: true,
    multiPlatformPosting: true,
    unifiedScheduling: true,
    crossPlatformAnalytics: true,
    unifiedEngagementReplies: true,
    
    // AI Network Intelligence
    aiNetworkIntelligence: true,
    creatorInnovationFeed: true,
    trendPrediction: true,
    optimalPostingTimesSuggestion: true,
    
    // Content Vault Trust Scoring
    contentVaultTrustScoring: true,
    performanceBasedCaching: true,
    watermarkingBackupDetection: true,
    vettedContentGlow: true,
    
    // SaaS-as-a-Feature
    saasAsFeature: true,
    miniPlatformBuilder: true,
    chargeFollowersUsage: true,
    backendIntegration: true,
    
    // Gamified Growth Battle Pass
    gamifiedGrowthBattlePass: true,
    levelsUnlockables: true,
    pointsEarning: true,
    premiumUnlocks: true,
    
    // Metaverse & AR Integration
    metaverseARIntegration: true,
    arFiltersScenes: true,
    threeDPostsAvatars: true,
    arShowroomMerch: true,
    
    // No-Code Automation Hub
    noCodeAutomationHub: true,
    creatorAutomations: true,
    
    // Pro E-commerce SDK
    proEcommerceSDK: true,
    embeddedShops: true,
    
    // Mobile-Only Super Pro Mode
    mobileOnlySuperProMode: true,
    exclusiveMobileInterface: true,
    
    // Network Portability
    networkPortability: true,
    followerPortability: true,
    
    // Regulatory Compliance Center
    regulatoryComplianceCenter: true,
    gdprCcpaReports: true,
    adTrackingDisclosures: true,
    consentBannersPerAudience: true,
    
    // Super Pro-to-Super Pro Collab Engine
    superProCollabEngine: true,
    creatorMatching: true,
    growthCurveAnalysis: true,
    
    // AI Upsell Assistant
    aiUpsellAssistant: true,
    viralityBasedUpsells: true,
    boostingBehaviorAnalysis: true,
    engagementOpportunityAlerts: true,
    
    // Web3/Tokenized Add-On (Experimental)
    web3TokenizedAddOn: true,
    nftContentMinting: true,
    tokenGatedPacks: true,
    cryptoPayments: true
  });

  const [pricing, setPricing] = useState({
    monthly: 19.99,
    quarterly: 39.99,
    yearly: 99.99,
    currency: 'GBP',
    trialDays: 7,
    autoRenewDiscount: 15
  });

  const sections = [
    { id: 'core', label: 'Core Features', icon: Crown },
    { id: 'ai', label: 'AI Features', icon: Brain },
    { id: 'business', label: 'Business Tools', icon: Briefcase },
    { id: 'content', label: 'Content & Media', icon: Camera },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { id: 'experimental', label: 'Experimental', icon: Beaker },
    { id: 'admin', label: 'Admin Controls', icon: Shield }
  ];

  const handleSettingChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePricingChange = (key: string, value: any) => {
    setPricing(prev => ({ ...prev, [key]: value }));
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

  const renderCoreFeatures = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Current Plan Management</h3>
        </div>
        <p className="text-muted-foreground mb-6">Manage Super Pro plan settings and pricing</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Enable or disable the Super Pro tier for all users. CONSEQUENCES: TURNING OFF: No Super Pro features available, revenue loss, user downgrades. TURNING ON: Premium features active, maximum revenue potential, enhanced user experience."
              type="info"
            >
              <Label htmlFor="enabled">Enable Super Pro Tier</Label>
            </InfoTooltip>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(value) => handleSettingChange('enabled', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="monthly">Monthly Price (£)</Label>
              <Input
                id="monthly"
                type="number"
                value={pricing.monthly}
                onChange={(e) => handlePricingChange('monthly', parseFloat(e.target.value))}
                min="14.99"
                max="29.99"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="quarterly">Quarterly Price (£)</Label>
              <Input
                id="quarterly"
                type="number"
                value={pricing.quarterly}
                onChange={(e) => handlePricingChange('quarterly', parseFloat(e.target.value))}
                min="39.99"
                max="79.99"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="yearly">Yearly Price (£)</Label>
              <Input
                id="yearly"
                type="number"
                value={pricing.yearly}
                onChange={(e) => handlePricingChange('yearly', parseFloat(e.target.value))}
                min="99.99"
                max="299.99"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={pricing.currency} onValueChange={(value) => handlePricingChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="ALL">ALL (Lek)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="trialDays">Free Trial Days</Label>
              <Select value={pricing.trialDays.toString()} onValueChange={(value) => handlePricingChange('trialDays', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Trial</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">Auto-Renew Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                value={pricing.autoRenewDiscount}
                onChange={(e) => handlePricingChange('autoRenewDiscount', parseInt(e.target.value))}
                min="0"
                max="50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">🎥 Ultra HD Video Support</h3>
        </div>
        <p className="text-muted-foreground mb-6">Premium video upload capabilities with 4K support</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Enable Ultra HD video support for premium uploads. CONSEQUENCES: TURNING OFF: Limited to HD resolution, reduced video quality, lower user satisfaction. TURNING ON: 4K/8K support, professional content quality, increased storage costs."
              type="info"
            >
              <Label htmlFor="ultraHd">Ultra HD Video Support</Label>
            </InfoTooltip>
            <Switch
              id="ultraHd"
              checked={settings.ultraHdVideo}
              onCheckedChange={(value) => handleSettingChange('ultraHdVideo', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxVideoSize">Max Video Upload (MB)</Label>
              <Input
                id="maxVideoSize"
                type="number"
                value={settings.maxVideoUpload}
                onChange={(e) => handleSettingChange('maxVideoUpload', parseInt(e.target.value))}
                min="2000"
                max="8000"
              />
            </div>
            <div>
              <Label htmlFor="maxResolution">Max Resolution</Label>
              <Select value={settings.maxVideoResolution} onValueChange={(value) => handleSettingChange('maxVideoResolution', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HD">HD (1080p)</SelectItem>
                  <SelectItem value="2K">2K (1440p)</SelectItem>
                  <SelectItem value="4K">4K (2160p)</SelectItem>
                  <SelectItem value="8K">8K (4320p)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Supported formats: MP4, MOV, MKV • Size range: 2-5GB
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">🪙 Unlimited Boost Tokens</h3>
        </div>
        <p className="text-muted-foreground mb-6">No limits on content boosting with analytics panel</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Provide unlimited boost tokens for Super Pro users. CONSEQUENCES: TURNING OFF: Limited boosting capability, reduced content visibility, lower engagement rates. TURNING ON: Unlimited content promotion, maximum reach potential, increased engagement."
              type="info"
            >
              <Label htmlFor="unlimitedBoost">Unlimited Boost Tokens</Label>
            </InfoTooltip>
            <Switch
              id="unlimitedBoost"
              checked={settings.unlimitedBoostTokens}
              onCheckedChange={(value) => handleSettingChange('unlimitedBoostTokens', value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            • No monthly limits on boosting posts
            • Top placement in feeds and explore sections
            • Usage analytics panel included
            • Real-time boost performance tracking
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">📆 Advanced Scheduler + AI Suggestions</h3>
        </div>
        <p className="text-muted-foreground mb-6">Precision scheduling with AI-powered timing recommendations</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Advanced post scheduling with minute-level precision. CONSEQUENCES: TURNING OFF: Basic scheduling only, missed optimal posting times, reduced engagement. TURNING ON: Precise scheduling, optimal timing, increased post performance."
              type="info"
            >
              <Label>Advanced Scheduler</Label>
            </InfoTooltip>
            <Switch
              checked={settings.advancedScheduler}
              onCheckedChange={(value) => handleSettingChange('advancedScheduler', value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="AI-powered scheduling suggestions based on engagement patterns. CONSEQUENCES: TURNING OFF: Manual timing decisions, suboptimal post performance, missed peak engagement windows. TURNING ON: AI-optimized timing, maximum reach, data-driven scheduling."
              type="info"
            >
              <Label>AI Scheduling Suggestions</Label>
            </InfoTooltip>
            <Switch
              checked={settings.aiSchedulingSuggestions}
              onCheckedChange={(value) => handleSettingChange('aiSchedulingSuggestions', value)}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            • Schedule posts down to the minute
            • AI recommends optimal posting times
            • Based on past engagement patterns
            • Smart timezone adjustments
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIFeatures = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">🧠 AI Premium Feed Personalization</h3>
        </div>
        <p className="text-muted-foreground mb-6">Intelligent content reordering and personalized feeds</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered feed personalization for enhanced user experience. CONSEQUENCES: TURNING OFF: Generic feed ordering, reduced engagement, poor content discovery. TURNING ON: Personalized content, higher engagement, improved user satisfaction."
                type="info"
              >
                <Label>AI Feed Personalization</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Feed reorders content based on user behavior and interests</p>
            </div>
            <Switch
              checked={settings.aiFeedPersonalization}
              onCheckedChange={(value) => handleSettingChange('aiFeedPersonalization', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Manual Algorithm Tweaks</Label>
              <p className="text-sm text-muted-foreground">Users can manually adjust AI preference models</p>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Intelligent content reordering based on user behavior
            • AI preference model learning
            • Manual algorithm adjustment controls
            • Real-time feed optimization
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">AI Co-Pilot Tools</h3>
        </div>
        <p className="text-muted-foreground mb-6">Advanced AI-powered content creation and management</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Advanced AI writing assistant with context awareness. CONSEQUENCES: TURNING OFF: Manual content creation only, reduced writing quality, no AI assistance. TURNING ON: Enhanced content creation, AI-powered suggestions, improved writing quality."
                type="info"
              >
                <Label>AI Writer Pro</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Advanced content generation with context awareness</p>
            </div>
            <Switch
              checked={settings.aiWriterPro}
              onCheckedChange={(value) => handleSettingChange('aiWriterPro', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Smart hashtag suggestions based on content analysis. CONSEQUENCES: TURNING OFF: Manual hashtag creation, reduced discoverability, lower reach. TURNING ON: AI-optimized hashtags, better content discovery, increased engagement."
                type="info"
              >
                <Label>AI Hashtag Generator</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Smart hashtag suggestions based on content analysis</p>
            </div>
            <Switch
              checked={settings.aiHashtagGenerator}
              onCheckedChange={(value) => handleSettingChange('aiHashtagGenerator', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Intelligent automated comment responses and engagement. CONSEQUENCES: TURNING OFF: Manual replies only, slower response times, reduced engagement. TURNING ON: Automated intelligent responses, faster engagement, improved user interaction."
                type="info"
              >
                <Label>Auto-Reply Engine</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Intelligent comment responses and engagement</p>
            </div>
            <Switch
              checked={settings.autoReplyEngine}
              onCheckedChange={(value) => handleSettingChange('autoReplyEngine', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Special badge indicating AI-enhanced content creation. CONSEQUENCES: TURNING OFF: No AI content identification, reduced trust indicators. TURNING ON: Content authenticity badges, AI transparency, user trust building."
                type="info"
              >
                <Label>🧠 "AI Enhanced" Badge</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Special badge for AI-powered content</p>
            </div>
            <Switch
              checked={settings.aiEnhancedBadge}
              onCheckedChange={(value) => handleSettingChange('aiEnhancedBadge', value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI Co-Pilot Assistant</h3>
        </div>
        <p className="text-muted-foreground mb-6">Built-in productivity and strategy partner for Super Pro users</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered content drafting with smart suggestions. CONSEQUENCES: TURNING OFF: Manual content creation, no AI assistance, reduced efficiency. TURNING ON: Smart captions, hashtag suggestions, optimal formatting assistance."
                type="info"
              >
                <Label>Smart Content Drafting</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">AI suggests captions, hashtags, emojis, and optimal formats</p>
            </div>
            <Switch
              checked={settings.smartContentDrafting}
              onCheckedChange={(value) => handleSettingChange('smartContentDrafting', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Automated calendar management based on engagement patterns. CONSEQUENCES: TURNING OFF: Manual scheduling only, missed optimal posting times, reduced engagement. TURNING ON: AI-optimized scheduling, automatic calendar filling, peak engagement timing."
                type="info"
              >
                <Label>AI Calendar Manager</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Automatically fills content calendar based on engagement patterns</p>
            </div>
            <Switch
              checked={settings.aiCalendarManager}
              onCheckedChange={(value) => handleSettingChange('aiCalendarManager', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered goal tracking with progress alerts and recommendations. CONSEQUENCES: TURNING OFF: Manual goal tracking, no progress alerts, reduced motivation. TURNING ON: Smart goal tracking, progress monitoring, personalized recommendations."
                type="info"
              >
                <Label>Goal Tracking Assistant</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Set targets and get AI-powered progress alerts</p>
            </div>
            <Switch
              checked={settings.goalTrackingAssistant}
              onCheckedChange={(value) => handleSettingChange('goalTrackingAssistant', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🧾 Smart Drafting</div>
              <div className="text-xs text-muted-foreground">Captions, hashtags, optimal length</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">📆 Auto Calendar</div>
              <div className="text-xs text-muted-foreground">Best posting times & frequency</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🎯 Goal Tracking</div>
              <div className="text-xs text-muted-foreground">Progress alerts & suggestions</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🔔 Smart Alerts</div>
              <div className="text-xs text-muted-foreground">"Best day to post is Thursday 3PM"</div>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • AI suggests different styles (professional, casual, viral)
            • Engagement time optimization based on past performance
            • Goal setting for followers, sales, and posting schedules
            • Progress tracking with personalized recommendations
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">📡 AI Trend Radar</h3>
        </div>
        <p className="text-muted-foreground mb-6">Real-time trend detection and content forecasting</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Real-time trending topics feed based on audience interests. CONSEQUENCES: TURNING OFF: Miss trending topics, reduced content relevance, lower engagement rates. TURNING ON: Real-time trend awareness, timely content creation, increased viral potential."
                type="info"
              >
                <Label>Trend Watch Feed</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Real-time trending topics based on audience interests</p>
            </div>
            <Switch
              checked={settings.trendWatchFeed}
              onCheckedChange={(value) => handleSettingChange('trendWatchFeed', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI alerts for upcoming trend spikes and viral opportunities. CONSEQUENCES: TURNING OFF: Miss viral opportunities, late trend adoption, reduced reach potential. TURNING ON: Early trend detection, proactive content creation, maximum viral potential."
                type="info"
              >
                <Label>Forecast Alerts</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">AI alerts when topics are about to spike in popularity</p>
            </div>
            <Switch
              checked={settings.forecastAlerts}
              onCheckedChange={(value) => handleSettingChange('forecastAlerts', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Daily viral content ideas tailored to your niche and past success. CONSEQUENCES: TURNING OFF: No content suggestions, manual ideation only, reduced creativity. TURNING ON: Daily viral ideas, personalized suggestions, enhanced content strategy."
                type="info"
              >
                <Label>Topic Generator</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Daily viral content ideas tailored to niche and past success</p>
            </div>
            <Switch
              checked={settings.topicGenerator}
              onCheckedChange={(value) => handleSettingChange('topicGenerator', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🔍 Trend Watch</Badge>
            <Badge variant="outline">📈 Forecasting</Badge>
            <Badge variant="outline">🧠 Content Ideas</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Real-time monitoring of trending topics
            • Predictive analytics for content timing
            • Personalized viral content suggestions
            • Audience interest pattern analysis
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">🌐 AI Localization Engine</h3>
        </div>
        <p className="text-muted-foreground mb-6">Multi-language and cultural content adaptation</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Auto-publish posts in multiple languages and dialects. CONSEQUENCES: TURNING OFF: Single language only, limited global reach, missed international audience. TURNING ON: Multi-language content, global accessibility, expanded audience reach."
                type="info"
              >
                <Label>Language Variants</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Auto-publish posts in multiple dialects and languages</p>
            </div>
            <Switch
              checked={settings.languageVariants}
              onCheckedChange={(value) => handleSettingChange('languageVariants', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Modify imagery and tone to fit regional cultural preferences. CONSEQUENCES: TURNING OFF: Generic content, cultural mismatches, reduced engagement. TURNING ON: Culturally appropriate content, better regional engagement, respectful localization."
                type="info"
              >
                <Label>Cultural Adjustments</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Modify imagery and tone to fit regional culture</p>
            </div>
            <Switch
              checked={settings.culturalAdjustments}
              onCheckedChange={(value) => handleSettingChange('culturalAdjustments', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Target or limit posts to specific countries and regions. CONSEQUENCES: TURNING OFF: Global posting only, no regional targeting, missed local opportunities. TURNING ON: Regional targeting, localized content, better local engagement."
                type="info"
              >
                <Label>Publish Per Region</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Limit or target posts to specific countries and areas</p>
            </div>
            <Switch
              checked={settings.publishPerRegion}
              onCheckedChange={(value) => handleSettingChange('publishPerRegion', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📚 Multi-Language</Badge>
            <Badge variant="outline">🎭 Cultural Adapt</Badge>
            <Badge variant="outline">🌎 Regional Target</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI-Powered Audience Coach</h3>
        </div>
        <p className="text-muted-foreground mb-6">Personal marketing strategist for Super Pro creators</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered engagement optimization with timing and content recommendations. CONSEQUENCES: TURNING OFF: Manual optimization only, suboptimal posting times, lower engagement rates. TURNING ON: AI-optimized timing, enhanced engagement strategies, maximum reach potential."
                type="info"
              >
                <Label>Engagement Optimization</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">AI tells you when and what to post for best engagement</p>
            </div>
            <Switch
              checked={settings.engagementOptimization}
              onCheckedChange={(value) => handleSettingChange('engagementOptimization', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI optimization of hashtags and categories for maximum reach. CONSEQUENCES: TURNING OFF: Manual hashtag selection, suboptimal categorization, reduced discoverability. TURNING ON: AI-optimized hashtags, better categorization, enhanced content discovery."
                type="info"
              >
                <Label>Hashtag & Category Optimization</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Optimizes hashtags and categories for maximum reach</p>
            </div>
            <Switch
              checked={settings.hashtagCategoryOptimization}
              onCheckedChange={(value) => handleSettingChange('hashtagCategoryOptimization', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Machine learning from audience reactions for improved targeting. CONSEQUENCES: TURNING OFF: No learning algorithm, static strategies, missed optimization opportunities. TURNING ON: Continuous learning, adaptive strategies, improved targeting over time."
                type="info"
              >
                <Label>Audience Reaction Learning</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Learns from audience reactions over time for better targeting</p>
            </div>
            <Switch
              checked={settings.audienceReactionLearning}
              onCheckedChange={(value) => handleSettingChange('audienceReactionLearning', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📈 Timing</Badge>
            <Badge variant="outline">🔁 Hashtags</Badge>
            <Badge variant="outline">🧠 Learning</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • AI analyzes optimal posting times
            • Smart hashtag and category suggestions
            • Machine learning from audience behavior
            • Personalized engagement strategies
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-violet-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">🧠 AI Voice & Video Clone Studio</h3>
        </div>
        <p className="text-muted-foreground mb-6">AI-powered media generation using creator's voice and face</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Generate AI-powered media using creator's voice and face. CONSEQUENCES: TURNING OFF: No AI media generation, manual content creation only, limited scalability. TURNING ON: AI-generated content, voice/video cloning, enhanced content production capabilities."
                type="info"
              >
                <Label>AI Voice & Video Studio</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Generate AI-powered media using creator's own voice and face</p>
            </div>
            <Switch
              checked={settings.aiVoiceVideoStudio}
              onCheckedChange={(value) => handleSettingChange('aiVoiceVideoStudio', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Voice cloning for automated narration of content. CONSEQUENCES: TURNING OFF: Manual narration only, time-intensive content creation, limited scalability. TURNING ON: Automated voice narration, scalable content production, consistent voice quality."
                type="info"
              >
                <Label>🎙️ Voice Clone Narration</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Voice clone to narrate blog posts or stories</p>
            </div>
            <Switch
              checked={settings.voiceCloneNarration}
              onCheckedChange={(value) => handleSettingChange('voiceCloneNarration', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-generated videos from text scripts and prompts. CONSEQUENCES: TURNING OFF: Manual video production only, high production costs, limited content volume. TURNING ON: Automated video generation, cost-effective production, scalable video content."
                type="info"
              >
                <Label>📽️ AI-Generated Videos</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">AI-generated videos from typed scripts</p>
            </div>
            <Switch
              checked={settings.aiGeneratedVideos}
              onCheckedChange={(value) => handleSettingChange('aiGeneratedVideos', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI avatar for multilingual content creation and voiceovers. CONSEQUENCES: TURNING OFF: Single language content, limited global reach, manual translation. TURNING ON: Multilingual avatars, global content reach, automated localization."
                type="info"
              >
                <Label>🧑‍🎨 Avatar Multilingual</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Use avatar for multilingual voiceovers</p>
            </div>
            <Switch
              checked={settings.avatarMultilingual}
              onCheckedChange={(value) => handleSettingChange('avatarMultilingual', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Strict consent and licensing controls for AI-generated content. CONSEQUENCES: TURNING OFF: Potential legal issues, unauthorized content use, compliance risks. TURNING ON: Legal compliance, proper consent management, protected content licensing."
                type="info"
              >
                <Label>🔒 Consent & Licensing Control</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Strict consent and licensing control</p>
            </div>
            <Switch
              checked={settings.consentLicensingControl}
              onCheckedChange={(value) => handleSettingChange('consentLicensingControl', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">🎙️ Voice Clone</Badge>
            <Badge variant="outline">📽️ Video AI</Badge>
            <Badge variant="outline">🧑‍🎨 Avatar</Badge>
            <Badge variant="outline">🔒 Licensing</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold">🧠 Emotion-Based Feed Tuning (Experimental)</h3>
        </div>
        <p className="text-muted-foreground mb-6">Feed adapts based on user emotional patterns</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered feed adaptation based on user emotional patterns. CONSEQUENCES: TURNING OFF: Generic feed content, no emotional intelligence, potential negative mood impact. TURNING ON: Emotionally aware content, mood-boosting algorithms, personalized wellbeing features."
                type="info"
              >
                <Label>Emotion-Based Feed Tuning</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Feed adapts based on user emotional patterns</p>
            </div>
            <Switch
              checked={settings.emotionBasedFeedTuning}
              onCheckedChange={(value) => handleSettingChange('emotionBasedFeedTuning', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Prioritize uplifting and positive content in feeds. CONSEQUENCES: TURNING OFF: Neutral content mix, potential negative content exposure, standard algorithmic selection. TURNING ON: Positive content priority, mood enhancement, uplifting user experience."
                type="info"
              >
                <Label>😄 Uplifting Content Priority</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Prioritize uplifting or calming posts</p>
            </div>
            <Switch
              checked={settings.upliftingContentPriority}
              onCheckedChange={(value) => handleSettingChange('upliftingContentPriority', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Personalized focus mode to reduce distractions and improve concentration. CONSEQUENCES: TURNING OFF: All content visible, potential distractions, standard feed experience. TURNING ON: Distraction filtering, enhanced focus, productivity features."
                type="info"
              >
                <Label>🧘 Personalized Focus Mode</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Focus Mode to hide distractions</p>
            </div>
            <Switch
              checked={settings.personalizedFocusMode}
              onCheckedChange={(value) => handleSettingChange('personalizedFocusMode', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Optional AI mood detection based on interaction patterns. CONSEQUENCES: TURNING OFF: No mood awareness, generic content delivery, missed emotional support opportunities. TURNING ON: Mood-aware AI, emotional intelligence, personalized content based on feelings."
                type="info"
              >
                <Label>🤖 Mood Detection (Opt-in)</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">AI uses interaction patterns + mood detection</p>
            </div>
            <Switch
              checked={settings.moodDetectionOptIn}
              onCheckedChange={(value) => handleSettingChange('moodDetectionOptIn', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">😄 Uplifting</Badge>
            <Badge variant="outline">🧘 Focus</Badge>
            <Badge variant="outline">🤖 Mood AI</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-semibold">🧠 AI Network Intelligence</h3>
        </div>
        <p className="text-muted-foreground mb-6">Platform learns from entire community to surface smarter ideas</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI learns from entire community to surface innovative content ideas. CONSEQUENCES: TURNING OFF: Isolated content strategy, no community learning, missed trending opportunities. TURNING ON: Community-wide intelligence, innovative content discovery, network learning benefits."
                type="info"
              >
                <Label>AI Network Intelligence</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Platform learns from entire community to surface smarter ideas</p>
            </div>
            <Switch
              checked={settings.aiNetworkIntelligence}
              onCheckedChange={(value) => handleSettingChange('aiNetworkIntelligence', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Auto-curated feed showcasing successful strategies across different niches. CONSEQUENCES: TURNING OFF: No cross-niche insights, limited innovation exposure, missed growth opportunities. TURNING ON: Cross-niche learning, innovation discovery, diverse strategy insights."
                type="info"
              >
                <Label>🔁 Creator Innovation Feed</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Auto-curated feed showing what's working across niches</p>
            </div>
            <Switch
              checked={settings.creatorInnovationFeed}
              onCheckedChange={(value) => handleSettingChange('creatorInnovationFeed', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI trend prediction based on network-wide behavior analysis. CONSEQUENCES: TURNING OFF: No trend forecasting, reactive content strategy, missed viral opportunities. TURNING ON: Proactive trend prediction, early trend adoption, competitive advantage."
                type="info"
              >
                <Label>🧠 Trend Prediction</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Trend prediction based on network-wide behavior</p>
            </div>
            <Switch
              checked={settings.trendPrediction}
              onCheckedChange={(value) => handleSettingChange('trendPrediction', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered optimal posting time suggestions for maximum engagement. CONSEQUENCES: TURNING OFF: Manual timing decisions, suboptimal posting schedules, reduced engagement. TURNING ON: Data-driven timing, optimal engagement windows, maximized reach."
                type="info"
              >
                <Label>🔎 Optimal Posting Times</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Suggest what day/hour each user's content should go live</p>
            </div>
            <Switch
              checked={settings.optimalPostingTimesSuggestion}
              onCheckedChange={(value) => handleSettingChange('optimalPostingTimesSuggestion', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🔁 Innovation Feed</Badge>
            <Badge variant="outline">🧠 Trend Prediction</Badge>
            <Badge variant="outline">🔎 Timing AI</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">🧠 AI Upsell Assistant</h3>
        </div>
        <p className="text-muted-foreground mb-6">Automatically recommends upsells or tokens based on user behavior</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI-powered upsell recommendations based on user behavior patterns. CONSEQUENCES: TURNING OFF: Manual upselling only, missed revenue opportunities, lower conversion rates. TURNING ON: Intelligent upselling, increased revenue, behavior-based recommendations."
                type="info"
              >
                <Label>AI Upsell Assistant</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Automatically recommends upsells or tokens to users</p>
            </div>
            <Switch
              checked={settings.aiUpsellAssistant}
              onCheckedChange={(value) => handleSettingChange('aiUpsellAssistant', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Smart upsell recommendations based on content virality potential. CONSEQUENCES: TURNING OFF: Generic upselling, missed viral opportunities, suboptimal timing. TURNING ON: Virality-based upsells, optimal timing, maximized revenue from viral content."
                type="info"
              >
                <Label>📈 Virality-Based Upsells</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Recommendations based on post virality</p>
            </div>
            <Switch
              checked={settings.viralityBasedUpsells}
              onCheckedChange={(value) => handleSettingChange('viralityBasedUpsells', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Analyze boosting behavior patterns for personalized recommendations. CONSEQUENCES: TURNING OFF: Generic boost suggestions, missed optimization opportunities, lower engagement ROI. TURNING ON: Personalized boost strategies, optimized spending, better engagement ROI."
                type="info"
              >
                <Label>🎯 Boosting Behavior Analysis</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Smart suggestions based on boosting behavior</p>
            </div>
            <Switch
              checked={settings.boostingBehaviorAnalysis}
              onCheckedChange={(value) => handleSettingChange('boostingBehaviorAnalysis', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="AI detection of missed engagement opportunities and alerts. CONSEQUENCES: TURNING OFF: Missed engagement windows, suboptimal content timing, reduced reach potential. TURNING ON: Opportunity alerts, optimized engagement timing, maximized content performance."
                type="info"
              >
                <Label>⚡ Engagement Opportunity Alerts</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Missed engagement opportunities detection</p>
            </div>
            <Switch
              checked={settings.engagementOpportunityAlerts}
              onCheckedChange={(value) => handleSettingChange('engagementOpportunityAlerts', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📈 Virality</Badge>
            <Badge variant="outline">🎯 Boosting</Badge>
            <Badge variant="outline">⚡ Opportunities</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • AI analyzes user behavior patterns
            • Smart upsell timing recommendations
            • Engagement opportunity detection
            • Personalized token suggestions
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessTools = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">🛍️ Pro Storefront</h3>
        </div>
        <p className="text-muted-foreground mb-6">Complete e-commerce solution for digital and physical products</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Create storefront for digital products, subscriptions, merch, and services. CONSEQUENCES: TURNING OFF: No e-commerce capabilities, lost revenue opportunities, limited monetization options. TURNING ON: Full storefront functionality, multiple revenue streams, professional selling tools."
              type="info"
            >
              <Label>Pro Storefront</Label>
            </InfoTooltip>
            <Switch
              checked={settings.proStorefront}
              onCheckedChange={(value) => handleSettingChange('proStorefront', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Stripe Integration</Label>
              <Switch
                checked={settings.stripeIntegration}
                onCheckedChange={(value) => handleSettingChange('stripeIntegration', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>PayPal Integration</Label>
              <Switch
                checked={settings.paypalIntegration}
                onCheckedChange={(value) => handleSettingChange('paypalIntegration', value)}
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Digital products and downloads
            • Subscription services
            • Physical merchandise
            • Service bookings
            • Automated payment processing
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">📊 Revenue Dashboard</h3>
        </div>
        <p className="text-muted-foreground mb-6">Centralized earnings tracking and analytics</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Centralized dashboard for all income streams including affiliate, tips, sales, and courses. CONSEQUENCES: TURNING OFF: No unified revenue tracking, fragmented financial overview, missed revenue optimization. TURNING ON: Complete financial visibility, revenue analytics, earning optimization insights."
              type="info"
            >
              <Label>Revenue Dashboard</Label>
            </InfoTooltip>
            <Switch
              checked={settings.revenueDashboard}
              onCheckedChange={(value) => handleSettingChange('revenueDashboard', value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Affiliate earnings tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="text-sm">Tipping income</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">Storefront sales</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span className="text-sm">Course subscriptions</span>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Includes graphs, filters, and downloadable reports
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">📚 Courses + Monetized Content</h3>
        </div>
        <p className="text-muted-foreground mb-6">Premium content creation and paywall features</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Create premium content areas with paywalls for courses and exclusive content. CONSEQUENCES: TURNING OFF: No premium content monetization, limited educational offerings, reduced recurring revenue. TURNING ON: Educational content monetization, subscription revenue, premium learning platform."
              type="info"
            >
              <Label>Courses & Monetization</Label>
            </InfoTooltip>
            <Switch
              checked={settings.coursesMonetization}
              onCheckedChange={(value) => handleSettingChange('coursesMonetization', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Premium lessons and tutorials
            • Video libraries with restricted access
            • Document collections
            • Live class hosting
            • Integrated payment processing
            • Subscription-based access
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">🎁 Loyalty Rewards Tier</h3>
        </div>
        <p className="text-muted-foreground mb-6">Point-based reward system for engagement</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Earn points for renewals, engagement, and purchases to redeem for rewards. CONSEQUENCES: TURNING OFF: No loyalty incentives, reduced user retention, missed engagement opportunities. TURNING ON: Enhanced user loyalty, gamified engagement, retention rewards system."
              type="info"
            >
              <Label>Loyalty Rewards System</Label>
            </InfoTooltip>
            <Switch
              checked={settings.loyaltyRewards}
              onCheckedChange={(value) => handleSettingChange('loyaltyRewards', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Earn points for:</strong></div>
            <div>• Monthly renewals</div>
            <div>• Engagement (likes/comments)</div>
            <div>• Purchases or referrals</div>
            <div className="mt-2"><strong>Redeem for:</strong></div>
            <div>• Boost tokens</div>
            <div>• Store credits</div>
            <div>• Special badges</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">🔗 Affiliate Link Builder & Marketplace Tools</h3>
        </div>
        <p className="text-muted-foreground mb-6">Maximize earning potential through affiliate marketing</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Generate tracked affiliate links with revenue splits and marketplace tools. CONSEQUENCES: TURNING OFF: No affiliate tracking, missed commission opportunities, limited marketing tools. TURNING ON: Advanced affiliate marketing, revenue tracking, commission management."
              type="info"
            >
              <Label>Smart Affiliate Link Builder</Label>
            </InfoTooltip>
            <Switch
              checked={settings.affiliateLinkBuilder}
              onCheckedChange={(value) => handleSettingChange('affiliateLinkBuilder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketplace Boosts</Label>
              <p className="text-sm text-muted-foreground">Boost store listings for higher visibility</p>
            </div>
            <Switch
              checked={settings.marketplaceBoosts}
              onCheckedChange={(value) => handleSettingChange('marketplaceBoosts', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Revenue Splits</Label>
              <p className="text-sm text-muted-foreground">Offer affiliates commission for promoting products</p>
            </div>
            <Switch
              checked={settings.revenueSplits}
              onCheckedChange={(value) => handleSettingChange('revenueSplits', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🔗 Shortened Links</Badge>
            <Badge variant="outline">📊 Click Tracking</Badge>
            <Badge variant="outline">💰 Commission Rates</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold">📦 Pro Bundle Manager</h3>
        </div>
        <p className="text-muted-foreground mb-6">Create and sell structured content packages</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Group courses, posts, PDFs, and videos into sellable packages with subscription options. CONSEQUENCES: TURNING OFF: No bundle creation, limited package deals, reduced sales opportunities. TURNING ON: Content bundling, package deals, increased average order value."
              type="info"
            >
              <Label>Bundle Builder</Label>
            </InfoTooltip>
            <Switch
              checked={settings.bundleBuilder}
              onCheckedChange={(value) => handleSettingChange('bundleBuilder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>One-Click Buy</Label>
              <p className="text-sm text-muted-foreground">Fast checkout for bundles with subscription options</p>
            </div>
            <Switch
              checked={settings.oneClickBuy}
              onCheckedChange={(value) => handleSettingChange('oneClickBuy', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Gated Access</Label>
              <p className="text-sm text-muted-foreground">Lock bundles to subscribers with download limits</p>
            </div>
            <Switch
              checked={settings.gatedAccess}
              onCheckedChange={(value) => handleSettingChange('gatedAccess', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Bundle courses, videos, PDFs, and services
            • Subscription or one-time pricing options
            • Content expiration and download limits
            • Example: "Fitness Starter Pack" with workout videos + meal plans
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">💼 Business Suite Tools for Agencies</h3>
        </div>
        <p className="text-muted-foreground mb-6">Multi-client management and workflow tools</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Manage multiple client accounts from one dashboard with approval workflows. CONSEQUENCES: TURNING OFF: No multi-client management, limited agency tools, inefficient workflows. TURNING ON: Agency-grade tools, client management, streamlined workflows."
              type="info"
            >
              <Label>Client Account Manager</Label>
            </InfoTooltip>
            <Switch
              checked={settings.clientAccountManager}
              onCheckedChange={(value) => handleSettingChange('clientAccountManager', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Approval Workflow System</Label>
              <p className="text-sm text-muted-foreground">Client review and approval before publishing</p>
            </div>
            <Switch
              checked={settings.approvalWorkflow}
              onCheckedChange={(value) => handleSettingChange('approvalWorkflow', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Invoice Export</Label>
              <p className="text-sm text-muted-foreground">Generate monthly invoices for services rendered</p>
            </div>
            <Switch
              checked={settings.invoiceExport}
              onCheckedChange={(value) => handleSettingChange('invoiceExport', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">👥 Multi-Client</Badge>
            <Badge variant="outline">✅ Approval Flow</Badge>
            <Badge variant="outline">📄 PDF Invoices</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold">🔐 API Access for Super Pro</h3>
        </div>
        <p className="text-muted-foreground mb-6">Developer tools and integration capabilities</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-pink-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Create and manage secure API keys for platform integration and development. CONSEQUENCES: TURNING OFF: No API access, limited integrations, restricted development capabilities. TURNING ON: Full API access, custom integrations, developer tools."
              type="info"
            >
              <Label>Personal API Keys</Label>
            </InfoTooltip>
            <Switch
              checked={settings.personalApiKeys}
              onCheckedChange={(value) => handleSettingChange('personalApiKeys', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Webhooks</Label>
              <p className="text-sm text-muted-foreground">Real-time notifications for events</p>
            </div>
            <Switch
              checked={settings.webhooks}
              onCheckedChange={(value) => handleSettingChange('webhooks', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Developer Analytics</Label>
              <p className="text-sm text-muted-foreground">Track API usage and endpoint activity</p>
            </div>
            <Switch
              checked={settings.developerAnalytics}
              onCheckedChange={(value) => handleSettingChange('developerAnalytics', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Full platform API access
            • Real-time webhooks for purchases, views, comments
            • Request volume and endpoint monitoring
            • Perfect for developers and agencies
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-semibold">🌍 Global Promotion Engine</h3>
        </div>
        <p className="text-muted-foreground mb-6">Platform-wide visibility beyond individual followers</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Auto-promote posts to other Super Pro users in same niche with newsletter features. CONSEQUENCES: TURNING OFF: Limited reach, no cross-promotion, reduced discovery. TURNING ON: Global promotion network, increased visibility, cross-user exposure."
              type="info"
            >
              <Label>Cross-User Boost Network</Label>
            </InfoTooltip>
            <Switch
              checked={settings.crossUserBoostNetwork}
              onCheckedChange={(value) => handleSettingChange('crossUserBoostNetwork', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Weekly Spotlight Newsletter</Label>
              <p className="text-sm text-muted-foreground">Feature top creators in high-quality email newsletter</p>
            </div>
            <Switch
              checked={settings.weeklySpotlightNewsletter}
              onCheckedChange={(value) => handleSettingChange('weeklySpotlightNewsletter', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Trending Board Priority</Label>
              <p className="text-sm text-muted-foreground">Higher placement and "🔥 Super Pro Boosted" badge in trending</p>
            </div>
            <Switch
              checked={settings.trendingBoardPriority}
              onCheckedChange={(value) => handleSettingChange('trendingBoardPriority', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🔄 Cross-Network</Badge>
            <Badge variant="outline">📰 Newsletter</Badge>
            <Badge variant="outline">🏆 Priority Trending</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Automatic cross-promotion within niche communities
            • Weekly feature in platform newsletter
            • Enhanced visibility in trending sections
            • Increased click-through for monetization
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">🧠 Creator Academy Partner Portal</h3>
        </div>
        <p className="text-muted-foreground mb-6">Teach and monetize through platform courses</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Apply to run paid courses on the platform with revenue sharing and private enrollment. CONSEQUENCES: TURNING OFF: No teaching opportunities, missed education revenue, limited course access. TURNING ON: Teaching platform access, education monetization, instructor revenue streams."
              type="info"
            >
              <Label>Become an Instructor</Label>
            </InfoTooltip>
            <Switch
              checked={settings.becomeInstructor}
              onCheckedChange={(value) => handleSettingChange('becomeInstructor', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Revenue Share Tracker</Label>
              <p className="text-sm text-muted-foreground">Real-time income tracking from students and courses</p>
            </div>
            <Switch
              checked={settings.revenueShareTracker}
              onCheckedChange={(value) => handleSettingChange('revenueShareTracker', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Private Course Enrollment</Label>
              <p className="text-sm text-muted-foreground">Invite-only or loyalty level-unlocked courses</p>
            </div>
            <Switch
              checked={settings.privateCourseEnrollment}
              onCheckedChange={(value) => handleSettingChange('privateCourseEnrollment', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🎓 Instructor</Badge>
            <Badge variant="outline">🧾 Revenue Track</Badge>
            <Badge variant="outline">📬 Private Access</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-semibold">💼 Digital Agency Workspace</h3>
        </div>
        <p className="text-muted-foreground mb-6">Advanced business layer for agency management</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-teal-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Add editor, strategist, designer roles under one account with team collaboration. CONSEQUENCES: TURNING OFF: No team roles, limited collaboration, individual account management only. TURNING ON: Team management, role assignments, collaborative workflows."
              type="info"
            >
              <Label>Team Roles</Label>
            </InfoTooltip>
            <Switch
              checked={settings.teamRoles}
              onCheckedChange={(value) => handleSettingChange('teamRoles', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Bill Clients From Dashboard</Label>
              <p className="text-sm text-muted-foreground">Generate invoices and charge clients directly</p>
            </div>
            <Switch
              checked={settings.billClientsFromDashboard}
              onCheckedChange={(value) => handleSettingChange('billClientsFromDashboard', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Shared Content Calendar</Label>
              <p className="text-sm text-muted-foreground">Real-time collaboration on campaigns and drafts</p>
            </div>
            <Switch
              checked={settings.sharedContentCalendar}
              onCheckedChange={(value) => handleSettingChange('sharedContentCalendar', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">👥 Team Management</Badge>
            <Badge variant="outline">💳 Client Billing</Badge>
            <Badge variant="outline">📆 Shared Calendar</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-lime-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-lime-500" />
          <h3 className="text-lg font-semibold">🛠️ Custom Automation Rules (No-Code Flow Builder)</h3>
        </div>
        <p className="text-muted-foreground mb-6">Build custom workflows without coding</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-lime-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Visual workflow builder for custom automations and conditional workflows. CONSEQUENCES: TURNING OFF: No automation capabilities, manual processes only, reduced efficiency. TURNING ON: Advanced automation, custom workflows, efficiency optimization."
              type="info"
            >
              <Label>No-Code Flow Builder</Label>
            </InfoTooltip>
            <Switch
              checked={settings.noCodeFlowBuilder}
              onCheckedChange={(value) => handleSettingChange('noCodeFlowBuilder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Conditional Automations</Label>
              <p className="text-sm text-muted-foreground">Create "if this, then that" workflows</p>
            </div>
            <Switch
              checked={settings.conditionalAutomations}
              onCheckedChange={(value) => handleSettingChange('conditionalAutomations', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Example Automations:</strong></div>
            <div>• "If I post in X group, auto-share on Story"</div>
            <div>• "If I get 500+ views, send auto-DM to commenters"</div>
            <div>• "If someone tips me, tag them as VIP"</div>
            <div>• Custom triggers and actions based on platform events</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">🛠️ No-Code</Badge>
            <Badge variant="outline">🔁 Workflows</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-amber-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">🪙 Token-Based Economy</h3>
        </div>
        <p className="text-muted-foreground mb-6">Internal platform token system for engagement and rewards</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-amber-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Internal token system for platform activities, earning through engagement and spending on features. CONSEQUENCES: TURNING OFF: No token economy, standard payment only, reduced gamification. TURNING ON: Token-based rewards, gamified engagement, alternative currency system."
              type="info"
            >
              <Label>Platform Tokens</Label>
            </InfoTooltip>
            <Switch
              checked={settings.platformTokens}
              onCheckedChange={(value) => handleSettingChange('platformTokens', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Token Earning</Label>
              <p className="text-sm text-muted-foreground">Earn tokens through likes, comments, boosts, and activity</p>
            </div>
            <Switch
              checked={settings.tokenEarning}
              onCheckedChange={(value) => handleSettingChange('tokenEarning', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Token Spending</Label>
              <p className="text-sm text-muted-foreground">Use tokens to unlock content, tip others, or boost posts</p>
            </div>
            <Switch
              checked={settings.tokenSpending}
              onCheckedChange={(value) => handleSettingChange('tokenSpending', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🎟️ Earn Tokens</Badge>
            <Badge variant="outline">💰 Spend Tokens</Badge>
            <Badge variant="outline">🔓 Unlock Content</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Earn tokens through platform engagement
            • Spend tokens on premium features and content
            • Tip other creators with tokens
            • Boost posts using token economy
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-rose-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-rose-500" />
          <h3 className="text-lg font-semibold">🧰 Plugin Marketplace for Super Pro</h3>
        </div>
        <p className="text-muted-foreground mb-6">Allow Super Pro creators to install or build extensions</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-rose-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Allow Super Pro creators to install or build extensions with analytics tools and widgets. CONSEQUENCES: TURNING OFF: No plugin ecosystem, limited customization, standard features only. TURNING ON: Plugin marketplace, extensible platform, custom tools access."
              type="info"
            >
              <Label>Plugin Marketplace</Label>
            </InfoTooltip>
            <Switch
              checked={settings.pluginMarketplace}
              onCheckedChange={(value) => handleSettingChange('pluginMarketplace', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🔌 Extra Analytics Tools</Label>
              <p className="text-sm text-muted-foreground">Add extra analytics tools</p>
            </div>
            <Switch
              checked={settings.extraAnalyticsTools}
              onCheckedChange={(value) => handleSettingChange('extraAnalyticsTools', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🧩 Dashboard Widgets</Label>
              <p className="text-sm text-muted-foreground">Widgets for their dashboard</p>
            </div>
            <Switch
              checked={settings.dashboardWidgets}
              onCheckedChange={(value) => handleSettingChange('dashboardWidgets', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🛠️ Developer SDK</Label>
              <p className="text-sm text-muted-foreground">Developer SDK (no-code + low-code options)</p>
            </div>
            <Switch
              checked={settings.developerSDK}
              onCheckedChange={(value) => handleSettingChange('developerSDK', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🔌 Analytics</Badge>
            <Badge variant="outline">🧩 Widgets</Badge>
            <Badge variant="outline">🛠️ SDK</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-violet-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-violet-500" />
          <h3 className="text-lg font-semibold">💼 Branded Workspace Builder</h3>
        </div>
        <p className="text-muted-foreground mb-6">White-label interface for agencies, brands, or creators</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-violet-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="White-label interface for agencies, brands, or creators with custom branding options. CONSEQUENCES: TURNING OFF: Standard branding only, no white-label options, limited customization. TURNING ON: Custom branding, white-label interface, professional customization."
              type="info"
            >
              <Label>Branded Workspace Builder</Label>
            </InfoTooltip>
            <Switch
              checked={settings.brandedWorkspaceBuilder}
              onCheckedChange={(value) => handleSettingChange('brandedWorkspaceBuilder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🎨 Drag-and-Drop UI Panels</Label>
              <p className="text-sm text-muted-foreground">Drag-and-drop custom UI panels</p>
            </div>
            <Switch
              checked={settings.dragDropUIPanels}
              onCheckedChange={(value) => handleSettingChange('dragDropUIPanels', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📛 Custom Logos/Colors</Label>
              <p className="text-sm text-muted-foreground">Replace logos/colors with their own</p>
            </div>
            <Switch
              checked={settings.customLogosColors}
              onCheckedChange={(value) => handleSettingChange('customLogosColors', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📂 Team & Client Sharing</Label>
              <p className="text-sm text-muted-foreground">Share with internal teams or clients</p>
            </div>
            <Switch
              checked={settings.teamClientSharing}
              onCheckedChange={(value) => handleSettingChange('teamClientSharing', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🎨 UI Builder</Badge>
            <Badge variant="outline">📛 Branding</Badge>
            <Badge variant="outline">📂 Sharing</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-fuchsia-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="h-5 w-5 text-fuchsia-500" />
          <h3 className="text-lg font-semibold">💼 SaaS-as-a-Feature</h3>
        </div>
        <p className="text-muted-foreground mb-6">Super Pro users can create mini platforms on top of Shqipet.com</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-fuchsia-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Super Pro users can create mini platforms on top of Shqipet.com with platform building tools. CONSEQUENCES: TURNING OFF: No platform creation, limited business expansion, standard features only. TURNING ON: Mini platform creation, business expansion tools, SaaS capabilities."
              type="info"
            >
              <Label>SaaS-as-a-Feature</Label>
            </InfoTooltip>
            <Switch
              checked={settings.saasAsFeature}
              onCheckedChange={(value) => handleSettingChange('saasAsFeature', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🛠️ Mini Platform Builder</Label>
              <p className="text-sm text-muted-foreground">Build tools, AI workflows, or niche pages (like Notion + Gumroad)</p>
            </div>
            <Switch
              checked={settings.miniPlatformBuilder}
              onCheckedChange={(value) => handleSettingChange('miniPlatformBuilder', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>💳 Charge Followers</Label>
              <p className="text-sm text-muted-foreground">Charge followers for usage</p>
            </div>
            <Switch
              checked={settings.chargeFollowersUsage}
              onCheckedChange={(value) => handleSettingChange('chargeFollowersUsage', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🔌 Backend Integration</Label>
              <p className="text-sm text-muted-foreground">Powered by your backend (storage, auth, payments)</p>
            </div>
            <Switch
              checked={settings.backendIntegration}
              onCheckedChange={(value) => handleSettingChange('backendIntegration', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🛠️ Platform Builder</Badge>
            <Badge variant="outline">💳 Monetization</Badge>
            <Badge variant="outline">🔌 Integration</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-sky-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-sky-500" />
          <h3 className="text-lg font-semibold">🎮 Gamified Growth Battle Pass</h3>
        </div>
        <p className="text-muted-foreground mb-6">Make platform usage feel like a game (opt-in)</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-sky-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Make platform usage feel like a game with levels, points, and unlockables. CONSEQUENCES: TURNING OFF: No gamification, standard interface, reduced engagement motivation. TURNING ON: Game-like experience, achievement system, enhanced user engagement."
              type="info"
            >
              <Label>Gamified Growth Battle Pass</Label>
            </InfoTooltip>
            <Switch
              checked={settings.gamifiedGrowthBattlePass}
              onCheckedChange={(value) => handleSettingChange('gamifiedGrowthBattlePass', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🏆 Levels and Unlockables</Label>
              <p className="text-sm text-muted-foreground">Levels and unlockables tied to posting, earning, creating</p>
            </div>
            <Switch
              checked={settings.levelsUnlockables}
              onCheckedChange={(value) => handleSettingChange('levelsUnlockables', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🪙 Points Earning</Label>
              <p className="text-sm text-muted-foreground">Earn points for daily logins, completed goals, referrals</p>
            </div>
            <Switch
              checked={settings.pointsEarning}
              onCheckedChange={(value) => handleSettingChange('pointsEarning', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🎁 Premium Unlocks</Label>
              <p className="text-sm text-muted-foreground">Points unlock premium templates, avatar effects, free boosts</p>
            </div>
            <Switch
              checked={settings.premiumUnlocks}
              onCheckedChange={(value) => handleSettingChange('premiumUnlocks', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🏆 Levels</Badge>
            <Badge variant="outline">🪙 Points</Badge>
            <Badge variant="outline">🎁 Unlocks</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-slate-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-slate-500" />
          <h3 className="text-lg font-semibold">🔗 Super Pro-to-Super Pro Collab Engine</h3>
        </div>
        <p className="text-muted-foreground mb-6">Match creators to collaborate using AI analysis</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-slate-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Match creators to collaborate using AI analysis of growth patterns and engagement. CONSEQUENCES: TURNING OFF: No collaboration matching, missed partnership opportunities, manual networking only. TURNING ON: AI-powered creator matching, collaboration opportunities, network growth."
              type="info"
            >
              <Label>Super Pro Collab Engine</Label>
            </InfoTooltip>
            <Switch
              checked={settings.superProCollabEngine}
              onCheckedChange={(value) => handleSettingChange('superProCollabEngine', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🤝 Creator Matching</Label>
              <p className="text-sm text-muted-foreground">AI finds 3 creators with similar growth curves and connects them</p>
            </div>
            <Switch
              checked={settings.creatorMatching}
              onCheckedChange={(value) => handleSettingChange('creatorMatching', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📈 Growth Curve Analysis</Label>
              <p className="text-sm text-muted-foreground">Analyze growth patterns for optimal creator matching</p>
            </div>
            <Switch
              checked={settings.growthCurveAnalysis}
              onCheckedChange={(value) => handleSettingChange('growthCurveAnalysis', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">🤝 Matching</Badge>
            <Badge variant="outline">📈 Analysis</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • AI-powered creator collaboration matching
            • Growth curve and engagement pattern analysis
            • Automatic connection suggestions
            • Collaboration opportunity notifications
          </div>
        </div>
      </div>
    </div>
  );

  const renderContentMedia = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">🧑‍🎨 Creator Workspace Suite</h3>
        </div>
        <p className="text-muted-foreground mb-6">Complete creator dashboard and collaboration tools</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Full dashboard with advanced creator tools including draft management and collaboration. CONSEQUENCES: TURNING OFF: Basic creator tools only, no advanced workflow features, limited collaboration. TURNING ON: Professional creator suite, advanced workflow management, enhanced productivity tools."
              type="info"
            >
              <Label>Creator Workspace</Label>
            </InfoTooltip>
            <Switch
              checked={settings.creatorWorkspace}
              onCheckedChange={(value) => handleSettingChange('creatorWorkspace', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Draft Manager</Label>
              <Switch
                checked={settings.draftManager}
                onCheckedChange={(value) => handleSettingChange('draftManager', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Goal Tracker</Label>
              <Switch
                checked={settings.goalTracker}
                onCheckedChange={(value) => handleSettingChange('goalTracker', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Editorial Calendar</Label>
              <Switch
                checked={settings.editorialCalendar}
                onCheckedChange={(value) => handleSettingChange('editorialCalendar', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Collaboration Notes</Label>
              <Switch
                checked={settings.collaborationNotes}
                onCheckedChange={(value) => handleSettingChange('collaborationNotes', value)}
              />
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Tracks posts, earnings, followers, and provides collaborative workspace features
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">🔗 Smart Collaboration Hub</h3>
        </div>
        <p className="text-muted-foreground mb-6">Team up with creators and co-author content with revenue sharing</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Co-manage posts with other creators and set revenue percentage splits for joint content. CONSEQUENCES: TURNING OFF: No collaboration features, individual content creation only, missed partnership opportunities. TURNING ON: Creator collaboration tools, revenue sharing, team content creation."
              type="info"
            >
              <Label>Invite Collaborators</Label>
            </InfoTooltip>
            <Switch
              checked={settings.inviteCollaborators}
              onCheckedChange={(value) => handleSettingChange('inviteCollaborators', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Revenue Per Collaborator</Label>
              <p className="text-sm text-muted-foreground">Set revenue percentage splits for joint content</p>
            </div>
            <Switch
              checked={settings.revenuePerCollaborator}
              onCheckedChange={(value) => handleSettingChange('revenuePerCollaborator', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Co-Creator Badge</Label>
              <p className="text-sm text-muted-foreground">Show collaborative creation badges on posts</p>
            </div>
            <Switch
              checked={settings.coCreatorBadge}
              onCheckedChange={(value) => handleSettingChange('coCreatorBadge', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🤝 Collaborators</Badge>
            <Badge variant="outline">💰 Revenue Split</Badge>
            <Badge variant="outline">📜 Co-Creator</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Invite and manage co-creators on posts
            • Automatic revenue sharing based on percentages
            • Visual badges showing collaborative content
            • Team-based content creation workflow
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">🛜 Offline Sync & Publishing</h3>
        </div>
        <p className="text-muted-foreground mb-6">Work offline and sync content when reconnected</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Edit content in offline mode and automatically publish queued content when reconnected. CONSEQUENCES: TURNING OFF: Online-only editing, no offline capabilities, interrupted workflow during connectivity issues. TURNING ON: Offline editing capabilities, seamless sync, uninterrupted workflow."
              type="info"
            >
              <Label>Offline Content Editing</Label>
            </InfoTooltip>
            <Switch
              checked={settings.offlineContentEditing}
              onCheckedChange={(value) => handleSettingChange('offlineContentEditing', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Publish on Reconnect</Label>
              <p className="text-sm text-muted-foreground">Automatically publish queued content when reconnected</p>
            </div>
            <Switch
              checked={settings.autoPublishOnReconnect}
              onCheckedChange={(value) => handleSettingChange('autoPublishOnReconnect', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">✍️ Offline Edit</Badge>
            <Badge variant="outline">🔁 Auto-Sync</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Complete offline content creation capability
            • Queue management for offline-created content
            • Seamless synchronization upon reconnection
            • Perfect for creators on the go
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">🔄 Content Replication Tools</h3>
        </div>
        <p className="text-muted-foreground mb-6">Duplicate successful content across platforms and audiences</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Duplicate posts across groups, pages, and profiles with performance tracking. CONSEQUENCES: TURNING OFF: Manual content duplication, time-consuming process, no cross-audience optimization. TURNING ON: One-click duplication, multi-audience targeting, automated adaptation."
              type="info"
            >
              <Label>Content Replication</Label>
            </InfoTooltip>
            <Switch
              checked={settings.contentReplication}
              onCheckedChange={(value) => handleSettingChange('contentReplication', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            • One-click content duplication
            • Multi-audience targeting
            • Automatic adaptation for different platforms
            • Performance tracking across duplicates
            • Ideal for creators managing multiple audiences
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold">🧵 Cross-Platform Posting</h3>
        </div>
        <p className="text-muted-foreground mb-6">Post to multiple social platforms simultaneously</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Post to Facebook, X (Twitter), and Instagram with OAuth integration and unified analytics. CONSEQUENCES: TURNING OFF: Manual posting to each platform, fragmented workflow, time-consuming process. TURNING ON: Simultaneous multi-platform posting, unified management, streamlined workflow."
              type="info"
            >
              <Label>Cross-Platform Posting</Label>
            </InfoTooltip>
            <Switch
              checked={settings.crossPlatformPosting}
              onCheckedChange={(value) => handleSettingChange('crossPlatformPosting', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Facebook</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">X (Twitter)</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Instagram</Badge>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • OAuth integration for seamless connection
            • Scheduled and live posts supported
            • Platform-specific formatting
            • Unified analytics dashboard
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold">📦 Cloud Workspace Expansion</h3>
        </div>
        <p className="text-muted-foreground mb-6">Enterprise-level content management and collaboration</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="10GB default, expandable to 1TB with usage analytics and encrypted collaboration folders. CONSEQUENCES: TURNING OFF: Limited storage, no team collaboration, basic file management. TURNING ON: Enterprise storage, team collaboration, advanced file management."
              type="info"
            >
              <Label>Expandable Cloud Vault</Label>
            </InfoTooltip>
            <Switch
              checked={settings.expandableCloudVault}
              onCheckedChange={(value) => handleSettingChange('expandableCloudVault', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Encrypted Collaboration Folders</Label>
              <p className="text-sm text-muted-foreground">Share locked folders with team members and editors</p>
            </div>
            <Switch
              checked={settings.encryptedCollaborationFolders}
              onCheckedChange={(value) => handleSettingChange('encryptedCollaborationFolders', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-Sync with Desktop</Label>
              <p className="text-sm text-muted-foreground">Integration with Google Drive, Dropbox, and OneDrive</p>
            </div>
            <Switch
              checked={settings.autoSyncDesktop}
              onCheckedChange={(value) => handleSettingChange('autoSyncDesktop', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">☁️ 1TB Storage</Badge>
            <Badge variant="outline">🔐 Encrypted Sharing</Badge>
            <Badge variant="outline">📤 Auto-Sync</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Access roles: View only, Edit, Comment only
            • Usage analytics: "You've used 68% of your vault"
            • Perfect for teams and remote assistants
            • Backup and desktop workflow integration
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold">🧾 Legal & Rights Management Center</h3>
        </div>
        <p className="text-muted-foreground mb-6">Protect, license, and defend content with legal tools</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Label content with licensing, file takedown requests, and auto watermarking. CONSEQUENCES: TURNING OFF: No content protection, vulnerability to theft, no legal recourse tools. TURNING ON: Complete content protection, legal tools, theft prevention."
              type="info"
            >
              <Label>Content Licensing Tools</Label>
            </InfoTooltip>
            <Switch
              checked={settings.contentLicensing}
              onCheckedChange={(value) => handleSettingChange('contentLicensing', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Takedown Request Panel</Label>
              <p className="text-sm text-muted-foreground">File takedown requests for copied or stolen content</p>
            </div>
            <Switch
              checked={settings.takedownRequestPanel}
              onCheckedChange={(value) => handleSettingChange('takedownRequestPanel', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Watermark Option</Label>
              <p className="text-sm text-muted-foreground">Automatically add watermarks to videos, images, and documents</p>
            </div>
            <Switch
              checked={settings.autoWatermark}
              onCheckedChange={(value) => handleSettingChange('autoWatermark', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📜 Licensing</Badge>
            <Badge variant="outline">🛡️ DMCA Support</Badge>
            <Badge variant="outline">🖊️ Watermarks</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold">🛡️ Content Insurance</h3>
        </div>
        <p className="text-muted-foreground mb-6">Premium content protection and monitoring system</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-pink-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Immutable backup of viral and premium content with repost monitoring and trust badges. CONSEQUENCES: TURNING OFF: No content backup, no theft monitoring, reduced user trust. TURNING ON: Complete content protection, theft detection, enhanced credibility."
              type="info"
            >
              <Label>Archive & Backup</Label>
            </InfoTooltip>
            <Switch
              checked={settings.archiveBackup}
              onCheckedChange={(value) => handleSettingChange('archiveBackup', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Repost Monitoring</Label>
              <p className="text-sm text-muted-foreground">Detect and track unauthorized reposting across platform</p>
            </div>
            <Switch
              checked={settings.repostMonitoring}
              onCheckedChange={(value) => handleSettingChange('repostMonitoring', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Content Insurance Badge</Label>
              <p className="text-sm text-muted-foreground">Display badge for trusted, secured content</p>
            </div>
            <Switch
              checked={settings.contentInsuranceBadge}
              onCheckedChange={(value) => handleSettingChange('contentInsuranceBadge', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📑 Archive</Badge>
            <Badge variant="outline">🔐 Monitor</Badge>
            <Badge variant="outline">🤝 Trust Badge</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Permanent backup of high-value content
            • Real-time unauthorized usage detection
            • Trust badge builds user confidence
            • Complete content protection system
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-semibold">📈 Conversion Heatmaps</h3>
        </div>
        <p className="text-muted-foreground mb-6">Visualize upgrade paths and conversion points</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
          <InfoTooltip 
            content="Track CTA engagement, scroll depth, conversion sequences, and feature performance with integration to analytics tools. CONSEQUENCES: TURNING OFF: No conversion tracking, missed optimization opportunities, blind spot in user behavior. TURNING ON: Complete conversion analytics, optimization insights, behavior tracking."
            type="info"
          >
            <Label>Heatmap Analytics</Label>
          </InfoTooltip>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Heatmap Analytics:</strong></div>
            <div>• CTA Engagement tracking</div>
            <div>• Scroll depth & time spent analysis</div>
            <div>• Path tracing for conversion sequences</div>
            <div>• Feature conversion heat mapping</div>
            <div>• Integration with Hotjar, Clarity, PostHog</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🔥 CTA Engagement</div>
              <div className="text-xs text-muted-foreground">Track button clicks on pricing pages</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">👀 Scroll Depth</div>
              <div className="text-xs text-muted-foreground">Time spent reading each plan</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🧭 Path Tracing</div>
              <div className="text-xs text-muted-foreground">Page sequences leading to upgrades</div>
            </div>
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm">🎯 Feature Heat</div>
              <div className="text-xs text-muted-foreground">Which features convert users</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              View Heatmaps
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Conversion Report
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border border-cyan-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Analytics Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">🎨 Visual & UX Enhancements</h3>
        </div>
        <p className="text-muted-foreground mb-6">Premium visual effects and profile enhancements</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Shimmering animated border around profile with premium themes and gradient effects. CONSEQUENCES: TURNING OFF: Standard profile appearance, no premium visual distinction. TURNING ON: Premium visual effects, enhanced profile aesthetics, Super Pro distinction."
              type="info"
            >
              <Label>Profile Glow Effect</Label>
            </InfoTooltip>
            <Switch
              checked={settings.profileGlowEffect}
              onCheckedChange={(value) => handleSettingChange('profileGlowEffect', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Purple/Sapphire Theme
            </Badge>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Gradient Effects
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Special visual effects exclusive to Super Pro users including animated borders and premium themes
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-teal-500" />
          <h3 className="text-lg font-semibold">🔗 Smart Licensing Blockchain Record (Optional Tech)</h3>
        </div>
        <p className="text-muted-foreground mb-6">Tie top content to immutable ownership</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-teal-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Tie top content to immutable ownership with NFT-style records and proof of originality. CONSEQUENCES: TURNING OFF: No blockchain verification, standard content ownership, no immutable proof. TURNING ON: Blockchain-verified ownership, NFT-style records, immutable content proof."
              type="info"
            >
              <Label>Smart Licensing Blockchain Record</Label>
            </InfoTooltip>
            <Switch
              checked={settings.smartLicensingBlockchain}
              onCheckedChange={(value) => handleSettingChange('smartLicensingBlockchain', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>⛓️ NFT-Style Record</Label>
              <p className="text-sm text-muted-foreground">Create NFT-style record (not for trading)</p>
            </div>
            <Switch
              checked={settings.nftStyleRecord}
              onCheckedChange={(value) => handleSettingChange('nftStyleRecord', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📜 Originality Timestamp</Label>
              <p className="text-sm text-muted-foreground">Proof of originality timestamp</p>
            </div>
            <Switch
              checked={settings.originalityTimestamp}
              onCheckedChange={(value) => handleSettingChange('originalityTimestamp', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🧾 Public License Option</Label>
              <p className="text-sm text-muted-foreground">Optional public license</p>
            </div>
            <Switch
              checked={settings.publicLicenseOption}
              onCheckedChange={(value) => handleSettingChange('publicLicenseOption', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">⛓️ Blockchain</Badge>
            <Badge variant="outline">📜 Timestamp</Badge>
            <Badge variant="outline">🧾 License</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-lime-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-lime-500" />
          <h3 className="text-lg font-semibold">🔁 Global Sync Dashboard</h3>
        </div>
        <p className="text-muted-foreground mb-6">For power users running multiple platforms</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-lime-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="For power users running multiple platforms with unified scheduling and cross-platform analytics. CONSEQUENCES: TURNING OFF: Platform-by-platform management, fragmented analytics, time-consuming workflow. TURNING ON: Unified multi-platform management, consolidated analytics, streamlined workflow."
              type="info"
            >
              <Label>Global Sync Dashboard</Label>
            </InfoTooltip>
            <Switch
              checked={settings.globalSyncDashboard}
              onCheckedChange={(value) => handleSettingChange('globalSyncDashboard', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📲 Multi-Platform Posting</Label>
              <p className="text-sm text-muted-foreground">Post & manage content across Shqipet.com, X, Threads, TikTok, YouTube Shorts</p>
            </div>
            <Switch
              checked={settings.multiPlatformPosting}
              onCheckedChange={(value) => handleSettingChange('multiPlatformPosting', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📆 Unified Scheduling</Label>
              <p className="text-sm text-muted-foreground">Unified scheduling across all platforms</p>
            </div>
            <Switch
              checked={settings.unifiedScheduling}
              onCheckedChange={(value) => handleSettingChange('unifiedScheduling', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📊 Cross-Platform Analytics</Label>
              <p className="text-sm text-muted-foreground">Unified analytics and engagement tracking</p>
            </div>
            <Switch
              checked={settings.crossPlatformAnalytics}
              onCheckedChange={(value) => handleSettingChange('crossPlatformAnalytics', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>💬 Unified Engagement Replies</Label>
              <p className="text-sm text-muted-foreground">Manage replies from all platforms in one place</p>
            </div>
            <Switch
              checked={settings.unifiedEngagementReplies}
              onCheckedChange={(value) => handleSettingChange('unifiedEngagementReplies', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">📲 Multi-Platform</Badge>
            <Badge variant="outline">📆 Scheduling</Badge>
            <Badge variant="outline">📊 Analytics</Badge>
            <Badge variant="outline">💬 Engagement</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Supported platforms: Shqipet.com, X (Twitter), Threads, TikTok, YouTube Shorts
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-amber-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold">🔒 Content Vault Trust Scoring</h3>
        </div>
        <p className="text-muted-foreground mb-6">Every Super Pro post has an internal value + trust score</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-amber-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Every Super Pro post has an internal value + trust score with performance-based caching and vetted content glow. CONSEQUENCES: TURNING OFF: No trust scoring, standard caching, no content verification system. TURNING ON: Trust-based content ranking, optimized performance, verified content system."
              type="info"
            >
              <Label>Content Vault Trust Scoring</Label>
            </InfoTooltip>
            <Switch
              checked={settings.contentVaultTrustScoring}
              onCheckedChange={(value) => handleSettingChange('contentVaultTrustScoring', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📈 Performance-Based Caching</Label>
              <p className="text-sm text-muted-foreground">Content performs well gets higher caching priority (loads faster, more exposure)</p>
            </div>
            <Switch
              checked={settings.performanceBasedCaching}
              onCheckedChange={(value) => handleSettingChange('performanceBasedCaching', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🛡️ Watermarking + Backup + Detection</Label>
              <p className="text-sm text-muted-foreground">Combines watermarking + backup + repost detection</p>
            </div>
            <Switch
              checked={settings.watermarkingBackupDetection}
              onCheckedChange={(value) => handleSettingChange('watermarkingBackupDetection', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🎖️ Vetted Content Glow</Label>
              <p className="text-sm text-muted-foreground">Posts with high Trust Score get a golden "Vetted Content" glow</p>
            </div>
            <Switch
              checked={settings.vettedContentGlow}
              onCheckedChange={(value) => handleSettingChange('vettedContentGlow', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📈 Performance</Badge>
            <Badge variant="outline">🛡️ Protection</Badge>
            <Badge variant="outline">🎖️ Trust Score</Badge>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-rose-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-rose-500" />
          <h3 className="text-lg font-semibold">🌌 Metaverse & AR Integration (Future-Proof)</h3>
        </div>
        <p className="text-muted-foreground mb-6">Allow Super Pro creators to publish Augmented Reality content</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-rose-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Allow Super Pro creators to publish Augmented Reality content with AR filters, 3D posts, and AR showrooms. CONSEQUENCES: TURNING OFF: No AR capabilities, limited to traditional content, no future-tech features. TURNING ON: AR content creation, 3D experiences, future-ready platform features."
              type="info"
            >
              <Label>Metaverse & AR Integration</Label>
            </InfoTooltip>
            <Switch
              checked={settings.metaverseARIntegration}
              onCheckedChange={(value) => handleSettingChange('metaverseARIntegration', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>📱 AR Filters or Scenes</Label>
              <p className="text-sm text-muted-foreground">AR filters or scenes (via Spark AR or WebAR)</p>
            </div>
            <Switch
              checked={settings.arFiltersScenes}
              onCheckedChange={(value) => handleSettingChange('arFiltersScenes', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🧑‍🎨 3D Posts or Avatars</Label>
              <p className="text-sm text-muted-foreground">3D posts or avatars</p>
            </div>
            <Switch
              checked={settings.threeDPostsAvatars}
              onCheckedChange={(value) => handleSettingChange('threeDPostsAvatars', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🏠 AR Showroom for Merch/NFTs</Label>
              <p className="text-sm text-muted-foreground">Build a mini AR showroom for merch or NFTs</p>
            </div>
            <Switch
              checked={settings.arShowroomMerch}
              onCheckedChange={(value) => handleSettingChange('arShowroomMerch', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📱 AR Filters</Badge>
            <Badge variant="outline">🧑‍🎨 3D Content</Badge>
            <Badge variant="outline">🏠 AR Showroom</Badge>
          </div>
        </div>
      </div>
    </div>
  );

   const renderAnalyticsInsights = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">📊 Revenue Insights & Analytics</h3>
        </div>
        <p className="text-muted-foreground mb-6">Comprehensive revenue tracking and business intelligence</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Total Super Pro revenue, LTV, renewal rates, and projections with comprehensive tracking. CONSEQUENCES: TURNING OFF: No revenue analytics, blind spot in business intelligence, missed optimization opportunities. TURNING ON: Complete revenue visibility, LTV tracking, business intelligence insights."
              type="info"
            >
              <Label>Revenue Analytics</Label>
            </InfoTooltip>
            <Switch
              checked={settings.premiumAnalytics}
              onCheckedChange={(value) => handleSettingChange('premiumAnalytics', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Revenue Tracking:</strong></div>
            <div>• Lifetime Value (LTV) per user</div>
            <div>• Renewal rate analytics</div>
            <div>• Refund tracking and analysis</div>
            <div>• Revenue projections and forecasts</div>
            <div>• Regional revenue breakdowns</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">🎯 Engagement Heatmaps</h3>
        </div>
        <p className="text-muted-foreground mb-6">Visual engagement analytics and user behavior insights</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="User activity by time, post type, and region with visual heatmap analytics. CONSEQUENCES: TURNING OFF: No visual engagement insights, missed behavioral patterns, limited optimization data. TURNING ON: Comprehensive engagement heatmaps, behavioral insights, optimization opportunities."
              type="info"
            >
              <Label>Engagement Heatmaps</Label>
            </InfoTooltip>
            <Switch
              checked={settings.engagementHeatmaps}
              onCheckedChange={(value) => handleSettingChange('engagementHeatmaps', value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Heatmap Analytics:</strong></div>
            <div>• Activity by time of day</div>
            <div>• Post type performance</div>
            <div>• Regional engagement patterns</div>
            <div>• Device usage statistics</div>
            <div>• Content interaction flows</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">📈 Advanced Reports & Exports</h3>
        </div>
        <p className="text-muted-foreground mb-6">Comprehensive reporting with download capabilities</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Export analytics data in multiple formats including PDF, CSV, and Excel with automated summaries. CONSEQUENCES: TURNING OFF: No data export capabilities, limited reporting, manual data compilation. TURNING ON: Advanced reporting tools, automated exports, comprehensive data analysis."
              type="info"
            >
              <Label>Downloadable Reports</Label>
            </InfoTooltip>
            <Switch
              checked={settings.downloadableReports}
              onCheckedChange={(value) => handleSettingChange('downloadableReports', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">PDF Reports</Badge>
            <Badge variant="outline">CSV Export</Badge>
            <Badge variant="outline">Excel Sheets</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Custom date range reports
            • Automated weekly/monthly summaries
            • Revenue breakdown exports
            • User engagement analytics
            • Performance trend analysis
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold">🧬 Audience Segmentation AI</h3>
        </div>
        <p className="text-muted-foreground mb-6">AI-powered audience analysis and targeted content delivery</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="AI automatically detects and groups followers by interests, behavior, and location for targeted posting. CONSEQUENCES: TURNING OFF: No audience segmentation, generic content delivery, missed targeting opportunities. TURNING ON: AI-powered segmentation, targeted content, improved engagement rates."
              type="info"
            >
              <Label>Smart Segments</Label>
            </InfoTooltip>
            <Switch
              checked={settings.smartSegments}
              onCheckedChange={(value) => handleSettingChange('smartSegments', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Targeted Posting</Label>
              <p className="text-sm text-muted-foreground">Send posts to specific audience segments for better engagement</p>
            </div>
            <Switch
              checked={settings.targetedPosting}
              onCheckedChange={(value) => handleSettingChange('targetedPosting', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Segment Analytics</Label>
              <p className="text-sm text-muted-foreground">Track engagement and conversion rates by audience segment</p>
            </div>
            <Switch
              checked={settings.segmentAnalytics}
              onCheckedChange={(value) => handleSettingChange('segmentAnalytics', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🎯 Interest Groups</Badge>
            <Badge variant="outline">📍 Location-Based</Badge>
            <Badge variant="outline">📊 Behavior Analysis</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Music lovers, crypto fans, foodies segments
            • Geographic targeting capabilities
            • Behavioral pattern recognition
            • Conversion optimization per segment
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperimental = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold">👥 Multi-Account Management</h3>
        </div>
        <p className="text-muted-foreground mb-6">Manage multiple profiles with a single login</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Link and manage multiple profiles with one login, perfect for agencies and influencers. CONSEQUENCES: TURNING OFF: Single profile management only, no agency capabilities, limited multi-brand management. TURNING ON: Multi-profile management, agency tools, seamless profile switching."
              type="info"
            >
              <Label>Multi-Account Management</Label>
            </InfoTooltip>
            <Switch
              checked={settings.multiAccountManagement}
              onCheckedChange={(value) => handleSettingChange('multiAccountManagement', value)}
            />
          </div>
          
          <div>
            <Label htmlFor="maxProfiles">Max Linked Profiles</Label>
            <Input
              id="maxProfiles"
              type="number"
              value={settings.maxLinkedProfiles}
              onChange={(e) => handleSettingChange('maxLinkedProfiles', parseInt(e.target.value))}
              min="1"
              max="10"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Perfect for agencies and influencers
            • Switch between profiles seamlessly
            • Unified management dashboard
            • Separate analytics for each profile
            • Cross-profile content sharing
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">🧩 Access All Modules</h3>
        </div>
        <p className="text-muted-foreground mb-6">Instant access to all experimental and pro-grade modules</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Unlock all platform modules and features including Dating+, AI+, Pro Events and more. CONSEQUENCES: TURNING OFF: Limited module access, basic features only, no experimental capabilities. TURNING ON: Complete platform access, all experimental features, premium modules unlocked."
              type="info"
            >
              <Label>All Modules Access</Label>
            </InfoTooltip>
            <Switch
              checked={settings.allModulesAccess}
              onCheckedChange={(value) => handleSettingChange('allModulesAccess', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Dating+
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI+
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pro Events
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Smart Analytics
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Content Studio
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monetization Tools
            </Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Complete access to all experimental features and premium modules
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-500 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Beaker className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">🌐 Web3/Tokenized Add-On (Experimental)</h3>
        </div>
        <p className="text-muted-foreground mb-6">Blockchain integration and tokenized content features</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <InfoTooltip 
              content="Blockchain integration and tokenized content features including NFT minting and crypto payments. CONSEQUENCES: TURNING OFF: No blockchain features, traditional payment methods only, no Web3 capabilities. TURNING ON: Blockchain integration, NFT features, crypto payments, Web3 functionality."
              type="info"
            >
              <Label>Web3/Tokenized Add-On</Label>
            </InfoTooltip>
            <Switch
              checked={settings.web3TokenizedAddOn}
              onCheckedChange={(value) => handleSettingChange('web3TokenizedAddOn', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🎨 NFT Content Minting</Label>
              <p className="text-sm text-muted-foreground">Let users mint digital content as NFTs</p>
            </div>
            <Switch
              checked={settings.nftContentMinting}
              onCheckedChange={(value) => handleSettingChange('nftContentMinting', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>🎟️ Token-Gated Packs</Label>
              <p className="text-sm text-muted-foreground">Create token-gated content packs</p>
            </div>
            <Switch
              checked={settings.tokenGatedPacks}
              onCheckedChange={(value) => handleSettingChange('tokenGatedPacks', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>₿ Crypto Payments (Optional)</Label>
              <p className="text-sm text-muted-foreground">Accept crypto payments</p>
            </div>
            <Switch
              checked={settings.cryptoPayments}
              onCheckedChange={(value) => handleSettingChange('cryptoPayments', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🎨 NFTs</Badge>
            <Badge variant="outline">🎟️ Token Gates</Badge>
            <Badge variant="outline">₿ Crypto</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Digital content as NFTs
            • Token-gated exclusive content
            • Cryptocurrency payment integration
            • Blockchain ownership verification
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminControls = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-red-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-blue-500" />
          <InfoTooltip 
            content="Filter and manage Super Pro users. CONSEQUENCES: TURNING OFF: No user filtering, reduced management oversight, manual user tracking. TURNING ON: Advanced user filtering, activity monitoring, enhanced admin control."
            type="info"
          >
            <h3 className="text-lg font-semibold">📋 User Tier Management</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Filter and manage Super Pro users</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-red-200">
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-semibold">User Tier Filter</div>
              <div className="text-sm text-muted-foreground">Filter Super Pro users by activity and monetization</div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <div className="font-semibold">Activity Level Tracking</div>
              <div className="text-sm text-muted-foreground">Monitor user engagement and usage patterns</div>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-orange-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <InfoTooltip 
            content="Advanced metrics comparing Super Pro vs other tiers. CONSEQUENCES: TURNING OFF: No tier comparison, limited analytics, reduced business insights. TURNING ON: Comprehensive LTV tracking, retention analysis, upsell optimization."
            type="info"
          >
            <h3 className="text-lg font-semibold">🔍 Tier Performance Analytics</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Advanced metrics comparing Super Pro vs other tiers</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-orange-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>LTV Analytics:</strong></div>
            <div>• Lifetime Value tracking per user and region</div>
            <div>• Monthly & yearly retention rates</div>
            <div>• Engagement comparison across all plans</div>
            <div>• Usage trends and drop-off points</div>
            <div>• Upsell pattern visualization</div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              View Analytics
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Export Report
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border border-rose-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Compare Tiers
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-yellow-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-500" />
          <InfoTooltip 
            content="Full visibility into high-value transactions. CONSEQUENCES: TURNING OFF: No transaction monitoring, compliance risks, audit difficulties. TURNING ON: Complete transaction visibility, audit trails, fraud detection."
            type="info"
          >
            <h3 className="text-lg font-semibold">💳 Premium Transaction Audits</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Full visibility into high-value transactions</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-yellow-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Transaction Monitoring:</strong></div>
            <div>• High-value transactions (over £50/€50/$50)</div>
            <div>• Filter by amount, type, user, location, payment method</div>
            <div>• Export reports for tax or audit use</div>
            <div>• Chargebacks, disputes, and payment retries tracking</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Transaction Log</Button>
            <Button variant="outline" size="sm">Audit Report</Button>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-green-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-red-500" />
          <InfoTooltip 
            content="Protect premium content from unauthorized sharing. CONSEQUENCES: TURNING OFF: No content protection, piracy risks, revenue loss. TURNING ON: AI-powered piracy detection, automated takedowns, content security."
            type="info"
          >
            <h3 className="text-lg font-semibold">🔐 Anti-Piracy Monitoring</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Protect premium content from unauthorized sharing</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-green-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Content Protection:</strong></div>
            <div>• Scan for reposted premium content</div>
            <div>• AI and hash-matching for cloned media</div>
            <div>• Detection of unauthorized course sharing</div>
            <div>• Automated takedown notices</div>
            <div>• External link monitoring</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Scan Results</Button>
            <Button variant="outline" size="sm">Issue Warning</Button>
            <Button variant="outline" size="sm">Takedown Tools</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-blue-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-blue-500" />
          <InfoTooltip 
            content="Comprehensive training and monetization strategies. CONSEQUENCES: TURNING OFF: No training access, reduced creator success, lower retention. TURNING ON: Complete training platform, guided onboarding, enhanced creator performance."
            type="info"
          >
            <h3 className="text-lg font-semibold">🎓 Super Pro Training Hub</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Comprehensive training and monetization strategies</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Complete training platform for creators and professionals. CONSEQUENCES: TURNING OFF: No training access, manual learning curve, reduced success rates. TURNING ON: Guided training, structured learning paths, improved creator outcomes."
                type="info"
              >
                <Label>Training Hub Access</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Complete training platform for creators and professionals</p>
            </div>
            <Switch
              checked={settings.trainingHub}
              onCheckedChange={(value) => handleSettingChange('trainingHub', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🧭</span> Guided Onboarding
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Step-by-step walkthrough for Creator Workspace, scheduling, and monetization setup
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>💡</span> Monetization Tips
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Storefront usage, course earnings, boost tokens, conversion strategies
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>📽️</span> Video Masterclasses
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Live/recorded sessions on branding, growth, sales funnels, AI productivity
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>📈</span> Growth Templates
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Downloadable calendars, monetization plans, affiliate strategies
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🎖️</span> Badge & Certificates
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Gamified progress tracking with achievement badges and completion certificates
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Manage Content
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border border-teal-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Track Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200 text-violet-700 border border-violet-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Add Masterclass
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-3 py-2 hover:scale-105 font-medium"
            >
              Issue Certificates
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-indigo-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="h-5 w-5 text-indigo-500" />
          <InfoTooltip 
            content="Secure private storage vault for high-value content. CONSEQUENCES: TURNING OFF: No secure backup, data loss risks, limited storage. TURNING ON: Encrypted storage, version control, secure content backup."
            type="info"
          >
            <h3 className="text-lg font-semibold">📂 Super Pro Content Vault</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Secure private storage vault for high-value content</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Secure backup and storage for creator content. CONSEQUENCES: TURNING OFF: No content backup, data vulnerability, manual storage management. TURNING ON: Automated backup, secure storage, content protection."
                type="info"
              >
                <Label>Content Vault Access</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Secure backup and storage for creator content</p>
            </div>
            <Switch
              checked={settings.contentVault}
              onCheckedChange={(value) => handleSettingChange('contentVault', value)}
            />
          </div>
          
          <div>
            <Label htmlFor="vaultStorage">Storage Size (GB)</Label>
            <Input
              id="vaultStorage"
              type="number"
              value={settings.vaultStorageSize}
              onChange={(e) => handleSettingChange('vaultStorageSize', parseInt(e.target.value))}
              min="10"
              max="100"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Default: 20GB per Super Pro user (expandable)
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🗂️</span> Unlimited Drafts Backup
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Automatic storage of all post drafts with version history
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🎞️</span> Video & Asset Archive
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Raw video files, thumbnails, templates, and audio storage
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🧾</span> Contracts / PDFs Section
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Store sponsorship contracts, invoices, and affiliate files
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>🔐</span> Privacy & Encryption
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                AES-level encryption with folder-specific locks
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>📤</span> Export / Download
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Full export capabilities with one-click download backup
              </div>
            </div>
            
            <div className="p-3 border rounded">
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>♻️</span> Version Control
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Restore older versions of posts and files
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Manage Vault</Button>
            <Button variant="outline" size="sm">Storage Analytics</Button>
            <Button variant="outline" size="sm">Backup Settings</Button>
            <Button variant="outline" size="sm">Export Data</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-purple-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-purple-500" />
          <InfoTooltip 
            content="Granular control over feature access. CONSEQUENCES: TURNING OFF: No feature control, all features enabled, limited rollout options. TURNING ON: Controlled feature rollout, granular access management, experimental feature testing."
            type="info"
          >
            <h3 className="text-lg font-semibold">🧰 Premium Creator Tools Access Control</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Granular control over feature access</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-purple-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>Creator Workspace</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Monetization Tools</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>AI-Enhanced Analytics</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Storefront Features</Label>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Useful for gradual rollout or temporary experimental features
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-pink-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <InfoTooltip 
            content="Create and manage custom loyalty programs. CONSEQUENCES: TURNING OFF: No loyalty programs, reduced user retention, manual rewards management. TURNING ON: Automated loyalty tracking, engagement rewards, enhanced retention."
            type="info"
          >
            <h3 className="text-lg font-semibold">📦 Loyalty Program Manager</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Create and manage custom loyalty programs</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-pink-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Track & Manage:</strong></div>
            <div>• Points earned (login, engagement, renewal)</div>
            <div>• Rewards redeemed</div>
            <div>• Bonus campaigns ("double points for 3-day streak")</div>
            <div>• Manual point adjustments and bonuses</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Create Campaign</Button>
            <Button variant="outline" size="sm">Manage Points</Button>
            <Button variant="outline" size="sm">View Rewards</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-emerald-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-500" />
          <InfoTooltip 
            content="Adjust platform commission for top performers. CONSEQUENCES: TURNING OFF: Standard revenue splits, no incentives for top performers, reduced creator motivation. TURNING ON: Custom revenue splits, performance incentives, enhanced creator satisfaction."
            type="info"
          >
            <h3 className="text-lg font-semibold">🎯 Revenue Split Customization</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Adjust platform commission for top performers</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-emerald-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Custom Revenue Splits:</strong></div>
            <div>• Default: Platform keeps 20%</div>
            <div>• Top earners: Custom reduced rates (e.g., 10%)</div>
            <div>• Per-user or global adjustments</div>
            <div>• Perfect for attracting influencers</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Set Custom Rates</Button>
            <Button variant="outline" size="sm">Top Earners</Button>
            <Button variant="outline" size="sm">Revenue Reports</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-teal-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-purple-500" />
          <InfoTooltip 
            content="Manage VIP-only features and content. CONSEQUENCES: TURNING OFF: No exclusive content, reduced premium value, limited VIP experience. TURNING ON: VIP-only features, exclusive content access, enhanced premium experience."
            type="info"
          >
            <h3 className="text-lg font-semibold">🔒 Exclusive Group Tools</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Manage VIP-only features and content</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-teal-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Exclusive Access:</strong></div>
            <div>• Advanced Dating+ features</div>
            <div>• Private Courses and content</div>
            <div>• VIP Forums and discussions</div>
            <div>• Separate moderation controls</div>
            <div>• Content monitoring and analytics</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Manage Groups</Button>
            <Button variant="outline" size="sm">Set Permissions</Button>
            <Button variant="outline" size="sm">Monitor Activity</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-cyan-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-purple-500" />
          <InfoTooltip 
            content="Specialized messaging for Super Pro users. CONSEQUENCES: TURNING OFF: Generic communications, no targeted messaging, reduced engagement. TURNING ON: VIP-specific communications, targeted messaging, enhanced user experience."
            type="info"
          >
            <h3 className="text-lg font-semibold">✉️ Targeted Communication</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Specialized messaging for Super Pro users</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
          <div className="text-sm text-muted-foreground">
            <div><strong>Communication Channels:</strong></div>
            <div>• Blast emails to Super Pro users only</div>
            <div>• Push notifications for tier-specific updates</div>
            <div>• In-app messages and announcements</div>
            <div>• VIP-only communication channels</div>
            <div>• Personalized welcome sequences</div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Send Email Blast</Button>
            <Button variant="outline" size="sm">Push Notification</Button>
            <Button variant="outline" size="sm">VIP Announcement</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-amber-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <InfoTooltip 
            content="Enhanced visibility and verification features. CONSEQUENCES: TURNING OFF: No premium discovery, standard badges, reduced visibility. TURNING ON: Enhanced visibility, verified badges, priority discovery placement."
            type="info"
          >
            <h3 className="text-lg font-semibold">Premium Discovery & Elite Badging</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Enhanced visibility and verification features</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Feature top Super Pro users on homepage. CONSEQUENCES: TURNING OFF: No premium discovery, reduced visibility, lower engagement. TURNING ON: Homepage featuring, enhanced visibility, increased user discovery."
                type="info"
              >
                <Label>Premium Discovery</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Feature top Super Pro users on homepage</p>
            </div>
            <Switch
              checked={settings.premiumDiscovery}
              onCheckedChange={(value) => handleSettingChange('premiumDiscovery', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Special creator verification status. CONSEQUENCES: TURNING OFF: No verification badges, reduced credibility, lower trust. TURNING ON: Verified creator status, enhanced credibility, increased trust."
                type="info"
              >
                <Label>"Verified Creator" Badge</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Special creator verification status</p>
            </div>
            <Switch
              checked={settings.verifiedBadge}
              onCheckedChange={(value) => handleSettingChange('verifiedBadge', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Exclusive partnership designation. CONSEQUENCES: TURNING OFF: No elite status, standard partnership, reduced prestige. TURNING ON: Elite partner status, exclusive designation, enhanced prestige."
                type="info"
              >
                <Label>"Elite Partner" Badge</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Exclusive partnership designation</p>
            </div>
            <Switch
              checked={settings.elitePartnerBadge}
              onCheckedChange={(value) => handleSettingChange('elitePartnerBadge', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Dynamic badge animations. CONSEQUENCES: TURNING OFF: Static badges, reduced visual appeal, standard appearance. TURNING ON: Animated badges, enhanced visual appeal, premium appearance."
                type="info"
              >
                <Label>Animated Badge Effects</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Dynamic badge animations</p>
            </div>
            <Switch
              checked={settings.animatedBadge}
              onCheckedChange={(value) => handleSettingChange('animatedBadge', value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-violet-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-purple-500" />
          <InfoTooltip 
            content="Transform Super Pro users into brands and enterprises. CONSEQUENCES: TURNING OFF: No enterprise features, limited branding, standard profiles. TURNING ON: Enterprise branding, custom URLs, brand identity tools."
            type="info"
          >
            <h3 className="text-lg font-semibold">🧑‍⚖️ Enterprise Identity & Branding Tools</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Transform Super Pro users into brands and enterprises</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-violet-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Verified Business or Elite Creator badge with branded theme. CONSEQUENCES: TURNING OFF: No brand verification, standard identity, limited business features. TURNING ON: Verified brand identity, business credentials, enhanced legitimacy."
                type="info"
              >
                <Label>Verified Brand ID</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">🏢 Verified Business or 🎖️ Elite Creator badge with branded theme</p>
            </div>
            <Switch
              checked={settings.verifiedBrandId}
              onCheckedChange={(value) => handleSettingChange('verifiedBrandId', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Pre-made templates for promotional posts and campaigns. CONSEQUENCES: TURNING OFF: Manual design work, inconsistent branding, time-intensive creation. TURNING ON: Professional templates, consistent branding, efficient content creation."
                type="info"
              >
                <Label>Modular Branding Templates</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Pre-made templates for promotional posts and campaigns</p>
            </div>
            <Switch
              checked={settings.modularBrandingTemplates}
              onCheckedChange={(value) => handleSettingChange('modularBrandingTemplates', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Custom public link like creator.shqipet.com/username. CONSEQUENCES: TURNING OFF: Generic URLs, reduced brand presence, limited customization. TURNING ON: Custom branded URLs, professional appearance, enhanced brand identity."
                type="info"
              >
                <Label>White-Label Profile Link</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Custom public link like creator.shqipet.com/username</p>
            </div>
            <Switch
              checked={settings.whiteLabelProfileLink}
              onCheckedChange={(value) => handleSettingChange('whiteLabelProfileLink', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">🏢 Business Badge</Badge>
            <Badge variant="outline">🎨 Brand Templates</Badge>
            <Badge variant="outline">🔗 Custom URLs</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Branded header images and clickable bio sections
            • Showcase of top products and videos
            • Custom banner, URL slug, and contact buttons
            • Perfect for agencies using Shqipet.com as main platform
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-rose-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-orange-500" />
          <InfoTooltip 
            content="Full platform-as-a-creator OS features. CONSEQUENCES: TURNING OFF: Basic platform features, limited automation, manual workflows. TURNING ON: Advanced creator OS, automation tools, comprehensive platform integration."
            type="info"
          >
            <h3 className="text-lg font-semibold">🧩 Beyond Platform: Creator OS</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Full platform-as-a-creator OS features</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Let creators build automations. CONSEQUENCES: TURNING OFF: Manual workflows, time-intensive tasks, limited efficiency. TURNING ON: Automated workflows, time savings, enhanced productivity."
                type="info"
              >
                <Label>🧑‍💻 No-Code Automation Hub</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Let creators build automations: "If post hits 1k views → schedule another," or "Auto-translate every comment"</p>
            </div>
            <Switch
              checked={settings.noCodeAutomationHub}
              onCheckedChange={(value) => handleSettingChange('noCodeAutomationHub', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Help users embed shops inside their content/posts. CONSEQUENCES: TURNING OFF: External e-commerce links, reduced conversions, limited integration. TURNING ON: Embedded shopping, higher conversions, seamless commerce experience."
                type="info"
              >
                <Label>🛍️ Pro E-commerce SDK</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Help users embed shops inside their content/posts</p>
            </div>
            <Switch
              checked={settings.proEcommerceSDK}
              onCheckedChange={(value) => handleSettingChange('proEcommerceSDK', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Exclusive mode/app interface only available to Super Pros. CONSEQUENCES: TURNING OFF: Standard mobile experience, no exclusive interface, reduced premium feel. TURNING ON: Exclusive mobile interface, premium experience, enhanced value proposition."
                type="info"
              >
                <Label>📱 Mobile-Only Super Pro Mode</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Exclusive mode/app interface only available to Super Pros</p>
            </div>
            <Switch
              checked={settings.mobileOnlySuperProMode}
              onCheckedChange={(value) => handleSettingChange('mobileOnlySuperProMode', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Let users take followers from Shqipet.com to partner platforms. CONSEQUENCES: TURNING OFF: Platform-locked followers, limited portability, reduced flexibility. TURNING ON: Cross-platform portability, enhanced flexibility, federated identity."
                type="info"
              >
                <Label>🌐 Network Portability</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Let users take followers from Shqipet.com to partner platforms (federated identity)</p>
            </div>
            <Switch
              checked={settings.networkPortability}
              onCheckedChange={(value) => handleSettingChange('networkPortability', value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Badge variant="outline">🧑‍💻 Automation</Badge>
            <Badge variant="outline">🛍️ E-commerce</Badge>
            <Badge variant="outline">📱 Mobile Pro</Badge>
            <Badge variant="outline">🌐 Portability</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div><strong>Creator OS Features:</strong></div>
            <div>• No-code automation workflows</div>
            <div>• Embedded e-commerce solutions</div>
            <div>• Exclusive mobile interface</div>
            <div>• Cross-platform follower portability</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-l-4 border-l-slate-400 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-red-500" />
          <InfoTooltip 
            content="Tools for Super Pro creators to maintain compliance. CONSEQUENCES: TURNING OFF: Compliance risks, manual reporting, regulatory issues. TURNING ON: Automated compliance, regulatory tools, risk mitigation."
            type="info"
          >
            <h3 className="text-lg font-semibold">🧑‍⚖️ Regulatory Compliance Center</h3>
          </InfoTooltip>
        </div>
        <p className="text-muted-foreground mb-6">Tools for Super Pro creators to maintain compliance</p>
        
        <div className="space-y-4 pl-4 border-l-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Tools for Super Pro creators to maintain compliance. CONSEQUENCES: TURNING OFF: Manual compliance management, regulatory risks, complex reporting. TURNING ON: Automated compliance tools, simplified reporting, risk reduction."
                type="info"
              >
                <Label>Regulatory Compliance Center</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Tools for Super Pro creators to maintain compliance</p>
            </div>
            <Switch
              checked={settings.regulatoryComplianceCenter}
              onCheckedChange={(value) => handleSettingChange('regulatoryComplianceCenter', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Auto-generate GDPR/CCPA compliance reports. CONSEQUENCES: TURNING OFF: Manual report generation, compliance gaps, time-intensive processes. TURNING ON: Automated reporting, compliance assurance, time savings."
                type="info"
              >
                <Label>📋 GDPR/CCPA Reports</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Auto-generate GDPR/CCPA compliance reports</p>
            </div>
            <Switch
              checked={settings.gdprCcpaReports}
              onCheckedChange={(value) => handleSettingChange('gdprCcpaReports', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Download ad tracking disclosures. CONSEQUENCES: TURNING OFF: Manual disclosure creation, compliance gaps, legal risks. TURNING ON: Automated disclosures, compliance assurance, legal protection."
                type="info"
              >
                <Label>📊 Ad Tracking Disclosures</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Download ad tracking disclosures</p>
            </div>
            <Switch
              checked={settings.adTrackingDisclosures}
              onCheckedChange={(value) => handleSettingChange('adTrackingDisclosures', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <InfoTooltip 
                content="Set consent banners per audience. CONSEQUENCES: TURNING OFF: Generic consent, compliance issues, legal risks. TURNING ON: Audience-specific consent, enhanced compliance, tailored user experience."
                type="info"
              >
                <Label>🎯 Consent Banners Per Audience</Label>
              </InfoTooltip>
              <p className="text-sm text-muted-foreground">Set consent banners per audience</p>
            </div>
            <Switch
              checked={settings.consentBannersPerAudience}
              onCheckedChange={(value) => handleSettingChange('consentBannersPerAudience', value)}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Badge variant="outline">📋 GDPR/CCPA</Badge>
            <Badge variant="outline">📊 Ad Tracking</Badge>
            <Badge variant="outline">🎯 Consent</Badge>
          </div>
          
          <div className="text-sm text-muted-foreground">
            • Automated compliance report generation
            • Ad tracking disclosure management
            • Audience-specific consent banners
            • Privacy regulation compliance tools
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'core': return renderCoreFeatures();
      case 'ai': return renderAIFeatures();
      case 'business': return renderBusinessTools();
      case 'content': return renderContentMedia();
      case 'analytics': return renderAnalyticsInsights();
      case 'experimental': return renderExperimental();
      case 'admin': return renderAdminControls();
      default: return renderCoreFeatures();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Super Pro Settings
          </h1>
          <p className="text-muted-foreground">
            Configure all Super Pro features and administrative controls
          </p>
        </div>
        <Badge variant="default" className="bg-yellow-500">
          Premium Tier
        </Badge>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-3 border-b pb-4">
        {sections.map((section, index) => {
          const Icon = section.icon;
          
          // Define different color schemes for each button
          const colorSchemes = [
            'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
            'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
            'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
            'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
            'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
            'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
            'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
            'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200'
          ];
          
          const activeColorSchemes = [
            'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
            'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
            'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
            'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
            'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
            'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
            'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
            'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300'
          ];

          const colorScheme = colorSchemes[index % colorSchemes.length];
          const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 ${
                activeSection === section.id
                  ? `${activeColorScheme} border-2`
                  : colorScheme
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

      {/* Save Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          variant="outline"
          className="bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
        >
          Reset Changes
        </Button>
        <Button 
          className="bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-4 py-2 hover:scale-105 font-medium"
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default SuperProUserSettings;