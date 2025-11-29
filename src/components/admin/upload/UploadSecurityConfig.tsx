import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UploadSecurityConfigProps {
  allowedExtensions: string;
  setAllowedExtensions: (value: string) => void;
  blockedExtensions: string;
  setBlockedExtensions: (value: string) => void;
  allowedMimeTypes: string;
  setAllowedMimeTypes: (value: string) => void;
  compressionLevel: string;
  setCompressionLevel: (value: string) => void;
  exifStrippingEnabled: boolean;
  setExifStrippingEnabled: (value: boolean) => void;
  aiThreatDetection: boolean;
  setAiThreatDetection: (value: boolean) => void;
}

const UploadSecurityConfig: React.FC<UploadSecurityConfigProps> = ({
  allowedExtensions,
  setAllowedExtensions,
  blockedExtensions,
  setBlockedExtensions,
  allowedMimeTypes,
  setAllowedMimeTypes,
  compressionLevel,
  setCompressionLevel,
  exifStrippingEnabled,
  setExifStrippingEnabled,
  aiThreatDetection,
  setAiThreatDetection
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Upload Security & File Limits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Warning */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Security:</strong> Only safe file types allowed. Dangerous files like PHP, JS, HTML are permanently blocked.
          </AlertDescription>
        </Alert>

        {/* Allowed Extensions */}
        <div className="space-y-2">
          <Label className="font-medium">Allowed Extensions (Safe Only)</Label>
          <Textarea
            value={allowedExtensions}
            onChange={(e) => setAllowedExtensions(e.target.value)}
            placeholder="jpg,jpeg,png,gif,webp,mp4,mov,mkv,webm,pdf,docx,xlsx,mp3,wav"
            className="min-h-[80px]"
          />
          <p className="text-sm text-gray-500">Only secure file types allowed. Images, videos, documents, and audio only.</p>
        </div>

        {/* Blocked Extensions */}
        <div className="space-y-2">
          <Label className="font-medium">Blocked Extensions (Security)</Label>
          <Textarea
            value={blockedExtensions}
            onChange={(e) => setBlockedExtensions(e.target.value)}
            placeholder="php,php5,html,htm,js,xml,xphp,sh,py,exe,bat,dll,jar"
            className="min-h-[80px] bg-red-50 border-red-200"
            disabled
          />
          <p className="text-sm text-red-600">These dangerous file types are automatically blocked for security.</p>
        </div>

        {/* Allowed MIME Types */}
        <div className="space-y-2">
          <Label className="font-medium">Allowed MIME Types</Label>
          <Textarea
            value={allowedMimeTypes}
            onChange={(e) => setAllowedMimeTypes(e.target.value)}
            placeholder="image/jpeg,image/png,video/mp4,audio/mpeg"
            className="min-h-[100px]"
          />
          <p className="text-sm text-gray-500">MIME types must match file extensions for security validation.</p>
        </div>

        {/* EXIF Data Stripping */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">EXIF Data Stripping</Label>
            <p className="text-sm text-gray-500">Automatically remove metadata from images to protect user privacy</p>
          </div>
          <Switch
            checked={exifStrippingEnabled}
            onCheckedChange={setExifStrippingEnabled}
          />
        </div>

        {/* AI Threat Detection */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">AI-Based Threat Detection</Label>
            <p className="text-sm text-gray-500">AI analysis for malware, inappropriate content, and security threats</p>
          </div>
          <Switch
            checked={aiThreatDetection}
            onCheckedChange={setAiThreatDetection}
          />
        </div>

        {/* Image Compression Level */}
        <div className="space-y-2">
          <Label className="font-medium">Image Compression Level</Label>
          <Select value={compressionLevel} onValueChange={setCompressionLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-low">Very Low (95% quality)</SelectItem>
              <SelectItem value="low">Low (85% quality)</SelectItem>
              <SelectItem value="medium">Medium (75% quality)</SelectItem>
              <SelectItem value="high">High (65% quality)</SelectItem>
              <SelectItem value="very-high">Very High (50% quality)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">Higher compression = smaller files but lower quality</p>
        </div>

        {/* Security Features */}
        <div className="space-y-2">
          <Label className="font-medium">Active Security Features</Label>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">UUID filename generation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Private storage with signed URLs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">MIME type validation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">File extension validation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Malware scanning protection</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSecurityConfig;