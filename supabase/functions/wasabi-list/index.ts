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
    const { prefix = '', maxKeys = 100 } = await req.json().catch(() => ({}));

    const region = Deno.env.get('WASABI_REGION')!;
    const bucket = Deno.env.get('WASABI_BUCKET_NAME')!;
    const accessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID')!;
    const secretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY')!;
    const endpoint = `https://s3.${region}.wasabisys.com`;

    const aws = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region });

    const url = new URL(`${endpoint}/${bucket}`);
    url.searchParams.set('list-type', '2');
    url.searchParams.set('max-keys', String(maxKeys));
    if (prefix) url.searchParams.set('prefix', prefix);

    const res = await aws.fetch(url.toString(), { method: 'GET' });
    const xml = await res.text();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `LIST failed: ${res.status}`, details: xml }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Very lightweight XML parsing to extract Key/Size
    const files: Array<{ key: string; size: number }> = [];
    const entryRegex = /<Contents>[\s\S]*?<Key>(.*?)<\/Key>[\s\S]*?<Size>(\d+)<\/Size>[\s\S]*?<\/Contents>/g;
    let m;
    while ((m = entryRegex.exec(xml)) !== null) {
      files.push({ key: m[1], size: Number(m[2]) });
    }

    return new Response(JSON.stringify({ files, count: files.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('List error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});