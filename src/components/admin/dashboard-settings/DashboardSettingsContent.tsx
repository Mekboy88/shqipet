import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Database, Activity, RotateCcw, Bell, Shield, Palette, Download, Zap, Link, Settings } from "lucide-react";
import { useDashboardSettings } from '@/hooks/admin/useDashboardSettings';
import CardsLayoutSection from './sections/CardsLayoutSection';
import DataSourcesSection from './sections/DataSourcesSection';
import ThresholdsSection from './sections/ThresholdsSection';
import RefreshRealtimeSection from './sections/RefreshRealtimeSection';
import AlertsNotificationsSection from './sections/AlertsNotificationsSection';
import PermissionsPrivacySection from './sections/PermissionsPrivacySection';
import PresentationThemeSection from './sections/PresentationThemeSection';
import ExportsSharingSection from './sections/ExportsSharingSection';
import PerformanceCachingSection from './sections/PerformanceCachingSection';
import IntegrationsSection from './sections/IntegrationsSection';
import AdvancedSection from './sections/AdvancedSection';

interface DashboardSettingsContentProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardSettingsContent: React.FC<DashboardSettingsContentProps> = ({
  activeTab = 'layout',
  onTabChange
}) => {
  const { settings, updateSettings, isLoading } = useDashboardSettings();

  const tabs = [
    { id: 'layout', label: 'Cards & Layout', icon: Layout },
    { id: 'datasources', label: 'Data Sources', icon: Database },
    { id: 'thresholds', label: 'Thresholds & Health', icon: Activity },
    { id: 'refresh', label: 'Refresh & Realtime', icon: RotateCcw },
    { id: 'alerts', label: 'Alerts & Notifications', icon: Bell },
    { id: 'permissions', label: 'Permissions & Privacy', icon: Shield },
    { id: 'presentation', label: 'Presentation & Theme', icon: Palette },
    { id: 'exports', label: 'Exports & Sharing', icon: Download },
    { id: 'performance', label: 'Performance & Caching', icon: Zap },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Skeleton for tab buttons */}
          <div className="border-b px-0 py-4">
            <div className="flex flex-wrap justify-center gap-2 h-auto p-3">
              {Array.from({ length: 11 }, (_, i) => (
                <div 
                  key={i} 
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-w-[120px] h-12 rounded-full border-2 bg-gray-100 animate-pulse"
                >
                  <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Skeleton content */}
          <div className="space-y-6 mt-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="p-6 border rounded-lg space-y-4 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
            <div className="border-b px-6 py-4">
              <TabsList className="flex flex-wrap justify-center gap-2 h-auto p-3 bg-transparent">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  // PERMANENTLY FIXED colors - exactly like in your photo
                  const permanentColors = [
                    'bg-blue-100 border-blue-200 text-blue-700 shadow-blue-100',      // Cards & Layout
                    'bg-green-100 border-green-200 text-green-700 shadow-green-100',   // Data Sources  
                    'bg-yellow-100 border-yellow-200 text-yellow-700 shadow-yellow-100', // Thresholds
                    'bg-red-100 border-red-200 text-red-700 shadow-red-100',          // Refresh
                    'bg-purple-100 border-purple-200 text-purple-700 shadow-purple-100', // Alerts
                    'bg-indigo-100 border-indigo-200 text-indigo-700 shadow-indigo-100', // Permissions
                    'bg-pink-100 border-pink-200 text-pink-700 shadow-pink-100',      // Presentation
                    'bg-orange-100 border-orange-200 text-orange-700 shadow-orange-100', // Exports
                    'bg-teal-100 border-teal-200 text-teal-700 shadow-teal-100',      // Performance
                    'bg-cyan-100 border-cyan-200 text-cyan-700 shadow-cyan-100',      // Integrations
                    'bg-slate-100 border-slate-200 text-slate-700 shadow-slate-100'   // Advanced
                  ];
                  
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="p-0 bg-transparent border-0 shadow-none data-[state=active]:bg-transparent data-[state=active]:shadow-none h-auto"
                      style={{ all: 'unset', display: 'block' }}
                    >
                      <div className={`
                        inline-flex items-center justify-center gap-2
                        px-4 py-3 min-w-[120px] h-12
                        rounded-full border-2
                        transition-all duration-200
                        shadow-md hover:shadow-lg hover:scale-105
                        font-medium text-sm cursor-pointer
                        ${permanentColors[index]}
                      `}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span className="font-semibold whitespace-nowrap">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              <TabsContent value="layout" className="space-y-6 mt-6">
                <CardsLayoutSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="datasources" className="space-y-6 mt-6">
                <DataSourcesSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="thresholds" className="space-y-6 mt-6">
                <ThresholdsSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="refresh" className="space-y-6 mt-6">
                <RefreshRealtimeSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="alerts" className="space-y-6 mt-6">
                <AlertsNotificationsSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-6 mt-6">
                <PermissionsPrivacySection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="presentation" className="space-y-6 mt-6">
                <PresentationThemeSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="exports" className="space-y-6 mt-6">
                <ExportsSharingSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="performance" className="space-y-6 mt-6">
                <PerformanceCachingSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="integrations" className="space-y-6 mt-6">
                <IntegrationsSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-6 mt-6">
                <AdvancedSection settings={settings} updateSettings={updateSettings} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettingsContent;