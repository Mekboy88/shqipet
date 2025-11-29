import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCover } from '@/hooks/media/useCover';

/**
 * CoverDebugHUD - Minimal diagnostics panel for cover persistence
 * Enable via ?coverDebug=1 to render.
 */
const CoverDebugHUD: React.FC = () => {
  const { user } = useAuth();
  const { key, resolvedUrl, position, loading, lastGoodUrl, refresh } = useCover();
  const [dbRow, setDbRow] = React.useState<any>(null);
  const [fetching, setFetching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadDb = React.useCallback(async () => {
    if (!user?.id) return;
    setFetching(true);
    setError(null);
    try {
      const selectCols = 'id, cover_url, cover_position, updated_at';
      // Always read from public schema
      const { data } = await supabase
        .from('profiles')
        .select(selectCols)
        .eq('id', user.id)
        .maybeSingle();
      setDbRow(data || null);
    } catch (e: any) {
      setError(e?.message || String(e));
    } finally {
      setFetching(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    void loadDb();
  }, [loadDb]);

  return (
    <div className="absolute left-4 bottom-4 z-30 max-w-[90vw]">
      <div className="rounded-md border bg-background/90 backdrop-blur px-3 py-2 text-xs shadow">
        <div className="font-semibold mb-1">Cover Debug HUD</div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
          <div>user</div><div className="truncate">{user?.id || '—'}</div>
          <div>hook.key</div><div className="truncate">{key || 'null'}</div>
          <div>hook.url</div><div className="truncate">{resolvedUrl ? resolvedUrl.slice(0, 80) + '…' : 'null'}</div>
          <div>hook.pos</div><div>{position}</div>
          <div>hook.loading</div><div>{String(loading)}</div>
          <div>hook.lastGood</div><div className="truncate">{lastGoodUrl ? lastGoodUrl.slice(0, 80) + '…' : 'null'}</div>
        </div>
        <div className="mt-2 border-t pt-2">
          <div className="mb-1 font-medium">DB row (public.profiles)</div>
          {fetching ? (
            <div>Loading…</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : dbRow ? (
            <pre className="max-h-48 overflow-auto text-[10px] leading-tight whitespace-pre-wrap">
{JSON.stringify({
  id: dbRow.id,
  cover_url: dbRow.cover_url,
  cover_position: dbRow.cover_position,
  updated_at: dbRow.updated_at,
}, null, 2)}
            </pre>
          ) : (
            <div>No row found</div>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <button
            className="px-2 py-1 rounded border hover:bg-accent"
            onClick={() => loadDb()}
          >Reload DB</button>
          <button
            className="px-2 py-1 rounded border hover:bg-accent"
            onClick={() => refresh()}
          >Force Refresh Cover</button>
        </div>
      </div>
    </div>
  );
};

export default CoverDebugHUD;
