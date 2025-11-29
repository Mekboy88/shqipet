import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConnectionStatus {
  isConnected: boolean;
  sectionsStatus: { [key: string]: boolean };
  lastSync: Date | null;
  pendingChanges: number;
  totalSettings: number;
  loadedSettings: number;
}

export const useNotificationSettingsMonitor = () => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isConnected: false,
    sectionsStatus: {},
    lastSync: null,
    pendingChanges: 0,
    totalSettings: 0,
    loadedSettings: 0
  });

  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);

  useEffect(() => {
    // Monitor real-time connection
    const setupRealtimeMonitoring = () => {
      const channel = supabase
        .channel('notification_settings_monitor')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notification_settings'
          },
          (payload) => {
            console.log('📡 Real-time notification settings change detected:', payload);
            
            setStatus(prev => ({
              ...prev,
              isConnected: true,
              lastSync: new Date()
            }));
            
            // Track which section this setting belongs to
            const settingKey = (payload.new as any)?.setting_key || (payload.old as any)?.setting_key;
            if (settingKey) {
              const sectionMapping = getSectionForSetting(settingKey);
              setStatus(prev => ({
                ...prev,
                sectionsStatus: {
                  ...prev.sectionsStatus,
                  [sectionMapping]: true
                }
              }));
            }
          }
        )
        .subscribe((status) => {
          console.log('🔌 Realtime subscription status:', status);
          setStatus(prev => ({
            ...prev,
            isConnected: status === 'SUBSCRIBED'
          }));
        });

      setRealtimeChannel(channel);
    };

    setupRealtimeMonitoring();

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []);

  // Test database connectivity for all sections
  const testAllSectionsConnectivity = async () => {
    const sections = {
      'presets': ['active_profile', 'profile_data'],
      'rate_limiting': ['cooldown_seconds', 'auto_collapse_burst'],
      'live_updates': ['live_sync_enabled', 'preview_updates_live'],
      'pause_controls': ['global_pause_active', 'global_pause_duration'],
      'device_preferences': ['desktop_only_mode', 'mobile_sync'],
      'sound_audio': ['sound_enabled', 'sound_type'],
      'categories_filtering': ['initial_filter_tab', 'group_similar_alerts'],
      'luna_ai': ['auto_open_luna_ai', 'ai_summary_enabled'],
      'appearance_theme': ['theme_mode', 'high_contrast_mode'],
      'time_based': ['quiet_hours_enabled', 'weekend_mode'],
      'tags_priority': ['show_sentiment_tags', 'show_role_based_visibility'],
      'ai_controls': ['ai_auto_summary', 'ai_auto_tagging'],
      'audit_compliance': ['auto_link_audit_trail', 'investigation_mode'],
      'automations': ['inactivity_muting_enabled', 'escalation_trigger_mode'],
      'ai_tuning': ['ai_learning_enabled', 'feedback_collection'],
      'team_routing': ['team_based_routing', 'role_based_distribution'],
      'mobile_cross_platform': ['mobile_push_enabled', 'vibration_pattern'],
      'analytics_reporting': ['analytics_enabled', 'performance_tracking'],
      'advanced_settings': ['debug_mode', 'experimental_features']
    };

    const sectionResults: { [key: string]: boolean } = {};
    let totalSettings = 0;
    let loadedSettings = 0;

    for (const [sectionName, settingKeys] of Object.entries(sections)) {
      try {
        totalSettings += settingKeys.length;
        let sectionConnected = false;

        for (const key of settingKeys) {
          try {
            // Test read access by trying to get the setting
            const { data, error } = await supabase
              .from('notification_settings')
              .select('setting_value')
              .eq('setting_key', key)
              .limit(1);

            if (!error) {
              sectionConnected = true;
              loadedSettings++;
            }
          } catch (error) {
            console.warn(`❌ Failed to test connectivity for ${key}:`, error);
          }
        }

        sectionResults[sectionName] = sectionConnected;
      } catch (error) {
        console.error(`❌ Failed to test section ${sectionName}:`, error);
        sectionResults[sectionName] = false;
      }
    }

    setStatus(prev => ({
      ...prev,
      sectionsStatus: sectionResults,
      totalSettings,
      loadedSettings,
      lastSync: new Date()
    }));

    // Show summary toast
    const connectedSections = Object.values(sectionResults).filter(Boolean).length;
    const totalSections = Object.keys(sectionResults).length;
    
    if (connectedSections === totalSections) {
      toast.success(`✅ All ${totalSections} sections connected to database`);
    } else {
      toast.warning(`⚠️ ${connectedSections}/${totalSections} sections connected`);
    }

    return sectionResults;
  };

  // Get section name for a specific setting
  const getSectionForSetting = (settingKey: string): string => {
    const sectionMap: { [key: string]: string } = {
      // Section 1: Presets & Profiles
      'active_profile': 'presets',
      'profile_data': 'presets',
      
      // Section 2: Rate Limiting
      'cooldown_seconds': 'rate_limiting',
      'auto_collapse_burst': 'rate_limiting',
      
      // Section 3: Live Updates
      'live_sync_enabled': 'live_updates',
      'preview_updates_live': 'live_updates',
      
      // Section 4: Pause Controls
      'global_pause_active': 'pause_controls',
      'global_pause_duration': 'pause_controls',
      
      // Section 5: Device Preferences
      'desktop_only_mode': 'device_preferences',
      'mobile_sync': 'device_preferences',
      
      // Section 6: Sound & Audio
      'sound_enabled': 'sound_audio',
      'sound_type': 'sound_audio',
      
      // Section 7: Categories & Filtering
      'initial_filter_tab': 'categories_filtering',
      'group_similar_alerts': 'categories_filtering',
      
      // Section 8: LunaAI
      'auto_open_luna_ai': 'luna_ai',
      'ai_summary_enabled': 'luna_ai',
      
      // Section 9: Appearance & Theme
      'theme_mode': 'appearance_theme',
      'high_contrast_mode': 'appearance_theme',
      
      // Section 10: Time-Based Rules
      'quiet_hours_enabled': 'time_based',
      'weekend_mode': 'time_based',
      
      // Section 11: Tags & Priority
      'show_sentiment_tags': 'tags_priority',
      'show_role_based_visibility': 'tags_priority',
      
      // Section 12: AI Controls
      'ai_auto_summary': 'ai_controls',
      'ai_auto_tagging': 'ai_controls',
      
      // Section 13: Audit & Compliance
      'auto_link_audit_trail': 'audit_compliance',
      'investigation_mode': 'audit_compliance',
      
      // Section 14: Automations
      'inactivity_muting_enabled': 'automations',
      'escalation_trigger_mode': 'automations',
      
      // Section 15: AI Tuning
      'ai_learning_enabled': 'ai_tuning',
      'feedback_collection': 'ai_tuning',
      
      // Section 16: Team Routing
      'team_based_routing': 'team_routing',
      'role_based_distribution': 'team_routing',
      
      // Section 17: Mobile & Cross-Platform
      'mobile_push_enabled': 'mobile_cross_platform',
      'vibration_pattern': 'mobile_cross_platform',
      
      // Section 18: Analytics & Reporting
      'analytics_enabled': 'analytics_reporting',
      'performance_tracking': 'analytics_reporting',
      
      // Section 19: Advanced Settings
      'debug_mode': 'advanced_settings',
      'experimental_features': 'advanced_settings'
    };

    return sectionMap[settingKey] || 'unknown';
  };

  return {
    status,
    testAllSectionsConnectivity,
    getSectionForSetting
  };
};