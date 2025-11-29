import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IntelligentInput } from '@/components/form/IntelligentInput';
import { SessionTimeoutWarning } from '@/components/session/SessionTimeoutWarning';
import { TokenRefreshIndicator } from '@/components/session/TokenRefreshIndicator';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useDraftFormRestore } from '@/hooks/useDraftFormRestore';
import { Clock, Save, RotateCcw, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SessionRecoveryDemo: React.FC = () => {
  const { toast } = useToast();
  
  // Session timeout management
  const {
    isExpiring,
    minutesLeft,
    isRefreshing,
    lastRefresh,
    extendSession,
    dismissWarning
  } = useSessionTimeout({
    warningTime: 2, // Show warning 2 minutes before expiry
    onWarning: (minutes) => {
      toast({
        title: "Session Warning",
        description: `Your session will expire in ${minutes} minute${minutes === 1 ? '' : 's'}`,
        variant: "destructive"
      });
    },
    onExpired: () => {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue",
        variant: "destructive"
      });
    },
    onRefreshed: () => {
      toast({
        title: "Session Refreshed",
        description: "Your session has been extended successfully",
      });
    }
  });

  // Draft form restoration
  const {
    formData,
    isDrafted,
    lastSaved,
    updateField,
    clearDraft,
    getDraftAge
  } = useDraftFormRestore({
    formId: 'session-demo-form',
    saveInterval: 1500, // Save every 1.5 seconds for demo
    clearOnSubmit: true
  });

  // Demo form state
  const [demoData, setDemoData] = useState({
    companyName: '',
    businessEmail: '',
    description: '',
    requirements: ''
  });

  const handleFieldChange = (field: keyof typeof demoData) => (value: string) => {
    const newData = { ...demoData, [field]: value };
    setDemoData(newData);
    updateField(field, value);
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Form data has been saved and draft cleared",
    });
    clearDraft();
    setDemoData({
      companyName: '',
      businessEmail: '',
      description: '',
      requirements: ''
    });
  };

  const restoreDraft = () => {
    setDemoData({
      companyName: formData.companyName || '',
      businessEmail: formData.businessEmail || '',
      description: formData.description || '',
      requirements: formData.requirements || ''
    });
    toast({
      title: "Draft Restored",
      description: "Your previous form data has been restored",
    });
  };

  // Simulate session expiry for demo
  const triggerSessionWarning = () => {
    toast({
      title: "Demo: Session Warning Triggered",
      description: "This simulates a session timeout warning",
    });
  };

  return (
    <div className="space-y-6">
      {/* Session Timeout Warning */}
      <SessionTimeoutWarning
        isVisible={isExpiring}
        minutesLeft={minutesLeft}
        isRefreshing={isRefreshing}
        onExtend={extendSession}
        onDismiss={dismissWarning}
      />

      {/* Token Refresh Indicator */}
      <TokenRefreshIndicator
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh}
        position="top-right"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-green-600" />
            Session-Aware State Recovery Demo
          </CardTitle>
          <CardDescription>
            Experience intelligent session management with timeout warnings, refresh indicators, and auto-save functionality.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Controls */}
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            <Button
              size="sm"
              variant="outline"
              onClick={triggerSessionWarning}
              className="text-orange-600 border-orange-300"
            >
              <Clock className="h-4 w-4 mr-1" />
              Demo Warning
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Reset the demo state properly
                dismissWarning();
                clearDraft();
                setDemoData({
                  companyName: '',
                  businessEmail: '',
                  description: '',
                  requirements: ''
                });
                toast({
                  title: "Demo Reset",
                  description: "Demo state has been reset",
                });
              }}
              className="text-blue-600 border-blue-300"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reset Demo
            </Button>
          </div>

          {/* Draft Status */}
          {isDrafted && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Draft Available
                </span>
                <Badge variant="outline" className="text-xs">
                  {getDraftAge()}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={restoreDraft}
                className="text-blue-600 border-blue-300"
              >
                Restore Draft
              </Button>
            </div>
          )}

          {/* Demo Form */}
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                Company Name
                <Badge variant="outline" className="text-xs">Auto-saved</Badge>
              </label>
              <IntelligentInput
                id="session-company"
                placeholder="Enter your company name"
                value={demoData.companyName}
                onChange={handleFieldChange('companyName')}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                Business Email
                <Badge variant="outline" className="text-xs">Auto-saved</Badge>
              </label>
              <IntelligentInput
                id="session-email"
                placeholder="business@company.com"
                value={demoData.businessEmail}
                onChange={handleFieldChange('businessEmail')}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                Business Description
                <Badge variant="outline" className="text-xs">Auto-saved</Badge>
              </label>
              <IntelligentInput
                id="session-description"
                type="textarea"
                placeholder="Describe your business..."
                value={demoData.description}
                onChange={handleFieldChange('description')}
                textareaProps={{ rows: 3 }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                Project Requirements
                <Badge variant="outline" className="text-xs">Auto-saved</Badge>
              </label>
              <IntelligentInput
                id="session-requirements"
                type="textarea"
                placeholder="What are your project requirements?"
                value={demoData.requirements}
                onChange={handleFieldChange('requirements')}
                textareaProps={{ rows: 4 }}
              />
            </div>
          </div>

          {/* Feature Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-800 text-sm">Session Timeout Handler</h4>
              <p className="text-xs text-orange-600 mt-1">Non-intrusive countdown warnings</p>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800 text-sm">Token Refresh Cue</h4>
              <p className="text-xs text-blue-600 mt-1">Visual feedback during refresh</p>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Save className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800 text-sm">Auto-Restore</h4>
              <p className="text-xs text-green-600 mt-1">Automatic form data recovery</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSubmit} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Form
            </Button>
            {isDrafted && (
              <Button variant="outline" onClick={clearDraft}>
                Clear Draft
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};