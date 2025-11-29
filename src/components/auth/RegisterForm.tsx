import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRegisterForm } from '@/components/auth/register/useRegisterForm';
import PhoneFormatExplanation from '@/components/auth/register/PhoneFormatExplanation';
import DateOfBirthSection from '@/components/auth/register/DateOfBirthSection';
import PhoneRegistrationFlow from '@/components/auth/register/PhoneRegistrationFlow';
import EmailRegistrationFlow from '@/components/auth/register/EmailRegistrationFlow';
import { Phone } from 'lucide-react';

const RegisterForm = () => {
  const {
    formData,
    isSubmitting,
    showExplanationDialog,
    setShowExplanationDialog,
    showPhoneFlow,
    showEmailFlow,
    isPhoneInput,
    isCheckingDuplicate,
    contactError,
    isContactValid,
    isButtonDisabled,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleShowExplanationDialog,
    handleBackFromPhoneFlow,
    handleBackFromEmailFlow,
    handleNavigateToLogin,
    normalizedPhoneNumber
  } = useRegisterForm();

  // Local control to hide the contact error temporarily
  const [hideContactError, setHideContactError] = React.useState(false);
  React.useEffect(() => {
    if (contactError) setHideContactError(false);
  }, [contactError]);

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('/terms-of-use', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open('/privacy-policy', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  };

  // If phone flow is active, show the phone registration component
  if (showPhoneFlow) {
    return (
      <div className="w-full max-w-sm">
        <PhoneRegistrationFlow
          phoneNumber={normalizedPhoneNumber}
          firstName={formData.firstName}
          lastName={formData.lastName}
          birthDay={formData.birthDay}
          birthMonth={formData.birthMonth}
          birthYear={formData.birthYear}
          gender={formData.gender}
          onBack={handleBackFromPhoneFlow}
        />
      </div>
    );
  }

  // If email OTP flow is active, show the email verification component
  if (showEmailFlow) {
    return (
      <div className="w-full max-w-sm">
        <EmailRegistrationFlow
          email={formData.email}
          firstName={formData.firstName}
          lastName={formData.lastName}
          onBack={handleBackFromEmailFlow}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Regjistrohuni</h1>
        <p className="text-gray-600 text-sm">Krijoni llogarinë tuaj Shqipet!</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4" data-allow-submit="true">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Emri</label>
          <Input 
            type="text" 
            name="firstName" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            value={formData.firstName} 
            onChange={handleChange}
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mbiemri</label>
          <Input 
            type="text" 
            name="lastName" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            value={formData.lastName} 
            onChange={handleChange}
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Adresa e emailit ose numri i telefonit</label>
          <div className="relative">
            <Input 
              type="text" 
              name="email" 
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                contactError ? 'border-red-500' : 'border-gray-300'
              } ${isContactValid ? 'pr-12' : ''}`}
              value={formData.email} 
              onChange={handleChange}
              placeholder="email@example.com ose +355-XX-XXX-XXXX"
              required 
            />
            {isContactValid && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 border-2 border-green-300 rounded-full flex items-center justify-center bg-transparent">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          {isCheckingDuplicate && (
            <div className="mt-1 text-xs text-blue-600">
              Duke kontrolluar...
            </div>
          )}
          
          {contactError && !hideContactError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">Ky email është në përdorim tashmë. Nëse kjo është llogaria juaj, shkoni tek "Identifikohuni".</p>
                <p className="text-sm text-red-700 mt-1">Llogaria: Andi Mekrizvani</p>
                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleNavigateToLogin}
                    className="text-sm text-red-600 hover:text-red-800 underline font-medium"
                  >
                    Klikoni këtu për t'u identifikuar
                  </button>
                  <button type="button" onClick={() => setHideContactError(true)} className="text-sm text-red-600 hover:text-red-800 underline">Mbyll</button>
                </div>
              </div>
            </div>
          )}
          
          {/* Only show phone format explanation button if there's no contact error */}
          {!contactError && (
            <button
              type="button"
              onClick={handleShowExplanationDialog}
              className="text-xs text-black hover:underline mt-1 flex items-center gap-1"
            >
              Shpjegim për formatin e telefonit
              <Phone size={12} />
            </button>
          )}
          
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Fjalëkalimi</label>
          <Input 
            type="password" 
            name="password" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            value={formData.password} 
            onChange={handleChange}
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Konfirmoni Fjalëkalimin</label>
          <Input 
            type="password" 
            name="confirmPassword" 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
            value={formData.confirmPassword || ''} 
            onChange={handleChange}
            required 
          />
        </div>
        
        <DateOfBirthSection
          birthDay={formData.birthDay}
          birthMonth={formData.birthMonth}
          birthYear={formData.birthYear}
          onSelectChange={handleSelectChange}
        />
        
        <div>
          <label className="block text-sm text-gray-600 mb-1">Gjinia</label>
          <Select onValueChange={value => handleSelectChange('gender', value)} value={formData.gender}>
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <SelectValue placeholder="Zgjidhni gjininë tuaj" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Mashkull</SelectItem>
              <SelectItem value="female">Femër</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            className="mt-1" 
            checked={formData.termsAccepted}
            onCheckedChange={(checked) => handleChange({
              target: { name: 'termsAccepted', type: 'checkbox', checked: !!checked }
            } as any)}
          />
          <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
            Duke krijuar llogarinë tuaj, ju pranoni{' '}
            <button
              type="button"
              onClick={handleTermsClick}
              className="text-red-500 hover:underline font-medium"
            >
              Kushtet e Përdorimit
            </button>{' '}
            &{' '}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="text-red-500 hover:underline font-medium"
            >
              Politikën e Privatësisë
            </button>
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base mt-6 disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={isButtonDisabled}
        >
          {isSubmitting ? "Duke krijuar llogarinë..." : 
           isCheckingDuplicate ? "Duke kontrolluar..." :
           isPhoneInput ? "Vazhdo me telefon" : "Shkojmë!"}
        </Button>
        
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">Keni tashmë një llogari? </span>
          <button
            type="button"
            onClick={handleNavigateToLogin}
            className="text-red-500 hover:text-red-600 font-medium text-sm underline"
          >
            Identifikohuni
          </button>
        </div>
      </form>

      <PhoneFormatExplanation 
        open={showExplanationDialog} 
        onOpenChange={setShowExplanationDialog} 
      />
    </div>
  );
};

export default RegisterForm;
