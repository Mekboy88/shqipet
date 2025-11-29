// DO NOT EDIT — Location & Preferences core. Breaking this may disable real-time location and user privacy controls.

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Target } from 'lucide-react';
import { toast } from 'sonner';
import { MapComponent } from './MapComponent';
import { LocationControls } from './LocationControls';
import { ManualLocationInput } from './ManualLocationInput';
import { useLocationManager } from '@/lib/location/useLocationManager';

export const LiveLocationCard: React.FC = () => {
  const {
    currentLocation,
    isSharing,
    shareLevel,
    accuracy,
    method,
    lastUpdated,
    startSharing,
    stopSharing,
    updateOnce,
    setShareLevel,
    setManualLocation,
    permissionState
  } = useLocationManager();

  const [consent, setConsent] = useState(false);

  const handleStartSharing = useCallback(async () => {
    if (!consent) {
      toast.error('Please agree to share your location first');
      return;
    }
    await startSharing();
  }, [consent, startSharing]);

  const handleUpdateOnce = useCallback(async () => {
    if (!consent) {
      toast.error('Please agree to share your location first');
      return;
    }
    await updateOnce();
  }, [consent, updateOnce]);

  const formatLastUpdated = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60)),
      'minute'
    );
  };

  return (
    <Card id="live-location" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Live Location
        </CardTitle>
        <CardDescription>
          Share your real-time location with friends or keep it private
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Map Component */}
        <div className="h-64 w-full rounded-lg overflow-hidden border">
          <MapComponent
            location={currentLocation}
            accuracy={accuracy}
            isSharing={isSharing}
          />
        </div>

        {/* Location Readouts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Last Updated</div>
              <div className="text-muted-foreground">{formatLastUpdated(lastUpdated)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Accuracy</div>
              <div className="text-muted-foreground">
                {accuracy ? `±${accuracy}m` : 'Unknown'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Method</div>
              <div className="text-muted-foreground capitalize">{method || 'None'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">Status</div>
              <div className="text-muted-foreground">
                {isSharing ? 'Sharing' : 'Stopped'}
              </div>
            </div>
          </div>
        </div>

        {/* Location Controls */}
        <LocationControls
          isSharing={isSharing}
          shareLevel={shareLevel}
          permissionState={permissionState}
          onStartSharing={handleStartSharing}
          onStopSharing={stopSharing}
          onUpdateOnce={handleUpdateOnce}
          onShareLevelChange={setShareLevel}
          consent={consent}
          onConsentChange={setConsent}
        />

        {/* Manual Location Input */}
        <ManualLocationInput onLocationSet={setManualLocation} />

        {/* Privacy Notice */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <strong>Privacy Notice:</strong> Your location data is encrypted and stored securely. 
          You can change sharing settings or delete your location data at any time. 
          Location sharing requires your explicit consent and can be stopped instantly.
        </div>
      </CardContent>
    </Card>
  );
};