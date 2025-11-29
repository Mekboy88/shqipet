
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Trash2, UserX, AlertTriangle, Shield } from 'lucide-react';

const deactivationPeriods = [
  { id: '1w', label: 'Deactivate for 1 week' },
  { id: '1m', label: 'Deactivate for 1 month' },
  { id: '3m', label: 'Deactivate for 3 months' },
  { id: '6m', label: 'Deactivate for 6 months' },
  { id: '1y', label: 'Deactivate for 1 year' },
  { id: 'manual', label: 'Deactivate until I log back in' },
];

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const DeleteAccountForm = () => {
  const [password, setPassword] = useState('');
  const [choice, setChoice] = useState('deactivate');
  const [deactivationPeriod, setDeactivationPeriod] = useState('1w');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-red-200/50">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Fshirja e Llogarisë</h2>
        <p className="text-gray-700 text-lg">
          Menaxhoni opsionet për deaktivizimin ose fshirjen e përhershme të llogarisë suaj
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Deactivation */}
        <div className="space-y-6">
          {/* Account Options Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <UserX className="w-5 h-5 text-primary" />
                Opsionet e Llogarisë
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={choice} onValueChange={setChoice} className="grid grid-cols-1 gap-4">
                <Label 
                  htmlFor="deactivate" 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    choice === 'deactivate' 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="deactivate" id="deactivate" />
                    <div>
                      <span className="font-semibold text-gray-800">Deaktivizo llogarinë time</span>
                      <p className="text-sm text-gray-600 mt-1">Llogaria juaj do të fshihet përkohësisht dhe mund të aktivizohet sërish.</p>
                    </div>
                  </div>
                </Label>
                <Label 
                  htmlFor="delete" 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    choice === 'delete' 
                      ? 'border-red-500 bg-red-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="delete" id="delete" />
                    <div>
                      <span className="font-semibold text-gray-800">Fshi përgjithmonë</span>
                      <p className="text-sm text-gray-600 mt-1">Ky veprim nuk mund të zhbëhet. Të gjitha të dhënat do të humbin.</p>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Deactivation Options */}
          {choice === 'deactivate' && (
            <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50 animate-in fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Deaktivizimi i Llogarisë
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Zgjidhni periudhën e deaktivizimit</h3>
                  <RadioGroup value={deactivationPeriod} onValueChange={setDeactivationPeriod} className="space-y-3">
                    {deactivationPeriods.map((period) => (
                      <div key={period.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value={period.id} id={period.id} />
                        <Label htmlFor={period.id} className="font-normal text-gray-700 cursor-pointer">
                          {period.label === 'Deactivate for 1 week' ? 'Deaktivizo për 1 javë' :
                           period.label === 'Deactivate for 1 month' ? 'Deaktivizo për 1 muaj' :
                           period.label === 'Deactivate for 3 months' ? 'Deaktivizo për 3 muaj' :
                           period.label === 'Deactivate for 6 months' ? 'Deaktivizo për 6 muaj' :
                           period.label === 'Deactivate for 1 year' ? 'Deaktivizo për 1 vit' :
                           'Deaktivizo derisa të hyj sërish'}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200/50">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-blue-800 font-medium text-sm">Informacion i Rëndësishëm</p>
                        <p className="text-blue-700 text-xs mt-1">
                          Nëse vetëm hyni në llogari, ajo do të aktivizohet automatikisht.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 font-medium transition-all duration-200 hover:shadow-md"
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Deaktivizo Llogarinë
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Permanent Delete */}
        <div className="space-y-6">
          {/* Permanent Delete */}
          {choice === 'delete' && (
            <Card className="bg-white rounded-2xl shadow-lg border border-red-200/50 animate-in fade-in">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-red-700 border-b border-red-200 pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Fshirja e Përhershme
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium text-sm">Kujdes: Veprim i Pakthyeshëm</p>
                        <p className="text-red-700 text-xs mt-1">
                          Të gjitha të dhënat tuaja do të fshihen përgjithmonë dhe nuk mund të rikthehen.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-red-700">Konfirmoni fshirjen e përhershme</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">✗ Të gjitha postimet tuaja do të fshihen</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">✗ Të gjitha të dhënat personale do të fshihen</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">✗ Historiku i pagesave do të fshihet</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password-delete" className="text-sm font-medium text-gray-700 mb-2 block">
                      Shkruani fjalëkalimin tuaj për të konfirmuar
                    </Label>
                    <Input 
                      id="password-delete" 
                      type="password" 
                      placeholder="Fjalëkalimi aktual" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg border-red-200 focus:border-red-300"
                    />
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 hover:shadow-lg"
                    disabled={!password.trim()}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Fshi Llogarinë Time Përgjithmonë
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning Info Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3">
                Para se të Vazhdoni
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Konsideroni Deaktivizimin:</strong> Nëse nuk jeni të sigurt, zgjidhni deaktivizimin
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Kontaktoni Mbështetjen:</strong> Nëse keni probleme, na kontaktoni para fshirjes
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>Shkarkoni të Dhënat:</strong> Shkarkoni të dhënat tuaja para se të fshini llogarinë
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccountForm;
