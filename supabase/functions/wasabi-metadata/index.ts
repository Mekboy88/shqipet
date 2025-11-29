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
    // Health check endpoint - return 204 OK immediately
    const url = new URL(req.url);
    if (url.searchParams.get('health') === '1') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Extract key from query string or request body
    let key: string | null = url.searchParams.get('key');
    if (!key) {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await req.json().catch(() => ({} as any));
        key = (body as any).key ?? null;
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
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

    // Encode only path segments to preserve S3 key structure
    const keyParts = key.split('/');
    const encodedKey = keyParts.map((part: string) => encodeURIComponent(part)).join('/');
    const headUrl = `${endpoint}/${bucket}/${encodedKey}`;
    
    console.log('HEAD metadata for key:', { key, encodedKey });
    const res = await aws.fetch(headUrl, { method: 'HEAD' });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.log('HEAD failed:', { status: res.status, key });
      return new Response(JSON.stringify({ 
        error: `HEAD failed: ${res.status}`, 
        details: text,
        key 
      }), {
        status: res.status, // Pass through actual S3 status code
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const contentType = res.headers.get('content-type');
    const contentLength = res.headers.get('content-length');
    const lastModified = res.headers.get('last-modified');
    const etag = res.headers.get('etag');

    return new Response(JSON.stringify({
      contentType,
      contentLength: contentLength ? Number(contentLength) : null,
      lastModified,
      etag,
      metadata: {},
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Metadata error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});