import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, RefreshCw, Zap } from 'lucide-react';
import { Users, HardDrive, Eye, Shield, Activity, Archive, AlertTriangle } from 'lucide-react';
import { useStorageUsage } from '@/hooks/useStorageUsage';
import { useActivityMonitor } from '@/hooks/useActivityMonitor';
import { supabase } from '@/integrations/supabase/client';

interface UserQuotasConfigProps {
  freeUserQuota: string;
  setFreeUserQuota: (value: string) => void;
  premiumUserQuota: string;
  setPremiumUserQuota: (value: string) => void;
  adminUserQuota: string;
  setAdminUserQuota: (value: string) => void;
  quotaEnforcement: boolean;
  setQuotaEnforcement: (value: boolean) => void;
  retentionDays: string;
  setRetentionDays: (value: string) => void;
  autoCleanup: boolean;
  setAutoCleanup: (value: boolean) => void;
  // Silent quota system
  silentQuotaEnabled: boolean;
  setSilentQuotaEnabled: (value: boolean) => void;
  freeDailyLimit: string;
  setFreeDailyLimit: (value: string) => void;
  premiumDailyLimit: string;
  setPremiumDailyLimit: (value: string) => void;
  // Abuse detection
  abuseDetectionEnabled: boolean;
  setAbuseDetectionEnabled: (value: boolean) => void;
  rapidUploadThreshold: string;
  setRapidUploadThreshold: (value: string) => void;
  autoArchiveEnabled: boolean;
  setAutoArchiveEnabled: (value: boolean) => void;
  archiveAfterDays: string;
  setArchiveAfterDays: (value: string) => void;
  // Real-time update function
  handleSettingUpdate: (key: string, value: any) => void;
}

