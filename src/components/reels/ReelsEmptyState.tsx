
import React from 'react';
import { Play } from 'lucide-react';

const ReelsEmptyState: React.FC = () => {
  return (
    <div className="px-4 pb-6 pt-4 h-[528px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-10 h-10 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-medium mb-2 text-foreground">Nuk ka video të disponueshme</h4>
        <p className="text-sm">Ngarko video nga 5 sekonda deri në 2 minuta për t'i parë këtu</p>
      </div>
    </div>
  );
};

export default ReelsEmptyState;
