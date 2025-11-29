import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChatSettingsState {
  // Theme settings
  autoTheme: boolean;
  highContrast: boolean;
  animatedBubbles: boolean;
  gradientMessages: boolean;
  
  // Appearance settings
  fontSize: number;
  messageSpacing: number;
  bubbleRadius: number;
  chatWidth: number;
  fontFamily: string;
  messageAlignment: string;
  showAvatars: boolean;
  showTimestamps: boolean;
  compactMode: boolean;
  emojiSize: number;
  showMessageStatus: boolean;
  
  // Notification settings
  desktopNotifications: boolean;
  mobileNotifications: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  notificationSound: string;
  showPreviews: boolean;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  directMessages: boolean;
  groupMessages: boolean;
  mentionsOnly: boolean;
  
  // Behavior settings
  autoScroll: boolean;
  scrollDelay: number;
  readReceipts: boolean;
  typingIndicators: boolean;
  enterToSend: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  messageHistory: string;
  doubleClickAction: string;
  longPressAction: string;
  swipeActions: boolean;
  quickReactions: boolean;
  smartReplies: boolean;
  
  // Privacy settings
  endToEndEncryption: boolean;
  onlineStatus: boolean;
  lastSeen: string;
  privacyReadReceipts: boolean;
  messageForwarding: boolean;
  groupInvites: string;
  dataBackup: boolean;
  analyticsSharing: boolean;
  screenSecurity: boolean;
  disappearingMessages: string;
}

interface ChatSettingsContextType extends ChatSettingsState {
  updateSetting: <K extends keyof ChatSettingsState>(key: K, value: ChatSettingsState[K]) => void;
  resetToDefaults: () => void;
}

const defaultSettings: ChatSettingsState = {
  // Theme settings
  autoTheme: false,
  highContrast: false,
  animatedBubbles: true,
  gradientMessages: true,
  
  // Appearance settings
  fontSize: 14,
  messageSpacing: 12,
  bubbleRadius: 16,
  chatWidth: 800,
  fontFamily: 'system',
  messageAlignment: 'right',
  showAvatars: true,
  showTimestamps: true,
  compactMode: false,
  emojiSize: 20,
  showMessageStatus: true,
  
  // Notification settings
  desktopNotifications: true,
  mobileNotifications: true,
  soundEnabled: true,
  soundVolume: 70,
  notificationSound: 'default',
  showPreviews: true,
  quietHours: false,
  quietStart: '22:00',
  quietEnd: '08:00',
  directMessages: true,
  groupMessages: true,
  mentionsOnly: false,
  
  // Behavior settings
  autoScroll: true,
  scrollDelay: 500,
  readReceipts: true,
  typingIndicators: true,
  enterToSend: true,
  autoSave: true,
  autoSaveInterval: 30,
  messageHistory: 'unlimited',
  doubleClickAction: 'edit',
  longPressAction: 'menu',
  swipeActions: true,
  quickReactions: true,
  smartReplies: true,
  
  // Privacy settings
  endToEndEncryption: true,
  onlineStatus: true,
  lastSeen: 'contacts',
  privacyReadReceipts: true,
  messageForwarding: true,
  groupInvites: 'contacts',
  dataBackup: true,
  analyticsSharing: false,
  screenSecurity: false,
  disappearingMessages: 'off'
};

const ChatSettingsContext = createContext<ChatSettingsContextType | undefined>(undefined);

export const ChatSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ChatSettingsState>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chat-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load chat settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof ChatSettingsState>(
    key: K,
    value: ChatSettingsState[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('chat-settings');
  };

  const contextValue: ChatSettingsContextType = {
    ...settings,
    updateSetting,
    resetToDefaults
  };

  return (
    <ChatSettingsContext.Provider value={contextValue}>
      {children}
    </ChatSettingsContext.Provider>
  );
};

export const useChatSettings = () => {
  const context = useContext(ChatSettingsContext);
  if (context === undefined) {
    throw new Error('useChatSettings must be used within a ChatSettingsProvider');
  }
  return context;
};