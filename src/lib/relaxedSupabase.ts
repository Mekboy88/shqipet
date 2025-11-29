import { supabase as strictClient } from '@/integrations/supabase/client';

// Use a relaxed, untyped client to avoid compile-time type errors from legacy schemas/tables
const supabase: any = strictClient as any;
export default supabase;
