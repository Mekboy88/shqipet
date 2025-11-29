import React, { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateStoryCard from "./CreateStoryCard";
import StoryCard from "./StoryCard";
import { StoryData } from "./types";
import "./stories.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StoriesContainer = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  
  // Function to scroll the container left or right
  const scrollStories = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
      
      // After scrolling right, we should show the left button
      if (direction === 'right') {
        setShowLeftButton(true);
      }
      
      // If we scroll to the beginning, hide the left button
      if (direction === 'left' && scrollContainerRef.current.scrollLeft + scrollAmount <= 0) {
        setShowLeftButton(false);
      }
    }
  };
  
  // Handle scroll event to determine if left button should be visible
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setShowLeftButton(scrollContainerRef.current.scrollLeft > 0);
    }
  };

  // Generate stories with higher quality images
  const stories: StoryData[] = [
    {
      id: 1,
      type: "create",
      user: {
        name: "Create story",
        image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
      },
      image: ""
    },
    {
      id: 2,
      user: {
        name: "Jane Doe",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
      },
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=100",
      label: "Tech Work"
    },
    {
      id: 3,
      user: {
        name: "John Smith",
        image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=100&q=80"
      },
      image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=90",
      label: "Grey Kitten"
    }
  ];

  // Add more stories to fill the scroll area
  const extraStories: StoryData[] = [];
  for (let i = 11; i <= 50; i++) {
    extraStories.push({
      id: i,
      user: {
        name: `User ${i}`,
        image: stories[i % 10 + 1]?.user.image || stories[1].user.image
      },
      image: stories[i % 9 + 1]?.image || stories[1].image,
      label: `Cat ${i}`
    });
  }

  const allStories = [...stories, ...extraStories];

  return (
    <div className="w-full stories-container">
      {showLeftButton && (
        <button 
          className="stories-nav-button stories-nav-button-left" 
          onClick={() => scrollStories('left')}
          aria-label="View previous stories"
        >
          <ChevronLeft />
        </button>
      )}
      
      <button 
        className="stories-nav-button stories-nav-button-right" 
        onClick={() => scrollStories('right')}
        aria-label="View more stories"
      >
        <ChevronRight />
      </button>
      
      <div 
        data-horizontal-scroll="true"
        className="flex pb-2 overflow-x-auto hide-scrollbar stories-scroll-container"
        ref={scrollContainerRef}
        onScroll={handleScroll}
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
      >
        {allStories.map((story) => (
          story.type === "create" 
            ? <CreateStoryCard key={story.id} user={story.user} /> 
            : <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default StoriesContainer;
