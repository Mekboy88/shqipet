import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (per user+IP)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 }); // 10 min window
    return true;
  }
  
  if (entry.count >= 5) {
    return false;
  }
  
  entry.count++;
  return true;
}

function passesPolicy(password: string): boolean {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  if (!/[^A-Za-z0-9]/.test(password)) return false;
  return true;
}

async function isBreachedPassword(password: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    
    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();
    
    return text.includes(suffix);
  } catch (error) {
    console.error('Breach check error:', error);
    return false; // Fail open - don't block if service is down
  }
}

async function logAudit(supabase: any, userId: string, req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    await supabase.from('security_events').insert({
      user_id: userId,
      event_type: 'password_changed',
      event_description: 'User changed password',
      risk_level: 'info',
      metadata: {
        ip,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `${user.id}:${ip}`;
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({ code: 'RATE_LIMITED' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { currentPassword, newPassword, logoutOthers = true } = body;

    if (!currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({ code: 'UNABLE_TO_CHANGE' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Re-authenticate with current password
    if (!user.email) {
      return new Response(
        JSON.stringify({ code: 'UNAUTHORIZED' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (signInError) {
      return new Response(
        JSON.stringify({ code: 'UNABLE_TO_CHANGE' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate password policy
    if (!passesPolicy(newPassword)) {
      return new Response(
        JSON.stringify({ code: 'POLICY_FAILED' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if password is breached
    const isBreached = await isBreachedPassword(newPassword);
    if (isBreached) {
      return new Response(
        JSON.stringify({ code: 'BREACHED_PASSWORD' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error('Password update error:', updateError);
      return new Response(
        JSON.stringify({ code: 'UNABLE_TO_CHANGE' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Logout other sessions if requested
    if (logoutOthers) {
      try {
        await supabase.auth.signOut({ scope: 'others' });
      } catch (error) {
        console.error('Error logging out other sessions:', error);
      }
    }

    // Log the action
    await logAudit(supabase, user.id, req);

    return new Response(
      JSON.stringify({ code: 'OK' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ code: 'SERVER_ERROR' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
