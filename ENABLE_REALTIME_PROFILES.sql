-- =====================================================
-- REALTIME VISIBILITY FOR PROFILES & ROLES
-- =====================================================
-- Purpose: Ensure UI updates instantly when is_hidden or avatar changes
-- Scope: Enable realtime for profiles, user_roles, and user_photos (for avatars)
-- Safety: No data exposure changes; only publication + replica identity
-- =====================================================

-- 1) Ensure full row data is available for realtime diffs
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER TABLE public.user_photos REPLICA IDENTITY FULL;

-- 2) Add tables to realtime publication (idempotent)
DO $$
BEGIN
  -- Add profiles to publication
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles';
  EXCEPTION WHEN duplicate_object THEN
    -- Already added
    NULL;
  END;

  -- Add user_roles to publication
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles';
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;

  -- Add user_photos to publication (avatar changes cascade)
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.user_photos';
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

-- 3) Helpful notices
DO $$
BEGIN
  RAISE NOTICE '✅ Realtime enabled for profiles, user_roles, user_photos';
  RAISE NOTICE '✅ is_hidden toggle will now update UI instantly';
  RAISE NOTICE '✅ Avatar changes will reflect without page reload';
END $$;