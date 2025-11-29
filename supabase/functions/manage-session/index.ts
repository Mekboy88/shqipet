import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Universal device type detection based on viewport width
// Rules: mobile < 768px | tablet < 1024px | laptop < 1920px | desktop >= 1920px
function detectDeviceType(screenResolution: string): string {
  const width = parseInt(screenResolution.split('x')[0]);
  
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  if (width < 1920) return 'laptop';
  return 'desktop';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, sessionData, deviceStableId } = await req.json();

    if (action === 'upsert') {
      let locationData: any = {
        latitude: sessionData.latitude,
        longitude: sessionData.longitude,
        city: null,
        country: null,
        country_code: null,
        region: null,
      };

      if (sessionData.latitude && sessionData.longitude) {
        try {
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${sessionData.latitude}&lon=${sessionData.longitude}`,
            { headers: { 'User-Agent': 'DeviceSessionApp/1.0' } }
          );
          
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            locationData = {
              ...locationData,
              city: geoData.address?.city || geoData.address?.town || geoData.address?.village || null,
              country: geoData.address?.country || null,
              country_code: geoData.address?.country_code?.toUpperCase() || null,
              region: geoData.address?.state || geoData.address?.region || null,
            };
          }
        } catch (geoError) {
          console.error('Reverse geocoding failed:', geoError);
        }
      }

      // Detect device type based on screen resolution using universal rules
      const detectedDeviceType = detectDeviceType(sessionData.screenResolution);
      console.log('Device detection:', {
        screenResolution: sessionData.screenResolution,
        detectedType: detectedDeviceType,
      });

      // Use the device_stable_id from client, normalized to lowercase
      const normalizedId = (sessionData.deviceStableId || '').toLowerCase();
      
      const devicePayload = {
        deviceId: sessionData.deviceId,
        detectedDeviceType,
        operatingSystem: sessionData.operatingSystem,
        browserName: sessionData.browserName,
        browserVersion: sessionData.browserVersion,
        screenResolution: sessionData.screenResolution,
        platform: sessionData.platform,
        userAgent: sessionData.userAgent,
        ...locationData,
      };

      console.log('🔍 Looking for duplicate device rows to consolidate...');
      
      // STEP 1: Find potential duplicate rows for this user that represent the SAME physical device
      // Match by: OS + platform (version-agnostic) + screen resolution + device type
      const { data: potentialDuplicates } = await supabase
        .from('user_sessions')
        .select('id, device_stable_id, active_tabs_count, operating_system, platform, screen_resolution, device_type')
        .eq('user_id', user.id)
        .neq('device_stable_id', normalizedId); // Don't include the current one

      // Find rows that match the current device's hardware characteristics
      const cleanPlatform = (text: string) => text?.toLowerCase().replace(/\d+/g, '').trim() || '';
      
      const duplicates = (potentialDuplicates || []).filter(row => {
        const sameOS = row.operating_system?.toLowerCase() === devicePayload.operatingSystem?.toLowerCase();
        const samePlatform = cleanPlatform(row.platform) === cleanPlatform(devicePayload.platform);
        const sameScreenRes = row.screen_resolution === devicePayload.screenResolution;
        const sameDeviceType = row.device_type === devicePayload.detectedDeviceType;
        
        return sameOS && samePlatform && sameScreenRes && sameDeviceType;
      });

      // STEP 2: If duplicates found, consolidate them into the new canonical deviceStableId
      let delta = 1; // Default: +1 for new tab
      
      if (duplicates.length > 0) {
        console.log(`🔄 Found ${duplicates.length} duplicate device(s) to consolidate into ${normalizedId}`);
        
        // Sum up all tab counts from duplicates
        const totalTabsFromDuplicates = duplicates.reduce((sum, d) => sum + (d.active_tabs_count || 0), 0);
        console.log(`📊 Total tabs from duplicates: ${totalTabsFromDuplicates}`);
        
        // Delete the duplicate rows (cleanup legacy data)
        for (const dup of duplicates) {
          await supabase
            .from('user_sessions')
            .delete()
            .eq('id', dup.id);
          console.log(`🗑️ Deleted duplicate device row: ${dup.device_stable_id}`);
        }
        
        // Add the consolidated tabs to the delta (for the new canonical row)
        delta = totalTabsFromDuplicates + 1; // Include all existing tabs + this new tab
        console.log(`✅ Will consolidate ${totalTabsFromDuplicates} existing tabs + 1 new tab = ${delta} total`);
      }

      // STEP 3: Check if canonical row exists
      const { data: existingRow } = await supabase
        .from('user_sessions')
        .select('id, active_tabs_count, updated_at')
        .eq('user_id', user.id)
        .eq('device_stable_id', normalizedId)
        .maybeSingle();

      // STEP 4: Smart delta calculation
      if (existingRow) {
        // Canonical row exists
        if (duplicates.length === 0) {
          // Normal case: just increment by 1 for new tab
          delta = 1;
          console.log('✅ Existing canonical row found, incrementing by 1');
        } else {
          // Duplicates were merged: delta already set to totalTabsFromDuplicates + 1
          console.log(`✅ Canonical row exists, will update with consolidated count: ${delta}`);
        }
      } else {
        // New canonical row will be created
        if (duplicates.length === 0) {
          // First tab on device
          delta = 0; // bump_tabs_count will initialize to 1
          console.log('✅ First tab on this device, will create row with count = 1');
        } else {
          // Creating new canonical row with consolidated count from duplicates
          delta = delta - 1; // Subtract 1 because bump_tabs_count adds to existing (which is 0 for new row)
          console.log(`✅ Creating new canonical row with consolidated count: ${delta + 1}`);
        }
      }

      // STEP 5: Atomic upsert via RPC (creates or updates the canonical row)
      const { data: count, error: rpcError } = await supabase.rpc('bump_tabs_count', {
        p_device_stable_id: normalizedId,
        p_delta: delta,
        p_device: devicePayload,
      });
      
      if (rpcError) throw rpcError;

      console.log(`✅ Final tab count for device ${normalizedId}: ${count}`);
      console.log('🎯 ONE DEVICE = ONE CARD across all domains');

      return new Response(
        JSON.stringify({ success: true, count }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'trust') {
      console.log('🔐 Trust action received:', {
        deviceStableId: sessionData?.deviceStableId,
        isTrusted: sessionData?.isTrusted,
        userId: user.id
      });

      const targetId = (sessionData?.deviceStableId || '').toLowerCase();

      const { error } = await supabase
        .from('user_sessions')
        .update({ is_trusted: sessionData?.isTrusted ?? true })
        .eq('user_id', user.id)
        .eq('device_stable_id', targetId);

      if (error) {
        console.error('❌ Trust update failed:', error);
        throw error;
      }

      console.log('✅ Trust state updated successfully');

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'revoke') {
      if (!deviceStableId) {
        return new Response(JSON.stringify({ error: 'Device ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const targetId = (deviceStableId || '').toLowerCase();

      console.log('🔥 Revoking device session:', targetId, 'for user:', user.id);

      // 1) Insert revocation signal to trigger instant logout on target device
      const { error: signalError } = await supabase
        .from('session_revocations')
        .insert({
          user_id: user.id,
          device_stable_id: targetId
        });

      if (signalError) {
        console.error('❌ Failed to insert revocation signal:', signalError);
        throw signalError;
      }

      console.log('✅ Revocation signal inserted for device:', targetId);

      // 2) Delete the session from user_sessions
      const { error: deleteError } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id)
        .eq('device_stable_id', targetId);

      if (deleteError) {
        console.error('❌ Failed to delete session:', deleteError);
        throw deleteError;
      }

      console.log('✅ Session deleted for device:', targetId);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'tab_close') {
      // Decrement active tab count when a tab closes
      const targetDeviceStableId = deviceStableId || sessionData?.deviceStableId;
      if (!targetDeviceStableId) {
        return new Response(
          JSON.stringify({ error: 'Missing deviceStableId for tab_close' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const targetId = (targetDeviceStableId || '').toLowerCase();

      // Fetch current session
      const { data: session, error: fetchError } = await supabase
        .from('user_sessions')
        .select('active_tabs_count')
        .eq('user_id', user.id)
        .eq('device_stable_id', targetId)
        .maybeSingle();

      // If session doesn't exist, just return success (tab is closing anyway)
      if (fetchError || !session) {
        console.log(`Session not found for device ${targetId}, ignoring tab close`);
        return new Response(
          JSON.stringify({ success: true, count: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const newCount = Math.max(session.active_tabs_count - 1, 0);

      // Update only the tab count - trigger will handle updated_at
      const { error: updateError } = await supabase
        .from('user_sessions')
        .update({ active_tabs_count: newCount })
        .eq('user_id', user.id)
        .eq('device_stable_id', targetId);

      if (updateError) {
        console.error('Tab close update error:', updateError);
        // Don't fail on update errors for tab close - it's not critical
        return new Response(
          JSON.stringify({ success: true, count: newCount }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`✅ Tab closed for device ${targetId}, new count: ${newCount}`);
      return new Response(
        JSON.stringify({ success: true, count: newCount }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Session management error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
