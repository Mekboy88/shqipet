import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Translation {
  id: string;
  namespace: string;
  locale: string;
  key: string;
  value: string;
  is_published: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

interface TranslationDraft {
  namespace: string;
  locale: string;
  key: string;
  value: string;
}

export const useI18nTranslations = () => {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslations = async (namespace?: string, locale?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('i18n_translations')
        .select('*')
        .order('namespace', { ascending: true })
        .order('key', { ascending: true });

      if (namespace) {
        query = query.eq('namespace', namespace);
      }
      if (locale) {
        query = query.eq('locale', locale);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTranslations(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch translations');
      console.error('Error fetching translations:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveTranslation = async (translation: TranslationDraft) => {
    try {
      const { error } = await supabase
        .from('i18n_translations')
        .upsert({
          ...translation,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      await fetchTranslations();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save translation');
    }
  };

  const publishNamespace = async (namespace: string, locale: string) => {
    try {
      // First get current versions
      const { data: currentTranslations } = await supabase
        .from('i18n_translations')
        .select('version')
        .eq('namespace', namespace)
        .eq('locale', locale)
        .limit(1)
        .single();

      const newVersion = (currentTranslations?.version || 0) + 1;

      const { error } = await supabase
        .from('i18n_translations')
        .update({ 
          is_published: true,
          version: newVersion
        })
        .eq('namespace', namespace)
        .eq('locale', locale);

      if (error) throw error;

      // Bump manifest version
      const { data: currentManifest } = await supabase
        .from('i18n_manifest')
        .select('version')
        .eq('id', 1)
        .single();

      await supabase
        .from('i18n_manifest')
        .update({ version: (currentManifest?.version || 0) + 1 })
        .eq('id', 1);

      await fetchTranslations();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to publish namespace');
    }
  };

  const rollbackNamespace = async (namespace: string, locale: string, toVersion: number) => {
    try {
      const { error } = await supabase
        .from('i18n_translations')
        .update({ 
          is_published: false,
          version: toVersion
        })
        .eq('namespace', namespace)
        .eq('locale', locale)
        .gt('version', toVersion);

      if (error) throw error;
      await fetchTranslations();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to rollback namespace');
    }
  };

  const getNamespaces = () => {
    const namespaces = Array.from(new Set(translations.map(t => t.namespace)));
    return namespaces.sort();
  };

  const getLocales = () => {
    const locales = Array.from(new Set(translations.map(t => t.locale)));
    return locales.sort();
  };

  const getTranslationsByNamespace = (namespace: string, locale: string) => {
    return translations.filter(t => t.namespace === namespace && t.locale === locale);
  };

  const getTranslationStats = () => {
    const namespaces = getNamespaces();
    const locales = getLocales();
    
    return {
      totalKeys: translations.length,
      publishedKeys: translations.filter(t => t.is_published).length,
      namespaces: namespaces.length,
      locales: locales.length,
      namespaceCounts: namespaces.reduce((acc, ns) => {
        acc[ns] = translations.filter(t => t.namespace === ns).length;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  useEffect(() => {
    fetchTranslations();

    // Set up real-time subscription
    const channel = supabase
      .channel('i18n_translations_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'i18n_translations'
        },
        () => {
          fetchTranslations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    translations,
    loading,
    error,
    saveTranslation,
    publishNamespace,
    rollbackNamespace,
    getNamespaces,
    getLocales,
    getTranslationsByNamespace,
    getTranslationStats,
    refetch: fetchTranslations
  };
};