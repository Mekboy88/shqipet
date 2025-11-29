
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

const trendingTopics: Array<{ tag: string; posts: string }> = [];

const TrendingCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Trending !</CardTitle>
      </CardHeader>
      <CardContent>
        {trendingTopics.length > 0 ? (
          <ul>
            {trendingTopics.map((topic) => (
              <li key={topic.tag} className="mb-3">
                <a href="#" onClick={(e) => e.preventDefault()} className="font-semibold text-gray-800 hover:underline">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-red-500" />
                    <span>#{topic.tag}</span>
                  </div>
                </a>
                <p className="text-sm text-gray-500 ml-6">{topic.posts} posts</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No trending topics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingCard;
