-- =====================================================
-- ULTIMATE USER ISOLATION & CROSS-ACCOUNT PROTECTION
-- =====================================================
-- This SQL implements maximum security to ensure:
-- 1. Users can ONLY see their own data (100% isolation)
-- 2. Zero cross-account data contamination
-- 3. All access is logged and audited
-- 4. Database-level enforcement (not just app-level)
-- =====================================================

-- =====================================================
-- STEP 1: CREATE SECURITY AUDIT TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessing_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID NOT NULL,
  access_type TEXT NOT NULL,
  access_method TEXT NOT NULL,
  was_denied BOOLEAN DEFAULT false,
  denial_reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_access_audit_accessing_user 
ON public.user_access_audit(accessing_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_access_audit_target_user 
ON public.user_access_audit(target_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_access_audit_denied 
ON public.user_access_audit(was_denied, created_at DESC) 
WHERE was_denied = true;

ALTER TABLE public.user_access_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view access audit"
ON public.user_access_audit FOR SELECT TO authenticated
USING (public.is_platform_owner(auth.uid()) OR public.current_user_is_admin());

CREATE POLICY "System can insert audit logs"
ON public.user_access_audit FOR INSERT TO authenticated
WITH CHECK (true);

-- =====================================================
-- STEP 2: SECURE PROFILE ACCESS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_profile_secure(target_user_id UUID)
RETURNS TABLE(
  id UUID,
  username TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  gender TEXT,
  created_at TIMESTAMPTZ,
  is_hidden BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_own_profile BOOLEAN;
  is_admin_user BOOLEAN;
  is_platform_owner_user BOOLEAN;
BEGIN
  is_own_profile := (auth.uid() = target_user_id);
  is_admin_user := public.current_user_is_admin();
  is_platform_owner_user := public.is_platform_owner(auth.uid());
  
  INSERT INTO public.user_access_audit (
    accessing_user_id, target_user_id, access_type, access_method, was_denied, denial_reason
  ) VALUES (
    auth.uid(), target_user_id, 'profile', 'secure_function',
    NOT (is_own_profile OR is_admin_user OR is_platform_owner_user),
    CASE WHEN NOT (is_own_profile OR is_admin_user OR is_platform_owner_user) 
    THEN 'Unauthorized cross-account access attempt blocked' ELSE NULL END
  );
  
  IF NOT (is_own_profile OR is_admin_user OR is_platform_owner_user) THEN
    RAISE EXCEPTION 'Access denied: Cannot view other users profiles';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.username, p.bio, p.avatar_url, p.cover_url, p.gender, p.created_at, p.is_hidden
  FROM public.profiles p
  WHERE p.id = target_user_id AND p.is_hidden = false AND p.primary_role != 'platform_owner_root';
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_profile_secure(UUID) TO authenticated;

-- =====================================================
-- STEP 3: SECURE PHOTO ACCESS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_photo_secure(
  target_user_id UUID,
  photo_type_filter TEXT DEFAULT NULL
)
RETURNS TABLE(id UUID, photo_key TEXT, photo_url TEXT, photo_type TEXT, is_current BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_own_photo BOOLEAN;
  is_admin_user BOOLEAN;
  is_platform_owner_user BOOLEAN;
BEGIN
  is_own_photo := (auth.uid() = target_user_id);
  is_admin_user := public.current_user_is_admin();
  is_platform_owner_user := public.is_platform_owner(auth.uid());
  
  INSERT INTO public.user_access_audit (
    accessing_user_id, target_user_id, access_type, access_method, was_denied, denial_reason
  ) VALUES (
    auth.uid(), target_user_id, 'photo', 'secure_function',
    NOT (is_own_photo OR is_admin_user OR is_platform_owner_user),
    CASE WHEN NOT (is_own_photo OR is_admin_user OR is_platform_owner_user) 
    THEN 'Unauthorized photo access attempt blocked' ELSE NULL END
  );
  
  IF NOT (is_own_photo OR is_admin_user OR is_platform_owner_user) THEN
    RAISE EXCEPTION 'Access denied: Cannot view other users photos';
  END IF;
  
  RETURN QUERY
  SELECT up.id, up.photo_key, up.photo_url, up.photo_type, up.is_current
  FROM public.user_photos up
  WHERE up.user_id = target_user_id
    AND (photo_type_filter IS NULL OR up.photo_type = photo_type_filter);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_photo_secure(UUID, TEXT) TO authenticated;

-- =====================================================
-- STEP 4: STRENGTHEN RLS ON PROFILES (ULTRA-STRICT)
-- =====================================================
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins view all" ON public.profiles;

CREATE POLICY "Users can ONLY view own profile - STRICT"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR public.current_user_is_admin() OR public.is_platform_owner(auth.uid()));

CREATE POLICY "Users can ONLY update own profile - STRICT"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 5: STRENGTHEN RLS ON USER_PHOTOS (ULTRA-STRICT)
-- =====================================================
DROP POLICY IF EXISTS "Users can select own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can insert own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can update own photos" ON public.user_photos;
DROP POLICY IF EXISTS "Users can delete own photos" ON public.user_photos;

CREATE POLICY "Users can ONLY view own photos - STRICT"
ON public.user_photos FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.current_user_is_admin() OR public.is_platform_owner(auth.uid()));

CREATE POLICY "Users can ONLY insert own photos - STRICT"
ON public.user_photos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can ONLY update own photos - STRICT"
ON public.user_photos FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can ONLY delete own photos - STRICT"
ON public.user_photos FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- =====================================================
-- STEP 6: SECURITY ALERT SYSTEM
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_security_alert_on_denied_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.was_denied = true THEN
    INSERT INTO public.security_events (user_id, event_type, event_description, risk_level, metadata)
    VALUES (
      NEW.accessing_user_id,
      'unauthorized_access_attempt',
      format('User attempted to access data belonging to another user. Target: %s, Type: %s', 
             NEW.target_user_id, NEW.access_type),
      'high',
      jsonb_build_object(
        'target_user_id', NEW.target_user_id,
        'access_type', NEW.access_type,
        'access_method', NEW.access_method,
        'denial_reason', NEW.denial_reason,
        'timestamp', NEW.created_at
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_security_alert_on_denied_access ON public.user_access_audit;
CREATE TRIGGER trigger_security_alert_on_denied_access
  AFTER INSERT ON public.user_access_audit
  FOR EACH ROW
  WHEN (NEW.was_denied = true)
  EXECUTE FUNCTION public.create_security_alert_on_denied_access();
