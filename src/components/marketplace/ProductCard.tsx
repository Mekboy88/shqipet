
import React from 'react';
import { MessageCircle, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  image?: string; // Made optional
  seller: string;
  contact: string;
  backgroundColor?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Category Badge */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-black text-white px-3 py-1 text-sm rounded">
            {product.category}
          </span>
        </div>
        
        {/* Product Image/Content */}
        <div 
          className="h-48 flex items-center justify-center text-white relative"
          style={{ backgroundColor: product.backgroundColor || '#e5e7eb' }}
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-4">
              <h3 className="font-bold text-black mb-2">{product.seller}</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-white" />
                </div>
                <span className="text-green-500 font-bold text-lg">Phone</span>
              </div>
              <div className="text-black font-bold text-lg">{product.contact}</div>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <MessageCircle size={18} className="text-gray-600" />
          </button>
          <button className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors">
            <ShoppingCart size={18} className="text-white" />
          </button>
        </div>
        
        <h3 className="font-semibold text-gray-800 mb-2 truncate">{product.title}</h3>
        <div className="text-green-600 font-bold text-lg">{product.price}</div>
      </div>
    </div>
  );
};

export default ProductCard;
