import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, BarChart3, Lightbulb, Hash, Users, Heart, MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FollowersIcon from '@/components/icons/FollowersIcon';

interface PostInsightsPanelProps {
  isVisible: boolean;
}

const PostInsightsPanel: React.FC<PostInsightsPanelProps> = ({ isVisible }) => {
  const trendingTags = [
    { tag: '#ShqipetCulture', count: '12.4K', trend: 'up' },
    { tag: '#TechNews', count: '8.2K', trend: 'up' },
    { tag: '#Photography', count: '6.7K', trend: 'up' },
    { tag: '#Travel', count: '5.3K', trend: 'down' },
    { tag: '#FoodLovers', count: '4.9K', trend: 'up' },
  ];

  const styleTips = [
    { icon: Heart, tip: 'Posts with emojis get 23% more reactions', color: 'text-red-500' },
    { icon: MessageSquare, tip: 'Questions increase comments by 35%', color: 'text-blue-500' },
    { icon: Users, tip: 'Tag 2-3 people for better engagement', color: 'text-purple-500' },
    { icon: Hash, tip: 'Use 3-5 hashtags for optimal reach', color: 'text-green-500' },
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3 }}
      className="hidden xl:block fixed right-2 lg:right-4 top-[72px] w-[340px] lg:w-[380px] h-[calc(100vh-88px)] overflow-y-auto space-y-4 pb-4"
    >
      {/* Best Time to Post */}
      <Card className="p-5 bg-card/80 backdrop-blur-xl border-border shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-foreground">Best Time to Post</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's Peak Hours</span>
            <Badge variant="secondary" className="bg-green-500/20 text-green-600 dark:text-green-400">Active Now</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-green-500/10 rounded-lg text-center border border-green-500/20">
              <p className="text-xs text-muted-foreground">Morning</p>
              <p className="font-bold text-green-600 dark:text-green-400">8-10 AM</p>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg text-center border border-blue-500/20">
              <p className="text-xs text-muted-foreground">Lunch</p>
              <p className="font-bold text-blue-600 dark:text-blue-400">12-2 PM</p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg text-center border border-purple-500/20">
              <p className="text-xs text-muted-foreground">Evening</p>
              <p className="font-bold text-purple-600 dark:text-purple-400">7-9 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FollowersIcon className="w-3 h-3" />
            <span>1,234 of your followers are online now</span>
          </div>
        </div>
      </Card>

      {/* Trending Tags */}
      <Card className="p-5 bg-card/80 backdrop-blur-xl border-border shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-foreground">Trending Tags</h3>
        </div>
        <div className="space-y-2">
          {trendingTags.map((item, idx) => (
            <button
              key={idx}
              className="w-full flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                <span className="font-medium text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.tag.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{item.count}</span>
                <TrendingUp className={`w-3 h-3 ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Post Health Meter */}
      <Card className="p-5 bg-card/80 backdrop-blur-xl border-border shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-foreground">Post Health Meter</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Content Quality</span>
              <span className="text-xs font-medium text-muted-foreground">60%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[60%] transition-all duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Media Included</span>
              <span className="text-xs font-medium text-red-500">0%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-400 w-0 transition-all duration-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Hashtags</span>
              <span className="text-xs font-medium text-red-500">0%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-red-400 w-0 transition-all duration-500" />
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Add images and hashtags to boost your post's reach by up to 40%!
            </p>
          </div>
        </div>
      </Card>

      {/* Style Tips */}
      <Card className="p-5 bg-card/80 backdrop-blur-xl border-border shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-foreground">Style Tips</h3>
        </div>
        <div className="space-y-3">
          {styleTips.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 hover:bg-accent rounded-lg transition-colors">
              <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
              <p className="text-sm text-foreground">{item.tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="p-5 bg-gradient-to-br from-red-500/10 to-purple-500/10 border-border shadow-md">
        <h4 className="font-semibold text-foreground mb-3">Your Recent Performance</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">156</p>
            <p className="text-xs text-muted-foreground">Avg. Likes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">42</p>
            <p className="text-xs text-muted-foreground">Avg. Comments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">89</p>
            <p className="text-xs text-muted-foreground">Avg. Shares</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PostInsightsPanel;