const UserQuotasConfig: React.FC<UserQuotasConfigProps> = ({
  freeUserQuota,
  setFreeUserQuota,
  premiumUserQuota,
  setPremiumUserQuota,
  adminUserQuota,
  setAdminUserQuota,
  quotaEnforcement,
  setQuotaEnforcement,
  retentionDays,
  setRetentionDays,
  autoCleanup,
  setAutoCleanup,
  silentQuotaEnabled,
  setSilentQuotaEnabled,
  freeDailyLimit,
  setFreeDailyLimit,
  premiumDailyLimit,
  setPremiumDailyLimit,
  abuseDetectionEnabled,
  setAbuseDetectionEnabled,
  rapidUploadThreshold,
  setRapidUploadThreshold,
  autoArchiveEnabled,
  setAutoArchiveEnabled,
  archiveAfterDays,
  setArchiveAfterDays,
  handleSettingUpdate
}) => {
  const { usage, loading: storageLoading, error: storageError, refetch } = useStorageUsage();
  const { metrics, loading: activityLoading, error: activityError, refetch: refetchActivity } = useActivityMonitor();
  const InfoTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
    const formatContent = (text: string) => {
      const parts = text.split('CONSEQUENCES:');
      if (parts.length === 1) return <p>{text}</p>;
      
      return (
        <div>
          <p>{parts[0]}</p>
          <p><span className="text-red-500 font-semibold">CONSEQUENCES:</span>{parts[1]}</p>
        </div>
      );
    };

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-help">
              {children}
              <Info className="h-4 w-4 text-blue-500 hover:text-blue-600 transition-colors" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {formatContent(content)}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Real-time connection status
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Supabase real-time subscription for upload configuration changes
  useEffect(() => {
    const channel = supabase
      .channel('upload-config-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upload_configuration'
        },
        (payload) => {
          console.log('⚡ [REAL-TIME] Upload configuration changed:', payload);
          setLastUpdated(new Date());
          refetch(); // Refresh storage data
          refetchActivity(); // Refresh activity data
        }
      )
      .subscribe((status) => {
        console.log('⚡ [REAL-TIME] Upload config subscription status:', status);
        setConnectionStatus(status === 'SUBSCRIBED' ? 'connected' : 'disconnected');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, refetchActivity]);

  return (
    <Card className="mt-8 relative">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Quotas & Storage Management
          </CardTitle>
          {/* Real-time Status Panel */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs font-medium">
                {connectionStatus === 'connected' ? 'Live Quotas Connected' : 'Quota Sync Disconnected'}
              </span>
            </div>
            {lastUpdated && (
              <div className="text-xs text-muted-foreground">
                Last quota update: {new Date(lastUpdated).toLocaleTimeString()}
              </div>
            )}
            <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full">
              <Zap className="h-3 w-3" />
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Real-time Live Status Dashboard */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 text-sm font-medium mb-3">
            <Activity className="h-4 w-4" />
            Live Quota Status Dashboard
          </div>
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="text-center p-2 bg-white/60 rounded">
              <div className="font-semibold text-green-700">Quota Enforcement</div>
              <div className="text-green-600">{quotaEnforcement ? 'Active' : 'Disabled'}</div>
            </div>
            <div className="text-center p-2 bg-white/60 rounded">
              <div className="font-semibold text-green-700">Free Users</div>
              <div className="text-green-600">{freeUserQuota}MB</div>
            </div>
            <div className="text-center p-2 bg-white/60 rounded">
              <div className="font-semibold text-green-700">Premium Users</div>
              <div className="text-green-600">{premiumUserQuota}MB</div>
            </div>
            <div className="text-center p-2 bg-white/60 rounded">
              <div className="font-semibold text-green-700">Admin Users</div>
              <div className="text-green-600">{adminUserQuota === '-1' ? 'Unlimited' : `${adminUserQuota}MB`}</div>
            </div>
          </div>
          <div className="mt-3 text-xs text-green-600 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            All quota changes sync instantly across the platform
          </div>
        </div>

        {/* Quota Enforcement */}
        <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 relative">
          <InfoTooltip content="Enable storage quotas to prevent abuse and control storage costs. When ENABLED: Users are limited by their tier quotas. CONSEQUENCES: When DISABLED: Users have unlimited storage which may lead to excessive usage and higher bills - use with caution!">
            <div>
              <Label className="font-medium">Enforce Storage Quotas</Label>
              <p className="text-sm text-gray-500">Limit storage per user type to prevent abuse and control costs</p>
            </div>
          </InfoTooltip>
          <div className="flex items-center gap-3">
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-1 text-xs text-green-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                Live
              </div>
            )}
            <Switch
              checked={quotaEnforcement}
              onCheckedChange={(checked) => {
                setQuotaEnforcement(checked);
                handleSettingUpdate('quota_enforcement', checked);
                setLastUpdated(new Date());
              }}
            />
          </div>
        </div>

        {/* Per-User-Type Quotas */}
        <div className="space-y-4 relative">
          <InfoTooltip content="Set different storage limits for each user type. When ENABLED: Free users get basic storage, premium users get more space, and admins can have unlimited storage. This helps monetize your platform and prevent abuse. CONSEQUENCES: When DISABLED: All users get same default quota regardless of tier.">
            <Label className="font-medium">Storage Quotas by User Type</Label>
          </InfoTooltip>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l-2 border-blue-200">
            <div className="space-y-2 relative">
              <Label className="text-sm flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Free Users
                {connectionStatus === 'connected' && (
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Label>
              <Select value={freeUserQuota} onValueChange={(value) => {
                setFreeUserQuota(value);
                handleSettingUpdate('free_user_quota', parseInt(value) || 500);
                setLastUpdated(new Date());
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 MB</SelectItem>
                  <SelectItem value="500">500 MB</SelectItem>
                  <SelectItem value="1024">1 GB</SelectItem>
                  <SelectItem value="2048">2 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 relative">
              <Label className="text-sm flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Premium Users
                {connectionStatus === 'connected' && (
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Label>
              <Select value={premiumUserQuota} onValueChange={(value) => {
                setPremiumUserQuota(value);
                handleSettingUpdate('premium_user_quota', parseInt(value) || 5120);
                setLastUpdated(new Date());
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2 GB</SelectItem>
                  <SelectItem value="5120">5 GB</SelectItem>
                  <SelectItem value="10240">10 GB</SelectItem>
                  <SelectItem value="20480">20 GB</SelectItem>
                  <SelectItem value="51200">50 GB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 relative">
              <Label className="text-sm flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                Admin Users
                {connectionStatus === 'connected' && (
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </Label>
              <Select value={adminUserQuota} onValueChange={(value) => {
                setAdminUserQuota(value);
                handleSettingUpdate('admin_user_quota', value === '-1' ? -1 : parseInt(value) || 51200);
                setLastUpdated(new Date());
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="51200">50 GB</SelectItem>
                  <SelectItem value="102400">100 GB</SelectItem>
                  <SelectItem value="512000">500 GB</SelectItem>
                  <SelectItem value="-1">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Auto-Cleanup Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
            <InfoTooltip content="Automatically delete files that haven't been accessed for a specified period. When ENABLED: Helps reduce storage costs and clean up unused content - but deleted files cannot be recovered! CONSEQUENCES: When DISABLED: Files are kept forever, increasing storage costs but ensuring no accidental data loss.">
              <div>
                <Label className="font-medium">Auto-Cleanup Old Files</Label>
                <p className="text-sm text-gray-500">Automatically delete unused files to save storage space</p>
              </div>
            </InfoTooltip>
            <Switch
              checked={autoCleanup}
              onCheckedChange={(checked) => {
                setAutoCleanup(checked);
                handleSettingUpdate('auto_cleanup', checked);
                setLastUpdated(new Date());
              }}
            />
          </div>

          {autoCleanup && (
            <div className="space-y-2 pl-4 border-l-2 border-amber-200">
              <Label className="font-medium">Delete Unused Files After</Label>
              <Select value={retentionDays} onValueChange={(value) => {
                setRetentionDays(value);
                handleSettingUpdate('retention_days', parseInt(value) || 90);
                setLastUpdated(new Date());
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="180">6 Months</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Files not accessed for this period will be automatically deleted</p>
            </div>
          )}
        </div>

        {/* Silent Quota System - Facebook/Instagram Style */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <InfoTooltip content="Facebook/Instagram style upload system. When ENABLED: Users see 'unlimited' uploads but backend enforces daily limits (500MB free, 5GB premium). When quota exceeded, show friendly 'Upload queued, processing soon...' message instead of blocking uploads. CONSEQUENCES: When DISABLED: Users see their actual quotas and get hard rejection messages when limits are reached.">
              <div>
                <Label className="font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Silent Upload Quota System
                </Label>
                <p className="text-sm text-gray-600">Hide quota limits from users while enforcing backend controls (like Facebook/Instagram)</p>
              </div>
            </InfoTooltip>
            <Switch
              checked={silentQuotaEnabled}
              onCheckedChange={(checked) => {
                setSilentQuotaEnabled(checked);
                handleSettingUpdate('silent_quota_enabled', checked);
                setLastUpdated(new Date());
              }}
            />
          </div>

          {silentQuotaEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-cyan-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Free Users Daily Limit</Label>
                  <Select value={freeDailyLimit} onValueChange={(value) => {
                    setFreeDailyLimit(value);
                    handleSettingUpdate('free_daily_limit', parseInt(value) || 500);
                    setLastUpdated(new Date());
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="250">250 MB/day</SelectItem>
                      <SelectItem value="500">500 MB/day</SelectItem>
                      <SelectItem value="1024">1 GB/day</SelectItem>
                      <SelectItem value="2048">2 GB/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Premium Users Daily Limit</Label>
                  <Select value={premiumDailyLimit} onValueChange={(value) => {
                    setPremiumDailyLimit(value);
                    handleSettingUpdate('premium_daily_limit', parseInt(value) || 5120);
                    setLastUpdated(new Date());
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2048">2 GB/day</SelectItem>
                      <SelectItem value="5120">5 GB/day</SelectItem>
                      <SelectItem value="10240">10 GB/day</SelectItem>
                      <SelectItem value="20480">20 GB/day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm text-yellow-800">
                  <strong>User Experience:</strong> When quota exceeded, show friendly message: "Upload queued, processing soon..." instead of hard error
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Smart Abuse Detection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <InfoTooltip content="Automatically detect and prevent abusive upload patterns. When ENABLED: System monitors upload speeds and flags suspicious behavior (like bots), temporarily pauses uploads, and alerts admins for review. CONSEQUENCES: When DISABLED: No monitoring occurs - vulnerable to spam attacks and resource abuse from automated scripts.">
              <div>
                <Label className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Smart Abuse Detection
                </Label>
                <p className="text-sm text-gray-600">Detect suspicious upload patterns and prevent abuse automatically</p>
              </div>
            </InfoTooltip>
            <Switch
              checked={abuseDetectionEnabled}
              onCheckedChange={(checked) => {
                setAbuseDetectionEnabled(checked);
                handleSettingUpdate('abuse_detection_enabled', checked);
                setLastUpdated(new Date());
              }}
            />
          </div>

          {abuseDetectionEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-red-200">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rapid Upload Threshold</Label>
                <Select value={rapidUploadThreshold} onValueChange={(value) => {
                  setRapidUploadThreshold(value);
                  handleSettingUpdate('rapid_upload_threshold', parseInt(value) || 1024);
                  setLastUpdated(new Date());
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500 MB in 10 minutes</SelectItem>
                    <SelectItem value="1024">1 GB in 15 minutes</SelectItem>
                    <SelectItem value="2048">2 GB in 30 minutes</SelectItem>
                    <SelectItem value="5120">5 GB in 1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                  <div className="text-sm font-medium text-orange-800">Action: Temporary Pause</div>
                  <div className="text-xs text-orange-600">Pause uploads for 15-30 minutes</div>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="text-sm font-medium text-red-800">Action: Admin Flag</div>
                  <div className="text-xs text-red-600">Alert admin for manual review</div>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                  <div className="text-sm font-medium text-purple-800">Action: Pattern Analysis</div>
                  <div className="text-xs text-purple-600">Check if behavior is bot-like</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auto Archive System */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
            <InfoTooltip content="Automatically move old files to cold storage after a specified period. When ENABLED: Cold storage costs ~90% less than regular storage but has slower access times. Great for reducing costs on unused files while keeping them available. CONSEQUENCES: When DISABLED: All files remain in active storage - faster access but much higher storage costs over time.">
              <div>
                <Label className="font-medium flex items-center gap-2">
                  <Archive className="h-4 w-4" />
                  Smart Auto-Archive System
                </Label>
                <p className="text-sm text-gray-600">Automatically move old files to cold storage to reduce costs</p>
              </div>
            </InfoTooltip>
            <Switch
              checked={autoArchiveEnabled}
              onCheckedChange={(checked) => {
                setAutoArchiveEnabled(checked);
                handleSettingUpdate('auto_archive_enabled', checked);
                setLastUpdated(new Date());
              }}
            />
          </div>

          {autoArchiveEnabled && (
            <div className="space-y-4 pl-4 border-l-2 border-purple-200">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Archive Files After</Label>
                <Select value={archiveAfterDays} onValueChange={(value) => {
                  setArchiveAfterDays(value);
                  handleSettingUpdate('archive_after_days', parseInt(value) || 90);
                  setLastUpdated(new Date());
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 Days (no access)</SelectItem>
                    <SelectItem value="60">60 Days (no access)</SelectItem>
                    <SelectItem value="90">90 Days (no access)</SelectItem>
                    <SelectItem value="180">6 Months (no access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>Cost Savings:</strong> Cold storage costs ~90% less than active storage. Files remain accessible but with slower retrieval times.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Real-Time User Activity Monitor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <InfoTooltip content="Live dashboard showing current upload activity, flagged users, queue status, and system health metrics. Automatically updates in real-time when any activity occurs. No manual refresh needed - data updates instantly when events happen in the system.">
              <Label className="font-medium flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Real-Time User Activity Monitor
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">LIVE</span>
              </Label>
            </InfoTooltip>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Auto-updating</span>
              </div>
            </div>
          </div>
          
          {activityError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
              Error loading activity data: {activityError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-green-200">
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Active Upload Sessions</div>
              <div className="text-2xl font-bold text-blue-600">
                {activityLoading ? 'Loading...' : metrics.activeUploadSessions}
              </div>
              <div className="text-xs text-gray-500">In last 10 minutes</div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Flagged Users (24h)</div>
              <div className="text-2xl font-bold text-red-600">
                {activityLoading ? 'Loading...' : metrics.flaggedUsers}
              </div>
              <div className="text-xs text-gray-500">Require admin review</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-gray-700">Queue Status</div>
              <div className="text-lg font-bold text-orange-600">
                {activityLoading ? 'Loading...' : `${metrics.queueStatus} files`}
              </div>
              <div className="text-xs text-gray-500">Processing queue</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-gray-700">Auto-Paused</div>
              <div className="text-lg font-bold text-yellow-600">
                {activityLoading ? 'Loading...' : `${metrics.autoPausedUsers} users`}
              </div>
              <div className="text-xs text-gray-500">Temporary cooldown</div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-gray-700">Success Rate</div>
              <div className="text-lg font-bold text-green-600">
                {activityLoading ? 'Loading...' : metrics.successRate}
              </div>
              <div className="text-xs text-gray-500">Last 24 hours</div>
            </div>
          </div>
        </div>

        {/* Current Storage Usage Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-medium flex items-center gap-2">
              Storage Usage Overview
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">LIVE</span>
            </Label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-blue-600 font-medium">Auto-updating</span>
              </div>
            </div>
          </div>
          
          {storageError && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
              Error loading storage data: {storageError}
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="text-sm font-medium text-blue-800">Total Storage</div>
              <div className="text-lg font-bold text-blue-900">
                {storageLoading ? 'Loading...' : usage.totalStorage}
              </div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <div className="text-sm font-medium text-green-800">Images</div>
              <div className="text-lg font-bold text-green-900">
                {storageLoading ? 'Loading...' : usage.images}
              </div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <div className="text-sm font-medium text-purple-800">Videos</div>
              <div className="text-lg font-bold text-purple-900">
                {storageLoading ? 'Loading...' : usage.videos}
              </div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <div className="text-sm font-medium text-orange-800">Documents</div>
              <div className="text-lg font-bold text-orange-900">
                {storageLoading ? 'Loading...' : usage.documents}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserQuotasConfig;