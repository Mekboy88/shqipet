import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronDown, ChevronUp, Activity, AlertTriangle, CheckCircle, Clock, Loader2, Download, Copy, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// InfoTooltip component for consistent tooltips with consequences
const InfoTooltip = ({ children, content, type = 'info' }: { 
  children: React.ReactNode, 
  content: string, 
  type?: 'info' | 'warning' | 'danger' 
}) => {
  const iconColor = type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500';
  
  const formatContent = (text: string) => {
    const parts = text.split('CONSEQUENCES:');
    if (parts.length === 1) return <p className="text-sm">{text}</p>;
    
    return (
      <div>
        <p className="text-sm">{parts[0]}</p>
        <p className="text-sm"><span className="text-red-500 font-semibold">CONSEQUENCES:</span>{parts[1]}</p>
      </div>
    );
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2">
          {children}
          <Info className={`h-4 w-4 ${iconColor} cursor-help`} />
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm z-50 bg-white border shadow-lg">
        <div className="space-y-2">
          {formatContent(content)}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface AuthModuleCardProps {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'core' | 'critical' | 'optional';
  urgent?: boolean;
  actions?: string[];
  autoCheck?: boolean;
  checkInterval?: number;
  onActionClick?: (action: string) => void;
}

export const AuthModuleCard: React.FC<AuthModuleCardProps> = ({
  id,
  icon,
  title,
  description,
  category,
  urgent = false,
  actions = [],
  autoCheck = true,
  checkInterval = 30000,
  onActionClick
}) => {
  const [status, setStatus] = useState<'checking' | 'success' | 'warning' | 'error'>('checking');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logEntries, setLogEntries] = useState<{timestamp: string, status: string, message: string}[]>([]);
  const [testResult, setTestResult] = useState<{success: boolean, description: string, output: string, lastTested?: Date} | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'failed' | 'warnings'>('all');
  const [providers, setProviders] = useState({
    google: true,
    email: true,
    phone: true
  });
  const [showProviderWarning, setShowProviderWarning] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Simulate auto-checking behavior
  useEffect(() => {
    if (!autoCheck) return;
    
    const performCheck = () => {
      setStatus('checking');
      
      // Simulate real check with random results
      setTimeout(() => {
        const rand = Math.random();
        if (urgent && rand < 0.3) {
          setStatus('error');
        } else if (rand < 0.1) {
          setStatus('warning');
        } else {
          setStatus('success');
        }
        setLastChecked(new Date());
      }, 1000 + Math.random() * 2000);
    };
    
    // Initial check
    performCheck();
    
    // Set up interval
    const interval = setInterval(performCheck, checkInterval);
    
    return () => clearInterval(interval);
  }, [autoCheck, checkInterval, urgent]);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Checking...';
      case 'success':
        return 'Active';
      case 'warning':
        return 'Warning';
      case 'error':
        return urgent ? 'Critical' : 'Error';
      default:
        return 'Unknown';
    }
  };
  
  const getCardStyles = () => {
    const baseStyles = "border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer";
    
    if (urgent && status === 'error') {
      return `${baseStyles} bg-red-50 border-red-400 border-l-4`;
    }
    
    switch (category) {
      case 'core':
        return `${baseStyles} bg-blue-50 border-blue-200 border-l-4 border-l-blue-500`;
      case 'critical':
        return `${baseStyles} bg-yellow-50 border-yellow-200 border-l-4 border-l-yellow-500`;
      case 'optional':
        return `${baseStyles} bg-gray-50 border-gray-200 border-l-4 border-l-gray-400`;
      default:
        return `${baseStyles} bg-white border-gray-200`;
    }
  };
  
  const handleActionClick = async (action: string) => {
    setActionLoading(action);
    setSelectedAction(action);
    
    try {
      if (onActionClick) {
        await onActionClick(action);
      }
      
      // Simulate action completion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsDialogOpen(false);
    } finally {
      setActionLoading('');
    }
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const isStale = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    return diffInMinutes > 10;
  };

  const handleViewLogs = () => {
    // Generate sample logs based on module type and status
    const sampleLogs = [
      { timestamp: new Date().toISOString(), status: 'INFO', message: `${title} check completed successfully` },
      { timestamp: new Date(Date.now() - 300000).toISOString(), status: 'WARN', message: 'Minor delay detected in response time' },
      { timestamp: new Date(Date.now() - 600000).toISOString(), status: 'ERROR', message: 'Connection timeout to external service' },
      { timestamp: new Date(Date.now() - 900000).toISOString(), status: 'INFO', message: 'Auto-refresh cycle initiated' },
      { timestamp: new Date(Date.now() - 1200000).toISOString(), status: 'WARN', message: 'Rate limit approaching threshold' }
    ];
    setLogEntries(sampleLogs);
    setShowLogs(true);
  };

  const getFilteredLogs = () => {
    switch (logFilter) {
      case 'failed':
        return logEntries.filter(log => log.status === 'ERROR');
      case 'warnings':
        return logEntries.filter(log => log.status === 'WARN');
      default:
        return logEntries;
    }
  };

  const exportModuleLogs = () => {
    const data = {
      module: title,
      timestamp: new Date().toISOString(),
      logs: getFilteredLogs(),
      status: status,
      lastChecked: lastChecked.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${id}-logs-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "📄 Logs Exported",
      description: `${title} logs exported successfully`,
      duration: 3000,
    });
  };

  const [isCopied, setIsCopied] = useState(false);
  
  const copyLogsToClipboard = () => {
    const logsText = getFilteredLogs()
      .map(log => `[${new Date(log.timestamp).toLocaleString()}] ${log.status}: ${log.message}`)
      .join('\n');
    
    navigator.clipboard.writeText(logsText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    toast({
      title: "📋 Logs Copied",
      description: "Log entries copied to clipboard",
      duration: 2000,
    });
  };

  const handleTestNow = async () => {
    setStatus('checking');
    setActionLoading('Test Now');
    
    try {
      // Simulate module-specific test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const testResults = getModuleSpecificTestResult();
      setTestResult({
        ...testResults,
        lastTested: new Date()
      });
      
      // Update status based on test result
      setStatus(testResults.success ? 'success' : 'error');
      setLastChecked(new Date());
      
      toast({
        title: testResults.success ? "✅ Test Completed" : "❌ Test Failed",
        description: testResults.description,
        duration: 3000,
      });
    } finally {
      setActionLoading('');
    }
  };

  const getModuleSpecificTestResult = () => {
    switch (id) {
      case 'multi-provider-auth':
        return {
          success: Math.random() > 0.2,
          description: 'Validated OAuth providers and password authentication',
          output: 'Google: ✅ Connected\nEmail: ✅ Working\nPhone Number: ⚠️ Rate limited'
        };
      case 'session-management':
        return {
          success: Math.random() > 0.1,
          description: 'Checked token refresh and logout sync',
          output: 'Token refresh: 250ms\nLogout sync: Active\nGhost sessions: None detected'
        };
      case 'verification-system':
        return {
          success: Math.random() > 0.15,
          description: 'Tested SMS and email verification systems',
          output: 'Twilio: ✅ Connected\nSendGrid: ✅ Connected\nTest code sent: 842357'
        };
      default:
        return {
          success: Math.random() > 0.2,
          description: `Performed ${title} module check`,
          output: 'All systems operational'
        };
    }
  };

  const handleFixSettings = () => {
    setShowSettings(true);
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={getCardStyles()} onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="text-xl">{icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-800">{title}</h4>
                    {getStatusIcon()}
                    <span className={`text-xs px-2 py-1 rounded font-medium ${
                      status === 'success' ? 'bg-green-100 text-green-800' :
                      status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {getStatusText()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                   <div className="flex items-center space-x-1">
                     <Clock className="w-3 h-3" />
                     <span className={isStale(lastChecked) ? 'text-red-500' : ''}>
                       Last checked: {formatTimeAgo(lastChecked)}
                       {isStale(lastChecked) && ' (stale)'}
                     </span>
                   </div>
                    {autoCheck && (
                      <span>Auto-refresh: {checkInterval / 1000}s</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {actions.length > 0 && (
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <InfoTooltip 
                        content="Access module-specific actions for configuration, testing, and troubleshooting. These actions can modify authentication behavior. CONSEQUENCES: Incorrect actions may disrupt authentication flows, cause user lockouts, or create security vulnerabilities."
                        type="warning"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsDialogOpen(true);
                          }}
                        >
                          Actions
                        </Button>
                      </InfoTooltip>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{icon} {title} - Actions</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 mt-4">
                        {actions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start"
                            disabled={actionLoading === action}
                            onClick={() => handleActionClick(action)}
                          >
                            {actionLoading === action && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            {action}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Status Details</h5>
                    <div className="space-y-1 text-gray-600">
                      <div>Current Status: {getStatusText()}</div>
                      <div>Last Update: {lastChecked.toLocaleString()}</div>
                      <div>Auto-refresh: {autoCheck ? 'Enabled' : 'Disabled'}</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Quick Actions</h5>
                    <div className="flex flex-wrap gap-2">
                      <InfoTooltip 
                        content="View detailed logs for this authentication module including errors, warnings, and activity history. Essential for troubleshooting. CONSEQUENCES: Not monitoring logs may miss critical security events and make debugging authentication issues impossible."
                        type="warning"
                      >
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewLogs();
                          }}
                          disabled={actionLoading === 'View Logs'}
                        >
                          {actionLoading === 'View Logs' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                          View Logs
                        </Button>
                      </InfoTooltip>
                      <InfoTooltip 
                        content="Run immediate test on this authentication module to verify current functionality and detect issues. Tests may impact system performance temporarily. CONSEQUENCES: Skipping regular tests may leave broken authentication modules undetected, leading to user access failures."
                        type="info"
                      >
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTestNow();
                          }}
                          disabled={actionLoading === 'Test Now'}
                        >
                          {actionLoading === 'Test Now' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                          Test Now
                        </Button>
                      </InfoTooltip>
                      <InfoTooltip 
                        content="Open advanced settings configuration for this authentication module. Allows modification of security parameters and behavior. CONSEQUENCES: Incorrect settings may compromise authentication security, cause performance issues, or block legitimate users."
                        type="danger"
                      >
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFixSettings();
                          }}
                        >
                          Fix Settings
                        </Button>
                      </InfoTooltip>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to expand • Auto-checks every {checkInterval / 1000}s</p>
        </TooltipContent>
      </Tooltip>

      {/* Logs Modal */}
      <Dialog open={showLogs} onOpenChange={setShowLogs}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>📋 {title} - Logs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2 mb-4 flex-wrap">
              <InfoTooltip 
                content="View all log entries for this module including informational messages, warnings, and errors. CONSEQUENCES: Missing comprehensive log review may overlook patterns that indicate system degradation or security issues."
                type="info"
              >
                <Button 
                  size="sm" 
                  variant={logFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setLogFilter('all')}
                  className={logFilter === 'all' ? 'border-b-2 border-blue-500' : ''}
                >
                  All Logs
                </Button>
              </InfoTooltip>
              <InfoTooltip 
                content="Filter to show only failed operations and critical errors. Essential for identifying system failures and security breaches. CONSEQUENCES: Ignoring failed operations can lead to unresolved authentication issues and security vulnerabilities."
                type="danger"
              >
                <Button 
                  size="sm" 
                  variant={logFilter === 'failed' ? 'default' : 'outline'}
                  onClick={() => setLogFilter('failed')}
                  className={logFilter === 'failed' ? 'border-b-2 border-red-500' : ''}
                >
                  Only Failed
                </Button>
              </InfoTooltip>
              <InfoTooltip 
                content="Filter to show only warning messages that indicate potential issues or degraded performance. Early warning system for preventing failures. CONSEQUENCES: Ignoring warnings often leads to system failures that could have been prevented with timely intervention."
                type="warning"
              >
                <Button 
                  size="sm" 
                  variant={logFilter === 'warnings' ? 'default' : 'outline'}
                  onClick={() => setLogFilter('warnings')}
                  className={logFilter === 'warnings' ? 'border-b-2 border-yellow-500' : ''}
                >
                  Only Warnings
                </Button>
              </InfoTooltip>
              <div className="ml-auto flex gap-2">
                <InfoTooltip 
                  content="Export filtered log data as JSON file for analysis, compliance reporting, or external monitoring systems. CONSEQUENCES: Not maintaining exportable logs may violate compliance requirements and hinder forensic analysis during security incidents."
                  type="info"
                >
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={exportModuleLogs}
                    className="flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </Button>
                </InfoTooltip>
                <InfoTooltip 
                  content="Copy filtered log entries to clipboard for quick sharing or documentation. Useful for incident reporting and troubleshooting. CONSEQUENCES: Not being able to quickly share log data may delay incident response and problem resolution."
                  type="info"
                >
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyLogsToClipboard}
                    className="flex items-center gap-1 hover:bg-green-100 hover:border-green-300 hover:text-green-700 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </InfoTooltip>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {getFilteredLogs().length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No logs found for this filter
                  </div>
                ) : (
                  getFilteredLogs().map((log, index) => (
                    <div key={index} className="flex gap-4 text-sm">
                      <span className="text-gray-500 font-mono text-xs">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.status === 'INFO' ? 'bg-blue-100 text-blue-800' :
                        log.status === 'WARN' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>⚙️ {title} - Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {getModuleSettings()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Result Modal */}
      {testResult && (
        <Dialog open={!!testResult} onOpenChange={() => setTestResult(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {testResult.success ? '✅' : '❌'} Test Result - {title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-gray-600">{testResult.description}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Output</h3>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap">{testResult.output}</pre>
              </div>
              {testResult.lastTested && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-800">Last Tested</h3>
                  <p className="text-sm text-blue-600">{testResult.lastTested.toLocaleString()}</p>
                </div>
              )}
              {!testResult.success && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">🚨 Action Required</h3>
                  <p className="text-sm text-red-600">
                    This module requires immediate attention. Check the logs and fix the issues identified.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Provider Warning Modal */}
      {showProviderWarning && (
        <Dialog open={!!showProviderWarning} onOpenChange={() => setShowProviderWarning(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>⚠️ Provider Toggle Warning</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to {providers[showProviderWarning as keyof typeof providers] ? 'disable' : 'enable'} {showProviderWarning} authentication?
              </p>
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowProviderWarning(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    // Apply the change - toggle the provider state
                    const currentState = providers[showProviderWarning as keyof typeof providers];
                    setProviders(prev => ({ ...prev, [showProviderWarning as string]: !currentState }));
                    toast({
                      title: "✅ Provider Updated",
                      description: `${showProviderWarning} provider has been ${currentState ? 'disabled' : 'enabled'}`,
                      duration: 3000,
                    });
                    setShowProviderWarning(null);
                  }}
                >
                  Proceed
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </TooltipProvider>
  );

  function getModuleSettings() {
    switch (id) {
      case 'multi-provider-auth':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Provider Settings</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Google OAuth</span>
                  <InfoTooltip 
                    content="Toggle Google OAuth authentication provider. Controls whether users can sign in with Google accounts. CONSEQUENCES: Disabling may lock out users who only have Google authentication, causing access failures and user frustration."
                    type="warning"
                  >
                    <Switch 
                      checked={providers.google}
                      onCheckedChange={(checked) => {
                        setShowProviderWarning('google');
                      }}
                    />
                  </InfoTooltip>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Email Authentication</span>
                  <InfoTooltip 
                    content="Toggle email-based authentication. Controls traditional email/password login functionality. CONSEQUENCES: Disabling email authentication may prevent users from accessing accounts if other providers are unavailable, creating single points of failure."
                    type="warning"
                  >
                    <Switch 
                      checked={providers.email}
                      onCheckedChange={(checked) => {
                        setShowProviderWarning('email');
                      }}
                    />
                  </InfoTooltip>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span>Phone Number Verification</span>
                  <InfoTooltip 
                    content="Toggle phone number verification for authentication. Controls SMS-based verification and 2FA capabilities. CONSEQUENCES: Disabling phone verification removes important security layer and may prevent users from completing verification processes."
                    type="warning"
                  >
                    <Switch 
                      checked={providers.phone}
                      onCheckedChange={(checked) => {
                        setShowProviderWarning('phone');
                      }}
                    />
                  </InfoTooltip>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rate Limits</label>
              <input type="number" defaultValue="10" className="w-full p-2 border rounded" />
              <span className="text-xs text-gray-500">Max attempts per minute</span>
            </div>
          </div>
        );
      case 'session-management':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token Lifespan (hours)</label>
              <input type="number" defaultValue="24" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Idle Timeout (minutes)</label>
              <input type="number" defaultValue="30" className="w-full p-2 border rounded" />
            </div>
              <div className="flex items-center justify-between">
                <span>Auto logout on device change</span>
                <InfoTooltip 
                  content="Automatically log out users when device fingerprint changes. Enhanced security feature to prevent session hijacking. CONSEQUENCES: Disabling may allow compromised devices to maintain access, while enabling may cause legitimate users to be logged out frequently."
                  type="info"
                >
                  <Switch defaultChecked />
                </InfoTooltip>
              </div>
          </div>
        );
      case 'rate-limiting':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Attempts per IP</label>
              <input type="number" defaultValue="10" className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cooldown Period (minutes)</label>
              <input type="number" defaultValue="15" className="w-full p-2 border rounded" />
            </div>
              <div className="flex items-center justify-between">
                <span>Auto-block suspicious IPs</span>
                <InfoTooltip 
                  content="Automatically block IP addresses showing suspicious activity patterns. Proactive security measure against attacks. CONSEQUENCES: Disabling reduces automated protection against brute force attacks, while enabling may occasionally block legitimate users."
                  type="warning"
                >
                  <Switch defaultChecked />
                </InfoTooltip>
              </div>
          </div>
        );
      case 'mfa-enforcement':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">MFA Enforcement by Role</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Admin - Required</span>
                    <InfoTooltip 
                      content="Enforce multi-factor authentication for admin accounts. Critical security requirement for administrative access. CONSEQUENCES: Disabling MFA for admins creates severe security vulnerability and greatly increases risk of account compromise."
                      type="danger"
                    >
                      <Switch defaultChecked />
                    </InfoTooltip>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>Moderator - Required</span>
                    <InfoTooltip 
                      content="Enforce multi-factor authentication for moderator accounts. Important security measure for elevated privileges. CONSEQUENCES: Disabling MFA for moderators reduces security and increases risk of unauthorized moderation actions."
                      type="warning"
                    >
                      <Switch defaultChecked />
                    </InfoTooltip>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span>User - Optional</span>
                    <InfoTooltip 
                      content="Allow optional multi-factor authentication for regular users. Balances security with user experience. CONSEQUENCES: Making MFA optional reduces overall security but improves user adoption, while requiring it enhances security but may impact user experience."
                      type="info"
                    >
                      <Switch />
                    </InfoTooltip>
                  </div>
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Current MFA Adoption Rate</label>
              <div className="text-2xl font-bold text-blue-600">37%</div>
              <InfoTooltip 
                content="Send MFA reminder notifications to all users encouraging them to enable multi-factor authentication. Helps improve security adoption. CONSEQUENCES: Not promoting MFA adoption leaves users vulnerable to account takeover attacks and reduces overall system security."
                type="info"
              >
                <Button className="mt-2" size="sm">Send MFA Reminder to All Users</Button>
              </InfoTooltip>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">General Settings</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Enable Module</span>
                  <InfoTooltip 
                    content="Enable or disable this authentication module completely. Controls whether this module participates in authentication flows. CONSEQUENCES: Disabling modules may break authentication functionality and leave security gaps in the system."
                    type="danger"
                  >
                    <Switch defaultChecked />
                  </InfoTooltip>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check Interval (seconds)</label>
                  <input type="number" defaultValue={checkInterval / 1000} className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
};