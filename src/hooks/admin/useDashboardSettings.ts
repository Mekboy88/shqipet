import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardSettings {
  layout?: {
    cards?: Array<{
      id: string;
      size: string;
      order: number;
      visible: boolean;
    }>;
    density?: string;
    defaultDateWindow?: string;
  };
  datasources?: any;
  thresholds?: any;
  refresh?: any;
  alerts?: any;
  permissions?: any;
  theme?: any;
  exports?: any;
  performance?: any;
  integrations?: any;
  advanced?: any;
  cards?: any;
}

export const useDashboardSettings = () => {
  const [settings, setSettings] = useState<DashboardSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadSettings = useCallback(async () => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      );
      
      const queryPromise = supabase
        .from('dashboard_settings')
        .select('*')
        .maybeSingle();

      let result;
      try {
        result = await Promise.race([queryPromise, timeoutPromise]) as any;
      } catch (dbError) {
        console.warn('Dashboard settings query error:', dbError);
        // Use default settings on any error
        result = { data: null, error: dbError };
      }

      const { data, error } = result;

      if (data) {
        setSettings({
          layout: data.layout as any,
          datasources: data.data_sources as any,
          thresholds: data.thresholds as any,
          refresh: data.refresh_config as any,
          alerts: data.alerts as any,
          permissions: data.permissions as any,
          theme: data.theme as any,
          exports: data.exports as any,
          performance: data.performance as any,
          integrations: data.integrations as any,
          advanced: data.advanced as any,
          cards: (data as any).cards || {}
        });
      } else {
        // Use default settings if none exist or on database error
        const defaultSettings = {
          layout: {
            cards: [
              { id: "totalUsers", size: "medium", order: 0, visible: true },
              { id: "onlineUsers", size: "medium", order: 1, visible: true },
              { id: "contentPosts", size: "medium", order: 2, visible: true },
              { id: "messages", size: "medium", order: 3, visible: true },
            ],
            density: "comfortable",
            defaultDateWindow: "24h"
          },
          datasources: {},
          refresh: {
            globalInterval: 30000,
            allowCardOverrides: true
          },
          thresholds: {
            uptime: { warning: 95, critical: 90 },
            latency: { warning: 1000, critical: 2000 },
            errorRate: { warning: 1, critical: 5 }
          },
          alerts: {},
          permissions: {
            piiSafeMode: false
          },
          theme: {},
          exports: {},
          performance: {},
          integrations: {},
          advanced: {}
        };

        // Set default settings immediately
        setSettings(defaultSettings);

        // Only try to save to database if no error occurred (meaning database is accessible)
        if (!error) {
          try {
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData?.user?.id;
            
            if (userId) {
              await supabase
                .from('dashboard_settings')
                .insert({
                  user_id: userId,
                  layout: defaultSettings.layout,
                  data_sources: defaultSettings.datasources || {},
                  thresholds: defaultSettings.thresholds,
                  refresh_config: defaultSettings.refresh,
                  alerts: defaultSettings.alerts || {},
                  permissions: defaultSettings.permissions,
                  theme: defaultSettings.theme || {},
                  exports: defaultSettings.exports || {},
                  performance: defaultSettings.performance || {},
                  integrations: defaultSettings.integrations || {},
                  advanced: defaultSettings.advanced || {}
                });
            }
          } catch (insertError) {
            console.warn('Could not save default settings to database:', insertError);
          }
        }
      }
    } catch (error) {
      console.warn('Error loading dashboard settings:', error);
      // Use default settings as fallback
      const defaultSettings = {
        layout: {
          cards: [
            { id: "totalUsers", size: "medium", order: 0, visible: true },
            { id: "onlineUsers", size: "medium", order: 1, visible: true },
            { id: "contentPosts", size: "medium", order: 2, visible: true },
            { id: "messages", size: "medium", order: 3, visible: true },
          ],
          density: "comfortable",
          defaultDateWindow: "24h"
        },
        datasources: {},
        refresh: { globalInterval: 30000, allowCardOverrides: true },
        thresholds: {
          uptime: { warning: 95, critical: 90 },
          latency: { warning: 1000, critical: 2000 },
          errorRate: { warning: 1, critical: 5 }
        },
        alerts: {}, permissions: { piiSafeMode: false },
        theme: {}, exports: {}, performance: {}, integrations: {}, advanced: {}
      };
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  }, []); // Remove toast dependency to prevent infinite loops

  const updateSettings = useCallback(async (updates: Partial<DashboardSettings>) => {
    try {
      const newSettings = { ...settings, ...updates };
      
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('dashboard_settings')
        .upsert({
          user_id: userId,
          layout: newSettings.layout,
          data_sources: newSettings.datasources || {},
          thresholds: newSettings.thresholds || {},
          refresh_config: newSettings.refresh || {},
          alerts: newSettings.alerts || {},
          permissions: newSettings.permissions || {},
          theme: newSettings.theme || {},
          exports: newSettings.exports || {},
          performance: newSettings.performance || {},
          integrations: newSettings.integrations || {},
          advanced: newSettings.advanced || {}
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(newSettings);
      
      toast({
        title: "Settings Updated",
        description: "Dashboard settings have been saved successfully",
      });
    } catch (error) {
      console.error('Error updating dashboard settings:', error);
      toast({
        title: "Error",
        description: "Failed to update dashboard settings",
        variant: "destructive"
      });
    }
  }, [settings, toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Subscribe to real-time changes (disabled to prevent auto-refresh issues)
  // useEffect(() => {
  //   const channel = supabase
  //     .channel('dashboard_settings_changes')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'dashboard_settings'
  //       },
  //       () => {
  //         loadSettings();
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [loadSettings]);

  return {
    settings,
    updateSettings,
    isLoading,
    reload: loadSettings
  };
};