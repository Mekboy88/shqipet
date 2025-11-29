import React from 'react';
import ProductCard from './ProductCard';
import { marketplaceProducts } from '@/data/marketplaceData';

const MarketplaceGrid = () => {
  return (
    <div className="w-full px-2.5 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
        {marketplaceProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="text-center mt-12">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
          Load more products
        </button>
      </div>
    </div>
  );
};

export default MarketplaceGrid;
