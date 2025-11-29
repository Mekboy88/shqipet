
import React from "react";
import { StoryData } from "./types";

interface StoryCardProps {
  story: StoryData;
}

const StoryCard: React.FC<StoryCardProps> = ({
  story
}) => {
  // Use the story image if available, otherwise use a proper high-quality photo
  const backgroundImage = story.image || "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=100";
  
  return (
    <div className="story-card relative">
      {/* Phone frame border */}
      <div className="absolute inset-0 rounded-[10px] border-[3px] border-black z-20 pointer-events-none">
      </div>
      
      <div className="story-image-container">
        <img 
          src={backgroundImage} 
          alt={story.user.name} 
          className="story-image" 
        />
      </div>
      
      <div className="absolute bottom-2 left-1 right-1 z-10">
        <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-3 py-1.5 w-full border border-white/30">
          <div className="w-5 h-5 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <img 
              src={story.user.image || "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"} 
              alt={story.user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white text-xs font-medium truncate flex-1">{story.label || story.user.name}</p>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
