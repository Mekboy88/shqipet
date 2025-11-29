import { supabase } from "@/integrations/supabase/client";

export async function populateInitialTopologyData() {
  try {
    // Insert initial platform structure
    const { data: pages, error: pagesError } = await supabase
      .from('health_nodes')
      .upsert([
        {
          type: 'page',
          app: 'admin',
          name: 'Admin Dashboard',
          slug: 'admin-dashboard',
          owner: 'system',
          meta: { route: '/admin', auto_discovered: true }
        },
        {
          type: 'page',
          app: 'admin', 
          name: 'User Management',
          slug: 'admin-users',
          owner: 'system',
          meta: { route: '/admin/users', auto_discovered: true }
        },
        {
          type: 'page',
          app: 'admin',
          name: 'Live Connection Topology',
          slug: 'admin-topology',
          owner: 'system', 
          meta: { route: '/admin/core-platform/live-connection-topology', auto_discovered: true }
        },
        {
          type: 'page',
          app: 'website',
          name: 'Home Page',
          slug: 'website-home',
          owner: 'system',
          meta: { route: '/', auto_discovered: true }
        },
        {
          type: 'page',
          app: 'website',
          name: 'Login Page', 
          slug: 'website-login',
          owner: 'system',
          meta: { route: '/login', auto_discovered: true }
        }
      ], { 
        onConflict: 'app,slug',
        ignoreDuplicates: false 
      })
      .select();

    if (pagesError) throw pagesError;

    // Insert sections for admin pages
    const adminPages = pages?.filter(p => p.app === 'admin') || [];
    
    for (const page of adminPages) {
      await supabase
        .from('health_nodes')
        .upsert([
          {
            type: 'section',
            app: page.app,
            name: 'Main Content',
            parent_id: page.id,
            owner: 'system',
            meta: { auto_discovered: true }
          },
          {
            type: 'section', 
            app: page.app,
            name: 'Navigation',
            parent_id: page.id,
            owner: 'system',
            meta: { auto_discovered: true }
          }
        ], { onConflict: 'parent_id,name' });
    }

    // Insert backend components
    const { data: backendNodes, error: backendError } = await supabase
      .from('health_nodes')
      .upsert([
        {
          type: 'api',
          app: 'backend',
          name: 'Topology Register',
          slug: 'topology-register',
          owner: 'system',
          meta: { endpoint: '/functions/v1/topology-register', auto_discovered: true }
        },
        {
          type: 'api',
          app: 'backend', 
          name: 'Topology Tree',
          slug: 'topology-tree',
          owner: 'system',
          meta: { endpoint: '/functions/v1/topology-tree', auto_discovered: true }
        },
        {
          type: 'db_table',
          app: 'backend',
          name: 'health_nodes',
          slug: 'health-nodes-table',
          owner: 'system',
          meta: { table: 'health_nodes', auto_discovered: true }
        },
        {
          type: 'db_table',
          app: 'backend',
          name: 'health_checks', 
          slug: 'health-checks-table',
          owner: 'system',
          meta: { table: 'health_checks', auto_discovered: true }
        }
      ], { 
        onConflict: 'app,slug',
        ignoreDuplicates: false 
      })
      .select();

    if (backendError) throw backendError;

    // Insert initial health checks
    const allNodes = [...(pages || []), ...(backendNodes || [])];
    
    for (const node of allNodes) {
      await supabase
        .from('health_checks')
        .upsert({
          node_id: node.id,
          status: 'ok',
          latency_ms: Math.floor(Math.random() * 200) + 50,
          error_rate: 0,
          sample_size: 1
        }, { onConflict: 'node_id' });
    }

    console.log('✅ Initial topology data populated successfully');
    return { success: true, message: 'Initial data populated' };

  } catch (error) {
    console.error('❌ Failed to populate topology data:', error);
    throw error;
  }
}