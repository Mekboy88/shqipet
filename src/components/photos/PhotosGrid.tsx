import React from 'react';
import { useQuery } from '@tanstack/react-query';
import supabase from '@/lib/relaxedSupabase';
import { Card } from '@/components/ui/card';

interface Post {
  id: string;
  content_images?: string[];
  user_name: string;
  created_at: string;
  post_type: string;
}

const PhotosGrid: React.FC = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['photo-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .not('content_images', 'is', null)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Post[];
    },
  });

  // Filter posts that have images and extract all image URLs
  const allPhotos = posts
    .filter(post => post.content_images && post.content_images.length > 0)
    .flatMap(post => 
      post.content_images?.map((imageUrl, index) => ({
        id: `${post.id}-${index}`,
        url: imageUrl,
        postId: post.id,
        userName: post.user_name,
        createdAt: post.created_at,
      })) || []
    );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-400 text-2xl">📷</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Nuk ka foto ende
        </h3>
        <p className="text-gray-600">
          Fotot do të shfaqen këtu kur të postohen.
        </p>
      </Card>
    );
  }

  // Create the grid pattern: 4 normal cards, then 1 big card, repeat
  const renderPhotoGrid = () => {
    const gridItems = [];
    let photoIndex = 0;

    while (photoIndex < allPhotos.length) {
      // Add 4 normal cards
      const normalCards = [];
      for (let i = 0; i < 4 && photoIndex < allPhotos.length; i++) {
        const photo = allPhotos[photoIndex];
        normalCards.push(
          <Card
            key={photo.id}
            className="aspect-square overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
          >
            <img
              src={photo.url}
              alt={`Photo by ${photo.userName}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Card>
        );
        photoIndex++;
      }

      // Add the 4 normal cards in a 2x2 grid
      if (normalCards.length > 0) {
        gridItems.push(
          <div key={`normal-group-${photoIndex}`} className="grid grid-cols-2 gap-4">
            {normalCards}
          </div>
        );
      }

      // Add 1 big card if there's a photo available
      if (photoIndex < allPhotos.length) {
        const bigPhoto = allPhotos[photoIndex];
        gridItems.push(
          <Card
            key={bigPhoto.id}
            className="aspect-square overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group col-span-full"
          >
            <img
              src={bigPhoto.url}
              alt={`Photo by ${bigPhoto.userName}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Card>
        );
        photoIndex++;
      }
    }

    return gridItems;
  };

  return (
    <div className="space-y-4">
      {renderPhotoGrid()}
    </div>
  );
};

export default PhotosGrid;