
import { 
  Calendar, Users, TrendingUp, MapPin, Gamepad2, Star, 
  CreditCard, ShoppingBag, Target, Briefcase, Globe, 
  Shield, Heart, BarChart3, Clock, Bookmark, Zap, 
  Building, MessageSquare 
} from 'lucide-react';
import VideoIcon from './VideoIcon';

export const menuSections = [
  {
    title: 'Social',
    items: [
      {
        icon: Calendar,
        title: 'Events',
        description: 'Organize or find events and other things to do online and nearby.',
        bgColor: 'bg-red-100',
        iconColor: 'text-red-600'
      },
      {
        icon: Users,
        title: 'Friends',
        description: 'Search for friends or people you may know.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Users,
        title: 'Groups',
        description: 'Connect with people who share your interests.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: TrendingUp,
        title: 'News Feed',
        description: 'See relevant posts from people and Pages you follow.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: TrendingUp,
        title: 'Feeds',
        description: 'See the most recent posts from your friends, groups, Pages and more.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: MapPin,
        title: 'Pages',
        description: 'Discover and connect with businesses on Facebook.',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600'
      }
    ]
  },
  {
    title: 'Entertainment',
    items: [
      {
        icon: Gamepad2,
        title: 'Gaming Video',
        description: 'Watch and connect with your favorite games and streamers.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Gamepad2,
        title: 'Play games',
        description: 'Play your favorite games.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Star,
        title: 'Reels',
        description: 'A video destination personalized to your interests and connections.',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        icon: VideoIcon,
        title: 'Video',
        description: 'A video destination personalized to your interests and connections.',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
      }
    ]
  },
  {
    title: 'Shopping',
    items: [
      {
        icon: CreditCard,
        title: 'Orders and payments',
        description: 'A seamless, secure way to pay on the apps you already use.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: ShoppingBag,
        title: 'Marketplace',
        description: 'Buy and sell in your community.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      }
    ]
  },
  {
    title: 'Professional',
    items: [
      {
        icon: Target,
        title: 'Ads Manager',
        description: 'Create, manage and track the performance of your ads.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Briefcase,
        title: 'Meta Business Suite',
        description: 'Manage your business across Facebook and Instagram.',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    ]
  },
  {
    title: 'Community Resources',
    items: [
      {
        icon: Globe,
        title: 'Climate Science Center',
        description: 'Learn about climate change and its effects.',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      },
      {
        icon: Shield,
        title: 'Crisis response',
        description: 'Find the latest updates for recent crises happening around the world.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Heart,
        title: 'Fundraisers',
        description: 'Donate and raise money for nonprofits and personal causes.',
        bgColor: 'bg-orange-100',
        iconColor: 'text-orange-600'
      }
    ]
  },
  {
    title: 'Personal',
    items: [
      {
        icon: BarChart3,
        title: 'Recent ad activity',
        description: 'See all the ads you interacted with on Facebook.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Clock,
        title: 'Memories',
        description: 'Browse your old photos, videos and posts on Facebook.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Bookmark,
        title: 'Saved',
        description: 'Find posts, photos and videos that you saved for later.',
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-600'
      },
      {
        icon: Heart,
        title: 'Dating',
        description: 'Start a meaningful relationship.',
        bgColor: 'bg-pink-100',
        iconColor: 'text-pink-600'
      }
    ]
  },
  {
    title: 'More from Meta',
    items: [
      {
        icon: Zap,
        title: 'Meta AI',
        description: 'Ask questions, brainstorm ideas, create any image you can imagine and more.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: Building,
        title: 'Meta Quest 3S',
        description: 'Meta Quest 3S is now here.',
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      },
      {
        icon: MessageSquare,
        title: 'Phone',
        description: 'Message and call people privately on your phone or web.',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      }
    ],
    isLast: true
  }
];
