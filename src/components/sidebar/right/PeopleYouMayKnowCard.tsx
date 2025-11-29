
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';

const people: Array<{ name: string; image: string }> = [];

const PeopleYouMayKnowCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold">People you may know</CardTitle>
        <Button variant="ghost" size="icon">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent>
        {people.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {people.map((person) => (
              <div key={person.name} className="flex flex-col items-center text-center p-2 border rounded-lg">
                <Avatar 
                  size="xl"
                  src={person.image}
                  initials={person.name.charAt(0)}
                  className="mb-2 img-locked"
                />
                <p className="text-sm font-semibold truncate w-full mb-2">{person.name}</p>
                <Button 
                  className="w-full text-xs font-semibold py-0.5 shadow-sm border" 
                  variant="ghost" 
                  style={{
                    background: 'linear-gradient(to right, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(127, 29, 29, 0.1) 100%)',
                    borderColor: 'rgba(220, 38, 38, 0.3)'
                  }}
                >
                  <span style={{
                    background: 'linear-gradient(to right, #dc2626 0%, #ef4444 50%, #7f1d1d 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}>
                    Më bëj shok
                  </span>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No suggestions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeopleYouMayKnowCard;
