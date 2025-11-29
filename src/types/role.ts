
export type PermissionCategory = 
  | 'userManagement'
  | 'contentModeration'
  | 'securityAuthentication'
  | 'paymentsSubscription'
  | 'analyticsReporting'
  | 'apiIntegration'
  | 'administrative';

export type RolePermission = {
  id: string;
  name: string;
  key: string;
  description: string;
  category: PermissionCategory;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
  };
  updatedBy: {
    id: string;
    name: string;
  };
  active: boolean;
};

export type RoleFormData = {
  name: string;
  description: string;
  active: boolean;
  permissions: string[];
};

export const PERMISSION_CATEGORIES = [
  {
    id: 'userManagement',
    name: 'User Management',
    icon: 'users',
  },
  {
    id: 'contentModeration',
    name: 'Content Moderation',
    icon: 'file-text',
  },
  {
    id: 'securityAuthentication',
    name: 'Security & Authentication',
    icon: 'lock',
  },
  {
    id: 'paymentsSubscription',
    name: 'Payments & Subscriptions',
    icon: 'credit-card',
  },
  {
    id: 'analyticsReporting',
    name: 'Analytics & Reporting',
    icon: 'bar-chart',
  },
  {
    id: 'apiIntegration',
    name: 'API Integration',
    icon: 'link',
  },
  {
    id: 'administrative',
    name: 'Administrative',
    icon: 'settings',
  },
];

