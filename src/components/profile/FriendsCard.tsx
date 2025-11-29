import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';

interface FriendItem {
  id: number;
  name: string;
  image: string;
  mutualFriends?: number;
}

interface FriendsCardProps {
  friends: FriendItem[];
  totalCount: number;
  limit?: number;
  showSeeAllButton?: boolean;
  gridCols?: number;
}

const FriendsCard: React.FC<FriendsCardProps> = ({
  friends,
  totalCount,
  limit = 6,
  showSeeAllButton = true,
  gridCols = 3
}) => {
  const displayFriends = limit ? friends.slice(0, limit) : friends;
  
  return (
    <Card className="p-4 shadow-sm mb-4 bg-card border border-border">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Friends</h2>
        {showSeeAllButton && (
          <Button variant="link" className="text-blue-500 p-0">
            See all friends
          </Button>
        )}
      </div>
      
      <p className="text-gray-500 mb-2">{totalCount} friends</p>
      
      <div className="grid grid-cols-3 gap-2">
        {displayFriends.map(friend => (
          <div key={friend.id} className="text-center">
            <div className="flex justify-center mb-1">
              <Avatar
                src={friend.image}
                initials={friend.name.slice(0, 2).toUpperCase()}
                size="xl"
                className="img-locked"
              />
            </div>
            <p className="text-sm font-medium truncate">{friend.name}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FriendsCard;
