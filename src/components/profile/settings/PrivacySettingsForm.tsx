import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { usePrivacySettings } from '@/hooks/usePrivacySettings';
import { Shield, Eye, MessageSquare, Users, Globe, Image, Lock, Database, Target, RotateCcw } from 'lucide-react';

// Row component for Select fields
const RowSelect: React.FC<{
  label: string;
  description?: string;
  value: string;
  onValueChange: (val: string) => void;
  options: { value: string; label: string }[];
}> = ({ label, description, value, onValueChange, options }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div className="flex-1 pr-4">
      <div className="font-medium text-sm">{label}</div>
      {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
    </div>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] cursor-pointer pointer-events-auto transition-shadow hover:shadow-md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="pointer-events-auto bg-popover">
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// Row component for Switch fields
const RowSwitch: React.FC<{
  label: string;
  description?: string;
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}> = ({ label, description, id, checked, onCheckedChange }) => (
  <div className="flex items-center justify-between py-3 border-b last:border-0">
    <div className="flex-1 pr-4">
      <Label htmlFor={id} className="font-medium text-sm cursor-pointer">
        {label}
      </Label>
      {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
    </div>
    <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default function PrivacySettingsForm() {
  const { settings, loading, saving, updateSettings, resetToDefaults } = usePrivacySettings();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8 text-center">
        <div className="text-muted-foreground">Loading privacy settings...</div>
      </div>
    );
  }

  // Helper to normalize boolean values
  const toBool = (val: any): boolean => val === true || val === 'yes';
  const fromBool = (val: boolean): boolean => val;

  // Helper to normalize select values
  const toValue = (val: any): string => String(val || '').toLowerCase().replace(/ /g, '_');

  return (
    <div className="max-w-6xl mx-auto space-y-6 pointer-events-auto isolate">
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Privacy Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Control who can see your information and how you interact
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Privacy Settings</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all privacy settings to their default values. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetToDefaults}>Reset All</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Who can follow me"
            value={toValue(settings.privacy_who_can_follow_me)}
            onValueChange={(val) => updateSettings({ privacy_who_can_follow_me: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'no_body', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Who can see my friends list"
            value={toValue(settings.privacy_who_can_see_my_friends)}
            onValueChange={(val) => updateSettings({ privacy_who_can_see_my_friends: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
          <RowSelect
            label="Who can see my birthday"
            value={toValue(settings.privacy_who_can_see_my_birthday)}
            onValueChange={(val) => updateSettings({ privacy_who_can_see_my_birthday: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
          <RowSelect
            label="Online status"
            value={toValue(settings.privacy_status)}
            onValueChange={(val) => updateSettings({ privacy_status: val })}
            options={[
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' },
              { value: 'invisible', label: 'Invisible' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Timeline & Mentions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Timeline, Tagging & Mentions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Who can post on my timeline"
            value={toValue(settings.privacy_who_can_post_on_my_timeline)}
            onValueChange={(val) => updateSettings({ privacy_who_can_post_on_my_timeline: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'no_body', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Who can comment on my posts"
            value={toValue(settings.who_can_comment_on_posts)}
            onValueChange={(val) => updateSettings({ who_can_comment_on_posts: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'followers', label: 'Followers' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'nobody', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Who can share my posts"
            value={toValue(settings.who_can_share_posts)}
            onValueChange={(val) => updateSettings({ who_can_share_posts: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'followers', label: 'Followers' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'nobody', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Who can mention me"
            value={toValue(settings.who_can_mention_me)}
            onValueChange={(val) => updateSettings({ who_can_mention_me: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'nobody', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Who can tag me in posts"
            value={toValue(settings.who_can_tag_me)}
            onValueChange={(val) => updateSettings({ who_can_tag_me: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'nobody', label: 'Nobody' },
            ]}
          />
          <RowSwitch
            label="Review tags before they appear on my profile"
            id="review_tags"
            checked={toBool(settings.review_tags_before_appear)}
            onCheckedChange={(val) => updateSettings({ review_tags_before_appear: fromBool(val) })}
          />
          <RowSwitch
            label="Review posts I'm tagged in"
            id="review_tagged"
            checked={toBool(settings.review_tagged_posts)}
            onCheckedChange={(val) => updateSettings({ review_tagged_posts: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Messages & Presence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages & Presence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Who can message me"
            value={toValue(settings.privacy_who_can_message_me)}
            onValueChange={(val) => updateSettings({ privacy_who_can_message_me: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'no_body', label: 'Nobody' },
            ]}
          />
          <RowSelect
            label="Message request filtering"
            value={toValue(settings.message_request_filter)}
            onValueChange={(val) => updateSettings({ message_request_filter: val })}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'strict', label: 'Strict' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <RowSwitch
            label="Show read receipts"
            description="Let others know when you've read their messages"
            id="read_receipts"
            checked={toBool(settings.allow_read_receipts)}
            onCheckedChange={(val) => updateSettings({ allow_read_receipts: fromBool(val) })}
          />
          <RowSwitch
            label="Show typing indicators"
            description="Let others see when you're typing"
            id="typing"
            checked={toBool(settings.show_typing_indicators)}
            onCheckedChange={(val) => updateSettings({ show_typing_indicators: fromBool(val) })}
          />
          <RowSwitch
            label="Show active status"
            description="Let others see when you're online"
            id="active_status"
            checked={toBool(settings.show_active_status)}
            onCheckedChange={(val) => updateSettings({ show_active_status: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Profile Field Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Field Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Email visibility"
            value={toValue(settings.email_visibility)}
            onValueChange={(val) => updateSettings({ email_visibility: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
          <RowSelect
            label="Phone number visibility"
            value={toValue(settings.phone_visibility)}
            onValueChange={(val) => updateSettings({ phone_visibility: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
          <RowSelect
            label="Birthday detail level"
            value={toValue(settings.birthday_detail)}
            onValueChange={(val) => updateSettings({ birthday_detail: val })}
            options={[
              { value: 'full', label: 'Full Date' },
              { value: 'day_month_only', label: 'Day & Month Only' },
              { value: 'hidden', label: 'Hidden' },
            ]}
          />
          <RowSelect
            label="Location visibility"
            value={toValue(settings.location_visibility)}
            onValueChange={(val) => updateSettings({ location_visibility: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
          <RowSelect
            label="Work & Education visibility"
            value={toValue(settings.work_education_visibility)}
            onValueChange={(val) => updateSettings({ work_education_visibility: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'people_i_follow', label: 'People I Follow' },
              { value: 'only_me', label: 'Only Me' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Communication Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Communication Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Confirm follow requests"
            description="Manually approve each follow request"
            id="confirm_follow"
            checked={toBool(settings.privacy_confirm_request_when_someone_follows_you)}
            onCheckedChange={(val) => updateSettings({ privacy_confirm_request_when_someone_follows_you: val ? 'yes' : 'no' })}
          />
          <RowSwitch
            label="Show my activities"
            description="Let others see your recent activities"
            id="show_activities"
            checked={toBool(settings.privacy_show_my_activities)}
            onCheckedChange={(val) => updateSettings({ privacy_show_my_activities: val ? 'yes' : 'no' })}
          />
        </CardContent>
      </Card>

      {/* Activity Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Activity Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Share location with public"
            description="Allow your location to be visible to everyone"
            id="share_location"
            checked={toBool(settings.privacy_share_my_location_with_public)}
            onCheckedChange={(val) => updateSettings({ privacy_share_my_location_with_public: val ? 'yes' : 'no' })}
          />
        </CardContent>
      </Card>

      {/* Followers & Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Followers & Friend Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Who can send friend requests"
            value={toValue(settings.who_can_send_friend_requests)}
            onValueChange={(val) => updateSettings({ who_can_send_friend_requests: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'friends_of_friends', label: 'Friends of Friends' },
              { value: 'nobody', label: 'Nobody' },
            ]}
          />
          <RowSwitch
            label="Approve new followers manually"
            id="approve_followers"
            checked={toBool(settings.approve_new_followers)}
            onCheckedChange={(val) => updateSettings({ approve_new_followers: fromBool(val) })}
          />
          <RowSwitch
            label="Auto-approve follow requests"
            id="auto_approve"
            checked={toBool(settings.auto_approve_follow_requests)}
            onCheckedChange={(val) => updateSettings({ auto_approve_follow_requests: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Discovery & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Discovery & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Allow find by email"
            description="Let people find you using your email address"
            id="find_email"
            checked={toBool(settings.allow_find_by_email)}
            onCheckedChange={(val) => updateSettings({ allow_find_by_email: fromBool(val) })}
          />
          <RowSwitch
            label="Allow find by phone"
            description="Let people find you using your phone number"
            id="find_phone"
            checked={toBool(settings.allow_find_by_phone)}
            onCheckedChange={(val) => updateSettings({ allow_find_by_phone: fromBool(val) })}
          />
          <RowSwitch
            label="Show in people you may know"
            id="people_may_know"
            checked={toBool(settings.show_in_people_you_may_know)}
            onCheckedChange={(val) => updateSettings({ show_in_people_you_may_know: fromBool(val) })}
          />
          <RowSwitch
            label="Personalize recommendations"
            description="Use your activity to suggest relevant content"
            id="personalize"
            checked={toBool(settings.personalize_recommendations)}
            onCheckedChange={(val) => updateSettings({ personalize_recommendations: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Location & Search Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Location & Search Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Allow search engines to index profile"
            description="Let search engines like Google find your profile"
            id="search_engines"
            checked={toBool(settings.privacy_allow_search_engines_to_index)}
            onCheckedChange={(val) => updateSettings({ privacy_allow_search_engines_to_index: val ? 'yes' : 'no' })}
          />
        </CardContent>
      </Card>

      {/* Stories & Reels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Stories & Reels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Who can view my stories"
            value={toValue(settings.who_can_view_stories)}
            onValueChange={(val) => updateSettings({ who_can_view_stories: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'followers', label: 'Followers' },
              { value: 'close_friends', label: 'Close Friends' },
            ]}
          />
          <RowSelect
            label="Allow story replies"
            value={toValue(settings.allow_story_replies)}
            onValueChange={(val) => updateSettings({ allow_story_replies: val })}
            options={[
              { value: 'everyone', label: 'Everyone' },
              { value: 'followers', label: 'Followers' },
              { value: 'off', label: 'Off' },
            ]}
          />
          <RowSwitch
            label="Allow story sharing"
            id="story_sharing"
            checked={toBool(settings.allow_story_sharing)}
            onCheckedChange={(val) => updateSettings({ allow_story_sharing: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Safety & Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety & Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSelect
            label="Sensitive content filter"
            value={toValue(settings.sensitive_content_filter)}
            onValueChange={(val) => updateSettings({ sensitive_content_filter: val })}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'standard', label: 'Standard' },
              { value: 'strict', label: 'Strict' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Data & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Login alerts for new devices"
            description="Get notified when your account is accessed from a new device"
            id="login_alerts"
            checked={toBool(settings.login_alerts_new_device)}
            onCheckedChange={(val) => updateSettings({ login_alerts_new_device: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {/* Ads & Personalization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Ads & Personalization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <RowSwitch
            label="Personalized ads based on activity"
            id="ads_activity"
            checked={toBool(settings.personalized_ads_activity)}
            onCheckedChange={(val) => updateSettings({ personalized_ads_activity: fromBool(val) })}
          />
          <RowSwitch
            label="Ads based on partners' data"
            id="ads_partners"
            checked={toBool(settings.ads_based_on_partners_data)}
            onCheckedChange={(val) => updateSettings({ ads_based_on_partners_data: fromBool(val) })}
          />
        </CardContent>
      </Card>

      {saving && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-lg">
          Saving...
        </div>
      )}
    </div>
  );
}
