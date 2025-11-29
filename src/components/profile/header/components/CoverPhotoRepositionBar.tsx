
import React from 'react';
import { Move } from 'lucide-react';

const CoverPhotoRepositionBar: React.FC = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-lg flex items-center gap-2 z-40 py-[7px] my-[-110px] mx-[-60px] px-[16px]">
      <Move size={16} />
      <span className="text-sm">Zvarrit ose përdorni shigjetat për të rivendosur imazhin</span>
    </div>
  );
};

export default CoverPhotoRepositionBar;
