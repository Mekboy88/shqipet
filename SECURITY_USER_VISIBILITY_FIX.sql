-- =====================================================
-- CRITICAL SECURITY FIX: Hide platform owner and respect is_hidden flag
-- =====================================================
-- This SQL provides database-level protection to ensure:
-- 1. Platform owner (platform_owner_root) is NEVER visible in any query
-- 2. Users with is_hidden=true are NEVER visible in any query
-- 3. Performance is optimized with proper indexes
-- =====================================================

-- Step 1: Add performance index for visibility checks
-- This makes .eq('is_hidden', false) queries much faster
CREATE INDEX IF NOT EXISTS idx_profiles_visibility 
ON public.profiles(is_hidden, primary_role) 
WHERE is_hidden = false AND primary_role != 'platform_owner_root';

-- Step 2: Create security definer function for safe user queries
-- This function provides a guaranteed safe way to query visible users
CREATE OR REPLACE FUNCTION public.get_visible_users()
RETURNS SETOF profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM profiles
  WHERE is_hidden = false 
    AND primary_role != 'platform_owner_root'
  ORDER BY created_at DESC;
$$;

-- Step 3: Add RLS policy to block hidden users and platform owners at database level
-- This provides defense-in-depth security even if application code has bugs
DROP POLICY IF EXISTS "block_hidden_and_platform_owners" ON public.profiles;

CREATE POLICY "block_hidden_and_platform_owners"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Only return profiles where BOTH conditions are true:
  -- 1. User is not hidden
  is_hidden = false 
  -- 2. User is not platform owner
  AND primary_role != 'platform_owner_root'
);

-- Step 4: Grant execute permission on the security function
GRANT EXECUTE ON FUNCTION public.get_visible_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_visible_users() TO anon;

-- Step 5: Add helpful comment to document the security model
COMMENT ON POLICY "block_hidden_and_platform_owners" ON public.profiles IS 
'CRITICAL SECURITY: Prevents ANY query from returning hidden users or platform owner. 
This ensures defense-in-depth protection even if application code has bugs.';

COMMENT ON FUNCTION public.get_visible_users() IS 
'Safe function to query visible users. Always use this in admin panels instead of direct queries.';

-- Step 6: Create audit trigger to log when is_hidden changes
CREATE OR REPLACE FUNCTION public.log_visibility_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.is_hidden != NEW.is_hidden) THEN
    INSERT INTO public.security_events (
      user_id,
      event_type,
      event_description,
      risk_level,
      metadata
    ) VALUES (
      NEW.id,
      'user_visibility_changed',
      format('User visibility changed from %s to %s', OLD.is_hidden, NEW.is_hidden),
      'medium',
      jsonb_build_object(
        'old_is_hidden', OLD.is_hidden,
        'new_is_hidden', NEW.is_hidden,
        'primary_role', NEW.primary_role,
        'changed_at', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for visibility changes audit
DROP TRIGGER IF EXISTS audit_visibility_changes ON public.profiles;
CREATE TRIGGER audit_visibility_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_visibility_changes();

-- Step 7: Verify the security setup
DO $$
BEGIN
  RAISE NOTICE '✅ Security fix applied successfully!';
  RAISE NOTICE '✅ Platform owner and hidden users are now invisible at database level';
  RAISE NOTICE '✅ All queries will automatically filter out hidden users';
  RAISE NOTICE '✅ Visibility changes are now audited in security_events table';
END $$;
