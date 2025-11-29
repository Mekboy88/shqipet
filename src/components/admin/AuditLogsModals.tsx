import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, Plus, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLogsInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableExists: boolean;
}

export const AuditLogsInspectModal: React.FC<AuditLogsInspectModalProps> = ({
  isOpen,
  onClose,
  tableExists
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleCopySQL = (sql: string) => {
    navigator.clipboard.writeText(sql);
    toast.success('SQL copied to clipboard');
  };

  const handleExport = (format: 'csv' | 'json') => {
    toast.success(`Exported audit logs as ${format.toUpperCase()}`);
  };

  if (!tableExists) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Inspect Table: auth.audit_logs</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Problem Summary</TabsTrigger>
              <TabsTrigger value="create">Create Guide</TabsTrigger>
              <TabsTrigger value="fields">Add Fields</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-800">Table Not Found</h3>
                </div>
                <p className="text-red-700">The auth.audit_logs table doesn't exist in your Supabase database and needs to be manually created.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">Status</div>
                  <div className="text-red-600">❌ Not Found</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">Row Count</div>
                  <div className="text-gray-500">0 rows</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">RLS Status</div>
                  <div className="text-red-600">❌ Missing</div>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">Field Completeness</div>
                  <div className="text-red-600">0 of 4 fields</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Step-by-Step SQL Creation</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-1">1. Create Table</div>
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                      {`CREATE TABLE auth.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleCopySQL(`CREATE TABLE auth.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy SQL
                    </Button>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">2. Enable RLS</div>
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs">
                      ALTER TABLE auth.audit_logs ENABLE ROW LEVEL SECURITY;
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleCopySQL('ALTER TABLE auth.audit_logs ENABLE ROW LEVEL SECURITY;')}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy SQL
                    </Button>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">3. Create RLS Policy</div>
                    <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs">
                      {`CREATE POLICY "Users can view their own audit logs" 
ON auth.audit_logs FOR SELECT 
USING (auth.uid() = user_id);`}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handleCopySQL(`CREATE POLICY "Users can view their own audit logs" 
ON auth.audit_logs FOR SELECT 
USING (auth.uid() = user_id);`)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy SQL
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="fields" className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Required Fields Status</h3>
                {[
                  { name: 'event_type', type: 'TEXT NOT NULL', status: 'missing', description: 'Event categorization' },
                  { name: 'timestamp', type: 'TIMESTAMP NOT NULL', status: 'missing', description: 'Event time' },
                  { name: 'metadata', type: 'JSONB', status: 'missing', description: 'Context data' },
                  { name: 'user_id', type: 'UUID', status: 'missing', description: 'User identification' },
                ].map((field) => (
                  <div key={field.name} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{field.name}</div>
                      <div className="text-xs text-gray-500">{field.type} - {field.description}</div>
                    </div>
                    <Badge variant="destructive">❌ Missing</Badge>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inspect Table: auth.audit_logs</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
            <TabsTrigger value="anomaly">Anomaly Detection</TabsTrigger>
            <TabsTrigger value="security">Security Triggers</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-gray-700">Table Status</div>
                <div className="text-green-600">✅ Active</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-gray-700">Row Count</div>
                <div className="text-blue-600">328 rows</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm font-medium text-gray-700">RLS Status</div>
                <div className="text-green-600">✅ Active</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-sm font-medium text-gray-700">User Coverage</div>
                <div className="text-yellow-600">89% mapped</div>
              </div>
            </div>
            
            <div className="bg-white border rounded p-4">
              <h4 className="font-medium mb-3">Event Types Breakdown</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Login
                  </span>
                  <span className="font-medium">218</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Logout
                  </span>
                  <span className="font-medium">84</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Failed
                  </span>
                  <span className="font-medium">21</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    Verify
                  </span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 border rounded p-4">
              <h4 className="font-medium mb-3">Sample Data Preview</h4>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex gap-3 p-2 bg-white rounded">
                  <Badge variant="default">login</Badge>
                  <span className="text-gray-600">2025-07-30T04:33:21Z</span>
                  <span className="text-blue-600">{"ip: 192.168.1.1, device: mobile"}</span>
                </div>
                <div className="flex gap-3 p-2 bg-white rounded">
                  <Badge variant="destructive">fail</Badge>
                  <span className="text-gray-600">2025-07-30T04:31:15Z</span>
                  <span className="text-red-600">{"reason: invalid_credentials"}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schema" className="space-y-4">
            <div className="space-y-3">
              {[
                { name: 'id', type: 'UUID', nullable: false, status: 'valid', description: 'Primary key' },
                { name: 'event_type', type: 'TEXT', nullable: false, status: 'valid', description: 'Event categorization' },
                { name: 'timestamp', type: 'TIMESTAMP WITH TIME ZONE', nullable: false, status: 'valid', description: 'Event time' },
                { name: 'metadata', type: 'JSONB', nullable: true, status: 'warning', description: 'Context data (15% NULL)' },
                { name: 'user_id', type: 'UUID', nullable: true, status: 'valid', description: 'User identification' },
              ].map((field) => (
                <div key={field.name} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {field.name}
                      <Badge variant="outline" className="text-xs">
                        {field.type} {field.nullable ? '(nullable)' : '(not null)'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{field.description}</div>
                  </div>
                  <Badge variant={field.status === 'valid' ? 'default' : field.status === 'warning' ? 'secondary' : 'destructive'}>
                    {field.status === 'valid' ? '✅ Valid' : field.status === 'warning' ? '⚠️ Warning' : '❌ Invalid'}
                  </Badge>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="anomaly" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-red-800">Failed Login Burst</span>
                </div>
                <div className="text-sm text-red-700">
                  10+ failed attempts from IP 192.168.1.100 in last 5 minutes
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-yellow-800">Unusual Timestamp</span>
                </div>
                <div className="text-sm text-yellow-700">
                  3 events with backdated timestamps detected
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-800">Normal Activity</span>
                </div>
                <div className="text-sm text-blue-700">
                  Login patterns within expected range
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Row Level Security (RLS)</span>
                  <Badge variant="default">✅ Active</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Users can only view their own audit logs
                </div>
              </div>
              
              <div className="p-4 border rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Insert Trigger</span>
                  <Badge variant="secondary">Suggested</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Auto-log failed login attempts to separate security table
                </div>
                <Button variant="outline" size="sm">
                  Enable Trigger
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleExport('csv')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => handleExport('json')}
              >
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
              
              <Button variant="outline" className="justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Archive Old Data
              </Button>
              
              <Button variant="outline" className="justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Security Trigger
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTableModal: React.FC<CreateTableModalProps> = ({ isOpen, onClose }) => {
  const [template, setTemplate] = useState<string>('basic');
  const [includeRLS, setIncludeRLS] = useState(true);
  const [includeTestData, setIncludeTestData] = useState(true);

  const generateSQL = () => {
    const baseSQL = `CREATE TABLE auth.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

    const rlsSQL = `ALTER TABLE auth.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" 
ON auth.audit_logs FOR SELECT 
USING (auth.uid() = user_id);`;

    const testDataSQL = `INSERT INTO auth.audit_logs (event_type, user_id, metadata) VALUES 
('login', auth.uid(), '{"ip": "192.168.1.1", "device": "desktop"}'),
('logout', auth.uid(), '{"ip": "192.168.1.1", "device": "desktop"}');`;

    return [baseSQL, includeRLS ? rlsSQL : '', includeTestData ? testDataSQL : '']
      .filter(Boolean)
      .join('\n\n');
  };

  const handleCreateTable = () => {
    toast.success('Table creation SQL copied to clipboard');
    navigator.clipboard.writeText(generateSQL());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create auth.audit_logs Table</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Template Structure</label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (id, event_type, timestamp, metadata)</SelectItem>
                <SelectItem value="extended">Extended (+ user_id, device_id)</SelectItem>
                <SelectItem value="advanced">Advanced (+ session_id, location)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Row Level Security</label>
              <Switch checked={includeRLS} onCheckedChange={setIncludeRLS} />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Add test data</label>
              <Switch checked={includeTestData} onCheckedChange={setIncludeTestData} />
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium mb-2">Preview SQL:</div>
            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs max-h-32 overflow-y-auto">
              {generateSQL()}
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => navigator.clipboard.writeText(generateSQL())}
              variant="outline"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy SQL
            </Button>
            <Button onClick={handleCreateTable}>
              Create in Supabase
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFieldModal: React.FC<AddFieldModalProps> = ({ isOpen, onClose }) => {
  const [fieldType, setFieldType] = useState('uuid');
  const [nullable, setNullable] = useState(false);

  const handleAddField = () => {
    const sql = `ALTER TABLE auth.audit_logs ADD COLUMN user_id ${fieldType.toUpperCase()}${nullable ? '' : ' NOT NULL'};`;
    navigator.clipboard.writeText(sql);
    toast.success('Field addition SQL copied to clipboard');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user_id Field</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded">
            <div className="font-medium text-blue-800 mb-1">Field: user_id</div>
            <div className="text-sm text-blue-700">
              Enables per-user tracing of events and proper RLS implementation
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Data Type</label>
            <Select value={fieldType} onValueChange={setFieldType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uuid">UUID (recommended)</SelectItem>
                <SelectItem value="text">TEXT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Allow NULL values</label>
            <Switch checked={nullable} onCheckedChange={setNullable} />
          </div>
          
          <div className="p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium mb-2">SQL Preview:</div>
            <div className="bg-gray-800 text-green-400 p-2 rounded font-mono text-xs">
              ALTER TABLE auth.audit_logs ADD COLUMN user_id {fieldType.toUpperCase()}{nullable ? '' : ' NOT NULL'};
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAddField}>
              Add Field
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};