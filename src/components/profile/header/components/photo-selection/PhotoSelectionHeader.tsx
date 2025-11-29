
import React from 'react';

interface PhotoSelectionHeaderProps {
  selectedAlbum: any;
  onBackClick: () => void;
  onClose: () => void;
}

const PhotoSelectionHeader: React.FC<PhotoSelectionHeaderProps> = ({
  selectedAlbum,
  onBackClick,
  onClose
}) => {
  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#ffffff',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {selectedAlbum && (
          <button 
            onClick={onBackClick}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#374151',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ←
          </button>
        )}
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0'
        }}>
          {selectedAlbum ? selectedAlbum.name : 'Zgjidh foton'}
        </h2>
      </div>
      <button onClick={onClose} style={{
        background: '#e5e7eb',
        border: 'none',
        fontSize: '28px',
        cursor: 'pointer',
        color: '#374151',
        padding: '8px',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
        fontWeight: '200',
        lineHeight: '1',
        paddingTop: '4px'
      }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#d1d5db'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#e5e7eb'}>
        ×
      </button>
    </div>
  );
};

export default PhotoSelectionHeader;
