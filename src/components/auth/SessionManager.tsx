import React, { useState, useEffect } from 'react';
import { useSessionTracking, useUserSessions } from '@/hooks/useSessionTracking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  MapPin, 
  Clock, 
  Shield,
  Activity,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SessionInfo {
  id: string;
  device_name?: string;
  device_type?: string;
  ip_address?: string;
  location?: string;
  browser_info?: string;
  operating_system?: string;
  last_activity: string;
  created_at: string;
  is_active: boolean;
  is_trusted: boolean;
}

export const SessionManager: React.FC = () => {
  const { isTracking, updateActivity, sessionId } = useSessionTracking();
  const { getActiveSessions, endSession, cleanupExpired } = useUserSessions();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const activeSessions = await getActiveSessions();
      setSessions(activeSessions as unknown as SessionInfo[]);
    } catch (error) {
      console.error('Failed to load sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load active sessions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndSession = async (sessionId: string) => {
    try {
      const success = await endSession(sessionId);
      if (success) {
        toast({
          title: "Success",
          description: "Session ended successfully"
        });
        await loadSessions(); // Reload sessions
      } else {
        throw new Error('Failed to end session');
      }
    } catch (error) {
      console.error('Failed to end session:', error);
      toast({
        title: "Error",
        description: "Failed to end session",
        variant: "destructive"
      });
    }
  };
  
  const handleCleanupExpired = async () => {
    try {
      const success = await cleanupExpired();
      if (success) {
        toast({
          title: "Success", 
          description: "Expired sessions cleaned up"
        });
        await loadSessions();
      } else {
        throw new Error('Failed to cleanup sessions');
      }
    } catch (error) {
      console.error('Failed to cleanup sessions:', error);
      toast({
        title: "Error",
        description: "Failed to cleanup expired sessions",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateActivity = async () => {
    try {
      await updateActivity();
      toast({
        title: "Success",
        description: "Activity updated"
      });
      await loadSessions();
    } catch (error) {
      console.error('Failed to update activity:', error);
      toast({
        title: "Error", 
        description: "Failed to update activity",
        variant: "destructive"
      });
    }
  };
  
  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };
  
  const formatLastActivity = (timestamp: string) => {
    const now = new Date();
    const lastActivity = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };
  
  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, []);
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Session Manager
            </CardTitle>
            <CardDescription>
              Manage your active sessions and device security
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
            </Badge>
            {sessionId && (
              <Badge variant="outline" className="font-mono text-xs">
                ID: {sessionId.substring(0, 8)}...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleUpdateActivity}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Update Activity
          </Button>
          
          <Button 
            onClick={loadSessions}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Sessions
          </Button>
          
          <Button 
            onClick={handleCleanupExpired}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Cleanup Expired
          </Button>
        </div>
        
        <Separator />
        
        {/* Current Session Status */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Current Session Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tracking: </span>
              <span className={isTracking ? 'text-green-600 font-medium' : 'text-red-600'}>
                {isTracking ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Session ID: </span>
              <span className="font-mono">
                {sessionId ? `${sessionId.substring(0, 8)}...` : 'None'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Total Sessions: </span>
              <span className="font-medium">{sessions.length}</span>
            </div>
          </div>
        </div>
        
        {/* Active Sessions List */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Active Sessions ({sessions.length})
          </h3>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground py-8">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div 
                  key={session.id}
                  className={`border rounded-lg p-4 ${session.id === sessionId ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getDeviceIcon(session.device_type)}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {session.device_name || 'Unknown Device'}
                          </span>
                          {session.id === sessionId && (
                            <Badge variant="default">Current</Badge>
                          )}
                          {session.is_trusted && (
                            <Badge variant="secondary">Trusted</Badge>
                          )}
                        </div>
                        
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              {session.browser_info} on {session.operating_system}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatLastActivity(session.last_activity)}
                            </span>
                          </div>
                          
                          {session.ip_address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.ip_address}
                              {session.location && ` • ${session.location}`}
                            </div>
                          )}
                          
                          <div className="font-mono text-xs">
                            Created: {new Date(session.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {session.id !== sessionId && (
                      <Button
                        onClick={() => handleEndSession(session.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-3 w-3" />
                        End Session
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Session Information */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h4 className="font-medium mb-2">About Session Tracking</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Sessions are automatically tracked when you sign in</p>
            <p>• Activity is updated every 5 minutes and on user interactions</p>
            <p>• Sessions expire after 30 days of inactivity</p>
            <p>• You can end sessions from other devices for security</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionManager;