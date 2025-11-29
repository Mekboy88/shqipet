import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    // Health check endpoint - return 204 OK immediately
    if (url.searchParams.get('health') === '1') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    let key: string | null = url.searchParams.get('key');
    if (!key) {
      // Fallback to request body for non-GET requests
      const contentType = req.headers.get('content-type') || '';
      if (req.method !== 'GET' && contentType.includes('application/json')) {
        const body = await req.json().catch(() => ({} as any));
        key = (body as any).key ?? null;
      } else if (req.method !== 'GET' && contentType.includes('application/x-www-form-urlencoded')) {
        const form = await req.formData().catch(() => null);
        key = form?.get('key')?.toString() ?? null;
      }
    }
    if (!key) {
      return new Response(JSON.stringify({ error: 'No key provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const region = Deno.env.get('WASABI_REGION')!;
    const bucket = Deno.env.get('WASABI_BUCKET_NAME')!;
    const accessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!;
    const secretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!;
    const endpoint = `https://s3.${region}.wasabisys.com`;

    const aws = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region });
    
    // Don't use encodeURIComponent on the whole key - only encode each path segment
    const keyParts = key.split('/');
    const encodedKey = keyParts.map((part: string) => encodeURIComponent(part)).join('/');
    const getUrl = `${endpoint}/${bucket}/${encodedKey}`;
    
    console.log('Downloading from Wasabi:', { key, encodedKey, getUrl });
    const res = await aws.fetch(getUrl, { method: 'GET' });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return new Response(
        JSON.stringify({ error: `GET failed: ${res.status}`, details: text }),
        {
          status: res.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const filename = key.split('/').pop() || 'download';

    return new Response(res.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': res.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});