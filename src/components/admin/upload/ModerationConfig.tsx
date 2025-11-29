import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, AlertTriangle } from 'lucide-react';

interface ModerationConfigProps {
  manualModeration: boolean;
  setManualModeration: (value: boolean) => void;
  autoApproveImages: boolean;
  setAutoApproveImages: (value: boolean) => void;
  autoApproveVideos: boolean;
  setAutoApproveVideos: (value: boolean) => void;
  autoApproveAudio: boolean;
  setAutoApproveAudio: (value: boolean) => void;
  thumbnailGeneration: boolean;
  setThumbnailGeneration: (value: boolean) => void;
  thumbnailCount: string;
  setThumbnailCount: (value: string) => void;
  versioningEnabled: boolean;
  setVersioningEnabled: (value: boolean) => void;
  maxVersions: string;
  setMaxVersions: (value: string) => void;
  // New enhancement props
  imageResolutionLimit: boolean;
  setImageResolutionLimit: (value: boolean) => void;
  maxImageResolution: string;
  setMaxImageResolution: (value: string) => void;
  userBasedAutoApprove: boolean;
  setUserBasedAutoApprove: (value: boolean) => void;
  autoApproveVerified: boolean;
  setAutoApproveVerified: (value: boolean) => void;
  autoApprovePremium: boolean;
  setAutoApprovePremium: (value: boolean) => void;
  premiumMaxVersions: string;
  setPremiumMaxVersions: (value: string) => void;
}

