import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Download, 
  Copy, 
  AlertTriangle,
  Clock,
  Database,
  Eye,
  Activity
} from 'lucide-react';

interface TableInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableName: string;
}

const TableInspectorModal: React.FC<TableInspectorModalProps> = ({
  isOpen,
  onClose,
  tableName
}) => {
  // Mock data - in real implementation, this would come from Supabase
  const getTableData = (table: string) => {
    const tableData: { [key: string]: any } = {
      'auth.refresh_tokens': {
        status: 'active',
        rowCount: 1247,
        lastUpdated: '2024-01-15T10:30:00Z',
        sampleData: [
          { user_id: 'abc123...def', created_at: '2024-01-15T10:30:00Z', is_valid: true },
          { user_id: 'xyz789...ghi', created_at: '2024-01-15T09:15:00Z', is_valid: false },
          { user_id: 'mno456...jkl', created_at: '2024-01-15T08:45:00Z', is_valid: true }
        ],
        schema: [
          { field: 'user_id', type: 'UUID', nullable: false, description: 'Maps session to user' },
          { field: 'created_at', type: 'TIMESTAMP', nullable: false, description: 'Token creation time' },
          { field: 'is_valid', type: 'BOOLEAN', nullable: false, description: 'Still active or revoked' },
          { field: 'token_hash', type: 'TEXT', nullable: false, description: 'Secure token hash' }
        ],
        anomalies: [
          { type: 'High Refresh Rate', severity: 'warning', count: 15, description: '250+ refreshes/hour per user' },
          { type: 'Expired Token Usage', severity: 'critical', count: 3, description: 'Attempts to use expired tokens' }
        ],
        security: {
          rlsEnabled: true,
          triggers: ['log_token_refresh', 'validate_token_expiry'],
          policies: ['Users can only see their own tokens']
        }
      },
      'login_failures': {
        status: 'active',
        rowCount: 89,
        lastUpdated: '2024-01-15T11:00:00Z',
        sampleData: [
          { user_id: 'abc123...def', ip_address: '192.168.1.1', timestamp: '2024-01-15T10:30:00Z' },
          { user_id: 'xyz789...ghi', ip_address: '192.168.1.2', timestamp: '2024-01-15T09:15:00Z' }
        ],
        schema: [
          { field: 'user_id', type: 'UUID', nullable: true, description: 'User who failed login' },
          { field: 'ip_address', type: 'INET', nullable: false, description: 'Source IP address' },
          { field: 'timestamp', type: 'TIMESTAMP', nullable: false, description: 'When failure occurred' }
        ],
        anomalies: [
          { type: 'Brute Force Pattern', severity: 'critical', count: 5, description: 'Repeated failures from same IP' }
        ],
        security: {
          rlsEnabled: false,
          triggers: ['alert_on_brute_force'],
          policies: []
        }
      }
    };
    
    return tableData[table] || {
      status: 'missing',
      rowCount: 0,
      lastUpdated: null,
      sampleData: [],
      schema: [],
      anomalies: [],
      security: { rlsEnabled: false, triggers: [], policies: [] }
    };
  };

  const data = getTableData(tableName);

  const handleExport = (format: 'csv' | 'json') => {
    // Mock export functionality
    const exportData = {
      table: tableName,
      schema: data.schema,
      sampleData: data.sampleData,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = format === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : convertToCSV(exportData);
    
    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tableName.replace('.', '_')}_export.${format}`;
    link.click();
  };

  const convertToCSV = (data: any) => {
    if (!data.sampleData.length) return '';
    const headers = Object.keys(data.sampleData[0]).join(',');
    const rows = data.sampleData.map((row: any) => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Inspect Table: {tableName}
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schema">Schema & Fields</TabsTrigger>
              <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
              <TabsTrigger value="security">Security Triggers</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {data.status === 'active' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="capitalize">{data.status}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Row Count</span>
                    </div>
                    <p className="text-xl font-semibold">{data.rowCount.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Last Updated</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Security</span>
                    </div>
                    <Badge variant={data.security.rlsEnabled ? "default" : "destructive"}>
                      {data.security.rlsEnabled ? 'RLS Enabled' : 'RLS Disabled'}
                    </Badge>
                  </div>
                </div>
                
                {data.sampleData.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Sample Data (First 3 rows)</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(data.sampleData[0]).map((key) => (
                              <th key={key} className="text-left p-3 font-medium">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.sampleData.map((row, index) => (
                            <tr key={index} className="border-t">
                              {Object.values(row).map((value, i) => (
                                <td key={i} className="p-3 font-mono text-xs">
                                  {typeof value === 'boolean' 
                                    ? <Badge variant={value ? "default" : "secondary"}>{String(value)}</Badge>
                                    : String(value)
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="schema" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Table Schema</h4>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 font-medium">Field Name</th>
                          <th className="text-left p-3 font-medium">Data Type</th>
                          <th className="text-left p-3 font-medium">Nullable</th>
                          <th className="text-left p-3 font-medium">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.schema.map((column, index) => (
                          <tr key={index} className="border-t">
                            <td className="p-3 font-mono font-medium">{column.field}</td>
                            <td className="p-3">
                              <Badge variant="outline">{column.type}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant={column.nullable ? "destructive" : "default"}>
                                {column.nullable ? 'Yes' : 'No'}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600">{column.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="anomalies" className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Detected Anomalies</h4>
                  {data.anomalies.length > 0 ? (
                    <div className="space-y-3">
                      {data.anomalies.map((anomaly, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${getSeverityColor(anomaly.severity)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="font-medium">{anomaly.type}</span>
                            </div>
                            <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                              {anomaly.count} occurrences
                            </Badge>
                          </div>
                          <p className="text-sm">{anomaly.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No anomalies detected</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium mb-3">Row Level Security (RLS)</h5>
                    <div className="flex items-center gap-2 mb-2">
                      {data.security.rlsEnabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span>{data.security.rlsEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    {!data.security.rlsEnabled && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 text-xs rounded">
                        ⚠️ Warning: Table data is publicly accessible
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium mb-3">Active Triggers</h5>
                    {data.security.triggers.length > 0 ? (
                      <div className="space-y-1">
                        {data.security.triggers.map((trigger, index) => (
                          <div key={index} className="text-sm font-mono bg-white p-2 rounded">
                            {trigger}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No triggers configured</p>
                    )}
                  </div>
                </div>
                
                {data.security.policies.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium mb-3">Security Policies</h5>
                    <div className="space-y-2">
                      {data.security.policies.map((policy, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded">
                          {policy}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="font-medium">Export Data</h5>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleExport('csv')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as CSV
                      </Button>
                      <Button
                        onClick={() => handleExport('json')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export as JSON
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h5 className="font-medium">Table Actions</h5>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          navigator.clipboard.writeText(`SELECT * FROM ${tableName} LIMIT 10;`);
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy SQL Query
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          window.open(`https://supabase.com/dashboard/project/rvwopaofedyieydwbghs/editor`, '_blank');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Open in Supabase
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableInspectorModal;