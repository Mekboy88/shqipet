import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IpApiResponse {
  latitude: number;
  longitude: number;
  city: string;
  country_name: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('🔄 Starting device location backfill...');

    // Fetch all sessions with IP but without coordinates
    const { data: sessions, error: fetchError } = await supabase
      .from('user_sessions')
      .select('id, ip_address, location')
      .is('latitude', null)
      .not('ip_address', 'is', null);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`📍 Found ${sessions?.length || 0} devices to backfill`);

    let updated = 0;
    let failed = 0;

    for (const session of sessions || []) {
      try {
        // Fetch geolocation for this IP
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          console.warn(`⚠️ Failed to fetch geolocation for session ${session.id}`);
          failed++;
          continue;
        }

        const geoData: IpApiResponse = await response.json();

        // Update session with coordinates
        const { error: updateError } = await supabase
          .from('user_sessions')
          .update({
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            location: `${geoData.city}, ${geoData.country_name}`
          })
          .eq('id', session.id);

        if (updateError) {
          console.error(`❌ Failed to update session ${session.id}:`, updateError);
          failed++;
        } else {
          console.log(`✅ Updated session ${session.id}`);
          updated++;
        }

        // Rate limit: wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Error processing session ${session.id}:`, error);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Backfill complete: ${updated} updated, ${failed} failed`,
        updated,
        failed
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('❌ Backfill error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
