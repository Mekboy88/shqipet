import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronDown, Filter } from 'lucide-react';
import { usePosts } from '@/contexts/PostsContext';
import Post from '@/components/Post';
import { formatTimeAgo } from '@/contexts/posts/utils';

interface HistoryItem {
  id: string;
  date: string;
  posts: any[];
  type: 'posts' | 'activity';
}

const HistoryPage: React.FC = () => {
  const { posts } = usePosts();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'posts' | 'activity'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Generate historical data with better distribution of older dates
  const generateHistoryData = (): HistoryItem[] => {
    const historyItems: HistoryItem[] = [];
    const today = new Date();
    
    // Generate data for past 365 days with better distribution
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Better probability distribution - more recent dates have higher chance
      let probability = 0.4; // Base probability
      if (i <= 7) probability = 0.8; // Last week - high chance
      else if (i <= 30) probability = 0.6; // Last month - medium-high chance
      else if (i <= 90) probability = 0.4; // Last 3 months - medium chance
      else probability = 0.25; // Older than 3 months - lower but still reasonable chance
      
      // Skip some days based on probability
      if (Math.random() > probability) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate 1-4 posts per day with varied distribution
      const numPosts = Math.floor(Math.random() * 4) + 1;
      const dayPosts = posts.filter((_, index) => (index + i) % 7 === 0).slice(0, numPosts);
      
      if (dayPosts.length > 0) {
        historyItems.push({
          id: `history-${dateStr}`,
          date: dateStr,
          posts: dayPosts.map(post => ({
            ...post,
            timestamp: date.toISOString()
          })),
          type: 'posts'
        });
      }
    }
    
    // Also add some guaranteed older entries to ensure we have historical data
    const guaranteedOldDates = [
      30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
    ];
    
    guaranteedOldDates.forEach(daysAgo => {
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];
      
      // Check if we already have this date
      const exists = historyItems.some(item => item.date === dateStr);
      if (!exists) {
        const oldPosts = posts.filter((_, index) => index % 3 === 0).slice(0, 2);
        if (oldPosts.length > 0) {
          historyItems.push({
            id: `history-${dateStr}`,
            date: dateStr,
            posts: oldPosts.map(post => ({
              ...post,
              timestamp: date.toISOString()
            })),
            type: 'posts'
          });
        }
      }
    });
    
    return historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistoryData(generateHistoryData());
  }, [posts]);

  const formatHistoryDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getYearsWithHistory = (): number[] => {
    const years = [...new Set(historyData.map(item => new Date(item.date).getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  const filteredHistory = historyData.filter(item => 
    (selectedFilter === 'all' || item.type === selectedFilter) &&
    new Date(item.date).getFullYear() === selectedYear
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Your History</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Year Filter */}
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getYearsWithHistory().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'posts' | 'activity')}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Activity</option>
                  <option value="posts">Posts Only</option>
                  <option value="activity">Activity Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No history found</h3>
            <p className="text-gray-500">No activity found for the selected time period.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHistory.map((historyItem) => (
              <div key={historyItem.id} className="bg-white rounded-lg shadow-sm">
                {/* Date Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {formatHistoryDate(historyItem.date)}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {new Date(historyItem.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {historyItem.posts.length} {historyItem.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </div>
                
                {/* Posts */}
                <div className="p-6 space-y-4">
                  {historyItem.posts.map((post, index) => (
                    <div key={`${historyItem.id}-${index}`} className="transform scale-95 origin-top">
                      <Post post={post} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
