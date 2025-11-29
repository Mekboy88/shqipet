import React from 'react';

const ProfileSettingsSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Two Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 h-full flex flex-col">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-6 flex-grow">
              {/* Form fields */}
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 h-full flex flex-col">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-6"></div>
            <div className="space-y-6 flex-grow">
              {/* Form fields */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              ))}
              {/* Contact section with two fields */}
              <div className="space-y-3">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Introduction Card Skeleton */}
      <div className="mt-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 w-full bg-gray-100 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsSkeleton;