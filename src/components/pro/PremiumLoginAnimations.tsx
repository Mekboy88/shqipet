import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, User, LogIn } from 'lucide-react';

interface PremiumLoginAnimationsProps {
  isDemo?: boolean;
  className?: string;
}

export const PremiumLoginAnimations: React.FC<PremiumLoginAnimationsProps> = ({
  isDemo = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState<'idle' | 'revealing' | 'loading' | 'verified'>('idle');
  const [isVisible, setIsVisible] = useState(false);

  const startDemo = () => {
    setCurrentStep('revealing');
    setIsVisible(false);
    
    // Form reveal animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Loading animation
    setTimeout(() => setCurrentStep('loading'), 1500);
    
    // Verified badge
    setTimeout(() => setCurrentStep('verified'), 3000);
    
    // Reset
    setTimeout(() => {
      setCurrentStep('idle');
      setIsVisible(false);
    }, 5000);
  };

  useEffect(() => {
    if (isDemo) {
      startDemo();
    }
  }, [isDemo]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-indigo-800">Premium Login Experience</h4>
        <button
          onClick={startDemo}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 transition-colors"
        >
          Preview Demo
        </button>
      </div>

      {/* Premium Login Form with Animations */}
      <div className="relative">
        {currentStep !== 'idle' && (
          <div className={`
            transform transition-all duration-700 ease-out
            ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}
          `}>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-lg">
              {/* Premium Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Pro Experience
                </div>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your Pro email"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur transition-all duration-300"
                    readOnly
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/80 backdrop-blur transition-all duration-300"
                    readOnly
                  />
                </div>

                {/* Premium Login Button */}
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-center justify-center gap-2">
                    {currentStep === 'loading' ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Authenticating Pro Account...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        Sign In to Pro
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Verified Badge Animation */}
              {currentStep === 'verified' && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="animate-fade-in">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600 animate-pulse" />
                      <span className="text-green-800 font-medium">Pro Account Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'idle' && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <LogIn className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Click "Preview Demo" to see premium animations</p>
          </div>
        )}
      </div>

      {/* Animation Features List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
          <div className="font-medium text-indigo-800 mb-1">Form Reveal</div>
          <div className="text-indigo-600">Smooth slide-up with scale transition</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <div className="font-medium text-purple-800 mb-1">Loading Spinner</div>
          <div className="text-purple-600">Pro-branded loading experience</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-medium text-green-800 mb-1">Verified Badge</div>
          <div className="text-green-600">Animated verification display</div>
        </div>
      </div>
    </div>
  );
};