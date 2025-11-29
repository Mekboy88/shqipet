import React from 'react';

// Profile Header Skeleton
export const ProfileHeaderSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
    {/* Cover Photo Skeleton */}
    <div className="w-full facebook-skeleton rounded-t-lg" style={{ height: '300px' }} />
    
    {/* Profile Info Section */}
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6 -mt-16 md:-mt-12">
        {/* Profile Picture */}
        <div className="h-32 w-32 rounded-full facebook-skeleton border-4 border-white flex-shrink-0" />
        
        {/* Profile Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="h-6 w-48 facebook-skeleton rounded mx-auto md:mx-0" />
          <div className="h-4 w-32 facebook-skeleton rounded mx-auto md:mx-0" />
          
          {/* Stats */}
          <div className="flex justify-center md:justify-start space-x-6 mt-4">
            <div className="h-4 w-16 facebook-skeleton rounded" />
            <div className="h-4 w-20 facebook-skeleton rounded" />
            <div className="h-4 w-18 facebook-skeleton rounded" />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <div className="h-9 w-24 facebook-skeleton rounded-lg" />
          <div className="h-9 w-20 facebook-skeleton rounded-lg" />
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex space-x-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-16 facebook-skeleton rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Profile Photos Grid Skeleton
export const ProfilePhotosGridSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="h-6 w-32 facebook-skeleton rounded mb-4" />
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-square facebook-skeleton rounded-lg" />
      ))}
    </div>
  </div>
);

// Profile Videos Grid Skeleton
export const ProfileVideosGridSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
    <div className="h-6 w-28 facebook-skeleton rounded mb-4" />
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-video facebook-skeleton rounded-lg" />
      ))}
    </div>
  </div>
);

// Profile Sidebar Skeleton
export const ProfileSidebarSkeleton = () => (
  <div className="space-y-4">
    {/* Info Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="h-5 w-24 facebook-skeleton rounded mb-3" />
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full facebook-skeleton" />
          <div className="h-3 w-16 facebook-skeleton rounded" />
        </div>
        <div className="h-3 w-20 facebook-skeleton rounded" />
        <div className="h-3 w-18 facebook-skeleton rounded" />
        <div className="h-3 w-16 facebook-skeleton rounded" />
      </div>
    </div>
    
    {/* Albums Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="h-5 w-20 facebook-skeleton rounded mb-3" />
      <div className="text-center py-8">
        <div className="h-4 w-32 facebook-skeleton rounded mx-auto" />
      </div>
    </div>
    
    {/* Following Card */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="h-5 w-24 facebook-skeleton rounded mb-3" />
      <div className="flex items-center space-x-3">
        <div className="h-12 w-12 rounded-full facebook-skeleton" />
        <div className="flex-1">
          <div className="h-4 w-24 facebook-skeleton rounded mb-1" />
          <div className="h-3 w-16 facebook-skeleton rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Profile Settings Skeleton
export const ProfileSettingsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    {/* Header */}
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 facebook-skeleton rounded" />
        <div className="h-8 w-16 facebook-skeleton rounded-lg" />
      </div>
    </div>
    
    {/* Content */}
    <div className="p-6 space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 facebook-skeleton rounded" />
          <div className="h-10 w-full facebook-skeleton rounded-lg" />
        </div>
      ))}
      
      {/* Avatar Section */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="h-16 w-16 rounded-full facebook-skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 facebook-skeleton rounded" />
          <div className="h-8 w-28 facebook-skeleton rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// Main Profile Content Skeleton (combines everything)
export const ProfileContentSkeleton = () => (
  <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 space-y-6">
    <ProfileHeaderSkeleton />
    
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="w-full order-2 lg:order-1 space-y-4">
        <ProfilePhotosGridSkeleton />
        <ProfileVideosGridSkeleton />
      </div>
      
      {/* Sidebar */}
      <div className="w-full lg:w-80 flex-shrink-0 order-1 lg:order-2">
        <ProfileSidebarSkeleton />
      </div>
    </div>
  </div>
);

// Timeline Posts Skeleton
export const ProfileTimelineSkeleton = () => (
  <div className="space-y-4">
    {/* Create Post Skeleton */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-3 mb-4">
        <div className="h-10 w-10 rounded-full facebook-skeleton" />
        <div className="flex-1 h-10 facebook-skeleton rounded-full" />
      </div>
      <div className="flex justify-around pt-3 border-t border-gray-200">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-6 w-6 facebook-skeleton rounded" />
            <div className="h-4 w-12 facebook-skeleton rounded" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Posts */}
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Post Header */}
        <div className="p-4 pb-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full facebook-skeleton flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 facebook-skeleton rounded" />
              <div className="h-2 w-20 facebook-skeleton rounded" />
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="px-4 pb-3">
          <div className="space-y-2">
            <div className="h-3 w-full facebook-skeleton rounded" />
            <div className="h-3 w-4/5 facebook-skeleton rounded" />
          </div>
        </div>
        
        {/* Post Image */}
        <div className="w-full facebook-skeleton" style={{ height: '300px' }} />
        
        {/* Post Actions */}
        <div className="p-4 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="h-5 w-12 facebook-skeleton rounded" />
              <div className="h-5 w-16 facebook-skeleton rounded" />
              <div className="h-5 w-12 facebook-skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);