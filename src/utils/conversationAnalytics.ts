import { supabase } from '@/integrations/supabase/client';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | string;
  conversationId?: string;
}

interface ConversationAnalytics {
  conversationId: string;
  userId: string;
  aiMode: string;
  sessionId: string;
  messages: ConversationMessage[];
  totalWords: number;
  totalMessages: number;
  userWords: number;
  assistantWords: number;
  interactionScore: number;
}

export class ConversationAnalyticsLogger {
  
  // Calculate word count for a message
  private static calculateWords(content: string): number {
    if (!content || typeof content !== 'string') return 0;
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Analyze conversation for detailed metrics
  public static analyzeConversation(messages: ConversationMessage[]): {
    totalWords: number;
    totalMessages: number;
    userWords: number;
    assistantWords: number;
    interactionScore: number;
  } {
    let totalWords = 0;
    let userWords = 0;
    let assistantWords = 0;
    const totalMessages = messages.length;

    messages.forEach(message => {
      const wordCount = this.calculateWords(message.content);
      totalWords += wordCount;
      
      if (message.role === 'user') {
        userWords += wordCount;
      } else if (message.role === 'assistant') {
        assistantWords += wordCount;
      }
    });

    // Calculate interaction score (0-100) based on conversation depth
    const interactionScore = Math.min(100, Math.round(
      (totalMessages * 5) + // Base score per message
      (totalWords / 10) +   // Bonus for word count
      (userWords > 0 ? 20 : 0) + // Bonus for user participation
      (assistantWords > 0 ? 20 : 0) // Bonus for assistant responses
    ));

    return {
      totalWords,
      totalMessages,
      userWords,
      assistantWords,
      interactionScore
    };
  }

  // Log conversation to learning analytics in real-time
  public static async logConversationAnalytics(
    conversationId: string,
    userId: string,
    aiMode: string,
    sessionId: string,
    messages: ConversationMessage[]
  ): Promise<void> {
    try {
      console.log('📊 Logging real-time conversation analytics...', {
        conversationId,
        aiMode,
        messageCount: messages.length
      });

      const analytics = this.analyzeConversation(messages);
      
      const analyticsData = {
        user_id: userId,
        ai_mode: aiMode,
        session_id: sessionId,
        conversation_data: {
          conversation_id: conversationId,
          messages: messages,
          total_messages: analytics.totalMessages,
          total_words: analytics.totalWords,
          user_words: analytics.userWords,
          assistant_words: analytics.assistantWords,
          conversation_length_minutes: this.calculateConversationDuration(messages),
          last_message_timestamp: new Date().toISOString()
        },
        learning_insights: {
          adaptiveResponse: true,
          patternRecognized: analytics.totalMessages > 3,
          clarificationNeeded: false,
          confidenceScore: analytics.interactionScore,
          recommendations: this.generateRecommendations(analytics),
          contextAwareness: Math.min(100, analytics.totalMessages * 15),
          domainDetected: this.detectDomains(messages),
          severity: this.calculateSeverity(analytics),
          requiresFollowUp: analytics.totalMessages < 3,
          learning_occurred: true,
          response_quality: Math.min(100, 70 + (analytics.interactionScore * 0.3))
        },
        performance_metrics: {
          learning_score: analytics.interactionScore,
          word_processing_rate: analytics.totalWords,
          conversation_efficiency: Math.round((analytics.totalWords / Math.max(1, analytics.totalMessages)) * 10) / 10,
          real_time_processing: true,
          analytics_version: '2.0'
        }
      };

      console.log('💾 Saving enhanced analytics:', analyticsData);

      const { error } = await supabase
        .from('ai_learning_analytics')
        .insert(analyticsData as any);

      if (error) {
        console.error('❌ Error saving conversation analytics:', error);
        // Retry once more after a short delay
        setTimeout(async () => {
          console.log('🔄 Retrying analytics save...');
          await supabase.from('ai_learning_analytics').insert(analyticsData as any);
        }, 1000);
      } else {
        console.log('✅ Real-time conversation analytics logged successfully');
      }

    } catch (error) {
      console.error('❌ Error in logConversationAnalytics:', error);
    }
  }

  // Calculate conversation duration in minutes
  private static calculateConversationDuration(messages: ConversationMessage[]): number {
    if (messages.length < 2) return 0;
    
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    const startTime = firstMessage.timestamp ? new Date(firstMessage.timestamp) : new Date();
    const endTime = lastMessage.timestamp ? new Date(lastMessage.timestamp) : new Date();
    
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60) * 100) / 100;
  }

  // Generate recommendations based on conversation analytics
  private static generateRecommendations(analytics: {
    totalWords: number;
    totalMessages: number;
    userWords: number;
    assistantWords: number;
  }): string[] {
    const recommendations = [];
    
    if (analytics.userWords < 20) {
      recommendations.push('Encourage more detailed user input');
    }
    
    if (analytics.assistantWords > analytics.userWords * 3) {
      recommendations.push('Consider more concise responses');
    }
    
    if (analytics.totalMessages > 10) {
      recommendations.push('High engagement conversation - excellent learning opportunity');
    }
    
    if (analytics.totalWords > 500) {
      recommendations.push('Rich conversation with substantial learning content');
    }
    
    return recommendations.length > 0 ? recommendations : ['Continue current conversation patterns'];
  }

  // Detect conversation domains/topics
  private static detectDomains(messages: ConversationMessage[]): string[] {
    const domains = new Set<string>();
    
    const allText = messages.map(m => m.content.toLowerCase()).join(' ');
    
    // Technical domains
    if (allText.includes('database') || allText.includes('sql') || allText.includes('query')) {
      domains.add('database');
    }
    if (allText.includes('code') || allText.includes('function') || allText.includes('api')) {
      domains.add('programming');
    }
    if (allText.includes('security') || allText.includes('authentication') || allText.includes('authorization')) {
      domains.add('security');
    }
    if (allText.includes('performance') || allText.includes('optimization') || allText.includes('speed')) {
      domains.add('performance');
    }
    if (allText.includes('ui') || allText.includes('design') || allText.includes('layout')) {
      domains.add('design');
    }
    
    return Array.from(domains);
  }

  // Calculate severity based on conversation content
  private static calculateSeverity(analytics: {
    totalWords: number;
    totalMessages: number;
    interactionScore: number;
  }): 'low' | 'medium' | 'high' | 'critical' {
    if (analytics.interactionScore > 80) return 'critical';
    if (analytics.interactionScore > 60) return 'high';
    if (analytics.interactionScore > 30) return 'medium';
    return 'low';
  }

  // Enhanced real-time logging with immediate analytics processing
  public static async logMessageInRealTime(
    conversationId: string,
    userId: string,
    aiMode: string,
    sessionId: string,
    newMessage: ConversationMessage,
    allMessages: ConversationMessage[]
  ): Promise<void> {
    try {
      console.log('⚡ Real-time message logging:', {
        messageRole: newMessage.role,
        wordCount: this.calculateWords(newMessage.content),
        totalMessages: allMessages.length
      });

      // Log every message for maximum analytics granularity
      await this.logConversationAnalytics(
        conversationId,
        userId,
        aiMode,
        sessionId,
        allMessages
      );
      
      console.log('🔄 Real-time analytics updated successfully');
    } catch (error) {
      console.error('❌ Error in real-time message logging:', error);
    }
  }
}

export default ConversationAnalyticsLogger;