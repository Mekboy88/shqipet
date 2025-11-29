import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CapabilityCode } from '@/types/rbac';

interface UseCapabilitiesReturn {
  hasCapability: (capability: CapabilityCode, scopeType?: 'global' | 'regional' | 'resource', resourceId?: string) => boolean;
  userLevel: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCapabilities = (): UseCapabilitiesReturn => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<number>(0);
  const [userCapabilities, setUserCapabilities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCapabilities = useCallback(async () => {
    if (!user) {
      setUserCapabilities(new Set());
      setUserLevel(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user's maximum role level
      const { data: levelData, error: levelError } = await supabase
        .rpc('get_user_max_role_level', { _user_id: user.id });

      if (levelError) {
        throw levelError;
      }

      setUserLevel(levelData || 0);

      // Get user's capabilities by joining through their roles
      const { data: capabilitiesData, error: capabilitiesError } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          scope_type,
          resource_id,
          roles!inner(
            id,
            code,
            level,
            role_capabilities!inner(
              capability_id,
              scope_type,
              capabilities!inner(
                code,
                name,
                category
              )
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (capabilitiesError) {
        throw capabilitiesError;
      }

      // Build capability set with scope context
      const capabilities = new Set<string>();
      
      capabilitiesData?.forEach((userRole: any) => {
        userRole.roles.role_capabilities.forEach((rc: any) => {
          const capabilityCode = rc.capabilities.code;
          
          // Add capability with scope context
          if (rc.scope_type === 'global') {
            capabilities.add(`${capabilityCode}:global`);
          } else if (rc.scope_type === 'resource' && userRole.resource_id) {
            capabilities.add(`${capabilityCode}:resource:${userRole.resource_id}`);
          } else if (rc.scope_type === 'regional') {
            capabilities.add(`${capabilityCode}:regional`);
          }
          
          // Also add without scope for basic checks
          capabilities.add(capabilityCode);
        });
      });

      setUserCapabilities(capabilities);

    } catch (err) {
      console.error('Error fetching user capabilities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch capabilities');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCapabilities();
  }, [fetchCapabilities]);

  const hasCapability = useCallback((
    capability: CapabilityCode,
    scopeType: 'global' | 'regional' | 'resource' = 'global',
    resourceId?: string
  ): boolean => {
    if (!user) return false;

    // Check for exact scope match first
    if (scopeType === 'resource' && resourceId) {
      const scopedCapability = `${capability}:resource:${resourceId}`;
      if (userCapabilities.has(scopedCapability)) return true;
    } else if (scopeType === 'regional') {
      const scopedCapability = `${capability}:regional`;
      if (userCapabilities.has(scopedCapability)) return true;
    }

    // Check for global capability (always overrides scoped)
    const globalCapability = `${capability}:global`;
    if (userCapabilities.has(globalCapability)) return true;

    // Fallback to basic capability check (for backwards compatibility)
    return userCapabilities.has(capability);
  }, [user, userCapabilities]);

  return {
    hasCapability,
    userLevel,
    loading,
    error,
    refetch: fetchCapabilities,
  };
};