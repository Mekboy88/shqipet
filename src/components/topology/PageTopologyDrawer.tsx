import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Eye, CheckCircle, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PageTopologyDrawerProps {
  pageName: string;
  pageRoute: string;
  children: React.ReactNode;
}

interface PageComponent {
  id: string;
  name: string;
  type: string;
  status: string;
  lastCheck?: string;
  latency?: number;
  connected: boolean;
}

const PageTopologyDrawer: React.FC<PageTopologyDrawerProps> = ({
  pageName,
  pageRoute,
  children
}) => {
  const [components, setComponents] = useState<PageComponent[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Load page components when drawer opens
  useEffect(() => {
    if (open) {
      loadPageComponents();
    }
  }, [open, pageRoute]);

  const loadPageComponents = async () => {
    try {
      setLoading(true);

      // Find page node
      const { data: pageNode } = await supabase
        .from('health_nodes')
        .select('id')
        .eq('type', 'page')
        .like('meta->route', `%${pageRoute}%`)
        .single();

      if (!pageNode) {
        setComponents([]);
        return;
      }

      // Get child components (sections, buttons)
      const { data: childNodes } = await supabase
        .from('health_nodes')
        .select(`
          id,
          name,
          type,
          health_checks!inner (
            status,
            latency_ms,
            checked_at
          )
        `)
        .eq('parent_id', pageNode.id)
        .order('type')
        .order('name');

      // Transform to component format
      const pageComponents: PageComponent[] = (childNodes || []).map(node => {
        const latestCheck = node.health_checks?.[0];
        return {
          id: node.id,
          name: node.name,
          type: node.type,
          status: latestCheck?.status || 'unknown',
          lastCheck: latestCheck?.checked_at,
          latency: latestCheck?.latency_ms,
          connected: latestCheck?.status === 'healthy'
        };
      });

      setComponents(pageComponents);

    } catch (error) {
      console.error('Failed to load page components:', error);
      toast.error('Failed to load page topology');
    } finally {
      setLoading(false);
    }
  };

  const testPageComponents = async () => {
    try {
      setLoading(true);
      
      // Run health checks for all page components
      const { data, error } = await supabase.functions.invoke('health-monitor', {
        body: {
          action: 'check_page',
          pageRoute
        }
      });

      if (error) throw error;

      toast.success('Page component tests completed');
      setTimeout(loadPageComponents, 1000);
      
    } catch (error) {
      console.error('Failed to test page components:', error);
      toast.error('Failed to test page components');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (connected: boolean) => {
    return connected ? 'bg-green-100 border-green-300' : 'bg-gray-100 border-gray-300';
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {pageName} Topology
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Page Summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Page Health Summary</CardTitle>
                <Button
                  onClick={testPageComponents}
                  disabled={loading}
                  size="sm"
                  variant="outline"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  Test Page
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Route: <code className="bg-muted px-2 py-1 rounded">{pageRoute}</code>
              </div>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline">
                  {components.filter(c => c.connected).length} Connected
                </Badge>
                <Badge variant="outline">
                  {components.filter(c => !c.connected).length} Disconnected
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Components List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Page Components</h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : components.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center">
                  <div className="text-muted-foreground">
                    No components discovered for this page.
                    <br />
                    <span className="text-sm">Components will appear as they are instrumented.</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {components.map(component => (
                  <Card 
                    key={component.id} 
                    className={`transition-colors ${getStatusColor(component.connected)}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(component.status)}
                          <div>
                            <div className="font-medium">{component.name}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {component.type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge 
                            variant={component.connected ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {component.connected ? 'Connected' : 'Not Connected'}
                          </Badge>
                          {component.latency && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {component.latency}ms
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {component.lastCheck && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Last check: {new Date(component.lastCheck).toLocaleTimeString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={() => window.open('/admin/core-platform/live-connection-topology', '_blank')}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Full Topology View
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PageTopologyDrawer;