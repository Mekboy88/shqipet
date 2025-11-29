// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  limit?: number;
  offset?: number;
  search?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl) {
      console.error("Missing SUPABASE_URL");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!anonKey) {
      console.error("Missing SUPABASE_ANON_KEY or SUPABASE_PUBLISHABLE_KEY");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!serviceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return new Response(JSON.stringify({ error: "Server configuration error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Parse body
    const body = (await req.json().catch(() => ({}))) as RequestBody;
    const limit = Math.min(Math.max(body.limit ?? 50, 1), 200);
    const offset = Math.max(body.offset ?? 0, 0);
    const search = (body.search ?? "").trim();

    // Create an auth-bound client to identify the caller
    const anonClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userRes } = await anonClient.auth.getUser();
    const callerId = userRes?.user?.id;
    if (!callerId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Authorize: platform owner or admin/super_admin can access
    let allowed = false;

    try {
      // Fast path: if caller is platform owner, allow
      const { data: me, error: meErr } = await anonClient
        .from('profiles')
        .select('primary_role')
        .eq('id', callerId)
        .maybeSingle();
      if (!meErr && me?.primary_role === 'platform_owner_root') {
        allowed = true;
      }
    } catch (e) {
      console.warn('self profile check failed, falling back to RPC:', (e as any)?.message || e);
    }

    if (!allowed) {
      const { data: accessAllowed, error: accessErr } = await anonClient.rpc(
        'validate_admin_access',
        { required_action: 'access_admin_portal' }
      );
      if (accessErr) {
        console.error('validate_admin_access error:', accessErr.message);
        return new Response(
          JSON.stringify({ error: 'Access validation failed' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      allowed = !!accessAllowed;
    }

    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Forbidden' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to bypass RLS safely after authorization
    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    let query = serviceClient
      .from("profiles")
      .select(
        `id, auth_user_id, first_name, last_name, email, username, phone_number,
         avatar_url, primary_role, is_hidden, created_at, updated_at`,
        { count: "exact" }
      )
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      const s = `%${search}%`;
      query = query.or(
        `username.ilike.${s},first_name.ilike.${s},last_name.ilike.${s},email.ilike.${s}`
      );
    }

    const { data, error, count } = await query;
    if (error) {
      console.error("profiles query error:", error.message);
      return new Response(JSON.stringify({ error: "Query failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Enforce safety filter as defense-in-depth (even if DB changes)
    const safeData = (data ?? []).filter((u: any) => u?.is_hidden === false);

    // Enrich with roles from user_roles (service role bypasses RLS safely)
    let roleMap: Record<string, string> = {};
    try {
      const userIds = safeData.map((u: any) => u.id);
      if (userIds.length > 0) {
        const { data: rolesData, error: rolesErr } = await serviceClient
          .from("user_roles")
          .select("user_id, role, is_active")
          .in("user_id", userIds)
          .eq("is_active", true);
        if (rolesErr) {
          console.warn("user_roles query warning:", rolesErr.message);
        } else if (rolesData) {
          // Pick highest role per user
          const weight: Record<string, number> = { platform_owner_root: 6, super_admin: 5, admin: 4, moderator: 3, developer: 2, support: 2, user: 1 };
          for (const r of rolesData as any[]) {
            const cur = roleMap[r.user_id];
            if (!cur || (weight[r.role] ?? 0) > (weight[cur] ?? 0)) {
              roleMap[r.user_id] = r.role;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to enrich roles:", (e as any)?.message || e);
    }

    const users = safeData.map((u: any) => ({ ...u, role: roleMap[u.id] || u.primary_role || 'user' }));

    return new Response(
      JSON.stringify({ users, count: users.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("admin_list_visible_users fatal:", err?.message || err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
