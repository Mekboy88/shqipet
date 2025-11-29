CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user',
    'super_admin',
    'platform_owner_root',
    'developer',
    'support'
);


--
-- Name: device_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.device_type AS ENUM (
    'mobile_ios',
    'mobile_android',
    'mobile_web',
    'desktop',
    'laptop',
    'tablet'
);


--
-- Name: permission_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.permission_status AS ENUM (
    'granted',
    'denied',
    'pending',
    'not_requested'
);


--
-- Name: permission_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.permission_type AS ENUM (
    'camera',
    'photo_library',
    'location',
    'notifications',
    'microphone',
    'storage',
    'contacts',
    'calendar'
);


--
-- Name: admin_get_live_operation_metrics(integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.admin_get_live_operation_metrics(p_window_minutes integer DEFAULT 5) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result jsonb;
  window_start timestamptz;
BEGIN
  -- Security: Only admins and platform owners can access
  IF NOT (current_user_is_admin() OR is_platform_owner(auth.uid())) THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Aggregate metrics from real tables
  SELECT jsonb_build_object(
    'window_minutes', p_window_minutes,
    'timestamp', now(),
    'metrics', jsonb_build_object(
      'total_profiles', (SELECT COUNT(*) FROM public.profiles),
      'recent_posts', (SELECT COUNT(*) FROM public.posts WHERE created_at >= window_start),
      'recent_notifications', (SELECT COUNT(*) FROM public.notifications WHERE created_at >= window_start),
      'recent_analytics', (SELECT COUNT(*) FROM public.analytics_events WHERE created_at >= window_start),
      'recent_uploads', (SELECT COUNT(*) FROM public.upload_logs WHERE started_at >= window_start),
      'recent_errors', (SELECT COUNT(*) FROM public.security_events WHERE created_at >= window_start AND risk_level IN ('high', 'critical')),
      'active_tables', 8
    ),
    'recent_events', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'type', event_type,
          'description', event_description,
          'risk_level', risk_level,
          'timestamp', created_at
        ) ORDER BY created_at DESC
      ), '[]'::jsonb)
      FROM (
        SELECT event_type, event_description, risk_level, created_at
        FROM public.security_events
        WHERE created_at >= window_start
        ORDER BY created_at DESC
        LIMIT 10
      ) recent
    )
  ) INTO result;
  
  RETURN result;
END;
$$;


