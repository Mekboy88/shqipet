
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegistrationService } from '@/services/registrationService';
import { EmailVerificationService } from '@/services/emailVerificationService';
import { DuplicateDetectionService } from '@/services/duplicateDetectionService';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  gender: 'male' | 'female' | '';
  termsAccepted: boolean;
}

const FORM_STORAGE_KEY = 'registrationFormData';

// Helper function to detect if input is phone number
const isPhoneNumber = (input: string): boolean => {
  const digitsOnly = input.replace(/\D/g, '');
  return digitsOnly.length >= 10 && (
    digitsOnly.startsWith('355') || // Albania
    digitsOnly.startsWith('1') ||   // US/Canada
    digitsOnly.startsWith('44') ||  // UK
    input.startsWith('+') ||        // International format
    digitsOnly.length >= 10         // Generic phone number length
  );
};

// Helper function to normalize phone number
const normalizePhoneNumber = (phone: string): string => {
  let normalized = phone.replace(/[^\d+]/g, '');
  
  if (!normalized.startsWith('+')) {
    if (normalized.startsWith('355')) {
      normalized = '+' + normalized;
    } else {
      normalized = '+355' + normalized;
    }
  }
  
  return normalized;
};

// Helper function to create a valid birth date and calculate age
const createValidBirthDate = (day: string, month: string, year: string): { date: string | null; age: number | null } => {
  if (!day || !month || !year || day === '' || month === '' || year === '') {
    return { date: null, age: null };
  }
  
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > new Date().getFullYear()) {
    return { date: null, age: null };
  }
  
  const formattedDate = `${yearNum}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
  
  const testDate = new Date(formattedDate);
  if (isNaN(testDate.getTime())) {
    return { date: null, age: null };
  }
  
  const today = new Date();
  const birthDate = new Date(testDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return { date: formattedDate, age };
};

// Helper function to generate username from initials
const generateUsername = (firstName: string, lastName: string): string => {
  const firstInitial = firstName.trim().charAt(0).toUpperCase();
  const lastInitial = lastName.trim().charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

// Helper functions for form persistence
const saveFormData = (formData: FormData): void => {
  try {
    // Don't save sensitive password data
    const dataToSave = {
      ...formData,
      password: '',
      confirmPassword: ''
    };
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    console.log('📝 Form data saved to localStorage');
  } catch (error) {
    console.error('Failed to save form data:', error);
  }
};

const loadFormData = (): Partial<FormData> => {
  try {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      console.log('📂 Form data loaded from localStorage');
      return parsedData;
    }
  } catch (error) {
    console.error('Failed to load form data:', error);
  }
  return {};
};

const clearFormData = (): void => {
  try {
    localStorage.removeItem(FORM_STORAGE_KEY);
    console.log('🗑️ Form data cleared from localStorage');
  } catch (error) {
    console.error('Failed to clear form data:', error);
  }
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanationDialog, setShowExplanationDialog] = useState(false);
  const [showPhoneFlow, setShowPhoneFlow] = useState(false);
  const [showEmailFlow, setShowEmailFlow] = useState(false);
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);
  const [contactError, setContactError] = useState('');
  const [isContactValid, setIsContactValid] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    gender: '',
    termsAccepted: false,
  });

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = loadFormData();
    if (Object.keys(savedData).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...savedData
      }));
      console.log('✅ Restored form data from previous session');
      
      // Check if loaded email is phone number
      if (savedData.email) {
        const isPhone = isPhoneNumber(savedData.email);
        setIsPhoneInput(isPhone);
      }
    }
  }, []);

  // Clear form data when component unmounts or when navigating away
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearFormData();
    };

    const handlePopState = () => {
      clearFormData();
    };

    // Clear form data when navigating away from registration
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup function to clear form data when component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      clearFormData();
    };
  }, []);

  // Save form data whenever it changes (with debounce) - only if user is actively filling the form
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if form has meaningful data and user is actively filling it
      if (formData.firstName.trim() || formData.lastName.trim() || formData.email.trim()) {
        saveFormData(formData);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Check if all required fields are filled
  const areAllFieldsFilled = (): boolean => {
    const { firstName, lastName, email, birthDay, birthMonth, birthYear, gender, termsAccepted } = formData;
    
    // Basic required fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !birthDay || !birthMonth || !birthYear || !gender || !termsAccepted) {
      return false;
    }
    
    // If email registration, password fields are required
    if (!isPhoneInput && (!formData.password || !formData.confirmPassword)) {
      return false;
    }
    
    return true;
  };

  // Check for duplicates when email/phone changes
  useEffect(() => {
    const checkDuplicate = async () => {
      if (!formData.email.trim() || formData.email.length < 5) {
        setContactError('');
        setIsContactValid(false);
        return;
      }

      setIsCheckingDuplicate(true);
      setContactError('');

      try {
        const isPhone = isPhoneNumber(formData.email);
        const result = await DuplicateDetectionService.checkDuplicate(formData.email, isPhone);

        if (result.exists) {
          const contactType = isPhone ? 'numër telefoni' : 'email';
          setContactError(`Ky ${contactType} është në përdorim tashmë. Nëse kjo është llogaria juaj, shkoni tek "Identifikohuni".`);
          setIsContactValid(false);
        } else {
          setContactError('');
          setIsContactValid(true);
        }
      } catch (error) {
        console.error('Error checking duplicate:', error);
        setContactError('');
        setIsContactValid(false);
      } finally {
        setIsCheckingDuplicate(false);
      }
    };

    const timeoutId = setTimeout(checkDuplicate, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Check if email field is phone number to update UI
    if (name === 'email') {
      const isPhone = isPhoneNumber(value);
      setIsPhoneInput(isPhone);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateBasicForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check required fields
    if (!formData.firstName.trim()) {
      errors.push('Emri është i detyrueshëm');
    }
    if (!formData.lastName.trim()) {
      errors.push('Mbiemri është i detyrueshëm');
    }
    if (!formData.email.trim()) {
      errors.push('Email ose numri i telefonit është i detyrueshëm');
    }

    // Validate birth date and age
    const { date: validBirthDate, age } = createValidBirthDate(formData.birthDay, formData.birthMonth, formData.birthYear);
    if (!validBirthDate) {
      errors.push('Ju lutemi zgjidhni një datë lindjeje të vlefshme');
    } else if (age === null || age < 16) {
      errors.push('Duhet të jeni të paktën 16 vjeç për t\'u regjistruar');
    }

    // Validate gender selection
    if (!formData.gender) {
      errors.push('Ju lutemi zgjidhni gjininë');
    }

    // Validate terms acceptance
    if (!formData.termsAccepted) {
      errors.push('Duhet të pranoni Kushtet e Përdorimit dhe Politikën e Privatësisë për të vazhduar');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateEmailForm = (): { isValid: boolean; errors: string[] } => {
    const basicValidation = validateBasicForm();
    
    if (!basicValidation.isValid) {
      return basicValidation;
    }

    const errors: string[] = [];

    // Additional validation for email registration
    if (!formData.password) {
      errors.push('Fjalëkalimi është i detyrueshëm');
    }
    if (formData.password.length < 12) {
      errors.push('Fjalëkalimi duhet të ketë të paktën 12 karaktere');
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Fjalëkalimet nuk përputhen');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if still checking or if contact is invalid
    if (isCheckingDuplicate || !isContactValid || contactError) {
      return;
    }
    
    const isPhone = isPhoneNumber(formData.email);
    
    if (isPhone) {
      // For phone, only validate basic form (no password required)
      const { isValid, errors } = validateBasicForm();
      if (!isValid) {
        errors.forEach(error => toast.error(error));
        return;
      }
      
      // Show phone registration flow
      setShowPhoneFlow(true);
      return;
    } else {
      // For email, validate including password
      const { isValid, errors } = validateEmailForm();
      if (!isValid) {
        errors.forEach(error => toast.error(error));
        return;
      }

      // Handle email registration
      setIsSubmitting(true);
      try {
        console.log('🔐 Starting email registration process...');

        const { date: validBirthDate } = createValidBirthDate(formData.birthDay, formData.birthMonth, formData.birthYear);
        const generatedUsername = generateUsername(formData.firstName, formData.lastName);
        
        const result = await RegistrationService.initiateEmailPasswordRegistration({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          additionalData: {
            birth_date: validBirthDate,
            gender: formData.gender,
            username: generatedUsername,
            registration_method: 'email'
          }
        });

        if (result.success && result.requiresVerification) {
          localStorage.setItem('verificationEmail', formData.email);
          localStorage.setItem('verificationType', 'email');
          toast.success('Kodi i verifikimit u dërgua në emailin tuaj!');
          setShowEmailFlow(true);
        } else if (result.success && result.session) {
          // Clear form data on successful registration
          clearFormData();
          toast.success('Registration successful! Welcome!');
          navigate('/');
        } else {
          toast.error(result.error || 'Email registration failed');
        }

        localStorage.setItem('isNewUser', 'true');
        
      } catch (error: any) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Failed to register');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleShowExplanationDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowExplanationDialog(true);
  };

  const handleBackFromPhoneFlow = () => {
    setShowPhoneFlow(false);
  };

  const handleBackFromEmailFlow = () => {
    setShowEmailFlow(false);
    // Clear any stored email verification data
    localStorage.removeItem('tempEmailUserData');
    localStorage.removeItem('verificationEmail');
    localStorage.removeItem('verificationType');
  };

  // Clear form data when user successfully completes registration
  const handleRegistrationSuccess = () => {
    clearFormData();
  };

  // Function to clear form data when navigating to login
  const handleNavigateToLogin = () => {
    clearFormData();
    navigate('/');
  };

  // Button should be disabled if:
  // 1. Currently checking for duplicates
  // 2. Contact is invalid (exists or error)
  // 3. Not all fields are filled
  // 4. Currently submitting
  const isButtonDisabled = isCheckingDuplicate || !isContactValid || contactError !== '' || !areAllFieldsFilled() || isSubmitting;

  return {
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
    handleRegistrationSuccess,
    handleNavigateToLogin,
    normalizedPhoneNumber: isPhoneNumber(formData.email) ? normalizePhoneNumber(formData.email) : ''
  };
};
