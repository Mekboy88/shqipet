import { useState, useEffect as React_useEffect } from 'react';
import * as React from 'react';
import { RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { DeviceCard } from './manage-sessions/DeviceCard';
import { MobileDeviceCard } from './manage-sessions/MobileDeviceCard';
import { DeviceDetailsModal } from './manage-sessions/DeviceDetailsModal';
import { useSmartBreakpoint } from '@/hooks/useRealDeviceDetection';
import type { Database } from '@/integrations/supabase/types';

type UserSession = Database['public']['Tables']['user_sessions']['Row'];

const ManageSessionsForm = () => {
  const {
    sessions,
    loading,
    error,
    currentDeviceId,
    revokeSession,
    trustDevice,
    refreshSessions,
    revokeAllOtherDevices,
  } = useSessionManagement();

  const { isMobile } = useSmartBreakpoint();
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debug current device detection
  React_useEffect(() => {
    console.log('🔍 Current Device Detection:', {
      currentDeviceId,
      localStorageId: localStorage.getItem('device_stable_id'),
      sessionsCount: sessions.length,
      sessions: sessions.map(s => ({
        id: s.device_stable_id,
        type: s.device_type,
        isCurrent: s.device_stable_id === currentDeviceId,
        isTrusted: s.is_trusted
      }))
    });
  }, [currentDeviceId, sessions]);

  const handleCardClick = (session: UserSession) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  // Sync selectedSession with updated sessions data
  React.useEffect(() => {
    if (selectedSession && sessions.length > 0) {
      const updatedSession = sessions.find(
        s => s.device_stable_id === selectedSession.device_stable_id
      );
      if (updatedSession) {
        setSelectedSession(updatedSession);
      }
    }
  }, [sessions, selectedSession]);

  const handleRefresh = async () => {
    await refreshSessions();
  };

  const handleLogoutAllOthers = async () => {
    await revokeAllOtherDevices();
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Error loading sessions</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button onClick={refreshSessions} variant="outline" className="mt-4">
            <RefreshCw size={16} className="mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-muted/50 rounded-lg p-12 text-center">
          <p className="text-lg font-medium mb-2">No active sessions</p>
          <p className="text-sm text-muted-foreground mb-4">
            Your device sessions will appear here once you log in.
          </p>
          <Button onClick={refreshSessions} variant="outline">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  // Sort sessions to always show current device first
  const sortedSessions = [...sessions].sort((a, b) => {
    const aIsCurrent = a.device_stable_id === currentDeviceId;
    const bIsCurrent = b.device_stable_id === currentDeviceId;
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Active Sessions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your devices and sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Device Cards - Grid on desktop, Stacked on mobile */}
      {isMobile ? (
        <div className="space-y-3">
          {sortedSessions.map((session) => (
            <MobileDeviceCard
              key={session.device_stable_id}
              session={session}
              isCurrentDevice={session.device_stable_id === currentDeviceId}
              onClick={() => handleCardClick(session)}
              onTrust={() => trustDevice(session.device_stable_id)}
              onRevoke={() => revokeSession(session.device_stable_id)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sortedSessions.map((session) => (
            <DeviceCard
              key={session.device_stable_id || session.id}
              session={session}
              isCurrentDevice={session.device_stable_id === currentDeviceId}
              onClick={() => handleCardClick(session)}
              onTrustDevice={() => trustDevice(session.device_stable_id)}
              onRevoke={() => revokeSession(session.device_stable_id)}
            />
          ))}
        </div>
      )}

      {/* Device Details Modal */}
      <DeviceDetailsModal
        session={selectedSession}
        isCurrentDevice={selectedSession?.device_stable_id === currentDeviceId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onTrustDevice={trustDevice}
        onRevokeSession={revokeSession}
      />
    </div>
  );
};

export default ManageSessionsForm;
