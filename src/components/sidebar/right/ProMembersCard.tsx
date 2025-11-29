
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';
import Avatar from '@/components/Avatar';
import { Button } from '@/components/ui/button';

const proMembers: Array<{ name: string; image: string }> = [];

const ProMembersCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
        <div className="p-4 bg-muted dark:bg-card rounded-none">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <Crown className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="font-bold text-md text-orange-800">Pro Members</h3>
                </div>
                <Button variant="ghost" className="text-sm font-semibold text-orange-800 bg-white shadow-sm h-8 hover:bg-gray-50">Put Me Here</Button>
            </div>
        </div>
      <CardContent className="p-4">
        {proMembers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {proMembers.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <Avatar 
                  size="xl"
                  src={member.image}
                  initials={member.name.charAt(0)}
                  className="mb-2 img-locked"
                />
                <p className="text-sm font-semibold truncate w-full">{member.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No pro members to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProMembersCard;
