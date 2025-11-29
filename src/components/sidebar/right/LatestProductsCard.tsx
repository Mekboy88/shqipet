
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const products: Array<{ name: string; price: string }> = [];

const ProductImage = () => (
    <div className="bg-[#fcfaf6] p-4 rounded-none flex flex-col items-center justify-center text-center h-[120px] border-b">
        <p className="font-bold text-sm text-black">Wowonder Developer</p>
        <p className="text-xs text-black">Help & Support</p>
        <div className="flex items-center text-green-500 font-bold my-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.225.651 4.315 1.731 6.096l.16.287-1.173 4.279 4.387-1.152.265.158z" />
            </svg>
            <span className="text-xl">Phone</span>
        </div>
        <p className="font-bold text-sm text-black">+447577942001</p>
    </div>
);

const LatestProductsCard = () => {
  return (
    <Card className="bg-card rounded-lg border border-border shadow-md w-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-bold text-gray-700">Latest Products</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-white dark:bg-card">
                <ProductImage />
                <div className="p-2 text-center bg-muted dark:bg-muted/20">
                  <p className="font-semibold truncate text-sm">{product.name}</p>
                  <p className="text-sm text-gray-600 font-bold">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">No products available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestProductsCard;
