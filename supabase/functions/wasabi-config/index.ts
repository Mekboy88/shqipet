const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const config = {
      bucket_name: Deno.env.get('WASABI_BUCKET_NAME'),
      bucket: Deno.env.get('WASABI_BUCKET_NAME'), // alias for compatibility
      region: Deno.env.get('WASABI_REGION'),
      endpoint: `https://s3.${Deno.env.get('WASABI_REGION')}.wasabisys.com`,
      hasAccessKey: !!Deno.env.get('WASABI_ACCESS_KEY_ID'),
      hasSecretKey: !!Deno.env.get('WASABI_SECRET_ACCESS_KEY'),
    };

    return new Response(JSON.stringify(config), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Config error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
