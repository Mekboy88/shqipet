import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

export interface Category {
  id: string;
  name: string;
}

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('created_at');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [selectedCategory, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_categories' as any)
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }
      
      setCategories((data as unknown as Category[]) || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('marketplace_products' as any)
        .select(`
          *,
          categories:marketplace_categories(id, name)
        `);

      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      query = query.order(sortBy, { ascending: sortBy === 'price' });

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        return;
      }
      
      setProducts((data as unknown as Product[]) || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[productId] > 1) {
        newItems[productId] -= 1;
      } else {
        delete newItems[productId];
      }
      return newItems;
    });
  };

  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  return {
    products,
    categories,
    loading,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    cartItems,
    addToCart,
    removeFromCart,
    getCartItemCount,
    isCartOpen,
    setIsCartOpen,
  };
};