import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNotificationPreferences } from '@/hooks/use-notification-preferences';
import { Loader2, Bell, MessageSquare, Heart, Users, BookOpen, Calendar, Video, User, ShoppingCart, DollarSign, Shield, Settings as SettingsIcon } from 'lucide-react';

interface NotificationSettingsFormProps {
  userInfo?: any;
  setUserInfo?: any;
  onSave?: any;
  saving?: boolean;
}

const NotificationSettingsForm: React.FC<NotificationSettingsFormProps> = () => {
  const { preferences, loading, saving, savePreferences } = useNotificationPreferences();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key: string, value: boolean) => {
    // Instant local update for immediate UI feedback
    setLocalPrefs(prev => prev ? { ...prev, [key]: value } : null);
    // Save to database in background without blocking UI
    savePreferences({ [key]: value } as any);
  };

  const handleSelectChange = (key: string, value: string) => {
    // Instant local update for immediate UI feedback
    setLocalPrefs(prev => prev ? { ...prev, [key]: value } : null);
    // Save to database in background without blocking UI
    savePreferences({ [key]: value } as any);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!localPrefs) return null;

  const NotificationToggle = ({ 
    id, 
    label, 
    description 
  }: { 
    id: keyof typeof localPrefs; 
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={localPrefs[id] as boolean}
        onCheckedChange={(checked) => handleToggle(id, checked)}
      />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Messages & Chat */}
        <TabsContent value="messages" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Direct Messages & Chat
              </CardTitle>
              <CardDescription>Manage notifications for messages and calls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_new_message" label="New direct message" />
              <NotificationToggle id="notify_message_request" label="Message request received" />
              <NotificationToggle id="notify_message_reaction" label="Message reactions" />
              <NotificationToggle id="notify_unread_reminder" label="Unread message reminder" />
              <NotificationToggle id="notify_missed_call" label="Missed calls" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social */}
        <TabsContent value="social" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Posts, Comments & Reactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_comment_reply" label="Reply to my comment" />
              <NotificationToggle id="notify_reply_to_reply" label="Reply to my reply" />
              <NotificationToggle id="notify_post_reaction" label="Reactions to my post" />
              <NotificationToggle id="notify_comment_reaction" label="Reactions to my comment" />
              <NotificationToggle id="notify_post_saved" label="My post was saved/bookmarked" />
              <NotificationToggle id="notify_post_reported" label="My post was reported" />
              <NotificationToggle id="notify_post_moderation" label="Post moderation status" />
              <NotificationToggle id="notify_quote_repost" label="Quote/repost of my post" />
              <NotificationToggle id="notify_poll_vote" label="Poll votes on my post" />
              <NotificationToggle id="notify_qa_question" label="Q&A questions on my post" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mentions, Tags & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_comment_mention" label="Mention in a comment" />
              <NotificationToggle id="notify_photo_tag" label="Tagged in a photo/video" />
              <NotificationToggle id="notify_tag_review" label="Tag review/approval needed" />
              <NotificationToggle id="notify_tag_removed" label="Removed from a tag" />
              <NotificationToggle id="notify_story_mention" label="Mention in a story" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends & Follows
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_friend_request" label="New friend request" />
              <NotificationToggle id="notify_friend_accepted" label="Friend request accepted" />
              <NotificationToggle id="notify_follow_request" label="Follow request (private accounts)" />
              <NotificationToggle id="notify_new_follower" label="New follower" />
              <NotificationToggle id="notify_profile_visit" label="Someone visits my profile" />
              <NotificationToggle id="notify_unfollow" label="Unfollow notifications" />
              <NotificationToggle id="notify_suggested_friends" label="Suggested friends" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Timeline & Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_timeline_post" label="New post on my timeline" />
              <NotificationToggle id="notify_profile_reaction" label="Profile picture/cover reactions" />
              <NotificationToggle id="notify_birthday_reminder" label="Birthday reminders" />
              <NotificationToggle id="notify_memory_highlight" label="Memory highlights" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community */}
        <TabsContent value="community" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Pages (as owner/admin)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_page_follower" label="New page follower" />
              <NotificationToggle id="notify_page_review" label="New review/rating on page" />
              <NotificationToggle id="notify_page_comment" label="Comment on page post" />
              <NotificationToggle id="notify_page_message" label="Message to page" />
              <NotificationToggle id="notify_page_mention" label="Mention of page" />
              <NotificationToggle id="notify_page_role_changed" label="Page role changed" />
              <NotificationToggle id="notify_page_share" label="Page shares & recommendations" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Groups & Communities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_group_invite" label="Invite to group" />
              <NotificationToggle id="notify_group_join_request" label="Request to join my group" />
              <NotificationToggle id="notify_group_request_approved" label="My join request approved/declined" />
              <NotificationToggle id="notify_group_post_approval" label="Post awaiting approval (as mod)" />
              <NotificationToggle id="notify_group_post_status" label="Post approved/declined status" />
              <NotificationToggle id="notify_group_comment" label="New comments in group" />
              <NotificationToggle id="notify_group_event" label="New events/files/polls in group" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Events & Live
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_event_invite" label="Invited to an event" />
              <NotificationToggle id="notify_event_reminder" label="Event reminders" />
              <NotificationToggle id="notify_event_rsvp_update" label="RSVP updates" />
              <NotificationToggle id="notify_event_comment" label="Event comments" />
              <NotificationToggle id="notify_event_role_change" label="Host/Co-host role changes" />
              <NotificationToggle id="notify_live_started" label="Live stream started" />
              <NotificationToggle id="notify_live_comment" label="Live stream comments/mentions" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content */}
        <TabsContent value="content" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Stories, Reels & Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_story_view_milestone" label="Story view count milestone" />
              <NotificationToggle id="notify_story_reply" label="Story reply" />
              <NotificationToggle id="notify_story_tag" label="Story mention/tag" />
              <NotificationToggle id="notify_reel_comment" label="Reel comment" />
              <NotificationToggle id="notify_reel_remix" label="Reel remix/duet/audio use" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business */}
        <TabsContent value="business" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Marketplace & Commerce
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_marketplace_offer" label="Offer received on listing" />
              <NotificationToggle id="notify_marketplace_message" label="New message on listing" />
              <NotificationToggle id="notify_item_sold" label="Item sold / order placed" />
              <NotificationToggle id="notify_payment_received" label="Payment received / payout sent" />
              <NotificationToggle id="notify_shipping_update" label="Shipping updates" />
              <NotificationToggle id="notify_dispute" label="Dispute opened/closed" />
              <NotificationToggle id="notify_price_drop" label="Price drop alerts for saved items" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Monetization & Creator Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_monetization_eligibility" label="Eligibility/approval updates" />
              <NotificationToggle id="notify_earnings_summary" label="Earnings summary" />
              <NotificationToggle id="notify_payout" label="Payout initiated/failed" />
              <NotificationToggle id="notify_policy_violation" label="Policy violation/strike notices" />
              <NotificationToggle id="notify_branded_content" label="Branded content approvals" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_new_login" label="New login / new device sign-in" />
              <NotificationToggle id="notify_password_changed" label="Password changed" />
              <NotificationToggle id="notify_contact_changed" label="Email/phone changed" />
              <NotificationToggle id="notify_2fa_changed" label="2FA enabled/disabled" />
              <NotificationToggle id="notify_suspicious_activity" label="Suspicious activity" />
              <NotificationToggle id="notify_privacy_changed" label="Privacy setting changed" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System & Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="notify_service_status" label="Service status incidents" />
              <NotificationToggle id="notify_policy_updates" label="Terms/policy updates" />
              <NotificationToggle id="notify_product_updates" label="Product updates & tips" />
              <NotificationToggle id="notify_surveys" label="Surveys/feedback requests" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Notification Channels
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              <NotificationToggle id="channel_push" label="Push Notifications" description="Receive notifications on your device" />
              <NotificationToggle id="channel_email" label="Email Notifications" description="Receive notifications via email" />
              <NotificationToggle id="channel_sms" label="SMS Notifications" description="Receive notifications via text message" />
              <NotificationToggle id="channel_in_app" label="In-App Notifications" description="See notifications in the app" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Digest Frequency</Label>
                <Select 
                  value={localPrefs.digest_frequency} 
                  onValueChange={(value) => handleSelectChange('digest_frequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select 
                  value={localPrefs.priority_level} 
                  onValueChange={(value) => handleSelectChange('priority_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All notifications</SelectItem>
                    <SelectItem value="important">Only important</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-3">
                <NotificationToggle 
                  id="quiet_hours_enabled" 
                  label="Enable Quiet Hours" 
                  description="Pause notifications during specified hours"
                />
                
                {localPrefs.quiet_hours_enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div className="space-y-2">
                      <Label htmlFor="quiet_hours_start">Start Time</Label>
                      <Input
                        id="quiet_hours_start"
                        type="time"
                        value={localPrefs.quiet_hours_start}
                        onChange={(e) => handleSelectChange('quiet_hours_start', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiet_hours_end">End Time</Label>
                      <Input
                        id="quiet_hours_end"
                        type="time"
                        value={localPrefs.quiet_hours_end}
                        onChange={(e) => handleSelectChange('quiet_hours_end', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSettingsForm;
