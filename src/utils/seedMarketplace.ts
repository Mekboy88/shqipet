import { supabase } from '@/integrations/supabase/client';

export const seedMarketplace = async () => {
  try {
    // Insert categories first
    const categories = [
      { id: 'cat-1', name: 'Electronics' },
      { id: 'cat-2', name: 'Clothing' },
      { id: 'cat-3', name: 'Home & Garden' },
      { id: 'cat-4', name: 'Sports & Outdoors' },
      { id: 'cat-5', name: 'Books' },
      { id: 'cat-6', name: 'Services' }
    ];

    const { error: catError } = await supabase
      .from('marketplace_categories' as any)
      .upsert(categories);

    if (catError) {
      console.error('Error seeding categories:', catError);
      return;
    }

    // Insert sample products
    const products = [
      {
        id: 'prod-1',
        title: 'Laptop Computer',
        description: 'High-performance laptop perfect for work and gaming',
        price: 899.99,
        category_id: 'cat-1',
        seller_id: 'user-1',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'
      },
      {
        id: 'prod-2', 
        title: 'Smartphone',
        description: 'Latest model smartphone with amazing camera',
        price: 599.99,
        category_id: 'cat-1',
        seller_id: 'user-2',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
      },
      {
        id: 'prod-3',
        title: 'Designer T-Shirt',
        description: 'Comfortable cotton t-shirt with modern design',
        price: 29.99,
        category_id: 'cat-2',
        seller_id: 'user-1',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
      },
      {
        id: 'prod-4',
        title: 'Coffee Table',
        description: 'Modern wooden coffee table for your living room',
        price: 149.99,
        category_id: 'cat-3',
        seller_id: 'user-3',
        image_url: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400'
      },
      {
        id: 'prod-5',
        title: 'Basketball',
        description: 'Professional basketball for outdoor games',
        price: 24.99,
        category_id: 'cat-4',
        seller_id: 'user-2',
        image_url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400'
      },
      {
        id: 'prod-6',
        title: 'Programming Guide',
        description: 'Complete guide to modern web development',
        price: 39.99,
        category_id: 'cat-5',
        seller_id: 'user-1',
        image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
      }
    ];

    const { error: prodError } = await supabase
      .from('marketplace_products' as any)
      .upsert(products);

    if (prodError) {
      console.error('Error seeding products:', prodError);
      return;
    }

    console.log('Marketplace seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding marketplace:', error);
    return false;
  }
};