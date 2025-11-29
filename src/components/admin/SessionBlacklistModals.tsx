import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, Shield, AlertTriangle, Users, Database, Activity, FileText, Trash2, CheckCircle, Clock, Monitor, MapPin, Ban, Eye, EyeOff, Globe, X } from 'lucide-react';
import { toast } from 'sonner';

interface SessionBlacklistInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionBlacklistInspectorModal: React.FC<SessionBlacklistInspectorModalProps> = ({ isOpen, onClose }) => {
  const [newSessionId, setNewSessionId] = React.useState('');
  const [blacklistReason, setBlacklistReason] = React.useState('');

  const blacklistData = {
    totalBlacklisted: 347,
    activeBlacklisted: 298,
    expiredBlacklisted: 49,
    last24hBlacklisted: 23,
    topReasons: ['suspicious_activity', 'manual_admin', 'stolen_credentials', 'policy_violation'],
    affectedUsers: 156
  };

  const blacklistedSessions = [
    { session_id: 'sess_a7f9d2e8b1c4...', user_email: 'user@example.com', reason: 'suspicious_activity', blacklisted_at: '2025-07-30T14:23:00Z', status: 'active' },
    { session_id: 'sess_c3e8f1a2d9b7...', user_email: 'test@domain.com', reason: 'manual_admin', blacklisted_at: '2025-07-30T13:15:00Z', status: 'active' },
    { session_id: 'sess_b9c2f4e7a1d8...', user_email: 'admin@site.org', reason: 'stolen_credentials', blacklisted_at: '2025-07-29T16:45:00Z', status: 'expired' }
  ];

  const anomalies = [
    { type: 'Repeat Offender', count: 8, severity: 'high', description: 'Same user has multiple sessions blacklisted' },
    { type: 'Session Reuse', count: 5, severity: 'critical', description: 'Blacklisted session attempted reuse' },
    { type: 'Mass Blacklisting', count: 3, severity: 'medium', description: 'Multiple sessions blacklisted simultaneously' }
  ];

  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? blacklistedSessions.map(d => `${d.session_id},${d.user_email},${d.reason},${d.blacklisted_at},${d.status}`).join('\n')
      : JSON.stringify(blacklistedSessions, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session_blacklist.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Session blacklist exported as ${format.toUpperCase()}`);
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL copied to clipboard');
  };

  const handleBlacklistSession = () => {
    if (!newSessionId || !blacklistReason) {
      toast.error('Please provide both session ID and reason');
      return;
    }
    toast.success(`Session ${newSessionId} has been blacklisted`);
    setNewSessionId('');
    setBlacklistReason('');
  };

  const handleRemoveFromBlacklist = (sessionId: string) => {
    toast.success(`Session ${sessionId} removed from blacklist`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'expired': return 'secondary';
      default: return 'default';
    }
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'suspicious_activity': return 'destructive';
      case 'stolen_credentials': return 'destructive';
      case 'manual_admin': return 'secondary';
      case 'policy_violation': return 'outline';
      default: return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Inspect Table: session_blacklist
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="security">Security Triggers</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{blacklistData.totalBlacklisted}</div>
                <div className="text-sm text-red-700">Total Blacklisted</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{blacklistData.activeBlacklisted}</div>
                <div className="text-sm text-orange-700">Active Blocks</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{blacklistData.expiredBlacklisted}</div>
                <div className="text-sm text-gray-700">Expired</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{blacklistData.last24hBlacklisted}</div>
                <div className="text-sm text-blue-700">Last 24h</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Ban className="w-4 h-4" />
                Blacklisted Sessions by Reason
              </h5>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {blacklistData.topReasons.map((reason, index) => (
                  <div key={reason} className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-mono text-sm">{reason.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-600">{Math.floor(Math.random() * 50) + 10} sessions</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Recent Blacklisted Sessions
              </h5>
              <div className="space-y-2">
                {blacklistedSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{session.session_id}</span>
                      <span className="text-sm">{session.user_email}</span>
                      <Badge variant={getReasonColor(session.reason)}>
                        {session.reason.replace('_', ' ')}
                      </Badge>
                      <Badge variant={getStatusColor(session.status)}>
                        {session.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{new Date(session.blacklisted_at).toLocaleDateString()}</span>
                      {session.status === 'active' && (
                        <Button 
                          onClick={() => handleRemoveFromBlacklist(session.session_id)}
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Blacklist Statistics
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Affected Users</div>
                  <div className="text-gray-600">{blacklistData.affectedUsers}</div>
                </div>
                <div>
                  <div className="font-medium">Avg Sessions per User</div>
                  <div className="text-gray-600">{(blacklistData.totalBlacklisted / blacklistData.affectedUsers).toFixed(1)}</div>
                </div>
                <div>
                  <div className="font-medium">Auto-Expiry Rate</div>
                  <div className="text-gray-600">{Math.round((blacklistData.expiredBlacklisted / blacklistData.totalBlacklisted) * 100)}%</div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-3">
              <h5 className="font-semibold">Table Schema</h5>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium">Field</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Nullable</th>
                      <th className="text-left p-3 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-mono">session_id</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Identifier of blacklisted session</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">user_id</td>
                      <td className="p-3"><Badge variant="outline">uuid</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Associated user account</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">reason</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Why session was banned</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">blacklisted_at</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">When session was revoked</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-mono">expires_at</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Auto-expiry time (optional)</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-mono">blacklisted_by</td>
                      <td className="p-3"><Badge variant="outline">uuid</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Admin who blacklisted session</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">Enhanced fields (blue) provide audit trail and auto-cleanup</span>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium">Indexes & Constraints</h6>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Primary Key</Badge>
                  <span>session_id</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Index</Badge>
                  <span>blacklisted_at (for cleanup queries)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Index</Badge>
                  <span>user_id (for user-specific lookups)</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Detected Anomalies
              </h5>
              
              {anomalies.map((anomaly, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{anomaly.type}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={anomaly.severity === 'critical' ? 'destructive' : anomaly.severity === 'high' ? 'secondary' : 'default'}>
                        {anomaly.count} detected
                      </Badge>
                      <Badge variant="outline">
                        {anomaly.severity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm">{anomaly.description}</p>
                </div>
              ))}

              <div className="bg-white border rounded-lg p-4">
                <h6 className="font-medium mb-3">Detection Rules</h6>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Same user multiple blacklists (3+ in 24h)</span>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Blacklisted session reuse attempt</span>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Mass blacklisting (10+ in 1 hour)</span>
                    <Badge variant="secondary">Medium Risk</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security Automation
              </h5>

              <div className="grid gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Auto-Response Rules</h6>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Force Logout All Devices</div>
                        <div className="text-xs text-gray-600">Logout user from all devices when risk detected</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Admin Notification</div>
                        <div className="text-xs text-gray-600">Notify admins on manual blacklist</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Auto-Expiry</div>
                        <div className="text-xs text-gray-600">Automatically remove old blacklist entries</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Current Settings</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Auto-Expiry Duration</span>
                      <Badge variant="outline">7 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cleanup Frequency</span>
                      <Badge variant="outline">Daily</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Admin Alert Threshold</span>
                      <Badge variant="outline">5 blacklists/hour</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              <h5 className="font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Management Actions
              </h5>

              <div className="grid gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Manual Session Blacklist</h6>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Session ID</label>
                      <Input 
                        value={newSessionId}
                        onChange={(e) => setNewSessionId(e.target.value)}
                        placeholder="Enter session ID to blacklist"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Reason</label>
                      <Textarea 
                        value={blacklistReason}
                        onChange={(e) => setBlacklistReason(e.target.value)}
                        placeholder="Enter reason for blacklisting"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <Button onClick={handleBlacklistSession} className="w-full">
                      <Ban className="w-4 h-4 mr-2" />
                      Blacklist Session
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Export Data</h6>
                  <div className="flex gap-2">
                    <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={() => handleExport('json')} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">SQL Queries</h6>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Create table SQL</span>
                      <Button 
                        onClick={() => handleCopySQL(`CREATE TABLE session_blacklist (
  session_id text NOT NULL PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  reason text NOT NULL,
  blacklisted_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  blacklisted_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_session_blacklist_user_id ON session_blacklist(user_id);
CREATE INDEX idx_session_blacklist_blacklisted_at ON session_blacklist(blacklisted_at);`)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Bulk Actions</h6>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clean Expired Blacklists
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full justify-start">
                      <Ban className="w-4 h-4 mr-2" />
                      Emergency: Blacklist All User Sessions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Add Table Modal
export const SessionBlacklistAddTableModal: React.FC<{isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose }) => {
  const handleCreateTable = () => {
    toast.success('Creating session_blacklist table...');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create session_blacklist Table</DialogTitle>
        </DialogHeader>
        <Button onClick={handleCreateTable}>Create Table</Button>
      </DialogContent>
    </Dialog>
  );
};