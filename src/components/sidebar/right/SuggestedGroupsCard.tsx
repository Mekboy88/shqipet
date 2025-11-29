
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const GroupIcon = () => (
  <div className="bg-red-100 rounded-lg p-4 flex items-center justify-center h-24">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </div>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
)

const groups: Array<{ name: string; members: string }> = [];

const SuggestedGroupsCard = () => {
  return (
    <Card className="dark:bg-[hsl(0,0%,5%)] bg-card rounded-lg shadow-md w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
        <h3 className="font-bold text-md">Suggested groups</h3>
        <Button variant="ghost" size="icon">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {groups.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {groups.map((group) => (
              <div key={group.name} className="border rounded-lg overflow-hidden">
                <GroupIcon />
                <div className="p-2 text-center">
                  <p className="font-bold truncate">{group.name}</p>
                  <p className="text-sm text-gray-500">{group.members}</p>
                  <Button className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-sm h-8">
                    <PlusIcon />
                    Join
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No group suggestions available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestedGroupsCard;
