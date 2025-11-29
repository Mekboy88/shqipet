import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Plus, Volume2, VolumeX, Bell } from 'lucide-react';
import { useRealtimeAlerts, AlertSeverity, AlertSource, UnifiedAlert } from '@/hooks/useRealtimeAlerts';
import { useAlertActions } from '@/hooks/useAlertActions';
import { AlertCard } from '@/components/admin/cloud/alerts/AlertCard';
import { AlertFilters } from '@/components/admin/cloud/alerts/AlertFilters';
import { AlertStats } from '@/components/admin/cloud/alerts/AlertStats';
import { AlertDetailModal } from '@/components/admin/cloud/alerts/AlertDetailModal';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AnimatePresence } from 'framer-motion';

export default function RealTimeAlerts() {
  const [filters, setFilters] = useState({
    severity: [] as AlertSeverity[],
    status: ['open'] as string[],
    source: [] as AlertSource[],
    timeRange: '24h',
    search: '',
  });
  const [selectedAlert, setSelectedAlert] = useState<UnifiedAlert | null>(null);
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [hiddenAlertIds, setHiddenAlertIds] = useState<Set<string>>(new Set());

  const { alerts, stats, isLoading, soundEnabled, setSoundEnabled } = useRealtimeAlerts(filters);
  const { resolveAlert, dismissAlert, createTestAlert } = useAlertActions();

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      severity: [],
      status: ['open'],
      source: [],
      timeRange: '24h',
      search: '',
    });
    toast.success('Filters cleared');
  };

  const handleClearFilterSection = (section: string) => {
    switch (section) {
      case 'severity':
        setFilters(prev => ({ ...prev, severity: [] }));
        toast.success('Severity filters cleared');
        break;
      case 'status':
        setFilters(prev => ({ ...prev, status: [] }));
        toast.success('Status filters cleared');
        break;
      case 'source':
        setFilters(prev => ({ ...prev, source: [] }));
        toast.success('Source filters cleared');
        break;
      case 'timeRange':
        setFilters(prev => ({ ...prev, timeRange: '' }));
        toast.success('Time range filter cleared');
        break;
      case 'search':
        setFilters(prev => ({ ...prev, search: '' }));
        toast.success('Search cleared');
        break;
    }
  };

  const handleResolve = (alert: UnifiedAlert) => {
    resolveAlert.mutate({ alert });
  };

  const handleDismiss = (alert: UnifiedAlert) => {
    dismissAlert.mutate({ alert });
  };

  const handleCreateTestAlert = (type: AlertSource) => {
    createTestAlert.mutate({ type });
    setShowTestDialog(false);
  };

  // Filter alerts by tab
  const getFilteredAlerts = () => {
    if (activeTab === 'all') return alerts;
    
    const sourceMap: Record<string, AlertSource[]> = {
      system: ['system_issues'],
      security: ['security_events', 'brute_force_alerts'],
      admin: ['admin_notifications'],
      notifications: ['notifications'],
    };
    
    return alerts.filter(alert => sourceMap[activeTab]?.includes(alert.source));
  };

  const filteredAlerts = getFilteredAlerts().filter(a => !hiddenAlertIds.has(a.id));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Real-Time Alerts
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor system alerts, security events, and notifications in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTestDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Test Alert
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <AlertStats stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <AlertFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onClearFilterSection={handleClearFilterSection}
          />
        </div>

        {/* Alerts Feed */}
        <div className="lg:col-span-3">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Alerts</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="admin">Admin</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bell className="w-4 h-4" />
                  <span>{filteredAlerts.length} alerts</span>
                </div>
              </div>

              <TabsContent value={activeTab} className="space-y-3 mt-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-4">Loading alerts...</p>
                  </div>
                ) : filteredAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No alerts found</p>
                    <p className="text-sm text-muted-foreground/70 mt-2">
                      Try adjusting your filters or create a test alert
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    <AnimatePresence>
                      {filteredAlerts.map(alert => (
                        <AlertCard
                          key={alert.id}
                          alert={alert}
                          onResolve={(a) => { handleResolve(a); setHiddenAlertIds(prev => new Set(prev).add(a.id)); }}
                          onDismiss={(a) => { handleDismiss(a); setHiddenAlertIds(prev => new Set(prev).add(a.id)); }}
                          onViewDetails={setSelectedAlert}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Alert Detail Modal */}
      <AlertDetailModal
        alert={selectedAlert}
        open={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolve}
        onDismiss={handleDismiss}
      />

      {/* Test Alert Dialog */}
      <Dialog open={showTestDialog} onOpenChange={setShowTestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Test Alert</DialogTitle>
            <DialogDescription>
              Select an alert type to create a test alert
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleCreateTestAlert('admin_notifications')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Admin Notification
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleCreateTestAlert('security_events')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Security Event
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleCreateTestAlert('brute_force_alerts')}
            >
              <Bell className="w-4 h-4 mr-2" />
              Brute Force Alert
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleCreateTestAlert('system_issues')}
            >
              <Bell className="w-4 h-4 mr-2" />
              System Issue
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => handleCreateTestAlert('notifications')}
            >
              <Bell className="w-4 h-4 mr-2" />
              User Notification
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
