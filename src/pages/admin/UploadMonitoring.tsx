import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { FileUp, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface UploadLog {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  upload_status: string;
  progress: number;
  error_message?: string;
  started_at: string;
  completed_at?: string;
}

export default function UploadMonitoring() {
  const [uploads, setUploads] = useState<UploadLog[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    avgTime: 0
  });

  useEffect(() => {
    fetchUploads();
    const interval = setInterval(fetchUploads, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUploads = async () => {
    const { data, error } = await supabase
      .from('upload_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Failed to fetch upload logs:', error);
      return;
    }

    setUploads(data || []);
    calculateStats(data || []);
  };

  const calculateStats = (logs: UploadLog[]) => {
    const total = logs.length;
    const completed = logs.filter(l => l.upload_status === 'completed').length;
    const failed = logs.filter(l => l.upload_status === 'failed').length;
    const pending = logs.filter(l => l.upload_status === 'pending' || l.upload_status === 'uploading').length;

    const completedLogs = logs.filter(l => l.upload_status === 'completed' && l.started_at && l.completed_at);
    const avgTime = completedLogs.length > 0
      ? completedLogs.reduce((sum, log) => {
          const start = new Date(log.started_at).getTime();
          const end = new Date(log.completed_at!).getTime();
          return sum + (end - start);
        }, 0) / completedLogs.length / 1000
      : 0;

    setStats({ total, completed, failed, pending, avgTime });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'uploading':
        return <Badge variant="secondary"><FileUp className="w-3 h-3 mr-1" /> Uploading</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upload Monitoring</h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary" />
              {stats.avgTime.toFixed(1)}s
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {uploads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No uploads yet
              </div>
            ) : (
              uploads.map((upload) => (
                <div key={upload.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileUp className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium">{upload.file_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatBytes(upload.file_size)} • {upload.file_type}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(upload.upload_status)}
                  </div>

                  {upload.upload_status === 'uploading' && (
                    <Progress value={upload.progress} className="h-2" />
                  )}

                  {upload.error_message && (
                    <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-2 rounded">
                      {upload.error_message}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Started {formatDistanceToNow(new Date(upload.started_at), { addSuffix: true })}
                    {upload.completed_at && ` • Completed ${formatDistanceToNow(new Date(upload.completed_at), { addSuffix: true })}`}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
