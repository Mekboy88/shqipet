import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function SupabaseHealthCheck() {
  return (
    <AdminLayout title="Backend Health" subtitle="Backend disabled in this preview">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Backend checks unavailable
          </CardTitle>
          <CardDescription>
            All backend and realtime integrations have been removed in this Lovable preview. This page is a static placeholder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No requests are sent and no services are probed. If you re-enable a backend later, this page can be restored.
          </p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
