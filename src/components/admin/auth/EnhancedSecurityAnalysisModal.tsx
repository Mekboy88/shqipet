import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Brain,
  BookOpen,
  Settings,
  Eye,
  Zap,
  Clock,
  Shield,
  Users,
  Key,
  Lock,
  Globe,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface SecurityAnalysis {
  title: string;
  type: 'warning' | 'critical';
  description: string;
  dangers: string[];
  solutions: string[];
  quickFixes: Array<{
    name: string;
    action: string;
    risk: string;
  }>;
}

interface EnhancedSecurityAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSecurityIssue: SecurityAnalysis | null;
  onApplyFix: (fixName: string, moduleName: string) => void;
}

const providerAnalysisData = {
  'Multi-Provider Auth': {
    providers: [
      { name: 'Email/Password', status: 'active', users: 1234, security: 85, issues: ['Weak password policy'] },
      { name: 'Google OAuth', status: 'active', users: 856, security: 92, issues: [] },
      { name: 'Apple Sign-In', status: 'active', users: 445, security: 95, issues: [] },
      { name: 'Phone/SMS', status: 'warning', users: 234, security: 78, issues: ['SMS delivery delays', 'No rate limiting'] },
      { name: 'Phone Number', status: 'success', users: 245, security: 92, issues: [] }
    ],
    securityMetrics: {
      overallScore: 82,
      authenticationsToday: 1547,
      failedAttempts: 23,
      suspiciousActivity: 3,
      avgResponseTime: '1.2s'
    },
    realTimeStats: {
      activeUsers: 2847,
      currentSessions: 1234,
      peakHour: '2:00 PM',
      successRate: 94.8
    }
  }
};

const LiveMetricCard: React.FC<{ title: string; value: string; trend: 'up' | 'down' | 'stable'; icon: React.ReactNode }> = ({
  title, value, trend, icon
}) => {
  const [animatedValue, setAnimatedValue] = useState('0');

  useEffect(() => {
    setTimeout(() => setAnimatedValue(value), 500);
  }, [value]);

  return (
    <Card className="p-4 relative overflow-hidden">
      <div className="circuit-line absolute top-0 left-0 h-0.5 w-full opacity-30" />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 transition-all duration-1000">{animatedValue}</p>
        </div>
        <div className="flex items-center space-x-2">
          {icon}
          <div className={`w-2 h-2 rounded-full ${
            trend === 'up' ? 'bg-green-500' : trend === 'down' ? 'bg-red-500' : 'bg-yellow-500'
          }`} />
        </div>
      </div>
    </Card>
  );
};

