export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_type: string
          actor_id: string
          created_at: string
          id: string
          reason: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          actor_id: string
          created_at?: string
          id?: string
          reason?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string
          created_at?: string
          id?: string
          reason?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          metadata: Json | null
          notification_type: string | null
          read: boolean
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          notification_type?: string | null
          read?: boolean
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          notification_type?: string | null
          read?: boolean
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          value?: Json | null
        }
        Relationships: []
      }
      brute_force_alerts: {
        Row: {
          alert_type: string
          attempt_count: number | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          attempt_count?: number | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          attempt_count?: number | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brute_force_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_estimates: {
        Row: {
          actual_cost: number | null
          created_at: string
          estimated_cost: number
          id: string
          metadata: Json | null
          period_end: string
          period_start: string
          service_name: string
          total_usage: number
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          created_at?: string
          estimated_cost: number
          id?: string
          metadata?: Json | null
          period_end: string
          period_start: string
          service_name: string
          total_usage: number
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          created_at?: string
          estimated_cost?: number
          id?: string
          metadata?: Json | null
          period_end?: string
          period_start?: string
          service_name?: string
          total_usage?: number
          updated_at?: string
        }
        Relationships: []
      }
      live_streams: {
        Row: {
          category: string | null
          created_at: string
          ended_at: string | null
          host: string
          id: string
          is_live: boolean
          started_at: string
          thumbnail_url: string
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          ended_at?: string | null
          host: string
          id?: string
          is_live?: boolean
          started_at?: string
          thumbnail_url: string
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          ended_at?: string | null
          host?: string
          id?: string
          is_live?: boolean
          started_at?: string
          thumbnail_url?: string
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          channel_email: boolean | null
          channel_in_app: boolean | null
          channel_push: boolean | null
          channel_sms: boolean | null
          created_at: string | null
          digest_frequency: string | null
          id: string
          notification_language: string | null
          notify_2fa_changed: boolean | null
          notify_birthday_reminder: boolean | null
          notify_branded_content: boolean | null
          notify_comment_mention: boolean | null
          notify_comment_reaction: boolean | null
          notify_comment_reply: boolean | null
          notify_contact_changed: boolean | null
          notify_dispute: boolean | null
          notify_earnings_summary: boolean | null
          notify_event_comment: boolean | null
          notify_event_invite: boolean | null
          notify_event_reminder: boolean | null
          notify_event_role_change: boolean | null
          notify_event_rsvp_update: boolean | null
          notify_follow_request: boolean | null
          notify_friend_accepted: boolean | null
          notify_friend_request: boolean | null
          notify_group_comment: boolean | null
          notify_group_event: boolean | null
          notify_group_invite: boolean | null
          notify_group_join_request: boolean | null
          notify_group_post_approval: boolean | null
          notify_group_post_status: boolean | null
          notify_group_request_approved: boolean | null
          notify_item_sold: boolean | null
          notify_live_comment: boolean | null
          notify_live_started: boolean | null
          notify_marketplace_message: boolean | null
          notify_marketplace_offer: boolean | null
          notify_memory_highlight: boolean | null
          notify_message_reaction: boolean | null
          notify_message_request: boolean | null
          notify_missed_call: boolean | null
          notify_monetization_eligibility: boolean | null
          notify_new_follower: boolean | null
          notify_new_login: boolean | null
          notify_new_message: boolean | null
          notify_page_comment: boolean | null
          notify_page_follower: boolean | null
          notify_page_mention: boolean | null
          notify_page_message: boolean | null
          notify_page_review: boolean | null
          notify_page_role_changed: boolean | null
          notify_page_share: boolean | null
          notify_password_changed: boolean | null
          notify_payment_received: boolean | null
          notify_payout: boolean | null
          notify_photo_tag: boolean | null
          notify_policy_updates: boolean | null
          notify_policy_violation: boolean | null
          notify_poll_vote: boolean | null
          notify_post_moderation: boolean | null
          notify_post_reaction: boolean | null
          notify_post_reported: boolean | null
          notify_post_saved: boolean | null
          notify_price_drop: boolean | null
          notify_privacy_changed: boolean | null
          notify_product_updates: boolean | null
          notify_profile_reaction: boolean | null
          notify_profile_visit: boolean | null
          notify_qa_question: boolean | null
          notify_quote_repost: boolean | null
          notify_reel_comment: boolean | null
          notify_reel_remix: boolean | null
          notify_reply_to_reply: boolean | null
          notify_service_status: boolean | null
          notify_shipping_update: boolean | null
          notify_story_mention: boolean | null
          notify_story_reply: boolean | null
          notify_story_tag: boolean | null
          notify_story_view_milestone: boolean | null
          notify_suggested_friends: boolean | null
          notify_surveys: boolean | null
          notify_suspicious_activity: boolean | null
          notify_tag_removed: boolean | null
          notify_tag_review: boolean | null
          notify_timeline_post: boolean | null
          notify_unfollow: boolean | null
          notify_unread_reminder: boolean | null
          priority_level: string | null
          quiet_hours_enabled: boolean | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_email?: boolean | null
          channel_in_app?: boolean | null
          channel_push?: boolean | null
          channel_sms?: boolean | null
          created_at?: string | null
          digest_frequency?: string | null
          id?: string
          notification_language?: string | null
          notify_2fa_changed?: boolean | null
          notify_birthday_reminder?: boolean | null
          notify_branded_content?: boolean | null
          notify_comment_mention?: boolean | null
          notify_comment_reaction?: boolean | null
          notify_comment_reply?: boolean | null
          notify_contact_changed?: boolean | null
          notify_dispute?: boolean | null
          notify_earnings_summary?: boolean | null
          notify_event_comment?: boolean | null
          notify_event_invite?: boolean | null
          notify_event_reminder?: boolean | null
          notify_event_role_change?: boolean | null
          notify_event_rsvp_update?: boolean | null
          notify_follow_request?: boolean | null
          notify_friend_accepted?: boolean | null
          notify_friend_request?: boolean | null
          notify_group_comment?: boolean | null
          notify_group_event?: boolean | null
          notify_group_invite?: boolean | null
          notify_group_join_request?: boolean | null
          notify_group_post_approval?: boolean | null
          notify_group_post_status?: boolean | null
          notify_group_request_approved?: boolean | null
          notify_item_sold?: boolean | null
          notify_live_comment?: boolean | null
          notify_live_started?: boolean | null
          notify_marketplace_message?: boolean | null
          notify_marketplace_offer?: boolean | null
          notify_memory_highlight?: boolean | null
          notify_message_reaction?: boolean | null
          notify_message_request?: boolean | null
          notify_missed_call?: boolean | null
          notify_monetization_eligibility?: boolean | null
          notify_new_follower?: boolean | null
          notify_new_login?: boolean | null
          notify_new_message?: boolean | null
          notify_page_comment?: boolean | null
          notify_page_follower?: boolean | null
          notify_page_mention?: boolean | null
          notify_page_message?: boolean | null
          notify_page_review?: boolean | null
          notify_page_role_changed?: boolean | null
          notify_page_share?: boolean | null
          notify_password_changed?: boolean | null
          notify_payment_received?: boolean | null
          notify_payout?: boolean | null
          notify_photo_tag?: boolean | null
          notify_policy_updates?: boolean | null
          notify_policy_violation?: boolean | null
          notify_poll_vote?: boolean | null
          notify_post_moderation?: boolean | null
          notify_post_reaction?: boolean | null
          notify_post_reported?: boolean | null
          notify_post_saved?: boolean | null
          notify_price_drop?: boolean | null
          notify_privacy_changed?: boolean | null
          notify_product_updates?: boolean | null
          notify_profile_reaction?: boolean | null
          notify_profile_visit?: boolean | null
          notify_qa_question?: boolean | null
          notify_quote_repost?: boolean | null
          notify_reel_comment?: boolean | null
          notify_reel_remix?: boolean | null
          notify_reply_to_reply?: boolean | null
          notify_service_status?: boolean | null
          notify_shipping_update?: boolean | null
          notify_story_mention?: boolean | null
          notify_story_reply?: boolean | null
          notify_story_tag?: boolean | null
          notify_story_view_milestone?: boolean | null
          notify_suggested_friends?: boolean | null
          notify_surveys?: boolean | null
          notify_suspicious_activity?: boolean | null
          notify_tag_removed?: boolean | null
          notify_tag_review?: boolean | null
          notify_timeline_post?: boolean | null
          notify_unfollow?: boolean | null
          notify_unread_reminder?: boolean | null
          priority_level?: string | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_email?: boolean | null
          channel_in_app?: boolean | null
          channel_push?: boolean | null
          channel_sms?: boolean | null
          created_at?: string | null
          digest_frequency?: string | null
          id?: string
          notification_language?: string | null
          notify_2fa_changed?: boolean | null
          notify_birthday_reminder?: boolean | null
          notify_branded_content?: boolean | null
          notify_comment_mention?: boolean | null
          notify_comment_reaction?: boolean | null
          notify_comment_reply?: boolean | null
          notify_contact_changed?: boolean | null
          notify_dispute?: boolean | null
          notify_earnings_summary?: boolean | null
          notify_event_comment?: boolean | null
          notify_event_invite?: boolean | null
          notify_event_reminder?: boolean | null
          notify_event_role_change?: boolean | null
          notify_event_rsvp_update?: boolean | null
          notify_follow_request?: boolean | null
          notify_friend_accepted?: boolean | null
          notify_friend_request?: boolean | null
          notify_group_comment?: boolean | null
          notify_group_event?: boolean | null
          notify_group_invite?: boolean | null
          notify_group_join_request?: boolean | null
          notify_group_post_approval?: boolean | null
          notify_group_post_status?: boolean | null
          notify_group_request_approved?: boolean | null
          notify_item_sold?: boolean | null
          notify_live_comment?: boolean | null
          notify_live_started?: boolean | null
          notify_marketplace_message?: boolean | null
          notify_marketplace_offer?: boolean | null
          notify_memory_highlight?: boolean | null
          notify_message_reaction?: boolean | null
          notify_message_request?: boolean | null
          notify_missed_call?: boolean | null
          notify_monetization_eligibility?: boolean | null
          notify_new_follower?: boolean | null
          notify_new_login?: boolean | null
          notify_new_message?: boolean | null
          notify_page_comment?: boolean | null
          notify_page_follower?: boolean | null
          notify_page_mention?: boolean | null
          notify_page_message?: boolean | null
          notify_page_review?: boolean | null
          notify_page_role_changed?: boolean | null
          notify_page_share?: boolean | null
          notify_password_changed?: boolean | null
          notify_payment_received?: boolean | null
          notify_payout?: boolean | null
          notify_photo_tag?: boolean | null
          notify_policy_updates?: boolean | null
          notify_policy_violation?: boolean | null
          notify_poll_vote?: boolean | null
          notify_post_moderation?: boolean | null
          notify_post_reaction?: boolean | null
          notify_post_reported?: boolean | null
          notify_post_saved?: boolean | null
          notify_price_drop?: boolean | null
          notify_privacy_changed?: boolean | null
          notify_product_updates?: boolean | null
          notify_profile_reaction?: boolean | null
          notify_profile_visit?: boolean | null
          notify_qa_question?: boolean | null
          notify_quote_repost?: boolean | null
          notify_reel_comment?: boolean | null
          notify_reel_remix?: boolean | null
          notify_reply_to_reply?: boolean | null
          notify_service_status?: boolean | null
          notify_shipping_update?: boolean | null
          notify_story_mention?: boolean | null
          notify_story_reply?: boolean | null
          notify_story_tag?: boolean | null
          notify_story_view_milestone?: boolean | null
          notify_suggested_friends?: boolean | null
          notify_surveys?: boolean | null
          notify_suspicious_activity?: boolean | null
          notify_tag_removed?: boolean | null
          notify_tag_review?: boolean | null
          notify_timeline_post?: boolean | null
          notify_unfollow?: boolean | null
          notify_unread_reminder?: boolean | null
          priority_level?: string | null
          quiet_hours_enabled?: boolean | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string | null
          id: string
          linked_module: string | null
          linked_scan_id: string | null
          metadata: Json | null
          priority: string
          source: string | null
          status: string
          tags: string[] | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          linked_module?: string | null
          linked_scan_id?: string | null
          metadata?: Json | null
          priority?: string
          source?: string | null
          status?: string
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          linked_module?: string | null
          linked_scan_id?: string | null
          metadata?: Json | null
          priority?: string
          source?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      optimization_suggestions: {
        Row: {
          affected_service: string | null
          applied_at: string | null
          auto_applicable: boolean | null
          category: string
          created_at: string | null
          description: string
          dismissed_at: string | null
          dismissed_reason: string | null
          id: string
          impact_score: number
          metadata: Json | null
          potential_improvement: string | null
          potential_savings: number | null
          recommendation: string
          severity: string
          status: string | null
          suggestion_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          affected_service?: string | null
          applied_at?: string | null
          auto_applicable?: boolean | null
          category: string
          created_at?: string | null
          description: string
          dismissed_at?: string | null
          dismissed_reason?: string | null
          id?: string
          impact_score: number
          metadata?: Json | null
          potential_improvement?: string | null
          potential_savings?: number | null
          recommendation: string
          severity: string
          status?: string | null
          suggestion_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          affected_service?: string | null
          applied_at?: string | null
          auto_applicable?: boolean | null
          category?: string
          created_at?: string | null
          description?: string
          dismissed_at?: string | null
          dismissed_reason?: string | null
          id?: string
          impact_score?: number
          metadata?: Json | null
          potential_improvement?: string | null
          potential_savings?: number | null
          recommendation?: string
          severity?: string
          status?: string | null
          suggestion_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      personal_introduction: {
        Row: {
          city: string | null
          created_at: string
          favorite_quote: string | null
          hobbies: string[] | null
          id: string
          languages: string[] | null
          profession: string | null
          school: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          favorite_quote?: string | null
          hobbies?: string[] | null
          id?: string
          languages?: string[] | null
          profession?: string | null
          school?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          favorite_quote?: string | null
          hobbies?: string[] | null
          id?: string
          languages?: string[] | null
          profession?: string | null
          school?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_shares: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_shares_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          comments_count: number | null
          content: Json
          content_images: string[] | null
          content_text: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          is_anonymous: boolean | null
          is_deleted: boolean | null
          is_sponsored: boolean | null
          likes_count: number | null
          post_type: string
          shares_count: number | null
          updated_at: string | null
          user_id: string
          user_image: string | null
          user_name: string | null
          user_verified: boolean | null
          visibility: string
        }
        Insert: {
          comments_count?: number | null
          content?: Json
          content_images?: string[] | null
          content_text?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_deleted?: boolean | null
          is_sponsored?: boolean | null
          likes_count?: number | null
          post_type?: string
          shares_count?: number | null
          updated_at?: string | null
          user_id: string
          user_image?: string | null
          user_name?: string | null
          user_verified?: boolean | null
          visibility?: string
        }
        Update: {
          comments_count?: number | null
          content?: Json
          content_images?: string[] | null
          content_text?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_deleted?: boolean | null
          is_sponsored?: boolean | null
          likes_count?: number | null
          post_type?: string
          shares_count?: number | null
          updated_at?: string | null
          user_id?: string
          user_image?: string | null
          user_name?: string | null
          user_verified?: boolean | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_presentations: {
        Row: {
          accent_color: string | null
          avatar_url: string | null
          created_at: string | null
          cv_url: string | null
          edit_mode: boolean
          email: string | null
          entry: string | null
          hire_button_email: string | null
          hire_button_enabled: boolean | null
          hire_button_text: string | null
          hire_button_url: string | null
          id: string
          layout: Json | null
          name: string | null
          nav_labels: Json | null
          phone: string | null
          quick: string | null
          role: string | null
          sections: Json | null
          seo: Json | null
          socials: Json | null
          styles: Json | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          accent_color?: string | null
          avatar_url?: string | null
          created_at?: string | null
          cv_url?: string | null
          edit_mode?: boolean
          email?: string | null
          entry?: string | null
          hire_button_email?: string | null
          hire_button_enabled?: boolean | null
          hire_button_text?: string | null
          hire_button_url?: string | null
          id?: string
          layout?: Json | null
          name?: string | null
          nav_labels?: Json | null
          phone?: string | null
          quick?: string | null
          role?: string | null
          sections?: Json | null
          seo?: Json | null
          socials?: Json | null
          styles?: Json | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          accent_color?: string | null
          avatar_url?: string | null
          created_at?: string | null
          cv_url?: string | null
          edit_mode?: boolean
          email?: string | null
          entry?: string | null
          hire_button_email?: string | null
          hire_button_enabled?: boolean | null
          hire_button_text?: string | null
          hire_button_url?: string | null
          id?: string
          layout?: Json | null
          name?: string | null
          nav_labels?: Json | null
          phone?: string | null
          quick?: string | null
          role?: string | null
          sections?: Json | null
          seo?: Json | null
          socials?: Json | null
          styles?: Json | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_presentations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_access_logs: {
        Row: {
          access_method: string
          accessed_at: string | null
          id: string
          viewed_profile_id: string
          viewer_id: string | null
        }
        Insert: {
          access_method: string
          accessed_at?: string | null
          id?: string
          viewed_profile_id: string
          viewer_id?: string | null
        }
        Update: {
          access_method?: string
          accessed_at?: string | null
          id?: string
          viewed_profile_id?: string
          viewer_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          about_me: string | null
          auth_user_id: string | null
          avatar_sizes: Json | null
          avatar_url: string | null
          bio: string | null
          city_location: string | null
          cover_gradient: string | null
          cover_position: string | null
          cover_sizes: Json | null
          cover_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          email_verified: boolean | null
          first_name: string | null
          gender: string | null
          id: string
          is_hidden: boolean | null
          last_device: string | null
          last_name: string | null
          last_redirect_at: string | null
          last_redirect_host: string | null
          location: string | null
          phone_number: string | null
          phone_verified: boolean | null
          photo_text_transform: Json | null
          photo_transform: Json | null
          prefers_desktop: boolean
          primary_role: string | null
          professional_button_color: string | null
          school: string | null
          school_completed: boolean | null
          show_cover_controls: boolean | null
          updated_at: string
          username: string | null
          website: string | null
          working_at: string | null
        }
        Insert: {
          about_me?: string | null
          auth_user_id?: string | null
          avatar_sizes?: Json | null
          avatar_url?: string | null
          bio?: string | null
          city_location?: string | null
          cover_gradient?: string | null
          cover_position?: string | null
          cover_sizes?: Json | null
          cover_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          gender?: string | null
          id: string
          is_hidden?: boolean | null
          last_device?: string | null
          last_name?: string | null
          last_redirect_at?: string | null
          last_redirect_host?: string | null
          location?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          photo_text_transform?: Json | null
          photo_transform?: Json | null
          prefers_desktop?: boolean
          primary_role?: string | null
          professional_button_color?: string | null
          school?: string | null
          school_completed?: boolean | null
          show_cover_controls?: boolean | null
          updated_at?: string
          username?: string | null
          website?: string | null
          working_at?: string | null
        }
        Update: {
          about_me?: string | null
          auth_user_id?: string | null
          avatar_sizes?: Json | null
          avatar_url?: string | null
          bio?: string | null
          city_location?: string | null
          cover_gradient?: string | null
          cover_position?: string | null
          cover_sizes?: Json | null
          cover_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          email_verified?: boolean | null
          first_name?: string | null
          gender?: string | null
          id?: string
          is_hidden?: boolean | null
          last_device?: string | null
          last_name?: string | null
          last_redirect_at?: string | null
          last_redirect_host?: string | null
          location?: string | null
          phone_number?: string | null
          phone_verified?: boolean | null
          photo_text_transform?: Json | null
          photo_transform?: Json | null
          prefers_desktop?: boolean
          primary_role?: string | null
          professional_button_color?: string | null
          school?: string | null
          school_completed?: boolean | null
          show_cover_controls?: boolean | null
          updated_at?: string
          username?: string | null
          website?: string | null
          working_at?: string | null
        }
        Relationships: []
      }
      resource_usage: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          service_name: string
          updated_at: string
          usage_amount: number
          usage_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          service_name: string
          updated_at?: string
          usage_amount: number
          usage_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          service_name?: string
          updated_at?: string
          usage_amount?: number
          usage_date?: string
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_description: string | null
          event_type: string
          id: string
          metadata: Json | null
          risk_level: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          risk_level?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          risk_level?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          cost_per_unit: number
          created_at: string
          free_tier_limit: number | null
          id: string
          service_name: string
          unit_type: string
          updated_at: string
        }
        Insert: {
          cost_per_unit: number
          created_at?: string
          free_tier_limit?: number | null
          id?: string
          service_name: string
          unit_type: string
          updated_at?: string
        }
        Update: {
          cost_per_unit?: number
          created_at?: string
          free_tier_limit?: number | null
          id?: string
          service_name?: string
          unit_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_activity: {
        Row: {
          created_at: string | null
          event_source: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_source?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_source?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_revocations: {
        Row: {
          created_at: string
          device_stable_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_stable_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_stable_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      system_health_metrics: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          metric_value: Json | null
          recorded_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          metric_value?: Json | null
          recorded_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          metric_value?: Json | null
          recorded_at?: string
        }
        Relationships: []
      }
      system_issues: {
        Row: {
          created_at: string
          id: string
          issue_description: string | null
          issue_type: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          issue_description?: string | null
          issue_type: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          issue_description?: string | null
          issue_type?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          status?: string | null
        }
        Relationships: []
      }
      upload_configuration: {
        Row: {
          configuration_data: Json
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          configuration_data?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          configuration_data?: Json
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      upload_configuration_status: {
        Row: {
          created_at: string
          error_details: Json | null
          id: string
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          id?: string
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      upload_logs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          id: string
          metadata: Json | null
          post_id: string | null
          progress: number | null
          started_at: string | null
          upload_status: string
          upload_url: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          post_id?: string | null
          progress?: number | null
          started_at?: string | null
          upload_status?: string
          upload_url?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          metadata?: Json | null
          post_id?: string | null
          progress?: number | null
          started_at?: string | null
          upload_status?: string
          upload_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upload_logs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          created_at: string
          denied_at: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          granted_at: string | null
          id: string
          last_requested_at: string | null
          metadata: Json | null
          permission_type: Database["public"]["Enums"]["permission_type"]
          status: Database["public"]["Enums"]["permission_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          denied_at?: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          granted_at?: string | null
          id?: string
          last_requested_at?: string | null
          metadata?: Json | null
          permission_type: Database["public"]["Enums"]["permission_type"]
          status?: Database["public"]["Enums"]["permission_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          denied_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"]
          granted_at?: string | null
          id?: string
          last_requested_at?: string | null
          metadata?: Json | null
          permission_type?: Database["public"]["Enums"]["permission_type"]
          status?: Database["public"]["Enums"]["permission_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_photos: {
        Row: {
          content_type: string | null
          created_at: string
          file_size: number | null
          id: string
          is_current: boolean
          original_filename: string | null
          photo_key: string
          photo_type: string
          photo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          original_filename?: string | null
          photo_key: string
          photo_type: string
          photo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_size?: number | null
          id?: string
          is_current?: boolean
          original_filename?: string | null
          photo_key?: string
          photo_type?: string
          photo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          ads_based_on_partners_data: boolean | null
          allow_find_by_email: boolean | null
          allow_find_by_phone: boolean | null
          allow_read_receipts: boolean | null
          allow_story_replies: string | null
          allow_story_sharing: boolean | null
          approve_new_followers: boolean | null
          auto_approve_follow_requests: boolean | null
          birthday_detail: string | null
          created_at: string
          email_visibility: string | null
          hidden_words: Json | null
          id: string
          location_visibility: string | null
          login_alerts_new_device: boolean | null
          message_request_filter: string | null
          muted_accounts: Json | null
          personalize_recommendations: boolean | null
          personalized_ads_activity: boolean | null
          phone_visibility: string | null
          privacy_allow_search_engines_to_index: string | null
          privacy_confirm_request_when_someone_follows_you: string | null
          privacy_share_my_location_with_public: string | null
          privacy_show_my_activities: string | null
          privacy_status: string | null
          privacy_who_can_follow_me: string | null
          privacy_who_can_message_me: string | null
          privacy_who_can_post_on_my_timeline: string | null
          privacy_who_can_see_my_birthday: string | null
          privacy_who_can_see_my_friends: string | null
          restricted_list: Json | null
          review_tagged_posts: boolean | null
          review_tags_before_appear: boolean | null
          sensitive_content_filter: string | null
          show_active_status: boolean | null
          show_in_people_you_may_know: boolean | null
          show_typing_indicators: boolean | null
          updated_at: string
          user_id: string
          who_can_comment_on_posts: string | null
          who_can_mention_me: string | null
          who_can_send_friend_requests: string | null
          who_can_share_posts: string | null
          who_can_tag_me: string | null
          who_can_view_stories: string | null
          work_education_visibility: string | null
        }
        Insert: {
          ads_based_on_partners_data?: boolean | null
          allow_find_by_email?: boolean | null
          allow_find_by_phone?: boolean | null
          allow_read_receipts?: boolean | null
          allow_story_replies?: string | null
          allow_story_sharing?: boolean | null
          approve_new_followers?: boolean | null
          auto_approve_follow_requests?: boolean | null
          birthday_detail?: string | null
          created_at?: string
          email_visibility?: string | null
          hidden_words?: Json | null
          id?: string
          location_visibility?: string | null
          login_alerts_new_device?: boolean | null
          message_request_filter?: string | null
          muted_accounts?: Json | null
          personalize_recommendations?: boolean | null
          personalized_ads_activity?: boolean | null
          phone_visibility?: string | null
          privacy_allow_search_engines_to_index?: string | null
          privacy_confirm_request_when_someone_follows_you?: string | null
          privacy_share_my_location_with_public?: string | null
          privacy_show_my_activities?: string | null
          privacy_status?: string | null
          privacy_who_can_follow_me?: string | null
          privacy_who_can_message_me?: string | null
          privacy_who_can_post_on_my_timeline?: string | null
          privacy_who_can_see_my_birthday?: string | null
          privacy_who_can_see_my_friends?: string | null
          restricted_list?: Json | null
          review_tagged_posts?: boolean | null
          review_tags_before_appear?: boolean | null
          sensitive_content_filter?: string | null
          show_active_status?: boolean | null
          show_in_people_you_may_know?: boolean | null
          show_typing_indicators?: boolean | null
          updated_at?: string
          user_id: string
          who_can_comment_on_posts?: string | null
          who_can_mention_me?: string | null
          who_can_send_friend_requests?: string | null
          who_can_share_posts?: string | null
          who_can_tag_me?: string | null
          who_can_view_stories?: string | null
          work_education_visibility?: string | null
        }
        Update: {
          ads_based_on_partners_data?: boolean | null
          allow_find_by_email?: boolean | null
          allow_find_by_phone?: boolean | null
          allow_read_receipts?: boolean | null
          allow_story_replies?: string | null
          allow_story_sharing?: boolean | null
          approve_new_followers?: boolean | null
          auto_approve_follow_requests?: boolean | null
          birthday_detail?: string | null
          created_at?: string
          email_visibility?: string | null
          hidden_words?: Json | null
          id?: string
          location_visibility?: string | null
          login_alerts_new_device?: boolean | null
          message_request_filter?: string | null
          muted_accounts?: Json | null
          personalize_recommendations?: boolean | null
          personalized_ads_activity?: boolean | null
          phone_visibility?: string | null
          privacy_allow_search_engines_to_index?: string | null
          privacy_confirm_request_when_someone_follows_you?: string | null
          privacy_share_my_location_with_public?: string | null
          privacy_show_my_activities?: string | null
          privacy_status?: string | null
          privacy_who_can_follow_me?: string | null
          privacy_who_can_message_me?: string | null
          privacy_who_can_post_on_my_timeline?: string | null
          privacy_who_can_see_my_birthday?: string | null
          privacy_who_can_see_my_friends?: string | null
          restricted_list?: Json | null
          review_tagged_posts?: boolean | null
          review_tags_before_appear?: boolean | null
          sensitive_content_filter?: string | null
          show_active_status?: boolean | null
          show_in_people_you_may_know?: boolean | null
          show_typing_indicators?: boolean | null
          updated_at?: string
          user_id?: string
          who_can_comment_on_posts?: string | null
          who_can_mention_me?: string | null
          who_can_send_friend_requests?: string | null
          who_can_share_posts?: string | null
          who_can_tag_me?: string | null
          who_can_view_stories?: string | null
          work_education_visibility?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          active_tabs_count: number
          browser_name: string | null
          browser_version: string | null
          city: string | null
          country: string | null
          country_code: string | null
          created_at: string
          device_id: string
          device_stable_id: string
          device_type: string
          id: string
          is_current_device: boolean
          is_trusted: boolean
          latitude: number | null
          logout_reason: string | null
          longitude: number | null
          operating_system: string | null
          platform: string | null
          region: string | null
          screen_resolution: string | null
          session_id: string
          updated_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          active_tabs_count?: number
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          device_id: string
          device_stable_id: string
          device_type: string
          id?: string
          is_current_device?: boolean
          is_trusted?: boolean
          latitude?: number | null
          logout_reason?: string | null
          longitude?: number | null
          operating_system?: string | null
          platform?: string | null
          region?: string | null
          screen_resolution?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          active_tabs_count?: number
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string
          device_id?: string
          device_stable_id?: string
          device_type?: string
          id?: string
          is_current_device?: boolean
          is_trusted?: boolean
          latitude?: number | null
          logout_reason?: string | null
          longitude?: number | null
          operating_system?: string | null
          platform?: string | null
          region?: string | null
          screen_resolution?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_sessions_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_get_live_operation_metrics: {
        Args: { p_window_minutes?: number }
        Returns: Json
      }
      bump_tabs_count: {
        Args: { p_delta: number; p_device?: Json; p_device_stable_id: string }
        Returns: number
      }
      calculate_current_month_costs: {
        Args: never
        Returns: {
          billable_usage: number
          estimated_cost: number
          free_tier_used: number
          service_name: string
          total_usage: number
        }[]
      }
      calculate_trust_score: { Args: { p_session_id: string }; Returns: number }
      can_view_profile: { Args: { profile_id: string }; Returns: boolean }
      can_view_sensitive_profile_data: {
        Args: { profile_id: string }
        Returns: boolean
      }
      create_post_safe: {
        Args: {
          content_param: Json
          is_sponsored_param?: boolean
          post_type_param?: string
          visibility_param?: string
        }
        Returns: string
      }
      current_user_is_admin: { Args: never; Returns: boolean }
      current_user_is_super_admin: { Args: never; Returns: boolean }
      delete_expired_sessions: { Args: never; Returns: number }
      deny_permission: {
        Args: {
          _device_type: Database["public"]["Enums"]["device_type"]
          _metadata?: Json
          _permission_type: Database["public"]["Enums"]["permission_type"]
        }
        Returns: string
      }
      get_current_user_role: { Args: never; Returns: string }
      get_full_profile: {
        Args: { profile_id: string }
        Returns: {
          avatar_url: string
          bio: string
          cover_url: string
          created_at: string
          date_of_birth: string
          email: string
          first_name: string
          gender: string
          id: string
          is_hidden: boolean
          last_name: string
          phone_number: string
          primary_role: string
          updated_at: string
          username: string
        }[]
      }
      get_profile_field_access_info: { Args: never; Returns: Json }
      get_public_profiles: {
        Args: { limit_count?: number; offset_count?: number }
        Returns: {
          avatar_url: string
          bio: string
          cover_url: string
          created_at: string
          gender: string
          id: string
          is_hidden: boolean
          updated_at: string
          username: string
        }[]
      }
      get_public_website_settings: { Args: never; Returns: Json }
      get_safe_profile: {
        Args: { profile_id: string }
        Returns: {
          avatar_url: string
          bio: string
          cover_url: string
          created_at: string
          gender: string
          id: string
          is_hidden: boolean
          updated_at: string
          username: string
        }[]
      }
      get_upload_analytics: { Args: { p_time_window?: string }; Returns: Json }
      get_upload_configuration: { Args: never; Returns: Json }
      get_user_primary_role: {
        Args: { target_user_id: string }
        Returns: string
      }
      get_user_roles_admin: {
        Args: { target_user_id: string }
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          role: string
          user_id: string
        }[]
      }
      grant_permission: {
        Args: {
          _device_type: Database["public"]["Enums"]["device_type"]
          _metadata?: Json
          _permission_type: Database["public"]["Enums"]["permission_type"]
        }
        Returns: string
      }
      has_active_session: { Args: { p_user_id: string }; Returns: boolean }
      has_permission: {
        Args: {
          _device_type?: Database["public"]["Enums"]["device_type"]
          _permission_type: Database["public"]["Enums"]["permission_type"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hash_ip_address: { Args: { ip_text: string }; Returns: string }
      is_platform_owner: { Args: { _user_id: string }; Returns: boolean }
      log_device_security_event: {
        Args: {
          p_event_description: string
          p_event_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
      log_session_activity: {
        Args: {
          p_event_source?: string
          p_event_type: string
          p_metadata?: Json
        }
        Returns: string
      }
      request_permission: {
        Args: {
          _device_type: Database["public"]["Enums"]["device_type"]
          _metadata?: Json
          _permission_type: Database["public"]["Enums"]["permission_type"]
        }
        Returns: string
      }
      restore_post: { Args: { post_id_param: string }; Returns: undefined }
      revoke_expired_sessions: { Args: never; Returns: undefined }
      soft_delete_post: { Args: { post_id_param: string }; Returns: undefined }
      sync_phone_verification_status: {
        Args: {
          is_verified: boolean
          phone_number_param: string
          user_uuid: string
        }
        Returns: undefined
      }
      sync_user_verification_status: { Args: never; Returns: undefined }
      update_upload_configuration: {
        Args: { config_data: Json }
        Returns: Json
      }
      update_upload_configuration_status: {
        Args: {
          p_error_details?: Json
          p_metadata?: Json
          p_response_time_ms?: number
          p_service_name: string
          p_status: string
        }
        Returns: undefined
      }
      validate_admin_access: {
        Args: { required_action?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "super_admin"
        | "platform_owner_root"
        | "developer"
        | "support"
      device_type:
        | "mobile_ios"
        | "mobile_android"
        | "mobile_web"
        | "desktop"
        | "laptop"
        | "tablet"
      permission_status: "granted" | "denied" | "pending" | "not_requested"
      permission_type:
        | "camera"
        | "photo_library"
        | "location"
        | "notifications"
        | "microphone"
        | "storage"
        | "contacts"
        | "calendar"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "super_admin",
        "platform_owner_root",
        "developer",
        "support",
      ],
      device_type: [
        "mobile_ios",
        "mobile_android",
        "mobile_web",
        "desktop",
        "laptop",
        "tablet",
      ],
      permission_status: ["granted", "denied", "pending", "not_requested"],
      permission_type: [
        "camera",
        "photo_library",
        "location",
        "notifications",
        "microphone",
        "storage",
        "contacts",
        "calendar",
      ],
    },
  },
} as const
