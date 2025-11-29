import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    // Parse URL - handle both full URLs and relative paths
    let url: URL;
    try {
      url = new URL(req.url);
    } catch {
      // If req.url is relative, construct full URL
      url = new URL(req.url, `https://${req.headers.get('host') || 'localhost'}`);
    }
    
    console.log('🔍 Wasabi-proxy request:', {
      method: req.method,
      url: req.url,
      search: url.search,
      contentType: req.headers.get('content-type')
    });
    
    let key = '';
    
    // For GET requests, get key from query params
    if (req.method === 'GET') {
      key = url.searchParams.get('key') || '';
      console.log('🔍 GET - Key from search params:', key);
    }
    // For POST requests, get key from JSON body
    else if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      key = body.key || '';
      console.log('🔍 POST - Key from body:', key);
    }

    if (!key) {
      console.error('❌ No key provided:', { method: req.method, url: req.url, search: url.search });
      return new Response(JSON.stringify({ 
        error: 'No key provided', 
        debug: { method: req.method, url: req.url, search: url.search } 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Processing key:', key);

    const region = Deno.env.get('WASABI_REGION')!;
    const bucket = Deno.env.get('WASABI_BUCKET_NAME')!;
    const accessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!;
    const secretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!;
    const endpoint = `https://s3.${region}.wasabisys.com`;

    const aws = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region });

    const getUrl = `${endpoint}/${bucket}/${key}`;
    const res = await aws.fetch(getUrl, { method: 'GET' });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Wasabi GET failed: ${res.status} ${res.statusText} ${text}`);
    }

    // Stream through response
    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'public, max-age=900',
      }
    });
  } catch (error) {
    console.error('Proxy error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});