const ProviderStatusCard: React.FC<{ provider: any; index: number }> = ({ provider, index }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-warning-pulse';
      case 'error': return 'bg-red-100 text-red-800 border-red-200 animate-critical-flash';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card 
      className={`p-4 border-2 transition-all duration-500 ${getStatusColor(provider.status)}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon(provider.status)}
          <h4 className="font-semibold">{provider.name}</h4>
        </div>
        <Badge variant={provider.status === 'active' ? 'default' : provider.status === 'warning' ? 'secondary' : 'destructive'}>
          {provider.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-600">Active Users</p>
          <p className="font-bold text-lg">{provider.users.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600">Security Score</p>
          <p className="font-bold text-lg">{provider.security}%</p>
        </div>
      </div>

      {provider.issues.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium text-red-700 mb-1">Issues:</p>
          <ul className="text-xs space-y-1">
            {provider.issues.map((issue: string, idx: number) => (
              <li key={idx} className="flex items-center text-red-600">
                <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex space-x-2">
        <Button size="sm" variant="outline" className="text-xs flex-1">
          <Settings className="h-3 w-3 mr-1" />
          Configure
        </Button>
        <Button size="sm" variant="outline" className="text-xs flex-1">
          <Eye className="h-3 w-3 mr-1" />
          Test
        </Button>
      </div>
    </Card>
  );
};

const AISecurityInsights: React.FC<{ analysis: SecurityAnalysis }> = ({ analysis }) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [currentInsight, setCurrentInsight] = useState(0);

  useEffect(() => {
    const aiInsights = [
      "🔍 Analyzing authentication flow patterns...",
      "🛡️ Scanning for security vulnerabilities...",
      "📊 Evaluating provider configurations...",
      "⚡ Generating optimization recommendations...",
      "🧠 AI analysis complete - Review insights below"
    ];

    const timer = setInterval(() => {
      setInsights(prev => {
        const newInsights = [...prev];
        if (currentInsight < aiInsights.length) {
          newInsights.push(aiInsights[currentInsight]);
          setCurrentInsight(c => c + 1);
        }
        return newInsights;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [currentInsight]);

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
      <div className="flex items-center mb-4">
        <Brain className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-purple-800">🧠 AI Security Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* AI Thinking Process */}
        <div className="bg-black/90 rounded-lg p-4 font-mono text-sm">
          {insights.map((insight, index) => (
            <div key={index} className="mb-2">
              <span className="text-green-400">$ </span>
              <span className="typing-text text-green-300">{insight}</span>
            </div>
          ))}
          {currentInsight < 5 && (
            <div className="flex items-center">
              <span className="text-green-400">$ </span>
              <span className="animate-pulse text-green-300">|</span>
            </div>
          )}
        </div>

        {/* AI Insights */}
        {currentInsight >= 5 && (
          <div className="ai-assistant-enter bg-white/70 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium text-purple-800 mb-2">🎯 Key Findings</h4>
              <p className="text-purple-900">
                Your multi-provider authentication system shows <strong>moderate security risks</strong>. 
                The primary concern is inconsistent security policies across providers, creating potential attack vectors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white/70 rounded p-3">
                <h5 className="font-medium text-green-700 mb-1">✅ Strengths</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• OAuth providers well-configured</li>
                  <li>• Active user base distributed</li>
                  <li>• Good overall success rate</li>
                </ul>
              </div>

              <div className="bg-white/70 rounded p-3">
                <h5 className="font-medium text-red-700 mb-1">⚠️ Risks</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• SMS provider vulnerabilities</li>
                  <li>• Inconsistent rate limiting</li>
                  <li>• Missing backup authentication</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-100 rounded p-3">
              <h5 className="font-medium text-blue-800 mb-1">🚀 Recommended Action</h5>
              <p className="text-sm text-blue-900">
                Start by fixing the SMS provider rate limiting, then standardize security policies across all providers. 
                This will reduce your attack surface by ~60% and improve user experience.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const EnhancedSecurityAnalysisModal: React.FC<EnhancedSecurityAnalysisModalProps> = ({
  open,
  onOpenChange,
  selectedSecurityIssue,
  onApplyFix
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLiveMetrics, setShowLiveMetrics] = useState(false);

  useEffect(() => {
    if (open) {
      setShowLiveMetrics(false);
      setTimeout(() => setShowLiveMetrics(true), 1000);
    }
  }, [open]);

  if (!selectedSecurityIssue) return null;

  const data = providerAnalysisData['Multi-Provider Auth'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-yellow-600" />
            ⚠️ Multi-Provider Auth - Advanced Security Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Live Metrics Dashboard */}
          {showLiveMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <LiveMetricCard
                title="Active Users"
                value={data.realTimeStats.activeUsers.toLocaleString()}
                trend="up"
                icon={<Users className="h-5 w-5 text-blue-600" />}
              />
              <LiveMetricCard
                title="Success Rate"
                value={`${data.realTimeStats.successRate}%`}
                trend="stable"
                icon={<TrendingUp className="h-5 w-5 text-green-600" />}
              />
              <LiveMetricCard
                title="Failed Attempts"
                value={data.securityMetrics.failedAttempts.toString()}
                trend="down"
                icon={<Shield className="h-5 w-5 text-red-600" />}
              />
              <LiveMetricCard
                title="Response Time"
                value={data.securityMetrics.avgResponseTime}
                trend="stable"
                icon={<Activity className="h-5 w-5 text-purple-600" />}
              />
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              <TabsTrigger value="fixes">Quick Fixes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">{selectedSecurityIssue.title}</h3>
                  <Badge variant={selectedSecurityIssue.type === 'critical' ? 'destructive' : 'secondary'}>
                    {selectedSecurityIssue.type}
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-6">{selectedSecurityIssue.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Potential Dangers
                    </h4>
                    <ul className="space-y-2">
                      {selectedSecurityIssue.dangers.map((danger, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{danger}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Recommended Solutions
                    </h4>
                    <ul className="space-y-2">
                      {selectedSecurityIssue.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="providers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.providers.map((provider, index) => (
                  <ProviderStatusCard key={provider.name} provider={provider} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">🛡️ Security Metrics & Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                        <circle 
                          cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                          strokeDasharray={`${data.securityMetrics.overallScore * 2.51} 251`}
                          className="text-yellow-500 progress-glow"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{data.securityMetrics.overallScore}%</span>
                      </div>
                    </div>
                    <p className="font-medium">Overall Security Score</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Authentications Today</span>
                      <span className="font-medium">{data.securityMetrics.authenticationsToday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Failed Attempts</span>
                      <span className="font-medium text-red-600">{data.securityMetrics.failedAttempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Suspicious Activity</span>
                      <span className="font-medium text-orange-600">{data.securityMetrics.suspiciousActivity}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded">
                      <p className="text-sm font-medium text-green-800">Strong Areas</p>
                      <ul className="text-xs text-green-700 mt-1 space-y-1">
                        <li>• OAuth implementation</li>
                        <li>• Token encryption</li>
                        <li>• Session management</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-sm font-medium text-red-800">Vulnerabilities</p>
                      <ul className="text-xs text-red-700 mt-1 space-y-1">
                        <li>• SMS rate limiting</li>
                        <li>• Provider consistency</li>
                        <li>• Backup authentication</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ai-analysis" className="space-y-6">
              <AISecurityInsights analysis={selectedSecurityIssue} />
            </TabsContent>

            <TabsContent value="fixes" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">🛠️ Automated Security Fixes</h3>
                
                <div className="space-y-4">
                  {selectedSecurityIssue.quickFixes.map((fix, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{fix.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{fix.action}</p>
                          <Badge variant={fix.risk.includes('High') ? 'destructive' : fix.risk.includes('Medium') ? 'secondary' : 'default'}>
                            Risk: {fix.risk}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {/* Preview fix */}}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => onApplyFix(fix.name, selectedSecurityIssue.title)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Apply Fix
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-800">Learn More</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Visit our security documentation to understand best practices for multi-provider authentication setups.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Open Documentation
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Bar */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Analysis updated in real-time</span>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                📄 Export Analysis
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configure Providers
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Close Analysis
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};