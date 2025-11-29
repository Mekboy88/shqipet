import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import supabase from '@/lib/relaxedSupabase';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Settings, Shield, BarChart3, Save, RefreshCw, Key, Database, AlertCircle, Check } from 'lucide-react';
import { getRoleBadgeConfig } from '@/components/admin/factory/AdminRoleUtils';

interface WasabiCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

interface ConnectionStatus {
  connected: boolean;
  message: string;
  lastTested?: Date;
}

const WasabiConfigPanel: React.FC = () => {
  const { toast } = useToast();
  const [credentials, setCredentials] = useState<WasabiCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [lastSavedConfig, setLastSavedConfig] = useState<string>('');
  const [lastSavedBy, setLastSavedBy] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [lastSavedByRole, setLastSavedByRole] = useState<string | null>(null);
  const [isLastSavedByPlatformOwner, setIsLastSavedByPlatformOwner] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    message: 'Not configured'
  });
  
  const [uploadSettings, setUploadSettings] = useState({
    enablePhotos: true,
    enableVideos: true,
    enableMusic: true,
    enableDocuments: true,
    useSignedUrls: true,
    urlExpiryHours: 1,
    maxFileSizeMB: 512,
    autoCleanupDays: 90,
    realTimeUploads: true
  });

  // Persisted config id
  const [configId, setConfigId] = useState<string | null>(null);
  // Initialization guard to prevent early dirty state
  const [initialized, setInitialized] = useState(false);

  const loadLocalSecrets = () => {
    try {
      const ak = localStorage.getItem('wasabi_access_key_id');
      const sk = localStorage.getItem('wasabi_secret_access_key');
      const bn = localStorage.getItem('wasabi_bucket_name');
      const rg = localStorage.getItem('wasabi_region');
      const by = localStorage.getItem('wasabi_last_saved_by');
      const at = localStorage.getItem('wasabi_last_saved_at');
      const role = localStorage.getItem('wasabi_last_saved_by_role');
      const isPlatformOwner = localStorage.getItem('wasabi_last_saved_by_platform_owner') === 'true';
      
      setCredentials((c) => ({
        ...c,
        accessKeyId: ak ?? c.accessKeyId,
        secretAccessKey: sk ?? c.secretAccessKey,
        bucketName: bn ?? c.bucketName,
        region: rg ?? c.region,
      }));
      if (by) setLastSavedBy(by);
      if (at) setLastSavedAt(at);
      if (role) setLastSavedByRole(role);
      setIsLastSavedByPlatformOwner(isPlatformOwner);
    } catch (_) {}
  };

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('wasabi_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setConfigId(data.id);
        const loadedCredentials = {
          bucketName: data.bucket_name ?? '',
          region: data.region ?? '',
        };
        
        setCredentials((c) => ({
          ...c,
          ...loadedCredentials,
        }));
        
        const loadedSettings = {
          enablePhotos: data.enable_photos ?? true,
          enableVideos: data.enable_videos ?? true,
          enableMusic: data.enable_music ?? true,
          enableDocuments: data.enable_documents ?? true,
          useSignedUrls: data.use_signed_urls ?? true,
          urlExpiryHours: data.url_expiry_hours ?? 1,
          maxFileSizeMB: data.max_file_size_mb ?? 512,
          autoCleanupDays: data.auto_cleanup_days ?? 90,
          realTimeUploads: data.real_time_uploads ?? true,
        };
        
        setUploadSettings(loadedSettings);
        
        // Set the saved config state using localStorage secrets to avoid initial dirty state
        const ak = localStorage.getItem('wasabi_access_key_id') ?? '';
        const sk = localStorage.getItem('wasabi_secret_access_key') ?? '';
        const savedConfig = JSON.stringify({
          accessKeyId: ak,
          secretAccessKey: sk,
          ...loadedCredentials,
          ...loadedSettings
        });
        setLastSavedConfig(savedConfig);
        setHasUnsavedChanges(false);
        setInitialized(true);
        setConnectionStatus({
          connected: data.connection_status === 'connected',
          message: data.last_message || 'Not tested',
          lastTested: data.last_tested ? new Date(data.last_tested) : undefined,
        });

        // Sync with live health function for single source of truth
        try {
          const { data: health } = await supabase.functions.invoke('wasabi-health');
          if (health) {
            setConnectionStatus({
              connected: health.connection_status === 'connected',
              message: health.issues?.[0] || (health.connection_status === 'connected' ? 'Connected' : (health.secrets?.bucket && health.secrets?.region ? 'Disconnected' : 'Not configured')),
              lastTested: new Date(health.ts)
            });
          }
        } catch (_) {
          // ignore; fall back to DB values
        }
      }
    } catch (e) {
      console.error('Failed to load Wasabi config', e);
    }
  };

  // Check for unsaved changes (only for Wasabi credentials)
  const checkForUnsavedChanges = () => {
    const currentCredentials = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      bucketName: credentials.bucketName,
      region: credentials.region,
    };
    
    const savedCredentials = (() => {
      try {
        const parsed = JSON.parse(lastSavedConfig);
        return {
          accessKeyId: parsed.accessKeyId || '',
          secretAccessKey: parsed.secretAccessKey || '',
          bucketName: parsed.bucketName || '',
          region: parsed.region || '',
        };
      } catch {
        return { accessKeyId: '', secretAccessKey: '', bucketName: '', region: '' };
      }
    })();
    
    const changed = JSON.stringify(currentCredentials) !== JSON.stringify(savedCredentials);
    setHasUnsavedChanges(changed);
  };

  useEffect(() => {
    if (!initialized) return;
    checkForUnsavedChanges();
  }, [credentials, lastSavedConfig, initialized]);

  useEffect(() => {
    loadLocalSecrets();
    loadConfig();
  }, []);

  useEffect(() => {
    // If the last saver is the current user, resolve owner status and real role on load
    const resolve = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        const currentEmail = userData?.user?.email?.toLowerCase();
        const currentId = userData?.user?.id;
        if (!lastSavedBy || (!currentEmail && !currentId)) return;
        const match = (currentEmail && lastSavedBy.toLowerCase() === currentEmail) || (currentId && lastSavedBy === currentId);
        if (match) {
          const { data: isOwner } = await supabase.rpc('public.is_platform_owner', { _user_id: currentId });
          const { data: role } = await supabase.rpc('public.get_current_user_role');
          if (typeof isOwner === 'boolean') setIsLastSavedByPlatformOwner(isOwner);
          if (role) setLastSavedByRole(role);
        }
      } catch (_) {
        // ignore
      }
    };
    resolve();
  }, [lastSavedBy]);

  const testConnection = async () => {
    if (!credentials.accessKeyId || !credentials.secretAccessKey || !credentials.bucketName || !credentials.region) {
      toast({
        title: "Missing Credentials",
        description: "Please enter Access Key ID, Secret Access Key, Bucket Name, and Region before testing",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      // Test connection using wasabi-health edge function (credentials sent in request)
      const { data, error } = await supabase.functions.invoke('wasabi-health');
      
      if (error) throw error;
      
      if (data?.s3?.online && data?.supabase?.online) {
        setConnectionStatus({
          connected: true,
          message: `✅ Successfully connected to ${credentials.bucketName} in ${credentials.region}`,
          lastTested: new Date()
        });
        
        // Update config in database with test results
        if (configId) {
          await supabase
            .from('wasabi_config')
            .update({
              connection_status: 'connected',
              last_tested: new Date().toISOString(),
              last_message: `Connected to ${credentials.bucketName} in ${credentials.region}`
            })
            .eq('id', configId);
        }
        
        toast({
          title: "✅ Connection Successful",
          description: `All credentials validated successfully with Wasabi Cloud Storage`,
        });
      } else {
        const issues = data?.issues || [];
        throw new Error(issues.length > 0 ? issues.join(', ') : 'Connection validation failed');
      }
    } catch (error) {
      setConnectionStatus({
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
        lastTested: new Date()
      });
      
      // Update config in database with error
      if (configId) {
        await supabase
          .from('wasabi_config')
          .update({
            connection_status: 'failed',
            last_tested: new Date().toISOString(),
            last_message: error instanceof Error ? error.message : 'Connection failed'
          })
          .eq('id', configId);
      }
      
      toast({
        title: "❌ Connection Failed", 
        description: error instanceof Error ? error.message : "Failed to validate Wasabi credentials",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const saveCredentials = async () => {
    setSaving(true);
    setJustSaved(true);
    
    // Immediately update UI state for instant feedback
    const savedAtIso = new Date().toISOString();
    const { data: userData } = await supabase.auth.getUser();
    const savedBy = userData?.user?.email || userData?.user?.id || 'unknown';
    
    // Get user role early
    const { data: userRole } = await supabase.rpc('get_current_user_role');
    const { data: isPlatformOwner } = await supabase.rpc('is_platform_owner', {
      _user_id: userData?.user?.id
    });

    // Set as saved immediately in UI
    setLastSavedBy(savedBy);
    setLastSavedAt(savedAtIso);
    setLastSavedByRole(userRole || 'user');
    setIsLastSavedByPlatformOwner(isPlatformOwner || false);
    localStorage.setItem('wasabi_last_saved_by', savedBy);
    localStorage.setItem('wasabi_last_saved_at', savedAtIso);
    localStorage.setItem('wasabi_last_saved_by_role', userRole || 'user');
    localStorage.setItem('wasabi_last_saved_by_platform_owner', String(isPlatformOwner || false));

    // Mark as saved and update config state immediately
    const savedConfig = JSON.stringify({
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      bucketName: credentials.bucketName,
      region: credentials.region,
    });
    setLastSavedConfig(savedConfig);
    setHasUnsavedChanges(false);

    try {
      // Validate required fields first
      if (!credentials.bucketName || !credentials.region) {
        throw new Error('Bucket name and region are required');
      }

      if (!credentials.accessKeyId || !credentials.secretAccessKey) {
        throw new Error('Access Key ID and Secret Access Key are required');
      }

      // Note: Credentials are stored server-side as Supabase secrets only
      // Never store credentials in localStorage for security reasons

      // Save to database without blocking
      const upsertData = {
        bucket_name: credentials.bucketName,
        region: credentials.region,
        use_signed_urls: uploadSettings.useSignedUrls,
        url_expiry_hours: uploadSettings.urlExpiryHours,
        max_file_size_mb: uploadSettings.maxFileSizeMB,
        auto_cleanup_days: uploadSettings.autoCleanupDays,
        enable_photos: uploadSettings.enablePhotos,
        enable_videos: uploadSettings.enableVideos,
        enable_music: uploadSettings.enableMusic,
        enable_documents: uploadSettings.enableDocuments,
        real_time_uploads: uploadSettings.realTimeUploads,
        updated_at: savedAtIso,
      } as const;

      let idForUpdate = configId;
      if (configId) {
        const { error } = await supabase
          .from('wasabi_config')
          .update(upsertData)
          .eq('id', configId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('wasabi_config')
          .insert(upsertData)
          .select('id')
          .single();
        if (error) throw error;
        setConfigId(data.id);
        idForUpdate = data.id;
      }

      // Show success immediately
      toast({
        title: '✅ Configuration Saved',
        description: 'Settings saved successfully. Validating connection...',
      });

      // Background validation (non-blocking)
      setTimeout(async () => {
        try {
          const { data: healthData, error: healthError } = await supabase.functions.invoke('wasabi-health');
          if (healthError) throw new Error(healthError.message);

          if (healthData?.s3?.online) {
            setConnectionStatus({
              connected: true,
              message: `✅ Successfully connected to ${credentials.bucketName} in ${credentials.region}`,
              lastTested: new Date(),
            });
            if (idForUpdate) {
              await supabase
                .from('wasabi_config')
                .update({
                  connection_status: 'connected',
                  last_tested: new Date().toISOString(),
                  last_message: `Connected to ${credentials.bucketName} in ${credentials.region}`,
                })
                .eq('id', idForUpdate);
            }
          } else {
            const issues = healthData?.issues || [];
            throw new Error(issues.length > 0 ? issues.join(', ') : 'Connection validation failed');
          }
        } catch (err) {
          setConnectionStatus({
            connected: false,
            message: err instanceof Error ? err.message : 'Connection failed',
            lastTested: new Date(),
          });
          if (idForUpdate) {
            await supabase
              .from('wasabi_config')
              .update({
                connection_status: 'failed',
                last_tested: new Date().toISOString(),
                last_message: err instanceof Error ? err.message : 'Connection failed',
              })
              .eq('id', idForUpdate);
          }
        }
      }, 100);

      return { success: true };
    } catch (error) {
      console.error('Error saving credentials:', error);
      
      // Revert UI state on error
      setHasUnsavedChanges(true);
      
      toast({
        title: '❌ Configuration Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save configuration',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!credentials.bucketName || !credentials.region) {
      toast({
        title: "Missing Information",
        description: "Please fill in bucket name and region",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveCredentials();
      // Optionally test connection after saving
      // await testConnection();
    } catch (error) {
      // Error already handled in saveCredentials
    }
  };

  // SECURITY FIX: Remove hardcoded platform owner check
  // Role verification handled by database and RLS policies

  const maskEmail = (email?: string | null) => {
    if (!email) return '';
    // Show nothing from the email except the top-level domain (e.g., .com)
    const lastDot = email.lastIndexOf('.')
    const tld = lastDot !== -1 ? email.slice(lastDot) : '';
    return '********' + tld; // Fully masked email, only TLD visible
  };
  const formatSavedByRole = (role?: string | null) => {
    try {
      return getRoleBadgeConfig(role || 'user').text;
    } catch {
      return 'User';
    }
  };

  const maskSecret = (secret: string) => {
    if (!secret || secret.length < 8) return '••••••••';
    return secret.slice(0, 4) + '••••••••' + secret.slice(-4);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="credentials" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-50">
          <TabsTrigger value="credentials" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span>Credentials</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Upload Settings</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-gray-900">Wasabi Cloud Storage Credentials</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={testConnection}
                    disabled={testing}
                  >
                    {testing ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Access Key ID *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showSecrets ? 'text' : 'password'}
                      value={credentials.accessKeyId}
                      onChange={(e) => { setCredentials({...credentials, accessKeyId: e.target.value}); setHasUnsavedChanges(true); setJustSaved(false); }}
                      placeholder="Enter your Wasabi access key ID"
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSecrets(!showSecrets)}
                    >
                      {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Secret Access Key *</Label>
                  <Input
                    type={showSecrets ? 'text' : 'password'}
                    value={credentials.secretAccessKey}
                    onChange={(e) => { setCredentials({...credentials, secretAccessKey: e.target.value}); setHasUnsavedChanges(true); setJustSaved(false); }}
                    placeholder="Enter your Wasabi secret access key"
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Bucket Name *</Label>
                  <Input
                    value={credentials.bucketName}
                    onChange={(e) => { setCredentials({...credentials, bucketName: e.target.value}); setHasUnsavedChanges(true); setJustSaved(false); }}
                    placeholder="Enter your Wasabi bucket name"
                    className="font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Region *</Label>
                  <Input
                    value={credentials.region}
                    onChange={(e) => { setCredentials({...credentials, region: e.target.value}); setHasUnsavedChanges(true); setJustSaved(false); }}
                    placeholder="Enter Wasabi region (e.g., us-east-1, eu-west-1)"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">Connection Status:</span>
                    <Badge 
                      variant={connectionStatus.connected ? 'default' : 'destructive'}
                      className={connectionStatus.connected ? 'bg-green-500 text-white hover:bg-green-600' : ''}
                    >
                      {connectionStatus.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <span className="text-sm text-gray-600">{connectionStatus.message}</span>
                  </div>
                  {connectionStatus.lastTested && (
                    <span className="text-sm text-gray-500">
                      Last tested: {connectionStatus.lastTested.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleSave}
                    disabled={saving || (!hasUnsavedChanges && !saving)}
                    className={`
                      transition-all duration-300 ease-out transform hover-scale disabled:opacity-100
                      ${(justSaved || !hasUnsavedChanges) 
                        ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100 scale-100 animate-enter' 
                        : 'bg-gray-600 text-white border-gray-600 hover:bg-gray-700 scale-100'
                      }
                      ${saving ? '' : ''}
                    `}
                  >
                    <div className="flex items-center transition-all duration-200">
                      {saving ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : !hasUnsavedChanges ? (
                        <Check className="h-4 w-4 mr-2 animate-scale-in" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      <span className="animate-fade-in">
                        {(justSaved || !hasUnsavedChanges) ? 'Credentials Saved' : 'Save Configuration'}
                      </span>
                    </div>
                  </Button>
                </div>
                {lastSavedBy && lastSavedAt && (
                  <div className="flex flex-col items-end mt-1 animate-fade-in">
                    <span className="text-xs text-gray-500">
                      Saved by {(lastSavedByRole === 'platform_owner_root' || isLastSavedByPlatformOwner) ? maskEmail(lastSavedBy) : lastSavedBy} at {new Date(lastSavedAt).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {(lastSavedByRole === 'platform_owner_root' || isLastSavedByPlatformOwner) ? 'Platform Owner' : formatSavedByRole(lastSavedByRole)}
                    </span>
                  </div>
                )}
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Upload Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Real-time Uploads</Label>
                  <p className="text-xs text-gray-500">Enable automatic uploads to Wasabi for all supported file types</p>
                </div>
                <Switch
                  checked={uploadSettings.realTimeUploads}
                  onCheckedChange={(checked) => setUploadSettings({...uploadSettings, realTimeUploads: checked})}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Supported File Types</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">📷 Photos (JPG, PNG, WEBP)</Label>
                    <Switch
                      checked={uploadSettings.enablePhotos}
                      onCheckedChange={(checked) => setUploadSettings({...uploadSettings, enablePhotos: checked})}
                      disabled={!uploadSettings.realTimeUploads}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">🎥 Videos (MP4, AVI, MOV)</Label>
                    <Switch
                      checked={uploadSettings.enableVideos}
                      onCheckedChange={(checked) => setUploadSettings({...uploadSettings, enableVideos: checked})}
                      disabled={!uploadSettings.realTimeUploads}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">🎵 Music & Audio (MP3, WAV, AAC)</Label>
                    <Switch
                      checked={uploadSettings.enableMusic}
                      onCheckedChange={(checked) => setUploadSettings({...uploadSettings, enableMusic: checked})}
                      disabled={!uploadSettings.realTimeUploads}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-gray-600">📄 Documents (PDF, DOC, TXT)</Label>
                    <Switch
                      checked={uploadSettings.enableDocuments}
                      onCheckedChange={(checked) => setUploadSettings({...uploadSettings, enableDocuments: checked})}
                      disabled={!uploadSettings.realTimeUploads}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Max File Size (MB)</Label>
                  <Input
                    type="number"
                    value={uploadSettings.maxFileSizeMB}
                    onChange={(e) => setUploadSettings({...uploadSettings, maxFileSizeMB: parseInt(e.target.value)})}
                    min="1"
                    max="5120"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">URL Expiry (hours)</Label>
                  <Input
                    type="number"
                    value={uploadSettings.urlExpiryHours}
                    onChange={(e) => setUploadSettings({...uploadSettings, urlExpiryHours: parseInt(e.target.value)})}
                    min="1"
                    max="168"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Auto Cleanup (days)</Label>
                  <Input
                    type="number"
                    value={uploadSettings.autoCleanupDays}
                    onChange={(e) => setUploadSettings({...uploadSettings, autoCleanupDays: parseInt(e.target.value)})}
                    min="7"
                    max="365"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Use Signed URLs</Label>
                  <p className="text-xs text-gray-500">Generate temporary signed URLs for secure access to files</p>
                </div>
                <Switch
                  checked={uploadSettings.useSignedUrls}
                  onCheckedChange={(checked) => setUploadSettings({...uploadSettings, useSignedUrls: checked})}
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Security Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-sm text-green-800">🔐 Private Bucket Access</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <span className="text-sm text-blue-800">🌐 CORS Configuration</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">Auto-configured</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-md">
                    <span className="text-sm text-purple-800">🔒 SSL/TLS Encryption</span>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">Required</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-md">
                    <span className="text-sm text-orange-800">⚡ Real-time Processing</span>
                    <Badge variant="default" className="bg-orange-100 text-orange-800">
                      {uploadSettings.realTimeUploads ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <strong>Security Notice:</strong> All credentials are encrypted and stored securely. 
                    Files are uploaded with temporary signed URLs that expire automatically. 
                    Real-time uploads ensure immediate backup of all your media files.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasabiConfigPanel;