import { 
  Settings, 
  Bell, 
  Palette, 
  Camera, 
  Shield, 
  Lock, 
  MonitorCog, 
  MessageSquare, 
  UserX, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  DollarSign, 
  Briefcase, 
  Award, 
  CreditCard, 
  Trash2 
} from 'lucide-react';
import React from 'react';

interface AvatarStyles {
  border: string;
  iconOverlayBg: string;
  iconColor: string;
}

interface HeaderConfig {
  headerText: string | ((userInfo: any) => string);
  name?: string;
  avatarStyles: AvatarStyles;
  containerClasses: string;
  Icon: React.ElementType;
  isVerification?: boolean;
}

export const headerConfig: { [key: string]: HeaderConfig } = {
  profile: {
    headerText: 'Profile Setting',
    avatarStyles: {
      border: 'border-cyan-200',
      iconOverlayBg: 'bg-cyan-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-cyan-50 p-4 rounded-xl',
    Icon: Settings,
  },
  general: {
    headerText: 'General Setting',
    avatarStyles: {
      border: 'border-gray-300',
      iconOverlayBg: 'bg-gray-400',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-gray-100 p-4 rounded-xl',
    Icon: Settings,
  },
  notifications: {
    headerText: 'Notification Settings',
    avatarStyles: {
      border: 'border-purple-200',
      iconOverlayBg: 'bg-purple-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-purple-50 p-4 rounded-xl',
    Icon: Bell,
  },
  design: {
    headerText: 'Design',
    avatarStyles: {
      border: 'border-green-200',
      iconOverlayBg: 'bg-green-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-green-50 p-4 rounded-xl',
    Icon: Palette,
  },
  'avatar-and-cover': {
    headerText: 'Avatar & Cover',
    avatarStyles: {
      border: 'border-cyan-200',
      iconOverlayBg: 'bg-cyan-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-cyan-50 p-4 rounded-xl',
    Icon: Camera,
  },
  privacy: {
    headerText: 'Privacy Setting',
    avatarStyles: {
      border: 'border-indigo-200',
      iconOverlayBg: 'bg-indigo-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-indigo-50 p-4 rounded-xl',
    Icon: Shield,
  },
  password: {
    headerText: 'Change Password',
    avatarStyles: {
      border: 'border-red-200',
      iconOverlayBg: 'bg-red-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-red-50 p-4 rounded-xl',
    Icon: Lock,
  },
  'manage-sessions': {
    headerText: 'Manage Sessions',
    avatarStyles: {
      border: 'border-violet-200',
      iconOverlayBg: 'bg-violet-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-violet-50 p-4 rounded-xl',
    Icon: MonitorCog,
  },
  'two-factor': {
    headerText: 'Two-factor authentication',
    avatarStyles: {
      border: 'border-orange-200',
      iconOverlayBg: 'bg-orange-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-orange-50 p-4 rounded-xl',
    Icon: MessageSquare,
  },
  'blocked-users': {
    headerText: 'Blocked Users',
    avatarStyles: {
      border: 'border-red-200',
      iconOverlayBg: 'bg-red-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-red-50 p-4 rounded-xl',
    Icon: UserX,
  },
  information: {
    headerText: 'My Information',
    avatarStyles: {
      border: 'border-teal-200',
      iconOverlayBg: 'bg-teal-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-teal-50 p-4 rounded-xl',
    Icon: Calendar,
  },
  addresses: {
    headerText: 'My Addresses',
    avatarStyles: {
      border: 'border-blue-200',
      iconOverlayBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-blue-50 p-4 rounded-xl',
    Icon: Globe,
  },
  verification: {
    headerText: 'Verification of the profile!',
    avatarStyles: {
      border: 'border-blue-200',
      iconOverlayBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-blue-50 p-4 rounded-xl',
    Icon: CheckCircle2,
    isVerification: true,
  },
  monetization: {
    headerText: 'Monetization',
    avatarStyles: {
      border: 'border-green-200',
      iconOverlayBg: 'bg-green-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-green-50 p-4 rounded-xl',
    Icon: DollarSign,
  },
  earnings: {
    headerText: (userInfo) => `My Earnings $${(userInfo.earnings || 0).toFixed(2)}`,
    avatarStyles: {
      border: 'border-emerald-200',
      iconOverlayBg: 'bg-emerald-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-emerald-50 p-4 rounded-xl',
    Icon: Briefcase,
  },
  affiliates: {
    headerText: 'My Affiliates',
    avatarStyles: {
      border: 'border-orange-200',
      iconOverlayBg: 'bg-orange-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-orange-50 p-4 rounded-xl',
    Icon: Award,
  },
  'my-points': {
    headerText: 'My Points',
    avatarStyles: {
      border: 'border-orange-200',
      iconOverlayBg: 'bg-orange-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-orange-50 p-4 rounded-xl',
    Icon: Award,
  },
  wallet: {
    headerText: 'Wallet & Credits',
    avatarStyles: {
      border: 'border-blue-200',
      iconOverlayBg: 'bg-blue-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-blue-50 p-4 rounded-xl',
    Icon: CreditCard,
  },
  'location-preferences': {
    headerText: 'location and languages',
    avatarStyles: {
      border: 'border-slate-300',
      iconOverlayBg: 'bg-slate-400',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-slate-50 p-4 rounded-xl',
    Icon: Globe,
  },
  'delete-account': {
    headerText: 'Delete Account',
    avatarStyles: {
      border: 'border-red-200',
      iconOverlayBg: 'bg-red-500',
      iconColor: 'text-white',
    },
    containerClasses: 'bg-red-50 p-4 rounded-xl',
    Icon: Trash2,
  },
};