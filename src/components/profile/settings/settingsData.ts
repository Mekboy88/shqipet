
import { 
  Settings, 
  User, 
  Bell, 
  Camera,
  Shield,
  Lock,
  MessageSquare,
  Calendar,
  Briefcase,
  Globe,
  CreditCard,
  UserX,
  DollarSign,
  Award,
  Trash2,
  MonitorCog,
  MapPin
} from 'lucide-react';

export const settingsSections = [
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    color: 'text-cyan-600'
  },
  {
    id: 'avatar-and-cover',
    label: 'Avatar & Cover',
    icon: Camera,
    color: 'text-cyan-600'
  },
  {
    id: 'notifications',
    label: 'Notification Settings',
    icon: Bell,
    color: 'text-purple-600'
  },
  {
    id: 'privacy',
    label: 'Privacy',
    icon: Shield,
    color: 'text-indigo-600',
    divider: true
  },
  {
    id: 'password',
    label: 'Password',
    icon: Lock,
    color: 'text-red-600'
  },
  {
    id: 'manage-sessions',
    label: 'Manage Sessions',
    icon: MonitorCog,
    color: 'text-violet-600'
  },
  {
    id: 'two-factor',
    label: 'Two-factor authentication',
    icon: MessageSquare,
    color: 'text-orange-600'
  },
  {
    id: 'blocked-users',
    label: 'Blocked Users',
    icon: UserX,
    color: 'text-gray-600'
  },
  {
    id: 'information',
    label: 'My Information',
    icon: Calendar,
    color: 'text-teal-600',
    divider: true
  },
  {
    id: 'addresses',
    label: 'My Addresses',
    icon: Globe,
    color: 'text-blue-600'
  },
  {
    id: 'location-preferences',
    label: 'location and languages',
    icon: MapPin,
    color: 'text-purple-600'
  },
  {
    id: 'verification',
    label: 'Verification',
    icon: Award,
    color: 'text-yellow-600'
  },
  {
    id: 'monetization',
    label: 'Monetization',
    icon: DollarSign,
    color: 'text-green-600',
    divider: true
  },
  {
    id: 'earnings',
    label: 'My Earnings',
    icon: Briefcase,
    color: 'text-emerald-600'
  },
  {
    id: 'affiliates',
    label: 'My Affiliates',
    icon: Award,
    color: 'text-orange-600'
  },
  {
    id: 'wallet',
    label: 'Wallet & Credits',
    icon: CreditCard,
    color: 'text-blue-600'
  },
  {
    id: 'delete-account',
    label: 'Delete Account',
    icon: Trash2,
    color: 'text-red-600',
    divider: true
  }
];
