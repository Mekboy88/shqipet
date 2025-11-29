import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { RefreshCw, Download, Pause, Play, Database, Shield, Zap, Search, X, Copy, ChevronDown, ChevronRight, AlertTriangle, Clock, Activity } from 'lucide-react';
import { toast } from 'sonner';

const QueryLogsViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('1h');

  // Fetch Database Logs
  const { data: dbLogs = [], refetch: refetchDb } = useQuery({
    queryKey: ['db-logs', timeRange],
    queryFn: async () => {
      const limit = timeRange === '1h' ? 100 : timeRange === '6h' ? 200 : 500;
      const { data, error } = await supabase.functions.invoke('get-logs', {
        body: { logType: 'database', limit },
      });
      if (error) throw error;
      return (data?.logs || []).map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        event_message: log.event_message,
        error_severity: log.error_severity,
        source: 'database'
      }));
    },
    refetchInterval: isAutoRefresh ? 5000 : false,
  });

  // Fetch Auth Logs
  const { data: authLogs = [], refetch: refetchAuth } = useQuery({
    queryKey: ['auth-logs', timeRange],
    queryFn: async () => {
      const limit = timeRange === '1h' ? 100 : timeRange === '6h' ? 200 : 500;
      const { data, error } = await supabase.functions.invoke('get-logs', {
        body: { logType: 'auth', limit },
      });
      if (error) throw error;
      return (data?.logs || []).map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        event_message: log.event_message,
        level: log.level,
        status: log.status,
        path: log.path,
        msg: log.msg,
        error: log.error,
        source: 'auth'
      }));
    },
    refetchInterval: isAutoRefresh ? 5000 : false,
  });

  // Fetch Edge Function Logs
  const { data: edgeLogs = [], refetch: refetchEdge } = useQuery({
    queryKey: ['edge-logs', timeRange],
    queryFn: async () => {
      const limit = timeRange === '1h' ? 100 : timeRange === '6h' ? 200 : 500;
      const { data, error } = await supabase.functions.invoke('get-logs', {
        body: { logType: 'edge', limit },
      });
      if (error) throw error;
      return (data?.logs || []).map((log: any) => ({
        id: log.id,
        timestamp: log.timestamp,
        event_message: log.event_message,
        status_code: log.status_code,
        method: log.method,
        function_id: log.function_id,
        execution_time_ms: log.execution_time_ms,
        source: 'edge'
      }));
    },
    refetchInterval: isAutoRefresh ? 5000 : false,
  });

  // Combine all logs
  const allLogs = [...dbLogs, ...authLogs, ...edgeLogs].sort((a, b) => b.timestamp - a.timestamp);

  // Filter logs
  const filterLogs = (logs: any[]) => {
    return logs.filter(log => {
      const matchesSearch = !searchQuery || 
        log.event_message?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const severity = log.error_severity || log.level || 'INFO';
      const matchesSeverity = severityFilter.length === 0 || 
        severityFilter.includes(severity.toUpperCase());
      
      return matchesSearch && matchesSeverity;
    });
  };

  const filteredDbLogs = filterLogs(dbLogs);
  const filteredAuthLogs = filterLogs(authLogs);
  const filteredEdgeLogs = filterLogs(edgeLogs);
  const filteredAllLogs = filterLogs(allLogs);

  const handleRefresh = () => {
    refetchDb();
    refetchAuth();
    refetchEdge();
    toast.success('Logs refreshed');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredAllLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logs-${new Date().toISOString()}.json`;
    link.click();
    toast.success('Logs exported');
  };

  // Stats
  const totalLogs = dbLogs.length + authLogs.length + edgeLogs.length;
  const errorCount = [
    ...dbLogs.filter(l => l.error_severity === 'ERROR'),
    ...authLogs.filter(l => l.level === 'error'),
    ...edgeLogs.filter(l => l.status_code && l.status_code >= 400),
  ].length;
  const errorRate = totalLogs > 0 ? ((errorCount / totalLogs) * 100).toFixed(1) : '0';
  const avgExecutionTime = edgeLogs.length > 0
    ? (edgeLogs.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / edgeLogs.length).toFixed(0)
    : '0';
  const slowQueries = edgeLogs.filter(l => l.execution_time_ms && l.execution_time_ms > 1000).length;

  const SEVERITY_OPTIONS = ['ERROR', 'WARN', 'INFO', 'LOG'];
  const TIME_RANGES = [
    { value: '1h', label: 'Last 1 hour' },
    { value: '6h', label: 'Last 6 hours' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Query Logs Viewer</h1>
          <p className="text-muted-foreground mt-1">Real-time monitoring of all system logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          >
            {isAutoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAutoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Logs', value: totalLogs.toLocaleString(), icon: Database, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
          { title: 'Error Rate', value: `${errorRate}%`, icon: AlertTriangle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
          { title: 'Avg Response Time', value: `${avgExecutionTime}ms`, icon: Clock, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
          { title: 'Slow Queries', value: slowQueries.toString(), icon: Activity, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {(searchQuery || severityFilter.length > 0 || timeRange !== '1h') && (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSeverityFilter([]); setTimeRange('1h'); }}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">Severity:</span>
            {SEVERITY_OPTIONS.map((severity) => (
              <Badge
                key={severity}
                variant={severityFilter.includes(severity) ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setSeverityFilter(prev => 
                  prev.includes(severity) ? prev.filter(s => s !== severity) : [...prev, severity]
                )}
              >
                {severity}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">Time Range:</span>
            {TIME_RANGES.map((range) => (
              <Badge
                key={range.value}
                variant={timeRange === range.value ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Logs Tabs */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/50">
            <TabsTrigger value="all" className="gap-2">
              <Database className="w-4 h-4" />
              All Logs
              <Badge variant="secondary" className="ml-1">{filteredAllLogs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="database" className="gap-2">
              <Database className="w-4 h-4" />
              Database
              <Badge variant="secondary" className="ml-1">{filteredDbLogs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="auth" className="gap-2">
              <Shield className="w-4 h-4" />
              Auth
              <Badge variant="secondary" className="ml-1">{filteredAuthLogs.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="edge" className="gap-2">
              <Zap className="w-4 h-4" />
              Edge Functions
              <Badge variant="secondary" className="ml-1">{filteredEdgeLogs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {['all', 'database', 'auth', 'edge'].map(tab => {
            const logs = tab === 'all' ? filteredAllLogs : 
                        tab === 'database' ? filteredDbLogs :
                        tab === 'auth' ? filteredAuthLogs : filteredEdgeLogs;
            
            return (
              <TabsContent key={tab} value={tab} className="space-y-2 p-4 max-h-[600px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No logs found
                  </div>
                ) : (
                  logs.map((log) => <LogEntry key={log.id} log={log} />)
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </Card>

      {isAutoRefresh && (
        <div className="text-center text-sm text-muted-foreground">
          Auto-refreshing every 5 seconds
        </div>
      )}
    </div>
  );
};

// LogEntry Component
const LogEntry: React.FC<{ log: any }> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: string) => {
    const sev = severity?.toUpperCase() || 'INFO';
    switch (sev) {
      case 'ERROR':
      case 'CRITICAL':
        return 'destructive';
      case 'WARN':
      case 'WARNING':
        return 'default';
      case 'LOG':
      case 'INFO':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'auth':
        return <Shield className="w-4 h-4" />;
      case 'edge':
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp / 1000).toLocaleString();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const severity = log.error_severity || log.level || 'INFO';
  const isSlowQuery = log.execution_time_ms && log.execution_time_ms > 1000;

  return (
    <Card className={`p-4 bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/50 transition-colors ${
      isSlowQuery ? 'border-l-4 border-l-orange-500' : ''
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {getSourceIcon(log.source)}
            <Badge variant={getSeverityColor(severity)}>{severity}</Badge>
            {log.status_code && (
              <Badge variant={log.status_code >= 400 ? 'destructive' : 'secondary'}>
                {log.status_code}
              </Badge>
            )}
            {log.method && <Badge variant="outline">{log.method}</Badge>}
            {isSlowQuery && <Badge variant="default" className="bg-orange-500">Slow Query</Badge>}
            <span className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
          </div>
          <p className="text-sm text-foreground font-mono">{log.event_message}</p>
          {log.execution_time_ms && (
            <div className="text-xs text-muted-foreground">
              Execution time: {log.execution_time_ms}ms
            </div>
          )}
          {isExpanded && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md">
              <pre className="text-xs overflow-x-auto">{JSON.stringify(log, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleCopy(log.event_message)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QueryLogsViewer;
