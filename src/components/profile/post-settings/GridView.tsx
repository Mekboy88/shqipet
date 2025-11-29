
import React from 'react';
import { Card } from '@/components/ui/card';
import { MonthSection } from './types';

interface GridViewProps {
  postsByMonth: MonthSection[];
}

const GridView: React.FC<GridViewProps> = ({ postsByMonth }) => {
  return (
    <div className="space-y-6">
      {postsByMonth.map((section) => (
        <Card key={`${section.month}-${section.year}`} className="p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-3">{section.month} {section.year}</h3>
          
          <div className="space-y-6">
            {section.posts.map((post) => (
              <div key={post.id} className="border-t border-gray-200 pt-4 first:border-t-0 first:pt-0">
                <div className="flex items-center mb-3">
                  <img 
                    src={post.user.image} 
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{post.user.name}</p>
                    <p className="text-xs text-gray-500">{post.date} · {post.privacy}</p>
                  </div>
                </div>
                
                {post.content && (
                  <p className="mb-3 text-sm">{post.content}</p>
                )}
                
                {post.photos && post.photos.length > 0 && (
                  <div className={`grid ${post.photos.length === 1 ? 'grid-cols-1' : 
                    post.photos.length === 2 ? 'grid-cols-2' : 
                    post.photos.length === 3 ? 'grid-cols-2' : 
                    post.photos.length >= 4 ? 'grid-cols-2' : ''} gap-1`}>
                    {post.photos.map((photo, index) => {
                      // Only show first 4 photos in grid view
                      if (index >= 4) return null;
                      
                      return (
                        <div 
                          key={photo.id} 
                          className={`${post.photos.length === 3 && index === 0 ? 'col-span-2' : ''} 
                                    aspect-square overflow-hidden rounded-md relative`}
                        >
                          <img 
                            src={photo.url} 
                            alt={`Photo ${photo.id}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Show +X more if there are more than 4 photos */}
                          {index === 3 && post.photos.length > 4 && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white text-2xl font-bold">
                                +{post.photos.length - 4}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GridView;
