
import React from 'react';
import PhotoGrid from './PhotoGrid';
import AlbumGrid from './AlbumGrid';
import { recentPhotos, albums } from './photoData';
import type { Album, Photo } from './photoData';

interface PhotoDialogContentProps {
  activeTab: 'recent' | 'albums';
  selectedAlbum: Album | null;
  isSliding: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  onAlbumClick: (album: Album) => void;
  onContentScroll: (e: React.UIEvent) => void;
  onPhotoClick?: (photo: Photo) => void;
}

const PhotoDialogContent: React.FC<PhotoDialogContentProps> = ({
  activeTab,
  selectedAlbum,
  isSliding,
  scrollContainerRef,
  onAlbumClick,
  onContentScroll,
  onPhotoClick
}) => {
  return (
    <div style={{
      flex: 1,
      position: 'relative',
      background: '#ffffff',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Main Content Container */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transform: selectedAlbum ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div 
          ref={!selectedAlbum ? scrollContainerRef : undefined}
          style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            overflowX: 'hidden',
            touchAction: 'pan-y',
            isolation: 'isolate',
            scrollBehavior: 'smooth'
          }}
          onScroll={onContentScroll}
        >
          {activeTab === 'recent' ? (
            <PhotoGrid photos={recentPhotos} onPhotoClick={onPhotoClick} />
          ) : (
            <AlbumGrid albums={albums} onAlbumClick={onAlbumClick} />
          )}
        </div>
      </div>

      {/* Album Photos View */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '100%',
        width: '100%',
        height: '100%',
        transform: selectedAlbum ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 0.3s ease-in-out, opacity 0.15s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        opacity: isSliding ? 0 : 1
      }}>
        {selectedAlbum && (
          <div 
            ref={selectedAlbum ? scrollContainerRef : undefined}
            style={{
              flex: 1,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              overflowY: 'auto',
              overflowX: 'hidden',
              touchAction: 'pan-y',
              isolation: 'isolate',
              scrollBehavior: 'smooth'
            }}
            onScroll={onContentScroll}
          >
            <PhotoGrid photos={selectedAlbum.photos} onPhotoClick={onPhotoClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoDialogContent;
