import { Monitor, Smartphone, Tablet, Laptop, MapPin, Clock, Shield, X, Globe, Chrome, AlertTriangle, HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { PrivacyCompliantMap } from './PrivacyCompliantMap';
import type { Database } from '@/integrations/supabase/types';
import { formatDistanceToNow, format, differenceInMinutes, differenceInHours, differenceInDays } from 'date-fns';
import { formatLocationWithFlag } from '@/utils/countryFlags';
import { getBrowserIcon } from '@/utils/deviceSessionDisplay';
import { useState, useEffect } from 'react';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

interface DeviceDetailsModalProps {
  session: UserSession | null;
  isCurrentDevice: boolean;
  isOpen: boolean;
  onClose: () => void;
  onTrustDevice: (deviceStableId: string) => void;
  onRevokeSession: (deviceStableId: string) => void;
}

export const DeviceDetailsModal = ({
  session,
  isCurrentDevice,
  isOpen,
  onClose,
  onTrustDevice,
  onRevokeSession,
}: DeviceDetailsModalProps) => {
  if (!session) return null;

  // Local state for instant UI feedback
  const [localIsTrusted, setLocalIsTrusted] = useState(session.is_trusted);

  // Sync local state when session prop changes
  useEffect(() => {
    setLocalIsTrusted(session.is_trusted);
  }, [session.is_trusted]);

  const handleTrustToggle = () => {
    // Update local state immediately for instant feedback
    setLocalIsTrusted(prev => !prev);
    // Trigger the actual save
    onTrustDevice(session.device_stable_id);
  };

  const getDeviceIcon = () => {
    switch (session.device_type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      case 'laptop':
        return Laptop;
      default:
        return Monitor;
    }
  };

  const DeviceIcon = getDeviceIcon();
  const BrowserIcon = getBrowserIcon(session.browser_name);

  const getSessionStartTime = () => {
    if (!session.created_at) return 'Unknown';
    try {
      return format(new Date(session.created_at), 'MMM dd, yyyy hh:mm a');
    } catch (e) {
      return 'Unknown';
    }
  };

  const getSessionDuration = () => {
    if (!session.created_at) return 'Unknown';
    try {
      const now = new Date();
      const start = new Date(session.created_at);
      const days = differenceInDays(now, start);
      const hours = differenceInHours(now, start);
      const minutes = differenceInMinutes(now, start);

      if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } catch (e) {
      return 'Unknown';
    }
  };

  const getLastActiveTime = () => {
    if (!session.updated_at) return 'Unknown';
    try {
      return formatDistanceToNow(new Date(session.updated_at), { addSuffix: true });
    } catch (e) {
      return 'Unknown';
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Unknown';
    try {
      return format(new Date(date), 'PPp');
    } catch (e) {
      return 'Unknown';
    }
  };

  const locationText = formatLocationWithFlag(
    session.city,
    session.country,
    session.country_code
  );

  const deviceTitle = `${session.browser_name || 'Unknown Browser'} on ${session.operating_system || 'Unknown OS'}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-none h-[88vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="p-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DeviceIcon size={20} className="text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base flex items-center gap-2">
                  <BrowserIcon size={16} className="text-muted-foreground" />
                  {deviceTitle}
                </DialogTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isCurrentDevice && (
                    <Badge className="bg-blue-500 text-white text-xs">Current Device</Badge>
                  )}
                  {session.is_trusted ? (
                    <Badge className="bg-green-600 text-white text-xs">Trusted</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Not Trusted</Badge>
                  )}
                  <Badge variant="default" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={18} />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden gap-2">
          <div className="flex-1 px-3 py-3 overflow-y-auto space-y-3">
            <div className="space-y-1.5">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <Monitor size={16} />
                Device Information
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Type:</span>
                  <span>{session.device_type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Operating System:</span>
                  <span>{session.operating_system || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Browser:</span>
                  <span>{session.browser_name || 'Unknown'} {session.browser_version || ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Tabs:</span>
                  <span className="font-medium">{session.active_tabs_count ?? 0} {(session.active_tabs_count ?? 0) === 1 ? 'tab' : 'tabs'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Device Category:</span>
                  <span className="capitalize">{session.device_type || 'Unknown'}</span>
                </div>
              </div>
            </div>

            {(session.city || session.country) && (
              <div className="space-y-1.5">
                <h4 className="font-semibold text-sm flex items-center gap-1.5">
                  <MapPin size={16} />
                  Location Information
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{locationText}</span>
                  </div>
                  {session.region && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span>{session.region}</span>
                    </div>
                  )}
                  {session.latitude && session.longitude && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coordinates:</span>
                      <span className="text-sm font-mono">
                        {session.latitude.toFixed(4)}, {session.longitude.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <Clock size={16} />
                Session Information
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Started:</span>
                  <span>{getSessionStartTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Duration:</span>
                  <span>{getSessionDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span>{getLastActiveTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(session.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-semibold text-sm flex items-center gap-1.5">
                <Shield size={16} />
                Security Information
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trusted Device:</span>
                  <div className="flex items-center gap-2">
                    <span>{localIsTrusted ? 'Yes' : 'No'}</span>
                    {!isCurrentDevice && (
                      <Switch 
                        checked={localIsTrusted}
                        onCheckedChange={handleTrustToggle}
                        className="scale-75"
                      />
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Device:</span>
                  <span>{isCurrentDevice ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="text-sm font-mono truncate max-w-[150px]">
                    ...{session.session_id.slice(-12)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Country Code:</span>
                  <span className="uppercase">{session.country_code || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {session.latitude && session.longitude && (
            <div className="flex-1 border-l">
              <PrivacyCompliantMap
                latitude={session.latitude} 
                longitude={session.longitude}
                city={session.city}
                country={session.country}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-start gap-2 mb-3 text-xs text-muted-foreground">
            <HelpCircle size={14} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Why am I seeing this?</p>
              <p className="text-xs">
                We show your active sessions for security. Location is approximate (city-level only) and coordinates are rounded for privacy. 
                Maps are blurred and non-interactive to comply with GDPR, CCPA, and international privacy laws.
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end flex-wrap">
            {!isCurrentDevice && (
              <>
                <Button 
                  onClick={() => {
                    // Report unknown device
                    alert('This device has been reported. Our security team will review this activity.');
                  }} 
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <AlertTriangle size={14} className="mr-1" />
                  Report Unknown Device
                </Button>
                <Button 
                  onClick={() => {
                    onRevokeSession(session.device_stable_id);
                    onClose();
                  }} 
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                >
                  Log Out This Device
                </Button>
              </>
            )}
            <Button onClick={onClose} variant="secondary" size="sm" className="text-xs">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
