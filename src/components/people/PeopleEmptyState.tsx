import React from 'react';
import { Users } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

const PeopleEmptyState: React.FC = () => {
  const { t } = useLocalization();
  
  return (
    <div className="px-4 pb-6 pt-4 h-[200px] flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h4 className="text-base font-medium mb-2 text-foreground">
          {t('feed.no_people', 'No suggestions available')}
        </h4>
        <p className="text-sm">
          {t('feed.no_people_description', 'Connect with more people to see suggestions')}
        </p>
      </div>
    </div>
  );
};

export default PeopleEmptyState;