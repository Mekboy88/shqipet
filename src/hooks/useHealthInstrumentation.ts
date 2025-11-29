import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Health instrumentation hook for automatic discovery and monitoring
export const useHealthInstrumentation = (pageInfo: {
  pageName: string;
  route: string;
  app: 'admin' | 'website' | 'ios' | 'android';
  sections?: string[];
  buttons?: string[];
  critical?: boolean;
}) => {
  
  // Register page health on mount
  useEffect(() => {
    registerPageHealth(pageInfo);
  }, [pageInfo]);

  // Track button actions
  const trackButtonAction = useCallback(async (buttonId: string, action: () => Promise<any>) => {
    const startTime = performance.now();
    
    try {
      const result = await action();
      const latency = Math.round(performance.now() - startTime);
      
      // Record successful action
      await recordActionResult({
        buttonId,
        pageRoute: pageInfo.route,
        status: 'success',
        latency,
        timestamp: new Date().toISOString()
      });
      
      return result;
    } catch (error: any) {
      const latency = Math.round(performance.now() - startTime);
      
      // Record failed action
      await recordActionResult({
        buttonId,
        pageRoute: pageInfo.route,
        status: 'error',
        latency,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw error;
    }
  }, [pageInfo.route]);

  return {
    trackButtonAction
  };
};

// Register page and its components for health monitoring
async function registerPageHealth(pageInfo: any) {
  try {
    // Get or create page node
    let { data: existingPage } = await supabase
      .from('health_nodes')
      .select('id')
      .eq('slug', `page-${pageInfo.route.replace(/[\/\-]/g, '_')}`)
      .single();

    if (!existingPage) {
      const { data: newPage } = await supabase
        .from('health_nodes')
        .insert([{
          type: 'page',
          name: pageInfo.pageName,
          slug: `page-${pageInfo.route.replace(/[\/\-]/g, '_')}`,
          app: pageInfo.app,
          critical: pageInfo.critical || false,
          meta: {
            route: pageInfo.route,
            auto_discovered: true
          }
        }])
        .select('id')
        .single();
      
      existingPage = newPage;
    }

    // Register sections if provided
    if (pageInfo.sections && existingPage) {
      for (const section of pageInfo.sections) {
        await supabase
          .from('health_nodes')
          .insert([{
            type: 'section',
            name: section,
            slug: `section-${section.replace(/\s+/g, '_').toLowerCase()}`,
            app: pageInfo.app,
            parent_id: existingPage.id,
            meta: {
              page: pageInfo.route,
              auto_discovered: true
            }
          }])
          .select('id')
          .single();
      }
    }

    // Register buttons if provided
    if (pageInfo.buttons && existingPage) {
      for (const button of pageInfo.buttons) {
        await supabase
          .from('health_nodes')
          .insert([{
            type: 'button',
            name: button,
            slug: `button-${button.replace(/\s+/g, '_').toLowerCase()}`,
            app: pageInfo.app,
            parent_id: existingPage.id,
            meta: {
              page: pageInfo.route,
              auto_discovered: true
            }
          }])
          .select('id')
          .single();
      }
    }

  } catch (error) {
    console.warn('Failed to register page health:', error);
  }
}

// Record action results for health monitoring
async function recordActionResult(result: {
  buttonId: string;
  pageRoute: string;
  status: 'success' | 'error';
  latency: number;
  error?: string;
  timestamp: string;
}) {
  try {
    // Find the button node
    const { data: buttonNode } = await supabase
      .from('health_nodes')
      .select('id')
      .eq('type', 'button')
      .ilike('name', `%${result.buttonId}%`)
      .single();

    if (buttonNode) {
      // Record health check for the button
      await supabase
        .from('health_checks')
        .insert([{
          node_id: buttonNode.id,
          status: result.status === 'success' ? 'healthy' : 'critical',
          latency_ms: result.latency,
          error_rate: result.status === 'success' ? 0 : 1,
          details: {
            action_result: result.status,
            error: result.error,
            page: result.pageRoute
          }
        }]);
    }
  } catch (error) {
    console.debug('Failed to record action result:', error);
  }
}