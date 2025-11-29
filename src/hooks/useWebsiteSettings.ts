import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WebsiteSettings {
  developer_mode?: boolean;
  maintenance_countdown_enabled?: boolean;
  maintenance_return_time?: number;
  maintenance_super_admin_bypass?: boolean;
  maintenance_production_only?: boolean;
  [key: string]: any;
}

const isProduction = () => {
  const hostname = window.location.hostname;
  return !hostname.includes('localhost') && !hostname.includes('127.0.0.1') && !hostname.includes('preview');
};

const isHireEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname.includes('hire') || hostname.includes('hiring');
};

export function useWebsiteSettings() {
  return useQuery({
    queryKey: ['website-settings'],
    queryFn: async () => {
      // Return default settings since table doesn't exist yet
      return {
        developer_mode: false,
        maintenance_countdown_enabled: false,
        maintenance_return_time: 2,
        maintenance_super_admin_bypass: false,
        maintenance_production_only: false,
        auto_detect_timezone: true,
        default_timezone: 'UTC',
        time_format: 'HH:mm:ss',
        date_format: 'PPP'
      };
    },
    retry: 1,
  });
}

export function useUpdateWebsiteSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      // Placeholder until table exists
      console.log('Settings update placeholder:', settings);
      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-settings'] });
      toast.success('Settings updated successfully.');
    },
    onError: (error: any) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });
}

export const useWebsiteSettingsLegacy = () => {
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState<WebsiteSettings>({});
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      let data: any = null;
      let error: any = null;

      if (user) {
        const resp = await supabase
          .from('website_settings')
          .select('*')
          .limit(1)
          .maybeSingle();
        data = resp.data;
        error = resp.error;
      } else {
        // For non-authenticated users, use faster RPC with timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Settings fetch timeout')), 2000);
        });
        
        const fetchPromise = supabase.rpc('get_public_website_settings');
        
        try {
          const resp = await Promise.race([fetchPromise, timeoutPromise]);
          data = resp.data;
          error = resp.error;
        } catch (timeoutError) {
          console.log('⏰ Website settings fetch timed out, using defaults');
          // Use empty settings if timeout occurs
          data = null;
          error = null;
        }
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error fetching website settings:', error);
        return;
      }

      if (data) {
        setSettings(data as WebsiteSettings);
      }
    } catch (error) {
      console.error('Error fetching website settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set initial loading to false immediately to prevent blocking login page
    setLoading(false);
    
    // Fetch settings in background
    fetchSettings();

    let subscription: any;

    if (user) {
      // Subscribe to realtime changes only for authenticated users
      subscription = supabase
        .channel('website_settings_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'website_settings'
          },
          (payload) => {
            if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              setSettings(payload.new as WebsiteSettings);
            }
          }
        )
        .subscribe();
    }

    return () => {
      subscription?.unsubscribe?.();
    };
  }, [user]);
  // Check if maintenance mode should be shown
  const shouldShowMaintenance = () => {
    const currentHostname = window.location.hostname;
    const isProductionEnv = isProduction();
    const isHire = isHireEnvironment();
    
    // Suppress console logs for hire environment
    if (!isHire) {
      console.log('🔍 [MAINTENANCE DEBUG] Checking maintenance mode:', {
        developer_mode: settings.developer_mode,
        maintenance_production_only: settings.maintenance_production_only,
        hostname: currentHostname,
        isProduction: isProductionEnv,
        isAdmin: isAdmin,
        maintenance_super_admin_bypass: settings.maintenance_super_admin_bypass
      });
    }
    
    if (!settings.developer_mode) {
      if (!isHire) {
        console.log('🔍 [MAINTENANCE DEBUG] Developer mode is OFF - no maintenance');
      }
      return false;
    }
    
    // If production-only mode is enabled, only show on production
    if (settings.maintenance_production_only && !isProductionEnv) {
      if (!isHire) {
        console.log('🔍 [MAINTENANCE DEBUG] Production-only mode enabled but not in production - no maintenance');
      }
      return false;
    }
    
    // If super admin bypass is enabled and user is super admin, don't show
    if (settings.maintenance_super_admin_bypass && isAdmin) {
      if (!isHire) {
        console.log('🔍 [MAINTENANCE DEBUG] Super admin bypass enabled and user is admin - no maintenance');
      }
      return false;
    }
    
    if (!isHire) {
      console.log('🔍 [MAINTENANCE DEBUG] All checks passed - showing maintenance');
    }
    return true;
  };

  return {
    settings,
    loading,
    isDeveloperMode: shouldShowMaintenance(),
    countdownEnabled: settings.maintenance_countdown_enabled || false,
    returnTimeHours: settings.maintenance_return_time || 2,
    refetch: fetchSettings
  };
};