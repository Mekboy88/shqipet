import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plug,
  TrendingUp,
  Download,
  Loader2
} from 'lucide-react';

interface OAuthProvider {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error';
  validTokens: number | null; // null for TOTP providers
  expiringIn: number | null;
  lastError: string | null;
  clientId: string;
  clientSecret: string;
  scopes: string[];
  lastRotation: string;
  redirectUri: string;
}

interface TokenLog {
  timestamp: string;
  provider: string;
  result: 'success' | 'fail';
  ip: string;
  device: string;
  error?: string;
}

export function OAuthProviderHealth() {
  const [providers, setProviders] = useState<OAuthProvider[]>([
    {
      id: 'apple',
      name: 'Apple',
      status: 'healthy',
      validTokens: 98.2,
      expiringIn: null,
      lastError: null,
      clientId: 'com.shqipet.service',
      clientSecret: 'sk_test_51H...',
      scopes: ['email', 'name'],
      lastRotation: '2025-07-14',
      redirectUri: 'https://shqipet.com/auth/callback'
    },
    {
      id: 'google',
      name: 'Google',
      status: 'warning',
      validTokens: 85.1,
      expiringIn: 4,
      lastError: 'SSL timeout',
      clientId: 'abc123.apps.googleusercontent.com',
      clientSecret: 'GOCSPX-...',
      scopes: ['email', 'profile', 'openid'],
      lastRotation: '2025-06-20',
      redirectUri: 'https://shqipet.com/auth/callback'
    },
    {
      id: 'google-authenticator',
      name: 'Google Authenticator',
      status: 'healthy',
      validTokens: null, // Not applicable for TOTP
      expiringIn: null, // TOTP doesn't have expiring keys
      lastError: null,
      clientId: 'TOTP MFA via QR Code Setup',
      clientSecret: '53 active users',
      scopes: ['TOTP', 'MFA'],
      lastRotation: 'N/A - TOTP',
      redirectUri: 'N/A - TOTP'
    }
  ]);

  const [logs, setLogs] = useState<TokenLog[]>([
    {
      timestamp: '2025-07-26 05:20',
      provider: 'Google',
      result: 'fail',
      ip: '192.168.1.1',
      device: 'iOS',
      error: 'Token invalid'
    },
    {
      timestamp: '2025-07-26 05:15',
      provider: 'Apple',
      result: 'success',
      ip: '192.168.1.2',
      device: 'Android',
    },
    {
      timestamp: '2025-07-26 05:10',
      provider: 'Facebook',
      result: 'fail',
      ip: '192.168.1.3',
      device: 'Desktop',
      error: 'Connection timeout'
    },
    {
      timestamp: '2025-07-26 05:05',
      provider: 'Google Authenticator',
      result: 'success',
      ip: '192.168.1.4',
      device: 'Mobile',
    },
    {
      timestamp: '2025-07-26 04:58',
      provider: 'Google Authenticator',
      result: 'fail',
      ip: '192.168.1.5',
      device: 'Mobile',
      error: 'Invalid OTP code'
    }
  ]);

  const [selectedProvider, setSelectedProvider] = useState<OAuthProvider | null>(null);
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({});
  const [showChart, setShowChart] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [connectionResults, setConnectionResults] = useState<{[key: string]: 'success' | 'error' | null}>({});

  // Filter out TOTP providers for token validity calculation
  const oauthProviders = providers.filter(p => p.validTokens !== null);
  const overallTokenValidity = oauthProviders.length > 0 
    ? oauthProviders.reduce((sum, p) => sum + p.validTokens!, 0) / oauthProviders.length 
    : 0;
  const hasLowHealth = overallTokenValidity < 90;
  const hasExpiringKeys = providers.some(p => p.expiringIn && p.expiringIn <= 7);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': 
        return (
          <Badge className="bg-success text-success-foreground animate-fade-in transition-all duration-300">
            <CheckCircle className="h-3 w-3 mr-1" />
            OK
          </Badge>
        );
      case 'warning': 
        return (
          <Badge className="bg-warning text-warning-foreground animate-fade-in transition-all duration-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Warning
          </Badge>
        );
      case 'error': 
        return (
          <Badge variant="destructive" className="animate-fade-in transition-all duration-300">
            <XCircle className="h-3 w-3 mr-1" />
            Down
          </Badge>
        );
      default: 
        return (
          <Badge variant="secondary" className="animate-fade-in transition-all duration-300">
            Unknown
          </Badge>
        );
    }
  };

  const getExpiryBadge = (days: number | null) => {
    if (!days) return (
      <Badge className="bg-success text-success-foreground">
        <CheckCircle className="h-3 w-3 mr-1" />
        No Expiry
      </Badge>
    );
    if (days <= 3) return (
      <Badge variant="destructive" className="animate-pulse">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
    if (days <= 10) return (
      <Badge className="bg-warning text-warning-foreground animate-pulse">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
    return (
      <Badge className="bg-success text-success-foreground">
        <Clock className="h-3 w-3 mr-1" />
        {days} days left
      </Badge>
    );
  };

  const handleRefreshSecret = async (providerId: string) => {
    setIsRefreshing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setProviders(prev => prev.map(p => 
        p.id === providerId 
          ? { ...p, expiringIn: null, lastRotation: new Date().toISOString().split('T')[0] }
          : p
      ));
      
      toast.success(`${providerId} client secret refreshed successfully`);
    } catch (error) {
      toast.error('Failed to refresh client secret');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleReconnect = async (providerId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProviders(prev => prev.map(p => 
        p.id === providerId 
          ? { ...p, status: 'healthy' as const, validTokens: 95 + Math.random() * 5, lastError: null }
          : p
      ));
      
      toast.success(`${providerId} reconnected successfully`);
    } catch (error) {
      toast.error('Failed to reconnect provider');
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setIsTestingConnection(providerId);
    setConnectionResults(prev => ({ ...prev, [providerId]: null }));
    
    try {
      // Simulate API call to test provider connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setConnectionResults(prev => ({ ...prev, [providerId]: 'success' }));
        toast.success(`${providerId} connection test passed`, {
          description: "Provider is responding correctly"
        });
      } else {
        setConnectionResults(prev => ({ ...prev, [providerId]: 'error' }));
        toast.error(`${providerId} connection test failed`, {
          description: "Check your client credentials"
        });
      }
    } catch (error) {
      setConnectionResults(prev => ({ ...prev, [providerId]: 'error' }));
      toast.error('Connection test failed', {
        description: "Network error occurred"
      });
    } finally {
      setIsTestingConnection(null);
    }
  };

  const exportLogs = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? logs.map(log => Object.values(log).join(',')).join('\n')
      : JSON.stringify(logs, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oauth-logs.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Logs exported as ${format.toUpperCase()}`);
  };

  const toggleSecretVisibility = (providerId: string) => {
    setShowSecrets(prev => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Health Alert Banner */}
      {hasLowHealth && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            OAuth token verification success rate is below 90%. Logins may be affected. 
            Please check client credentials or refresh keys.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Token Validity %</p>
                <p className="text-2xl font-bold">{overallTokenValidity.toFixed(1)}%</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="text-primary"
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={overallTokenValidity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiring Client Keys</p>
                <p className="text-2xl font-bold">
                  {hasExpiringKeys ? (
                    <span className="text-warning flex items-center gap-1">
                      <Clock className="h-5 w-5" />
                      {Math.min(...providers.filter(p => p.expiringIn).map(p => p.expiringIn!))} days
                    </span>
                  ) : (
                    <span className="text-success">All Safe</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Providers</p>
                <p className="text-2xl font-bold">
                  {providers.filter(p => p.status === 'healthy').length}/{providers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            OAuth Provider Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Tokens</TableHead>
                <TableHead>Expiring Keys</TableHead>
                <TableHead>Last Error</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="flex items-center gap-2">
                    {getStatusIcon(provider.status)}
                    <div>
                      <div className="font-medium">{provider.name}</div>
                      {provider.id === 'google-authenticator' && (
                        <div className="text-xs text-muted-foreground">TOTP MFA via QR Code Setup</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(provider.status)}</TableCell>
                  <TableCell>
                    {provider.id === 'google-authenticator' ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-success font-medium">Active Users: 53</span>
                        </TooltipTrigger>
                        <TooltipContent>Number of active users with TOTP enabled and confirmed</TooltipContent>
                      </Tooltip>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={provider.validTokens! < 90 ? 'text-destructive' : 'text-success'}>
                          {provider.validTokens!.toFixed(1)}%
                        </span>
                        <Progress value={provider.validTokens!} className="w-16 h-2" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {provider.id === 'google-authenticator' ? (
                      <Badge variant="secondary">
                        — Not Applicable
                      </Badge>
                    ) : (
                      getExpiryBadge(provider.expiringIn)
                    )}
                  </TableCell>
                  <TableCell className="max-w-32 truncate" title={provider.lastError || ''}>
                    {provider.lastError || '—'}
                  </TableCell>
                   <TableCell>
                     <div className="flex items-center gap-2">
                       <Tooltip>
                         <TooltipTrigger asChild>
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => setSelectedProvider(provider)}
                                 className="hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-950 dark:hover:text-green-300 transition-colors"
                               >
                                 <FileText className="h-4 w-4" />
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="max-w-2xl">
                               <DialogHeader>
                                 <DialogTitle className="flex items-center gap-2">
                                   <FileText className="h-5 w-5" />
                                   {provider.name} Authentication Logs
                                 </DialogTitle>
                               </DialogHeader>
                               <div className="space-y-4">
                                 <div className="flex gap-2">
                                   <Button 
                                     variant="outline" 
                                     size="sm"
                                     onClick={() => exportLogs('csv')}
                                     className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                                   >
                                     <Download className="h-4 w-4 mr-2" />
                                     Export CSV
                                   </Button>
                                   <Button 
                                     variant="outline" 
                                     size="sm"
                                     onClick={() => exportLogs('json')}
                                     className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:hover:bg-green-900 dark:text-green-300 dark:border-green-800"
                                   >
                                     <Download className="h-4 w-4 mr-2" />
                                     Export JSON
                                   </Button>
                                 </div>
                                 <Table>
                                   <TableHeader>
                                     <TableRow>
                                       <TableHead>
                                         <Tooltip>
                                           <TooltipTrigger>Time</TooltipTrigger>
                                           <TooltipContent>When the authentication attempt occurred</TooltipContent>
                                         </Tooltip>
                                       </TableHead>
                                       <TableHead>
                                         <Tooltip>
                                           <TooltipTrigger>Result</TooltipTrigger>
                                           <TooltipContent>Success or failure from provider</TooltipContent>
                                         </Tooltip>
                                       </TableHead>
                                       <TableHead>
                                         <Tooltip>
                                           <TooltipTrigger>IP</TooltipTrigger>
                                           <TooltipContent>Client's public IP during attempt</TooltipContent>
                                         </Tooltip>
                                       </TableHead>
                                       <TableHead>
                                         <Tooltip>
                                           <TooltipTrigger>Device</TooltipTrigger>
                                           <TooltipContent>Device type that attempted auth</TooltipContent>
                                         </Tooltip>
                                       </TableHead>
                                       <TableHead>
                                         <Tooltip>
                                           <TooltipTrigger>Error</TooltipTrigger>
                                           <TooltipContent>Error message if any</TooltipContent>
                                         </Tooltip>
                                       </TableHead>
                                     </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                     {logs.filter(log => log.provider === provider.name).map((log, idx) => (
                                       <TableRow key={idx}>
                                         <TableCell>{log.timestamp}</TableCell>
                                         <TableCell>
                                           {log.result === 'success' ? (
                                             <Badge className="bg-success text-success-foreground">
                                               <CheckCircle className="h-3 w-3 mr-1" />
                                               Success
                                             </Badge>
                                           ) : (
                                             <Badge variant="destructive">
                                               <XCircle className="h-3 w-3 mr-1" />
                                               Fail
                                             </Badge>
                                           )}
                                         </TableCell>
                                         <TableCell>{log.ip}</TableCell>
                                         <TableCell>{log.device}</TableCell>
                                         <TableCell>{log.error || '—'}</TableCell>
                                       </TableRow>
                                     ))}
                                   </TableBody>
                                 </Table>
                               </div>
                             </DialogContent>
                           </Dialog>
                         </TooltipTrigger>
                         <TooltipContent>View authentication logs</TooltipContent>
                       </Tooltip>

                       <Tooltip>
                         <TooltipTrigger asChild>
                           <Dialog>
                             <DialogTrigger asChild>
                               <Button 
                                 variant="ghost" 
                                 size="sm"
                                 onClick={() => setSelectedProvider(provider)}
                                 className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition-colors"
                               >
                                 <Settings className="h-4 w-4" />
                               </Button>
                             </DialogTrigger>
                             <DialogContent className="max-w-2xl">
                               <DialogHeader>
                                 <DialogTitle className="flex items-center gap-2">
                                   <Settings className="h-5 w-5" />
                                   {provider.name} Configuration
                                 </DialogTitle>
                               </DialogHeader>
                               <div className="space-y-4">
                                 <div className="grid grid-cols-2 gap-4">
                                   <div>
                                     <label className="text-sm font-medium">Client ID</label>
                                     <p className="text-sm text-muted-foreground break-all">{provider.clientId}</p>
                                   </div>
                                   <div>
                                     <label className="text-sm font-medium">Client Secret</label>
                                     <div className="flex items-center gap-2">
                                       <p className="text-sm text-muted-foreground">
                                         {showSecrets[provider.id] ? provider.clientSecret : '***********'}
                                       </p>
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={() => toggleSecretVisibility(provider.id)}
                                         className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                       >
                                         {showSecrets[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                       </Button>
                                     </div>
                                   </div>
                                   <div>
                                     <label className="text-sm font-medium">Scopes</label>
                                     <p className="text-sm text-muted-foreground">{provider.scopes.join(', ')}</p>
                                   </div>
                                   <div>
                                     <label className="text-sm font-medium">Last Rotation</label>
                                     <p className="text-sm text-muted-foreground">{provider.lastRotation}</p>
                                   </div>
                                   <div className="col-span-2">
                                     <label className="text-sm font-medium">Redirect URI</label>
                                     <p className="text-sm text-muted-foreground break-all">{provider.redirectUri}</p>
                                   </div>
                                 </div>
                                 
                                 {/* Action Results */}
                                 {connectionResults[provider.id] && (
                                   <div className={`p-3 rounded-lg border ${
                                     connectionResults[provider.id] === 'success' 
                                       ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300' 
                                       : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-300'
                                   }`}>
                                     <div className="flex items-center gap-2">
                                       {connectionResults[provider.id] === 'success' ? (
                                         <CheckCircle className="h-4 w-4" />
                                       ) : (
                                         <XCircle className="h-4 w-4" />
                                       )}
                                       <span className="text-sm font-medium">
                                         {connectionResults[provider.id] === 'success' 
                                           ? 'Connection test successful' 
                                           : 'Connection test failed'
                                         }
                                       </span>
                                     </div>
                                   </div>
                                 )}
                                 
                                 <div className="flex gap-2">
                                   <Button 
                                     onClick={() => handleTestConnection(provider.id)}
                                     disabled={isTestingConnection === provider.id}
                                     className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 disabled:bg-blue-300 disabled:text-blue-100"
                                   >
                                     {isTestingConnection === provider.id ? (
                                       <>
                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                         Testing...
                                       </>
                                     ) : (
                                       <>
                                         <Plug className="h-4 w-4 mr-2" />
                                         Test Connection
                                       </>
                                     )}
                                   </Button>
                                   <Button 
                                     onClick={() => handleRefreshSecret(provider.id)}
                                     disabled={isRefreshing}
                                     variant="outline"
                                     className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200 hover:border-yellow-300 dark:bg-yellow-950 dark:hover:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 disabled:opacity-50"
                                   >
                                     {isRefreshing ? (
                                       <>
                                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                         Refreshing...
                                       </>
                                     ) : (
                                       <>
                                         <RefreshCw className="h-4 w-4 mr-2" />
                                         Refresh Secret
                                       </>
                                     )}
                                   </Button>
                                 </div>
                               </div>
                             </DialogContent>
                           </Dialog>
                         </TooltipTrigger>
                         <TooltipContent>Configure provider settings</TooltipContent>
                       </Tooltip>

                       {provider.status === 'error' && (
                         <Tooltip>
                           <TooltipTrigger asChild>
                             <Button 
                               variant="ghost" 
                               size="sm"
                               onClick={() => handleReconnect(provider.id)}
                               className="hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950 dark:hover:text-red-300 transition-colors"
                             >
                               <Plug className="h-4 w-4" />
                             </Button>
                           </TooltipTrigger>
                           <TooltipContent>Reconnect provider</TooltipContent>
                         </Tooltip>
                       )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Notes */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium">System Note</p>
              <p className="text-sm text-muted-foreground">
                OAuth failures often occur from outdated secrets. Consider rotating keys every 90 days.
                Most refresh failures occur on Safari iOS 15.2 due to cookie blocking.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}