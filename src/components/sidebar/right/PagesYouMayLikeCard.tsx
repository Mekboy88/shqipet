import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const PagesYouMayLikeCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
        <h3 className="font-bold text-md">Pages you may like</h3>
        <Button variant="ghost" size="icon">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">No page suggestions available</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PagesYouMayLikeCard;