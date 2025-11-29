import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { TestTube, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface DataSourcesSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const DataSourcesSection: React.FC<DataSourcesSectionProps> = ({
  settings,
  updateSettings
}) => {
  const dataSources = [
    { id: 'users', label: 'Users', description: 'User accounts and profiles', defaultSource: 'profiles', defaultQuery: 'SELECT COUNT(*) FROM profiles' },
    { id: 'online', label: 'Online Users', description: 'Currently active users', defaultSource: 'presence', defaultQuery: 'online_users' },
    { id: 'posts', label: 'Posts', description: 'Content posts and articles', defaultSource: 'posts', defaultQuery: 'SELECT COUNT(*) FROM posts WHERE deleted_at IS NULL' },
    { id: 'comments', label: 'Comments', description: 'User comments and discussions', defaultSource: 'comments', defaultQuery: 'SELECT COUNT(*) FROM comments' },
    { id: 'groups', label: 'Groups', description: 'Community groups', defaultSource: 'groups', defaultQuery: 'SELECT COUNT(*) FROM groups' },
    { id: 'messages', label: 'Messages', description: 'Direct messages', defaultSource: 'messages', defaultQuery: 'SELECT COUNT(*) FROM messages' },
    { id: 'revenue', label: 'Revenue', description: 'Financial metrics', defaultSource: 'billing_invoices', defaultQuery: 'SELECT SUM(amount_cents) FROM billing_invoices' },
    { id: 'health', label: 'Platform Health', description: 'System health metrics', defaultSource: 'edge_function', defaultQuery: 'health-check' },
  ];

  const sourceTypes = [
    { value: 'table', label: 'Database Table' },
    { value: 'presence', label: 'Realtime Presence' },
    { value: 'edge_function', label: 'Edge Function' },
    { value: 'webhook', label: 'External Webhook' },
  ];

  const testConnection = async (sourceId: string) => {
    // Mock connection test
    console.log(`Testing connection for ${sourceId}`);
    // In real implementation, this would test the actual data source
  };

  const getSourceConfig = (sourceId: string) => {
    return settings?.datasources?.[sourceId] || {
      type: 'table',
      source: '',
      query: '',
      filters: {},
      enabled: true
    };
  };

  const updateSourceConfig = (sourceId: string, config: any) => {
    updateSettings({
      datasources: {
        ...settings?.datasources,
        [sourceId]: {
          ...getSourceConfig(sourceId),
          ...config
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Source Configuration</CardTitle>
          <CardDescription>Configure how each dashboard card fetches its data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dataSources.map(source => {
            const config = getSourceConfig(source.id);
            return (
              <div key={source.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{source.label}</h4>
                    <p className="text-sm text-muted-foreground">{source.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={config.enabled ? 'default' : 'secondary'}>
                      {config.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(enabled) => updateSourceConfig(source.id, { enabled })}
                    />
                  </div>
                </div>

                {config.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label className="text-sm">Source Type</Label>
                      <Select
                        value={config.type || 'table'}
                        onValueChange={(type) => updateSourceConfig(source.id, { type })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Source/Endpoint</Label>
                      <Input
                        placeholder={source.defaultSource}
                        value={config.source || ''}
                        onChange={(e) => updateSourceConfig(source.id, { source: e.target.value })}
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label className="text-sm">Query/Channel</Label>
                      <Input
                        placeholder={source.defaultQuery}
                        value={config.query || ''}
                        onChange={(e) => updateSourceConfig(source.id, { query: e.target.value })}
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Test this data source configuration
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testConnection(source.id)}
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fallback Strategy</CardTitle>
          <CardDescription>Configure how data sources behave when primary connections fail</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fallback Mode</Label>
              <Select
                value={settings?.datasources?.fallback?.mode || 'polling'}
                onValueChange={(mode) => updateSettings({
                  datasources: {
                    ...settings?.datasources,
                    fallback: {
                      ...settings?.datasources?.fallback,
                      mode
                    }
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="polling">Switch to Polling</SelectItem>
                  <SelectItem value="cache">Use Cached Data</SelectItem>
                  <SelectItem value="offline">Show Offline State</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Poll Interval (ms)</Label>
              <Input
                type="number"
                value={settings?.datasources?.fallback?.pollInterval || 60000}
                onChange={(e) => updateSettings({
                  datasources: {
                    ...settings?.datasources,
                    fallback: {
                      ...settings?.datasources?.fallback,
                      pollInterval: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Connection Status</h4>
            <div className="space-y-2">
              {dataSources.slice(0, 4).map(source => (
                <div key={source.id} className="flex items-center justify-between text-sm">
                  <span>{source.label}</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Connected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcesSection;