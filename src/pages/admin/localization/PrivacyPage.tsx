import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useWebsiteSettings, useUpdateWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { Loader2, ShieldCheck } from 'lucide-react';
import LocalizationNav from './LocalizationNav';

export default function PrivacyPage() {
  const { data, isLoading } = useWebsiteSettings();
  const update = useUpdateWebsiteSettings();
  const [local, setLocal] = React.useState<any>({});
  React.useEffect(() => { if (data) setLocal(data); }, [data]);
  const save = (patch: any) => { setLocal((p:any)=>({ ...p, ...patch })); update.mutate(patch); };

  if (isLoading || !local) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  return (
    <div className="space-y-6">
      <LocalizationNav />
      <h1 className="text-2xl font-semibold">Privacy & Geolocation</h1>
      <Card className="rounded-xl shadow-sm ring-1 ring-[hsl(var(--surface-soft-red-border))] bg-[hsl(var(--surface-soft-red))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Privacy & Geolocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Enable geolocation</Label>
              <p className="text-xs text-muted-foreground">Detect country/timezone (privacy-first, client only).</p>
            </div>
            <Switch checked={!!local.geolocation_enabled} onCheckedChange={(v) => save({ geolocation_enabled: v })} />
          </div>
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Public geolocation features</Label>
              <p className="text-xs text-muted-foreground">Expose non-identifiable features to public.</p>
            </div>
            <Switch checked={!!local.geolocation_public_enabled} onCheckedChange={(v) => save({ geolocation_public_enabled: v })} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
