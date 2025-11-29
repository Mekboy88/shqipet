import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface NotificationPreferences {
  // Direct Messages & Chat
  notify_new_message: boolean;
  notify_message_request: boolean;
  notify_message_reaction: boolean;
  notify_unread_reminder: boolean;
  notify_missed_call: boolean;
  
  // Posts, Comments & Reactions
  notify_comment_reply: boolean;
  notify_reply_to_reply: boolean;
  notify_post_reaction: boolean;
  notify_comment_reaction: boolean;
  notify_post_saved: boolean;
  notify_post_reported: boolean;
  notify_post_moderation: boolean;
  notify_quote_repost: boolean;
  notify_poll_vote: boolean;
  notify_qa_question: boolean;
  
  // Mentions, Tags & Media
  notify_comment_mention: boolean;
  notify_photo_tag: boolean;
  notify_tag_review: boolean;
  notify_tag_removed: boolean;
  notify_story_mention: boolean;
  
  // Friends & Follows  
  notify_friend_request: boolean;
  notify_friend_accepted: boolean;
  notify_follow_request: boolean;
  notify_new_follower: boolean;
  notify_unfollow: boolean;
  notify_suggested_friends: boolean;
  notify_profile_visit: boolean;
  
  // Pages
  notify_page_follower: boolean;
  notify_page_review: boolean;
  notify_page_comment: boolean;
  notify_page_message: boolean;
  notify_page_mention: boolean;
  notify_page_role_changed: boolean;
  notify_page_share: boolean;
  
  // Groups & Communities
  notify_group_invite: boolean;
  notify_group_join_request: boolean;
  notify_group_request_approved: boolean;
  notify_group_post_approval: boolean;
  notify_group_post_status: boolean;
  notify_group_comment: boolean;
  notify_group_event: boolean;
  
  // Events & Live
  notify_event_invite: boolean;
  notify_event_reminder: boolean;
  notify_event_rsvp_update: boolean;
  notify_event_comment: boolean;
  notify_event_role_change: boolean;
  notify_live_started: boolean;
  notify_live_comment: boolean;
  
  // Stories, Reels & Video
  notify_story_view_milestone: boolean;
  notify_story_reply: boolean;
  notify_story_tag: boolean;
  notify_reel_comment: boolean;
  notify_reel_remix: boolean;
  
  // Timeline & Profile
  notify_timeline_post: boolean;
  notify_profile_reaction: boolean;
  notify_birthday_reminder: boolean;
  notify_memory_highlight: boolean;
  
  // Marketplace & Commerce
  notify_marketplace_offer: boolean;
  notify_marketplace_message: boolean;
  notify_item_sold: boolean;
  notify_payment_received: boolean;
  notify_shipping_update: boolean;
  notify_dispute: boolean;
  notify_price_drop: boolean;
  
  // Monetization & Creator
  notify_monetization_eligibility: boolean;
  notify_earnings_summary: boolean;
  notify_payout: boolean;
  notify_policy_violation: boolean;
  notify_branded_content: boolean;
  
  // Security & Account
  notify_new_login: boolean;
  notify_password_changed: boolean;
  notify_contact_changed: boolean;
  notify_2fa_changed: boolean;
  notify_suspicious_activity: boolean;
  notify_privacy_changed: boolean;
  
  // System & Announcements
  notify_service_status: boolean;
  notify_policy_updates: boolean;
  notify_product_updates: boolean;
  notify_surveys: boolean;
  
  // Channel Preferences
  channel_push: boolean;
  channel_email: boolean;
  channel_sms: boolean;
  channel_in_app: boolean;
  
  // Behavior Settings
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  digest_frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
  priority_level: 'all' | 'important';
  notification_language: string;
}

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const setupRealtimeAndLoad = async () => {
      await loadPreferences();

      // Set up realtime subscription for instant cross-device sync
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('notification_preferences_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notification_preferences',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Notification preferences updated in realtime:', payload);
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              setPreferences(payload.new as any);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtimeAndLoad();
    
    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPreferences(data as any);
      } else {
        // No preferences found, create default ones
        const defaultPrefs: Partial<NotificationPreferences> = {
          notify_new_message: true,
          notify_message_request: true,
          notify_message_reaction: true,
          notify_unread_reminder: false,
          notify_missed_call: true,
          notify_comment_reply: true,
          notify_reply_to_reply: true,
          notify_post_reaction: true,
          notify_comment_reaction: true,
          notify_post_saved: false,
          notify_post_reported: true,
          notify_post_moderation: true,
          notify_quote_repost: true,
          notify_poll_vote: true,
          notify_qa_question: true,
          notify_comment_mention: true,
          notify_photo_tag: true,
          notify_tag_review: true,
          notify_tag_removed: false,
          notify_story_mention: true,
          notify_friend_request: true,
          notify_friend_accepted: true,
          notify_follow_request: true,
          notify_new_follower: true,
          notify_unfollow: false,
          notify_suggested_friends: false,
          notify_profile_visit: false,
          notify_page_follower: true,
          notify_page_review: true,
          notify_page_comment: true,
          notify_page_message: true,
          notify_page_mention: true,
          notify_page_role_changed: true,
          notify_page_share: true,
          notify_group_invite: true,
          notify_group_join_request: true,
          notify_group_request_approved: true,
          notify_group_post_approval: true,
          notify_group_post_status: true,
          notify_group_comment: true,
          notify_group_event: true,
          notify_event_invite: true,
          notify_event_reminder: true,
          notify_event_rsvp_update: true,
          notify_event_comment: true,
          notify_event_role_change: true,
          notify_live_started: true,
          notify_live_comment: false,
          notify_story_view_milestone: false,
          notify_story_reply: true,
          notify_story_tag: true,
          notify_reel_comment: true,
          notify_reel_remix: true,
          notify_timeline_post: true,
          notify_profile_reaction: true,
          notify_birthday_reminder: true,
          notify_memory_highlight: true,
          notify_marketplace_offer: true,
          notify_marketplace_message: true,
          notify_item_sold: true,
          notify_payment_received: true,
          notify_shipping_update: true,
          notify_dispute: true,
          notify_price_drop: false,
          notify_monetization_eligibility: true,
          notify_earnings_summary: true,
          notify_payout: true,
          notify_policy_violation: true,
          notify_branded_content: true,
          notify_new_login: true,
          notify_password_changed: true,
          notify_contact_changed: true,
          notify_2fa_changed: true,
          notify_suspicious_activity: true,
          notify_privacy_changed: true,
          notify_service_status: true,
          notify_policy_updates: true,
          notify_product_updates: false,
          notify_surveys: false,
          channel_push: true,
          channel_email: true,
          channel_sms: false,
          channel_in_app: true,
          quiet_hours_enabled: false,
          quiet_hours_start: '22:00',
          quiet_hours_end: '08:00',
          digest_frequency: 'instant',
          priority_level: 'all',
          notification_language: 'en'
        };

        // Insert default preferences
        const { error: insertError } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            ...defaultPrefs
          });

        if (insertError) {
          console.error('Error creating default preferences:', insertError);
        }

        setPreferences(defaultPrefs as any);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (updates: Partial<NotificationPreferences>) => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...updates
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated."
      });

      return true;
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification preferences.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    preferences,
    loading,
    saving,
    savePreferences,
    refreshPreferences: loadPreferences
  };
};
