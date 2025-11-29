import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface I18nSettings {
  id: number;
  default_locale: string;
  fallback_locale: string;
  detection_order: string[];
  version: number;
  force_admin_english: boolean;
  sync_user_settings: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useI18nSettings = () => {
  const [settings, setSettings] = useState<I18nSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('i18n_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      // Parse detection_order JSON
      const parsedSettings: I18nSettings = {
        ...data,
        detection_order: Array.isArray(data.detection_order) 
          ? data.detection_order as string[]
          : ['path', 'cookie', 'browser', 'default', 'fallback']
      };
      
      setSettings(parsedSettings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      console.error('Error fetching i18n settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDefaults = async (defaultLocale: string, fallbackLocale: string) => {
    try {
      const { error } = await supabase.rpc('admin_set_defaults', {
        new_default_locale: defaultLocale,
        new_fallback_locale: fallbackLocale
      });

      if (error) throw error;
      
      // Refetch to get updated data
      await fetchSettings();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update defaults');
    }
  };

  const updateDetectionOrder = async (detectionOrder: string[]) => {
    try {
      const { error } = await supabase.rpc('admin_set_defaults', {
        new_default_locale: settings?.default_locale || 'en-GB',
        new_fallback_locale: settings?.fallback_locale || 'en-GB',
        new_detection_order: detectionOrder
      });

      if (error) throw error;
      
      // Refetch to get updated data
      await fetchSettings();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update detection order');
    }
  };

  const updateSystemSettings = async (updates: {
    force_admin_english?: boolean;
    sync_user_settings?: boolean;
  }) => {
    try {
      const { error } = await supabase
        .from('i18n_settings')
        .update(updates)
        .eq('id', 1);

      if (error) throw error;
      
      // Refetch to get updated data
      await fetchSettings();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update system settings');
    }
  };

  const getPublicSettings = async () => {
    try {
      const { data, error } = await supabase.rpc('public_get_language_settings');
      if (error) throw error;
      return data?.[0] || null;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get public settings');
    }
  };

  const bumpVersion = async () => {
    try {
      const { error } = await supabase
        .from('i18n_settings')
        .update({ version: (settings?.version || 0) + 1 })
        .eq('id', 1);

      if (error) throw error;
      await fetchSettings();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to bump version');
    }
  };

  useEffect(() => {
    fetchSettings();

    // Set up real-time subscription
    const channel = supabase
      .channel('i18n_settings_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'i18n_settings'
        },
        () => {
          fetchSettings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
    error,
    updateDefaults,
    updateDetectionOrder,
    updateSystemSettings,
    getPublicSettings,
    bumpVersion,
    refetch: fetchSettings
  };
};