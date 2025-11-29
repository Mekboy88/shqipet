
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const CreatePostCardSkeleton: React.FC = () => {
  return (
    <Card className="p-4 shadow-sm bg-card rounded-2xl">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <Skeleton className="h-10 flex-1 rounded-lg" />
      </div>
      <Separator className="my-3" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 rounded-full" />
        ))}
      </div>
    </Card>
  );
};

export default CreatePostCardSkeleton;
