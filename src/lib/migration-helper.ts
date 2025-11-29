/**
 * MIGRATION HELPER
 * 
 * This file provides a central import point during the migration from
 * @/integrations/supabase/client to @/integrations/cloud/client
 * 
 * All files should import from @/lib/database instead
 */

export { supabase, db, database, cloud } from '@/lib/database';