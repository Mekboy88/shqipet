import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TranslationJob {
  id: string;
  locale: string;
  scope: 'all' | 'pages' | 'page';
  pages: string[];
  status: 'queued' | 'running' | 'done' | 'failed';
  progress: number;
  errors: any[];
  created_at: string;
  done_at?: string;
  total_keys: number;
  translated_keys: number;
}

export const useTranslationJobs = () => {
  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('i18n_jobs' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data as any[] || []).map((item: any) => ({
        id: item.id,
        locale: item.locale,
        scope: item.scope,
        pages: item.pages || [],
        status: item.status,
        progress: item.progress || 0,
        errors: item.errors || [],
        created_at: item.created_at,
        done_at: item.done_at,
        total_keys: item.total_keys || 0,
        translated_keys: item.translated_keys || 0,
      } as TranslationJob)));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching translation jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTranslationJob = async (
    locale: string,
    scope: 'all' | 'pages' | 'page',
    pages: string[] = [],
    mode: 'all' | 'missing' = 'all'
  ) => {
    try {
      const { data, error } = await supabase
        .from('i18n_jobs' as any)
        .insert({
          locale,
          scope,
          pages,
          status: 'queued',
          progress: 0,
          errors: [],
          total_keys: 0,
          translated_keys: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Translation job created successfully');
      await fetchJobs();
      
      // Start the translation process
      await startTranslation((data as any).id, mode);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create translation job';
      toast.error(errorMessage);
      throw err;
    }
  };

  const startTranslation = async (jobId: string, mode: 'all' | 'missing' = 'all') => {
    try {
      const { error } = await supabase.functions.invoke('translate-content', {
        body: { jobId, mode }
      });

      if (error) throw error;
      toast.success('Translation started');
    } catch (err) {
      console.error('Error starting translation:', err);
      toast.error('Failed to start translation');
    }
  };

  const updateJobProgress = async (
    jobId: string,
    progress: number,
    translatedKeys?: number,
    errors?: any[]
  ) => {
    try {
      const { error } = await supabase.rpc('update_translation_job_progress' as any, {
        job_id: jobId,
        new_progress: progress,
        new_translated_keys: translatedKeys,
        new_errors: errors ? JSON.stringify(errors) : null
      });

      if (error) throw error;
      await fetchJobs();
    } catch (err) {
      console.error('Error updating job progress:', err);
    }
  };

  const publishTranslations = async (jobId: string) => {
    try {
      const { error } = await supabase.functions.invoke('publish-translations', {
        body: { jobId }
      });

      if (error) throw error;
      toast.success('Translations published successfully');
      await fetchJobs();
    } catch (err) {
      console.error('Error publishing translations:', err);
      toast.error('Failed to publish translations');
    }
  };

  const rollbackTranslations = async (locale: string, version?: number) => {
    try {
      const { error } = await supabase.functions.invoke('rollback-translations', {
        body: { locale, version }
      });

      if (error) throw error;
      toast.success('Translations rolled back successfully');
    } catch (err) {
      console.error('Error rolling back translations:', err);
      toast.error('Failed to rollback translations');
    }
  };

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscription for job updates
    const channel = supabase
      .channel('translation_jobs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'i18n_jobs'
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    jobs,
    loading,
    error,
    createTranslationJob,
    updateJobProgress,
    publishTranslations,
    rollbackTranslations,
    refetch: fetchJobs
  };
};