import React from 'react';

const SettingsSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="h-6 w-44 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSkeleton;