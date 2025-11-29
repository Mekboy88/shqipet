import React, { createContext, useContext, useState, useEffect } from 'react';

export type ChatThemeMode = 'coral-reef' | 'sage-green' | 'amethyst' | 'peach-cream' | 'rose-quartz' | 'seafoam' | 'honey-amber' | 'steel-blue' | 'snow-white' | 'warning-red' | 'twilight-indigo' | 'notification-clean' | 'crimson-feed';

interface ChatThemeContextType {
  chatTheme: ChatThemeMode;
  setChatTheme: (theme: ChatThemeMode) => void;
}

const ChatThemeContext = createContext<ChatThemeContextType | undefined>(undefined);

export const ChatThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatTheme, setChatThemeState] = useState<ChatThemeMode>('coral-reef');

  // Load chat theme from localStorage on mount
  useEffect(() => {
    const savedChatTheme = localStorage.getItem('chat-only-theme') as ChatThemeMode;
    if (savedChatTheme) {
      setChatThemeState(savedChatTheme);
    }
  }, []);

  // Save chat theme to localStorage whenever it changes
  const setChatTheme = (theme: ChatThemeMode) => {
    setChatThemeState(theme);
    localStorage.setItem('chat-only-theme', theme);
  };

  return (
    <ChatThemeContext.Provider value={{ chatTheme, setChatTheme }}>
      {children}
    </ChatThemeContext.Provider>
  );
};

export const useChatTheme = () => {
  const context = useContext(ChatThemeContext);
  if (context === undefined) {
    throw new Error('useChatTheme must be used within a ChatThemeProvider');
  }
  return context;
};
