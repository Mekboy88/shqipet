import { MenuItem } from './types';
import { Globe, Languages, Bot } from './icons';

export const devToolsMenuItems: MenuItem[] = [
  {
    id: 'gaming-platform',
    label: '🎮 Gaming Platform',
    icon: Globe,
    colorVariant: 'purpleGold',
    submenu: [
      { id: 'game-library', label: '🕹️ Game Library', href: '/admin/gaming/library' },
      { id: 'leaderboards', label: '🏆 Leaderboards', href: '/admin/gaming/leaderboards' },
      { id: 'achievements', label: '🎯 Achievements', href: '/admin/gaming/achievements' },
      { id: 'gaming-communities', label: '👥 Gaming Communities', href: '/admin/gaming/communities' },
      { id: 'game-development', label: '🎮 Game Development', href: '/admin/gaming/development' },
      { id: 'gaming-analytics', label: '📊 Gaming Analytics', href: '/admin/gaming/analytics' },
      { id: 'game-monetization', label: '💰 Game Monetization', href: '/admin/gaming/monetization' },
      { id: 'tournaments', label: '🎪 Tournaments', href: '/admin/gaming/tournaments' },
      { id: 'live-streaming-games', label: '🎮 Live Streaming', href: '/admin/gaming/streaming' },
      { id: 'game-reviews', label: '🎯 Game Reviews', href: '/admin/gaming/reviews' }
    ]
  },
  {
    id: 'live-streaming',
    label: '📺 Live Streaming',
    icon: Languages,
    colorVariant: 'maroonBeige',
    submenu: [
      { id: 'live-broadcast', label: '📹 Live Broadcast', href: '/admin/streaming/broadcast' },
      { id: 'audio-streaming', label: '🎙️ Audio Streaming', href: '/admin/streaming/audio' },
      { id: 'stream-analytics', label: '📊 Stream Analytics', href: '/admin/streaming/analytics' },
      { id: 'monetization', label: '💰 Monetization', href: '/admin/streaming/monetization' },
      { id: 'audience-management', label: '👥 Audience Management', href: '/admin/streaming/audience' },
      { id: 'stream-scheduling', label: '🎯 Stream Scheduling', href: '/admin/streaming/scheduling' },
      { id: 'stream-notifications', label: '🔔 Stream Notifications', href: '/admin/streaming/notifications' },
      { id: 'gaming-streams', label: '🎮 Gaming Streams', href: '/admin/streaming/gaming' },
      { id: 'educational-streams', label: '📚 Educational Streams', href: '/admin/streaming/education' },
      { id: 'music-streams', label: '🎵 Music Streams', href: '/admin/streaming/music' }
    ]
  },
  {
    id: 'entertainment-hub',
    label: '🎪 Entertainment Hub',
    icon: Bot,
    colorVariant: 'navyOrange',
    submenu: [
      { id: 'virtual-events', label: '🎭 Virtual Events', href: '/admin/entertainment/events' },
      { id: 'karaoke', label: '🎤 Karaoke', href: '/admin/entertainment/karaoke' },
      { id: 'board-games', label: '🎲 Board Games', href: '/admin/entertainment/board-games' },
      { id: 'card-games', label: '🃏 Card Games', href: '/admin/entertainment/card-games' },
      { id: 'virtual-reality', label: '🎪 Virtual Reality', href: '/admin/entertainment/vr' },
      { id: 'trivia-games', label: '🎯 Trivia Games', href: '/admin/entertainment/trivia' },
      { id: 'art-galleries', label: '🎨 Art Galleries', href: '/admin/entertainment/art' },
      { id: 'music-concerts', label: '🎵 Music Concerts', href: '/admin/entertainment/concerts' },
      { id: 'movie-nights', label: '🎬 Movie Nights', href: '/admin/entertainment/movies' },
      { id: 'comedy-shows', label: '🎪 Comedy Shows', href: '/admin/entertainment/comedy' }
    ]
  },
  {
    id: 'transportation-delivery',
    label: '🚗 Transportation & Delivery',
    icon: Globe,
    colorVariant: 'forestGreen',
    submenu: [
      { id: 'ride-sharing', label: '🚗 Ride Sharing', href: '/admin/transport/rideshare' },
      { id: 'delivery-services', label: '🚚 Delivery Services', href: '/admin/transport/delivery' },
      { id: 'bike-sharing', label: '🚲 Bike Sharing', href: '/admin/transport/bikes' },
      { id: 'scooter-rental', label: '🛵 Scooter Rental', href: '/admin/transport/scooters' },
      { id: 'package-tracking', label: '📦 Package Tracking', href: '/admin/transport/tracking' },
      { id: 'route-optimization', label: '🗺️ Route Optimization', href: '/admin/transport/routes' },
      { id: 'fare-calculator', label: '💰 Fare Calculator', href: '/admin/transport/fares' },
      { id: 'driver-management', label: '👤 Driver Management', href: '/admin/transport/drivers' },
      { id: 'transport-analytics', label: '📊 Transport Analytics', href: '/admin/transport/analytics' },
      { id: 'safety-features', label: '🚨 Safety Features', href: '/admin/transport/safety' }
    ]
  }
];