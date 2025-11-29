import { useState, useRef, TouchEvent } from 'react';
import { Circle, Shield, Trash2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StaticMiniMap } from './StaticMiniMap';
import type { Database } from '@/integrations/supabase/types';
import { formatDistanceToNow, differenceInMinutes, differenceInHours, differenceInDays, format } from 'date-fns';
import { formatLocationWithFlag } from '@/utils/countryFlags';
import { getDeviceIcon, deriveTitle, getDeviceLabel, getBrowserIcon } from '@/utils/deviceSessionDisplay';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

interface MobileDeviceCardProps {
  session: UserSession;
  isCurrentDevice: boolean;
  onClick: () => void;
  onTrust: () => void;
  onRevoke: () => void;
}

export const MobileDeviceCard = ({
  session,
  isCurrentDevice,
  onClick,
  onTrust,
  onRevoke,
}: MobileDeviceCardProps) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const DeviceIcon = getDeviceIcon(session.device_type);
  const BrowserIcon = getBrowserIcon(session.browser_name);
  const displayTitle = deriveTitle(session.browser_name, session.operating_system, session.device_type);
  const deviceLabel = getDeviceLabel(session.device_type);

  const getSessionStartTime = () => {
    if (!session.created_at) return 'Unknown';
    try {
      return format(new Date(session.created_at), 'MMM dd, hh:mm a');
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

  const locationText = formatLocationWithFlag(
    session.city,
    session.country,
    session.country_code
  );

  const handleTouchStart = (e: TouchEvent) => {
    if (isCurrentDevice) return;
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping || isCurrentDevice) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    
    if (diff < 0 && diff > -150) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    if (swipeOffset < -50) {
      setSwipeOffset(-140);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
    setSwipeOffset(0);
  };

  return (
    <div className="relative overflow-hidden">
      <Card
        ref={cardRef}
        className="relative transition-transform duration-200 cursor-pointer"
        style={{
          transform: `translateX(${swipeOffset}px)`,
        }}
        onClick={() => {
          if (swipeOffset === 0) {
            onClick();
          } else {
            setSwipeOffset(0);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DeviceIcon size={24} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold truncate">
                  {displayTitle}
                </h3>
                <Badge variant="outline" className="text-xs">{deviceLabel}</Badge>
                <Badge variant="secondary" className="text-xs">
                  {session.active_tabs_count ?? 0} {(session.active_tabs_count ?? 0) === 1 ? 'tab' : 'tabs'}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {isCurrentDevice && (
                  <Badge className="bg-blue-500 text-white text-xs">Current</Badge>
                )}
                {session.is_trusted ? (
                  <Badge className="bg-green-600 text-white text-xs">Trusted</Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">Not Trusted</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <BrowserIcon size={12} className="text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  {session.browser_name || 'Unknown'} {session.browser_version || ''}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <div className="flex items-center gap-1">
                    <Circle size={6} className="fill-green-500 text-green-500" />
                    <span>Active</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">Started</p>
                  <p className="truncate">{getSessionStartTime()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Clock size={10} />
                    Duration
                  </p>
                  <p className="truncate">{getSessionDuration()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p className="truncate">{getLastActiveTime()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Location</p>
                  <p className="truncate">{locationText}</p>
                </div>
              </div>

              {session.latitude && session.longitude && (
                <div className="mt-3">
                  <StaticMiniMap latitude={session.latitude} longitude={session.longitude} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {!isCurrentDevice && (
        <div
          className="absolute top-0 right-0 h-full flex items-center gap-2 pr-4"
          style={{
            transform: `translateX(${Math.min(0, 140 + swipeOffset)}px)`,
          }}
        >
          {session.is_trusted ? (
            <button
              onClick={() => handleActionClick(onRevoke)}
              className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg"
            >
              <Trash2 size={18} />
            </button>
          ) : (
            <button
              onClick={() => handleActionClick(onTrust)}
              className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg"
            >
              <Shield size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
