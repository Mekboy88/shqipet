import { supabase } from '@/integrations/supabase/client';

// Lightweight in-memory cache for supabase.auth.getUser()
// Avoids repeated network calls within a short window
// TTL default: 60 seconds
let cachedAt = 0;
let cachedUser: Awaited<ReturnType<typeof supabase.auth.getUser>> | null = null;
let inFlight: Promise<Awaited<ReturnType<typeof supabase.auth.getUser>>> | null = null;

const TTL_MS = 60_000; // 1 minute

export async function getCachedAuthUser(force = false) {
  const now = Date.now();
  if (!force && cachedUser && now - cachedAt < TTL_MS) {
    return cachedUser;
  }
  if (!force && inFlight) return inFlight;

  inFlight = supabase.auth.getUser()
    .then((res) => {
      cachedUser = res;
      cachedAt = Date.now();
      inFlight = null;
      return res;
    })
    .catch((e) => {
      inFlight = null;
      throw e;
    });

  return inFlight;
}

export async function getCachedAuthUserId(): Promise<string | null> {
  try {
    const { data } = await getCachedAuthUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export function clearAuthUserCache() {
  cachedUser = null;
  cachedAt = 0;
  inFlight = null;
}
