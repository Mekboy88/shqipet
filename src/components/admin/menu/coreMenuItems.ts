
import { MenuItem } from './types';
import { LayoutDashboard, CustomSystemIcon, Key, Settings, Users, Package, CreditCard } from './icons';

export const coreMenuItems: MenuItem[] = [
  {
    id: 'dashboard-overview',
    label: '🏠 Dashboard Overview',
    icon: LayoutDashboard,
    colorVariant: 'navyWhite',
    submenu: [
      { id: 'main-dashboard', label: '📈 Main Dashboard', href: '/admin/dashboard' },
      { id: 'quick-actions', label: '🎯 Quick Actions', href: '/admin/quick-actions' },
      { id: 'recent-activity', label: '📋 Recent Activity', href: '/admin/recent-activity' },
      { id: 'notifications-center', label: '🔔 Notifications Center', href: '/admin/notifications' },
      { id: 'system-status', label: '📊 System Status', href: '/admin/system-status' }
    ]
  },
  {
    id: 'user-management',
    label: '👥 User Management',
    icon: Users,
    colorVariant: 'charcoalBurgundy',
    submenu: [
      { id: 'user-profiles', label: '👤 User Table', href: '/admin/users/profiles' },
      { id: 'user-permissions', label: '🔐 User Permissions', href: '/admin/users/permissions' },
      { id: 'user-groups', label: '👥 User Groups', href: '/admin/users/groups' },
      { id: 'user-registration', label: '📝 User Registration', href: '/admin/users/registration' },
      { id: 'suspended-users', label: '🚫 Suspended Users', href: '/admin/users/suspended' },
      { id: 'user-analytics', label: '📊 User Analytics', href: '/admin/users/analytics' }
    ]
  },
  {
    id: 'system-settings',
    label: '🔧 System Settings',
    icon: Settings,
    colorVariant: 'blackGold',
    submenu: [
      { id: 'general-settings', label: '⚙️ General Settings', href: '/admin/settings/general' },
      { id: 'platform-config', label: '🌐 Platform Configuration', href: '/admin/settings/platform' },
      { id: 'email-settings', label: '📧 Email Settings', href: '/admin/settings/email' },
      { id: 'notification-settings', label: '🔔 Notification Settings', href: '/admin/settings/notifications' },
      { id: 'theme-appearance', label: '🎨 Theme & Appearance', href: '/admin/settings/theme' },
      { id: 'localization', label: '🌍 Localization', href: '/admin/settings/localization' },
      { id: 'backup-restore', label: '🔄 Backup & Restore', href: '/admin/settings/backup' }
    ]
  },
  {
    id: 'security-moderation',
    label: '🛡️ Security & Moderation',
    icon: CustomSystemIcon,
    colorVariant: 'brownCream',
    submenu: [
      { id: 'security-dashboard', label: '🔒 Security Dashboard', href: '/admin/security/dashboard' },
      { id: 'content-moderation', label: '👮 Content Moderation', href: '/admin/security/moderation' },
      { id: 'report-management', label: '🚨 Report Management', href: '/admin/security/reports' },
      { id: 'access-control', label: '🔐 Access Control', href: '/admin/security/access' },
      { id: 'privacy-settings', label: '🛡️ Privacy Settings', href: '/admin/security/privacy' },
      { id: 'blocked-content', label: '🚫 Blocked Content', href: '/admin/security/blocked' },
      { id: 'audit-logs', label: '📋 Audit Logs', href: '/admin/security/audit' }
    ]
  },
  {
    id: 'support-help',
    label: '💔 Support & Help',
    icon: Key,
    colorVariant: 'midnightSilver',
    submenu: [
      { id: 'ticket-system', label: '🎫 Ticket System', href: '/admin/support/tickets' },
      { id: 'live-chat', label: '💬 Live Chat Support', href: '/admin/support/chat' },
      { id: 'knowledge-base', label: '📚 Knowledge Base', href: '/admin/support/knowledge' },
      { id: 'ai-chatbot', label: '🤖 AI Chatbot', href: '/admin/support/chatbot' },
      { id: 'phone-support', label: '📞 Phone Support', href: '/admin/support/phone' },
      { id: 'email-support', label: '📧 Email Support', href: '/admin/support/email' },
      { id: 'video-tutorials', label: '🎥 Video Tutorials', href: '/admin/support/tutorials' },
      { id: 'faq-management', label: '📋 FAQ Management', href: '/admin/support/faq' },
      { id: 'support-analytics', label: '📊 Support Analytics', href: '/admin/support/analytics' },
      { id: 'issue-tracking', label: '🔄 Issue Tracking', href: '/admin/support/tracking' }
    ]
  }
];
