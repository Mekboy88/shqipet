import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Language {
  code: string;
  name: string;
  region: string;
  flag: string;
  enabled: boolean;
  sort_index: number;
  created_at?: string;
  updated_at?: string;
}

export const useI18nLanguages = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('i18n_languages')
        .select('*')
        .order('sort_index', { ascending: true });

      if (error) throw error;
      setLanguages(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch languages');
      console.error('Error fetching languages:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (
    code: string, 
    updates: { enabled?: boolean; sort_index?: number }
  ) => {
    try {
      const { error } = await supabase.rpc('admin_set_language_enabled', {
        language_code: code,
        is_enabled: updates.enabled ?? true,
        new_sort_index: updates.sort_index ?? null
      });

      if (error) throw error;
      
      // Refetch to get updated data
      await fetchLanguages();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update language');
    }
  };

  const reorderLanguages = async (reorderedLanguages: Language[]) => {
    try {
      // Update sort_index for all languages
      const updates = reorderedLanguages.map((lang, index) => 
        updateLanguage(lang.code, { sort_index: index + 1 })
      );
      
      await Promise.all(updates);
      await fetchLanguages();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to reorder languages');
    }
  };

  const getSupportedLanguages = async () => {
    try {
      const { data, error } = await supabase.rpc('public_get_supported_languages');
      if (error) throw error;
      return data || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to get supported languages');
    }
  };

  useEffect(() => {
    fetchLanguages();

    // Set up real-time subscription
    const channel = supabase
      .channel('i18n_languages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'i18n_languages'
        },
        () => {
          fetchLanguages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    languages,
    loading,
    error,
    updateLanguage,
    reorderLanguages,
    getSupportedLanguages,
    refetch: fetchLanguages
  };
};