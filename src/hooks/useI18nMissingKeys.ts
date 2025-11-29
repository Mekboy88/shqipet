import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MissingKey {
  id: string;
  namespace: string;
  key: string;
  route?: string;
  first_seen: string;
  count: number;
  samples: string[];
  resolved: boolean;
}

export const useI18nMissingKeys = () => {
  const [missingKeys, setMissingKeys] = useState<MissingKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissingKeys = async (
    namespaceFilter?: string, 
    resolvedFilter?: boolean
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('admin_get_missing_keys', {
        namespace_filter: namespaceFilter || null,
        resolved_filter: resolvedFilter ?? null
      });

      if (error) throw error;
      
      // Parse samples JSON
      const parsedKeys: MissingKey[] = (data || []).map(key => ({
        ...key,
        samples: Array.isArray(key.samples) ? key.samples as string[] : []
      }));
      
      setMissingKeys(parsedKeys);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missing keys');
      console.error('Error fetching missing keys:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveMissingKeys = async (keyIds: string[], namespace: string = 'common') => {
    try {
      const { error } = await supabase.rpc('admin_resolve_missing_keys', {
        key_ids: keyIds,
        resolution_namespace: namespace
      });

      if (error) throw error;
      
      // Refetch to get updated data
      await fetchMissingKeys();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to resolve missing keys');
    }
  };

  const trackMissingKey = async (
    namespace: string,
    key: string,
    route?: string,
    sampleText?: string
  ) => {
    try {
      const { error } = await supabase.rpc('track_missing_key', {
        key_namespace: namespace,
        key_name: key,
        current_route: route || null,
        sample_text: sampleText || null
      });

      if (error) throw error;
      
      // Optionally refetch (might be too frequent for runtime usage)
      // await fetchMissingKeys();
    } catch (err) {
      // Don't throw error for tracking, just log it
      console.error('Failed to track missing key:', err);
    }
  };

  const getKeysByNamespace = (namespace: string) => {
    return missingKeys.filter(key => key.namespace === namespace);
  };

  const getUnresolvedKeys = () => {
    return missingKeys.filter(key => !key.resolved);
  };

  const getKeyStats = () => {
    const total = missingKeys.length;
    const resolved = missingKeys.filter(key => key.resolved).length;
    const unresolved = total - resolved;
    const namespaces = Array.from(new Set(missingKeys.map(key => key.namespace)));
    
    return {
      total,
      resolved,
      unresolved,
      namespaces: namespaces.length,
      namespaceCounts: namespaces.reduce((acc, ns) => {
        acc[ns] = missingKeys.filter(key => key.namespace === ns).length;
        return acc;
      }, {} as Record<string, number>)
    };
  };

  useEffect(() => {
    fetchMissingKeys();

    // Set up real-time subscription
    const channel = supabase
      .channel('i18n_missing_keys_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'i18n_missing_keys'
        },
        () => {
          fetchMissingKeys();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    missingKeys,
    loading,
    error,
    resolveMissingKeys,
    trackMissingKey,
    getKeysByNamespace,
    getUnresolvedKeys,
    getKeyStats,
    refetch: fetchMissingKeys
  };
};