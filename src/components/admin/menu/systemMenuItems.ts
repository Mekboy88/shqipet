
import { Database, Shield, Activity, Globe, Zap, HardDrive, Wifi, Server, BrainCircuit, BarChart, Package, Archive } from 'lucide-react';
import { MenuItem } from './types';

export const systemMenuItems: MenuItem[] = [
  {
    id: 'mobile-app-management',
    label: '📱 Mobile App Management',
    icon: Database,
    colorVariant: 'indigoSand',
    submenu: [
      { id: 'app-configuration', label: '📲 App Configuration', href: '/admin/mobile/config' },
      { id: 'push-notifications-mobile', label: '🔔 Push Notifications', href: '/admin/mobile/notifications' },
      { id: 'mobile-analytics', label: '📊 Mobile Analytics', href: '/admin/mobile/analytics' },
      { id: 'app-updates', label: '🔄 App Updates', href: '/admin/mobile/updates' },
      { id: 'mobile-features', label: '🛠️ Mobile Features', href: '/admin/mobile/features' },
      { id: 'device-management', label: '📱 Device Management', href: '/admin/mobile/devices' }
    ]
  },
  {
    id: 'analytics-reports',
    label: '📊 Analytics & Reports',
    icon: BarChart,
    colorVariant: 'crimsonIvory',
    submenu: [
      { id: 'traffic-analytics', label: '📈 Traffic Analytics', href: '/admin/analytics/traffic' },
      { id: 'user-engagement', label: '👥 User Engagement', href: '/admin/analytics/engagement' },
      { id: 'revenue-reports', label: '💰 Revenue Reports', href: '/admin/analytics/revenue' },
      { id: 'mobile-app-stats', label: '📱 Mobile App Stats', href: '/admin/analytics/mobile' },
      { id: 'content-performance', label: '🎯 Content Performance', href: '/admin/analytics/content' },
      { id: 'social-media-metrics', label: '📊 Social Media Metrics', href: '/admin/analytics/social' },
      { id: 'custom-reports', label: '📋 Custom Reports', href: '/admin/analytics/custom' }
    ]
  },
  {
    id: 'emergency-controls',
    label: '🚨 Emergency Controls',
    icon: Shield,
    colorVariant: 'navyWhite',
    submenu: [
      { id: 'emergency-shutdown', label: '🚨 Emergency Shutdown', href: '/admin/emergency/shutdown' },
      { id: 'security-lockdown', label: '🔒 Security Lockdown', href: '/admin/emergency/lockdown' },
      { id: 'emergency-broadcast', label: '📢 Emergency Broadcast', href: '/admin/emergency/broadcast' },
      { id: 'system-maintenance', label: '🛠️ System Maintenance', href: '/admin/emergency/maintenance' },
      { id: 'incident-response', label: '📋 Incident Response', href: '/admin/emergency/response' },
      { id: 'backup-activation', label: '🔄 Backup Activation', href: '/admin/emergency/backup' }
    ]
  },
  {
    id: 'api-integrations',
    label: '🔗 API & Integrations',
    icon: Activity,
    colorVariant: 'charcoalBurgundy',
    submenu: [
      { id: 'third-party-apis', label: '🔌 Third-party APIs', href: '/admin/api/third-party' },
      { id: 'webhook-management', label: '🔗 Webhook Management', href: '/admin/api/webhooks' },
      { id: 'integration-analytics', label: '📊 Integration Analytics', href: '/admin/api/analytics' },
      { id: 'api-security', label: '🔒 API Security', href: '/admin/api/security' },
      { id: 'developer-tools', label: '📝 Developer Tools', href: '/admin/api/tools' },
      { id: 'custom-integrations', label: '🛠️ Custom Integrations', href: '/admin/api/custom' },
      { id: 'api-documentation', label: '📚 API Documentation', href: '/admin/api/docs' },
      { id: 'data-sync', label: '🔄 Data Sync', href: '/admin/api/sync' },
      { id: 'cloud-services', label: '🌐 Cloud Services', href: '/admin/api/cloud' },
      { id: 'ai-apis', label: '🤖 AI APIs', href: '/admin/api/ai' }
    ]
  },
  {
    id: 'cloud-monitoring',
    label: '☁️ Cloud Monitoring',
    icon: Server,
    colorVariant: 'tealGold',
    submenu: [
      { id: 'live-operations', label: '📊 Live Operation Counter', href: '/admin/cloud/operations' },
      { id: 'cost-estimator', label: '💰 Cost Estimator Dashboard', href: '/admin/cloud/costs' },
      { id: 'query-logs', label: '📋 Query Logs Viewer', href: '/admin/cloud/logs' },
      { id: 'realtime-alerts', label: '🚨 Real-Time Alerts', href: '/admin/cloud/alerts' },
      { id: 'optimization-suggestions', label: '🎯 Optimization Suggestions', href: '/admin/cloud/optimization' }
    ]
  }
];
