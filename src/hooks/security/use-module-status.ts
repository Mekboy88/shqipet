import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface ModuleStatus {
  id: string;
  module_name: string;
  status: string;
  completion_percentage: number;
  last_checked: string;
  last_updated_by: string;
  note: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export const useModuleStatus = () => {
  const queryClient = useQueryClient();

  // Listen for real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('module-status-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'module_status'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['module-status'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: modules, isLoading } = useQuery({
    queryKey: ['module-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_status')
        .select('*')
        .order('module_name');
      
      if (error) throw error;
      return data as ModuleStatus[];
    },
    refetchInterval: 10000 // Poll every 10 seconds
  });

  const updateModule = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ModuleStatus> }) => {
      const { data, error } = await supabase
        .from('module_status')
        .update({
          ...updates,
          last_checked: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module-status'] });
    }
  });

  const getIncompleteModules = () => {
    return modules?.filter(module => module.status !== 'complete') || [];
  };

  const getOverallCompletion = () => {
    if (!modules || modules.length === 0) return 0;
    const totalPercentage = modules.reduce((sum, module) => sum + module.completion_percentage, 0);
    return Math.round(totalPercentage / modules.length);
  };

  return {
    modules,
    isLoading,
    updateModule,
    getIncompleteModules,
    getOverallCompletion
  };
};