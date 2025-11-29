
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Image, Video, Plus } from 'lucide-react';
import LiveIcon from '@/components/icons/LiveIcon';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/Avatar';

const CreatePostCard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleOpenCreatePost = () => {
    navigate('/create-post');
  };

  return (
    <>
      <Card 
        data-create-post-card 
        className="p-4 mb-4 shadow-sm bg-card rounded-2xl cursor-pointer" 
        onClick={handleOpenCreatePost}
      >
          <div className="flex items-center space-x-3">
            <Avatar size="md" className="h-10 w-10" />
            <div
              role="button"
              aria-label="Open create post"
              title="Çdo moment është një fillim i ri"
              className="flex items-center gap-2 flex-1 bg-secondary rounded-lg px-4 py-2.5 text-muted-foreground cursor-pointer hover:bg-secondary/80 text-left"
            >
              <span>Çdo moment është një fillim i ri</span>
              <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-600 flex-shrink-0">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z"></path>
              </svg>
            </div>
          </div>
        
        <Separator className="my-3" />
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button 
            variant="secondary" 
            className="h-10 rounded-full font-medium text-xs sm:text-sm"
            onClick={handleOpenCreatePost}
          >
            <Image className="w-5 h-5 mr-2 text-blue-500" />
            Upload Images
          </Button>
          <Button 
            variant="secondary" 
            className="h-10 rounded-full font-medium text-xs sm:text-sm"
            onClick={handleOpenCreatePost}
          >
            <Video className="w-5 h-5 mr-2 text-green-500" />
            Upload Video
          </Button>
          <div className="flex items-center justify-center cursor-pointer" onClick={handleOpenCreatePost}>
            <LiveIcon className="w-16 h-16 mr-2 text-red-500" />
            <span className="font-medium text-xs sm:text-sm">Live</span>
          </div>
          <Button 
            variant="secondary" 
            className="h-10 rounded-full font-medium text-xs sm:text-sm"
            onClick={handleOpenCreatePost}
          >
            <Plus className="w-5 h-5 mr-2" />
            More
          </Button>
        </div>
      </Card>
    </>
  );
};

export default CreatePostCard;
