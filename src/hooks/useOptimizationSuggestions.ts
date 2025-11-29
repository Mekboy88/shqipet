import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface OptimizationSuggestion {
  id: string;
  suggestion_type: 'cost' | 'performance' | 'security' | 'storage';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact_score: number;
  potential_savings?: number;
  potential_improvement?: string;
  category: string;
  affected_service?: string;
  recommendation: string;
  auto_applicable: boolean;
  status: 'open' | 'applied' | 'dismissed' | 'in_progress';
  metadata: any;
  created_at: string;
  updated_at: string;
  applied_at?: string;
  dismissed_at?: string;
  dismissed_reason?: string;
}

export const useOptimizationSuggestions = (filters?: {
  type?: string;
  severity?: string;
  status?: string;
  search?: string;
}) => {
  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ['optimization-suggestions', filters],
    queryFn: async () => {
      let query = supabase
        .from('optimization_suggestions')
        .select('*')
        .order('impact_score', { ascending: false });

      if (filters?.type && filters.type !== 'all') {
        query = query.eq('suggestion_type', filters.type);
      }

      if (filters?.severity && filters.severity !== 'all') {
        query = query.eq('severity', filters.severity);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        query = query.eq('status', 'open');
      }

      const { data, error } = await query;

      if (error) throw error;

      let results = data as OptimizationSuggestion[];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(s => 
          s.title.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.recommendation.toLowerCase().includes(searchLower)
        );
      }

      return results;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('optimization-suggestions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'optimization_suggestions'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calculate statistics
  const stats = {
    total: suggestions.length,
    critical: suggestions.filter(s => s.severity === 'critical').length,
    high: suggestions.filter(s => s.severity === 'high').length,
    medium: suggestions.filter(s => s.severity === 'medium').length,
    low: suggestions.filter(s => s.severity === 'low').length,
    totalSavings: suggestions.reduce((sum, s) => sum + (s.potential_savings || 0), 0),
    avgImpactScore: suggestions.length > 0 
      ? Math.round(suggestions.reduce((sum, s) => sum + s.impact_score, 0) / suggestions.length)
      : 0,
  };

  return {
    suggestions,
    stats,
    isLoading,
    refetch
  };
};
