
import React from 'react';
import { Card } from '@/components/ui/card';

interface FriendsTabProps {
  friendSuggestions: any[];
  totalCount: number;
}

const FriendsTab: React.FC<FriendsTabProps> = ({ friendSuggestions, totalCount }) => {
  return (
    <Card className="p-4 md:p-6 shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-xl md:text-2xl font-semibold">Friends</h2>
        <div className="relative">
          <input type="text" placeholder="Search Friends" className="w-full md:w-auto pl-8 pr-4 py-2 border rounded-md text-sm" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 absolute left-2 top-3 text-gray-500">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
        </div>
      </div>
      <p className="text-gray-500 mb-4 text-sm md:text-base">{totalCount} friends</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {friendSuggestions.map(friend => (
          <div key={friend.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square w-full">
              <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2">
              <h3 className="font-medium text-sm md:text-base">{friend.name}</h3>
              <p className="text-xs text-gray-500">{friend.mutualFriends} mutual friends</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default FriendsTab;
