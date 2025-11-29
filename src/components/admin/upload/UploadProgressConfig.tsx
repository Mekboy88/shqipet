import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, Wifi, Zap } from 'lucide-react';

interface UploadProgressConfigProps {
  progressBarEnabled: boolean;
  setProgressBarEnabled: (value: boolean) => void;
  chunkSizeMode: string;
  setChunkSizeMode: (value: string) => void;
  resumableUploads: boolean;
  setResumableUploads: (value: boolean) => void;
  parallelUploads: boolean;
  setParallelUploads: (value: boolean) => void;
  uploadNotifications: boolean;
  setUploadNotifications: (value: boolean) => void;
}

const UploadProgressConfig: React.FC<UploadProgressConfigProps> = ({
  progressBarEnabled,
  setProgressBarEnabled,
  chunkSizeMode,
  setChunkSizeMode,
  resumableUploads,
  setResumableUploads,
  parallelUploads,
  setParallelUploads,
  uploadNotifications,
  setUploadNotifications
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Experience & Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Upload Progress Indicators</Label>
            <p className="text-sm text-gray-500">Show progress bars, time remaining, and upload status</p>
          </div>
          <Switch
            checked={progressBarEnabled}
            onCheckedChange={setProgressBarEnabled}
          />
        </div>

        {/* Upload Demo */}
        {progressBarEnabled && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <Label className="text-sm font-medium">Preview: Upload Progress</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>vacation_video_4k.mp4</span>
                <span>67% • 2m 15s remaining</span>
              </div>
              <Progress value={67} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500">
                <span>342 MB / 512 MB</span>
                <span>5.2 MB/s</span>
              </div>
            </div>
          </div>
        )}

        {/* Chunk Size Mode */}
        <div className="space-y-2">
          <Label className="font-medium">Upload Chunk Size Strategy</Label>
          <Select value={chunkSizeMode} onValueChange={setChunkSizeMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adaptive">Adaptive (Auto-adjust based on connection)</SelectItem>
              <SelectItem value="small">Small Chunks (1MB) - Better for slow connections</SelectItem>
              <SelectItem value="medium">Medium Chunks (5MB) - Balanced performance</SelectItem>
              <SelectItem value="large">Large Chunks (10MB) - Fast connections only</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">Smaller chunks work better for unreliable connections</p>
        </div>

        {/* Resumable Uploads */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-blue-600" />
            <div>
              <Label className="font-medium">Resumable Uploads</Label>
              <p className="text-sm text-gray-500">Allow uploads to resume after network interruptions</p>
            </div>
          </div>
          <Switch
            checked={resumableUploads}
            onCheckedChange={setResumableUploads}
          />
        </div>

        {/* Parallel Uploads */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-green-600" />
            <div>
              <Label className="font-medium">Parallel Multi-File Uploads</Label>
              <p className="text-sm text-gray-500">Upload multiple files simultaneously for faster throughput</p>
            </div>
          </div>
          <Switch
            checked={parallelUploads}
            onCheckedChange={setParallelUploads}
          />
        </div>

        {/* Upload Notifications */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Toast Notifications</Label>
            <p className="text-sm text-gray-500">Show success/failure notifications during uploads</p>
          </div>
          <Switch
            checked={uploadNotifications}
            onCheckedChange={setUploadNotifications}
          />
        </div>

        {/* Performance Stats */}
        <div className="space-y-2">
          <Label className="font-medium">Upload Performance Metrics</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center">
              <div className="text-sm font-medium text-blue-800">Avg Speed</div>
              <div className="text-lg font-bold text-blue-900">8.4 MB/s</div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
              <div className="text-sm font-medium text-green-800">Success Rate</div>
              <div className="text-lg font-bold text-green-900">99.2%</div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded text-center">
              <div className="text-sm font-medium text-purple-800">Resumptions</div>
              <div className="text-lg font-bold text-purple-900">1.8%</div>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded text-center">
              <div className="text-sm font-medium text-orange-800">Failed</div>
              <div className="text-lg font-bold text-orange-900">0.8%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadProgressConfig;