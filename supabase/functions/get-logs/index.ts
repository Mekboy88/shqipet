import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get auth token from header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify user is authenticated and admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { logType, limit = 100 } = await req.json();

    let query = '';
    
    if (logType === 'database' || logType === 'all') {
      query = `
        select identifier, postgres_logs.timestamp, id, event_message, parsed.error_severity 
        from postgres_logs
        cross join unnest(metadata) as m
        cross join unnest(m.parsed) as parsed
        order by timestamp desc
        limit ${limit}
      `;
    } else if (logType === 'auth') {
      query = `
        select id, auth_logs.timestamp, event_message, metadata.level, metadata.status, 
               metadata.path, metadata.msg as msg, metadata.error 
        from auth_logs
        cross join unnest(metadata) as metadata
        order by timestamp desc
        limit ${limit}
      `;
    } else if (logType === 'edge') {
      query = `
        select id, function_edge_logs.timestamp, event_message, response.status_code, 
               request.method, m.function_id, m.execution_time_ms, m.deployment_id, m.version 
        from function_edge_logs
        cross join unnest(metadata) as m
        cross join unnest(m.response) as response
        cross join unnest(m.request) as request
        order by timestamp desc
        limit ${limit}
      `;
    }

    // Execute analytics query using admin permissions
    const analyticsResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/analytics_query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        },
        body: JSON.stringify({ query }),
      }
    );

    const logs = await analyticsResponse.json();

    return new Response(JSON.stringify({ logs: logs || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
