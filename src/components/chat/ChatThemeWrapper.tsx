import React from 'react';
import { useChatTheme } from '@/contexts/ChatThemeContext';

interface ChatThemeWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const ChatThemeWrapper: React.FC<ChatThemeWrapperProps> = ({ children, className = '' }) => {
  const { chatTheme } = useChatTheme();

  const themeClasses = {
    'coral-reef': 'theme-coral-reef',
    'sage-green': 'theme-sage-green',
    'amethyst': 'theme-amethyst',
    'peach-cream': 'theme-peach-cream',
    'rose-quartz': 'theme-rose-quartz',
    'seafoam': 'theme-seafoam',
    'honey-amber': 'theme-honey-amber',
    'steel-blue': 'theme-steel-blue',
    'snow-white': 'theme-snow-white',
    'warning-red': 'theme-warning-red',
    'twilight-indigo': 'theme-twilight-indigo',
    'notification-clean': 'theme-notification-clean',
    'crimson-feed': 'theme-crimson-feed'
  };

  return (
    	<div className={`chat-theme-scope ${themeClasses[chatTheme] || ''} ${className}`}>
      {children}
    </div>
  );
};

export default ChatThemeWrapper;