import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useWebsiteSettings, useUpdateWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { Loader2, DollarSign, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import LocalizationNav from './LocalizationNav';

const CURRENCY_OPTIONS = ['EUR','USD','GBP','CHF','CAD','AUD','JPY'];

export default function CurrencySettingsPage() {
  const { data, isLoading } = useWebsiteSettings();
  const update = useUpdateWebsiteSettings();
  const [local, setLocal] = React.useState<any>({});
  React.useEffect(() => { if (data) setLocal(data); }, [data]);
  const save = (patch: any) => { setLocal((p:any)=>({ ...p, ...patch })); update.mutate(patch); };

  const refreshRates = async () => {
    try {
      const base = local?.exchange_base_currency || local?.default_currency || 'EUR';
      const provider = local?.exchange_provider || 'ecb';
      const { data: fxRes, error } = await supabase.functions.invoke('exchange-rates', { body: { base, provider } });
      if (error) throw error;
      const rates: Record<string, number> = fxRes?.rates || {};
      for (const [quote, rate] of Object.entries(rates)) {
        await supabase.rpc('upsert_exchange_rate', { p_base: base, p_quote: quote, p_rate: rate, p_provider: provider });
      }
      await supabase.rpc('update_exchange_last_updated', { p_ts: new Date().toISOString(), p_base: base });
      toast.success(`Exchange rates refreshed (${provider.toUpperCase()})`);
    } catch (e: any) {
      toast.error(e?.message || 'Failed to refresh rates');
    }
  };

  if (isLoading || !local) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  return (
    <div className="space-y-6">
      <LocalizationNav />
      <h1 className="text-2xl font-semibold">Currency & Rates</h1>
      <Card className="rounded-xl shadow-sm ring-1 ring-[hsl(var(--surface-soft-yellow-border))] bg-[hsl(var(--surface-soft-yellow))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" /> Currency & Rates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default currency</Label>
            <Select value={local.default_currency || 'EUR'} onValueChange={(v) => save({ default_currency: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Enable exchange rates</Label>
              <p className="text-xs text-muted-foreground">Fetch and cache latest rates. Public API toggle below.</p>
            </div>
            <Switch checked={!!local.exchange_rates_enabled} onCheckedChange={(v) => save({ exchange_rates_enabled: v })} />
          </div>
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={local.exchange_provider || 'ecb'} onValueChange={(v) => save({ exchange_provider: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ecb">ECB (free)</SelectItem>
                <SelectItem value="openexchangerates">OpenExchangeRates</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Public exchange rates API</Label>
              <p className="text-xs text-muted-foreground">Allow public read access to rates (cache only).</p>
            </div>
            <Switch checked={!!local.exchange_rates_public_enabled} onCheckedChange={(v) => save({ exchange_rates_public_enabled: v })} />
          </div>
          <div className="text-xs text-muted-foreground">Last updated: {local.exchange_last_updated ? new Date(local.exchange_last_updated).toLocaleString() : '—'}</div>
          <Button onClick={refreshRates} className="w-full"><RefreshCcw className="h-4 w-4 mr-1" /> Refresh rates now</Button>
        </CardContent>
      </Card>
    </div>
  );
}
