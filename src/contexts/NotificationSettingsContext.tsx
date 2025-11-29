import React, { createContext, useContext, useState, useEffect } from 'react';

export type NotificationChannel = 'inApp' | 'push' | 'email';
export type NotificationFrequency = 'realtime' | 'smart_digest_hourly' | 'smart_digest_daily' | 'smart_digest_weekly' | 'only_offline' | 'mentions_only';
export type PriorityLevel = 'high' | 'normal' | 'low';

export interface CategoryChannelSettings {
  inApp: boolean;
  push: boolean;
  email: boolean;
}

export interface NotificationSettings {
  // Channels
  channels: {
    inApp: boolean;
    push: boolean;
    email: boolean;
  };
  
  // Frequency & Delivery
  frequency: NotificationFrequency;
  rateLimit: number; // max notifications per hour (0-100)
  
  // Do Not Disturb
  dnd: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: boolean[]; // 7 days, Sunday=0
    allowPriority: boolean;
  };
  
  // Priority
  prioritySettings: {
    showHighAtTop: boolean;
    categories: {
      mentions: PriorityLevel;
      directMessages: PriorityLevel;
      security: PriorityLevel;
      comments: PriorityLevel;
      requests: PriorityLevel;
      reactions: PriorityLevel;
      suggestions: PriorityLevel;
    };
  };
  
  // Event Categories (channel matrix)
  categories: {
    directMessages: CategoryChannelSettings;
    mentions: CategoryChannelSettings;
    comments: CategoryChannelSettings;
    reactions: CategoryChannelSettings;
    shares: CategoryChannelSettings;
    follows: CategoryChannelSettings;
    groups: CategoryChannelSettings;
    events: CategoryChannelSettings;
    marketplace: CategoryChannelSettings;
    recommendations: CategoryChannelSettings;
    security: CategoryChannelSettings;
  };
  
  // Security & Reliability
  security: {
    newLogin: boolean;
    passwordChange: boolean;
    sessionExpired: boolean;
  };
  verifiedContactsOnly: boolean;
  
  // Digest & Summaries
  digest: {
    dailyRecap: boolean;
    dailyTime: string;
    weeklySummary: boolean;
    weeklyDay: number; // 0-6
    weeklyTime: string;
    includeTopMentions: boolean;
    includeTrendingPosts: boolean;
    includeUnresolvedRequests: boolean;
  };
  
  // Privacy & Read receipts
  privacy: {
    showReadReceipts: boolean;
    showActiveStatus: boolean;
  };
  
  // Accessibility
  accessibility: {
    sound: boolean;
    soundType: string;
    vibration: boolean;
    vibrationIntensity: number; // 1-3
    badgeCount: boolean;
    largeText: boolean;
  };
  
  // Data & Retention
  retention: {
    keepDays: number; // 30, 90, 365
  };
  
  // Localization
  localization: {
    language: string;
    timeFormat: '12h' | '24h';
    timezone: string;
  };
}

const defaultSettings: NotificationSettings = {
  channels: {
    inApp: true,
    push: true,
    email: true,
  },
  
  frequency: 'realtime',
  rateLimit: 50,
  
  dnd: {
    enabled: false,
    startTime: '23:00',
    endTime: '07:00',
    days: [true, true, true, true, true, true, true],
    allowPriority: true,
  },
  
  prioritySettings: {
    showHighAtTop: true,
    categories: {
      mentions: 'high',
      directMessages: 'high',
      security: 'high',
      comments: 'normal',
      requests: 'normal',
      reactions: 'low',
      suggestions: 'low',
    },
  },
  
  categories: {
    directMessages: { inApp: true, push: true, email: true },
    mentions: { inApp: true, push: true, email: false },
    comments: { inApp: true, push: false, email: false },
    reactions: { inApp: true, push: false, email: false },
    shares: { inApp: true, push: false, email: false },
    follows: { inApp: true, push: false, email: false },
    groups: { inApp: true, push: false, email: false },
    events: { inApp: true, push: true, email: false },
    marketplace: { inApp: true, push: true, email: true },
    recommendations: { inApp: true, push: false, email: false },
    security: { inApp: true, push: true, email: true },
  },
  
  security: {
    newLogin: true,
    passwordChange: true,
    sessionExpired: true,
  },
  verifiedContactsOnly: true,
  
  digest: {
    dailyRecap: false,
    dailyTime: '09:00',
    weeklySummary: true,
    weeklyDay: 1, // Monday
    weeklyTime: '09:00',
    includeTopMentions: true,
    includeTrendingPosts: true,
    includeUnresolvedRequests: true,
  },
  
  privacy: {
    showReadReceipts: false,
    showActiveStatus: false,
  },
  
  accessibility: {
    sound: true,
    soundType: 'default',
    vibration: true,
    vibrationIntensity: 2,
    badgeCount: true,
    largeText: false,
  },
  
  retention: {
    keepDays: 30,
  },
  
  localization: {
    language: 'en',
    timeFormat: '12h',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
};

interface NotificationSettingsContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  resetSettings: () => void;
  isInQuietHours: () => boolean;
}

const NotificationSettingsContext = createContext<NotificationSettingsContextType | undefined>(undefined);

export const useNotificationSettings = () => {
  const context = useContext(NotificationSettingsContext);
  if (!context) {
    throw new Error('useNotificationSettings must be used within a NotificationSettingsProvider');
  }
  return context;
};

export const NotificationSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('notificationSettings');
  };

  const isInQuietHours = (): boolean => {
    if (!settings.dnd.enabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDay = now.getDay();
    
    // Check if current day is enabled
    if (!settings.dnd.days[currentDay]) return false;
    
    const [startHour, startMin] = settings.dnd.startTime.split(':').map(Number);
    const [endHour, endMin] = settings.dnd.endTime.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  const value = {
    settings,
    updateSettings,
    resetSettings,
    isInQuietHours,
  };

  return (
    <NotificationSettingsContext.Provider value={value}>
      {children}
    </NotificationSettingsContext.Provider>
  );
};