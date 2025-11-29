
import React from 'react';

const UnderConstructionWithRefresh = () => {
  return (
    <div 
      data-scroll-container="true"
      className="h-full w-full overflow-y-auto flex items-center justify-center"
      style={{ 
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none'
      }}
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Admin Page</h2>
        <p className="text-gray-600">This admin page is under construction</p>
      </div>
    </div>
  );
};

export default UnderConstructionWithRefresh;
