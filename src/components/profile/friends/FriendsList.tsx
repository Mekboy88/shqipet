
import React from 'react';
import { Button } from '@/components/ui/button';

interface Friend {
  id: number;
  name: string;
  imageUrl: string;
  mutualFriends?: string;
  work?: string;
  location?: string;
  education?: string;
  category: string[];
}

interface FriendsListProps {
  friends: Friend[];
  activeFriendCategory: string;
  setActiveFriendCategory: (category: string) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  activeFriendCategory,
  setActiveFriendCategory
}) => {
  const categories = [
    { id: 'all', label: 'All friends' },
    { id: 'birthdays', label: 'Birthdays' },
    { id: 'work', label: 'Work' },
    { id: 'current', label: 'Current city' },
    { id: 'hometown', label: 'Hometown' },
    { id: 'following', label: 'Following' },
  ];

  const filteredFriends = friends.filter(
    friend => friend.category.includes(activeFriendCategory)
  );

  return (
    <div>
      {/* Categories Navigation Tabs */}
      <div className="border-b mb-4 flex overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeFriendCategory === category.id 
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActiveFriendCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFriends.map(friend => (
          <div 
            key={friend.id} 
            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={friend.imageUrl} 
                alt={friend.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{friend.name}</h3>
              {friend.mutualFriends && friend.mutualFriends !== '0' && (
                <p className="text-xs text-gray-600">{friend.mutualFriends} mutual friends</p>
              )}
              {friend.work && (
                <p className="text-xs text-gray-600">{friend.work}</p>
              )}
              {friend.location && (
                <p className="text-xs text-gray-600">{friend.location}</p>
              )}
              {friend.education && (
                <p className="text-xs text-gray-600">{friend.education}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </Button>
          </div>
        ))}
      </div>
      
      {/* See All Button */}
      <div className="mt-4">
        <Button variant="secondary" className="w-full py-2">See all</Button>
      </div>
    </div>
  );
};

export default FriendsList;
