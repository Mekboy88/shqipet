import { useState, useEffect } from 'react';

interface ProfileSettingsData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  website: string;
  country: string;
  timezone: string;
  two_factor_enabled: boolean;
  two_factor_method: string;
  avatar_url?: string;
}

export const useMobileProfileSettings = () => {
  const [userInfo, setUserInfo] = useState<ProfileSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Simulate API call - replace with actual data fetching
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        setUserInfo({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          bio: 'Mobile app developer and tech enthusiast',
          website: 'https://johndoe.dev',
          country: 'US',
          timezone: 'America/New_York',
          two_factor_enabled: false,
          two_factor_method: '',
          avatar_url: ''
        });
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const saveSettings = async (data: ProfileSettingsData) => {
    setSaving(true);
    try {
      // Simulate API call - replace with actual save logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local state
      setUserInfo(data);
      
      console.log('Settings saved:', data);
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateUserInfo = (updates: Partial<ProfileSettingsData>) => {
    setUserInfo(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    userInfo,
    setUserInfo,
    loading,
    saving,
    saveSettings,
    updateUserInfo
  };
};