--
-- Name: bump_tabs_count(text, integer, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.bump_tabs_count(p_device_stable_id text, p_delta integer, p_device jsonb DEFAULT '{}'::jsonb) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_new_count integer;
  v_device_id text := COALESCE(p_device->>'deviceId', NULL);
  v_screen_resolution text := COALESCE(p_device->>'screenResolution', NULL);
  v_device_type text := COALESCE(p_device->>'detectedDeviceType', p_device->>'deviceType', NULL);
  v_operating_system text := COALESCE(p_device->>'operatingSystem', NULL);
  v_browser_name text := COALESCE(p_device->>'browserName', NULL);
  v_browser_version text := COALESCE(p_device->>'browserVersion', NULL);
  v_platform text := COALESCE(p_device->>'platform', NULL);
  v_user_agent text := COALESCE(p_device->>'userAgent', NULL);
  v_city text := COALESCE(p_device->>'city', NULL);
  v_country text := COALESCE(p_device->>'country', NULL);
  v_country_code text := COALESCE(p_device->>'country_code', NULL);
  v_region text := COALESCE(p_device->>'region', NULL);
  v_lat double precision := NULL;
  v_lon double precision := NULL;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  BEGIN
    v_lat := (p_device->>'latitude')::double precision;
    v_lon := (p_device->>'longitude')::double precision;
  EXCEPTION WHEN others THEN
    v_lat := NULL; v_lon := NULL;
  END;

  INSERT INTO public.user_sessions (
    user_id, device_id, device_stable_id, device_type, operating_system,
    browser_name, browser_version, screen_resolution, platform, user_agent,
    is_current_device, is_trusted, active_tabs_count,
    city, country, country_code, region, latitude, longitude
  )
  VALUES (
    v_user_id, v_device_id, lower(p_device_stable_id), COALESCE(v_device_type, 'laptop'), v_operating_system,
    v_browser_name, v_browser_version, v_screen_resolution, v_platform, v_user_agent,
    true, false, 1,
    v_city, v_country, v_country_code, v_region, v_lat, v_lon
  )
  ON CONFLICT (user_id, device_stable_id)
  DO UPDATE SET
    active_tabs_count = GREATEST(public.user_sessions.active_tabs_count + p_delta, 0),
    is_current_device = true,
    device_id = COALESCE(EXCLUDED.device_id, public.user_sessions.device_id),
    device_type = COALESCE(EXCLUDED.device_type, public.user_sessions.device_type),
    operating_system = COALESCE(EXCLUDED.operating_system, public.user_sessions.operating_system),
    browser_name = COALESCE(EXCLUDED.browser_name, public.user_sessions.browser_name),
    browser_version = COALESCE(EXCLUDED.browser_version, public.user_sessions.browser_version),
    screen_resolution = COALESCE(EXCLUDED.screen_resolution, public.user_sessions.screen_resolution),
    platform = COALESCE(EXCLUDED.platform, public.user_sessions.platform),
    user_agent = COALESCE(EXCLUDED.user_agent, public.user_sessions.user_agent),
    city = COALESCE(EXCLUDED.city, public.user_sessions.city),
    country = COALESCE(EXCLUDED.country, public.user_sessions.country),
    country_code = COALESCE(EXCLUDED.country_code, public.user_sessions.country_code),
    region = COALESCE(EXCLUDED.region, public.user_sessions.region),
    latitude = COALESCE(EXCLUDED.latitude, public.user_sessions.latitude),
    longitude = COALESCE(EXCLUDED.longitude, public.user_sessions.longitude),
    updated_at = now();

  SELECT active_tabs_count INTO v_new_count
  FROM public.user_sessions
  WHERE user_id = v_user_id AND device_stable_id = lower(p_device_stable_id);

  UPDATE public.user_sessions
    SET is_current_device = false
    WHERE user_id = v_user_id
      AND device_stable_id <> lower(p_device_stable_id);

  RETURN v_new_count;
END;
$$;


--
-- Name: calculate_current_month_costs(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_current_month_costs() RETURNS TABLE(service_name text, total_usage numeric, free_tier_used numeric, billable_usage numeric, estimated_cost numeric)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  RETURN QUERY
  WITH monthly_usage AS (
    SELECT 
      ru.service_name,
      SUM(ru.usage_amount) as total_usage
    FROM public.resource_usage ru
    WHERE ru.usage_date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY ru.service_name
  ),
  pricing AS (
    SELECT 
      sp.service_name,
      sp.free_tier_limit,
      sp.cost_per_unit
    FROM public.service_pricing sp
  )
  SELECT 
    COALESCE(mu.service_name, p.service_name) as service_name,
    COALESCE(mu.total_usage, 0) as total_usage,
    LEAST(COALESCE(mu.total_usage, 0), p.free_tier_limit) as free_tier_used,
    GREATEST(COALESCE(mu.total_usage, 0) - p.free_tier_limit, 0) as billable_usage,
    GREATEST(COALESCE(mu.total_usage, 0) - p.free_tier_limit, 0) * p.cost_per_unit as estimated_cost
  FROM pricing p
  LEFT JOIN monthly_usage mu ON p.service_name = mu.service_name;
END;
$$;


--
-- Name: calculate_trust_score(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_trust_score(p_session_id uuid) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_score integer := 50; -- Start at neutral
  v_session record;
  v_anomaly_count integer;
BEGIN
  SELECT * INTO v_session FROM public.user_sessions WHERE id = p_session_id;
  
  IF NOT FOUND THEN
    RETURN 50;
  END IF;
  
  -- Increase trust for:
  -- 1. Verified/trusted devices (+30)
  IF v_session.is_trusted THEN
    v_score := v_score + 30;
  END IF;
  
  -- 2. Long-term usage (+20)
  IF v_session.login_count > 10 THEN
    v_score := v_score + 20;
  END IF;
  
  -- 3. MFA enabled (+20)
  IF v_session.mfa_enabled THEN
    v_score := v_score + 20;
  END IF;
  
  -- 4. Consistent location (+10)
  IF v_session.country IS NOT NULL AND v_session.city IS NOT NULL THEN
    v_score := v_score + 10;
  END IF;
  
  -- Decrease trust for:
  -- 1. Anomalies detected (-10 each)
  v_anomaly_count := jsonb_array_length(COALESCE(v_session.anomaly_flags, '[]'::jsonb));
  v_score := v_score - (v_anomaly_count * 10);
  
  -- 2. VPN usage (-5)
  IF v_session.is_vpn THEN
    v_score := v_score - 5;
  END IF;
  
  -- 3. No location data (-5)
  IF v_session.country IS NULL THEN
    v_score := v_score - 5;
  END IF;
  
  -- Clamp between 0 and 100
  v_score := GREATEST(0, LEAST(100, v_score));
  
  RETURN v_score;
END;
$$;


--
-- Name: can_view_profile(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_view_profile(profile_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    -- User can view their own profile
    auth.uid() = profile_id
    -- Or user is platform owner
    OR public.is_platform_owner(auth.uid())
    -- Or user is super admin
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
        AND role = 'super_admin' 
        AND is_active = true
    )
    -- Or profile is not hidden (for limited public view)
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = profile_id
        AND is_hidden = false
    );
$$;


--
-- Name: can_view_sensitive_profile_data(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.can_view_sensitive_profile_data(profile_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT 
    auth.uid() = profile_id 
    OR public.is_platform_owner(auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
        AND role = 'super_admin' 
        AND is_active = true
    );
$$;


--
-- Name: create_post_safe(jsonb, text, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_post_safe(content_param jsonb, post_type_param text DEFAULT 'regular'::text, visibility_param text DEFAULT 'public'::text, is_sponsored_param boolean DEFAULT false) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  new_post_id UUID;
BEGIN
  INSERT INTO public.posts (user_id, content, post_type, visibility, is_sponsored)
  VALUES (auth.uid(), content_param, post_type_param, visibility_param, is_sponsored_param)
  RETURNING id INTO new_post_id;
  
  RETURN new_post_id;
END;
$$;


--
-- Name: current_user_is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.current_user_is_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND is_active = true
  );
$$;


--
-- Name: current_user_is_super_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.current_user_is_super_admin() RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
  );
$$;


--
-- Name: delete_expired_sessions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.delete_expired_sessions() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete sessions that have passed their retention period
  WITH deleted AS (
    DELETE FROM public.user_sessions
    WHERE 
      created_at < now() - (data_retention_days || ' days')::interval
      AND session_status != 'active'
    RETURNING id
  )
  SELECT count(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$;


--
-- Name: deny_permission(public.permission_type, public.device_type, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.deny_permission(_permission_type public.permission_type, _device_type public.device_type, _metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  permission_id UUID;
BEGIN
  INSERT INTO public.user_permissions (
    user_id,
    permission_type,
    device_type,
    status,
    denied_at,
    metadata
  )
  VALUES (
    auth.uid(),
    _permission_type,
    _device_type,
    'denied',
    now(),
    _metadata
  )
  ON CONFLICT (user_id, permission_type, device_type)
  DO UPDATE SET
    status = 'denied',
    denied_at = now(),
    metadata = _metadata,
    updated_at = now()
  RETURNING id INTO permission_id;
  
  RETURN permission_id;
END;
$$;


--
-- Name: get_current_user_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_current_user_role() RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT public.get_user_primary_role(auth.uid());
$$;


--
-- Name: get_full_profile(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_full_profile(profile_id uuid) RETURNS TABLE(id uuid, username text, bio text, avatar_url text, cover_url text, gender text, email text, phone_number text, first_name text, last_name text, date_of_birth date, primary_role text, is_hidden boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  -- Only return full profile data if:
  -- 1. User is requesting their own profile, OR
  -- 2. User is platform owner or super admin
  SELECT 
    p.id,
    p.username,
    p.bio,
    p.avatar_url,
    p.cover_url,
    p.gender,
    CASE 
      WHEN auth.uid() = p.id OR is_platform_owner(auth.uid()) THEN p.email
      ELSE NULL
    END as email,
    CASE 
      WHEN auth.uid() = p.id OR is_platform_owner(auth.uid()) THEN p.phone_number
      ELSE NULL
    END as phone_number,
    CASE 
      WHEN auth.uid() = p.id OR is_platform_owner(auth.uid()) THEN p.first_name
      ELSE NULL
    END as first_name,
    CASE 
      WHEN auth.uid() = p.id OR is_platform_owner(auth.uid()) THEN p.last_name
      ELSE NULL
    END as last_name,
    CASE 
      WHEN auth.uid() = p.id OR is_platform_owner(auth.uid()) THEN p.date_of_birth
      ELSE NULL
    END as date_of_birth,
    p.primary_role,
    p.is_hidden,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = profile_id;
$$;


--
-- Name: get_profile_field_access_info(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_profile_field_access_info() RETURNS jsonb
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT jsonb_build_object(
    'safe_public_fields', ARRAY[
      'id', 'username', 'bio', 'avatar_url', 'cover_url', 
      'gender', 'created_at', 'updated_at', 'is_hidden'
    ],
    'sensitive_fields', ARRAY[
      'email', 'phone_number', 'first_name', 'last_name', 'date_of_birth'
    ],
    'guidance', 'Use public_profiles view or get_safe_profile() function to view other users. Use get_full_profile() or direct table query only for own profile.',
    'documentation', '/SECURITY_IMPLEMENTATION.md'
  );
$$;


--
-- Name: get_public_profiles(integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_public_profiles(limit_count integer DEFAULT 20, offset_count integer DEFAULT 0) RETURNS TABLE(id uuid, username text, bio text, avatar_url text, cover_url text, gender text, created_at timestamp with time zone, updated_at timestamp with time zone, is_hidden boolean)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- SECURITY: Require authentication to prevent anonymous data scraping
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view public profiles';
  END IF;

  -- Enforce maximum page size to prevent abuse
  IF limit_count > 50 THEN
    limit_count := 50;
  END IF;

  -- Return only non-sensitive, non-hidden profiles
  RETURN QUERY
  SELECT 
    pp.id,
    pp.username,
    pp.bio,
    pp.avatar_url,
    pp.cover_url,
    pp.gender,
    pp.created_at,
    pp.updated_at,
    pp.is_hidden
  FROM public.public_profiles pp
  WHERE pp.is_hidden = false
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;


--
-- Name: get_public_website_settings(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_public_website_settings() RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  settings_data jsonb;
  favicon_setting record;
BEGIN
  -- Get favicon from app_settings if it exists
  SELECT value INTO favicon_setting
  FROM public.app_settings
  WHERE key = 'favicon_url'
  LIMIT 1;
  
  -- Build settings object
  settings_data := jsonb_build_object(
    'favicon_url', COALESCE(favicon_setting.value, '"/favicon.png"'::jsonb),
    'developer_mode', false,
    'maintenance_countdown_enabled', false,
    'maintenance_return_time', 2,
    'maintenance_super_admin_bypass', false,
    'maintenance_production_only', false
  );
  
  RETURN settings_data;
END;
$$;


--
-- Name: get_safe_profile(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_safe_profile(profile_id uuid) RETURNS TABLE(id uuid, username text, bio text, avatar_url text, cover_url text, gender text, is_hidden boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- SECURITY: Require authentication to prevent anonymous data scraping
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to view profiles';
  END IF;

  -- Only return safe, non-sensitive profile fields
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.bio,
    p.avatar_url,
    p.cover_url,
    p.gender,
    p.is_hidden,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  WHERE p.id = profile_id
    AND p.is_hidden = false;
END;
$$;


--
-- Name: get_upload_analytics(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_upload_analytics(p_time_window text DEFAULT '24h'::text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  -- Return mock analytics data for now
  return '{
    "total_uploads": 0,
    "successful_uploads": 0,
    "failed_uploads": 0,
    "average_upload_time": 0,
    "storage_used": 0
  }';
end;
$$;


--
-- Name: get_upload_configuration(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_upload_configuration() RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  config_data jsonb;
begin
  -- Get the most recent configuration
  select configuration_data into config_data
  from public.upload_configuration
  order by updated_at desc
  limit 1;
  
  -- Return default configuration if none exists
  if config_data is null then
    config_data := '{
      "file_upload_enabled": true,
      "video_upload_enabled": true,
      "max_image_size": 10485760,
      "max_video_size": 104857600,
      "allowed_extensions": "jpg,jpeg,png,gif,mp4,mov,avi",
      "malware_scanning": false,
      "uuid_filenames": true
    }';
    
    -- Insert default configuration
    insert into public.upload_configuration (configuration_data)
    values (config_data);
  end if;
  
  return config_data;
end;
$$;


--
-- Name: get_user_primary_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_primary_role(target_user_id uuid) RETURNS text
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COALESCE(
    (
      SELECT role 
      FROM public.user_roles 
      WHERE user_id = target_user_id 
        AND is_active = true 
      ORDER BY 
        CASE role
          WHEN 'platform_owner_root' THEN 6
          WHEN 'super_admin' THEN 5
          WHEN 'admin' THEN 4
          WHEN 'moderator' THEN 3
          WHEN 'developer' THEN 2
          WHEN 'support' THEN 2
          ELSE 1
        END DESC
      LIMIT 1
    ),
    (SELECT primary_role FROM public.profiles WHERE id = target_user_id),
    'user'
  );
$$;


--
-- Name: get_user_roles_admin(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_roles_admin(target_user_id uuid) RETURNS TABLE(id uuid, user_id uuid, role text, is_active boolean, created_at timestamp with time zone)
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  -- Only allow platform owners and super admins to view other users' roles
  SELECT ur.id, ur.user_id, ur.role, ur.is_active, ur.created_at
  FROM public.user_roles ur
  WHERE ur.user_id = target_user_id
    AND (
      public.is_platform_owner(auth.uid())
      OR EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
      )
    );
$$;


--
-- Name: grant_permission(public.permission_type, public.device_type, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.grant_permission(_permission_type public.permission_type, _device_type public.device_type, _metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  permission_id UUID;
BEGIN
  INSERT INTO public.user_permissions (
    user_id,
    permission_type,
    device_type,
    status,
    granted_at,
    metadata
  )
  VALUES (
    auth.uid(),
    _permission_type,
    _device_type,
    'granted',
    now(),
    _metadata
  )
  ON CONFLICT (user_id, permission_type, device_type)
  DO UPDATE SET
    status = 'granted',
    granted_at = now(),
    metadata = _metadata,
    updated_at = now()
  RETURNING id INTO permission_id;
  
  RETURN permission_id;
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Insert profile for new user, using COALESCE for safe defaults
  INSERT INTO public.profiles (
    id,
    auth_user_id,
    email,
    phone_number,
    first_name,
    last_name,
    username,
    email_verified,
    phone_verified
  )
  VALUES (
    NEW.id,
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    (NEW.email_confirmed_at IS NOT NULL),
    (NEW.phone_confirmed_at IS NOT NULL)
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate key errors
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: has_active_session(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_active_session(p_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  last_activity TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get last session activity
  SELECT created_at INTO last_activity
  FROM public.session_activity
  WHERE user_id = p_user_id
    AND event_type IN ('login', 'token_refresh', 'session_check')
  ORDER BY created_at DESC
  LIMIT 1;

  -- Consider session active if last activity was within 24 hours
  IF last_activity IS NOT NULL AND last_activity > (now() - INTERVAL '24 hours') THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;


--
-- Name: has_permission(uuid, public.permission_type, public.device_type); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_permission(_user_id uuid, _permission_type public.permission_type, _device_type public.device_type DEFAULT NULL::public.device_type) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_permissions
    WHERE user_id = _user_id
      AND permission_type = _permission_type
      AND status = 'granted'
      AND (_device_type IS NULL OR device_type = _device_type)
  )
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;


--
-- Name: hash_ip_address(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.hash_ip_address(ip_text text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF ip_text IS NULL THEN
    RETURN NULL;
  END IF;
  -- Simple hash for privacy (in production, use better hashing)
  RETURN encode(digest(ip_text || 'session_salt_2024', 'sha256'), 'hex');
END;
$$;


--
-- Name: is_platform_owner(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_platform_owner(_user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND primary_role = 'platform_owner_root'
      AND is_hidden = true
  )
$$;


--
-- Name: log_device_security_event(uuid, text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_device_security_event(p_user_id uuid, p_event_type text, p_event_description text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id,
    event_type,
    event_description,
    risk_level,
    metadata
  ) VALUES (
    p_user_id,
    p_event_type,
    p_event_description,
    CASE 
      WHEN p_event_type IN ('new_device', 'location_change') THEN 'medium'
      WHEN p_event_type = 'session_expired' THEN 'low'
      ELSE 'info'
    END,
    p_metadata
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;


--
-- Name: log_session_activity(text, text, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_session_activity(p_event_type text, p_event_source text DEFAULT 'system'::text, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  activity_id UUID;
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.session_activity (
    user_id,
    event_type,
    event_source,
    metadata
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_event_source,
    p_metadata
  ) RETURNING id INTO activity_id;

  RETURN activity_id;
END;
$$;


--
-- Name: request_permission(public.permission_type, public.device_type, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.request_permission(_permission_type public.permission_type, _device_type public.device_type, _metadata jsonb DEFAULT '{}'::jsonb) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  permission_id UUID;
BEGIN
  -- Insert or update permission request
  INSERT INTO public.user_permissions (
    user_id,
    permission_type,
    device_type,
    status,
    last_requested_at,
    metadata
  )
  VALUES (
    auth.uid(),
    _permission_type,
    _device_type,
    'pending',
    now(),
    _metadata
  )
  ON CONFLICT (user_id, permission_type, device_type)
  DO UPDATE SET
    last_requested_at = now(),
    status = 'pending',
    metadata = _metadata,
    updated_at = now()
  RETURNING id INTO permission_id;
  
  RETURN permission_id;
END;
$$;


--
-- Name: restore_post(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.restore_post(post_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.posts
  SET is_deleted = false, deleted_at = NULL
  WHERE id = post_id_param AND user_id = auth.uid();
END;
$$;


--
-- Name: revoke_expired_sessions(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.revoke_expired_sessions() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.user_sessions
  SET 
    is_active = false,
    session_status = 'expired'
  WHERE 
    session_expires_at < NOW()
    AND is_active = true;
END;
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: soft_delete_post(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.soft_delete_post(post_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE public.posts
  SET is_deleted = true, deleted_at = now()
  WHERE id = post_id_param AND user_id = auth.uid();
END;
$$;


--
-- Name: sync_phone_verification_status(uuid, text, boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_phone_verification_status(user_uuid uuid, phone_number_param text, is_verified boolean) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  -- Update the profiles table with phone verification status
  update public.profiles
  set 
    phone_verified = is_verified,
    updated_at = now()
  where auth_user_id = user_uuid or id = user_uuid;
  
  -- Log the sync action
  insert into public.admin_actions (
    actor_id,
    action_type,
    reason
  ) values (
    user_uuid,
    'phone_verification_sync',
    format('Phone verification status synced: %s for %s', is_verified, phone_number_param)
  );
end;
$$;


--
-- Name: sync_post_content(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_post_content() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Extract text from content JSONB
  NEW.content_text := NEW.content->>'text';
  
  -- Extract images array from content JSONB
  IF NEW.content ? 'images' THEN
    NEW.content_images := ARRAY(
      SELECT jsonb_array_elements_text(NEW.content->'images')
    );
  ELSE
    NEW.content_images := '{}';
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: sync_primary_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_primary_role() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Update the profiles table with the highest role
  UPDATE public.profiles
  SET primary_role = public.get_user_primary_role(
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.user_id
      ELSE NEW.user_id
    END
  )
  WHERE id = CASE 
    WHEN TG_OP = 'DELETE' THEN OLD.user_id
    ELSE NEW.user_id
  END;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: sync_session_active_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_session_active_status() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Automatically set is_active based on session_status
  IF NEW.session_status = 'active' THEN
    NEW.is_active := true;
  ELSIF NEW.session_status IN ('inactive', 'logged_out') THEN
    NEW.is_active := false;
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: sync_user_verification_status(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_user_verification_status() RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  profile_record record;
  auth_user_record record;
begin
  -- Sync verification status from auth.users to profiles
  for profile_record in 
    select id, auth_user_id from public.profiles 
    where auth_user_id is not null
  loop
    -- Get auth user data (this is a simplified version - in practice you'd use admin functions)
    select email_confirmed_at, phone_confirmed_at
    into auth_user_record
    from auth.users 
    where id = profile_record.auth_user_id;
    
    if found then
      update public.profiles
      set 
        email_verified = (auth_user_record.email_confirmed_at is not null),
        phone_verified = (auth_user_record.phone_confirmed_at is not null),
        updated_at = now()
      where id = profile_record.id;
    end if;
  end loop;
end;
$$;


--
-- Name: update_cost_tracking_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_cost_tracking_timestamp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_post_counts(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_post_counts() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  IF TG_TABLE_NAME = 'post_likes' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_comments' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.posts SET comments_count = GREATEST(comments_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'post_shares' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE public.posts SET shares_count = shares_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE public.posts SET shares_count = GREATEST(shares_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;


--
-- Name: update_professional_presentations_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_professional_presentations_timestamp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: update_session_trust_score(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_session_trust_score() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.trust_score := calculate_trust_score(NEW.id);
  RETURN NEW;
END;
$$;


--
-- Name: update_upload_configuration(jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_upload_configuration(config_data jsonb) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
declare
  result_data jsonb;
begin
  -- Update or insert configuration
  insert into public.upload_configuration (configuration_data)
  values (config_data)
  on conflict (id) do update set
    configuration_data = excluded.configuration_data,
    updated_at = now();
    
  -- Return the updated configuration
  select configuration_data into result_data
  from public.upload_configuration
  order by updated_at desc
  limit 1;
  
  return result_data;
end;
$$;


--
-- Name: update_upload_configuration_status(text, text, integer, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_upload_configuration_status(p_service_name text, p_status text, p_response_time_ms integer DEFAULT NULL::integer, p_error_details jsonb DEFAULT NULL::jsonb, p_metadata jsonb DEFAULT NULL::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.upload_configuration_status (
    service_name,
    status,
    response_time_ms,
    error_details,
    metadata
  ) values (
    p_service_name,
    p_status,
    p_response_time_ms,
    p_error_details,
    p_metadata
  );
end;
$$;


--
-- Name: update_user_sessions_timestamp(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_user_sessions_timestamp() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


--
-- Name: validate_admin_access(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_admin_access(required_action text DEFAULT 'access_admin_portal'::text) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  select
    public.is_platform_owner(auth.uid())
    or exists (
      select 1 from public.user_roles
      where user_id = auth.uid()
        and is_active = true
        and role in ('super_admin','admin')
    );
$$;


SET default_table_access_method = heap;

--
-- Name: admin_actions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_actions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_id uuid NOT NULL,
    target_user_id uuid,
    action_type text NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: admin_notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    message text,
    notification_type text,
    read boolean DEFAULT false NOT NULL,
    user_id uuid,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    event_type text NOT NULL,
    event_data jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key text NOT NULL,
    value jsonb,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: brute_force_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brute_force_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    alert_type text NOT NULL,
    ip_address text,
    attempt_count integer,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cost_estimates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cost_estimates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    total_usage numeric(15,2) NOT NULL,
    estimated_cost numeric(10,2) NOT NULL,
    actual_cost numeric(10,2),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: live_streams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.live_streams (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    host text NOT NULL,
    thumbnail_url text NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    is_live boolean DEFAULT true NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    category text DEFAULT 'general'::text
);


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    notify_new_message boolean DEFAULT true,
    notify_message_request boolean DEFAULT true,
    notify_message_reaction boolean DEFAULT true,
    notify_unread_reminder boolean DEFAULT false,
    notify_missed_call boolean DEFAULT true,
    notify_comment_reply boolean DEFAULT true,
    notify_reply_to_reply boolean DEFAULT true,
    notify_post_reaction boolean DEFAULT true,
    notify_comment_reaction boolean DEFAULT true,
    notify_post_saved boolean DEFAULT false,
    notify_post_reported boolean DEFAULT true,
    notify_post_moderation boolean DEFAULT true,
    notify_quote_repost boolean DEFAULT true,
    notify_poll_vote boolean DEFAULT true,
    notify_qa_question boolean DEFAULT true,
    notify_comment_mention boolean DEFAULT true,
    notify_photo_tag boolean DEFAULT true,
    notify_tag_review boolean DEFAULT true,
    notify_tag_removed boolean DEFAULT false,
    notify_story_mention boolean DEFAULT true,
    notify_friend_request boolean DEFAULT true,
    notify_friend_accepted boolean DEFAULT true,
    notify_follow_request boolean DEFAULT true,
    notify_new_follower boolean DEFAULT true,
    notify_unfollow boolean DEFAULT false,
    notify_suggested_friends boolean DEFAULT false,
    notify_page_follower boolean DEFAULT true,
    notify_page_review boolean DEFAULT true,
    notify_page_comment boolean DEFAULT true,
    notify_page_message boolean DEFAULT true,
    notify_page_mention boolean DEFAULT true,
    notify_page_role_changed boolean DEFAULT true,
    notify_page_share boolean DEFAULT true,
    notify_group_invite boolean DEFAULT true,
    notify_group_join_request boolean DEFAULT true,
    notify_group_request_approved boolean DEFAULT true,
    notify_group_post_approval boolean DEFAULT true,
    notify_group_post_status boolean DEFAULT true,
    notify_group_comment boolean DEFAULT true,
    notify_group_event boolean DEFAULT true,
    notify_event_invite boolean DEFAULT true,
    notify_event_reminder boolean DEFAULT true,
    notify_event_rsvp_update boolean DEFAULT true,
    notify_event_comment boolean DEFAULT true,
    notify_event_role_change boolean DEFAULT true,
    notify_live_started boolean DEFAULT true,
    notify_live_comment boolean DEFAULT false,
    notify_story_view_milestone boolean DEFAULT false,
    notify_story_reply boolean DEFAULT true,
    notify_story_tag boolean DEFAULT true,
    notify_reel_comment boolean DEFAULT true,
    notify_reel_remix boolean DEFAULT true,
    notify_timeline_post boolean DEFAULT true,
    notify_profile_reaction boolean DEFAULT true,
    notify_birthday_reminder boolean DEFAULT true,
    notify_memory_highlight boolean DEFAULT true,
    notify_marketplace_offer boolean DEFAULT true,
    notify_marketplace_message boolean DEFAULT true,
    notify_item_sold boolean DEFAULT true,
    notify_payment_received boolean DEFAULT true,
    notify_shipping_update boolean DEFAULT true,
    notify_dispute boolean DEFAULT true,
    notify_price_drop boolean DEFAULT false,
    notify_monetization_eligibility boolean DEFAULT true,
    notify_earnings_summary boolean DEFAULT true,
    notify_payout boolean DEFAULT true,
    notify_policy_violation boolean DEFAULT true,
    notify_branded_content boolean DEFAULT true,
    notify_new_login boolean DEFAULT true,
    notify_password_changed boolean DEFAULT true,
    notify_contact_changed boolean DEFAULT true,
    notify_2fa_changed boolean DEFAULT true,
    notify_suspicious_activity boolean DEFAULT true,
    notify_privacy_changed boolean DEFAULT true,
    notify_service_status boolean DEFAULT true,
    notify_policy_updates boolean DEFAULT true,
    notify_product_updates boolean DEFAULT false,
    notify_surveys boolean DEFAULT false,
    channel_push boolean DEFAULT true,
    channel_email boolean DEFAULT true,
    channel_sms boolean DEFAULT false,
    channel_in_app boolean DEFAULT true,
    quiet_hours_enabled boolean DEFAULT false,
    quiet_hours_start time without time zone DEFAULT '22:00:00'::time without time zone,
    quiet_hours_end time without time zone DEFAULT '08:00:00'::time without time zone,
    digest_frequency text DEFAULT 'instant'::text,
    priority_level text DEFAULT 'all'::text,
    notification_language text DEFAULT 'en'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    notify_profile_visit boolean DEFAULT false
);

ALTER TABLE ONLY public.notification_preferences REPLICA IDENTITY FULL;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    title text NOT NULL,
    description text,
    type text DEFAULT 'info'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL,
    status text DEFAULT 'unread'::text NOT NULL,
    source text,
    linked_module text,
    linked_scan_id uuid,
    tags text[],
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: optimization_suggestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.optimization_suggestions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    suggestion_type text NOT NULL,
    severity text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    impact_score integer NOT NULL,
    potential_savings numeric,
    potential_improvement text,
    category text NOT NULL,
    affected_service text,
    recommendation text NOT NULL,
    auto_applicable boolean DEFAULT false,
    status text DEFAULT 'open'::text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    applied_at timestamp with time zone,
    dismissed_at timestamp with time zone,
    dismissed_reason text,
    CONSTRAINT optimization_suggestions_impact_score_check CHECK (((impact_score >= 1) AND (impact_score <= 100))),
    CONSTRAINT optimization_suggestions_severity_check CHECK ((severity = ANY (ARRAY['critical'::text, 'high'::text, 'medium'::text, 'low'::text]))),
    CONSTRAINT optimization_suggestions_status_check CHECK ((status = ANY (ARRAY['open'::text, 'applied'::text, 'dismissed'::text, 'in_progress'::text]))),
    CONSTRAINT optimization_suggestions_suggestion_type_check CHECK ((suggestion_type = ANY (ARRAY['cost'::text, 'performance'::text, 'security'::text, 'storage'::text])))
);


--
-- Name: personal_introduction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_introduction (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school text,
    city text,
    profession text,
    languages text[],
    hobbies text[],
    favorite_quote text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: post_comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    content text NOT NULL,
    parent_comment_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: post_likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_likes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type text DEFAULT 'like'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: post_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_shares (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    content jsonb DEFAULT '{}'::jsonb NOT NULL,
    post_type text DEFAULT 'regular'::text NOT NULL,
    visibility text DEFAULT 'public'::text NOT NULL,
    is_sponsored boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    deleted_at timestamp with time zone,
    is_deleted boolean DEFAULT false,
    is_anonymous boolean DEFAULT false,
    user_name text,
    user_image text,
    user_verified boolean DEFAULT false,
    content_text text,
    content_images text[]
);


--
-- Name: professional_presentations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.professional_presentations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text,
    role text,
    entry text,
    quick text,
    email text,
    phone text,
    website text,
    cv_url text,
    avatar_url text,
    nav_labels jsonb DEFAULT '{"home": "Home", "blogs": "Blogs", "skills": "Skills", "contact": "Contact", "portfolio": "Portfolio"}'::jsonb,
    styles jsonb DEFAULT '{}'::jsonb,
    socials jsonb DEFAULT '[]'::jsonb,
    sections jsonb DEFAULT '{"home": true, "blogs": true, "skills": true, "contact": true, "portfolio": true}'::jsonb,
    layout jsonb DEFAULT '{"photoHeight": 220, "noiseOpacity": 0.06, "fullBleedPhoto": false, "leftColFraction": "1.1fr", "enableAnimations": true, "rightColFraction": "0.5fr", "showRightSidebar": true, "middleColFraction": "1.4fr"}'::jsonb,
    seo jsonb DEFAULT '{"pageTitle": "Professional Presentation", "description": "Clean, white-first personal page with skills, portfolio, and contact.", "openInNewWindow": true}'::jsonb,
    accent_color text DEFAULT '#2AA1FF'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    edit_mode boolean DEFAULT false NOT NULL,
    hire_button_enabled boolean DEFAULT false,
    hire_button_text text DEFAULT 'Hire Me'::text,
    hire_button_url text,
    hire_button_email text
);

ALTER TABLE ONLY public.professional_presentations REPLICA IDENTITY FULL;


--
-- Name: profile_access_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile_access_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    viewer_id uuid,
    viewed_profile_id uuid NOT NULL,
    access_method text NOT NULL,
    accessed_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    phone_number text,
    first_name text,
    last_name text,
    username text,
    date_of_birth date,
    bio text,
    gender text,
    avatar_url text,
    cover_url text,
    primary_role text,
    is_hidden boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    cover_position text,
    cover_gradient text,
    auth_user_id uuid,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    photo_transform jsonb DEFAULT '{"scale": 1, "translateX": 0, "translateY": 0}'::jsonb,
    photo_text_transform jsonb DEFAULT '{"translateX": 0, "translateY": 0}'::jsonb,
    prefers_desktop boolean DEFAULT false NOT NULL,
    last_device text,
    last_redirect_host text,
    last_redirect_at timestamp with time zone,
    show_cover_controls boolean DEFAULT true,
    professional_button_color text DEFAULT 'rgba(255, 255, 255, 0.1)'::text,
    avatar_sizes jsonb DEFAULT '{}'::jsonb,
    cover_sizes jsonb DEFAULT '{}'::jsonb,
    about_me text,
    location text,
    school text,
    school_completed boolean DEFAULT false,
    working_at text,
    city_location text,
    website text
);

ALTER TABLE ONLY public.profiles REPLICA IDENTITY FULL;


--
-- Name: resource_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_usage (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    usage_amount numeric(15,2) NOT NULL,
    usage_date date DEFAULT CURRENT_DATE NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: security_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    event_type text NOT NULL,
    event_description text,
    risk_level text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_pricing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_pricing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    unit_type text NOT NULL,
    cost_per_unit numeric(10,6) NOT NULL,
    free_tier_limit integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: session_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_activity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    event_type text NOT NULL,
    event_source text,
    ip_address text,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: session_revocations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session_revocations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    device_stable_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.session_revocations REPLICA IDENTITY FULL;


--
-- Name: system_health_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_health_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_name text NOT NULL,
    metric_value jsonb,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: system_issues; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_issues (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    issue_type text NOT NULL,
    severity text NOT NULL,
    issue_description text,
    status text DEFAULT 'open'::text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);


--
-- Name: upload_configuration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upload_configuration (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    configuration_data jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: upload_configuration_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upload_configuration_status (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_name text NOT NULL,
    status text NOT NULL,
    response_time_ms integer,
    error_details jsonb,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: upload_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.upload_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    post_id uuid,
    file_name text,
    file_size bigint,
    file_type text,
    upload_status text DEFAULT 'pending'::text NOT NULL,
    progress integer DEFAULT 0,
    error_message text,
    upload_url text,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_permissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    permission_type public.permission_type NOT NULL,
    status public.permission_status DEFAULT 'not_requested'::public.permission_status NOT NULL,
    device_type public.device_type NOT NULL,
    granted_at timestamp with time zone,
    denied_at timestamp with time zone,
    last_requested_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    photo_key text NOT NULL,
    photo_url text,
    photo_type text NOT NULL,
    original_filename text,
    file_size integer,
    content_type text,
    is_current boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_photos_photo_type_check CHECK ((photo_type = ANY (ARRAY['profile'::text, 'cover'::text, 'gallery'::text])))
);

ALTER TABLE ONLY public.user_photos REPLICA IDENTITY FULL;


--
-- Name: user_privacy_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_privacy_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    privacy_who_can_follow_me text DEFAULT 'everyone'::text,
    privacy_who_can_see_my_friends text DEFAULT 'people_i_follow'::text,
    privacy_who_can_see_my_birthday text DEFAULT 'people_i_follow'::text,
    privacy_status text DEFAULT 'online'::text,
    privacy_who_can_message_me text DEFAULT 'people_i_follow'::text,
    privacy_who_can_post_on_my_timeline text DEFAULT 'no_body'::text,
    privacy_confirm_request_when_someone_follows_you text DEFAULT 'yes'::text,
    privacy_show_my_activities text DEFAULT 'no'::text,
    privacy_share_my_location_with_public text DEFAULT 'no'::text,
    privacy_allow_search_engines_to_index text DEFAULT 'no'::text,
    who_can_comment_on_posts text DEFAULT 'followers'::text,
    who_can_share_posts text DEFAULT 'followers'::text,
    who_can_mention_me text DEFAULT 'everyone'::text,
    who_can_tag_me text DEFAULT 'people_i_follow'::text,
    review_tags_before_appear boolean DEFAULT true,
    review_tagged_posts boolean DEFAULT true,
    message_request_filter text DEFAULT 'standard'::text,
    allow_read_receipts boolean DEFAULT false,
    show_typing_indicators boolean DEFAULT false,
    show_active_status boolean DEFAULT false,
    who_can_send_friend_requests text DEFAULT 'everyone'::text,
    approve_new_followers boolean DEFAULT false,
    auto_approve_follow_requests boolean DEFAULT false,
    email_visibility text DEFAULT 'only_me'::text,
    phone_visibility text DEFAULT 'only_me'::text,
    birthday_detail text DEFAULT 'day_month_only'::text,
    location_visibility text DEFAULT 'only_me'::text,
    work_education_visibility text DEFAULT 'people_i_follow'::text,
    allow_find_by_email boolean DEFAULT false,
    allow_find_by_phone boolean DEFAULT false,
    show_in_people_you_may_know boolean DEFAULT true,
    personalize_recommendations boolean DEFAULT true,
    who_can_view_stories text DEFAULT 'followers'::text,
    allow_story_replies text DEFAULT 'followers'::text,
    allow_story_sharing boolean DEFAULT true,
    restricted_list jsonb DEFAULT '[]'::jsonb,
    muted_accounts jsonb DEFAULT '[]'::jsonb,
    hidden_words jsonb DEFAULT '[]'::jsonb,
    sensitive_content_filter text DEFAULT 'standard'::text,
    login_alerts_new_device boolean DEFAULT true,
    personalized_ads_activity boolean DEFAULT true,
    ads_based_on_partners_data boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE ONLY public.user_privacy_settings REPLICA IDENTITY FULL;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL
);


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    device_id text NOT NULL,
    device_stable_id text NOT NULL,
    device_type text NOT NULL,
    operating_system text,
    browser_name text,
    browser_version text,
    screen_resolution text,
    platform text,
    user_agent text,
    is_current_device boolean DEFAULT false NOT NULL,
    is_trusted boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    session_id text DEFAULT (gen_random_uuid())::text NOT NULL,
    logout_reason text,
    latitude numeric(9,6),
    longitude numeric(9,6),
    city text,
    country text,
    country_code text,
    region text,
    active_tabs_count integer DEFAULT 1 NOT NULL,
    CONSTRAINT active_tabs_count_min_one CHECK ((active_tabs_count >= 1)),
    CONSTRAINT user_sessions_device_type_check CHECK ((device_type = ANY (ARRAY['mobile'::text, 'tablet'::text, 'laptop'::text, 'desktop'::text])))
);

ALTER TABLE ONLY public.user_sessions REPLICA IDENTITY FULL;


--
-- Name: admin_actions admin_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_pkey PRIMARY KEY (id);


--
-- Name: admin_notifications admin_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_pkey PRIMARY KEY (id);


--
-- Name: analytics_events analytics_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_pkey PRIMARY KEY (id);


--
-- Name: app_settings app_settings_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_key_key UNIQUE (key);


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (id);


--
-- Name: brute_force_alerts brute_force_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brute_force_alerts
    ADD CONSTRAINT brute_force_alerts_pkey PRIMARY KEY (id);


--
-- Name: cost_estimates cost_estimates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cost_estimates
    ADD CONSTRAINT cost_estimates_pkey PRIMARY KEY (id);


--
-- Name: live_streams live_streams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.live_streams
    ADD CONSTRAINT live_streams_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_key UNIQUE (user_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: optimization_suggestions optimization_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.optimization_suggestions
    ADD CONSTRAINT optimization_suggestions_pkey PRIMARY KEY (id);


--
-- Name: personal_introduction personal_introduction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_introduction
    ADD CONSTRAINT personal_introduction_pkey PRIMARY KEY (id);


--
-- Name: personal_introduction personal_introduction_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_introduction
    ADD CONSTRAINT personal_introduction_user_id_key UNIQUE (user_id);


--
-- Name: personal_introduction personal_introduction_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_introduction
    ADD CONSTRAINT personal_introduction_user_id_unique UNIQUE (user_id);


--
-- Name: post_comments post_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_pkey PRIMARY KEY (id);


--
-- Name: post_likes post_likes_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: post_shares post_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_shares
    ADD CONSTRAINT post_shares_pkey PRIMARY KEY (id);


--
-- Name: post_shares post_shares_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_shares
    ADD CONSTRAINT post_shares_post_id_user_id_key UNIQUE (post_id, user_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: professional_presentations professional_presentations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_presentations
    ADD CONSTRAINT professional_presentations_pkey PRIMARY KEY (id);


--
-- Name: professional_presentations professional_presentations_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_presentations
    ADD CONSTRAINT professional_presentations_user_id_key UNIQUE (user_id);


--
-- Name: profile_access_logs profile_access_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_access_logs
    ADD CONSTRAINT profile_access_logs_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_new_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_new_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_new_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_new_username_key UNIQUE (username);


--
-- Name: resource_usage resource_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_usage
    ADD CONSTRAINT resource_usage_pkey PRIMARY KEY (id);


--
-- Name: security_events security_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_pkey PRIMARY KEY (id);


--
-- Name: service_pricing service_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_pricing
    ADD CONSTRAINT service_pricing_pkey PRIMARY KEY (id);


--
-- Name: service_pricing service_pricing_service_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_pricing
    ADD CONSTRAINT service_pricing_service_name_key UNIQUE (service_name);


--
-- Name: session_activity session_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_activity
    ADD CONSTRAINT session_activity_pkey PRIMARY KEY (id);


--
-- Name: session_revocations session_revocations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_revocations
    ADD CONSTRAINT session_revocations_pkey PRIMARY KEY (id);


--
-- Name: system_health_metrics system_health_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_health_metrics
    ADD CONSTRAINT system_health_metrics_pkey PRIMARY KEY (id);


--
-- Name: system_issues system_issues_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_issues
    ADD CONSTRAINT system_issues_pkey PRIMARY KEY (id);


--
-- Name: upload_configuration upload_configuration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_configuration
    ADD CONSTRAINT upload_configuration_pkey PRIMARY KEY (id);


--
-- Name: upload_configuration_status upload_configuration_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_configuration_status
    ADD CONSTRAINT upload_configuration_status_pkey PRIMARY KEY (id);


--
-- Name: upload_logs upload_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_logs
    ADD CONSTRAINT upload_logs_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_user_id_permission_type_device_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_permission_type_device_type_key UNIQUE (user_id, permission_type, device_type);


--
-- Name: user_photos user_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_photos
    ADD CONSTRAINT user_photos_pkey PRIMARY KEY (id);


--
-- Name: user_privacy_settings user_privacy_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_pkey PRIMARY KEY (id);


--
-- Name: user_privacy_settings user_privacy_settings_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_key UNIQUE (user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_unique_user_device; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_unique_user_device UNIQUE (user_id, device_stable_id);


--
-- Name: user_sessions user_sessions_user_id_device_stable_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_device_stable_id_key UNIQUE (user_id, device_stable_id);


--
-- Name: idx_admin_actions_actor_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_actions_actor_id ON public.admin_actions USING btree (actor_id);


--
-- Name: idx_admin_actions_target_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_actions_target_user_id ON public.admin_actions USING btree (target_user_id);


--
-- Name: idx_admin_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_created_at ON public.admin_notifications USING btree (created_at DESC);


--
-- Name: idx_admin_notifications_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_read ON public.admin_notifications USING btree (read);


--
-- Name: idx_admin_notifications_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_admin_notifications_type ON public.admin_notifications USING btree (notification_type);


--
-- Name: idx_analytics_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_created_at ON public.analytics_events USING btree (created_at DESC);


--
-- Name: idx_analytics_events_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events USING btree (user_id);


--
-- Name: idx_app_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_app_settings_key ON public.app_settings USING btree (key);


--
-- Name: idx_brute_force_alerts_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_brute_force_alerts_created_at ON public.brute_force_alerts USING btree (created_at DESC);


--
-- Name: idx_live_streams_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_live_streams_category ON public.live_streams USING btree (category);


--
-- Name: idx_live_streams_views; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_live_streams_views ON public.live_streams USING btree (views);


--
-- Name: idx_notification_preferences_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences USING btree (user_id);


--
-- Name: idx_notifications_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_created_at ON public.notifications USING btree (created_at DESC);


--
-- Name: idx_notifications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_status ON public.notifications USING btree (status);


--
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- Name: idx_post_comments_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_comments_post_id ON public.post_comments USING btree (post_id);


--
-- Name: idx_post_comments_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_comments_user_id ON public.post_comments USING btree (user_id);


--
-- Name: idx_post_likes_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_likes_post_id ON public.post_likes USING btree (post_id);


--
-- Name: idx_post_likes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_likes_user_id ON public.post_likes USING btree (user_id);


--
-- Name: idx_post_shares_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_post_shares_post_id ON public.post_shares USING btree (post_id);


--
-- Name: idx_posts_content_images; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_content_images ON public.posts USING gin (content_images);


--
-- Name: idx_posts_content_text; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_content_text ON public.posts USING gin (to_tsvector('english'::regconfig, content_text));


--
-- Name: idx_posts_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_created_at ON public.posts USING btree (created_at DESC);


--
-- Name: idx_posts_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_deleted ON public.posts USING btree (is_deleted) WHERE (is_deleted = false);


--
-- Name: idx_posts_is_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_is_deleted ON public.posts USING btree (is_deleted) WHERE (is_deleted = false);


--
-- Name: idx_posts_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_user_id ON public.posts USING btree (user_id);


--
-- Name: idx_posts_user_verified; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_user_verified ON public.posts USING btree (user_verified) WHERE (user_verified = true);


--
-- Name: idx_posts_visibility; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_posts_visibility ON public.posts USING btree (visibility);


--
-- Name: idx_professional_presentations_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_professional_presentations_user_id ON public.professional_presentations USING btree (user_id);


--
-- Name: idx_profiles_auth_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_auth_user_id ON public.profiles USING btree (auth_user_id);


--
-- Name: idx_profiles_is_hidden; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_is_hidden ON public.profiles USING btree (is_hidden) WHERE (is_hidden = false);


--
-- Name: idx_profiles_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_username ON public.profiles USING btree (username) WHERE (username IS NOT NULL);


--
-- Name: idx_profiles_verification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_verification ON public.profiles USING btree (email_verified, phone_verified);


--
-- Name: idx_security_events_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_events_created_at ON public.security_events USING btree (created_at DESC);


--
-- Name: idx_security_events_risk_level; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_security_events_risk_level ON public.security_events USING btree (risk_level);


--
-- Name: idx_session_activity_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_activity_created_at ON public.session_activity USING btree (created_at DESC);


--
-- Name: idx_session_activity_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_activity_event_type ON public.session_activity USING btree (event_type);


--
-- Name: idx_session_activity_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_session_activity_user_id ON public.session_activity USING btree (user_id);


--
-- Name: idx_suggestions_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suggestions_created ON public.optimization_suggestions USING btree (created_at DESC);


--
-- Name: idx_suggestions_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suggestions_score ON public.optimization_suggestions USING btree (impact_score DESC);


--
-- Name: idx_suggestions_severity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suggestions_severity ON public.optimization_suggestions USING btree (severity);


--
-- Name: idx_suggestions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suggestions_status ON public.optimization_suggestions USING btree (status);


--
-- Name: idx_suggestions_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_suggestions_type ON public.optimization_suggestions USING btree (suggestion_type);


--
-- Name: idx_system_health_metrics_recorded_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_health_metrics_recorded_at ON public.system_health_metrics USING btree (recorded_at DESC);


--
-- Name: idx_system_issues_severity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_issues_severity ON public.system_issues USING btree (severity);


--
-- Name: idx_system_issues_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_system_issues_status ON public.system_issues USING btree (status);


--
-- Name: idx_upload_configuration_status_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_configuration_status_service ON public.upload_configuration_status USING btree (service_name);


--
-- Name: idx_upload_configuration_status_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_configuration_status_updated_at ON public.upload_configuration_status USING btree (updated_at DESC);


--
-- Name: idx_upload_configuration_updated; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_configuration_updated ON public.upload_configuration USING btree (updated_at DESC);


--
-- Name: idx_upload_configuration_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_configuration_updated_at ON public.upload_configuration USING btree (updated_at DESC);


--
-- Name: idx_upload_logs_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_logs_post_id ON public.upload_logs USING btree (post_id);


--
-- Name: idx_upload_logs_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_logs_status ON public.upload_logs USING btree (upload_status);


--
-- Name: idx_upload_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_upload_logs_user_id ON public.upload_logs USING btree (user_id);


--
-- Name: idx_user_permissions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_permissions_status ON public.user_permissions USING btree (status);


--
-- Name: idx_user_permissions_type_device; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_permissions_type_device ON public.user_permissions USING btree (permission_type, device_type);


--
-- Name: idx_user_permissions_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_permissions_user_id ON public.user_permissions USING btree (user_id);


--
-- Name: idx_user_photos_current; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_photos_current ON public.user_photos USING btree (user_id, photo_type, is_current);


--
-- Name: idx_user_photos_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_photos_type ON public.user_photos USING btree (photo_type);


--
-- Name: idx_user_photos_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_photos_user ON public.user_photos USING btree (user_id);


--
-- Name: idx_user_privacy_settings_updated_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_privacy_settings_updated_at ON public.user_privacy_settings USING btree (updated_at DESC);


--
-- Name: idx_user_privacy_settings_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_privacy_settings_user_id ON public.user_privacy_settings USING btree (user_id);


--
-- Name: idx_user_roles_is_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_is_active ON public.user_roles USING btree (is_active);


--
-- Name: idx_user_roles_user_id_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_user_id_active ON public.user_roles USING btree (user_id, is_active) WHERE (is_active = true);


--
-- Name: user_sessions_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_session_id_idx ON public.user_sessions USING btree (session_id);


--
-- Name: user_sessions_user_device_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_sessions_user_device_unique ON public.user_sessions USING btree (user_id, device_stable_id);


--
-- Name: ux_user_sessions_user_device; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ux_user_sessions_user_device ON public.user_sessions USING btree (user_id, device_stable_id);


--
-- Name: admin_notifications handle_admin_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_admin_notifications_updated_at BEFORE UPDATE ON public.admin_notifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: app_settings handle_app_settings_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_app_settings_updated_at BEFORE UPDATE ON public.app_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: notifications handle_notifications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: profiles handle_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: upload_configuration_status handle_upload_configuration_status_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_upload_configuration_status_updated_at BEFORE UPDATE ON public.upload_configuration_status FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: upload_configuration handle_upload_configuration_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER handle_upload_configuration_updated_at BEFORE UPDATE ON public.upload_configuration FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: post_comments set_comments_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_comments_updated_at BEFORE UPDATE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: live_streams set_live_streams_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_live_streams_updated_at BEFORE UPDATE ON public.live_streams FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: posts set_posts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: profiles set_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: optimization_suggestions set_updated_at_optimization_suggestions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_optimization_suggestions BEFORE UPDATE ON public.optimization_suggestions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_privacy_settings set_updated_at_privacy_settings; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at_privacy_settings BEFORE UPDATE ON public.user_privacy_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: posts sync_post_content_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER sync_post_content_trigger BEFORE INSERT OR UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.sync_post_content();


--
-- Name: personal_introduction trg_personal_introduction_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_personal_introduction_updated_at BEFORE UPDATE ON public.personal_introduction FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: profiles trg_profiles_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: user_photos trg_user_photos_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_user_photos_set_updated_at BEFORE UPDATE ON public.user_photos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: user_photos trg_user_photos_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_user_photos_updated_at BEFORE UPDATE ON public.user_photos FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: user_sessions trg_user_sessions_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_user_sessions_set_updated_at BEFORE INSERT OR UPDATE ON public.user_sessions FOR EACH ROW EXECUTE FUNCTION public.update_user_sessions_timestamp();


--
-- Name: user_sessions trg_user_sessions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_user_sessions_updated_at BEFORE UPDATE ON public.user_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: professional_presentations trigger_update_professional_presentations_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_professional_presentations_timestamp BEFORE UPDATE ON public.professional_presentations FOR EACH ROW EXECUTE FUNCTION public.update_professional_presentations_timestamp();


--
-- Name: cost_estimates update_cost_estimates_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_cost_estimates_timestamp BEFORE UPDATE ON public.cost_estimates FOR EACH ROW EXECUTE FUNCTION public.update_cost_tracking_timestamp();


--
-- Name: notification_preferences update_notification_preferences_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: personal_introduction update_personal_introduction_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_personal_introduction_updated_at BEFORE UPDATE ON public.personal_introduction FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: post_comments update_post_comments_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_post_comments_count AFTER INSERT OR DELETE ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.update_post_counts();


--
-- Name: post_likes update_post_likes_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_post_likes_count AFTER INSERT OR DELETE ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.update_post_counts();


--
-- Name: post_shares update_post_shares_count; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_post_shares_count AFTER INSERT OR DELETE ON public.post_shares FOR EACH ROW EXECUTE FUNCTION public.update_post_counts();


--
-- Name: professional_presentations update_professional_presentations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_professional_presentations_updated_at BEFORE UPDATE ON public.professional_presentations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: resource_usage update_resource_usage_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_resource_usage_timestamp BEFORE UPDATE ON public.resource_usage FOR EACH ROW EXECUTE FUNCTION public.update_cost_tracking_timestamp();


--
-- Name: service_pricing update_service_pricing_timestamp; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_service_pricing_timestamp BEFORE UPDATE ON public.service_pricing FOR EACH ROW EXECUTE FUNCTION public.update_cost_tracking_timestamp();


--
-- Name: user_permissions update_user_permissions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_permissions_updated_at BEFORE UPDATE ON public.user_permissions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: admin_actions admin_actions_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: admin_actions admin_actions_target_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_target_user_id_fkey FOREIGN KEY (target_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: admin_notifications admin_notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_notifications
    ADD CONSTRAINT admin_notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: analytics_events analytics_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT analytics_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: brute_force_alerts brute_force_alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brute_force_alerts
    ADD CONSTRAINT brute_force_alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: user_sessions fk_user_sessions_profile; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT fk_user_sessions_profile FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: personal_introduction personal_introduction_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_introduction
    ADD CONSTRAINT personal_introduction_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_parent_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_parent_comment_id_fkey FOREIGN KEY (parent_comment_id) REFERENCES public.post_comments(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_comments post_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_comments
    ADD CONSTRAINT post_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_likes post_likes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_likes
    ADD CONSTRAINT post_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: post_shares post_shares_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_shares
    ADD CONSTRAINT post_shares_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: post_shares post_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_shares
    ADD CONSTRAINT post_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: professional_presentations professional_presentations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.professional_presentations
    ADD CONSTRAINT professional_presentations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profile_access_logs profile_access_logs_viewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile_access_logs
    ADD CONSTRAINT profile_access_logs_viewer_id_fkey FOREIGN KEY (viewer_id) REFERENCES auth.users(id);


--
-- Name: profiles profiles_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: security_events security_events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_events
    ADD CONSTRAINT security_events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: session_activity session_activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session_activity
    ADD CONSTRAINT session_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: upload_logs upload_logs_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_logs
    ADD CONSTRAINT upload_logs_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: upload_logs upload_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.upload_logs
    ADD CONSTRAINT upload_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_permissions user_permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_privacy_settings user_privacy_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_privacy_settings
    ADD CONSTRAINT user_privacy_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: system_health_metrics Admins can access system health metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can access system health metrics" ON public.system_health_metrics USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: admin_notifications Admins can delete admin notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete admin notifications" ON public.admin_notifications FOR DELETE USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: notifications Admins can delete any notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete any notifications" ON public.notifications FOR DELETE USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: admin_notifications Admins can insert admin notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert admin notifications" ON public.admin_notifications FOR INSERT WITH CHECK ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: notifications Admins can insert notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert notifications" ON public.notifications FOR INSERT WITH CHECK ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: app_settings Admins can manage app settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage app settings" ON public.app_settings USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: cost_estimates Admins can manage cost estimates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage cost estimates" ON public.cost_estimates USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: live_streams Admins can manage live streams; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage live streams" ON public.live_streams USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: optimization_suggestions Admins can manage optimization suggestions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage optimization suggestions" ON public.optimization_suggestions TO authenticated USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: security_events Admins can manage security events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage security events" ON public.security_events USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: service_pricing Admins can manage service pricing; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage service pricing" ON public.service_pricing USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: system_issues Admins can manage system issues; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage system issues" ON public.system_issues USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: upload_configuration Admins can manage upload configuration; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage upload configuration" ON public.upload_configuration USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: upload_configuration_status Admins can manage upload configuration status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage upload configuration status" ON public.upload_configuration_status USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: admin_notifications Admins can update admin notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update admin notifications" ON public.admin_notifications FOR UPDATE USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid()))) WITH CHECK ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: notifications Admins can update any notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update any notifications" ON public.notifications FOR UPDATE USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid()))) WITH CHECK (true);


--
-- Name: admin_notifications Admins can view admin notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view admin notifications" ON public.admin_notifications FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: analytics_events Admins can view all analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all analytics" ON public.analytics_events FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: notification_preferences Admins can view all notification preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all notification preferences" ON public.notification_preferences FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: notifications Admins can view all notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all notifications" ON public.notifications FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: user_permissions Admins can view all permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all permissions" ON public.user_permissions FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: user_privacy_settings Admins can view all privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all privacy settings" ON public.user_privacy_settings FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: session_activity Admins can view all session activity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all session activity" ON public.session_activity FOR SELECT USING ((public.is_platform_owner(auth.uid()) OR (EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'super_admin'::public.app_role) AND (user_roles.is_active = true))))));


--
-- Name: upload_logs Admins can view all upload logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all upload logs" ON public.upload_logs FOR SELECT TO authenticated USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: brute_force_alerts Admins can view brute force alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view brute force alerts" ON public.brute_force_alerts FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: resource_usage Admins can view resource usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view resource usage" ON public.resource_usage FOR SELECT USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: user_roles Admins manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins manage roles" ON public.user_roles TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins view all; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins view all" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: live_streams Anyone can view live streams; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view live streams" ON public.live_streams FOR SELECT USING ((is_live = true));


--
-- Name: profiles Deny all unauthenticated access to profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Deny all unauthenticated access to profiles" ON public.profiles TO anon USING (false);


--
-- Name: admin_actions Only admins and platform owners can view admin actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins and platform owners can view admin actions" ON public.admin_actions FOR SELECT TO authenticated USING ((public.current_user_is_admin() OR public.is_platform_owner(auth.uid())));


--
-- Name: profile_access_logs Only system can insert access logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only system can insert access logs" ON public.profile_access_logs FOR INSERT TO authenticated WITH CHECK (((auth.uid() = viewer_id) AND (viewer_id IS NOT NULL)));


--
-- Name: profile_access_logs Platform owners can view all access logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Platform owners can view all access logs" ON public.profile_access_logs FOR SELECT USING (public.is_platform_owner(auth.uid()));


--
-- Name: profiles Prevent platform owner deletion; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Prevent platform owner deletion" ON public.profiles FOR DELETE TO authenticated USING (((auth.uid() = id) AND (NOT public.is_platform_owner(id))));


--
-- Name: cost_estimates System can insert cost estimates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert cost estimates" ON public.cost_estimates FOR INSERT WITH CHECK (true);


--
-- Name: resource_usage System can insert resource usage; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert resource usage" ON public.resource_usage FOR INSERT WITH CHECK (true);


--
-- Name: post_comments Users can create comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: posts Users can create posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: upload_logs Users can create upload logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create upload logs" ON public.upload_logs FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: personal_introduction Users can delete own introduction; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own introduction" ON public.personal_introduction FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_photos Users can delete own photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own photos" ON public.user_photos FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: professional_presentations Users can delete own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own presentation" ON public.professional_presentations FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: user_privacy_settings Users can delete own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete own privacy settings" ON public.user_privacy_settings FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: post_comments Users can delete their own comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own comments" ON public.post_comments FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_sessions Users can delete their own device sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own device sessions" ON public.user_sessions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can delete their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING ((user_id = auth.uid()));


--
-- Name: posts Users can delete their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: personal_introduction Users can insert own introduction; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own introduction" ON public.personal_introduction FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: notification_preferences Users can insert own notification preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own notification preferences" ON public.notification_preferences FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_permissions Users can insert own permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own permissions" ON public.user_permissions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_photos Users can insert own photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own photos" ON public.user_photos FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: professional_presentations Users can insert own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own presentation" ON public.professional_presentations FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_privacy_settings Users can insert own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own privacy settings" ON public.user_privacy_settings FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: session_revocations Users can insert own revocation signals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own revocation signals" ON public.session_revocations FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: analytics_events Users can insert their own analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own analytics" ON public.analytics_events FOR INSERT WITH CHECK (((user_id = auth.uid()) OR (user_id IS NULL)));


--
-- Name: user_sessions Users can insert their own device sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own device sessions" ON public.user_sessions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: notifications Users can insert their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own notifications" ON public.notifications FOR INSERT WITH CHECK ((user_id = auth.uid()));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: post_likes Users can like posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: admin_actions Users can log their admin actions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can log their admin actions" ON public.admin_actions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = actor_id));


--
-- Name: profile_access_logs Users can see who viewed their profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can see who viewed their profile" ON public.profile_access_logs FOR SELECT TO authenticated USING ((auth.uid() = viewed_profile_id));


--
-- Name: user_photos Users can select own photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can select own photos" ON public.user_photos FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: post_shares Users can share posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can share posts" ON public.post_shares FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: post_likes Users can unlike posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can unlike posts" ON public.post_likes FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: personal_introduction Users can update own introduction; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own introduction" ON public.personal_introduction FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: notification_preferences Users can update own notification preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notification preferences" ON public.notification_preferences FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_permissions Users can update own permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own permissions" ON public.user_permissions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_photos Users can update own photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own photos" ON public.user_photos FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: professional_presentations Users can update own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own presentation" ON public.professional_presentations FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: user_privacy_settings Users can update own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own privacy settings" ON public.user_privacy_settings FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: post_comments Users can update their own comments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own comments" ON public.post_comments FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: user_sessions Users can update their own device sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own device sessions" ON public.user_sessions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING ((user_id = auth.uid())) WITH CHECK ((user_id = auth.uid()));


--
-- Name: posts Users can update their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: upload_logs Users can update their own upload logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own upload logs" ON public.upload_logs FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: post_comments Users can view comments on visible posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view comments on visible posts" ON public.post_comments FOR SELECT TO authenticated USING (true);


--
-- Name: post_likes Users can view likes on accessible posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view likes on accessible posts" ON public.post_likes FOR SELECT TO authenticated USING ((EXISTS ( SELECT 1
   FROM public.posts
  WHERE ((posts.id = post_likes.post_id) AND (((posts.visibility = 'public'::text) AND (posts.is_deleted = false)) OR (posts.user_id = auth.uid()) OR (post_likes.user_id = auth.uid()))))));


--
-- Name: personal_introduction Users can view own introduction; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own introduction" ON public.personal_introduction FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notification_preferences Users can view own notification preferences; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own notification preferences" ON public.notification_preferences FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_permissions Users can view own permissions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own permissions" ON public.user_permissions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: professional_presentations Users can view own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own presentation" ON public.professional_presentations FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_privacy_settings Users can view own privacy settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own privacy settings" ON public.user_privacy_settings FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: session_revocations Users can view own revocation signals; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own revocation signals" ON public.session_revocations FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: session_activity Users can view own session activity; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own session activity" ON public.session_activity FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: posts Users can view public posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view public posts" ON public.posts FOR SELECT TO authenticated USING (((visibility = 'public'::text) AND (is_deleted = false)));


--
-- Name: post_shares Users can view shares; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view shares" ON public.post_shares FOR SELECT TO authenticated USING (true);


--
-- Name: profile_access_logs Users can view their own access logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own access logs" ON public.profile_access_logs FOR SELECT USING ((auth.uid() = viewer_id));


--
-- Name: user_sessions Users can view their own device sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own device sessions" ON public.user_sessions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: posts Users can view their own posts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own posts" ON public.posts FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: upload_logs Users can view their own upload logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own upload logs" ON public.upload_logs FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: professional_presentations Users delete own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users delete own presentation" ON public.professional_presentations FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: professional_presentations Users insert own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users insert own presentation" ON public.professional_presentations FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: professional_presentations Users update own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users update own presentation" ON public.professional_presentations FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((id = auth.uid()));


--
-- Name: professional_presentations Users view own presentation; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view own presentation" ON public.professional_presentations FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING ((id = auth.uid()));


--
-- Name: user_roles Users view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: admin_actions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

--
-- Name: admin_notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: analytics_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

--
-- Name: app_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: brute_force_alerts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.brute_force_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: cost_estimates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;

--
-- Name: live_streams; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.live_streams ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_preferences; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: optimization_suggestions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.optimization_suggestions ENABLE ROW LEVEL SECURITY;

--
-- Name: personal_introduction; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.personal_introduction ENABLE ROW LEVEL SECURITY;

--
-- Name: post_comments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

--
-- Name: post_likes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: post_shares; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;

--
-- Name: posts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

--
-- Name: professional_presentations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.professional_presentations ENABLE ROW LEVEL SECURITY;

--
-- Name: profile_access_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profile_access_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: resource_usage; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;

--
-- Name: security_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

--
-- Name: service_pricing; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

--
-- Name: session_activity; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.session_activity ENABLE ROW LEVEL SECURITY;

--
-- Name: session_revocations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.session_revocations ENABLE ROW LEVEL SECURITY;

--
-- Name: system_health_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: system_issues; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.system_issues ENABLE ROW LEVEL SECURITY;

--
-- Name: upload_configuration; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.upload_configuration ENABLE ROW LEVEL SECURITY;

--
-- Name: upload_configuration_status; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.upload_configuration_status ENABLE ROW LEVEL SECURITY;

--
-- Name: upload_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.upload_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_permissions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

--
-- Name: user_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: user_privacy_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


