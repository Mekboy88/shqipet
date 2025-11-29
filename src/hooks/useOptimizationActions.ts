import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOptimizationActions = () => {
  const queryClient = useQueryClient();

  const applySuggestion = useMutation({
    mutationFn: async (suggestionId: string) => {
      const { error } = await supabase
        .from('optimization_suggestions')
        .update({ 
          status: 'applied',
          applied_at: new Date().toISOString()
        })
        .eq('id', suggestionId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-suggestions'] });
      toast.success('Optimization applied successfully!');
    },
    onError: (error) => {
      toast.error(`Failed to apply optimization: ${error.message}`);
    }
  });

  const dismissSuggestion = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { error } = await supabase
        .from('optimization_suggestions')
        .update({ 
          status: 'dismissed',
          dismissed_at: new Date().toISOString(),
          dismissed_reason: reason
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['optimization-suggestions'] });
      toast.success('Suggestion dismissed');
    },
    onError: (error) => {
      toast.error(`Failed to dismiss: ${error.message}`);
    }
  });

  const generateSuggestions = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-optimizations');
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['optimization-suggestions'] });
      toast.success(`Generated ${data.suggestions_generated} optimization suggestions`);
    },
    onError: (error) => {
      toast.error(`Failed to generate suggestions: ${error.message}`);
    }
  });

  return {
    applySuggestion,
    dismissSuggestion,
    generateSuggestions
  };
};
