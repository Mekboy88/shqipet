import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UIComponentTreeView } from '@/components/topology/UIComponentTreeView';

// Global type declarations for window object
declare global {
  interface Window {
    handleCardClick?: (cardData: any) => void;
    clickCounts?: {[key: string]: number};
  }
}
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Position,
  Handle,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Search, 
  Filter, 
  Play, 
  Download, 
  Settings,
  Globe,
  Smartphone,
  Monitor,
  MessageSquare,
  Database,
  Server,
  Cloud,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  Activity,
  Eye,
  EyeOff,
  BarChart3,
  FileText,
  RefreshCw,
  Clock,
  Home,
  User,
  Camera,
  Video,
  Store,
  Shield,
  Users,
  Image,
  Play as PlayIcon,
  MapPin,
  Settings2,
  Bell,
  Mail,
  Lock,
  Gamepad2,
  Building,
  Calendar,
  BookOpen,
  Phone,
  HelpCircle,
  Tablet,
  Network,
  LogIn,
  UserPlus,
  Key,
  LayoutDashboard,
  Users2,
  MessageCircle,
  Heart,
  Bookmark,
  ShoppingCart,
  Briefcase,
  Heart as Heart2,
  Clapperboard,
  Utensils,
  UtensilsCrossed,
  Building2,
  Info,
  GraduationCap,
  Share2,
  ScrollText,
  Cpu,
  HardDrive,
  WifiOff,
  Plus,
  Minus,
  Maximize2
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

