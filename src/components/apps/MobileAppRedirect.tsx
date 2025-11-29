import React, { useEffect } from 'react';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { Smartphone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileAppRedirect: React.FC = () => {
  const { isMobile, deviceOS, isAppInstalled, handleAppButtonClick, getButtonText } = useDeviceDetection();

  useEffect(() => {
    // Auto-redirect if app is installed (optional, remove if you want manual button click)
    if (isAppInstalled) {
      const timer = setTimeout(() => {
        handleAppButtonClick();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAppInstalled, handleAppButtonClick]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-facebook-primary to-facebook-secondary flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src="/lovable-uploads/f0d24cdf-3adf-4069-bc29-f253108a873a.png" 
          alt="Shqipet Logo" 
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <Smartphone className="w-16 h-16 mx-auto mb-4 text-facebook-primary" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isAppInstalled ? 'Hape Aplikacionin' : 'Shkarko Aplikacionin'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isAppInstalled 
            ? 'Aplikacioni është instaluar. Kliko për të hapur.'
            : 'Përdor aplikacionin tonë për përvojë më të mirë.'}
        </p>

        {/* Primary Button */}
        <Button
          onClick={handleAppButtonClick}
          className="w-full mb-4 h-12 text-lg font-semibold bg-facebook-primary hover:bg-facebook-primary/90"
        >
          {isAppInstalled ? (
            <>
              <Smartphone className="w-5 h-5 mr-2" />
              {getButtonText()}
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              {getButtonText()}
            </>
          )}
        </Button>

        {/* App Store Badges */}
        {!isAppInstalled && (
          <div className="flex flex-col gap-3 mt-6">
            {(deviceOS === 'ios' || deviceOS === 'other') && (
              <a
                href="https://apps.apple.com/app/shqipet/id123456789"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Shkarko nga</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            )}
            
            {(deviceOS === 'android' || deviceOS === 'other') && (
              <a
                href="https://play.google.com/store/apps/details?id=app.shqipet"
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Shkarko nga</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-white text-sm">
        <p>shqipet.com</p>
      </div>
    </div>
  );
};

export default MobileAppRedirect;
