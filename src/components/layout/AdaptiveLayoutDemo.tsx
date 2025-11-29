import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveLayout, DevicePreview } from '@/components/layout/ResponsiveLayout';
import { SmartErrorBox, ErrorDemo } from '@/components/layout/SmartErrorBox';
import { AccessibilityDemo, TooltipIcon } from '@/components/accessibility/AccessibleTooltip';
import { Monitor, Smartphone, Tablet, Layout, Accessibility } from 'lucide-react';

export const AdaptiveLayoutDemo: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-yellow-600" />
            Adaptive Layout Enhancements Demo
          </CardTitle>
          <CardDescription>
            Experience responsive design, smart error handling, and accessibility features across all devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Device Type Optimization Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              📱 Device Type Optimization
              <TooltipIcon
                type="info"
                content="Layouts automatically adapt to mobile (vertical), tablet (2-column), and desktop (flexible rows)"
              />
            </h4>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
              <DevicePreview deviceType="mobile">
                <ResponsiveLayout>
                  <div className="bg-blue-100 p-2 rounded text-center">Header</div>
                  <div className="bg-green-100 p-2 rounded text-center">Form</div>
                  <div className="bg-orange-100 p-2 rounded text-center">Footer</div>
                </ResponsiveLayout>
              </DevicePreview>

              <DevicePreview deviceType="tablet">
                <ResponsiveLayout>
                  <div className="bg-blue-100 p-2 rounded text-center">Header</div>
                  <div className="bg-green-100 p-2 rounded text-center">Form</div>
                  <div className="bg-orange-100 p-2 rounded text-center">Footer</div>
                </ResponsiveLayout>
              </DevicePreview>

              <DevicePreview deviceType="desktop">
                <ResponsiveLayout>
                  <div className="bg-blue-100 p-2 rounded text-center">Header</div>
                  <div className="bg-green-100 p-2 rounded text-center">Form</div>
                  <div className="bg-orange-100 p-2 rounded text-center">Footer</div>
                </ResponsiveLayout>
              </DevicePreview>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800 text-sm font-medium">
                <Monitor className="h-4 w-4" />
                Live Responsive Layout
              </div>
              <p className="text-green-700 text-xs mt-1">
                Resize your browser window to see the layout automatically adapt between mobile, tablet, and desktop views.
              </p>
            </div>
          </div>

          {/* Error Box Size Scaling Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              ⚠️ Error Box Size Scaling
              <TooltipIcon
                type="info"
                content="Error boxes smoothly animate in/out without causing layout shifts, maintaining visual stability"
              />
            </h4>
            
            <ErrorDemo />
          </div>

          {/* Tooltip Accessibility Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              ♿ Tooltip Accessibility
              <TooltipIcon
                type="info"
                content="All tooltips are keyboard accessible, screen-reader compatible, and WCAG 2.1 compliant"
              />
            </h4>
            
            <AccessibilityDemo />
          </div>

          {/* Feature Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800 text-sm">Device Optimization</h4>
              <p className="text-xs text-green-600 mt-1">Auto-responsive layouts</p>
              <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                Complete
              </Badge>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Layout className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800 text-sm">Error Box Scaling</h4>
              <p className="text-xs text-blue-600 mt-1">Smooth animations</p>
              <Badge variant="outline" className="mt-2 text-blue-700 border-blue-300">
                Tested
              </Badge>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Accessibility className="h-4 w-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-800 text-sm">A11y Compliance</h4>
              <p className="text-xs text-purple-600 mt-1">WCAG 2.1 compatible</p>
              <Badge variant="outline" className="mt-2 text-purple-700 border-purple-300">
                Implemented
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};