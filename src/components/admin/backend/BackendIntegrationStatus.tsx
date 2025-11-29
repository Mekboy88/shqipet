import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CloudOff } from 'lucide-react';

const SupabaseIntegrationStatus: React.FC = () => {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudOff className="h-5 w-5" />
            Backend integration removed
          </CardTitle>
          <CardDescription>
            Supabase integration has been fully removed in this Lovable preview. This is a static placeholder component.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            There are no backend calls or realtime connections here. Safe to keep routed without any dependencies.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseIntegrationStatus;
