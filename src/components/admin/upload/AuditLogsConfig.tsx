import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, AlertTriangle } from 'lucide-react';

interface AuditLogsConfigProps {
  auditLogging: boolean;
  setAuditLogging: (value: boolean) => void;
  logRetention: string;
  setLogRetention: (value: string) => void;
  logDetail: string;
  setLogDetail: (value: string) => void;
  multiCdnRouting: boolean;
  setMultiCdnRouting: (value: boolean) => void;
  primaryCdn: string;
  setPrimaryCdn: (value: string) => void;
  fallbackCdn: string;
  setFallbackCdn: (value: string) => void;
}

const AuditLogsConfig: React.FC<AuditLogsConfigProps> = ({
  auditLogging,
  setAuditLogging,
  logRetention,
  setLogRetention,
  logDetail,
  setLogDetail,
  multiCdnRouting,
  setMultiCdnRouting,
  primaryCdn,
  setPrimaryCdn,
  fallbackCdn,
  setFallbackCdn
}) => {
  const mockLogs = [
    { id: 1, user: 'john.doe@email.com', file: 'profile_pic.jpg', type: 'image', size: '2.3 MB', status: 'success', time: '2 minutes ago' },
    { id: 2, user: 'jane.smith@email.com', file: 'presentation.mp4', type: 'video', size: '145 MB', status: 'processing', time: '5 minutes ago' },
    { id: 3, user: 'admin@shqipet.com', file: 'document.pdf', type: 'document', size: '1.2 MB', status: 'success', time: '8 minutes ago' },
    { id: 4, user: 'user123@email.com', file: 'suspicious.exe', type: 'blocked', size: '500 KB', status: 'blocked', time: '12 minutes ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Audit Logging Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Audit Logs & Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Audit Logging */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Upload Audit Logging</Label>
              <p className="text-sm text-gray-500">Track all upload attempts, successes, and failures for security and debugging</p>
            </div>
            <Switch
              checked={auditLogging}
              onCheckedChange={setAuditLogging}
            />
          </div>

          {/* Log Retention */}
          <div className="space-y-2">
            <Label className="font-medium">Log Retention Period</Label>
            <Select value={logRetention} onValueChange={setLogRetention}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
                <SelectItem value="180">6 Months</SelectItem>
                <SelectItem value="365">1 Year</SelectItem>
                <SelectItem value="730">2 Years</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">How long to keep upload logs for compliance and debugging</p>
          </div>

          {/* Log Detail Level */}
          <div className="space-y-2">
            <Label className="font-medium">Log Detail Level</Label>
            <Select value={logDetail} onValueChange={setLogDetail}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic (File name, size, status)</SelectItem>
                <SelectItem value="detailed">Detailed (+ User, IP, timestamp)</SelectItem>
                <SelectItem value="full">Full (+ MIME type, metadata, processing time)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">More detailed logs help with debugging but use more storage</p>
          </div>

          {/* Export Options */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Full Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multi-CDN Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🌐</span>
            Multi-CDN Auto-Routing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Multi-CDN */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Multi-CDN Routing</Label>
              <p className="text-sm text-gray-500">Automatically route users to the fastest CDN based on their location</p>
            </div>
            <Switch
              checked={multiCdnRouting}
              onCheckedChange={setMultiCdnRouting}
            />
          </div>

          {multiCdnRouting && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-medium">Primary CDN</Label>
                <Select value={primaryCdn} onValueChange={setPrimaryCdn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase CDN</SelectItem>
                    <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="aws">AWS CloudFront</SelectItem>
                    <SelectItem value="fastly">Fastly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-medium">Fallback CDN</Label>
                <Select value={fallbackCdn} onValueChange={setFallbackCdn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloudflare">Cloudflare</SelectItem>
                    <SelectItem value="aws">AWS CloudFront</SelectItem>
                    <SelectItem value="supabase">Supabase CDN</SelectItem>
                    <SelectItem value="fastly">Fastly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Upload Logs */}
      {auditLogging && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Upload Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{log.file}</span>
                      <span className="text-xs text-gray-500">{log.user}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">{log.size}</span>
                    <Badge 
                      variant={
                        log.status === 'success' ? 'default' : 
                        log.status === 'processing' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {log.status}
                    </Badge>
                    <span className="text-xs text-gray-500 min-w-fit">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditLogsConfig;