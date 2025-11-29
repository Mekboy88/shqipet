
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Info, History, CreditCard, DollarSign, TrendingUp } from 'lucide-react';

interface MyEarningsFormProps {
  userInfo: {
    email: string;
    paymentHistory: any[];
  };
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
}

const lightFocusStyles = "bg-white border-gray-300 focus:border-red-300 focus:ring-2 focus:ring-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/10 focus-visible:ring-offset-0";

const MyEarningsForm: React.FC<MyEarningsFormProps> = ({ userInfo }) => {
  const [withdrawMethod, setWithdrawMethod] = useState('paypal');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/20 rounded-2xl p-6 shadow-lg border border-primary/20">
        <h2 className="text-3xl font-bold text-primary mb-4">Të Ardhurat e Mia</h2>
        <p className="text-gray-700 text-lg">
          Menaxhoni të ardhurat tuaja dhe kërkoni tërheqje nga fondet e disponueshme
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Status Notices Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Statusi i Të Ardhurave
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-200/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Fondet e Disponueshme</p>
                    <p className="text-red-700 text-sm mt-1">
                      Fondet e disponueshme për tërheqje: $0, minimumi për tërheqje është $50
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200/50">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-orange-800 font-medium">Informacion i Rëndësishëm</p>
                    <p className="text-orange-700 text-sm mt-1">
                      Mund të tërhiqni vetëm të ardhurat tuaja, plotësimet e portofolit nuk janë të tërheqshme.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-blue-800 font-medium">Verifikoni Detajet</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Ju lutemi kontrolloni të gjitha detajet para se të kërkoni tërheqje.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Withdraw Method Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Metoda e Tërheqjes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="withdraw-method" className="text-sm font-medium text-gray-700 mb-2 block">
                  Zgjidhni Metodën e Tërheqjes
                </Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger id="withdraw-method" className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg">
                    <SelectValue placeholder="Zgjidhni metodën e tërheqjes" />
                  </SelectTrigger>
                  <SelectContent className="bg-white shadow-lg border border-gray-200 z-50">
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="skrill">Skrill</SelectItem>
                    <SelectItem value="bank">Transfer Bankar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {withdrawMethod === 'paypal' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paypal-email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email PayPal
                      </Label>
                      <Input 
                        id="paypal-email" 
                        type="email" 
                        value={userInfo.email} 
                        readOnly 
                        className="w-full bg-gray-50 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2 block">
                        Shuma
                      </Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        defaultValue="0" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {withdrawMethod === 'skrill' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skrill-email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email Skrill
                      </Label>
                      <Input 
                        id="skrill-email" 
                        type="email" 
                        placeholder="your@skrill.com" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-sm font-medium text-gray-700 mb-2 block">
                        Shuma
                      </Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        defaultValue="0" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              )}

              {withdrawMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount-bank" className="text-sm font-medium text-gray-700 mb-2 block">
                        Shuma
                      </Label>
                      <Input 
                        id="amount-bank" 
                        type="number" 
                        defaultValue="0" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="iban" className="text-sm font-medium text-gray-700 mb-2 block">
                        IBAN
                      </Label>
                      <Input 
                        id="iban" 
                        type="text" 
                        placeholder="IBAN" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country" className="text-sm font-medium text-gray-700 mb-2 block">
                        Shteti
                      </Label>
                      <Input 
                        id="country" 
                        type="text" 
                        placeholder="Shteti" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="full-name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Emri i Plotë
                      </Label>
                      <Input 
                        id="full-name" 
                        type="text" 
                        placeholder="Emri i plotë" 
                        className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="swift-code" className="text-sm font-medium text-gray-700 mb-2 block">
                      Kodi SWIFT
                    </Label>
                    <Input 
                      id="swift-code" 
                      type="text" 
                      placeholder="Kodi SWIFT" 
                      className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700 mb-2 block">
                      Adresa
                    </Label>
                    <Input 
                      id="address" 
                      type="text" 
                      placeholder="Adresa e plotë" 
                      className="w-full transition-all duration-200 hover:shadow-md focus:shadow-lg"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4">
                <Button className="w-full py-3 bg-primary hover:bg-primary/90 text-white border-0 font-medium transition-all duration-200 hover:shadow-lg">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Kërko Tërheqje
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Payment History Card */}
          <Card className="bg-white rounded-2xl shadow-lg border border-gray-200/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-3 flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Historiku i Pagesave
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-[50px] font-semibold text-gray-700">#</TableHead>
                      <TableHead className="font-semibold text-gray-700">Shuma</TableHead>
                      <TableHead className="font-semibold text-gray-700">Kërkuar</TableHead>
                      <TableHead className="font-semibold text-gray-700">Statusi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(!userInfo.paymentHistory || userInfo.paymentHistory.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-12">
                          <div className="flex flex-col items-center">
                            <History className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="font-medium">Nuk ka pagesa ende</p>
                            <p className="text-sm text-gray-400 mt-1">Historiku i pagesave do të shfaqet këtu</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      userInfo.paymentHistory.map((payment, index) => (
                        <TableRow key={index} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell className="font-medium text-green-600">{payment.amount}</TableCell>
                          <TableCell className="text-gray-600">{payment.requested}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyEarningsForm;
