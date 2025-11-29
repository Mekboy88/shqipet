
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const PostSkeleton: React.FC = () => {
  return (
    <Card className="bg-card rounded-lg shadow-sm border border-border animate-fade-in">
      {/* Header section */}
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <Skeleton variant="shimmer" className="h-10 w-10 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton variant="wave" className="h-4 w-[150px]" style={{ animationDelay: '0.1s' }} />
            <Skeleton variant="shimmer" className="h-3 w-[100px]" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
      
      {/* Content text */}
      <CardContent className="px-4 pb-2 space-y-2">
        <Skeleton variant="wave" className="h-4 w-full" style={{ animationDelay: '0.3s' }} />
        <Skeleton variant="wave" className="h-4 w-[90%]" style={{ animationDelay: '0.4s' }} />
      </CardContent>
      
      {/* Image placeholder */}
      <Skeleton variant="shimmer" className="w-full aspect-[4/3] rounded-none" style={{ animationDelay: '0.5s' }} />
      
      {/* Stats and user info */}
      <div className="p-4 md:p-6">
        <div className="space-y-2 mb-4">
          <Skeleton variant="wave" className="h-5 w-full" style={{ animationDelay: '0.6s' }} />
          <Skeleton variant="wave" className="h-5 w-[80%]" style={{ animationDelay: '0.7s' }} />
        </div>
        
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <Skeleton variant="default" className="h-4 w-16" style={{ animationDelay: '0.8s' }} />
            <Skeleton variant="default" className="h-4 w-20" style={{ animationDelay: '0.9s' }} />
            <Skeleton variant="default" className="h-6 w-12 rounded" style={{ animationDelay: '1.0s' }} />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton variant="shimmer" className="h-10 w-10 rounded-full flex-shrink-0" style={{ animationDelay: '1.1s' }} />
            <div className="space-y-1 flex-1">
              <Skeleton variant="wave" className="h-4 w-24" style={{ animationDelay: '1.2s' }} />
              <Skeleton variant="shimmer" className="h-3 w-36" style={{ animationDelay: '1.3s' }} />
            </div>
          </div>
          <Skeleton variant="default" className="h-8 w-16 rounded-md" style={{ animationDelay: '1.4s' }} />
        </div>
      </div>
      
      {/* Actions separator */}
      <div className="px-4">
        <Separator />
      </div>
      
      {/* Action buttons */}
      <div className="py-3 px-2">
        <div className="flex justify-around">
          <Skeleton variant="default" className="h-10 w-20" style={{ animationDelay: '1.5s' }} />
          <Skeleton variant="default" className="h-10 w-20" style={{ animationDelay: '1.6s' }} />
          <Skeleton variant="default" className="h-10 w-20" style={{ animationDelay: '1.7s' }} />
        </div>
      </div>
    </Card>
  );
};

export default PostSkeleton;
