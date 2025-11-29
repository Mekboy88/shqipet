import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LearningAnalytics {
  totalSessions: number;
  totalConversations: number;
  totalWords: number; // New: total word count
  todayWords: number; // New: today's word count  
  weekWords: number; // New: week's word count
  avgLearningScore: number;
  todaySessions: number;
  weekSessions: number;
  isLearningActive: boolean;
}

export const useLearningAnalytics = (aiMode: string = 'luna_gpt5') => {
  const [analytics, setAnalytics] = useState<LearningAnalytics>({
    totalSessions: 0,
    totalConversations: 0,
    totalWords: 0, // New field
    todayWords: 0, // New field
    weekWords: 0, // New field
    avgLearningScore: 0,
    todaySessions: 0,
    weekSessions: 0,
    isLearningActive: false
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('No user found for analytics');
        return;
      }

      console.log('🔄 Fetching real-time learning analytics for mode:', aiMode);

      const { data: analyticsData, error } = await supabase
        .from('ai_learning_analytics')
        .select('*')
        .eq('ai_mode', aiMode)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching learning analytics:', error);
        return;
      }

      const data = analyticsData || [];
      console.log(`📊 Retrieved ${data.length} analytics entries for real-time processing`);
      
      // Enhanced analytics calculations with word counting
      const totalSessions = data.length;
      
      // Calculate total words processed (conversations + messages)
      const totalWords = data.reduce((sum, item) => {
        const conversationData = item.conversation_data as any;
        const messages = conversationData?.messages || [];
        const wordCount = messages.reduce((msgSum: number, msg: any) => {
          return msgSum + (msg.content ? msg.content.split(' ').length : 0);
        }, 0);
        return sum + wordCount;
      }, 0);

      const totalConversations = data.reduce((sum, item) => {
        const conversationData = item.conversation_data as any;
        return sum + (conversationData?.total_messages || 1);
      }, 0);
      
      const avgLearningScore = data.length > 0 
        ? data.reduce((sum, item) => {
            const metrics = item.performance_metrics as any;
            return sum + (metrics?.learning_score || 0);
          }, 0) / data.length
        : 0;
      
      // Today's sessions and words
      const today = new Date().toISOString().split('T')[0];
      const todayData = data.filter(item => 
        new Date(item.created_at).toISOString().split('T')[0] === today
      );
      const todaySessions = todayData.length;
      const todayWords = todayData.reduce((sum, item) => {
        const conversationData = item.conversation_data as any;
        const messages = conversationData?.messages || [];
        return sum + messages.reduce((msgSum: number, msg: any) => 
          msgSum + (msg.content ? msg.content.split(' ').length : 0), 0
        );
      }, 0);
      
      // Week's sessions and words
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekData = data.filter(item => 
        new Date(item.created_at) >= weekAgo
      );
      const weekSessions = weekData.length;
      const weekWords = weekData.reduce((sum, item) => {
        const conversationData = item.conversation_data as any;
        const messages = conversationData?.messages || [];
        return sum + messages.reduce((msgSum: number, msg: any) => 
          msgSum + (msg.content ? msg.content.split(' ').length : 0), 0
        );
      }, 0);

      // Check if learning is currently active (within last 2 minutes for real-time)
      const recentSession = data[0];
      const isLearningActive = recentSession && 
        new Date(recentSession.created_at) > new Date(Date.now() - 2 * 60 * 1000);

      const enhancedAnalytics = {
        totalSessions,
        totalConversations,
        totalWords, // New: total word count
        todayWords, // New: today's word count
        weekWords, // New: week's word count
        avgLearningScore: Math.round(avgLearningScore),
        todaySessions,
        weekSessions,
        isLearningActive
      };

      console.log('📈 Enhanced real-time analytics:', enhancedAnalytics);
      setAnalytics(enhancedAnalytics);
    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time subscription for instant updates
    const channel = supabase
      .channel('ai_learning_analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_learning_analytics',
          filter: `ai_mode=eq.${aiMode}`
        },
        () => {
          fetchAnalytics(); // Instantly refetch when data changes
        }
      )
      .subscribe();
    
    // Reduce polling to every 30 seconds to prevent UI blocking
    const interval = setInterval(fetchAnalytics, 30000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [aiMode]);

  return { analytics, loading, refetch: fetchAnalytics };
};