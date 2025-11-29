import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { isPhoneNumber } from '@/hooks/auth/utils/phoneUtils';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
// import QuickLoginProfile from './QuickLoginProfile';


const LoginForm = () => {
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [showPlusAnimation, setShowPlusAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string>('');
  const navigate = useNavigate();
  const { signIn, userProfile, user, loading } = useAuth();
  
  // Add ref for cursor positioning
  const contactInputRef = useRef<HTMLInputElement>(null);

  // Listen for profile prefill events
  useEffect(() => {
    const handlePrefillLogin = (event: any) => {
      const { email, firstName } = event.detail;
      if (email) {
        setContact(email);
        console.log('📧 Email pre-filled for:', firstName);
      }
    };

    window.addEventListener('prefill-login', handlePrefillLogin);
    return () => window.removeEventListener('prefill-login', handlePrefillLogin);
  }, []);

  // Handle successful authentication - redirect with preserved path
  useEffect(() => {
    if (user && !loading && isLoading) {
      console.log('✅ Login successful, checking for preserved path');
      setIsLoading(false);
      
      // Check for preserved path from before login
      const redirectPath = sessionStorage.getItem('redirectAfterAuth');
      if (redirectPath && redirectPath !== '/auth/login' && redirectPath !== '/auth/register') {
        sessionStorage.removeItem('redirectAfterAuth');
        console.log('🔄 LoginForm: Redirecting to preserved path:', redirectPath);
        navigate(redirectPath, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, isLoading]);



  // Check if contact contains + to determine if it's a phone number
  useEffect(() => {
    const isPhone = contact.includes('+') || isPhoneNumber(contact);
    setIsPhoneLogin(isPhone);
    
    // Trigger animation when + is entered
    if (contact === '+') {
      setShowPlusAnimation(true);
      setTimeout(() => setShowPlusAnimation(false), 300);
    }
  }, [contact]);

  // Enhanced cursor positioning method
  const positionCursor = (input: HTMLInputElement, position: number) => {
    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      try {
        input.focus();
        if (input.setSelectionRange) {
          input.setSelectionRange(position, position);
        }
        // Fallback for mobile browsers
        if (input.selectionStart !== undefined) {
          input.selectionStart = position;
          input.selectionEnd = position;
        }
      } catch (error) {
        console.log('Cursor positioning not supported on this input type');
      }
    });
  };

  // Custom handler for contact input with enhanced cursor positioning
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const input = e.target;
    setAuthError('');
    
    console.log('Input change:', value, 'Current cursor:', input.selectionStart);
    
    // Handle + character specifically
    if (value === '+') {
      setContact('+');
      // Position cursor after the + with multiple fallback methods
      setTimeout(() => {
        if (contactInputRef.current) {
          positionCursor(contactInputRef.current, 1);
        }
      }, 0);
      return;
    }
    
    // If user is typing and we had a +, ensure it stays at the beginning
    if (value.length > 1 && contact === '+') {
      const newValue = '+' + value.slice(1).replace(/\+/g, '');
      setContact(newValue);
      setTimeout(() => {
        if (contactInputRef.current) {
          positionCursor(contactInputRef.current, newValue.length);
        }
      }, 0);
      return;
    }
    
    // Ensure + stays at the beginning if user is typing a phone number
    if (value.length > 0 && !value.startsWith('+') && (contact.startsWith('+') || isPhoneNumber(value))) {
      const newValue = '+' + value.replace(/\+/g, '');
      setContact(newValue);
      setTimeout(() => {
        if (contactInputRef.current) {
          positionCursor(contactInputRef.current, newValue.length);
        }
      }, 0);
      return;
    }
    
    setContact(value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Read values from state or from autofilled inputs
    const form = e.currentTarget;
    const formData = new FormData(form);
    const submittedContact = contact || String(formData.get('contact') || '').trim();
    const submittedPassword = password || String(formData.get('password') || '');

    console.log('🔐 BULLETPROOF LOGIN: Form submitted with:', { 
      contact: submittedContact, 
      hasPassword: !!submittedPassword 
    });

    if (!submittedContact || !submittedPassword) {
      setAuthError('Ju lutemi plotësoni emailin dhe fjalëkalimin');
      return;
    }

    setIsLoading(true);
    setAuthError('');
    
    try {
      console.log('🔐 BULLETPROOF LOGIN: Attempting authentication...');
      
      // Use email directly - ignore phone number logic for now
      await signIn(submittedContact, submittedPassword);
      
      console.log('✅ BULLETPROOF LOGIN: Login successful');
      toast.success('Mirë se erdhe në Shqipet!');
      
      // Reset form state
      setContact('');
      setPassword('');
      
    } catch (error: any) {
      console.error('❌ BULLETPROOF LOGIN: Login failed:', error);
      const errorMessage = error?.message || 'Email ose fjalëkalim i pasaktë';
      setAuthError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };



  return (
    <div className="w-full max-w-md mx-auto px-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-red-500 mb-2">
          Identifikohu
        </h1>
        <p className="text-gray-600">
          Hyni në llogarinë tuaj Shqipet!
        </p>
      </div>
      
        <form onSubmit={handleLogin} className="space-y-6" data-allow-submit="true">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email ose numri i telefonit
          </label>
          <div className="relative">
            <Input
              ref={contactInputRef}
              type={isPhoneLogin ? "tel" : "email"}
              name="contact"
              value={contact}
              onChange={handleContactChange}
              className={`w-full px-4 py-3 border ${authError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ${showPlusAnimation ? 'animate-pulse-plus' : ''}`}
              placeholder="Shkruani emailin ose numrin tuaj të telefonit+"
              disabled={isLoading}
              inputMode={isPhoneLogin ? "tel" : "email"}
              autoComplete={isPhoneLogin ? "tel" : "email"}
              aria-invalid={!!authError}
              aria-describedby={authError ? 'auth-error' : undefined}
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
          </div>
          {authError && (
            <div className="mt-2 flex items-center text-red-600 text-sm" id="auth-error" role="alert">
              <AlertCircle size={16} className="mr-2" aria-hidden="true" />
              <span>{authError}</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fjalëkalimi
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setAuthError(''); }}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Shkruani fjalëkalimin tuaj"
              disabled={isLoading}
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-red-400 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-medium transition-colors text-base"
          disabled={isLoading}
        >
          {isLoading ? 'Po përpunohet...' : 'Identifikohu'}
        </Button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link 
            to="/auth/forgot-password" 
            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            Harruat fjalëkalimin?
          </Link>
        </div>
        
        <div className="text-center">
          <span className="text-gray-600">Nuk keni një llogari? </span>
          <Link to="/auth/register" className="text-red-500 hover:text-red-600 font-medium">
            Regjistrohuni
          </Link>
        </div>
      </form>
      
      <style>{`
        @keyframes pulse-plus {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
        
        .animate-pulse-plus {
          animation: pulse-plus 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
