
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from '@/components/ui/card';

export function ActionsLoadingState() {
  return (
    <Card className="p-4">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </Card>
  );
}
