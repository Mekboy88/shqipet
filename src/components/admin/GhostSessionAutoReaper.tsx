import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Play, 
  RefreshCw, 
  Eye, 
  History, 
  Settings, 
  Skull,
  Clock,
  Monitor,
  Smartphone,
  Laptop,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Timer,
  Download,
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface GhostSession {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  device: string;
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'unknown';
  lastSeen: string;
  ageInDays: number;
  ipAddress: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high';
  sessionType: string;
  jwtExpired: boolean;
}

interface ReapHistory {
  id: string;
  timestamp: string;
  cleanedCount: number;
  triggeredBy: 'system' | 'admin';
  triggerUser?: string;
  method: 'auto' | 'manual';
  status: 'success' | 'failed';
  notes?: string;
  duration: number;
}

interface GhostSessionStats {
  totalGhosts: number;
  longestLivedDays: number;
  affectedDevices: number;
  averageAge: number;
  riskBreakdown: {
    low: number;
    medium: number;
    high: number;
  };
}

export function GhostSessionAutoReaper() {
  const [stats, setStats] = useState<GhostSessionStats>({
    totalGhosts: 127,
    longestLivedDays: 14,
    affectedDevices: 63,
    averageAge: 2.3,
    riskBreakdown: { low: 45, medium: 52, high: 30 }
  });

  const [ghostSessions, setGhostSessions] = useState<GhostSession[]>([
    {
      id: '1',
      userId: 'user1',
      userName: '@john',
      device: 'iPhone 14 Pro',
      deviceType: 'mobile',
      lastSeen: '2025-07-12T10:30:00Z',
      ageInDays: 14,
      ipAddress: '87.4.2.123',
      location: '🇬🇧 London, UK',
      riskLevel: 'high',
      sessionType: 'JWT',
      jwtExpired: true
    },
    {
      id: '2',
      userId: 'user2',
      userName: '@alice',
      device: 'Chrome Desktop',
      deviceType: 'desktop',
      lastSeen: '2025-07-23T15:45:00Z',
      ageInDays: 3,
      ipAddress: '192.168.1.45',
      location: '🇺🇸 New York, US',
      riskLevel: 'medium',
      sessionType: 'Session',
      jwtExpired: false
    },
    {
      id: '3',
      userId: 'user3',
      userName: '@mike',
      device: 'Samsung Galaxy',
      deviceType: 'mobile',
      lastSeen: '2025-07-25T09:15:00Z',
      ageInDays: 1,
      ipAddress: '203.45.67.89',
      location: '🇩🇪 Berlin, DE',
      riskLevel: 'low',
      sessionType: 'OAuth',
      jwtExpired: false
    }
  ]);

  const [reapHistory, setReapHistory] = useState<ReapHistory[]>([
    {
      id: '1',
      timestamp: '2025-07-26T05:12:00Z',
      cleanedCount: 87,
      triggeredBy: 'system',
      method: 'auto',
      status: 'success',
      notes: 'Scheduled cleanup',
      duration: 1.2
    },
    {
      id: '2',
      timestamp: '2025-07-24T01:03:00Z',
      cleanedCount: 3,
      triggeredBy: 'admin',
      triggerUser: 'admin@shqipet.com',
      method: 'manual',
      status: 'success',
      notes: 'User complaint investigation',
      duration: 0.5
    }
  ]);

  const [isReaping, setIsReaping] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [lastCleanup, setLastCleanup] = useState('6 hours ago');
  const [nextReap, setNextReap] = useState('5h 23m');
  const [autoReapEnabled, setAutoReapEnabled] = useState(true);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [maxSessionAge, setMaxSessionAge] = useState(7);
  const [reapFrequency, setReapFrequency] = useState(12);
  const [killSessionDialog, setKillSessionDialog] = useState<{open: boolean, session: GhostSession | null}>({
    open: false,
    session: null
  });

  // Live polling simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small changes in ghost count
      setStats(prev => ({
        ...prev,
        totalGhosts: prev.totalGhosts + Math.floor(Math.random() * 3) - 1
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'tablet': return <Laptop className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getRiskBadge = (riskLevel: string, ageInDays: number) => {
    const pulseClass = ageInDays > 7 ? "animate-pulse" : "";
    switch (riskLevel) {
      case 'low':
        return (
          <Badge className={`bg-success text-success-foreground transition-all duration-300 ${pulseClass}`}>
            <CheckCircle className="h-3 w-3 mr-1" />
            Low Risk
          </Badge>
        );
      case 'medium':
        return (
          <Badge className={`bg-warning text-warning-foreground transition-all duration-300 ${pulseClass}`}>
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium Risk
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="destructive" className={`transition-all duration-300 animate-pulse`}>
            <XCircle className="h-3 w-3 mr-1" />
            High Risk
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="transition-all duration-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleRunReap = async () => {
    setIsReaping(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const cleanedCount = stats.totalGhosts;
      setStats(prev => ({ ...prev, totalGhosts: 0 }));
      setGhostSessions([]);
      
      // Add to history
      const newHistoryEntry: ReapHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        cleanedCount,
        triggeredBy: 'admin',
        triggerUser: 'current@admin.com',
        method: 'manual',
        status: 'success',
        notes: 'Manual cleanup via admin panel',
        duration: 3.0
      };
      
      setReapHistory(prev => [newHistoryEntry, ...prev]);
      setLastCleanup('Just now');
      
      toast.success(`✅ ${cleanedCount} ghost sessions removed successfully!`);
    } catch (error) {
      toast.error('❌ Cleanup failed. Try again or check logs.');
    } finally {
      setIsReaping(false);
    }
  };

  const handleKillSession = async (sessionId: string, userName: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGhostSessions(prev => prev.filter(s => s.id !== sessionId));
      setStats(prev => ({ ...prev, totalGhosts: prev.totalGhosts - 1 }));
      
      toast.success(`Session for ${userName} terminated`);
    } catch (error) {
      toast.error('Failed to terminate session');
    }
  };

  const handleRefreshStats = async () => {
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate updated stats
      setStats(prev => ({
        ...prev,
        totalGhosts: prev.totalGhosts + Math.floor(Math.random() * 10) - 5,
        averageAge: Number((Math.random() * 5 + 1).toFixed(1))
      }));
      
      toast.success('Stats refreshed');
    } catch (error) {
      toast.error('Failed to refresh stats');
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? ghostSessions.map(s => Object.values(s).join(',')).join('\n')
      : JSON.stringify(ghostSessions, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ghost-sessions.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Ghost sessions exported as ${format.toUpperCase()}`);
  };

  const filteredSessions = selectedRiskFilter === 'all' 
    ? ghostSessions 
    : ghostSessions.filter(s => s.riskLevel === selectedRiskFilter);

  const handleSaveConfiguration = async () => {
    setIsSavingConfig(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Configuration saved successfully', {
        description: `Auto-reap set to ${reapFrequency}h intervals, max age ${maxSessionAge} days`
      });
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSavingConfig(false);
    }
  };

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ghost Sessions</p>
                <p className="text-2xl font-bold text-destructive">{stats.totalGhosts}</p>
              </div>
              <Skull className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Longest-Lived</p>
                <p className="text-2xl font-bold">{stats.longestLivedDays}d</p>
              </div>
              <Timer className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Affected Devices</p>
                <p className="text-2xl font-bold">{stats.affectedDevices}</p>
              </div>
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Age</p>
                <p className="text-2xl font-bold">{stats.averageAge}h</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Breakdown */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Risk Distribution</h3>
            <Button variant="ghost" size="sm" onClick={handleRefreshStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{stats.riskBreakdown.low}</p>
              <p className="text-sm text-muted-foreground">Low Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{stats.riskBreakdown.medium}</p>
              <p className="text-sm text-muted-foreground">Medium Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{stats.riskBreakdown.high}</p>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cleanup Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Reap Enabled</p>
              <p className="text-sm text-muted-foreground">Next cleanup in: {nextReap}</p>
            </div>
            <Switch checked={autoReapEnabled} onCheckedChange={setAutoReapEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Last Cleanup</p>
              <p className="text-sm text-muted-foreground">{lastCleanup}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleRunReap} 
                  disabled={isReaping}
                  className="min-w-32 bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {isReaping ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      🧹 Run Now Cleanup
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Immediately terminate all ghost sessions
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Ghost Table
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Ghost Sessions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <Label>Filter by Risk:</Label>
                      <Select value={selectedRiskFilter} onValueChange={setSelectedRiskFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Risks</SelectItem>
                          <SelectItem value="low">🟢 Low Risk</SelectItem>
                          <SelectItem value="medium">🟡 Medium Risk</SelectItem>
                          <SelectItem value="high">🔴 High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => exportData('csv')}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            📄 CSV
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export filtered data as CSV</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => exportData('json')}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            📋 JSON
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export filtered data as JSON</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Device</TableHead>
                        <TableHead>Last Seen</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.userName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(session.deviceType)}
                              {session.device}
                            </div>
                          </TableCell>
                          <TableCell>{session.ageInDays}d ago</TableCell>
                          <TableCell>{session.ageInDays}d</TableCell>
                          <TableCell>{session.location}</TableCell>
                          <TableCell>{getRiskBadge(session.riskLevel, session.ageInDays)}</TableCell>
                           <TableCell>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => setKillSessionDialog({open: true, session})}
                                   className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 transform hover:scale-110"
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>💀 Kill session permanently</TooltipContent>
                             </Tooltip>
                           </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <History className="h-4 w-4 mr-2" />
                  Reap History
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Cleanup History</DialogTitle>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Cleaned</TableHead>
                      <TableHead>Triggered By</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reapHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{entry.cleanedCount} sessions</TableCell>
                        <TableCell className="capitalize">{entry.triggeredBy}</TableCell>
                        <TableCell className="capitalize">{entry.method}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(entry.status)}
                            <span className="capitalize">{entry.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-32 truncate" title={entry.notes}>
                          {entry.notes || '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reaper Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxAge">Max Session Age (days)</Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={maxSessionAge}
                      onChange={(e) => setMaxSessionAge(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequency">Auto-Reap Frequency (hours)</Label>
                    <Input
                      id="frequency"
                      type="number"
                      value={reapFrequency}
                      onChange={(e) => setReapFrequency(Number(e.target.value))}
                    />
                  </div>
                   <Button 
                     onClick={handleSaveConfiguration}
                     disabled={isSavingConfig}
                     className="w-full bg-gray-600 hover:bg-gray-700 text-white transition-all duration-300"
                   >
                     {isSavingConfig ? (
                       <>
                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                         🛠️ Saving Configuration...
                       </>
                     ) : (
                       <>
                         <Settings className="h-4 w-4 mr-2" />
                         🛠️ Save Configuration
                       </>
                     )}
                   </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      {stats.riskBreakdown.high > 20 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High number of high-risk ghost sessions detected ({stats.riskBreakdown.high}). 
            Consider running cleanup immediately or reviewing security policies.
          </AlertDescription>
         </Alert>
       )}

       {/* Kill Session Confirmation Dialog */}
       <Dialog open={killSessionDialog.open} onOpenChange={(open) => setKillSessionDialog({open, session: null})}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle className="flex items-center gap-2 text-destructive">
               <Trash2 className="h-5 w-5" />
               💀 Terminate Ghost Session
             </DialogTitle>
           </DialogHeader>
           <div className="space-y-4">
             <div className="bg-red-50 border-l-4 border-red-500 p-4 dark:bg-red-950 dark:border-red-800">
               <p className="text-sm text-red-800 dark:text-red-300">
                 <strong>⚠️ Warning:</strong> This action will immediately terminate the session and log out the user.
               </p>
             </div>
             {killSessionDialog.session && (
               <div className="space-y-2">
                 <p><strong>User:</strong> {killSessionDialog.session.userName}</p>
                 <p><strong>Device:</strong> {killSessionDialog.session.device}</p>
                 <p><strong>Location:</strong> {killSessionDialog.session.location}</p>
                 <p><strong>Session Age:</strong> {killSessionDialog.session.ageInDays} days</p>
                 <p><strong>Risk Level:</strong> {killSessionDialog.session.riskLevel.toUpperCase()}</p>
               </div>
             )}
           </div>
           <DialogFooter>
             <Button 
               variant="outline" 
               onClick={() => setKillSessionDialog({open: false, session: null})}
             >
               Cancel
             </Button>
             <Button 
               variant="destructive" 
               onClick={() => {
                 if (killSessionDialog.session) {
                   handleKillSession(killSessionDialog.session.id, killSessionDialog.session.userName);
                   setKillSessionDialog({open: false, session: null});
                 }
               }}
               className="bg-red-600 hover:bg-red-700"
             >
               <Trash2 className="h-4 w-4 mr-2" />
               💀 Kill Session
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
     </TooltipProvider>
   );
 }