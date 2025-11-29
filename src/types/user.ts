
export interface UserProfile {
  id: string;
  user_id: string;
  auth_user_id: string; // Now properly defined as required field
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  phone_verified?: boolean;
  whatsapp_number?: string;
  whatsapp_verified?: boolean;
  gender?: string;
  nationality?: string;
  account_status?: string;
  role?: string;
  primary_role?: string;
  email_verified?: boolean;
  two_factor_enabled?: boolean;
  languages?: string[];
  profile_image_url?: string;
  profile_photo_url?: string; // Alternative property name
  avatar_url?: string; // Avatar URL from profiles table
  created_at?: string;
  updated_at?: string;
  date_of_birth?: string;
  last_login?: string;
  last_ip_address?: string;
  last_device?: string;
  last_location?: string;
  registration_method?: string;
  connected_apps?: string[];
  subscription_status?: string;
  subscription_expiry?: string;
  storage_used?: number;
  storage_limit?: number;
}

export interface UserActivityLog {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AdminAction {
  id: string;
  actor_id: string;
  target_user_id: string;
  action_type: string;
  reason?: string;
  new_status?: string;
  new_role?: string;
  created_at?: string;
}

// Option arrays for dropdowns
export const accountStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'deactivated', label: 'Deactivated' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'banned', label: 'Banned' },
  { value: 'locked', label: 'Locked' },
];

export const userRoleOptions = [
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'supreme_super_admin', label: 'Supreme Super Admin' },
  { value: 'developer', label: 'Developer' },
  { value: 'support', label: 'Support' },
];

export const primaryRoleOptions = [
  { value: 'user', label: 'User' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'platform_owner_root', label: 'Platform Owner' },
];

export const verificationStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' },
];

// Utility function for formatting bytes
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
