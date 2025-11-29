import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag: string;
  is_default: boolean;
  sort_order: number;
}

export interface AdminLanguageSettings {
  id: string;
  language_code: string;
  language_name: string;
  native_name: string;
  flag_emoji: string;
  is_enabled: boolean;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useLanguageSettings = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [adminLanguages, setAdminLanguages] = useState<AdminLanguageSettings[]>([]);
  const [loading, setLoading] = useState(false); // Start with false for instant display
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cache management
  const getCachedData = () => {
    try {
      const cachedAdmin = localStorage.getItem('admin_languages_cache');
      const cachedEnabled = localStorage.getItem('enabled_languages_cache');
      
      if (cachedAdmin && cachedEnabled) {
        const adminData = JSON.parse(cachedAdmin);
        const enabledData = JSON.parse(cachedEnabled);
        
        // Check if cache is recent (within 5 minutes)
        if (Date.now() - adminData.timestamp < 5 * 60 * 1000 && 
            Date.now() - enabledData.timestamp < 5 * 60 * 1000) {
          return {
            adminLanguages: adminData.data,
            languages: enabledData.data
          };
        }
      }
    } catch (err) {
      console.warn('Failed to parse cached data:', err);
    }
    return null;
  };

  const setCachedData = (adminData: AdminLanguageSettings[], languageData: Language[]) => {
    try {
      const timestamp = Date.now();
      localStorage.setItem('admin_languages_cache', JSON.stringify({
        data: adminData,
        timestamp
      }));
      localStorage.setItem('enabled_languages_cache', JSON.stringify({
        data: languageData,
        timestamp
      }));
    } catch (err) {
      console.warn('Failed to cache data:', err);
    }
  };

  // Fetch enabled languages for users
  const fetchEnabledLanguages = async () => {
    try {
      const { data, error } = await supabase.rpc('get_enabled_languages');
      
      if (error) throw error;

      const formattedLanguages: Language[] = data.map((lang: any) => ({
        code: lang.code,
        name: lang.name,
        native_name: lang.native_name || lang.name,
        flag: lang.flag,
        is_default: lang.is_default,
        sort_order: lang.sort_order
      }));

      setLanguages(formattedLanguages);
      setError(null);
      
      // Update cache with current adminLanguages state
      const currentAdminLanguages = adminLanguages.length > 0 ? adminLanguages : [];
      setCachedData(currentAdminLanguages, formattedLanguages);
    } catch (err) {
      console.error('Error fetching enabled languages:', err);
      setError('Failed to load languages');
      setLanguages([]);
    }
  };

  // Fetch all languages for admin management
  const fetchAdminLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_language_settings')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setAdminLanguages(data || []);
      
      // Update cache with current languages state
      const currentLanguages = languages.length > 0 ? languages : [];
      setCachedData(data || [], currentLanguages);
    } catch (err) {
      console.error('Error fetching admin languages:', err);
      toast({
        title: 'Error',
        description: 'Failed to load admin language settings',
        variant: 'destructive',
      });
    }
  };

  // Update language settings (admin only)
  const updateLanguageSettings = async (
    id: string, 
    updates: Partial<AdminLanguageSettings>
  ) => {
    try {
      const { error } = await supabase
        .from('admin_language_settings')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchAdminLanguages();
      await fetchEnabledLanguages();
      
      toast({
        title: 'Success',
        description: 'Language settings updated successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error updating language settings:', err);
      toast({
        title: 'Error',
        description: 'Failed to update language settings',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Add new language (admin only)
  const addLanguage = async (language: Omit<AdminLanguageSettings, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('admin_language_settings')
        .insert([language]);
      
      if (error) throw error;
      
      await fetchAdminLanguages();
      await fetchEnabledLanguages();
      
      toast({
        title: 'Success',
        description: 'Language added successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error adding language:', err);
      toast({
        title: 'Error',
        description: 'Failed to add language',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete language (admin only)
  const deleteLanguage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_language_settings')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchAdminLanguages();
      await fetchEnabledLanguages();
      
      toast({
        title: 'Success',
        description: 'Language deleted successfully',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting language:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete language',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    const loadLanguages = async () => {
      // First, try to load from cache for instant display
      const cachedData = getCachedData();
      if (cachedData) {
        setAdminLanguages(cachedData.adminLanguages);
        setLanguages(cachedData.languages);
      } else {
        // Only show loading if no cache available
        setLoading(true);
      }

      // Fetch fresh data in background
      await Promise.all([
        fetchEnabledLanguages(),
        fetchAdminLanguages()
      ]);
      setLoading(false);
    };

    loadLanguages();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('language-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_language_settings'
        },
        () => {
          // Update both enabled languages and admin languages on real-time changes
          fetchEnabledLanguages();
          fetchAdminLanguages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    languages,
    adminLanguages,
    loading,
    error,
    fetchEnabledLanguages,
    fetchAdminLanguages,
    updateLanguageSettings,
    addLanguage,
    deleteLanguage
  };
};