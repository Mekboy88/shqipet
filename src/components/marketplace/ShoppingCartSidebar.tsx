import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/hooks/useMarketplace';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: {[key: string]: number};
  products: Product[];
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
}

const ShoppingCartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  cartItems,
  products,
  onAddToCart,
  onRemoveFromCart
}) => {
  const cartProducts = products.filter(product => cartItems[product.id]);
  const totalPrice = cartProducts.reduce((sum, product) => 
    sum + (product.price * cartItems[product.id]), 0
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="ml-auto w-full max-w-md bg-card border-l shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {cartProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-primary font-semibold">
                      ${product.price.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onRemoveFromCart(product.id)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Badge variant="secondary">
                        {cartItems[product.id]}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onAddToCart(product.id)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartProducts.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCartSidebar;