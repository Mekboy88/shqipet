-- ==================================================================
-- FIX: Platform owner visibility toggle should not break admin access
-- Decouple platform owner recognition from `is_hidden`
-- ==================================================================

CREATE OR REPLACE FUNCTION public.is_platform_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND primary_role = 'platform_owner_root'
  );
$function$;

-- Optional notice
DO $$
BEGIN
  RAISE NOTICE '✅ is_platform_owner(_user_id) updated: no longer depends on is_hidden';
END $$;
