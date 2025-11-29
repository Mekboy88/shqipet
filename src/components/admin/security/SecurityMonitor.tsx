import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Eye, RefreshCw } from "lucide-react";
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';
import { validateAdminAction } from '@/hooks/admin/useSecureAdminAccess';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_description: string;
  risk_level: string;
  created_at: string;
  metadata?: any;
  ip_address?: string;
  user_id?: string;
}

const SecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const canView = await validateAdminAction('view_security_events');
    setHasAccess(canView);
    
    if (canView) {
      fetchSecurityEvents();
    } else {
      setLoading(false);
    }
  };

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching security events:', error);
        toast.error('Failed to fetch security events');
        return;
      }

      setEvents(data || []);
    } catch (error) {
      console.error('Critical error fetching security events:', error);
      toast.error('Critical error occurred while fetching security events');
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Eye className="h-4 w-4" />;
      case 'low':
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  if (!hasAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-orange-500" />
            <p>Access Denied</p>
            <p className="text-sm">You don't have permission to view security events.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2">Loading security events...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSecurityEvents}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['critical', 'high', 'medium', 'low'].map((level) => {
              const count = events.filter(e => e.risk_level === level).length;
              return (
                <div key={level} className="text-center">
                  <div className={`p-2 rounded-lg border ${getRiskLevelColor(level)}`}>
                    {getRiskLevelIcon(level)}
                  </div>
                  <p className="text-sm font-medium mt-1 capitalize">{level}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Events List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>No security events found</p>
                <p className="text-sm">System appears to be secure.</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className={`p-1 rounded ${getRiskLevelColor(event.risk_level)}`}>
                    {getRiskLevelIcon(event.risk_level)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{event.event_type}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getRiskLevelColor(event.risk_level)}`}
                      >
                        {event.risk_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {event.event_description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(event.created_at).toLocaleString()}</span>
                      {event.ip_address && (
                        <span>IP: {event.ip_address}</span>
                      )}
                      {event.user_id && (
                        <span>User: {event.user_id.substring(0, 8)}...</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;