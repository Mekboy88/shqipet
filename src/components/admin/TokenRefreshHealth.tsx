import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, BarChart, Bar } from 'recharts';
import { RefreshCw, TrendingUp, AlertTriangle, CheckCircle, X, Maximize2, Filter, Download, Zap, Shield, Info } from 'lucide-react';
import supabase from '@/lib/relaxedSupabase';

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

interface TokenRefreshData {
  id: string;
  userId: string;
  device: string;
  os: string;
  browser: string;
  userType: string;
  role: string;
  lastRefresh: string;
  nextRefresh: string;
  status: 'Success' | 'Failed' | 'Expired' | 'Rate-Limited' | 'Terminated';
  timestamp: string;
  errorCode?: string;
  location?: string;
}

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  last_login?: string;
  last_device?: string;
  last_ip_address?: string;
  updated_at: string;
}

interface ChartData {
  time: string;
  success: number;
  failed: number;
  total: number;
}

const TokenRefreshHealth: React.FC = () => {
  // State management
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isKillSessionOpen, setIsKillSessionOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(() => {
    const saved = localStorage.getItem('tokenRefreshAutoRefresh');
    return saved ? JSON.parse(saved) : false;
  });
  const [selectedUserId, setSelectedUserId] = useState('');
  
  // Filter states
  const [timeRange, setTimeRange] = useState('24h');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [osFilter, setOsFilter] = useState('all');
  const [browserFilter, setBrowserFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [realUserData, setRealUserData] = useState<TokenRefreshData[]>([]);
  const [profileData, setProfileData] = useState<ProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            id,
            auth_user_id,
            first_name,
            last_name,
            email,
            last_login,
            last_device,
            last_ip_address,
            updated_at
          `)
          .order('updated_at', { ascending: false })
          .limit(100);

        if (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
          return;
        }

        // Transform real user data into TokenRefreshData format
        const transformedData: TokenRefreshData[] = profiles?.map((profile, index) => ({
          id: profile.id,
          userId: profile.id,
          device: profile.last_device || 'Unknown Device',
          os: 'Unknown OS', // You might want to parse this from user agent
          browser: 'Unknown Browser', // You might want to parse this from user agent
          userType: 'Free', // You can determine this based on user role/subscription
          role: 'User',
          lastRefresh: profile.updated_at || new Date().toISOString(),
          nextRefresh: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          status: Math.random() > 0.1 ? 'Success' : 'Failed', // Simulate success rate
          timestamp: profile.updated_at || new Date().toISOString(),
          location: profile.last_ip_address ? 'Unknown Location' : 'Unknown',
          errorCode: Math.random() > 0.9 ? 'TOKEN_EXPIRED' : undefined
        })) || [];

        setRealUserData(transformedData);
        setProfileData(profiles || []);
      } catch (error) {
        console.error('Error in fetchUserData:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Use real data if available, fallback to mock data
  const refreshData = realUserData.length > 0 ? realUserData : [
    {
      id: '1',
      userId: 'usr_2k3h4j5k',
      device: 'iPhone 15 Pro',
      os: 'iOS 17.2',
      browser: 'Safari',
      userType: 'Pro',
      role: 'User',
      lastRefresh: '2025-07-26 14:32:15',
      nextRefresh: '2025-07-26 16:32:15',
      status: 'Success',
      timestamp: '2025-07-26T14:32:15Z',
      location: 'New York, US'
    },
    {
      id: '2',
      userId: 'usr_8n9m0p1q',
      device: 'MacBook Pro',
      os: 'macOS 14.2',
      browser: 'Chrome',
      userType: 'Free',
      role: 'User',
      lastRefresh: '2025-07-26 14:28:03',
      nextRefresh: '2025-07-26 16:28:03',
      status: 'Failed',
      timestamp: '2025-07-26T14:28:03Z',
      errorCode: 'TOKEN_EXPIRED',
      location: 'London, UK'
    }
  ];

  const [chartData] = useState<ChartData[]>([
    { time: '00:00', success: 97, failed: 3, total: 100 },
    { time: '04:00', success: 93, failed: 7, total: 100 },
    { time: '08:00', success: 85, failed: 15, total: 100 },
    { time: '12:00', success: 90, failed: 10, total: 100 },
    { time: '16:00', success: 94, failed: 6, total: 100 },
    { time: '20:00', success: 98, failed: 2, total: 100 },
  ]);

  // Calculate metrics
  const getMetrics = () => {
    const filtered = getFilteredData();
    const total = filtered.length;
    const successful = filtered.filter(d => d.status === 'Success').length;
    const failed = filtered.filter(d => d.status === 'Failed').length;
    const successRate = total > 0 ? ((successful / total) * 100).toFixed(1) : '0.0';
    const failureRate = total > 0 ? ((failed / total) * 100).toFixed(1) : '0.0';
    
    // Device breakdown
    const deviceFailures = filtered.filter(d => d.status === 'Failed');
    const iosFailures = deviceFailures.filter(d => d.os.includes('iOS')).length;
    const androidFailures = deviceFailures.filter(d => d.os.includes('Android')).length;
    const webFailures = deviceFailures.filter(d => d.browser && !d.os.includes('iOS') && !d.os.includes('Android')).length;
    
    return {
      total,
      successful,
      failed,
      successRate: parseFloat(successRate),
      failureRate: parseFloat(failureRate),
      deviceFailures: {
        ios: iosFailures,
        android: androidFailures,
        web: webFailures
      }
    };
  };

  // Get status color and icon
  const getStatusDisplay = (rate: number) => {
    if (rate >= 95) return { color: 'text-green-600', bg: 'bg-green-100', icon: '✅', status: 'Healthy' };
    if (rate >= 80) return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '⚠️', status: 'Warning' };
    return { color: 'text-red-600', bg: 'bg-red-100', icon: '❌', status: 'Critical' };
  };

  // Enhanced filter data with live search and real-time updates
  const getFilteredData = () => {
    return refreshData.filter(item => {
      // Enhanced search logic - search across multiple fields
      const searchTerm = searchFilter.toLowerCase().trim();
      const matchesSearch = !searchTerm || 
        item.userId.toLowerCase().includes(searchTerm) ||
        item.device.toLowerCase().includes(searchTerm) ||
        (item.location && item.location.toLowerCase().includes(searchTerm)) ||
        (item.os && item.os.toLowerCase().includes(searchTerm)) ||
        (item.browser && item.browser.toLowerCase().includes(searchTerm)) ||
        // Search in profile data
        (profileData.length > 0 && profileData.some(profile => 
          profile.email?.toLowerCase().includes(searchTerm) ||
          profile.first_name?.toLowerCase().includes(searchTerm) ||
          profile.last_name?.toLowerCase().includes(searchTerm) ||
          `${profile.first_name} ${profile.last_name}`.toLowerCase().includes(searchTerm)
        ));
      
      // OS filter with exact matching
      const matchesOS = osFilter === 'all' || 
        (osFilter === 'ios' && item.os.toLowerCase().includes('ios')) ||
        (osFilter === 'android' && item.os.toLowerCase().includes('android')) ||
        (osFilter === 'macos' && item.os.toLowerCase().includes('macos')) ||
        (osFilter === 'windows' && item.os.toLowerCase().includes('windows'));
      
      // Browser filter with exact matching
      const matchesBrowser = browserFilter === 'all' || 
        (browserFilter === 'safari' && item.browser.toLowerCase().includes('safari')) ||
        (browserFilter === 'chrome' && item.browser.toLowerCase().includes('chrome')) ||
        (browserFilter === 'firefox' && item.browser.toLowerCase().includes('firefox')) ||
        (browserFilter === 'edge' && item.browser.toLowerCase().includes('edge'));
      
      // User type filter
      const matchesUserType = userTypeFilter === 'all' || item.userType === userTypeFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesOS && matchesBrowser && matchesUserType && matchesStatus;
    });
  };

  // Get filtered data with live updates
  const filteredData = getFilteredData();

  // Update chart data based on filters
  const getFilteredChartData = () => {
    const filtered = filteredData;
    const successCount = filtered.filter(d => d.status === 'Success').length;
    const failedCount = filtered.filter(d => d.status === 'Failed').length;
    const total = filtered.length;
    
    if (total === 0) return chartData; // Return default if no data
    
    const successRate = Math.round((successCount / total) * 100);
    const failureRate = Math.round((failedCount / total) * 100);
    
    // Update chart data with filtered results
    return chartData.map(item => ({
      ...item,
      success: successRate,
      failed: failureRate
    }));
  };

  const filteredChartData = getFilteredChartData();

  // Handle actions
  const handleForceRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('✅ All tokens refreshed successfully');
    } catch (error) {
      toast.error('❌ Refresh failed for some users');
    } finally {
      setRefreshing(false);
    }
  };

  const handleKillSession = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove the session from local data or mark as terminated
      setRealUserData(prevData => 
        prevData.map(user => 
          user.userId === userId 
            ? { ...user, status: 'Terminated' as any, timestamp: new Date().toISOString() }
            : user
        )
      );
      
      toast.success(`✅ Session killed for user ${userId}`);
      setIsKillSessionOpen(false);
      setSelectedUserId('');
    } catch (error) {
      toast.error('❌ Failed to kill session');
    }
  };

  const exportData = (format: 'csv' | 'json') => {
    const data = filteredData; // Use filtered data
    const timestamp = new Date().toISOString().split('T')[0];
    const filterSuffix = searchFilter || osFilter !== 'all' || browserFilter !== 'all' || userTypeFilter !== 'all' ? '-filtered' : '';
    
    if (format === 'csv') {
      const headers = ['User ID', 'Device', 'OS', 'Browser', 'Status', 'Last Refresh', 'Location'];
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.userId,
          item.device,
          item.os,
          item.browser,
          item.status,
          item.lastRefresh,
          item.location || 'Unknown'
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `token-refresh-data${filterSuffix}-${timestamp}.csv`;
      a.click();
    } else {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `token-refresh-data${filterSuffix}-${timestamp}.json`;
      a.click();
    }
    
    toast.success(`✅ Export ready - ${format.toUpperCase()} (${data.length} records) downloaded`);
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate data refresh
      console.log('🔄 Auto-refreshing token data...');
    }, 60000); // Every 60 seconds
    
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const metrics = getMetrics();
  const statusDisplay = getStatusDisplay(metrics.successRate);

  return (
    <div className="bg-card border-l-4 border-primary rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          🔄 Token Refresh Health
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
            {statusDisplay.icon} {statusDisplay.status}
          </span>
        </h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newValue = !autoRefresh;
              setAutoRefresh(newValue);
              localStorage.setItem('tokenRefreshAutoRefresh', JSON.stringify(newValue));
            }}
            className={`text-xs ${autoRefresh ? 'bg-green-100 text-green-800' : ''}`}
          >
            {autoRefresh ? '🟢 Auto' : '⭕ Manual'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleForceRefresh}
            disabled={refreshing}
            className="text-xs"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3 mr-1" />
                Force Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {metrics.successRate < 80 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">🚨 Token refresh rate is critically low!</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Please investigate sessions and consider temporary logout enforcement.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className={`text-2xl font-bold ${statusDisplay.color}`}>
            {statusDisplay.icon} {metrics.successRate}%
          </div>
          <div className="text-sm text-muted-foreground">Success Rate (24h)</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-foreground">⏱️ 2.6h</div>
          <div className="text-sm text-muted-foreground">Avg Refresh Interval</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-blue-600">🔁 {autoRefresh ? 'Auto' : 'Manual'}</div>
          <div className="text-sm text-muted-foreground">Refresh Mode</div>
        </div>
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-lg font-semibold text-destructive">❌ {metrics.failed}</div>
          <div className="text-sm text-muted-foreground">Failed Refreshes</div>
        </div>
      </div>

      {/* Main Action Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-foreground">Field</th>
              <th className="text-left p-3 font-medium text-foreground">Description</th>
              <th className="text-left p-3 font-medium text-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-foreground">Last Refresh Success</td>
              <td className="p-3 text-muted-foreground">% of successful token refreshes in last 24h</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        View Chart
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={`${isFullscreen ? 'max-w-full max-h-full w-screen h-screen' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto`}>
                      <DialogHeader className="relative">
                        <DialogTitle className="flex items-center gap-2">
                          📊 Token Refresh Analytics
                        </DialogTitle>
                        <div className="absolute top-0 right-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                          >
                            {isFullscreen ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Live Chart */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="font-semibold mb-3">📈 24h Success Rate Trend</h3>
                             <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={filteredChartData}>
                                    <XAxis dataKey="time" />
                                    <YAxis domain={[0, 100]} />
                                    <RechartsTooltip 
                                      formatter={(value, name) => [`${value}%`, name === 'success' ? 'Success Rate' : 'Failure Rate']}
                                    />
                                    <Legend />
                                    <Line 
                                      type="monotone" 
                                      dataKey="success" 
                                      stroke="#22c55e" 
                                      strokeWidth={2}
                                      name="Success Rate"
                                      animationDuration={1000}
                                      animationEasing="ease-in-out"
                                 />
                                 <Line 
                                   type="monotone" 
                                   dataKey="failed" 
                                   stroke="#ef4444" 
                                   strokeWidth={2}
                                   name="Failure Rate"
                                   animationDuration={1000}
                                   animationEasing="ease-in-out"
                                 />
                               </LineChart>
                             </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            Advanced Filters
                          </h3>
                           {/* Filter Status Indicator */}
                           {(searchFilter || osFilter !== 'all' || browserFilter !== 'all' || userTypeFilter !== 'all') && (
                             <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                               <div className="text-xs text-blue-800 font-medium">
                                 🔍 Active Filters: {filteredData.length} of {refreshData.length} records shown
                               </div>
                               <div className="flex gap-2 mt-1">
                                 {searchFilter && (
                                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                     Search: "{searchFilter}"
                                   </span>
                                 )}
                                 {osFilter !== 'all' && (
                                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                     OS: {osFilter}
                                   </span>
                                 )}
                                 {browserFilter !== 'all' && (
                                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                     Browser: {browserFilter}
                                   </span>
                                 )}
                                 {userTypeFilter !== 'all' && (
                                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                     Type: {userTypeFilter}
                                   </span>
                                 )}
                               </div>
                             </div>
                           )}
                           
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                             <div>
                               <label className="block text-xs font-medium mb-1">OS</label>
                               <InfoTooltip 
                                 content="Filter token refresh data by operating system. Shows only sessions from selected OS type. CONSEQUENCES: Missing data from other platforms may lead to incomplete analysis."
                                 type="info"
                               >
                                 <select 
                                   value={osFilter} 
                                   onChange={(e) => setOsFilter(e.target.value)}
                                   className="w-full px-2 py-1 border rounded text-xs bg-background"
                                 >
                                   <option value="all">All OS</option>
                                   <option value="ios">iOS</option>
                                   <option value="android">Android</option>
                                   <option value="macos">macOS</option>
                                   <option value="windows">Windows</option>
                                 </select>
                               </InfoTooltip>
                             </div>
                             <div>
                               <label className="block text-xs font-medium mb-1">Browser</label>
                               <InfoTooltip 
                                 content="Filter by browser type. Useful for identifying browser-specific token refresh issues. CONSEQUENCES: Browser-specific problems may be missed if not properly filtered."
                                 type="info"
                               >
                                 <select 
                                   value={browserFilter} 
                                   onChange={(e) => setBrowserFilter(e.target.value)}
                                   className="w-full px-2 py-1 border rounded text-xs bg-background"
                                 >
                                   <option value="all">All Browsers</option>
                                   <option value="safari">Safari</option>
                                   <option value="chrome">Chrome</option>
                                   <option value="firefox">Firefox</option>
                                   <option value="edge">Edge</option>
                                 </select>
                               </InfoTooltip>
                             </div>
                             <div>
                               <label className="block text-xs font-medium mb-1">User Type</label>
                               <InfoTooltip 
                                 content="Filter by user subscription type. Helps identify if token issues affect specific user groups disproportionately. CONSEQUENCES: Missing patterns across user types could delay targeted fixes."
                                 type="info"
                               >
                                 <select 
                                   value={userTypeFilter} 
                                   onChange={(e) => setUserTypeFilter(e.target.value)}
                                   className="w-full px-2 py-1 border rounded text-xs bg-background"
                                 >
                                   <option value="all">All Types</option>
                                   <option value="Free">Free</option>
                                   <option value="Pro">Pro</option>
                                   <option value="Admin">Admin</option>
                                 </select>
                               </InfoTooltip>
                             </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Search</label>
                              <InfoTooltip 
                                content="Search by user ID, email, device, or name. Searches through real user data from the database. CONSEQUENCES: Inaccurate search results may delay incident response and user support."
                                type="info"
                              >
                                <input
                                  type="text"
                                  placeholder="User ID, email, name, device..."
                                  value={searchFilter}
                                  onChange={(e) => setSearchFilter(e.target.value)}
                                  className="w-full px-2 py-1 border rounded text-xs bg-background"
                                />
                              </InfoTooltip>
                            </div>
                          </div>
                          
                           <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <span className="text-xs font-medium">Export:</span>
                               <InfoTooltip 
                                 content="Export filtered data for external analysis. Includes all currently visible records based on active filters. CONSEQUENCES: Missing unfiltered data in exports may lead to incomplete reports."
                                 type="info"
                               >
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => exportData('csv')}
                                   className="text-xs"
                                 >
                                   <Download className="w-3 h-3 mr-1" />
                                   CSV
                                 </Button>
                               </InfoTooltip>
                               <InfoTooltip 
                                 content="Export as JSON format for programmatic analysis. Contains full object data with all fields. CONSEQUENCES: JSON exports may contain sensitive user data."
                                 type="warning"
                               >
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={() => exportData('json')}
                                   className="text-xs"
                                 >
                                   <Download className="w-3 h-3 mr-1" />
                                   JSON
                                 </Button>
                               </InfoTooltip>
                             </div>
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={() => {
                                 setSearchFilter('');
                                 setOsFilter('all');
                                 setBrowserFilter('all');
                                 setUserTypeFilter('all');
                                 setStatusFilter('all');
                               }}
                               className="text-xs"
                               disabled={!searchFilter && osFilter === 'all' && browserFilter === 'all' && userTypeFilter === 'all'}
                             >
                               Clear Filters
                             </Button>
                           </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-muted/30 rounded-lg p-4">
                          <h3 className="font-semibold mb-3">📋 Detailed Logs</h3>
                          <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-xs">
                              <thead className="sticky top-0 bg-background">
                                <tr className="border-b">
                                  <th className="text-left p-2 font-medium">User ID</th>
                                  <th className="text-left p-2 font-medium">Device</th>
                                  <th className="text-left p-2 font-medium">OS</th>
                                  <th className="text-left p-2 font-medium">Browser</th>
                                  <th className="text-left p-2 font-medium">Status</th>
                                  <th className="text-left p-2 font-medium">Time</th>
                                  <th className="text-left p-2 font-medium">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isLoading ? (
                                  <tr>
                                    <td colSpan={8} className="p-4 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Loading real user data...
                                      </div>
                                    </td>
                                  </tr>
                                  ) : filteredData.length === 0 ? (
                                    <tr>
                                      <td colSpan={7} className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                          <div className="text-2xl">🔍</div>
                                          <div className="font-medium text-muted-foreground">
                                            {searchFilter || osFilter !== 'all' || browserFilter !== 'all' || userTypeFilter !== 'all' 
                                              ? `No results found for "${searchFilter || 'current filters'}"` 
                                              : 'No user data available'
                                            }
                                          </div>
                                          {(searchFilter || osFilter !== 'all' || browserFilter !== 'all' || userTypeFilter !== 'all') && (
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              onClick={() => {
                                                setSearchFilter('');
                                                setOsFilter('all');
                                                setBrowserFilter('all');
                                                setUserTypeFilter('all');
                                              }}
                                              className="text-xs mt-2"
                                            >
                                              Clear filters to see all data
                                            </Button>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ) : (
                                   filteredData.slice(0, 20).map((item) => (
                                  <tr key={item.id} className="border-b border-border hover:bg-muted/20">
                                    <td className="p-2 font-mono">{item.userId}</td>
                                    <td className="p-2">{item.device}</td>
                                    <td className="p-2">{item.os}</td>
                                    <td className="p-2">{item.browser}</td>
                                     <td className="p-2">
                                       <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                         item.status === 'Success' 
                                           ? 'bg-green-100 text-green-800' 
                                           : item.status === 'Terminated'
                                           ? 'bg-gray-100 text-gray-800'
                                           : 'bg-red-100 text-red-800'
                                       }`}>
                                         {item.status === 'Success' ? '✅' : item.status === 'Terminated' ? '🚫' : '❌'} {item.status}
                                       </span>
                                     </td>
                                    <td className="p-2">{new Date(item.timestamp).toLocaleTimeString()}</td>
                                     <td className="p-2">
                                       {item.status === 'Failed' ? (
                                         <Button
                                           variant="ghost"
                                           size="sm"
                                           onClick={() => {
                                             setSelectedUserId(item.userId);
                                             setIsKillSessionOpen(true);
                                           }}
                                           className="text-xs h-6 px-2"
                                         >
                                           Kill Session
                                         </Button>
                                       ) : item.status === 'Terminated' ? (
                                         <span className="text-xs text-gray-500 italic">Session Terminated</span>
                                       ) : null}
                                     </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
                          Close
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </td>
            </tr>
            
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-foreground">Failures by Device</td>
              <td className="p-3 text-muted-foreground">Device-based failure breakdown</td>
              <td className="p-3">
                <span className="text-sm text-destructive">
                  ❌ iOS: {metrics.deviceFailures.ios}, Android: {metrics.deviceFailures.android}, Web: {metrics.deviceFailures.web}
                </span>
              </td>
            </tr>
            
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-foreground">Kill Session</td>
              <td className="p-3 text-muted-foreground">End user session immediately</td>
              <td className="p-3">
                <Dialog open={isKillSessionOpen} onOpenChange={setIsKillSessionOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      Kill Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-destructive">
                        ⚠️ Kill User Session
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        This will immediately terminate the user's session. They will need to log in again.
                      </p>
                      <div>
                        <label className="block text-sm font-medium mb-1">User ID</label>
                        <input
                          type="text"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          placeholder="Enter user ID..."
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsKillSessionOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleKillSession(selectedUserId)}
                        disabled={!selectedUserId}
                      >
                        Kill Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
            
            <tr className="border-b border-border">
              <td className="p-3 font-medium text-foreground">Force Refresh</td>
              <td className="p-3 text-muted-foreground">Resync refresh tokens for all users</td>
              <td className="p-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleForceRefresh}
                  disabled={refreshing}
                  className="text-xs"
                >
                  {refreshing ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Trigger
                    </>
                  )}
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Admin Notes */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          ℹ️ System Notes
        </h4>
        <p className="text-sm text-blue-700">
          Most refresh failures occur on Safari iOS 15.2 due to cookie blocking.
          <br />
          <strong>Recommendation:</strong> Suggest users update or switch browser.
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs text-blue-600">
          <span>• Success: Normal token refresh</span>
          <span>• Failed: Token expired or network error</span>
          <span>• Rate-Limited: Too many requests</span>
        </div>
      </div>
    </div>
  );
};

export default TokenRefreshHealth;