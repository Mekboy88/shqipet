import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const tests: any[] = [];
  let overallSuccess = true;

  try {
    const region = Deno.env.get('WASABI_REGION');
    const bucket = Deno.env.get('WASABI_BUCKET_NAME');
    const accessKeyId = Deno.env.get('WASABI_ACCESS_KEY_ID');
    const secretAccessKey = Deno.env.get('WASABI_SECRET_ACCESS_KEY');

    const envVars = {
      hasAccessKey: !!accessKeyId,
      hasSecretKey: !!secretAccessKey,
      hasBucket: !!bucket,
      hasRegion: !!region,
      bucket,
      region,
    };
    const envSuccess = Object.values(envVars).every(Boolean);
    tests.push({ name: 'Environment Variables', success: envSuccess, details: envVars });
    overallSuccess &&= envSuccess;

    if (!envSuccess) {
      overallSuccess = false;
      return new Response(JSON.stringify({ success: false, tests }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const endpoint = `https://s3.${region}.wasabisys.com`;
    const aws = new AwsClient({ accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey!, service: 's3', region: region! });

    // Head bucket
    try {
      const head = await aws.fetch(`${endpoint}/${bucket}`, { method: 'HEAD' });
      tests.push({ name: 'Bucket Access (HEAD)', success: head.ok, status: head.status });
      overallSuccess &&= head.ok;
    } catch (e) {
      tests.push({ name: 'Bucket Access (HEAD)', success: false, error: String(e) });
      overallSuccess = false;
    }

    // List 1 object
    try {
      const url = `${endpoint}/${bucket}?list-type=2&max-keys=1`;
      const list = await aws.fetch(url, { method: 'GET' });
      tests.push({ name: 'List Objects', success: list.ok, status: list.status });
      overallSuccess &&= list.ok;
    } catch (e) {
      tests.push({ name: 'List Objects', success: false, error: String(e) });
      overallSuccess = false;
    }

    return new Response(JSON.stringify({ success: overallSuccess, tests, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Connection test error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: message, tests, timestamp: new Date().toISOString() }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});