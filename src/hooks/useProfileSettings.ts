import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { profileSettingsCache, prefetchProfileSettings, updateProfileSettingsCache, type ProfileSettingsData as CacheProfileSettingsData } from '@/lib/profileSettingsCache';

export type ProfileSettingsData = CacheProfileSettingsData;

export const useProfileSettings = () => {
  const { user } = useAuth();
  const initial = profileSettingsCache.get();
  const [userInfo, setUserInfo] = useState<ProfileSettingsData>(initial.userInfo || {});
  const [loading, setLoading] = useState<boolean>(initial.loading);
  const [saving, setSaving] = useState<boolean>(initial.saving);
  const [dataFetched, setDataFetched] = useState<boolean>(initial.dataFetched);

  const loadSettings = async () => {
    if (!user) return;
    // Always refresh from DB to keep names in sync
    const cached = profileSettingsCache.get();
    try {
      setLoading(true);
      await prefetchProfileSettings(user.id);
      const after = profileSettingsCache.get();
      setUserInfo(after.userInfo || {});
      setLoading(after.loading);
      setDataFetched(after.dataFetched);
    } catch (error) {
      console.error('Error loading profile settings:', error);
      toast.error('Failed to load profile settings');
      setLoading(false);
    }
  };

  const saveSettings = async (data: Partial<ProfileSettingsData>) => {
    if (!user) return false;

    try {
      setSaving(true);
      console.log('💾 Saving profile settings:', data);
      console.log('👤 User ID:', user.id);

      // Save directly to profiles table since there's no profile_settings table
      const { error } = await supabase
        .from('profiles')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving profile data:', error);
        toast.error('Failed to save profile data');
        return false;
      }

      console.log('✅ Successfully saved to profiles table');

      // Sync Supabase auth user metadata so Display name shows in dashboard
      if (data.first_name !== undefined || data.last_name !== undefined || data.username !== undefined) {
        const currentFirst = (user.user_metadata as any)?.first_name || '';
        const currentLast = (user.user_metadata as any)?.last_name || '';
        const nextFirst = data.first_name !== undefined ? data.first_name || '' : currentFirst;
        const nextLast = data.last_name !== undefined ? data.last_name || '' : currentLast;
        const fullName = `${nextFirst} ${nextLast}`.trim();
        try {
          await supabase.auth.updateUser({
            data: {
              first_name: nextFirst,
              last_name: nextLast,
              full_name: fullName,
              username: data.username !== undefined ? data.username : (user.user_metadata as any)?.username,
            }
          });
          console.log('✅ Auth user metadata synced for display name');
        } catch (e) {
          console.warn('⚠️ Failed to sync auth metadata:', e);
        }
      }

      // All data is now saved directly to profiles table, no need for separate update
      // Profile data was already updated in the first query above

      // Update cache and local state immediately
      updateProfileSettingsCache(data);
      setUserInfo(prev => ({ ...prev, ...data }));

      toast.success('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving profile settings:', error);
      toast.error('Failed to save settings');
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Subscribe to cache so all hook users stay in sync
    const unsubscribe = profileSettingsCache.subscribe(() => {
      const s = profileSettingsCache.get();
      setUserInfo(s.userInfo || {});
      setLoading(s.loading);
      setDataFetched(s.dataFetched);
    });

    if (user) {
      // Prime with basic user info immediately
      setUserInfo(prev => ({
        user_id: user.id,
        email: user.email || prev.email || '',
        first_name: user.user_metadata?.first_name || prev.first_name || '',
        last_name: user.user_metadata?.last_name || prev.last_name || '',
        username: prev.username || '',
        role: prev.role || 'user',
        email_verified: !!user.email_confirmed_at,
        phone_verified: !!user.phone_confirmed_at,
      }));
      // Always prefetch latest profile/settings from DB to ensure gender is loaded
      prefetchProfileSettings(user.id).then(() => {
        console.log('✅ Profile settings prefetch completed');
      });
    } else {
      // Reset on logout
      setUserInfo({});
      setLoading(false);
      setDataFetched(false);
    }

    return unsubscribe;
  }, [user]);

  return {
    userInfo,
    setUserInfo: (updater: any) => {
      if (typeof updater === 'function') {
        setUserInfo((prev: any) => {
          const next = updater(prev);
          updateProfileSettingsCache(next);
          return next;
        });
      } else {
        setUserInfo(updater);
        updateProfileSettingsCache(updater);
      }
    },
    loading,
    saving,
    saveSettings,
    loadSettings
  };
};