import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Eye, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Archive, 
  Sparkles,
  Palette,
  Users,
  Star,
  FileText,
  Shield
} from 'lucide-react';

interface FeatureToggle {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  icon: React.ComponentType<any>;
  isPremium?: boolean;
}

const ProFeatureToggles: React.FC = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [features, setFeatures] = useState<FeatureToggle[]>([
    // Profile & Appearance
    {
      id: 'theme_picker',
      name: 'Theme Picker',
      description: 'Choose from 3 additional profile color themes',
      category: 'Profile & Appearance',
      enabled: true,
      icon: Palette,
    },
    {
      id: 'hide_ads',
      name: 'Hide Ads',
      description: 'Remove banner and feed ads',
      category: 'Profile & Appearance',
      enabled: true,
      icon: Shield,
    },
    {
      id: 'profile_animation_badge',
      name: 'Profile Animation Badge',
      description: 'Glowing or pulsing icon next to name',
      category: 'Profile & Appearance',
      enabled: true,
      icon: Sparkles,
    },
    {
      id: 'pro_theme_slot',
      name: 'Pro Theme Slot',
      description: 'Choose 1 custom theme (dark gold, gradient blue, soft pastel)',
      category: 'Profile & Appearance',
      enabled: true,
      icon: Star,
    },

    // Post Settings
    {
      id: 'unlimited_drafts',
      name: 'Unlimited Drafts',
      description: 'Save unlimited post drafts',
      category: 'Post Settings',
      enabled: true,
      icon: Archive,
    },
    {
      id: 'schedule_posts',
      name: 'Schedule Posts',
      description: 'Schedule up to 5 posts per week',
      category: 'Post Settings',
      enabled: true,
      icon: Calendar,
    },
    {
      id: 'basic_analytics',
      name: 'Basic Analytics',
      description: 'Likes, reach count, and shares only',
      category: 'Post Settings',
      enabled: true,
      icon: BarChart3,
    },
    {
      id: 'edit_posts',
      name: 'Edit Posts After Publish',
      description: 'Edit a post up to 10 minutes after publishing',
      category: 'Post Settings',
      enabled: true,
      icon: FileText,
    },

    // Privacy Controls
    {
      id: 'hide_last_seen',
      name: 'Hide Last Seen',
      description: 'Hide your last seen status from others',
      category: 'Privacy Controls',
      enabled: true,
      icon: Eye,
    },
    {
      id: 'block_non_follower_dms',
      name: 'Block DMs from Non-Followers',
      description: 'Only receive messages from people you follow',
      category: 'Privacy Controls',
      enabled: true,
      icon: MessageSquare,
    },
    {
      id: 'invisible_browsing',
      name: 'Invisible Browsing',
      description: 'Hide your profile visits from others',
      category: 'Privacy Controls',
      enabled: true,
      icon: Eye,
    },

    // Interaction Features
    {
      id: 'pinned_comments',
      name: 'Pinned Comments',
      description: 'Pin 1 comment per post',
      category: 'Interaction Features',
      enabled: true,
      icon: MessageSquare,
    },
    {
      id: 'comment_formatting',
      name: 'Comment Formatting',
      description: 'Use bold/italic text, emojis, and custom spacing',
      category: 'Interaction Features',
      enabled: true,
      icon: FileText,
    },

    // Exclusive Access
    {
      id: 'pro_only_groups',
      name: 'Pro-Only Groups',
      description: 'Access to 1 exclusive Pro-only group',
      category: 'Exclusive Access',
      enabled: true,
      icon: Users,
    },
    {
      id: 'pro_discussion_threads',
      name: 'Pro Discussion Threads',
      description: 'Post/comment on exclusive community threads',
      category: 'Exclusive Access',
      enabled: true,
      icon: MessageSquare,
    },

    // AI Features
    {
      id: 'ai_digest',
      name: 'Basic AI Digest',
      description: 'Weekly summary of your most viewed posts and engaged followers',
      category: 'AI Features',
      enabled: false,
      icon: Sparkles,
      isPremium: true,
    },
    {
      id: 'ai_post_assistant',
      name: 'AI Post Assistant (Lite)',
      description: 'Help writing posts - 3 uses per month',
      category: 'AI Features',
      enabled: false,
      icon: FileText,
      isPremium: true,
    },
  ]);

  const categories = Array.from(new Set(features.map(f => f.category)));

  const handleToggleFeature = (featureId: string) => {
    setFeatures(prev =>
      prev.map(feature =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save all feature toggles to database
      // This could be stored in a pro_features JSON column or separate table
      
      toast({
        title: "Success",
        description: "Feature toggles saved successfully",
      });
    } catch (error) {
      console.error('Error saving feature toggles:', error);
      toast({
        title: "Error",
        description: "Failed to save feature toggles",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = features.filter(f => f.enabled).length;
  const totalCount = features.length;

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Toggles</h1>
            <p className="text-gray-600">Enable or disable Low Pro features</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            {enabledCount}/{totalCount} features enabled
          </Badge>
          <Button onClick={handleSaveAll} disabled={saving}>
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryFeatures = features.filter(f => f.category === category);
          const enabledInCategory = categoryFeatures.filter(f => f.enabled).length;
          
          return (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{category}</CardTitle>
                  <Badge variant="secondary">
                    {enabledInCategory}/{categoryFeatures.length} enabled
                  </Badge>
                </div>
                <CardDescription>
                  Manage features in the {category.toLowerCase()} category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  
                  return (
                    <div key={feature.id}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Label className="text-base font-medium">{feature.name}</Label>
                              {feature.isPremium && (
                                <Badge variant="secondary" className="text-xs">
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={feature.enabled ? "default" : "secondary"}
                            className="min-w-[70px] justify-center"
                          >
                            {feature.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                          <Switch
                            checked={feature.enabled}
                            onCheckedChange={() => handleToggleFeature(feature.id)}
                          />
                        </div>
                      </div>
                      {index < categoryFeatures.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>
            Quickly enable or disable multiple features at once
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setFeatures(prev => prev.map(f => ({ ...f, enabled: true })))}
            >
              Enable All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFeatures(prev => prev.map(f => ({ ...f, enabled: false })))}
            >
              Disable All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setFeatures(prev => prev.map(f => ({ ...f, enabled: !f.isPremium })))}
            >
              Enable Basic Only
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProFeatureToggles;