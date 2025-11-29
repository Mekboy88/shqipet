import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Shield, 
  Brain, 
  Activity,
  MapPin,
  Monitor,
  Clock,
  Flag,
  CheckCircle,
  X,
  Filter,
  Search,
  RefreshCw,
  Settings,
  BarChart3,
  Smartphone,
  Globe
} from 'lucide-react';

interface RiskyLogin {
  id: string;
  userId: string;
  username: string;
  score: number;
  timestamp: string;
  ipAddress: string;
  location: string;
  device: string;
  actionTaken: 'auto-flagged' | 'flagged' | 'cleared' | 'safe';
  riskFactors: string[];
}

interface BehavioralStats {
  totalScans: number;
  averageScore: number;
  highRiskLogins: number;
  flaggedUsers: number;
  activeThreshold: number;
}

const BehavioralAnomalyScanning: React.FC = () => {
  const { toast } = useToast();
  
  // State management
  const [stats, setStats] = useState<BehavioralStats>({
    totalScans: 1247,
    averageScore: 23,
    highRiskLogins: 47,
    flaggedUsers: 12,
    activeThreshold: 75
  });

  const [isTraceModalOpen, setIsTraceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [threshold, setThreshold] = useState([75]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState(new Date());
  const [autoScan, setAutoScan] = useState(true);
  const [flashingAlert, setFlashingAlert] = useState(false);
  
  // Trace modal state
  const [traceFilter, setTraceFilter] = useState('all');
  const [traceDateFilter, setTraceDateFilter] = useState('7d');
  const [traceSort, setTraceSort] = useState('score');
  const [selectedLogins, setSelectedLogins] = useState<string[]>([]);
  
  // Mock risky logins data
  const [riskyLogins] = useState<RiskyLogin[]>([
    {
      id: '1',
      userId: 'usr_001',
      username: 'john.doe',
      score: 91,
      timestamp: '2025-07-26 05:41:23 UTC',
      ipAddress: '212.33.105.20',
      location: '🇩🇪 Berlin, Germany',
      device: 'Chrome 116 / Windows',
      actionTaken: 'auto-flagged',
      riskFactors: ['IP Change', 'Geo Location Shift', 'Unusual Time']
    },
    {
      id: '2',
      userId: 'usr_002',
      username: 'alice.smith',
      score: 88,
      timestamp: '2025-07-26 04:15:12 UTC',
      ipAddress: '192.10.44.88',
      location: '🇫🇷 Paris, France',
      device: 'Firefox 118 / MacOS',
      actionTaken: 'flagged',
      riskFactors: ['Device Mismatch', 'Multiple IPs']
    },
    {
      id: '3',
      userId: 'usr_003',
      username: 'bob.wilson',
      score: 82,
      timestamp: '2025-07-26 03:22:45 UTC',
      ipAddress: '45.123.67.89',
      location: '🇯🇵 Tokyo, Japan',
      device: 'Safari 16 / iOS',
      actionTaken: 'auto-flagged',
      riskFactors: ['Rapid Login/Logout', 'Social Engineering Pattern']
    },
    {
      id: '4',
      userId: 'usr_004',
      username: 'emma.johnson',
      score: 76,
      timestamp: '2025-07-26 02:08:15 UTC',
      ipAddress: '98.76.54.32',
      location: '🇺🇸 New York, USA',
      device: 'Chrome 115 / Android',
      actionTaken: 'flagged',
      riskFactors: ['Session Duration Anomaly']
    }
  ]);

  // Real-time scanning simulation
  useEffect(() => {
    if (autoScan) {
      const interval = setInterval(() => {
        performScan();
      }, 75000); // 75 seconds

      return () => clearInterval(interval);
    }
  }, [autoScan]);

  const performScan = async () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate detection of high-risk login
    const newScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    
    if (newScore > threshold[0]) {
      setFlashingAlert(true);
      toast({
        title: "🚨 High Risk Login Detected",
        description: `Risk Score: ${newScore}/100 - Auto-flagged for review`,
        variant: "destructive"
      });
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalScans: prev.totalScans + 1,
        highRiskLogins: prev.highRiskLogins + 1,
        averageScore: Math.round((prev.averageScore + newScore) / 2)
      }));
      
      setTimeout(() => setFlashingAlert(false), 3000);
    }
    
    setIsScanning(false);
    setLastScan(new Date());
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-red-600 bg-red-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 85) return '🔥';
    if (score >= 70) return '⚠️';
    if (score >= 50) return '⚡';
    return '✅';
  };

  const markAsSafe = (loginId: string) => {
    toast({
      title: "✅ Marked as Safe",
      description: "Login has been cleared from risk monitoring",
    });
  };

  const autoFlagUser = (userId: string) => {
    toast({
      title: "🚩 User Auto-Flagged",
      description: "User account has been flagged for security review",
      variant: "destructive"
    });
  };

  const exportTrace = (format: 'csv' | 'json') => {
    const data = riskyLogins.map(login => ({
      userId: login.userId,
      username: login.username,
      score: login.score,
      timestamp: login.timestamp,
      ipAddress: login.ipAddress,
      location: login.location,
      device: login.device,
      actionTaken: login.actionTaken,
      riskFactors: login.riskFactors.join('; ')
    }));

    if (format === 'csv') {
      const headers = ['User ID', 'Username', 'Score', 'Timestamp', 'IP Address', 'Location', 'Device', 'Action Taken', 'Risk Factors'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `behavioral_trace_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `behavioral_trace_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
    }

    toast({
      description: `✅ Export Ready - Behavioral trace exported as ${format.toUpperCase()}`
    });
  };

  const updateThreshold = (newThreshold: number[]) => {
    setThreshold(newThreshold);
    setStats(prev => ({ ...prev, activeThreshold: newThreshold[0] }));
    toast({
      description: `Alert threshold updated to ${newThreshold[0]}+`
    });
  };

  return (
    <TooltipProvider>
      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              🧠 Behavioral Anomaly Scanning
              <Badge variant="secondary" className="text-xs">Ultra Security Compliance</Badge>
            </h4>
            <p className="text-sm text-purple-700">
              AI-powered pattern scoring with threshold-based alerts and traceable audit records
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoScan(!autoScan)}
                  className={autoScan ? 'bg-green-50 border-green-200 text-green-700' : ''}
                >
                  <Activity className={`w-4 h-4 ${autoScan ? 'animate-pulse' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{autoScan ? 'Disable auto-scan (75s)' : 'Enable auto-scan (75s)'}</p>
              </TooltipContent>
            </Tooltip>

            <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Behavioral Scanning Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Alert Threshold: {threshold[0]}+
                    </label>
                    <Slider
                      value={threshold}
                      onValueChange={updateThreshold}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">
                      Recommended: 75+ for balanced security. Lower values increase false positives.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              size="sm"
              onClick={performScan}
              disabled={isScanning}
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Now'}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Scans</p>
                <p className="text-lg font-bold text-purple-800">{stats.totalScans.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Score</p>
                <p className="text-lg font-bold text-green-600">{stats.averageScore}/100</p>
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>

          <div className={`bg-white rounded-lg p-3 border border-purple-100 ${flashingAlert ? 'animate-pulse bg-red-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">High Risk</p>
                <p className="text-lg font-bold text-red-600">{stats.highRiskLogins}</p>
              </div>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Flagged Users</p>
                <p className="text-lg font-bold text-orange-600">{stats.flaggedUsers}</p>
              </div>
              <Flag className="w-4 h-4 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Threshold</p>
                <p className="text-lg font-bold text-purple-600">{stats.activeThreshold}+</p>
              </div>
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pattern Score Engine */}
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              🧪 Pattern Score Engine
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </h5>
            <p className="text-sm text-gray-600 mb-4">
              Calculates risk score (0–100) based on IP changes, geolocation shifts, device mismatches, and ML patterns.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Score:</span>
                <span className="font-mono font-bold">87/100 🔴</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <p className="text-xs text-red-600 font-medium">High Risk</p>
            </div>
          </div>

          {/* Alert Threshold */}
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              ⚠️ Alert Threshold
              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                {stats.activeThreshold}+
              </Badge>
            </h5>
            <p className="text-sm text-gray-600 mb-4">
              Triggers alerts when login scores exceed configured threshold.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alert Trigger:</span>
                <span className="font-mono font-bold text-green-600">Score &gt; {stats.activeThreshold} ✅</span>
              </div>
              <div className="text-xs text-gray-500">
                Last alert: {lastScan.toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Audit Trace */}
          <div className="bg-white rounded-lg p-4 border">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              🧾 Audit Trace
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {riskyLogins.length} Records
              </Badge>
            </h5>
            <p className="text-sm text-gray-600 mb-4">
              Shows past risky logins with detailed audit trail and admin actions.
            </p>
            
            <Dialog open={isTraceModalOpen} onOpenChange={setIsTraceModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  🔍 View Trace
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    🔍 Risky Logins – Behavioral Audit Trace
                  </DialogTitle>
                </DialogHeader>
                
                {/* Trace Controls */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select 
                        value={traceFilter} 
                        onChange={(e) => setTraceFilter(e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="all">All Actions</option>
                        <option value="auto-flagged">Auto-flagged</option>
                        <option value="flagged">Manually Flagged</option>
                        <option value="cleared">Cleared</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <select 
                        value={traceDateFilter} 
                        onChange={(e) => setTraceDateFilter(e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => exportTrace('csv')}>
                      <Download className="w-4 h-4 mr-1" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportTrace('json')}>
                      <Download className="w-4 h-4 mr-1" />
                      JSON
                    </Button>
                  </div>
                </div>

                {/* Trace Table */}
                <div className="overflow-auto max-h-96">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-purple-100">
                      <tr>
                        <th className="text-left p-3 font-medium text-purple-800">#</th>
                        <th className="text-left p-3 font-medium text-purple-800">User</th>
                        <th className="text-left p-3 font-medium text-purple-800">Score</th>
                        <th className="text-left p-3 font-medium text-purple-800">Time</th>
                        <th className="text-left p-3 font-medium text-purple-800">IP Address</th>
                        <th className="text-left p-3 font-medium text-purple-800">Location</th>
                        <th className="text-left p-3 font-medium text-purple-800">Device</th>
                        <th className="text-left p-3 font-medium text-purple-800">Action</th>
                        <th className="text-left p-3 font-medium text-purple-800">Controls</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskyLogins.map((login, index) => (
                        <tr key={login.id} className="border-b hover:bg-gray-50 group">
                          <td className="p-3 font-mono text-gray-600">{index + 1}</td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{login.username}</div>
                              <div className="text-xs text-gray-500">{login.userId}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(login.score)}`}>
                              {getScoreIcon(login.score)} {login.score}
                            </div>
                          </td>
                          <td className="p-3 text-xs text-gray-600 font-mono">{login.timestamp}</td>
                          <td className="p-3 font-mono text-xs">{login.ipAddress}</td>
                          <td className="p-3 text-xs">{login.location}</td>
                          <td className="p-3 text-xs">{login.device}</td>
                          <td className="p-3">
                            <Badge 
                              variant={login.actionTaken === 'auto-flagged' ? 'destructive' : 
                                     login.actionTaken === 'flagged' ? 'secondary' : 'default'}
                              className="text-xs"
                            >
                              {login.actionTaken}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => markAsSafe(login.id)}
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Mark as Safe</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => autoFlagUser(login.userId)}
                                  >
                                    <Flag className="w-3 h-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Auto-flag User</TooltipContent>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Risk Factors Legend */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-medium text-gray-800 mb-2">Common Risk Factors:</h6>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-red-500" />
                      IP Change
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-500" />
                      Geo Location Shift
                    </div>
                    <div className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-blue-500" />
                      Device Mismatch
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-purple-500" />
                      Unusual Time
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Status Footer */}
        <div className="mt-6 p-3 bg-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1">
                <Activity className={`w-4 h-4 ${isScanning ? 'animate-pulse text-blue-600' : 'text-green-600'}`} />
                Status: {isScanning ? 'Scanning...' : 'Active'}
              </span>
              <span className="text-gray-600">
                Last scan: {lastScan.toLocaleTimeString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Next auto-scan: {autoScan ? '~60s' : 'Disabled'}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BehavioralAnomalyScanning;