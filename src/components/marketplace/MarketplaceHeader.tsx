import React from 'react';
const MarketplaceHeader = () => {
  return <div className="bg-gradient-to-r from-red-400 via-pink-400 to-red-500 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Header Content */}
        <div className="mb-6 my-[30px]">
          <h1 className="text-5xl font-bold mb-4">Market</h1>
          <p className="text-xl opacity-90 mb-6">Buy and Sell products easily at Shqipet</p>
          
          <button className="bg-yellow-300 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold transition-colors">
            My Products
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <input type="text" placeholder="Search for products" className="w-full px-4 py-3 text-gray-700 border-none outline-none text-lg" />
        </div>
      </div>
    </div>;
};
export default MarketplaceHeader;