
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

// Define the Review interface based on the InterestItem properties we're using
interface Review {
  id: number;
  name: string;
  review: string;  // This is required
  imageUrl?: string;
  isPrivate?: boolean;
}

interface ReviewsTabProps {
  reviews: Review[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, activeTab, setActiveTab }) => {
  const tabOptions = [
    { id: 'all-reviews', label: 'All Reviews' }
  ];
  
  return (
    <div className="w-full">
      {/* Reviews tabs navigation */}
      <div className="flex border-b mb-4">
        {tabOptions.map((tab) => (
          <Button 
            key={tab.id}
            variant="ghost"
            className={`py-2 px-4 rounded-none font-medium ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      
      {/* Reviews content */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center mb-3">
                <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 mr-3">
                  {review.imageUrl ? (
                    <img src={review.imageUrl} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Star className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  {review.isPrivate && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Private
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-700 text-sm">{review.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Star size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500">No reviews to display</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
