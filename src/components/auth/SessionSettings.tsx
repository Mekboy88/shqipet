import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { sessionPersistenceService } from '@/services/sessionPersistence';
import { supabase } from '@/integrations/supabase/client';

const SessionSettings: React.FC = () => {
  const { session, user } = useAuth();
  const [autoLogoutPrevention, setAutoLogoutPrevention] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    if (session) {
      setSessionInfo({
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'Unknown',
        tokenType: session.token_type || 'bearer',
        refreshToken: session.refresh_token ? '***' + session.refresh_token.slice(-8) : 'None'
      });
    }
  }, [session]);

  const handleAutoLogoutToggle = (enabled: boolean) => {
    setAutoLogoutPrevention(enabled);
    if (enabled) {
      sessionPersistenceService.preventAutoLogout();
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Session refresh failed:', error);
      } else {
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Session refresh error:', error);
    }
  };

  if (!session || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Session Settings</CardTitle>
          <CardDescription>You need to be logged in to view session settings.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Session Management</CardTitle>
        <CardDescription>
          Control your authentication session settings and prevent automatic logouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-logout Prevention */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-base font-medium">Prevent Automatic Logout</div>
            <div className="text-sm text-muted-foreground">
              Keep your session active and prevent automatic logouts unless manually triggered.
            </div>
          </div>
          <Switch
            checked={autoLogoutPrevention}
            onCheckedChange={handleAutoLogoutToggle}
          />
        </div>

        {/* Session Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Current Session</h3>
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">User ID:</span>
              <Badge variant="outline">{user.id}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            {sessionInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Session Expires:</span>
                  <span className="text-sm">{sessionInfo.expiresAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Token Type:</span>
                  <Badge variant="secondary">{sessionInfo.tokenType}</Badge>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Session Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Session Actions</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={refreshSession}
              size="sm"
            >
              Refresh Session
            </Button>
          </div>
        </div>

        {/* Session Status */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Session Active - Auto-logout Prevention {autoLogoutPrevention ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Your session will persist across browser refreshes and maintain login state automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionSettings;