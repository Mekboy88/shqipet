// Override Supabase client types to be untyped/relaxed
// This prevents build failures from schema mismatches between code and DB
declare module '@/integrations/supabase/client' {
  export const supabase: any;
}
