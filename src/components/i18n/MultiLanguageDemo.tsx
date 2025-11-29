import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { RTLLayout, RTLAwareInput, RTLAwareButton, LocaleDetectionIndicator } from '@/components/i18n/RTLLayout';
import { useLocalization } from '@/hooks/useLocalization';
import { Globe, ArrowRight, ArrowLeft, Monitor, Smartphone } from 'lucide-react';

export const MultiLanguageDemo: React.FC = () => {
  const { currentLanguage, isRTL, getCurrentLanguage, t } = useLocalization();
  const [demoForm, setDemoForm] = useState({
    email: '',
    password: '',
    name: ''
  });

  const currentLang = getCurrentLanguage();

  const handleInputChange = (field: keyof typeof demoForm) => (value: string) => {
    setDemoForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-600" />
            Multi-Language UX Support Demo
          </CardTitle>
          <CardDescription>
            Experience auto locale detection, RTL layout support, and real-time language switching.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Auto Locale Detection Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              🔍 Auto Locale Detection
            </h4>
            
            <LocaleDetectionIndicator className="mb-4" />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-800 mb-2">Current Browser Language Detection:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Browser Language:</strong> {navigator.language}
                </div>
                <div>
                  <strong>All Languages:</strong> {navigator.languages?.join(', ') || 'Not available'}
                </div>
                <div>
                  <strong>Detected Language:</strong> {currentLang.nativeName} ({currentLang.code})
                </div>
                <div>
                  <strong>RTL Support:</strong> {isRTL ? '✅ Active' : '❌ Not needed'}
                </div>
              </div>
            </div>
          </div>

          {/* Language Switcher Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              🌐 Language Switcher
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Default Variant</h5>
                <LanguageSwitcher variant="default" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Compact Variant</h5>
                <LanguageSwitcher variant="compact" />
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Icon Only</h5>
                <LanguageSwitcher variant="icon-only" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                💡 Language changes happen instantly without page reload. Try switching languages above!
              </p>
            </div>
          </div>

          {/* RTL Layout Demo */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              🔄 RTL Layout Support
              <Badge variant="outline" className={`${isRTL ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                {isRTL ? 'RTL Active' : 'LTR Active'}
              </Badge>
            </h4>

            <RTLLayout>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{t('login.title', 'Sign In')}</h5>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {isRTL ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                    Direction: {isRTL ? 'RTL' : 'LTR'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('login.email', 'Email')}
                    </label>
                    <RTLAwareInput
                      type="email"
                      placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      value={demoForm.email}
                      onChange={handleInputChange('email')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('login.password', 'Password')}
                    </label>
                    <RTLAwareInput
                      type="password"
                      placeholder={isRTL ? 'أدخل كلمة المرور' : 'Enter your password'}
                      value={demoForm.password}
                      onChange={handleInputChange('password')}
                    />
                  </div>

                  <div className="flex gap-3">
                    <RTLAwareButton variant="primary">
                      {t('login.submit', 'Sign In')}
                    </RTLAwareButton>
                    <RTLAwareButton variant="outline">
                      {t('common.cancel', 'Cancel')}
                    </RTLAwareButton>
                  </div>
                </div>
              </div>
            </RTLLayout>

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                📝 <strong>RTL Features:</strong> Text alignment, input direction, button order, and layout flow 
                automatically reverse for Arabic, Hebrew, and Persian languages.
              </p>
            </div>
          </div>

          {/* Device Responsiveness */}
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-4">
              📱 Cross-Device Language Support
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Monitor className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Desktop View</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Language Switcher:</span>
                    <span>Full dropdown with flags</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RTL Layout:</span>
                    <span>Full sidebar reversal</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Detection:</span>
                    <span>Browser language API</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Mobile View</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Language Switcher:</span>
                    <span>Compact/Icon modes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RTL Layout:</span>
                    <span>Touch-optimized RTL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Detection:</span>
                    <span>Device locale support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800 text-sm">Auto Locale Detection</h4>
              <p className="text-xs text-green-600 mt-1">Browser language detection</p>
              <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                Implemented
              </Badge>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ArrowRight className="h-4 w-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-800 text-sm">RTL Compatibility</h4>
              <p className="text-xs text-orange-600 mt-1">Right-to-left layout support</p>
              <Badge variant="outline" className="mt-2 text-orange-700 border-orange-300">
                Implemented
              </Badge>
            </div>

            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Monitor className="h-4 w-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800 text-sm">Language Switcher</h4>
              <p className="text-xs text-blue-600 mt-1">Real-time language change</p>
              <Badge variant="outline" className="mt-2 text-blue-700 border-blue-300">
                Implemented
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};