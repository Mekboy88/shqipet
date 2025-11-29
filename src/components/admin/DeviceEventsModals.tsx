import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Shield, AlertTriangle, Users, Database, Activity, FileText, Trash2, CheckCircle, Clock, Monitor, MapPin, Ban, Eye, EyeOff, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceEventsInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceEventsInspectorModal: React.FC<DeviceEventsInspectorModalProps> = ({ isOpen, onClose }) => {
  const eventsData = {
    totalEvents: 15847,
    uniqueDevices: 892,
    activeUsers: 567,
    suspiciousEvents: 23,
    last24hEvents: 1247,
    topCountries: ['US', 'GB', 'DE', 'FR', 'CA']
  };

  const recentEvents = [
    { device_id: 'dev_a7f9d2e8', user_email: 'user@example.com', login_time: '2025-07-30T14:23:00Z', location: 'New York, US', flagged: false },
    { device_id: 'dev_c3e8f1a2', user_email: 'test@domain.com', login_time: '2025-07-30T14:15:00Z', location: 'London, UK', flagged: true },
    { device_id: 'dev_b9c2f4e7', user_email: 'admin@site.org', login_time: '2025-07-30T14:10:00Z', location: 'Tokyo, JP', flagged: false }
  ];

  const anomalies = [
    { type: 'Location Jump', count: 12, severity: 'high', description: 'Same user logging in from different continents within 30 minutes' },
    { type: 'New Device in Risky Location', count: 8, severity: 'medium', description: 'First-time device from high-risk country' },
    { type: 'Rapid Multi-Device Login', count: 5, severity: 'low', description: 'Multiple devices used simultaneously' }
  ];

  const handleExport = (format: 'csv' | 'json', type: 'events' | 'devices') => {
    const data = format === 'csv' 
      ? recentEvents.map(d => `${d.device_id},${d.user_email},${d.login_time},${d.location},${d.flagged}`).join('\n')
      : JSON.stringify(recentEvents, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device_${type}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Device ${type} exported as ${format.toUpperCase()}`);
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL copied to clipboard');
  };

  const handleFlagDevice = (deviceId: string) => {
    toast.success(`Device ${deviceId} has been flagged`);
  };

  const handleForceLogout = (deviceId: string) => {
    toast.success(`All sessions for device ${deviceId} have been terminated`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Inspect Table: auth.device_events
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
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{eventsData.totalEvents}</div>
                <div className="text-sm text-purple-700">Total Events</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{eventsData.uniqueDevices}</div>
                <div className="text-sm text-blue-700">Unique Devices</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{eventsData.activeUsers}</div>
                <div className="text-sm text-green-700">Active Users</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{eventsData.suspiciousEvents}</div>
                <div className="text-sm text-red-700">Flagged Events</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Global Device Activity
              </h5>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {eventsData.topCountries.map((country, index) => (
                  <div key={country} className="text-center p-2 bg-gray-50 rounded">
                    <div className="font-mono text-lg">{country}</div>
                    <div className="text-xs text-gray-600">{Math.floor(Math.random() * 200) + 50} events</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Recent Device Events
              </h5>
              <div className="space-y-2">
                {recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">{event.device_id}</span>
                      <span className="text-sm">{event.user_email}</span>
                      <Badge variant={event.flagged ? "destructive" : "default"}>
                        {event.flagged ? 'Flagged' : 'Normal'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{event.location}</span>
                      <div className="flex gap-1">
                        <Button 
                          onClick={() => handleFlagDevice(event.device_id)}
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          onClick={() => handleForceLogout(event.device_id)}
                          variant="destructive" 
                          size="sm"
                          className="text-xs"
                        >
                          <Ban className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Schema Tab */}
          <TabsContent value="schema" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
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
                  <tr><td className="p-3 font-mono">device_id</td><td className="p-3"><Badge variant="outline">text</Badge></td><td className="p-3"><Badge variant="destructive">No</Badge></td><td className="p-3 text-sm">Unique device identifier</td></tr>
                  <tr><td className="p-3 font-mono">user_id</td><td className="p-3"><Badge variant="outline">uuid</Badge></td><td className="p-3"><Badge variant="destructive">No</Badge></td><td className="p-3 text-sm">Associated user account</td></tr>
                  <tr><td className="p-3 font-mono">login_time</td><td className="p-3"><Badge variant="outline">timestamp</Badge></td><td className="p-3"><Badge variant="destructive">No</Badge></td><td className="p-3 text-sm">When device was used</td></tr>
                  <tr><td className="p-3 font-mono">location</td><td className="p-3"><Badge variant="outline">text</Badge></td><td className="p-3"><Badge variant="secondary">Yes</Badge></td><td className="p-3 text-sm">Geographic location data</td></tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            {anomalies.map((anomaly, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{anomaly.type}</span>
                  <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'default'}>
                    {anomaly.count} cases
                  </Badge>
                </div>
                <p className="text-sm">{anomaly.description}</p>
              </div>
            ))}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="p-4 bg-white border rounded-lg">
              <h6 className="font-medium mb-3">Auto-Response Rules</h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">MFA Enforcement</div>
                    <div className="text-xs text-gray-600">Require MFA for suspicious locations</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Session Invalidation</div>
                    <div className="text-xs text-gray-600">Auto-logout on location jumps</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="mt-4 space-y-4 overflow-y-auto max-h-[70vh]">
            <div className="p-4 bg-white border rounded-lg">
              <h6 className="font-medium mb-3">Export Data</h6>
              <div className="flex gap-2">
                <Button onClick={() => handleExport('csv', 'events')} variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Events CSV
                </Button>
                <Button onClick={() => handleExport('json', 'devices')} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Device List JSON
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export const DeviceEventsAddTableModal: React.FC<{isOpen: boolean; onClose: () => void}> = ({ isOpen, onClose }) => {
  const handleCreateTable = () => {
    toast.success('Creating auth.device_events table...');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create auth.device_events Table</DialogTitle>
        </DialogHeader>
        <Button onClick={handleCreateTable}>Create Table</Button>
      </DialogContent>
    </Dialog>
  );
};