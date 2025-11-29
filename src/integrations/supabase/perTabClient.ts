// Per-tab Supabase client with isolated authentication
// Uses sessionStorage to keep auth state strictly within this browser tab
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Generate a unique storage key for this tab
const getTabStorageKey = () => {
  const key = 'sb-tab-id';
  let tabId = sessionStorage.getItem(key);
  
  if (!tabId) {
    tabId = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem(key, tabId);
  }
  
  return `sb-${tabId}`;
};

// Create per-tab client with sessionStorage
export const perTabSupabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: sessionStorage,
      storageKey: getTabStorageKey(),
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);
