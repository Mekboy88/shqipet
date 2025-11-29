import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, Clock, RotateCcw, Download, AlertTriangle, 
  CheckCircle, Filter, X, Eye, AlertCircle, Play,
  Zap, RefreshCw, User, MapPin, Calendar, Activity,
  Ban, LogOut, Trash2, Settings, Info, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface TokenEntry {
  id: string;
  userId: string;
  ipAddress: string;
  issuedAt: string;
  expiry: string;
  attempts: number;
  status: 'Active' | 'Expired' | 'Failed' | 'Revoked';
  userAgent?: string;
  location?: string;
  riskScore?: number;
}

interface DetectedIssue {
  id: string;
  type: 'logout_invalidation' | 'refresh_expired' | 'blacklist_missing';
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  affectedCount: number;
}

const JWTTokenLifecycle: React.FC = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [ipFilter, setIpFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenEntry | null>(null);
  const [showAutoFixModal, setShowAutoFixModal] = useState(false);
  const [autoFixProgress, setAutoFixProgress] = useState(0);
  const [isApplyingFixes, setIsApplyingFixes] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [scanDuration, setScanDuration] = useState('1.2s');
  const [totalScans, setTotalScans] = useState(42);
  const [showIssueModal, setShowIssueModal] = useState<DetectedIssue | null>(null);
  const [autoFixSteps, setAutoFixSteps] = useState([
    { name: 'Token logout rule updated', completed: false, failed: false },
    { name: 'Refresh policy patched', completed: false, failed: false },
    { name: 'Blacklist validation complete', completed: false, failed: false }
  ]);

  // Mock data
  const [tokenEntries] = useState<TokenEntry[]>([
    {
      id: '1',
      userId: 'user_123',
      ipAddress: '192.168.1.100',
      issuedAt: '2024-01-15 10:30:00',
      expiry: '2024-01-16 10:30:00',
      attempts: 1,
      status: 'Active',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      location: 'New York, US',
      riskScore: 85
    },
    {
      id: '2',
      userId: 'user_456',
      ipAddress: '10.0.0.5',
      issuedAt: '2024-01-14 15:20:00',
      expiry: '2024-01-15 15:20:00',
      attempts: 3,
      status: 'Expired',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      location: 'London, UK',
      riskScore: 45
    },
    {
      id: '3',
      userId: 'user_789',
      ipAddress: '172.16.0.10',
      issuedAt: '2024-01-15 09:00:00',
      expiry: '2024-01-16 09:00:00',
      attempts: 5,
      status: 'Failed',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      location: 'Tokyo, JP',
      riskScore: 25
    }
  ]);

  const [detectedIssues] = useState<DetectedIssue[]>([
    {
      id: 'critical_issue_1',
      type: 'logout_invalidation',
      title: 'Critical issue found',
      description: 'Refresh token expiration misaligned with session lifespan.',
      severity: 'critical',
      affectedCount: 7
    },
    {
      id: 'critical_issue_2',
      type: 'refresh_expired',
      title: 'Immediate action required',
      description: 'Multiple tokens failing refresh validation causing session drops.',
      severity: 'critical',
      affectedCount: 12
    },
    {
      id: 'critical_issue_3',
      type: 'blacklist_missing',
      title: 'Security breach potential',
      description: 'Token blacklist enforcement not properly validating revoked tokens.',
      severity: 'critical',
      affectedCount: 3
    }
  ]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastChecked(new Date());
        setTotalScans(prev => prev + 1);
        // Simulate refresh logic
      }, 60000); // 60 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Timer update every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (autoRefresh) {
        setLastChecked(prev => new Date(prev));
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const getTimeSinceLastCheck = () => {
    const diff = Date.now() - lastChecked.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    if (seconds < 10) {
      return 'Just now';
    }
    return `${seconds}s ago`;
  };

  const getFullTimestamp = () => {
    return lastChecked.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Expired': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'Revoked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTokens = tokenEntries.filter(token => {
    const matchesUserId = !userIdFilter || token.userId.toLowerCase().includes(userIdFilter.toLowerCase());
    const matchesIp = !ipFilter || token.ipAddress.includes(ipFilter);
    const matchesStatus = statusFilter === 'All' || token.status === statusFilter;
    
    // Filter by selected issues
    if (selectedIssues.length > 0) {
      // Show only tokens affected by selected issues
      const isAffected = selectedIssues.some(issueId => {
        if (issueId === 'critical_issue_1' && token.status === 'Active') return true;
        if (issueId === 'critical_issue_2' && token.status === 'Failed') return true;
        if (issueId === 'critical_issue_3' && token.status === 'Expired') return true;
        return false;
      });
      return matchesUserId && matchesIp && matchesStatus && isAffected;
    }
    
    return matchesUserId && matchesIp && matchesStatus;
  });

  const handleExport = async (format: 'csv' | 'json') => {
    if (format === 'csv') {
      setIsExportingCsv(true);
    } else {
      setIsExportingJson(true);
    }
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = filteredTokens;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `jwt-lifecycle-export-${timestamp}.${format}`;
    
    if (format === 'csv') {
      const headers = ['User ID', 'IP Address', 'Issued At', 'Expiry', 'Attempts', 'Status', 'Risk Score'];
      const csvContent = [
        headers.join(','),
        ...data.map(token => [
          token.userId,
          token.ipAddress,
          token.issuedAt,
          token.expiry,
          token.attempts,
          token.status,
          token.riskScore || 'N/A'
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setIsExportingCsv(false);
    } else {
      const exportData = {
        exportTimestamp: new Date().toISOString(),
        appliedFilters: {
          userIdFilter,
          ipFilter,
          statusFilter,
          selectedIssues
        },
        totalTokens: data.length,
        tokens: data
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setIsExportingJson(false);
    }
    
    toast.success(`✅ Token logs exported successfully as ${filename}`);
  };

  const handleManualScan = async () => {
    setIsScanning(true);
    const startTime = Date.now();
    
    // Simulate scan delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(1);
    setScanDuration(`${duration}s`);
    setLastChecked(new Date());
    setTotalScans(prev => prev + 1);
    setIsScanning(false);
    
    const issueCount = detectedIssues.length;
    toast.success(`✅ Manual scan completed. ${issueCount} issues detected.`);
  };

  const handleAutoFix = async () => {
    setIsApplyingFixes(true);
    setAutoFixProgress(0);
    
    // Reset steps
    setAutoFixSteps(steps => steps.map(step => ({ ...step, completed: false, failed: false })));
    
    // Simulate step-by-step fixes with potential failures
    for (let i = 0; i < autoFixSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate potential failure on step 2 (20% chance)
      const failed = i === 1 && Math.random() < 0.2;
      
      setAutoFixSteps(steps => 
        steps.map((step, index) => 
          index === i ? { ...step, completed: !failed, failed } : step
        )
      );
      
      setAutoFixProgress(((i + 1) / autoFixSteps.length) * 100);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const hasFailures = autoFixSteps.some(step => step.failed);
    
    if (hasFailures) {
      toast.error('❌ One or more fixes failed — see logs.');
      // Keep modal open for retry
    } else {
      setIsApplyingFixes(false);
      setShowAutoFixModal(false);
      toast.success('✅ JWT token patching complete');
      
      // Trigger rescan
      setTimeout(() => {
        handleManualScan();
      }, 1000);
    }
  };

  const handleIssueClick = (issue: DetectedIssue) => {
    const isSelected = selectedIssues.includes(issue.id);
    if (isSelected) {
      setSelectedIssues(prev => prev.filter(id => id !== issue.id));
    } else {
      setSelectedIssues(prev => [...prev, issue.id]);
    }
  };

  const handleTokenRowClick = (token: TokenEntry) => {
    setSelectedToken(token);
  };

  const handleRevokeToken = async (tokenId: string) => {
    // Simulate revocation
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Token revoked successfully');
    setSelectedToken(null);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Critical Header with Animation */}
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center justify-between border-b border-red-200 pb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">JWT Token Lifecycle</h3>
                <p className="text-sm text-red-700">Track session tokens for expiration, invalidation, and refresh issues</p>
              </div>
              
              <Tooltip>
                <TooltipTrigger>
                  <Badge 
                    variant="destructive" 
                    className="cursor-pointer hover:bg-destructive/80 bg-red-600 animate-pulse"
                    onClick={() => setShowAutoFixModal(true)}
                  >
                    CRITICAL
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>One or more token issues are actively affecting user session integrity</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                  className={autoRefresh ? 'data-[state=checked]:bg-green-600' : ''}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-sm text-red-700">Auto-refresh</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-refresh every 60 seconds</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualScan}
                disabled={isScanning}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Re-scanning...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Manual Re-Scan
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Status Information */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="text-red-700">Last checked: {getTimeSinceLastCheck()}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last Checked: {getFullTimestamp()}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-red-600">Duration: {scanDuration}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scan duration = backend validation + token query</p>
                </TooltipContent>
              </Tooltip>
              
              <span className="text-red-600">Total scans: {totalScans}</span>
            </div>
          </div>
        </div>

        {/* Detected Issues */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              📑 Detected Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {detectedIssues.map(issue => {
                const isSelected = selectedIssues.includes(issue.id);
                return (
                  <Tooltip key={issue.id}>
                    <TooltipTrigger>
                      <div 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                          isSelected 
                            ? 'bg-red-100 border-2 border-red-400 shadow-lg shadow-red-200/50' 
                            : 'bg-red-50 border border-red-200 hover:bg-red-100 hover:shadow-md'
                        }`}
                        onClick={() => handleIssueClick(issue)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <AlertTriangle className={`w-4 h-4 transition-colors ${isSelected ? 'text-red-700' : 'text-red-600'}`} />
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-red-800' : 'text-red-700'}`}>
                              {issue.title}
                            </span>
                            <span className={`text-xs transition-colors ${isSelected ? 'text-red-600' : 'text-red-500'}`}>
                              {issue.affectedCount} tokens affected
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isSelected && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-red-200 rounded-full">
                              <CheckCircle className="w-3 h-3 text-red-700" />
                              <span className="text-xs text-red-800 font-medium">Selected</span>
                            </div>
                          )}
                          <HelpCircle className={`w-4 h-4 transition-colors ${isSelected ? 'text-red-700' : 'text-red-600'}`} />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs font-medium">{issue.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Selected Issues Summary */}
            {selectedIssues.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-semibold text-red-900 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Selected Issues ({selectedIssues.length})
                  </h5>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-red-300 text-red-700"
                    onClick={() => setSelectedIssues([])}
                  >
                    Clear Selection
                  </Button>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    onClick={() => setShowAutoFixModal(true)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Fix Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-red-300 text-red-700"
                    onClick={() => setSelectedIssues([])}
                  >
                    Ignore
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-xs border-red-300 text-red-700"
                  >
                    Mark as Reviewed
                  </Button>
                </div>

                <div className="text-xs text-red-700 bg-red-100 p-2 rounded">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Token table below filtered to show only affected entries ({filteredTokens.length} tokens)
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input
                placeholder="Filter by User ID..."
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="pr-8 border-red-200 focus:border-red-400"
              />
              {userIdFilter && (
                <button
                  onClick={() => setUserIdFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input
                placeholder="Filter by IP Address..."
                value={ipFilter}
                onChange={(e) => setIpFilter(e.target.value)}
                className="pr-8 border-red-200 focus:border-red-400"
              />
              {ipFilter && (
                <button
                  onClick={() => setIpFilter('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] border-red-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
              <SelectItem value="Revoked">Revoked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Token Lifecycle Table */}
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-red-900">🔍 Token Lifecycle Entries</CardTitle>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('csv')}
                    disabled={isExportingCsv}
                    className="border-red-300 text-red-700"
                  >
                    {isExportingCsv ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export CSV
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exporting token session logs...</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport('json')}
                    disabled={isExportingJson}
                    className="border-red-300 text-red-700"
                  >
                    {isExportingJson ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export JSON
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exporting token session logs...</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Issued At</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTokens.map((token) => (
                  <Tooltip key={token.id}>
                    <TooltipTrigger>
                      <TableRow 
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => handleTokenRowClick(token)}
                      >
                        <TableCell className="font-medium">{token.userId}</TableCell>
                        <TableCell>{token.ipAddress}</TableCell>
                        <TableCell>{token.issuedAt}</TableCell>
                        <TableCell>{token.expiry}</TableCell>
                        <TableCell>{token.attempts}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(token.status)}>
                            {token.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {token.riskScore && (
                            <Badge className={getRiskScoreColor(token.riskScore)}>
                              {token.riskScore}%
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Issued for {token.userId}, {token.status.toLowerCase()} 
                        {token.status === 'Expired' && ', expired 5m ago. Auto-refresh failed.'}
                        {token.status === 'Active' && ', session healthy.'}
                        {token.status === 'Failed' && ', multiple failures detected.'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>


        {/* Token Detail Modal */}
        <Dialog open={!!selectedToken} onOpenChange={() => setSelectedToken(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>🔐 Token Details</DialogTitle>
            </DialogHeader>
            {selectedToken && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="font-mono">{selectedToken.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge className={getStatusColor(selectedToken.status)}>
                      {selectedToken.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="font-mono">{selectedToken.ipAddress}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p>{selectedToken.location}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Issued At</label>
                    <p>{selectedToken.issuedAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expires</label>
                    <p>{selectedToken.expiry}</p>
                  </div>
                  {selectedToken.riskScore && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Risk Score</label>
                      <Badge className={getRiskScoreColor(selectedToken.riskScore)}>
                        {selectedToken.riskScore}%
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User Agent</label>
                  <p className="text-sm bg-muted p-2 rounded">{selectedToken.userAgent}</p>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => handleRevokeToken(selectedToken.id)}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Revoke Token
                  </Button>
                  <Button variant="outline">
                    <LogOut className="w-4 h-4 mr-2" />
                    Force Expire
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Audit Trail
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Enhanced Auto-Fix Modal */}
        <Dialog open={showAutoFixModal} onOpenChange={setShowAutoFixModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>🛠️ JWT Auto-Fix Confirmation</DialogTitle>
            </DialogHeader>
            
            {!isApplyingFixes ? (
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-medium mb-2">
                    This will analyze your JWT token refresh configuration and apply the following fixes:
                  </p>
                  
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-red-600" />
                      Update token invalidation on logout
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-600" />
                      Fix refresh token expiration policies
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-600" />
                      Validate token blacklist implementation
                    </li>
                  </ul>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleAutoFix}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={isApplyingFixes}
                  >
                    Apply Fixes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAutoFixModal(false)}
                    disabled={isApplyingFixes}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-red-600" />
                  <p className="font-medium text-red-800">Applying Fixes...</p>
                  <p className="text-sm text-red-600">Please wait while we patch JWT configurations</p>
                </div>
                
                <Progress value={autoFixProgress} className="w-full" />
                
                <div className="space-y-2">
                  {autoFixSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : step.failed ? (
                        <X className="w-4 h-4 text-red-600" />
                      ) : (
                        <div className="w-4 h-4 border border-muted-foreground rounded-full" />
                      )}
                      <span className={
                        step.completed ? 'text-green-600' : 
                        step.failed ? 'text-red-600' : 
                        'text-muted-foreground'
                      }>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
                
                {autoFixSteps.some(step => step.failed) && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      onClick={handleAutoFix}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Retry Failed Steps
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAutoFixModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default JWTTokenLifecycle;