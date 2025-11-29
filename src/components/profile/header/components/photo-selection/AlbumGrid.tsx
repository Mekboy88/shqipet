
import React from 'react';
import type { Album } from './photoData';

interface AlbumGridProps {
  albums: Album[];
  onAlbumClick: (album: Album) => void;
}

const AlbumGrid: React.FC<AlbumGridProps> = ({ albums, onAlbumClick }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      width: '100%'
    }}>
      {albums.map((album) => (
        <div 
          key={album.id}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onClick={() => onAlbumClick(album)}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '100%',
            aspectRatio: '1',
            borderRadius: '8px',
            backgroundImage: `url(${album.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            marginBottom: '8px',
            border: '1px solid #e5e7eb'
          }}></div>
          <div style={{
            textAlign: 'center',
            width: '100%'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {album.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#65676b'
            }}>
              {album.photoCount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;
