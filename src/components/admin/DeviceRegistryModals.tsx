import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Copy, Download, Shield, AlertTriangle, Users, Database, Activity, FileText, Trash2, CheckCircle, Clock, Monitor, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface DeviceRegistryInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceRegistryInspectorModal: React.FC<DeviceRegistryInspectorModalProps> = ({ isOpen, onClose }) => {
  // Mock data for demonstration
  const deviceData = {
    totalDevices: 1247,
    uniqueUsers: 834,
    trustedDevices: 891,
    riskDevices: 42,
    lastActivity: '2025-07-30T14:23:00Z',
    avgDevicesPerUser: 1.5,
    newDevices24h: 23
  };

  const sampleDevices = [
    { device_hash: 'a7f9d2e8b1c4...', user_id: 'usr_123', first_seen: '2025-07-29T10:15:00Z', location: 'New York, US', trusted: true, risk_level: 'low' },
    { device_hash: 'c3e8f1a2d9b7...', user_id: 'usr_456', first_seen: '2025-07-30T08:30:00Z', location: 'London, UK', trusted: false, risk_level: 'medium' },
    { device_hash: 'b9c2f4e7a1d8...', user_id: 'usr_789', first_seen: '2025-07-28T16:45:00Z', location: 'Tokyo, JP', trusted: true, risk_level: 'low' }
  ];

  const anomalies = [
    { type: 'Multiple Users Same Device', count: 7, severity: 'high', description: 'Device hash used by 3+ different users' },
    { type: 'Location Jump', count: 12, severity: 'medium', description: 'Same device active from different continents within 1 hour' },
    { type: 'Rapid Registration', count: 5, severity: 'low', description: 'Multiple devices registered by same user in short time' }
  ];

  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? sampleDevices.map(d => `${d.device_hash},${d.user_id},${d.first_seen},${d.location},${d.trusted},${d.risk_level}`).join('\n')
      : JSON.stringify(sampleDevices, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `device_registry.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Device registry exported as ${format.toUpperCase()}`);
  };

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL copied to clipboard');
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">{/*removed fullScreen prop*/}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Inspect Table: device_registry
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
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{deviceData.totalDevices}</div>
                <div className="text-sm text-blue-700">Total Devices</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{deviceData.uniqueUsers}</div>
                <div className="text-sm text-green-700">Unique Users</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{deviceData.trustedDevices}</div>
                <div className="text-sm text-purple-700">Trusted Devices</div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{deviceData.riskDevices}</div>
                <div className="text-sm text-red-700">Risk Devices</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold mb-3 flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Recent Device Activity
              </h5>
              <div className="space-y-2">
                {sampleDevices.map((device, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <Badge variant={device.trusted ? "default" : "destructive"}>
                        {device.trusted ? 'Trusted' : 'Untrusted'}
                      </Badge>
                      <span className="font-mono text-sm">{device.device_hash}</span>
                      <span className="text-sm text-gray-600">{device.user_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-3 h-3" />
                      {device.location}
                      <Clock className="w-3 h-3 ml-2" />
                      {new Date(device.first_seen).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border rounded-lg">
                <h6 className="font-medium mb-2">Device Distribution</h6>
                <div className="text-sm text-gray-600">
                  <div>Avg per user: {deviceData.avgDevicesPerUser}</div>
                  <div>New in 24h: {deviceData.newDevices24h}</div>
                  <div>Trust rate: {Math.round((deviceData.trustedDevices / deviceData.totalDevices) * 100)}%</div>
                </div>
              </div>
              <div className="p-4 bg-white border rounded-lg">
                <h6 className="font-medium mb-2">Security Status</h6>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">RLS Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Fraud Detection Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Location Tracking Optional</span>
                  </div>
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
                      <td className="p-3 font-mono">user_id</td>
                      <td className="p-3"><Badge variant="outline">uuid</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Device owner identification</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">device_hash</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Unique device fingerprint</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono">first_seen</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="destructive">No</Badge></td>
                      <td className="p-3 text-sm">Initial device registration</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-mono">last_seen</td>
                      <td className="p-3"><Badge variant="outline">timestamp</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Latest activity timestamp</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-mono">trusted</td>
                      <td className="p-3"><Badge variant="outline">boolean</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Device trust status</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="p-3 font-mono">location_hash</td>
                      <td className="p-3"><Badge variant="outline">text</Badge></td>
                      <td className="p-3"><Badge variant="secondary">Yes</Badge></td>
                      <td className="p-3 text-sm">Geo-location fingerprint</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">Enhanced fields (blue) are recommended for advanced tracking</span>
              </div>
            </div>

            <div className="space-y-2">
              <h6 className="font-medium">Indexes & Constraints</h6>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Primary Key</Badge>
                  <span>device_hash</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Foreign Key</Badge>
                  <span>user_id → auth.users(id)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Index</Badge>
                  <span>user_id, first_seen</span>
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
                      <Badge variant={anomaly.severity === 'high' ? 'destructive' : anomaly.severity === 'medium' ? 'secondary' : 'default'}>
                        {anomaly.count} cases
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
                    <span>Same device, multiple users (3+)</span>
                    <Badge variant="destructive">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Location jump (&gt;1000km in &lt;1hr)</span>
                    <Badge variant="secondary">Medium Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Device registration spike (5+ in 10min)</span>
                    <Badge variant="default">Low Risk</Badge>
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
                Security Configuration
              </h5>

              <div className="grid gap-4">
                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Row Level Security (RLS)</h6>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS Enabled</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                      CREATE POLICY "Users can view own devices" ON device_registry<br/>
                      FOR SELECT USING (user_id = auth.uid());
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Security Triggers</h6>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Location Jump Alert</div>
                        <div className="text-xs text-gray-600">Notify when same device appears in different locations</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Device Limit Warning</div>
                        <div className="text-xs text-gray-600">Alert when user exceeds 5 devices</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Shared Device Detection</div>
                        <div className="text-xs text-gray-600">Flag devices used by multiple users</div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border rounded-lg">
                  <h6 className="font-medium mb-3">Automated Actions</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto-trust devices after 7 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Block suspicious location jumps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span>Manual review for shared devices</span>
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
                Available Actions
              </h5>

              <div className="grid gap-4">
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
                        onClick={() => handleCopySQL(`CREATE TABLE device_registry (
  user_id uuid NOT NULL REFERENCES auth.users(id),
  device_hash text NOT NULL PRIMARY KEY,
  first_seen timestamp with time zone NOT NULL DEFAULT now(),
  last_seen timestamp with time zone,
  trusted boolean DEFAULT false,
  location_hash text
);`)}
                        variant="outline" 
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy SQL
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">RLS policies SQL</span>
                      <Button 
                        onClick={() => handleCopySQL(`ALTER TABLE device_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own devices" ON device_registry FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own devices" ON device_registry FOR INSERT WITH CHECK (user_id = auth.uid());`)}
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
                  <h6 className="font-medium mb-3">Device Management</h6>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Mark All Trusted (Admin Only)
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Flag Suspicious Devices
                    </Button>
                    <Button variant="destructive" size="sm" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Inactive Devices (90+ days)
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
interface DeviceRegistryAddTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceRegistryAddTableModal: React.FC<DeviceRegistryAddTableModalProps> = ({ isOpen, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = React.useState('basic');
  const [enableRLS, setEnableRLS] = React.useState(true);
  const [addTestData, setAddTestData] = React.useState(false);

  const templates = {
    basic: {
      name: 'Basic Device Registry',
      fields: ['user_id', 'device_hash', 'first_seen'],
      description: 'Essential fields for device tracking'
    },
    extended: {
      name: 'Extended Device Registry',
      fields: ['user_id', 'device_hash', 'first_seen', 'last_seen', 'trusted', 'platform'],
      description: 'Includes trust status and platform detection'
    },
    advanced: {
      name: 'Advanced Device Registry',
      fields: ['user_id', 'device_hash', 'first_seen', 'last_seen', 'trusted', 'platform', 'location_hash', 'risk_score', 'metadata'],
      description: 'Full featured with location and risk assessment'
    }
  };

  const handleCreateTable = () => {
    const template = templates[selectedTemplate as keyof typeof templates];
    toast.success(`Creating ${template.name} with ${template.fields.length} fields...`);
    onClose();
  };

  const getFieldDescription = (field: string) => {
    const descriptions: Record<string, string> = {
      user_id: 'uuid - Device owner reference',
      device_hash: 'text - Unique device fingerprint',
      first_seen: 'timestamp - Initial registration',
      last_seen: 'timestamp - Latest activity',
      trusted: 'boolean - Trust status',
      platform: 'text - Device platform/OS',
      location_hash: 'text - Geo-location hash',
      risk_score: 'integer - Risk assessment score',
      metadata: 'jsonb - Additional device info'
    };
    return descriptions[field] || field;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Create device_registry Table
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Choose Template</h4>
            <div className="space-y-2">
              {Object.entries(templates).map(([key, template]) => (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(key)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-gray-600">{template.description}</div>
                    </div>
                    <Badge variant="outline">{template.fields.length} fields</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div>
              <h4 className="font-medium mb-3">Template Fields</h4>
              <div className="space-y-1">
                {templates[selectedTemplate as keyof typeof templates].fields.map((field) => (
                  <div key={field} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-sm">{field}</span>
                    <span className="text-xs text-gray-600">{getFieldDescription(field)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Row Level Security</div>
                <div className="text-sm text-gray-600">Automatically add RLS policies for user isolation</div>
              </div>
              <Switch checked={enableRLS} onCheckedChange={setEnableRLS} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Add Test Data</div>
                <div className="text-sm text-gray-600">Insert sample device records for testing</div>
              </div>
              <Switch checked={addTestData} onCheckedChange={setAddTestData} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleCreateTable}>Create Table</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Add Field Modal
interface DeviceRegistryAddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  missingField: string;
}

export const DeviceRegistryAddFieldModal: React.FC<DeviceRegistryAddFieldModalProps> = ({ 
  isOpen, 
  onClose, 
  missingField 
}) => {
  const [fieldType, setFieldType] = React.useState('text');
  const [nullable, setNullable] = React.useState(true);
  const [defaultValue, setDefaultValue] = React.useState('');

  const fieldSuggestions: Record<string, any> = {
    last_seen: { type: 'timestamp', nullable: true, default: 'now()' },
    trusted: { type: 'boolean', nullable: true, default: 'false' },
    platform: { type: 'text', nullable: true, default: '' },
    location_hash: { type: 'text', nullable: true, default: '' },
    risk_score: { type: 'integer', nullable: true, default: '0' }
  };

  React.useEffect(() => {
    if (missingField && fieldSuggestions[missingField]) {
      const suggestion = fieldSuggestions[missingField];
      setFieldType(suggestion.type);
      setNullable(suggestion.nullable);
      setDefaultValue(suggestion.default);
    }
  }, [missingField]);

  const handleAddField = () => {
    toast.success(`Adding field ${missingField} (${fieldType}) to device_registry table...`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Field: {missingField}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Data Type</label>
            <select 
              value={fieldType} 
              onChange={(e) => setFieldType(e.target.value)}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="text">text</option>
              <option value="uuid">uuid</option>
              <option value="integer">integer</option>
              <option value="boolean">boolean</option>
              <option value="timestamp">timestamp with time zone</option>
              <option value="jsonb">jsonb</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Nullable</label>
            <Switch checked={nullable} onCheckedChange={setNullable} />
          </div>

          {nullable && (
            <div>
              <label className="text-sm font-medium">Default Value</label>
              <input 
                type="text"
                value={defaultValue}
                onChange={(e) => setDefaultValue(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                placeholder="Enter default value (optional)"
              />
            </div>
          )}

          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm">
              <strong>SQL Preview:</strong>
              <div className="font-mono mt-1 text-xs">
                ALTER TABLE device_registry ADD COLUMN {missingField} {fieldType}
                {!nullable ? ' NOT NULL' : ''}
                {defaultValue ? ` DEFAULT ${defaultValue}` : ''};
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddField}>Add Field</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};