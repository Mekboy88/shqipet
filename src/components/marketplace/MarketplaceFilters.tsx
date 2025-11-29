
import React from 'react';
import { ChevronDown } from 'lucide-react';

const MarketplaceFilters = () => {
  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className="text-gray-700">Sort by</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className="text-gray-700">Categories</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
            <span className="text-gray-700">Location distance</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
          
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors ml-auto">
            Nearby Shops
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
