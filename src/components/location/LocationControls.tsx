import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Square, RefreshCw, Users, Lock, Globe } from 'lucide-react';

interface LocationControlsProps {
  isSharing: boolean;
  shareLevel: 'private' | 'friends' | 'public';
  permissionState: string;
  onStartSharing: () => void;
  onStopSharing: () => void;
  onUpdateOnce: () => void;
  onShareLevelChange: (level: 'private' | 'friends' | 'public') => void;
  consent: boolean;
  onConsentChange: (consent: boolean) => void;
}

export const LocationControls: React.FC<LocationControlsProps> = ({
  isSharing,
  shareLevel,
  permissionState,
  onStartSharing,
  onStopSharing,
  onUpdateOnce,
  onShareLevelChange,
  consent,
  onConsentChange
}) => {
  const isPermissionDenied = permissionState === 'denied';
  const isPermissionUnsupported = permissionState === 'unsupported';

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={isSharing ? onStopSharing : onStartSharing}
          disabled={isPermissionDenied || isPermissionUnsupported}
          variant={isSharing ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {isSharing ? (
            <>
              <Square className="h-4 w-4" />
              Stop Sharing
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Share Live Location
            </>
          )}
        </Button>

        <Button
          onClick={onUpdateOnce}
          disabled={isPermissionDenied || isPermissionUnsupported}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Update Once
        </Button>
      </div>

      {/* Permission States */}
      {isPermissionDenied && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
          <strong>Location access denied.</strong> Please enable location permissions in your browser 
          settings and refresh the page, or use manual location entry below.
        </div>
      )}

      {isPermissionUnsupported && (
        <div className="p-3 bg-muted border rounded-lg text-sm">
          <strong>Geolocation not supported.</strong> Use manual location entry below to set your location.
        </div>
      )}

      {/* Share Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Share with:</Label>
        <RadioGroup
          value={shareLevel}
          onValueChange={(value) => onShareLevelChange(value as 'private' | 'friends' | 'public')}
          className="grid grid-cols-3 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private" className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4" />
              Only me
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="friends" id="friends" />
            <Label htmlFor="friends" className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Friends
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public" className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              Public
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Consent */}
      <div className="flex items-start space-x-2">
        <Checkbox
          id="consent"
          checked={consent}
          onCheckedChange={(checked) => onConsentChange(!!checked)}
        />
        <Label htmlFor="consent" className="text-sm leading-relaxed">
          I agree to share my location as described above. I understand I can change 
          these settings or stop sharing at any time.
        </Label>
      </div>
    </div>
  );
};