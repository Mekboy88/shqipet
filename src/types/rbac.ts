export type RoleLevel = 
  | 'platform_owner_root'     // Level 100 - Ultimate authority
  | 'super_admin'             // Level 99 - All permissions except root keys
  | 'org_admin'               // Level 90 - Org settings, teams, billing
  | 'access_admin'            // Level 85 - Roles, SSO, MFA, secrets  
  | 'emergency_commander'     // Level 80 - Lockdown, kill-switch
  
  // Security, Trust & Compliance (70-79)
  | 'security_admin'          // Level 75
  | 'mfa_enforcement_admin'
  | 'audit_logs_admin'
  | 'privacy_dpo_admin'
  | 'compliance_admin'
  | 'fraud_abuse_admin'
  | 'trust_safety_lead'
  | 'threat_intel_admin'
  | 'legal_hold_admin'
  
  // Platform Ops / Reliability (60-69)
  | 'sre_admin'               // Level 65
  | 'observability_admin'
  | 'backup_restore_admin'
  | 'feature_flags_admin'
  | 'release_admin'
  | 'performance_admin'
  
  // Data, DB & Search (50-59)
  | 'database_admin'          // Level 55
  | 'data_steward_admin'
  | 'analytics_admin'
  | 'bi_admin'
  | 'search_index_admin'
  | 'reports_admin'
  
  // Developer & API (40-49)
  | 'api_admin'               // Level 45
  | 'integrations_admin'
  | 'dev_console_admin'
  | 'ai_model_admin'
  | 'webhook_monitor_admin'
  
  // Identity, Users & Community (30-39)
  | 'user_directory_admin'    // Level 35
  | 'verification_kyc_admin'
  | 'ban_appeals_admin'
  | 'notes_case_admin'
  | 'region_admin'
  
  // Content Moderation (20-29)
  | 'global_content_moderator' // Level 25
  | 'posts_moderator'
  | 'comments_moderator'
  | 'media_moderator'
  | 'video_reels_moderator'
  | 'live_stream_moderator'
  | 'profile_moderator'
  | 'groups_moderator'
  | 'pages_moderator'
  | 'events_moderator'
  | 'marketplace_moderator'
  | 'new_goods_moderator'
  | 'jobs_moderator'
  | 'dating_moderator'
  | 'forum_moderator'
  | 'movies_watch_moderator'
  | 'offers_deals_moderator'
  | 'education_learn_moderator'
  
  // Media & Storage (15-19)
  | 'storage_admin'           // Level 18
  | 'transcoding_ffmpeg_admin'
  | 'content_insurance_admin'
  | 'dmca_copyright_admin'
  
  // Commerce, Billing & Monetization (10-14)
  | 'billing_admin'           // Level 12
  | 'payments_admin'
  | 'tax_vat_admin'
  | 'pricing_plans_admin'
  | 'subscriptions_admin'
  | 'affiliate_admin'
  | 'ads_promotion_admin'
  
  // Marketplace & Vendors (8-9)
  | 'merchant_onboarding_admin' // Level 9
  | 'vendor_admin'
  | 'inventory_admin'
  | 'orders_admin'
  | 'disputes_admin'
  
  // Food Delivery, Restaurants, Hotels (6-7)
  | 'restaurant_admin'        // Level 7
  | 'courier_driver_ops_admin'
  | 'dispatch_admin'
  | 'hotel_admin'
  | 'booking_admin'
  | 'compliance_food_hotel_admin'
  
  // Notifications & Comms (5)
  | 'messaging_admin'         // Level 5
  | 'notifications_admin'
  | 'email_sms_admin'
  | 'admin_alerts_admin'
  
  // Growth, Localization & Content Ops (4)
  | 'localization_admin'      // Level 4
  | 'ab_testing_admin'
  | 'seo_admin'
  | 'content_ops_admin'
  | 'creator_academy_admin'
  | 'agency_workspace_admin'
  
  // Read-Only / Auditors (3)
  | 'read_only_global_admin'  // Level 3
  | 'finance_read_only'
  | 'security_read_only'
  | 'content_read_only'
  
  // Emergency / Scoped (2)
  | 'quarantine_admin'        // Level 2
  | 'spam_blast_admin'
  | 'regional_emergency_admin'
  | 'incident_scribe'
  
  // Resource-Scoped (1)
  | 'group_admin_scoped'      // Level 1
  | 'page_admin_scoped'
  | 'event_admin_scoped'
  | 'store_admin_scoped'
  | 'listing_admin_scoped'
  | 'post_owner_scoped'
  | 'collection_admin_scoped'
  
  // Basic user
  | 'user';                   // Level 0

export interface Capability {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  created_at: string;
}

export interface Role {
  id: string;
  code: RoleLevel;
  name: string;
  description?: string;
  level: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleCapability {
  id: string;
  role_id: string;
  capability_id: string;
  scope_type: 'global' | 'regional' | 'resource';
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  primary_role: RoleLevel;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  scope_type: 'global' | 'regional' | 'resource';
  scope_value?: string;
  resource_type?: string;
  resource_id?: string;
  granted_by?: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface UserRoleWithDetails extends UserRole {
  role: Role;
}

export interface CapabilityCategory {
  name: string;
  capabilities: Capability[];
}

// Role hierarchy levels for easy reference
export const ROLE_LEVELS: Record<RoleLevel, number> = {
  platform_owner_root: 100,
  super_admin: 99,
  org_admin: 90,
  access_admin: 85,
  emergency_commander: 80,
  security_admin: 75,
  mfa_enforcement_admin: 74,
  audit_logs_admin: 73,
  privacy_dpo_admin: 72,
  compliance_admin: 71,
  fraud_abuse_admin: 70,
  trust_safety_lead: 70,
  threat_intel_admin: 70,
  legal_hold_admin: 70,
  sre_admin: 65,
  observability_admin: 64,
  backup_restore_admin: 63,
  feature_flags_admin: 62,
  release_admin: 61,
  performance_admin: 60,
  database_admin: 55,
  data_steward_admin: 54,
  analytics_admin: 53,
  bi_admin: 52,
  search_index_admin: 51,
  reports_admin: 50,
  api_admin: 45,
  integrations_admin: 44,
  dev_console_admin: 43,
  ai_model_admin: 42,
  webhook_monitor_admin: 41,
  user_directory_admin: 35,
  verification_kyc_admin: 34,
  ban_appeals_admin: 33,
  notes_case_admin: 32,
  region_admin: 31,
  global_content_moderator: 25,
  posts_moderator: 24,
  comments_moderator: 24,
  media_moderator: 24,
  video_reels_moderator: 24,
  live_stream_moderator: 24,
  profile_moderator: 24,
  groups_moderator: 24,
  pages_moderator: 24,
  events_moderator: 24,
  marketplace_moderator: 24,
  new_goods_moderator: 24,
  jobs_moderator: 24,
  dating_moderator: 24,
  forum_moderator: 24,
  movies_watch_moderator: 24,
  offers_deals_moderator: 24,
  education_learn_moderator: 24,
  storage_admin: 18,
  transcoding_ffmpeg_admin: 17,
  content_insurance_admin: 16,
  dmca_copyright_admin: 15,
  billing_admin: 14,
  payments_admin: 13,
  tax_vat_admin: 12,
  pricing_plans_admin: 11,
  subscriptions_admin: 10,
  affiliate_admin: 10,
  ads_promotion_admin: 10,
  merchant_onboarding_admin: 9,
  vendor_admin: 8,
  inventory_admin: 8,
  orders_admin: 8,
  disputes_admin: 8,
  restaurant_admin: 7,
  courier_driver_ops_admin: 7,
  dispatch_admin: 7,
  hotel_admin: 7,
  booking_admin: 7,
  compliance_food_hotel_admin: 7,
  messaging_admin: 5,
  notifications_admin: 5,
  email_sms_admin: 5,
  admin_alerts_admin: 5,
  localization_admin: 4,
  ab_testing_admin: 4,
  seo_admin: 4,
  content_ops_admin: 4,
  creator_academy_admin: 4,
  agency_workspace_admin: 4,
  read_only_global_admin: 3,
  finance_read_only: 3,
  security_read_only: 3,
  content_read_only: 3,
  quarantine_admin: 2,
  spam_blast_admin: 2,
  regional_emergency_admin: 2,
  incident_scribe: 2,
  group_admin_scoped: 1,
  page_admin_scoped: 1,
  event_admin_scoped: 1,
  store_admin_scoped: 1,
  listing_admin_scoped: 1,
  post_owner_scoped: 1,
  collection_admin_scoped: 1,
  user: 0
};

// Capability codes for easy reference
export const CAPABILITY_CODES = {
  SYSTEM_ROOT_ACCESS: 'system.root.access',
  SYSTEM_ADMIN_MANAGE: 'system.admin.manage',
  SYSTEM_EMERGENCY_CONTROL: 'system.emergency.control',
  USERS_VIEW_ALL: 'users.view.all',
  USERS_EDIT_ALL: 'users.edit.all',
  USERS_ROLES_MANAGE: 'users.roles.manage',
  USERS_BAN_MANAGE: 'users.ban.manage',
  CONTENT_MODERATE_ALL: 'content.moderate.all',
  CONTENT_MODERATE_POSTS: 'content.moderate.posts',
  CONTENT_MODERATE_COMMENTS: 'content.moderate.comments',
  CONTENT_MODERATE_MEDIA: 'content.moderate.media',
  SECURITY_POLICIES_MANAGE: 'security.policies.manage',
  SECURITY_AUDIT_VIEW: 'security.audit.view',
  SECURITY_MFA_ENFORCE: 'security.mfa.enforce',
  COMPLIANCE_GDPR_MANAGE: 'compliance.gdpr.manage',
  BILLING_MANAGE: 'billing.manage',
  PAYMENTS_PROCESS: 'payments.process',
  MARKETPLACE_MANAGE: 'marketplace.manage',
  DATABASE_ADMIN: 'database.admin',
  API_MANAGE: 'api.manage',
  STORAGE_MANAGE: 'storage.manage'
} as const;

export type CapabilityCode = typeof CAPABILITY_CODES[keyof typeof CAPABILITY_CODES];