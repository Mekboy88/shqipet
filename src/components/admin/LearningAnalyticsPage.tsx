import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import supabase from '@/lib/relaxedSupabase';
import { AIModeType } from './AIModeSelector';
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Clock, 
  BarChart3,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LearningData {
  id: string;
  user_id: string;
  ai_mode: string;
  session_id: string;
  conversation_data: any;
  learning_insights: any;
  performance_metrics: any;
  created_at: string;
  updated_at: string;
}

interface DailyStats {
  date: string;
  sessions: number;
  conversations: number;
  learning_score: number;
}

interface LearningAnalyticsPageProps {
  currentMode: AIModeType;
  onClose: () => void;
}

const LearningAnalyticsPage: React.FC<LearningAnalyticsPageProps> = ({ 
  currentMode, 
  onClose 
}) => {
  const [learningData, setLearningData] = useState<LearningData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLearningData();
  }, [currentMode]);

  const fetchLearningData = async () => {
    try {
      const { data: analyticsData, error } = await supabase
        .from('ai_learning_analytics')
        .select('*')
        .eq('ai_mode', currentMode)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setLearningData(analyticsData || []);
      
      // Process daily stats
      const processedStats = processDaily(analyticsData || []);
      setDailyStats(processedStats);
      
    } catch (error) {
      console.error('Error fetching learning data:', error);
      toast({
        title: "Error",
        description: "Failed to load learning analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const processDaily = (data: LearningData[]): DailyStats[] => {
    const dailyMap = new Map<string, DailyStats>();
    
    data.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      const existing = dailyMap.get(date) || {
        date,
        sessions: 0,
        conversations: 0,
        learning_score: 0
      };
      
      existing.sessions += 1;
      existing.conversations += (item.conversation_data?.total_messages || 1);
      existing.learning_score = Math.max(existing.learning_score, 
        item.performance_metrics?.learning_score || 0);
      
      dailyMap.set(date, existing);
    });
    
    return Array.from(dailyMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getOverallStats = () => {
    const totalSessions = learningData.length;
    const totalConversations = learningData.reduce((sum, item) => 
      sum + (item.conversation_data?.total_messages || 1), 0);
    const avgLearningScore = learningData.length > 0 
      ? learningData.reduce((sum, item) => sum + (item.performance_metrics?.learning_score || 0), 0) / learningData.length
      : 0;
    
    return { totalSessions, totalConversations, avgLearningScore };
  };

  const { totalSessions, totalConversations, avgLearningScore } = getOverallStats();

  const getModeTitle = () => {
    switch (currentMode) {
      case 'luna_gpt5':
        return 'Luna AI & GPT 5 Learning Analytics';
      case 'luna_only':
        return 'Luna AI Learning Analytics';
      case 'gpt5_only':
        return 'GPT 5 Analytics';
      default:
        return 'AI Learning Analytics';
    }
  };

  const getModeDescription = () => {
    switch (currentMode) {
      case 'luna_gpt5':
        return 'Luna is learning from GPT 5 interactions and building knowledge base';
      case 'luna_only':
        return 'Luna is operating independently and learning from conversations';
      case 'gpt5_only':
        return 'GPT 5 is processing requests without learning retention';
      default:
        return 'AI system analytics';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="p-6 w-full max-w-md mx-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
            <span>Loading learning analytics...</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getModeTitle()}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getModeDescription()}
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalSessions}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Conversations</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalConversations}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Learning Score</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(avgLearningScore)}%
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                  <div className="mt-2">
                    <Progress value={avgLearningScore} className="w-full" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Learning Progress Chart */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Learning Progress
            </h3>
            <div className="space-y-3">
              {dailyStats.slice(0, 7).map((stat, index) => (
                <div key={stat.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(stat.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.sessions} sessions • {stat.conversations} conversations
                      </span>
                      <span className="text-sm text-blue-500">
                        {Math.round(stat.learning_score)}%
                      </span>
                    </div>
                    <Progress value={stat.learning_score} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Mode-Specific Insights */}
          {currentMode === 'luna_gpt5' && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Luna & GPT 5 Collaboration Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Knowledge Transfer
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Luna is actively learning from GPT 5 responses and building a personalized knowledge base
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Response Quality
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Combined responses show improved context awareness and continuity
                  </p>
                </div>
              </div>
            </Card>
          )}

          {currentMode === 'luna_only' && (
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Luna Independent Learning
              </h3>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Autonomous Growth
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Luna is developing unique conversation patterns and building specialized knowledge
                  based on user interactions
                </p>
              </div>
            </Card>
          )}

          {/* Recent Activity Log */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Learning Sessions
            </h3>
            <div className="space-y-3">
              {learningData.slice(0, 5).map((session, index) => (
                <div 
                  key={session.id || `session-${index}-${session.created_at}`} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Session {index + 1}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {session.conversation_data?.total_messages || 1} conversations • Mode: {session.ai_mode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-500">
                      {Math.round(session.performance_metrics?.learning_score || 0)}% learning
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default LearningAnalyticsPage;