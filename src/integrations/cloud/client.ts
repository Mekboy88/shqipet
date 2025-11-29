// Lovable Cloud Database Client
// This file is auto-generated when you enable Lovable Cloud
// DO NOT EDIT - This will be replaced when Cloud is activated

import { createClient } from '@supabase/supabase-js';

const cloudUrl = import.meta.env.VITE_SUPABASE_URL || '';
const cloudKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Lovable Cloud Database client - will be fully functional once Lovable Cloud is enabled
export const supabase = cloudUrl && cloudKey
  ? createClient(cloudUrl, cloudKey)
  : createClient('https://placeholder-cloud.lovable.app', 'placeholder-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
