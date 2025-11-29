
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface PhoneValidationAlertProps {
  phoneNumber: string;
  validationResult?: {
    isValid: boolean;
    normalizedNumber: string;
    country?: string;
    carrier?: string;
    error?: string;
    suggestions?: string[];
  };
}

const PhoneValidationAlert: React.FC<PhoneValidationAlertProps> = ({ 
  phoneNumber, 
  validationResult 
}) => {
  if (!validationResult) return null;

  if (validationResult.isValid) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700 text-sm">
          <div className="space-y-1">
            <div>✅ Phone number validated: {validationResult.normalizedNumber}</div>
            {validationResult.country && (
              <div>📍 Country: {validationResult.country}</div>
            )}
            {validationResult.carrier && (
              <div>📱 Type: {validationResult.carrier}</div>
            )}
            {validationResult.suggestions && validationResult.suggestions.length > 0 && (
              <div className="mt-2">
                <div className="font-medium">Auto-corrections applied:</div>
                {validationResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-xs">• {suggestion}</div>
                ))}
              </div>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertDescription className="text-red-700 text-sm">
        <div className="space-y-2">
          <div className="font-medium">❌ {validationResult.error}</div>
          {validationResult.suggestions && validationResult.suggestions.length > 0 && (
            <div>
              <div className="font-medium">💡 Suggestions:</div>
              {validationResult.suggestions.map((suggestion, index) => (
                <div key={index} className="text-xs">• {suggestion}</div>
              ))}
            </div>
          )}
          <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
            <Info className="h-3 w-3 inline mr-1" />
            <span className="text-xs">
              If you continue having issues, try registering with your email address instead.
            </span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default PhoneValidationAlert;
