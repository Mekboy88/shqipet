
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
interface Friend {
  id: number;
  name: string;
  imageUrl: string;
}
interface FriendsSectionProps {
  friends: Friend[];
  totalCount: string;
}
const FriendsSection: React.FC<FriendsSectionProps> = ({
  friends,
  totalCount
}) => {
  const [displayedFriends, setDisplayedFriends] = useState<Friend[]>([]);
  const [friendIndex, setFriendIndex] = useState(0);
  const maxFriendsToDisplay = 9; // 3x3 grid

  // Function to get the next batch of friends
  const getNextFriendBatch = () => {
    if (friends.length <= maxFriendsToDisplay) {
      // If we don't have more than 9 friends, display all of them
      return friends;
    } else {
      // Calculate start index for the rotation
      const startIndex = friendIndex % friends.length;
      // Get next batch wrapping around if we reach the end
      const batch = [];
      for (let i = 0; i < maxFriendsToDisplay; i++) {
        const index = (startIndex + i) % friends.length;
        batch.push(friends[index]);
      }
      return batch;
    }
  };

  // Initialize displayed friends
  useEffect(() => {
    if (friends.length > 0) {
      setDisplayedFriends(getNextFriendBatch());
    }
  }, [friends]); // Re-run when friends prop changes

  // Set up daily rotation timer
  useEffect(() => {
    // Only set up rotation if we have more than the max friends to display
    if (friends.length > maxFriendsToDisplay) {
      // For production, this changes every 24 hours
      const intervalTime = 86400000; // 24 hours in milliseconds

      const intervalId = setInterval(() => {
        setFriendIndex(prevIndex => (prevIndex + maxFriendsToDisplay) % friends.length);
        setDisplayedFriends(getNextFriendBatch());
      }, intervalTime);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [friends, friendIndex]);
  
  return <Card className="p-4 shadow-sm bg-card rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Shokët</h2>
        <span className="text-blue-500 text-sm font-medium hover:underline cursor-pointer">See All Friends</span>
      </div>
      
      <p className="text-gray-500 text-sm mb-3">
        {friends.length === 0 ? "Asnjë miqesi akoma" : `${friends.length} friends`}
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        {displayedFriends.map(friend => <div key={friend.id} className="text-center">
            <div className="aspect-square rounded-md overflow-hidden mb-1">
              {/* Use grey background instead of demo images */}
              <div className="w-full h-full bg-gray-100"></div>
            </div>
          </div>)}
        
        {/* Add empty placeholders if we have less than 9 friends */}
        {Array.from({
        length: Math.max(0, maxFriendsToDisplay - displayedFriends.length)
      }).map((_, i) => <div key={`empty-${i}`} className="text-center">
            <div className="aspect-square rounded-md bg-gray-100 mb-1"></div>
          </div>)}
      </div>
    </Card>;
};
export default FriendsSection;
