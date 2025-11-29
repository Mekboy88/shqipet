import React from 'react';
import { Radio } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

const LiveEmptyState: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className="px-4 pb-6 pt-4 h-[300px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Radio className="w-10 h-10 text-muted-foreground" />
        </div>
        <h4 className="text-lg font-medium mb-2 text-foreground">
          {t('feed.no_live', 'No live streams')}
        </h4>
        <p className="text-sm">
          {t('feed.no_live_description', 'Check back later for live content')}
        </p>
      </div>
    </div>
  );
};

export default LiveEmptyState;