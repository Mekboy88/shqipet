
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface CoverPhotoOverlayBarProps {
  onCancel: () => void;
  onSave: () => void;
}

const CoverPhotoOverlayBar: React.FC<CoverPhotoOverlayBarProps> = ({
  onCancel,
  onSave
}) => {
  return (
    <div className="fixed top-14 left-0 right-0 bg-black bg-opacity-50 text-white px-4 py-3 flex items-center justify-between z-50">
      <div className="flex items-center gap-2">
        <Globe size={16} />
        <span className="text-sm">Fotoja juaj e kopertinës është publike.</span>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel} 
          className="bg-transparent border-white text-white hover:bg-white hover:text-black"
        >
          Anulo
        </Button>
        <Button 
          size="sm" 
          onClick={onSave} 
          className="bg-gradient-to-r from-red-500 via-red-600 to-red-900 hover:from-red-600 hover:via-red-700 hover:to-red-950 text-white shadow-lg border-0 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
        >
          Ruaj ndryshimet
        </Button>
      </div>
    </div>
  );
};

export default CoverPhotoOverlayBar;
