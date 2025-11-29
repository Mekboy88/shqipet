import { MenuItem } from './types';
import { BrainCircuit } from 'lucide-react';

export const aiSmartMenuItems: MenuItem[] = [
  {
    id: 'ai-management',
    label: '🤖 AI Management',
    icon: BrainCircuit,
    colorVariant: 'slateRust',
    submenu: [
      { id: 'ai-configuration', label: '🧠 AI Configuration', href: '/admin/ai/config' },
      { id: 'chatbot-settings', label: '🤖 Chatbot Settings', href: '/admin/ai/chatbot' },
      { id: 'ai-analytics', label: '📊 AI Analytics', href: '/admin/ai/analytics' },
      { id: 'content-recommendations', label: '🎯 Content Recommendations', href: '/admin/ai/recommendations' },
      { id: 'search-ai', label: '🔍 Search AI', href: '/admin/ai/search' },
      { id: 'auto-moderation', label: '📝 Auto-moderation', href: '/admin/ai/moderation' },
      { id: 'ai-content-generation', label: '🎨 AI Content Generation', href: '/admin/ai/content' }
    ]
  }
];