import React, { useState } from 'react';
import { useUserPhotos } from '@/hooks/useUserPhotos';
import { AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Camera, Grid, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  const { photos, galleryPhotos, loading } = useUserPhotos();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedType, setSelectedType] = useState<'all' | 'profile' | 'cover' | 'gallery'>('all');
  
  const filteredPhotos = selectedType === 'all' 
    ? photos 
    : photos.filter(photo => photo.photo_type === selectedType);

  const getPhotoTypeLabel = (type: string) => {
    switch (type) {
      case 'profile': return 'Profile Photo';
      case 'cover': return 'Cover Photo';
      case 'gallery': return 'Gallery';
      default: return 'Photo';
    }
  };

  const getPhotoTypeLabelAlbanian = (type: string) => {
    switch (type) {
      case 'profile': return 'foto avatari';
      case 'cover': return 'foto kopertine';
      default: return null;
    }
  };

  const getPhotoTypeColor = (type: string) => {
    switch (type) {
      case 'profile': return 'bg-blue-100 text-blue-800';
      case 'cover': return 'bg-green-100 text-green-800';
      case 'gallery': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <div className="w-8 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Profile
            </button>
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {filteredPhotos.length} photos
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto">
          {[
            { key: 'all' as const, label: 'All Photos', count: photos.length },
            { key: 'profile' as const, label: 'Profile Photos', count: photos.filter(p => p.photo_type === 'profile').length },
            { key: 'cover' as const, label: 'Cover Photos', count: photos.filter(p => p.photo_type === 'cover').length },
            { key: 'gallery' as const, label: 'Gallery', count: photos.filter(p => p.photo_type === 'gallery').length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedType(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedType === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedType === tab.key ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Photos Grid/List */}
        {filteredPhotos.length === 0 ? (
          <Card className="p-8 text-center">
            <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-4">
              {selectedType === 'all' 
                ? 'Upload profile or cover photos to see them here'
                : `No ${selectedType} photos uploaded yet`
              }
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Profile
            </button>
          </Card>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-4'
          }>
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className={
                viewMode === 'grid' 
                  ? 'relative group'
                  : 'bg-white rounded-lg shadow-sm border p-4 flex items-center gap-4'
              }>
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square rounded-lg overflow-hidden cursor-pointer relative">
                      <AvatarImage
                        src={photo.photo_key}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {/* Albanian label at bottom for avatar and cover photos only */}
                      {getPhotoTypeLabelAlbanian(photo.photo_type) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 text-center">
                          {getPhotoTypeLabelAlbanian(photo.photo_type)}
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPhotoTypeColor(photo.photo_type)}`}>
                        {getPhotoTypeLabel(photo.photo_type)}
                      </span>
                    </div>
                    {photo.is_current && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Current
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <AvatarImage
                        src={photo.photo_key}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPhotoTypeColor(photo.photo_type)}`}>
                          {getPhotoTypeLabel(photo.photo_type)}
                        </span>
                        {photo.is_current && (
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {photo.original_filename || 'Untitled'}
                      </p>
                      <p className="text-xs text-gray-400">
                        Uploaded {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery;