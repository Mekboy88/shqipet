import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import GlobeLoader from '@/components/ui/GlobeLoader';

interface GlobalSkeletonProps {
  className?: string;
}

export const GlobalSkeleton: React.FC<GlobalSkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Header Skeleton */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar Skeleton */}
        <div className="w-64 border-r border-border bg-card/50 min-h-screen p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4">
              <Skeleton className="h-6 w-16 mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Center Feed */}
          <div className="flex-1 max-w-2xl mx-auto">
            {/* Post Skeletons */}
            <div className="px-4 space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-card border border-border rounded-lg p-6 animate-fade-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {/* Post Header */}
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton 
                      variant="shimmer" 
                      className="h-10 w-10 rounded-full" 
                      style={{ animationDelay: `${i * 0.1}s` }} 
                    />
                    <div className="flex-1">
                      <Skeleton 
                        variant="wave" 
                        className="h-4 w-32 mb-1" 
                        style={{ animationDelay: `${i * 0.1 + 0.1}s` }} 
                      />
                      <Skeleton 
                        variant="shimmer" 
                        className="h-3 w-20" 
                        style={{ animationDelay: `${i * 0.1 + 0.2}s` }} 
                      />
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="space-y-2 mb-4">
                    <Skeleton 
                      variant="wave" 
                      className="h-4 w-full" 
                      style={{ animationDelay: `${i * 0.1 + 0.3}s` }} 
                    />
                    <Skeleton 
                      variant="wave" 
                      className="h-4 w-4/5" 
                      style={{ animationDelay: `${i * 0.1 + 0.4}s` }} 
                    />
                  </div>
                  
                  {/* Media Placeholder */}
                  <Skeleton 
                    variant="shimmer" 
                    className="w-full h-64 rounded-lg mb-4" 
                    style={{ animationDelay: `${i * 0.1 + 0.5}s` }} 
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4">
                    <Skeleton 
                      variant="default" 
                      className="h-8 w-16" 
                      style={{ animationDelay: `${i * 0.1 + 0.6}s` }} 
                    />
                    <Skeleton 
                      variant="default" 
                      className="h-8 w-16" 
                      style={{ animationDelay: `${i * 0.1 + 0.7}s` }} 
                    />
                    <Skeleton 
                      variant="default" 
                      className="h-8 w-16" 
                      style={{ animationDelay: `${i * 0.1 + 0.8}s` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="w-80 border-l border-border bg-card/30 min-h-screen p-4">
            <div className="space-y-6">
              {/* Trending Section */}
              <div className="bg-card border border-border rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Skeleton variant="wave" className="h-5 w-24 mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton 
                        variant="shimmer" 
                        className="h-4 w-20" 
                        style={{ animationDelay: `${0.6 + i * 0.1}s` }} 
                      />
                      <Skeleton 
                        variant="default" 
                        className="h-3 w-8" 
                        style={{ animationDelay: `${0.7 + i * 0.1}s` }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Suggestions Section */}
              <div className="bg-card border border-border rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <Skeleton variant="wave" className="h-5 w-32 mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton 
                        variant="shimmer" 
                        className="h-8 w-8 rounded-full" 
                        style={{ animationDelay: `${0.9 + i * 0.1}s` }} 
                      />
                      <div className="flex-1">
                        <Skeleton 
                          variant="wave" 
                          className="h-4 w-24 mb-1" 
                          style={{ animationDelay: `${1.0 + i * 0.1}s` }} 
                        />
                        <Skeleton 
                          variant="default" 
                          className="h-3 w-16" 
                          style={{ animationDelay: `${1.1 + i * 0.1}s` }} 
                        />
                      </div>
                      <Skeleton 
                        variant="default" 
                        className="h-6 w-16 rounded" 
                        style={{ animationDelay: `${1.2 + i * 0.1}s` }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Activity Section */}
              <div className="bg-card border border-border rounded-lg p-4 animate-fade-in" style={{ animationDelay: '1.1s' }}>
                <Skeleton variant="wave" className="h-5 w-20 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <Skeleton 
                        variant="shimmer" 
                        className="h-6 w-6 rounded-full mt-0.5" 
                        style={{ animationDelay: `${1.2 + i * 0.1}s` }} 
                      />
                      <div className="flex-1">
                        <Skeleton 
                          variant="wave" 
                          className="h-3 w-full mb-1" 
                          style={{ animationDelay: `${1.3 + i * 0.1}s` }} 
                        />
                        <Skeleton 
                          variant="wave" 
                          className="h-3 w-2/3" 
                          style={{ animationDelay: `${1.4 + i * 0.1}s` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC<GlobalSkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`w-full space-y-6 p-6 ${className}`}>      
      {/* Content placeholder blocks with staggered animations */}
      <div className="space-y-4 opacity-70 pt-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i} 
            className="space-y-3 animate-fade-in"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <Skeleton 
              variant="shimmer" 
              className="h-20 w-full rounded-lg" 
              style={{ animationDelay: `${i * 0.1}s` }} 
            />
            <div className="space-y-2">
              <Skeleton 
                variant="wave" 
                className="h-3 w-full" 
                style={{ animationDelay: `${i * 0.1 + 0.2}s` }} 
              />
              <Skeleton 
                variant="wave" 
                className="h-3 w-2/3" 
                style={{ animationDelay: `${i * 0.1 + 0.3}s` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalSkeleton;