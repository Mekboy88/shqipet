import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain,
  BookOpen,
  Settings,
  Eye,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  RefreshCw,
  Loader2,
  Search,
  Activity,
  Download,
  FileText,
  AlertCircle,
  Copy,
  Filter,
  Mail,
  Calendar,
  Bot,
  History,
  RotateCcw,
  CheckCircle2,
  Gauge,
  Award,
  BarChart,
  User,
  BarChart3,
  Info,
  Undo,
  Share
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSwitchToast } from '@/hooks/use-switch-toast';
import supabase from '@/lib/relaxedSupabase';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DiagnosticResults {
  passed: string[];
  warnings: string[];
  failed: string[];
  recommendations: string[];
}

interface EnhancedDiagnosticModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosticResults: DiagnosticResults;
  lastDiagnostic?: Date;
  onExportLogs?: () => void;
  onTakeAction?: (module: string, action: string) => void;
}

const EnhancedDiagnosticModal: React.FC<EnhancedDiagnosticModalProps> = ({
  open,
  onOpenChange,
  diagnosticResults,
  lastDiagnostic,
  onExportLogs,
  onTakeAction
}) => {
  console.log('EnhancedDiagnosticModal: Component starting to render');
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [analyzingModule, setAnalyzingModule] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detailedAnalysis, setDetailedAnalysis] = useState<any>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { user, userProfile, adminRole } = useAuth();

  // Simplified fetch function
  const fetchDiagnosticData = async () => {
    try {
      // Basic diagnostic data fetching
      console.log('Fetching diagnostic data...');
    } catch (error) {
      console.error('Error fetching diagnostic data:', error);
      toast({
        title: "❌ Data Fetch Error",
        description: "Failed to fetch diagnostic data",
        variant: "destructive"
      });
    }
  };

  // Effect for initial data load
  useEffect(() => {
    if (open) {
      fetchDiagnosticData();
    }
  }, [open]);

  // Handle analyze click
  const handleAnalyzeClick = async (module: string) => {
    setAnalyzingModule(module);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate analysis completion
      setTimeout(() => {
        setAnalyzingModule(null);
        setAnalysisProgress(0);
        toast({
          title: "✅ Analysis Complete",
          description: `${module} analysis completed successfully`
        });
      }, 2000);
    } catch (error) {
      setAnalyzingModule(null);
      setAnalysisProgress(0);
      toast({
        title: "❌ Analysis Error",
        description: "Failed to complete analysis",
        variant: "destructive"
      });
    }
  };

  // Render module row
  const renderModuleRow = (module: string, type: 'passed' | 'warning' | 'critical', index: number) => {
    const isSelected = selectedModule === module;

    const getStatusIcon = () => {
      if (type === 'passed') return <CheckCircle className="h-5 w-5 text-green-600" />;
      if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      return <XCircle className="h-5 w-5 text-red-600" />;
    };

    return (
      <div 
        key={module}
        className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="relative p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <h4 className="font-semibold text-gray-900">{module}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={type === 'critical' ? 'destructive' : type === 'warning' ? 'secondary' : 'default'}>
                    {type}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex flex-col space-y-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAnalyzeClick(module)}
                  disabled={analyzingModule === module}
                  className="text-xs"
                >
                  {analyzingModule === module ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-3 w-3 mr-1" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onTakeAction?.(module, type)}
                  className="text-xs"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Fix
                </Button>
              </div>
            </div>
          </div>

          {/* Analysis progress */}
          {analyzingModule === module && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                <span className="text-sm text-gray-600">Scanning security parameters...</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">{Math.round(analysisProgress)}% complete</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  console.log('EnhancedDiagnosticModal: About to return JSX');
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            🔍 Advanced Security Diagnostic & Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Summary Section */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">📊 Security Dashboard</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={onExportLogs}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Passed Checks</p>
                    <p className="text-2xl font-bold text-green-600">{diagnosticResults.passed.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{diagnosticResults.warnings.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Critical Issues</p>
                    <p className="text-2xl font-bold text-red-600">{diagnosticResults.failed.length}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="passed">Passed ({diagnosticResults.passed.length})</TabsTrigger>
              <TabsTrigger value="warnings">Warnings ({diagnosticResults.warnings.length})</TabsTrigger>
              <TabsTrigger value="failed">Critical ({diagnosticResults.failed.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">System Overview</h4>
                <p className="text-gray-600">
                  Complete security diagnostic analysis of your system. Review all security checks, 
                  warnings, and critical issues that require immediate attention.
                </p>
                
                {/* All modules combined */}
                <div className="space-y-3">
                  {[...diagnosticResults.passed, ...diagnosticResults.warnings, ...diagnosticResults.failed].map((module, index) => {
                    let type: 'passed' | 'warning' | 'critical' = 'passed';
                    if (diagnosticResults.warnings.includes(module)) type = 'warning';
                    if (diagnosticResults.failed.includes(module)) type = 'critical';
                    
                    return renderModuleRow(module, type, index);
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="passed" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-green-600">✅ Passed Security Checks</h4>
                {diagnosticResults.passed.map((module, index) => 
                  renderModuleRow(module, 'passed', index)
                )}
              </div>
            </TabsContent>

            <TabsContent value="warnings" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-yellow-600">⚠️ Warning Items</h4>
                {diagnosticResults.warnings.map((module, index) => 
                  renderModuleRow(module, 'warning', index)
                )}
              </div>
            </TabsContent>

            <TabsContent value="failed" className="space-y-4 mt-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-red-600">🚨 Critical Issues</h4>
                {diagnosticResults.failed.map((module, index) => 
                  renderModuleRow(module, 'critical', index)
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recommendations Section */}
          {diagnosticResults.recommendations.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Recommendations</h3>
              <div className="space-y-2">
                {diagnosticResults.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedDiagnosticModal;