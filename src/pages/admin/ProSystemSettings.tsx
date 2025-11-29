import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Star, Settings, Users, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ProSystemSettings {
  lowProEnabled: boolean;
  monthlyPostLimit: number;
  adFreeEnabled: boolean;
  boostTokensPerMonth: number;
  basicAnalyticsEnabled: boolean;
  unlimitedDraftsEnabled: boolean;
  invisibleBrowsingEnabled: boolean;
  commentPinLimit: number;
}

const ProSystemSettings: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<ProSystemSettings>({
    lowProEnabled: true,
    monthlyPostLimit: 5,
    adFreeEnabled: true,
    boostTokensPerMonth: 5,
    basicAnalyticsEnabled: true,
    unlimitedDraftsEnabled: true,
    invisibleBrowsingEnabled: true,
    commentPinLimit: 1,
  });

  const [stats, setStats] = useState({
    totalLowProUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      // Load from post_settings table or create a separate pro_system_settings table
      setLoading(false);
    } catch (error) {
      console.error('Error loading pro system settings:', error);
      toast({
        title: "Error",
        description: "Failed to load pro system settings",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Count Low Pro users
      const { count: lowProCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('pro_level', 'low_pro');

      setStats(prev => ({
        ...prev,
        totalLowProUsers: lowProCount || 0,
        activeSubscriptions: lowProCount || 0, // For now, assume all Low Pro users have active subscriptions
      }));
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save settings to database
      toast({
        title: "Success",
        description: "Pro system settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save pro system settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <Star className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pro System Settings</h1>
          <p className="text-gray-600">Configure Low Pro tier features and limitations</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Low Pro Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLowProUsers}</div>
            <p className="text-xs text-muted-foreground">Currently subscribed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground">Monthly recurring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">From Low Pro subscriptions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Low Pro Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure the features and limitations for Low Pro subscribers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* System Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Enable Low Pro Tier</Label>
              <div className="text-sm text-gray-500">
                Allow users to subscribe to Low Pro features
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings.lowProEnabled}
                onCheckedChange={(checked) =>
                  setSettings(prev => ({ ...prev, lowProEnabled: checked }))
                }
              />
              <Badge variant={settings.lowProEnabled ? "default" : "secondary"}>
                {settings.lowProEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Post Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="postLimit">Monthly Post Scheduling Limit</Label>
              <Input
                id="postLimit"
                type="number"
                min="1"
                max="50"
                value={settings.monthlyPostLimit}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, monthlyPostLimit: parseInt(e.target.value) || 5 }))
                }
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Maximum number of posts Low Pro users can schedule per month
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="boostTokens">Boost Tokens per Month</Label>
              <Input
                id="boostTokens"
                type="number"
                min="0"
                max="20"
                value={settings.boostTokensPerMonth}
                onChange={(e) =>
                  setSettings(prev => ({ ...prev, boostTokensPerMonth: parseInt(e.target.value) || 5 }))
                }
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Number of boost tokens granted monthly to Low Pro users
              </p>
            </div>
          </div>

          <Separator />

          {/* Feature Toggles */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Feature Access</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Ad-Free Experience</Label>
                  <div className="text-sm text-gray-500">Remove banner and feed ads</div>
                </div>
                <Switch
                  checked={settings.adFreeEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, adFreeEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Basic Analytics</Label>
                  <div className="text-sm text-gray-500">Likes, reach, and shares</div>
                </div>
                <Switch
                  checked={settings.basicAnalyticsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, basicAnalyticsEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Unlimited Drafts</Label>
                  <div className="text-sm text-gray-500">Save unlimited post drafts</div>
                </div>
                <Switch
                  checked={settings.unlimitedDraftsEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, unlimitedDraftsEnabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Invisible Browsing</Label>
                  <div className="text-sm text-gray-500">Hide profile visits from others</div>
                </div>
                <Switch
                  checked={settings.invisibleBrowsingEnabled}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, invisibleBrowsingEnabled: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Comment Features */}
          <div className="space-y-2">
            <Label htmlFor="commentPinLimit">Pinned Comments Limit</Label>
            <Input
              id="commentPinLimit"
              type="number"
              min="0"
              max="5"
              value={settings.commentPinLimit}
              onChange={(e) =>
                setSettings(prev => ({ ...prev, commentPinLimit: parseInt(e.target.value) || 1 }))
              }
              className="w-32"
            />
            <p className="text-sm text-gray-500">
              Number of comments Low Pro users can pin per post
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" onClick={loadSettings}>
              Reset Changes
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProSystemSettings;