/**
 * Lovable Cloud Database Client
 * 
 * This is your main database interface. When you enable Lovable Cloud,
 * this will automatically connect to your backend database.
 * 
 * Usage:
 * - db.from('table').select()
 * - db.auth.signIn()
 * - db.functions.invoke('function-name')
 */

import { supabase } from '@/integrations/supabase/client';

// Export with clearer naming
export const db = supabase;
export const database = supabase;
export const cloud = supabase;

// Re-export for compatibility with existing code
export { supabase };

export default db;