// Custom Node Component
const PageNode = ({ data }: { data: any }) => {
  const statusColors = {
    connected: 'bg-green-100 border-green-500',
    issues: 'bg-red-100 border-red-500',
    not_created: 'bg-gray-100 border-gray-400'
  };

  // Determine actual status based on issues
  const actualStatus = data.issues > 0 ? 'issues' : data.status;

  const statusIcons = {
    connected: CheckCircle,
    issues: XCircle,
    not_created: AlertCircle
  };

  const Icon = data.icon;
  const StatusIcon = statusIcons[actualStatus as keyof typeof statusIcons];

  // Access the component's functions through a context or parent prop
  const handleClick = () => {
    // This will be handled by the parent component for all cards including database
    if (window.handleCardClick) {
      window.handleCardClick(data);
    }
  };

    return (
      <div onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Card className={`min-w-[250px] ${statusColors[actualStatus as keyof typeof statusColors]} ${data.background || ''}`}>
          {/* Input handle at the top */}
          <Handle
            type="target"
            position={Position.Top}
            id={`${data.id}-top`}
            className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
          />
          
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {data.name}
              <StatusIcon className={`h-4 w-4 ml-auto ${
                actualStatus === 'connected' ? 'text-green-600' : 
                actualStatus === 'issues' ? 'text-red-600' : 'text-gray-500'
              }`} />
            </CardTitle>
            <CardDescription className="text-xs">{data.description}</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>App:</span>
                <Badge variant="outline" className="text-xs">{data.app}</Badge>
              </div>
              {data.exists && (
                <>
                  <div className="flex justify-between text-xs">
                    <span>Uptime:</span>
                    <span>{data.uptime}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Latency:</span>
                    <span>{data.latency}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Issues:</span>
                    <span className={data.issues > 0 ? 'text-red-600' : 'text-green-600'}>
                      {data.issues}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-xs">
                <span>Status:</span>
                <span className={
                  actualStatus === 'connected' ? 'text-green-600' : 
                  actualStatus === 'issues' ? 'text-red-600' : 'text-gray-500'
                }>
                  {data.exists ? (data.issues > 0 ? 'Issues Detected' : 'Connected') : 'Not Created'}
                </span>
              </div>
              {/* Show click indicator for all cards */}
              {window.clickCounts && window.clickCounts[data.id] > 0 && (
                <div className="text-center mt-2">
                  <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full inline-block">
                    {window.clickCounts[data.id]}/3 - Triple click for {data.id === 'database' ? 'database topology' : 'details'}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          
          {/* Output handle at the bottom */}
          <Handle
            type="source"
            position={Position.Bottom}
            id={`${data.id}-bottom`}
            className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
          />
        </Card>
      </div>
    );
};

const nodeTypes = {
  pageNode: PageNode,
};

// Complete Page Data Structure
const APP_PAGES: Record<string, any> = {
  // Level 0 - Database Root (1 card)
  database: {
    id: 'database',
    name: 'Supabase Database',
    app: 'backend',
    status: 'connected',
    icon: Database,
    uptime: 99.9,
    latency: 12,
    issues: 0,
    lastTest: '2 min ago',
    description: 'PostgreSQL Core Database',
    background: 'bg-green-50',
    level: 0,
    exists: true
  },

  // Level 1 - Foundation Systems (2 cards)
  authSystem: {
    id: 'auth-system',
    name: 'Authentication Core',
    app: 'backend',
    status: 'connected',
    icon: Shield,
    uptime: 99.8,
    latency: 28,
    issues: 0,
    lastTest: '1 min ago',
    description: 'User authentication system',
    level: 1,
    exists: true
  },
  
  appCore: {
    id: 'app-core',
    name: 'Application Core',
    app: 'backend',
    status: 'connected',
    icon: Cpu,
    uptime: 99.7,
    latency: 18,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Main application logic',
    level: 1,
    exists: true
  },

  // Level 2 - Authentication Pages (3 cards)
  login: {
    id: 'login',
    name: 'Login Page',
    app: 'website',
    status: 'connected',
    icon: LogIn,
    uptime: 99.5,
    latency: 45,
    issues: 0,
    lastTest: '1 min ago',
    description: 'User login interface',
    route: '/login',
    level: 2,
    exists: true
  },
  
  register: {
    id: 'register',
    name: 'Registration Page',
    app: 'website',
    status: 'connected',
    icon: UserPlus,
    uptime: 99.3,
    latency: 52,
    issues: 0,
    lastTest: '2 min ago',
    description: 'User registration form',
    route: '/register',
    level: 2,
    exists: true
  },
  
  forgotPassword: {
    id: 'forgot-password',
    name: 'Password Recovery',
    app: 'website',
    status: 'connected',
    icon: Key,
    uptime: 98.9,
    latency: 38,
    issues: 0,
    lastTest: '3 min ago',
    description: 'Password reset functionality',
    route: '/forgot-password',
    level: 2,
    exists: true
  },

  // Level 3 - Main Platform Pages (4 cards)
  dashboard: {
    id: 'dashboard',
    name: 'Main Dashboard',
    app: 'website',
    status: 'connected',
    icon: LayoutDashboard,
    uptime: 99.8,
    latency: 42,
    issues: 0,
    lastTest: '1 min ago',
    description: 'User dashboard homepage',
    route: '/dashboard',
    level: 3,
    exists: true
  },
  
  profile: {
    id: 'profile',
    name: 'User Profile',
    app: 'website',
    status: 'connected',
    icon: User,
    uptime: 99.6,
    latency: 35,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Personal profile management',
    route: '/profile',
    level: 3,
    exists: true
  },
  
  settings: {
    id: 'settings',
    name: 'User Settings',
    app: 'website',
    status: 'connected',
    icon: Settings,
    uptime: 99.4,
    latency: 41,
    issues: 0,
    lastTest: '3 min ago',
    description: 'Account and app settings',
    route: '/settings',
    level: 3,
    exists: true
  },
  
  notifications: {
    id: 'notifications',
    name: 'Notifications Center',
    app: 'website',
    status: 'connected',
    icon: Bell,
    uptime: 98.8,
    latency: 48,
    issues: 1,
    lastTest: '2 min ago',
    description: 'Notification management',
    route: '/notifications',
    level: 3,
    exists: true
  },

  // Level 4 - Social & Communication (5 cards)
  messages: {
    id: 'messages',
    name: 'Messages',
    app: 'website',
    status: 'connected',
    icon: MessageSquare,
    uptime: 99.2,
    latency: 56,
    issues: 0,
    lastTest: '1 min ago',
    description: 'Direct messaging system',
    route: '/messages',
    level: 4,
    exists: true
  },
  
  friends: {
    id: 'friends',
    name: 'Friends Network',
    app: 'website',
    status: 'connected',
    icon: Users,
    uptime: 99.1,
    latency: 62,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Friend management system',
    route: '/friends',
    level: 4,
    exists: true
  },
  
  groups: {
    id: 'groups',
    name: 'Community Groups',
    app: 'website',
    status: 'not_created',
    icon: Users2,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Community groups - Not created yet',
    route: '/groups',
    level: 4,
    exists: false
  },
  
  forum: {
    id: 'forum',
    name: 'Discussion Forum',
    app: 'website',
    status: 'not_created',
    icon: MessageCircle,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Forum discussions - Not created yet',
    route: '/forum',
    level: 4,
    exists: false
  },
  
  blog: {
    id: 'blog',
    name: 'Blog Platform',
    app: 'website',
    status: 'not_created',
    icon: BookOpen,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Blog system - Not created yet',
    route: '/blog',
    level: 4,
    exists: false
  },

  // Level 5 - Content & Media (6 cards)
  albums: {
    id: 'albums',
    name: 'Photo Albums',
    app: 'website',
    status: 'connected',
    icon: Image,
    uptime: 98.5,
    latency: 78,
    issues: 1,
    lastTest: '4 min ago',
    description: 'Photo gallery and albums',
    route: '/albums',
    level: 5,
    exists: true
  },
  
  reels: {
    id: 'reels',
    name: 'Video Reels',
    app: 'website',
    status: 'connected',
    icon: Video,
    uptime: 97.8,
    latency: 89,
    issues: 2,
    lastTest: '3 min ago',
    description: 'Short video content',
    route: '/reels',
    level: 5,
    exists: true
  },
  
  watch: {
    id: 'watch',
    name: 'Video Player',
    app: 'website',
    status: 'connected',
    icon: PlayIcon,
    uptime: 99.1,
    latency: 67,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Long-form video streaming',
    route: '/watch',
    level: 5,
    exists: true
  },
  
  memories: {
    id: 'memories',
    name: 'Memories',
    app: 'website',
    status: 'not_created',
    icon: Heart,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Memory collections - Not created yet',
    route: '/memories',
    level: 5,
    exists: false
  },
  
  savedPosts: {
    id: 'saved-posts',
    name: 'Saved Posts',
    app: 'website',
    status: 'connected',
    icon: Bookmark,
    uptime: 98.9,
    latency: 55,
    issues: 0,
    lastTest: '3 min ago',
    description: 'Bookmarked content',
    route: '/saved',
    level: 5,
    exists: true
  },
  
  discover: {
    id: 'discover',
    name: 'Discover Places',
    app: 'website',
    status: 'not_created',
    icon: MapPin,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Location discovery - Not created yet',
    route: '/discover',
    level: 5,
    exists: false
  },

  // Level 6 - Services & Features (7 cards)
  market: {
    id: 'market',
    name: 'Marketplace',
    app: 'website',
    status: 'connected',
    icon: ShoppingCart,
    uptime: 98.7,
    latency: 92,
    issues: 1,
    lastTest: '5 min ago',
    description: 'Buy and sell marketplace',
    route: '/market',
    level: 6,
    exists: true
  },
  
  jobs: {
    id: 'jobs',
    name: 'Jobs Board',
    app: 'website',
    status: 'not_created',
    icon: Briefcase,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Job listings - Not created yet',
    route: '/jobs',
    level: 6,
    exists: false
  },
  
  events: {
    id: 'events',
    name: 'Events Calendar',
    app: 'website',
    status: 'not_created',
    icon: Calendar,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Event management - Not created yet',
    route: '/events',
    level: 6,
    exists: false
  },
  
  dating: {
    id: 'dating',
    name: 'Dating Feature',
    app: 'website',
    status: 'not_created',
    icon: Heart2,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Dating platform - Not created yet',
    route: '/dating',
    level: 6,
    exists: false
  },
  
  games: {
    id: 'games',
    name: 'Gaming Hub',
    app: 'website',
    status: 'not_created',
    icon: Gamepad2,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Gaming platform - Not created yet',
    route: '/games',
    level: 6,
    exists: false
  },
  
  restaurants: {
    id: 'restaurants',
    name: 'Restaurant Reviews',
    app: 'website',
    status: 'not_created',
    icon: Utensils,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Restaurant reviews - Not created yet',
    route: '/restaurants',
    level: 6,
    exists: false
  },
  
  movies: {
    id: 'movies',
    name: 'Movie Database',
    app: 'website',
    status: 'not_created',
    icon: Clapperboard,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Movie reviews and info - Not created yet',
    route: '/movies',
    level: 6,
    exists: false
  },

  // Level 7 - Admin & Management (8 cards)
  adminDashboard: {
    id: 'admin-dashboard',
    name: 'Admin Dashboard',
    app: 'website',
    status: 'connected',
    icon: LayoutDashboard,
    uptime: 99.9,
    latency: 25,
    issues: 0,
    lastTest: '1 min ago',
    description: 'Administrative control panel',
    route: '/admin',
    level: 7,
    exists: true
  },
  
  userManagement: {
    id: 'user-management',
    name: 'User Management',
    app: 'website',
    status: 'connected',
    icon: Users,
    uptime: 99.7,
    latency: 32,
    issues: 0,
    lastTest: '1 min ago',
    description: 'User administration tools',
    route: '/admin/users',
    level: 7,
    exists: true
  },
  
  analytics: {
    id: 'analytics',
    name: 'Analytics Dashboard',
    app: 'website',
    status: 'connected',
    icon: BarChart3,
    uptime: 98.9,
    latency: 45,
    issues: 0,
    lastTest: '2 min ago',
    description: 'System analytics and reports',
    route: '/admin/analytics',
    level: 7,
    exists: true
  },
  
  contentModeration: {
    id: 'content-moderation',
    name: 'Content Moderation',
    app: 'website',
    status: 'connected',
    icon: Shield,
    uptime: 99.5,
    latency: 38,
    issues: 1,
    lastTest: '2 min ago',
    description: 'Content review and moderation',
    route: '/admin/moderation',
    level: 7,
    exists: true
  },
  
  systemSettings: {
    id: 'system-settings',
    name: 'System Settings',
    app: 'website',
    status: 'connected',
    icon: Settings2,
    uptime: 99.8,
    latency: 28,
    issues: 0,
    lastTest: '1 min ago',
    description: 'System configuration panel',
    route: '/admin/settings',
    level: 7,
    exists: true
  },
  
  logs: {
    id: 'logs',
    name: 'System Logs',
    app: 'website',
    status: 'connected',
    icon: FileText,
    uptime: 99.6,
    latency: 41,
    issues: 0,
    lastTest: '3 min ago',
    description: 'System activity logs',
    route: '/admin/logs',
    level: 7,
    exists: true
  },
  
  security: {
    id: 'security',
    name: 'Security Center',
    app: 'website',
    status: 'connected',
    icon: Lock,
    uptime: 99.9,
    latency: 22,
    issues: 0,
    lastTest: '1 min ago',
    description: 'Security monitoring and alerts',
    route: '/admin/security',
    level: 7,
    exists: true
  },
  
  backup: {
    id: 'backup',
    name: 'Backup System',
    app: 'backend',
    status: 'connected',
    icon: HardDrive,
    uptime: 99.9,
    latency: 15,
    issues: 0,
    lastTest: '30 min ago',
    description: 'Automated backup system',
    level: 7,
    exists: true
  },

  // Level 8 - Mobile Apps (9 cards)
  iosApp: {
    id: 'ios-app',
    name: 'iOS Mobile App',
    app: 'ios',
    status: 'connected',
    icon: Smartphone,
    uptime: 98.5,
    latency: 125,
    issues: 2,
    lastTest: '5 min ago',
    description: 'Native iOS application',
    level: 8,
    exists: true
  },
  
  androidApp: {
    id: 'android-app',
    name: 'Android Mobile App',
    app: 'android',
    status: 'connected',
    icon: Smartphone,
    uptime: 97.8,
    latency: 145,
    issues: 3,
    lastTest: '6 min ago',
    description: 'Native Android application',
    level: 8,
    exists: true
  },
  
  mobileWeb: {
    id: 'mobile-web',
    name: 'Mobile Web App',
    app: 'website',
    status: 'connected',
    icon: Globe,
    uptime: 99.2,
    latency: 78,
    issues: 1,
    lastTest: '3 min ago',
    description: 'Responsive web application',
    level: 8,
    exists: true
  },
  
  tabletApp: {
    id: 'tablet-app',
    name: 'Tablet Application',
    app: 'ios',
    status: 'not_created',
    icon: Tablet,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Tablet optimized app - Not created yet',
    level: 8,
    exists: false
  },
  
  desktopApp: {
    id: 'desktop-app',
    name: 'Desktop Application',
    app: 'website',
    status: 'not_created',
    icon: Monitor,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Desktop client - Not created yet',
    level: 8,
    exists: false
  },
  
  watchApp: {
    id: 'watch-app',
    name: 'Smart Watch App',
    app: 'ios',
    status: 'not_created',
    icon: Clock,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Smartwatch companion - Not created yet',
    level: 8,
    exists: false
  },
  
  tvApp: {
    id: 'tv-app',
    name: 'Smart TV App',
    app: 'ios',
    status: 'not_created',
    icon: Monitor,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Smart TV application - Not created yet',
    level: 8,
    exists: false
  },
  
  pwa: {
    id: 'pwa',
    name: 'Progressive Web App',
    app: 'website',
    status: 'connected',
    icon: Globe,
    uptime: 99.1,
    latency: 62,
    issues: 0,
    lastTest: '4 min ago',
    description: 'PWA with offline capabilities',
    level: 8,
    exists: true
  },
  
  messenger: {
    id: 'messenger',
    name: 'Standalone Messenger',
    app: 'website',
    status: 'not_created',
    icon: MessageSquare,
    uptime: 0,
    latency: 0,
    issues: 0,
    lastTest: 'Never',
    description: 'Standalone messaging app - Not created yet',
    level: 8,
    exists: false
  },

  // Level 9 - External Services (10 cards)
  apiGateway: {
    id: 'api-gateway',
    name: 'API Gateway',
    app: 'backend',
    status: 'connected',
    icon: Server,
    uptime: 99.9,
    latency: 8,
    issues: 0,
    lastTest: '1 min ago',
    description: 'API routing and management',
    level: 9,
    exists: true
  },
  
  cdn: {
    id: 'cdn',
    name: 'Content Delivery Network',
    app: 'backend',
    status: 'connected',
    icon: Cloud,
    uptime: 99.95,
    latency: 5,
    issues: 0,
    lastTest: '30 sec ago',
    description: 'Global content distribution',
    level: 9,
    exists: true
  },
  
  emailService: {
    id: 'email-service',
    name: 'Email Service',
    app: 'backend',
    status: 'connected',
    icon: Mail,
    uptime: 99.7,
    latency: 45,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Transactional email delivery',
    level: 9,
    exists: true
  },
  
  smsService: {
    id: 'sms-service',
    name: 'SMS Gateway',
    app: 'backend',
    status: 'connected',
    icon: Phone,
    uptime: 99.5,
    latency: 125,
    issues: 1,
    lastTest: '3 min ago',
    description: 'SMS and OTP delivery',
    level: 9,
    exists: true
  },
  
  pushNotifications: {
    id: 'push-notifications',
    name: 'Push Notifications',
    app: 'backend',
    status: 'connected',
    icon: Bell,
    uptime: 99.8,
    latency: 35,
    issues: 0,
    lastTest: '1 min ago',
    description: 'Mobile push notification service',
    level: 9,
    exists: true
  },
  
  fileStorage: {
    id: 'file-storage',
    name: 'File Storage',
    app: 'backend',
    status: 'connected',
    icon: HardDrive,
    uptime: 99.9,
    latency: 12,
    issues: 0,
    lastTest: '1 min ago',
    description: 'Cloud file storage system',
    level: 9,
    exists: true
  },
  
  imageProcessing: {
    id: 'image-processing',
    name: 'Image Processing',
    app: 'backend',
    status: 'connected',
    icon: Camera,
    uptime: 98.8,
    latency: 95,
    issues: 1,
    lastTest: '4 min ago',
    description: 'Image optimization and processing',
    level: 9,
    exists: true
  },
  
  videoStreaming: {
    id: 'video-streaming',
    name: 'Video Streaming',
    app: 'backend',
    status: 'connected',
    icon: Video,
    uptime: 97.5,
    latency: 180,
    issues: 2,
    lastTest: '5 min ago',
    description: 'Video streaming and transcoding',
    level: 9,
    exists: true
  },
  
  searchEngine: {
    id: 'search-engine',
    name: 'Search Engine',
    app: 'backend',
    status: 'connected',
    icon: Search,
    uptime: 99.6,
    latency: 28,
    issues: 0,
    lastTest: '2 min ago',
    description: 'Full-text search service',
    level: 9,
    exists: true
  },
  
  monitoring: {
    id: 'monitoring',
    name: 'System Monitoring',
    app: 'backend',
    status: 'connected',
    icon: Activity,
    uptime: 99.99,
    latency: 3,
    issues: 0,
    lastTest: '15 sec ago',
    description: 'Real-time system monitoring',
    level: 9,
    exists: true
  },
};

// Topology Connections - Each level connects to the next
const TOPOLOGY_CONNECTIONS = [
  // Level 0 to Level 1
  { from: 'database', to: 'auth-system', status: 'connected' },
  { from: 'database', to: 'app-core', status: 'connected' },
  
  // Level 1 to Level 2
  { from: 'auth-system', to: 'login', status: 'connected' },
  { from: 'auth-system', to: 'register', status: 'connected' },
  { from: 'auth-system', to: 'forgot-password', status: 'connected' },
  
  // Level 2 to Level 3
  { from: 'login', to: 'dashboard', status: 'connected' },
  { from: 'register', to: 'profile', status: 'connected' },
  { from: 'forgot-password', to: 'settings', status: 'connected' },
  { from: 'login', to: 'notifications', status: 'connected' },
  
  // Level 3 to Level 4
  { from: 'dashboard', to: 'messages', status: 'connected' },
  { from: 'profile', to: 'friends', status: 'connected' },
  { from: 'settings', to: 'groups', status: 'not_created' },
  { from: 'notifications', to: 'forum', status: 'not_created' },
  { from: 'dashboard', to: 'blog', status: 'not_created' },
  
  // Level 4 to Level 5
  { from: 'messages', to: 'albums', status: 'connected' },
  { from: 'friends', to: 'reels', status: 'connected' },
  { from: 'groups', to: 'watch', status: 'connected' },
  { from: 'forum', to: 'memories', status: 'not_created' },
  { from: 'blog', to: 'saved-posts', status: 'connected' },
  { from: 'messages', to: 'discover', status: 'not_created' },
  
  // Level 5 to Level 6
  { from: 'albums', to: 'market', status: 'connected' },
  { from: 'reels', to: 'jobs', status: 'not_created' },
  { from: 'watch', to: 'events', status: 'not_created' },
  { from: 'memories', to: 'dating', status: 'not_created' },
  { from: 'saved-posts', to: 'games', status: 'not_created' },
  { from: 'discover', to: 'restaurants', status: 'not_created' },
  { from: 'albums', to: 'movies', status: 'not_created' },
  
  // Level 6 to Level 7
  { from: 'market', to: 'admin-dashboard', status: 'connected' },
  { from: 'jobs', to: 'user-management', status: 'connected' },
  { from: 'events', to: 'analytics', status: 'connected' },
  { from: 'dating', to: 'content-moderation', status: 'connected' },
  { from: 'games', to: 'system-settings', status: 'connected' },
  { from: 'restaurants', to: 'logs', status: 'connected' },
  { from: 'movies', to: 'security', status: 'connected' },
  { from: 'market', to: 'backup', status: 'connected' },
  
  // Level 7 to Level 8
  { from: 'admin-dashboard', to: 'ios-app', status: 'connected' },
  { from: 'user-management', to: 'android-app', status: 'connected' },
  { from: 'analytics', to: 'mobile-web', status: 'connected' },
  { from: 'content-moderation', to: 'tablet-app', status: 'not_created' },
  { from: 'system-settings', to: 'desktop-app', status: 'not_created' },
  { from: 'logs', to: 'watch-app', status: 'not_created' },
  { from: 'security', to: 'tv-app', status: 'not_created' },
  { from: 'backup', to: 'pwa', status: 'connected' },
  { from: 'admin-dashboard', to: 'messenger', status: 'not_created' },
  
  // Level 8 to Level 9
  { from: 'ios-app', to: 'api-gateway', status: 'connected' },
  { from: 'android-app', to: 'cdn', status: 'connected' },
  { from: 'mobile-web', to: 'email-service', status: 'connected' },
  { from: 'tablet-app', to: 'sms-service', status: 'connected' },
  { from: 'desktop-app', to: 'push-notifications', status: 'connected' },
  { from: 'watch-app', to: 'file-storage', status: 'connected' },
  { from: 'tv-app', to: 'image-processing', status: 'connected' },
  { from: 'pwa', to: 'video-streaming', status: 'connected' },
  { from: 'messenger', to: 'search-engine', status: 'connected' },
  { from: 'ios-app', to: 'monitoring', status: 'connected' },
];

export default function LiveConnectionTopology() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApp, setFilterApp] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAutoTesting, setIsAutoTesting] = useState(false);
  const [discoveredPages, setDiscoveredPages] = useState(APP_PAGES);
  const [discoveredConnections, setDiscoveredConnections] = useState(TOPOLOGY_CONNECTIONS);
  const [lastDiscovery, setLastDiscovery] = useState<Date | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [clickCounts, setClickCounts] = useState<{[key: string]: number}>({});
  const [clickTimers, setClickTimers] = useState<{[key: string]: ReturnType<typeof setTimeout>}>({});

  // Handle triple-click functionality
  const handleCardClick = useCallback((cardData: any) => {
    const cardId = cardData.id;
    
    // Clear existing timer if it exists
    if (clickTimers[cardId]) {
      clearTimeout(clickTimers[cardId]);
    }

    // Increment click count
    const newClickCount = (clickCounts[cardId] || 0) + 1;
    setClickCounts(prev => ({ ...prev, [cardId]: newClickCount }));

    // Check if this is the third click
    if (newClickCount === 3) {
      // Reset click count
      setClickCounts(prev => ({ ...prev, [cardId]: 0 }));
      
      // For database card, show detailed view same as other cards
      if (cardData.id === 'database') {
        setSelectedCard(cardData);
        setShowDetailedView(true);
        return;
      }
      
      // Show detailed view for other cards
      setSelectedCard(cardData);
      setShowDetailedView(true);
      return;
    }

    // Set timer to reset click count after 1 second
    const timer = setTimeout(() => {
      setClickCounts(prev => ({ ...prev, [cardId]: 0 }));
    }, 1000);

    setClickTimers(prev => ({ ...prev, [cardId]: timer }));
  }, [clickCounts, clickTimers]);

  // Auto-discover system components on mount and periodically
  useEffect(() => {
    discoverSystemComponents();
    
    // Set up periodic discovery (every 5 minutes)
    const interval = setInterval(discoverSystemComponents, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const discoverSystemComponents = async () => {
    try {
      setIsDiscovering(true);
      console.log('🔍 Starting automatic component discovery...');
      
      const { data, error } = await supabase.functions.invoke('discover-system-components');
      
      if (error) throw error;
      
      if (data?.success) {
        // Convert discovered pages to proper format with icon mapping
        const pagesObject: Record<string, any> = {};
        data.pages.forEach((page: any) => {
          // Use original ID without modification
          const pageId = page.id;
          
          // Map icon names to actual icon components
          const iconMap: Record<string, any> = {
            'Database': Database, 'Shield': Shield, 'Cpu': Cpu, 'LogIn': LogIn,
            'UserPlus': UserPlus, 'Key': Key, 'LayoutDashboard': LayoutDashboard,
            'User': User, 'Settings': Settings, 'Bell': Bell, 'MessageSquare': MessageSquare,
            'Users': Users, 'Users2': Users2, 'MessageCircle': MessageCircle,
            'BookOpen': BookOpen, 'Image': Image, 'Video': Video, 'Play': PlayIcon,
            'Heart': Heart, 'Bookmark': Bookmark, 'MapPin': MapPin, 'ShoppingCart': ShoppingCart,
            'Briefcase': Briefcase, 'Calendar': Calendar, 'Gamepad2': Gamepad2,
            'Utensils': Utensils, 'Clapperboard': Clapperboard, 'ShieldCheck': Shield,
            'Crown': Shield, 'UserCog': User, 'Activity': Activity, 'UserX': User,
            'Globe': Globe, 'UserCheck': User, 'Package': Settings, 'MoreHorizontal': Settings,
            'Settings2': Settings2, 'Lock': Lock, 'Monitor': Monitor, 'Zap': Zap,
            'Radio': Bell, 'Building': Building, 'Languages': Globe, 'Star': Settings,
            'Award': Settings, 'Gem': Settings, 'Bot': MessageSquare, 'Cloud': Cloud,
            'Network': Network, 'BarChart3': BarChart3, 'FileText': FileText,
            'Smartphone': Smartphone, 'Server': Server, 'HardDrive': HardDrive,
            'Camera': Camera, 'Phone': Phone, 'Mail': Mail, 'Search': Search,
            'BrainCircuit': Settings, 'CreditCard': Settings, 'AlertTriangle': Activity,
            'Clock': Activity, 'Receipt': FileText, 'RotateCcw': Activity, 'TrendingUp': BarChart3,
            'Megaphone': Bell, 'DollarSign': Settings, 'ToggleLeft': Settings, 'Layers': Settings,
            'Store': Settings, 'CheckCircle': Activity, 'Wrench': Settings, 'Upload': Settings
          };
          
          pagesObject[pageId] = {
            ...page,
            icon: iconMap[page.icon] || Globe,
            // Ensure all required properties are present
            uptime: page.uptime || 0,
            latency: page.latency || 0,
            issues: page.issues || 0,
            lastTest: page.lastTest || 'Never',
            exists: page.exists !== false,
            status: page.status || (page.exists ? 'connected' : 'not_created')
          };
        });
        
        console.log('📦 Discovered pages:', Object.keys(pagesObject));
        
        setDiscoveredPages(pagesObject);
        setDiscoveredConnections(data.connections || []);
        setLastDiscovery(new Date());
        
        console.log(`✅ Discovery complete! Found ${data.pages.length} components`);
      }
    } catch (error) {
      console.error('❌ Auto-discovery failed:', error);
      // Fall back to static data on error
    } finally {
      setIsDiscovering(false);
    }
  };

  // Create nodes from the discovered page data
  const createNodes = useCallback(() => {
    const nodes: Node[] = [];
    const pagesList = Object.values(discoveredPages);
    
    // Group pages by level
    const levelGroups: { [key: number]: any[] } = {};
    pagesList.forEach(page => {
      if (!levelGroups[page.level]) {
        levelGroups[page.level] = [];
      }
      levelGroups[page.level].push(page);
    });

    // Position nodes vertically by levels
    let yPosition = 0;
    const levelSpacing = 300;
    const nodeSpacing = 280;

    Object.keys(levelGroups).sort((a, b) => Number(a) - Number(b)).forEach(level => {
      const pages = levelGroups[Number(level)];
      const startX = -(pages.length - 1) * nodeSpacing / 2;
      
      pages.forEach((page, index) => {
        nodes.push({
          id: page.id,
          type: 'pageNode',
          position: { 
            x: startX + (index * nodeSpacing), 
            y: yPosition 
          },
          data: {
            ...page,
            label: page.name,
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        });
      });
      
      yPosition += levelSpacing;
    });

    return nodes;
  }, [discoveredPages]);

  // Create edges to connect the levels using discovered connections
  const createEdges = useCallback(() => {
    const edges: Edge[] = [];
    
    discoveredConnections.forEach((connection, index) => {
      // Check if source or target has issues
      const sourceNode = discoveredPages[Object.keys(discoveredPages).find(key => discoveredPages[key].id === connection.from) || ''];
      const targetNode = discoveredPages[Object.keys(discoveredPages).find(key => discoveredPages[key].id === connection.to) || ''];
      
      const hasIssues = (sourceNode?.issues > 0) || (targetNode?.issues > 0);
      const isNotCreated = connection.status === 'not_created' || !sourceNode?.exists || !targetNode?.exists;
      
      const edgeStatus = hasIssues ? 'issues' : (isNotCreated ? 'not_created' : 'connected');
      
      edges.push({
        id: `edge-${index}`,
        source: connection.from,
        target: connection.to,
        sourceHandle: `${connection.from}-bottom`,
        targetHandle: `${connection.to}-top`,
        type: 'smoothstep',
        animated: edgeStatus === 'connected',
        style: { 
          stroke: edgeStatus === 'connected' ? '#22c55e' : 
                  edgeStatus === 'issues' ? '#ef4444' : '#6b7280',
          strokeWidth: 3,
          strokeDasharray: edgeStatus === 'not_created' ? '10,5' : undefined
        },
        markerEnd: {
          type: 'arrowclosed',
          color: edgeStatus === 'connected' ? '#22c55e' : 
                 edgeStatus === 'issues' ? '#ef4444' : '#6b7280',
        },
      });
    });

    return edges;
  }, [discoveredPages, discoveredConnections]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when discovered data changes
  useEffect(() => {
    console.log('🔄 Updating nodes with discovered pages:', Object.keys(discoveredPages).length);
    setNodes(createNodes());
    
    // Make click handler and click counts available globally for nodes
    (window as any).handleCardClick = handleCardClick;
    (window as any).clickCounts = clickCounts;
  }, [discoveredPages, createNodes, setNodes, handleCardClick, clickCounts]);

  useEffect(() => {
    console.log('🔄 Updating edges with discovered connections:', discoveredConnections.length);
    setEdges(createEdges());
  }, [discoveredPages, discoveredConnections, createEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Filter nodes based on search and filters
  const filteredNodes = nodes.filter(node => {
    const name = String(node.data?.name || '');
    const description = String(node.data?.description || '');
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesApp = filterApp === 'all' || node.data?.app === filterApp;
    const matchesStatus = filterStatus === 'all' || node.data?.status === filterStatus;
    
    return matchesSearch && matchesApp && matchesStatus;
  });

  const handleAutoTest = async () => {
    setIsAutoTesting(true);
    // Simulate testing each page
    for (let i = 0; i < nodes.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // Update node status (simulated)
    }
    setIsAutoTesting(false);
  };

  const handleExport = () => {
    const data = {
      nodes: nodes.map(node => ({
        id: node.id,
        name: node.data.name,
        status: node.data.status,
        uptime: node.data.uptime,
        issues: node.data.issues
      })),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'topology-report.json';
    a.click();
  };

  // Show detailed view if selected
  if (showDetailedView && selectedCard) {
    return (
      <UIComponentTreeView
        cardData={selectedCard}
        onBack={() => {
          setShowDetailedView(false);
          setSelectedCard(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Title Bar - Full Width */}
      <div className="w-full bg-background border-b px-4 py-3">
        <div className="text-center">
          <span className="text-2xl font-bold text-foreground">Live Connection Topology Real-time system health monitoring and connection visualization</span>
        </div>
      </div>
      
      {/* Header Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Status Legend with Counts */}
                <div className="flex items-center gap-6 px-4 py-2 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">
                      Connected to database and functioning: {filteredNodes.filter(node => node.data?.status === 'connected').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-sm font-medium">
                      Created/exists but not connected to database: {filteredNodes.filter(node => node.data?.status === 'not_connected').length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">
                      Has errors or issues: {filteredNodes.filter(node => node.data?.status === 'issues' || (node.data?.issues && Number(node.data.issues) > 0)).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm font-medium">
                      Not created/doesn't exist: {filteredNodes.filter(node => node.data?.status === 'not_created').length}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-primary">
                    Total: {filteredNodes.length}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[200px]"
                />
              </div>
              
              <Select value={filterApp} onValueChange={setFilterApp}>
                <SelectTrigger className="w-[120px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Apps</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="ios">iOS</SelectItem>
                  <SelectItem value="android">Android</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="issues">Issues</SelectItem>
                  <SelectItem value="not_created">Not Created</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={handleAutoTest} 
                disabled={isAutoTesting}
                className="flex items-center gap-2"
              >
                {isAutoTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                {isAutoTesting ? 'Testing...' : 'Auto Test'}
              </Button>

              <Button 
                onClick={discoverSystemComponents} 
                disabled={isDiscovering}
                variant="outline" 
                className="flex items-center gap-2"
              >
                {isDiscovering ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {isDiscovering ? 'Discovering...' : 'Discover'}
              </Button>

              <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              
              {lastDiscovery && (
                <div className="text-xs text-muted-foreground">
                  Last scan: {lastDiscovery.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* React Flow Topology */}
      <div style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          className="bg-background"
        >
          <Controls 
            position="top-right" 
            style={{
              top: '80px',
              right: '20px',
              zIndex: 1001,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            showZoom={true}
            showFitView={true}
            showInteractive={true}
          />
          <MiniMap 
            nodeColor={(node) => {
              const hasIssues = Number(node.data?.issues || 0) > 0;
              if (hasIssues) return '#ef4444';
              
              switch (node.data?.status) {
                case 'connected': return '#22c55e';
                case 'issues': return '#ef4444';
                case 'not_created': return '#6b7280';
                default: return '#94a3b8';
              }
            }}
            className="bg-background"
            position="bottom-right"
            style={{
              bottom: '10px',
              right: '10px',
              zIndex: 999
            }}
          />
          <Background />
        </ReactFlow>
      </div>

    </div>
  );
}