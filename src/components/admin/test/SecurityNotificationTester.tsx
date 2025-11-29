import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingDown,
  TestTube,
  Bell,
  Play
} from 'lucide-react';

export function SecurityNotificationTester() {
  
  const triggerTestNotification = (type: 'success' | 'warning' | 'critical' | 'risk') => {
    const testResults = {
      success: {
        scanId: `success-${Date.now()}`,
        completedAt: new Date(),
        riskScore: 94,
        securityGrade: 'A',
        passedChecks: 20,
        warnings: 0,
        criticalIssues: 0,
        totalChecks: 20,
        triggeredBy: 'Test Admin',
        scanDuration: 2.1
      },
      warning: {
        scanId: `warning-${Date.now()}`,
        completedAt: new Date(),
        riskScore: 78,
        securityGrade: 'C',
        passedChecks: 15,
        warnings: 17,
        criticalIssues: 0,
        totalChecks: 20,
        triggeredBy: 'Test Admin',
        scanDuration: 3.2
      },
      critical: {
        scanId: `critical-${Date.now()}`,
        completedAt: new Date(),
        riskScore: 45,
        securityGrade: 'F',
        passedChecks: 12,
        warnings: 5,
        criticalIssues: 3,
        totalChecks: 20,
        triggeredBy: 'Test Admin',
        scanDuration: 4.7
      },
      risk: {
        scanId: `risk-${Date.now()}`,
        completedAt: new Date(),
        riskScore: 82,
        securityGrade: 'B',
        passedChecks: 17,
        warnings: 3,
        criticalIssues: 0,
        totalChecks: 20,
        triggeredBy: 'Test Admin',
        scanDuration: 2.8
      }
    };

    // Dispatch security scan completion event
    window.dispatchEvent(new CustomEvent('securityScanCompleted', { 
      detail: testResults[type] 
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-blue-600" />
          Security Notification System Tester
        </CardTitle>
        <p className="text-sm text-gray-600">
          Test different notification scenarios for security scan results
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Test Buttons Grid */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Success Test */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Success Scenario</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-green-200 hover:bg-green-50"
              onClick={() => triggerTestNotification('success')}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Success Alert
            </Button>
            <div className="text-xs text-gray-600">
              Risk: 94 • Grade: A • Issues: 0
            </div>
          </div>

          {/* Warning Test */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800">Warning Scenario</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-orange-200 hover:bg-orange-50"
              onClick={() => triggerTestNotification('warning')}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Warning Alert
            </Button>
            <div className="text-xs text-gray-600">
              Risk: 78 • Grade: C • Warnings: 17
            </div>
          </div>

          {/* Critical Test */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800">Critical Scenario</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-red-200 hover:bg-red-50"
              onClick={() => triggerTestNotification('critical')}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Critical Alert
            </Button>
            <div className="text-xs text-gray-600">
              Risk: 45 • Grade: F • Critical: 3
            </div>
          </div>

          {/* Risk Score Test */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
              <span className="font-medium text-yellow-800">Risk Score Alert</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-yellow-200 hover:bg-yellow-50"
              onClick={() => triggerTestNotification('risk')}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Risk Alert
            </Button>
            <div className="text-xs text-gray-600">
              Risk: 82 • Grade: B • Below threshold
            </div>
          </div>
        </div>

        {/* Expected Behaviors */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Expected Notification Behaviors
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex justify-between">
              <span>✅ Success:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Green toast with success actions
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>⚠️ Warning:</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Orange toast with fix actions
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>🚨 Critical:</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Red toast with urgent actions
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>📉 Risk Alert:</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Yellow toast with threshold warning
              </Badge>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <strong>How to test:</strong> Click any test button above to trigger a notification. 
          The SecurityScanNotificationSystem will show the appropriate toast notification 
          based on the scan results. Each notification includes action buttons for viewing reports, 
          fixing issues, assigning admins, or exporting data.
        </div>
      </CardContent>
    </Card>
  );
}