export const ALL_PERMISSIONS: RolePermission[] = [
  // User Management Permissions
  {
    id: 'view_users',
    name: 'View Users',
    key: 'view_users',
    description: 'Can view user profiles and information',
    category: 'userManagement',
  },
  {
    id: 'edit_users',
    name: 'Edit Users',
    key: 'edit_users',
    description: 'Can modify user profiles and information',
    category: 'userManagement',
  },
  {
    id: 'delete_users',
    name: 'Delete Users',
    key: 'delete_users',
    description: 'Can permanently delete user accounts',
    category: 'userManagement',
  },
  {
    id: 'suspend_activate_users',
    name: 'Suspend/Activate Users',
    key: 'suspend_activate_users',
    description: 'Can suspend or reactivate user accounts',
    category: 'userManagement',
  },
  {
    id: 'manage_user_roles',
    name: 'Manage User Roles',
    key: 'manage_user_roles',
    description: 'Can assign or revoke roles from users',
    category: 'userManagement',
  },
  {
    id: 'export_user_data',
    name: 'Export User Data',
    key: 'export_user_data',
    description: 'Can export user data in various formats',
    category: 'userManagement',
  },
  {
    id: 'impersonate_users',
    name: 'Impersonate Users',
    key: 'impersonate_users',
    description: 'Can log in as another user for support purposes',
    category: 'userManagement',
  },

  // Content Moderation Permissions
  {
    id: 'view_content',
    name: 'View Posts/Comments',
    key: 'view_content',
    description: 'Can view all content including reported or hidden',
    category: 'contentModeration',
  },
  {
    id: 'edit_content',
    name: 'Edit Posts/Comments',
    key: 'edit_content',
    description: 'Can modify user-generated content',
    category: 'contentModeration',
  },
  {
    id: 'delete_content',
    name: 'Delete Posts/Comments',
    key: 'delete_content',
    description: 'Can remove user-generated content',
    category: 'contentModeration',
  },
  {
    id: 'ban_users_posting',
    name: 'Ban Users from Posting',
    key: 'ban_users_posting',
    description: 'Can restrict users from creating new content',
    category: 'contentModeration',
  },
  {
    id: 'moderate_reports',
    name: 'Moderate Reports',
    key: 'moderate_reports',
    description: 'Can review and action user-generated reports',
    category: 'contentModeration',
  },

  // Security & Authentication Permissions
  {
    id: 'reset_passwords',
    name: 'Reset Passwords',
    key: 'reset_passwords',
    description: 'Can reset passwords for users and admins',
    category: 'securityAuthentication',
  },
  {
    id: 'view_security_logs',
    name: 'View Security Logs',
    key: 'view_security_logs',
    description: 'Can access detailed security logs',
    category: 'securityAuthentication',
  },
  {
    id: 'modify_security_settings',
    name: 'Modify Security Settings',
    key: 'modify_security_settings',
    description: 'Can change security configurations',
    category: 'securityAuthentication',
  },
  {
    id: 'manage_2fa',
    name: 'Manage 2FA Settings',
    key: 'manage_2fa',
    description: 'Can configure two-factor authentication settings',
    category: 'securityAuthentication',
  },
  {
    id: 'access_ip_logs',
    name: 'Access IP/Location Logs',
    key: 'access_ip_logs',
    description: 'Can view IP addresses and location history',
    category: 'securityAuthentication',
  },

  // Payments & Subscription Permissions
  {
    id: 'view_transactions',
    name: 'View Payment Transactions',
    key: 'view_transactions',
    description: 'Can access payment transaction history',
    category: 'paymentsSubscription',
  },
  {
    id: 'refund_transactions',
    name: 'Refund Transactions',
    key: 'refund_transactions',
    description: 'Can process refunds for transactions',
    category: 'paymentsSubscription',
  },
  {
    id: 'edit_subscription_plans',
    name: 'Edit Subscription Plans',
    key: 'edit_subscription_plans',
    description: 'Can modify subscription plan details',
    category: 'paymentsSubscription',
  },
  {
    id: 'manage_subscriptions',
    name: 'Cancel/Upgrade Subscriptions',
    key: 'manage_subscriptions',
    description: 'Can modify user subscription status',
    category: 'paymentsSubscription',
  },
  {
    id: 'manage_payment_methods',
    name: 'Manage Payment Methods',
    key: 'manage_payment_methods',
    description: 'Can configure payment providers and methods',
    category: 'paymentsSubscription',
  },

  // Analytics & Reporting Permissions
  {
    id: 'view_analytics',
    name: 'View Platform Analytics',
    key: 'view_analytics',
    description: 'Can access analytics and metrics dashboard',
    category: 'analyticsReporting',
  },
  {
    id: 'generate_reports',
    name: 'Generate Reports',
    key: 'generate_reports',
    description: 'Can create custom analytics reports',
    category: 'analyticsReporting',
  },
  {
    id: 'export_analytics',
    name: 'Export Data and Logs',
    key: 'export_analytics',
    description: 'Can download analytics data in various formats',
    category: 'analyticsReporting',
  },

  // API Integration Permissions
  {
    id: 'manage_integrations',
    name: 'Manage API Integrations',
    key: 'manage_integrations',
    description: 'Can configure third-party API integrations',
    category: 'apiIntegration',
  },
  {
    id: 'generate_api_keys',
    name: 'Generate API Keys',
    key: 'generate_api_keys',
    description: 'Can create API access credentials',
    category: 'apiIntegration',
  },
  {
    id: 'revoke_api_access',
    name: 'Revoke API Access',
    key: 'revoke_api_access',
    description: 'Can terminate API access for integrations',
    category: 'apiIntegration',
  },
  {
    id: 'edit_integration_settings',
    name: 'Edit Integration Settings',
    key: 'edit_integration_settings',
    description: 'Can modify configuration of integrations',
    category: 'apiIntegration',
  },

  // Administrative Permissions
  {
    id: 'manage_roles',
    name: 'Create/Edit/Delete Roles',
    key: 'manage_roles',
    description: 'Can manage platform roles and permissions',
    category: 'administrative',
  },
  {
    id: 'view_role_assignments',
    name: 'View Role Assignments',
    key: 'view_role_assignments',
    description: 'Can see which users have what roles',
    category: 'administrative',
  },
  {
    id: 'modify_role_assignments',
    name: 'Modify Role Assignments',
    key: 'modify_role_assignments',
    description: 'Can change which users have what roles',
    category: 'administrative',
  },
  {
    id: 'manage_admins',
    name: 'Manage Admin Accounts',
    key: 'manage_admins',
    description: 'Can create and manage administrator users',
    category: 'administrative',
  },
  {
    id: 'view_audit_trails',
    name: 'View Audit Trails',
    key: 'view_audit_trails',
    description: 'Can access system-wide audit logs',
    category: 'administrative',
  },
  {
    id: 'system_configuration',
    name: 'System Configuration',
    key: 'system_configuration',
    description: 'Can modify system-wide settings',
    category: 'administrative',
  },
];

// Default roles with predefined permissions
export const DEFAULT_ROLES: Omit<Role, 'id' | 'userCount' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>[] = [
  {
    name: 'Super Admin',
    description: 'Full access to all system features and settings',
    permissions: ALL_PERMISSIONS.map(p => p.id),
    active: true,
  },
  {
    name: 'Admin',
    description: 'Administrative access with some restrictions',
    permissions: ALL_PERMISSIONS
      .filter(p => p.id !== 'system_configuration' && p.id !== 'manage_roles')
      .map(p => p.id),
    active: true,
  },
  {
    name: 'Moderator',
    description: 'Can moderate content and limited user management',
    permissions: [
      'view_users',
      'view_content',
      'edit_content',
      'delete_content',
      'moderate_reports',
      'ban_users_posting',
      'view_security_logs',
      'view_analytics',
    ],
    active: true,
  },
  {
    name: 'User',
    description: 'Standard user permissions',
    permissions: [],
    active: true,
  },
];