const ModerationConfig: React.FC<ModerationConfigProps> = ({
  manualModeration,
  setManualModeration,
  autoApproveImages,
  setAutoApproveImages,
  autoApproveVideos,
  setAutoApproveVideos,
  autoApproveAudio,
  setAutoApproveAudio,
  thumbnailGeneration,
  setThumbnailGeneration,
  thumbnailCount,
  setThumbnailCount,
  versioningEnabled,
  setVersioningEnabled,
  maxVersions,
  setMaxVersions,
  // New enhancement props
  imageResolutionLimit,
  setImageResolutionLimit,
  maxImageResolution,
  setMaxImageResolution,
  userBasedAutoApprove,
  setUserBasedAutoApprove,
  autoApproveVerified,
  setAutoApproveVerified,
  autoApprovePremium,
  setAutoApprovePremium,
  premiumMaxVersions,
  setPremiumMaxVersions
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Content Moderation & Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manual Moderation */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label className="font-medium">Manual Moderation Queue</Label>
            <p className="text-sm text-gray-500">Require admin approval before uploaded content is published</p>
          </div>
          <Switch
            checked={manualModeration}
            onCheckedChange={setManualModeration}
          />
        </div>

        {/* Auto-Approval Settings */}
        <div className="space-y-4">
          <Label className="font-medium">Auto-Approval by File Type</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">Images (JPG, PNG, GIF, WebP)</span>
                <Badge variant={autoApproveImages ? "default" : "secondary"}>
                  {autoApproveImages ? "Auto-Approve" : "Manual Review"}
                </Badge>
              </div>
              <Switch
                checked={autoApproveImages}
                onCheckedChange={setAutoApproveImages}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">Videos (MP4, MOV, WebM, MKV)</span>
                <Badge variant={autoApproveVideos ? "default" : "secondary"}>
                  {autoApproveVideos ? "Auto-Approve" : "Manual Review"}
                </Badge>
              </div>
              <Switch
                checked={autoApproveVideos}
                onCheckedChange={setAutoApproveVideos}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">Audio Files (MP3, WAV)</span>
                <Badge variant={autoApproveAudio ? "default" : "secondary"}>
                  {autoApproveAudio ? "Auto-Approve" : "Manual Review"}
                </Badge>
              </div>
              <Switch
                checked={autoApproveAudio}
                onCheckedChange={setAutoApproveAudio}
              />
            </div>
          </div>
        </div>

        {/* Thumbnail Generation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Video Thumbnail Generation</Label>
              <p className="text-sm text-gray-500">Auto-generate thumbnails from video frames using FFMPEG</p>
            </div>
            <Switch
              checked={thumbnailGeneration}
              onCheckedChange={setThumbnailGeneration}
            />
          </div>

          {thumbnailGeneration && (
            <div className="space-y-2">
              <Label className="font-medium">Thumbnail Options</Label>
              <Select value={thumbnailCount} onValueChange={setThumbnailCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Thumbnail (middle frame)</SelectItem>
                  <SelectItem value="3">3 Thumbnails (user choice) ✅ RECOMMENDED</SelectItem>
                  <SelectItem value="5">5 Thumbnails (user choice)</SelectItem>
                  <SelectItem value="auto">Auto-detect best frame</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">3 preview frames provide optimal user choice without excessive processing</p>
            </div>
          )}
        </div>

        {/* File Versioning */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">File Versioning</Label>
              <p className="text-sm text-gray-500">Keep previous versions when files are updated or replaced</p>
            </div>
            <Switch
              checked={versioningEnabled}
              onCheckedChange={setVersioningEnabled}
            />
          </div>

          {versioningEnabled && (
            <div className="space-y-2">
              <Label className="font-medium">Maximum Versions to Keep</Label>
              <Select value={maxVersions} onValueChange={setMaxVersions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Versions (Free Users)</SelectItem>
                  <SelectItem value="5">5 Versions (Standard)</SelectItem>
                  <SelectItem value="10">10 Versions (Premium/Admin) ✅</SelectItem>
                  <SelectItem value="-1">Unlimited (Admin Only)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Older versions beyond this limit will be automatically deleted</p>
            </div>
          )}
        </div>

        {/* Image Resolution Limit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">Image Resolution Limit</Label>
              <p className="text-sm text-gray-500">Prevent extremely large images that consume excessive storage</p>
            </div>
            <Switch
              checked={imageResolutionLimit}
              onCheckedChange={setImageResolutionLimit}
            />
          </div>

          {imageResolutionLimit && (
            <div className="space-y-2">
              <Label className="font-medium">Maximum Image Resolution</Label>
              <Select value={maxImageResolution} onValueChange={setMaxImageResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                  <SelectItem value="2000x2000">2000x2000 (2K Square) ✅ RECOMMENDED</SelectItem>
                  <SelectItem value="2560x1440">2560x1440 (2K Wide)</SelectItem>
                  <SelectItem value="4096x4096">4096x4096 (4K Square)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">Images larger than this will be automatically resized</p>
            </div>
          )}
        </div>

        {/* User-Based Auto-Approval */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label className="font-medium">User-Based Auto-Approval</Label>
              <p className="text-sm text-gray-500">Skip moderation for trusted user types</p>
            </div>
            <Switch
              checked={userBasedAutoApprove}
              onCheckedChange={setUserBasedAutoApprove}
            />
          </div>

          {userBasedAutoApprove && (
            <div className="space-y-3">
              <Label className="font-medium">Auto-Approve Rules by User Type</Label>
              
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Verified Users</span>
                  <Badge variant={autoApproveVerified ? "default" : "secondary"}>
                    {autoApproveVerified ? "Auto-Approve" : "Manual Review"}
                  </Badge>
                </div>
                <Switch
                  checked={autoApproveVerified}
                  onCheckedChange={setAutoApproveVerified}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Premium/Paid Users</span>
                  <Badge variant={autoApprovePremium ? "default" : "secondary"}>
                    {autoApprovePremium ? "Auto-Approve" : "Manual Review"}
                  </Badge>
                </div>
                <Switch
                  checked={autoApprovePremium}
                  onCheckedChange={setAutoApprovePremium}
                />
              </div>
            </div>
          )}
        </div>

        {/* Premium Version History */}
        {versioningEnabled && (
          <div className="space-y-2">
            <Label className="font-medium">Premium/Admin Version Limit</Label>
            <Select value={premiumMaxVersions} onValueChange={setPremiumMaxVersions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Versions</SelectItem>
                <SelectItem value="10">10 Versions ✅ RECOMMENDED</SelectItem>
                <SelectItem value="15">15 Versions</SelectItem>
                <SelectItem value="-1">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">Enhanced version history for premium and admin users</p>
          </div>
        )}

        {/* Moderation Queue Status */}
        <div className="space-y-2">
          <Label className="font-medium">Current Moderation Queue</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
              <div className="text-sm font-medium text-yellow-800">Pending</div>
              <div className="text-lg font-bold text-yellow-900">47</div>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
              <span className="text-green-600 text-lg">✓</span>
              <div className="text-sm font-medium text-green-800">Approved</div>
              <div className="text-lg font-bold text-green-900">1,234</div>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded text-center">
              <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-red-600" />
              <div className="text-sm font-medium text-red-800">Rejected</div>
              <div className="text-lg font-bold text-red-900">89</div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center">
              <span className="text-blue-600 text-lg">⚡</span>
              <div className="text-sm font-medium text-blue-800">Processing</div>
              <div className="text-lg font-bold text-blue-900">12</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModerationConfig;