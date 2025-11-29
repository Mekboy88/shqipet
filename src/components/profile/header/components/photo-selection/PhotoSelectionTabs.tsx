
import React from 'react';

interface PhotoSelectionTabsProps {
  activeTab: 'recent' | 'albums';
  onTabChange: (tab: 'recent' | 'albums') => void;
  selectedAlbum: any;
}

const PhotoSelectionTabs: React.FC<PhotoSelectionTabsProps> = ({
  activeTab,
  onTabChange,
  selectedAlbum
}) => {
  if (selectedAlbum) return null;

  return (
    <div style={{
      padding: '0px 20px',
      display: 'flex',
      gap: '0px',
      background: '#ffffff'
    }}>
      <button 
        onClick={() => onTabChange('recent')}
        style={{
          background: 'none',
          border: 'none',
          padding: '16px 20px',
          color: activeTab === 'recent' ? '#1877f2' : '#65676b',
          fontWeight: '600',
          borderBottom: activeTab === 'recent' ? '3px solid #1877f2' : 'none',
          cursor: 'pointer',
          fontSize: '15px',
          flex: 1,
          textAlign: 'center'
        }}
      >
        Recent photos
      </button>
      <button 
        onClick={() => onTabChange('albums')}
        style={{
          background: 'none',
          border: 'none',
          padding: '16px 20px',
          color: activeTab === 'albums' ? '#1877f2' : '#65676b',
          fontWeight: '600',
          cursor: 'pointer',
          fontSize: '15px',
          flex: 1,
          textAlign: 'center',
          borderBottom: activeTab === 'albums' ? '3px solid #1877f2' : 'none'
        }}
      >
        Photo Albums
      </button>
    </div>
  );
};

export default PhotoSelectionTabs;
