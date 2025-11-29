
import { MenuItem } from './types';
import { Package, MessageSquare } from './icons';

export const contentMenuItems: MenuItem[] = [
  {
    id: 'content-management',
    label: '📋 Content Management',
    icon: Package,
    colorVariant: 'greenTan',
    submenu: [
      { id: 'posts-management', label: '📝 Posts Management', href: '/admin/content/posts' },
      { id: 'media-library', label: '📸 Media Library', href: '/admin/content/media' },
      { id: 'pages-management', label: '📑 Pages Management', href: '/admin/content/pages' },
      { id: 'blog-management', label: '📰 Blog Management', href: '/admin/content/blog' },
      { id: 'music-content', label: '🎵 Music Content', href: '/admin/content/music' },
      { id: 'books-content', label: '📚 Books Content', href: '/admin/content/books' },
      { id: 'saved-posts', label: '💾 Saved Posts', href: '/admin/content/saved' },
      { id: 'popular-posts', label: '🔥 Popular Posts', href: '/admin/content/popular' },
      { id: 'memories', label: '💭 Memories', href: '/admin/content/memories' },
      { id: 'how-are-you-posts', label: '🤔 How Are You Posts', href: '/admin/content/how-are-you' },
      { id: 'shared-content', label: '🔗 Shared Content', href: '/admin/content/shared' }
    ]
  },
  {
    id: 'social-networks',
    label: '📱 Social Networks & Community',
    icon: MessageSquare,
    colorVariant: 'slateRust',
    submenu: [
      { id: 'home-feed', label: '🏠 Home Feed', href: '/admin/social/home' },
      { id: 'albums', label: '📸 Albums', href: '/admin/social/albums' },
      { id: 'watch-videos', label: '👀 Watch (Videos)', href: '/admin/social/watch' },
      { id: 'reels', label: '🎬 Reels', href: '/admin/social/reels' },
      { id: 'marketplace', label: '🛒 Marketplace', href: '/admin/social/marketplace' },
      { id: 'dating', label: '💕 Dating', href: '/admin/social/dating' },
      { id: 'hotels', label: '🏨 Hotels', href: '/admin/social/hotels' },
      { id: 'restaurant', label: '🍽️ Restaurant', href: '/admin/social/restaurant' },
      { id: 'takeout-food', label: '🥡 Takeout Food', href: '/admin/social/takeout' },
      { id: 'games', label: '🎮 Games', href: '/admin/social/games' },
      { id: 'forum', label: '💬 Forum', href: '/admin/social/forum' },
      { id: 'movies', label: '🎭 Movies', href: '/admin/social/movies' },
      { id: 'jobs', label: '💼 Jobs', href: '/admin/social/jobs' },
      { id: 'offers', label: '🎁 Offers', href: '/admin/social/offers' },
      { id: 'learn-together', label: '📚 Learn Together', href: '/admin/social/learn' },
      { id: 'discover-places', label: '🗺️ Discover Places', href: '/admin/social/discover' },
      { id: 'proud-country', label: '🏆 Proud of the Country', href: '/admin/social/proud' },
      { id: 'anonymous-report', label: '🕵️ Anonymous Report', href: '/admin/social/anonymous' }
    ]
  },
  {
    id: 'groups-communities',
    label: '👥 Groups & Communities',
    icon: Package,
    colorVariant: 'purpleGold',
    submenu: [
      { id: 'my-groups', label: '🏘️ My Groups', href: '/admin/groups/my-groups' },
      { id: 'my-pages', label: '📄 My Pages', href: '/admin/groups/my-pages' },
      { id: 'group-management', label: '👥 Group Management', href: '/admin/groups/management' },
      { id: 'community-analytics', label: '📊 Community Analytics', href: '/admin/groups/analytics' },
      { id: 'events-management', label: '🎉 Events Management', href: '/admin/groups/events' },
      { id: 'find-friends', label: '👫 Find Friends', href: '/admin/groups/find-friends' },
      { id: 'directory', label: '📞 Directory', href: '/admin/groups/directory' }
    ]
  },
  {
    id: 'communication-center',
    label: '📞 Communication Center',
    icon: MessageSquare,
    colorVariant: 'maroonBeige',
    submenu: [
      { id: 'direct-messages', label: '💬 Direct Messages', href: '/admin/communication/messages' },
      { id: 'voice-calls', label: '📞 Voice Calls', href: '/admin/communication/voice' },
      { id: 'video-calls', label: '📹 Video Calls', href: '/admin/communication/video' },
      { id: 'email-integration', label: '📧 Email Integration', href: '/admin/communication/email' },
      { id: 'push-notifications', label: '🔔 Push Notifications', href: '/admin/communication/push' },
      { id: 'sms-integration', label: '📱 SMS Integration', href: '/admin/communication/sms' },
      { id: 'ai-chat-assistant', label: '🤖 AI Chat Assistant', href: '/admin/communication/ai-chat' },
      { id: 'voice-broadcasting', label: '📻 Voice Broadcasting', href: '/admin/communication/broadcast' },
      { id: 'podcast-creation', label: '🎙️ Podcast Creation', href: '/admin/communication/podcast' }
    ]
  },
  {
    id: 'multi-language',
    label: '🌐 Multi-Language Support',
    icon: Package,
    colorVariant: 'navyOrange',
    submenu: [
      { id: 'language-selection', label: '🗣️ Language Selection', href: '/admin/language/selection' },
      { id: 'auto-translation', label: '🔄 Auto Translation', href: '/admin/language/translation' },
      { id: 'regional-content', label: '🌍 Regional Content', href: '/admin/language/regional' },
      { id: 'content-localization', label: '📝 Content Localization', href: '/admin/language/localization' },
      { id: 'cultural-adaptation', label: '🎯 Cultural Adaptation', href: '/admin/language/cultural' },
      { id: 'language-analytics', label: '📊 Language Analytics', href: '/admin/language/analytics' },
      { id: 'ai-translation', label: '🤖 AI Translation', href: '/admin/language/ai-translation' },
      { id: 'voice-translation', label: '🗣️ Voice Translation', href: '/admin/language/voice' },
      { id: 'language-learning', label: '📚 Language Learning', href: '/admin/language/learning' },
      { id: 'global-communities', label: '🌐 Global Communities', href: '/admin/language/communities' }
    ]
  }
];
