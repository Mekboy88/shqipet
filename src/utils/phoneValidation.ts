
export interface PhoneValidationResult {
  isValid: boolean;
  normalizedNumber: string;
  country?: string;
  carrier?: string;
  error?: string;
  suggestions?: string[];
}

export const validatePhoneNumber = (phoneNumber: string): PhoneValidationResult => {
  try {
    if (!phoneNumber || phoneNumber.trim() === '') {
      return {
        isValid: false,
        normalizedNumber: '',
        error: 'Phone number is required',
        suggestions: ['Please enter a valid phone number']
      };
    }

    // Remove all spaces, dashes, parentheses
    let cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
    
    // Remove all non-digit characters except +
    cleaned = cleaned.replace(/[^\d+]/g, '');
    
    const suggestions: string[] = [];
    
    // If it doesn't start with +, try to determine country
    if (!cleaned.startsWith('+')) {
      // UK numbers starting with 0
      if (cleaned.startsWith('0')) {
        cleaned = '+44' + cleaned.substring(1);
        suggestions.push('Converted to UK format: ' + cleaned);
      }
      // Already has country code
      else if (cleaned.startsWith('44')) {
        cleaned = '+' + cleaned;
        suggestions.push('Added + prefix: ' + cleaned);
      }
      // US/Canada numbers (10 digits)
      else if (cleaned.length === 10) {
        cleaned = '+1' + cleaned;
        suggestions.push('Assumed US/Canada format: ' + cleaned);
      }
      // Albanian numbers
      else if (cleaned.startsWith('355')) {
        cleaned = '+' + cleaned;
        suggestions.push('Albanian format: ' + cleaned);
      }
      else if (cleaned.length === 9 && /^6[6-9]/.test(cleaned)) {
        // Albanian mobile numbers start with 66-69
        cleaned = '+355' + cleaned;
        suggestions.push('Assumed Albanian mobile: ' + cleaned);
      }
      // Default to UK if 11 digits starting with 7
      else if (cleaned.length === 11 && cleaned.startsWith('7')) {
        cleaned = '+44' + cleaned;
        suggestions.push('Assumed UK mobile: ' + cleaned);
      }
      else {
        return {
          isValid: false,
          normalizedNumber: cleaned,
          error: 'Unable to determine country code',
          suggestions: [
            'Try: +44 for UK numbers',
            'Try: +355 for Albanian numbers',
            'Try: +1 for US/Canada numbers',
            'Use international format: +[country code][number]'
          ]
        };
      }
    }
    
    // Basic validation - must be between 10-15 digits after +
    const digitsOnly = cleaned.substring(1);
    if (digitsOnly.length < 8) {
      return {
        isValid: false,
        normalizedNumber: cleaned,
        error: 'Phone number too short (minimum 8 digits after country code)',
        suggestions: ['Ensure you include the full phone number']
      };
    }
    
    if (digitsOnly.length > 15) {
      return {
        isValid: false,
        normalizedNumber: cleaned,
        error: 'Phone number too long (maximum 15 digits after country code)',
        suggestions: ['Remove any extra digits']
      };
    }
    
    // Determine country and add specific validations
    let country = 'Unknown';
    let carrier = '';
    
    if (cleaned.startsWith('+44')) {
      country = 'United Kingdom';
      // UK mobile numbers start with +44 7
      if (cleaned.startsWith('+447')) {
        carrier = 'Mobile';
      } else if (cleaned.startsWith('+442')) {
        carrier = 'London Landline';
      } else {
        carrier = 'Landline/Other';
      }
    } else if (cleaned.startsWith('+355')) {
      country = 'Albania';
      // Albanian mobile numbers: +355 6X
      if (cleaned.startsWith('+3556')) {
        carrier = 'Mobile';
      } else {
        carrier = 'Landline/Other';
      }
    } else if (cleaned.startsWith('+1')) {
      country = 'US/Canada';
      carrier = 'Mobile/Landline';
    }
    
    return {
      isValid: true,
      normalizedNumber: cleaned,
      country: country,
      carrier: carrier,
      suggestions: suggestions.length > 0 ? suggestions : undefined
    };
  } catch (error) {
    return {
      isValid: false,
      normalizedNumber: phoneNumber,
      error: 'Invalid phone number format',
      suggestions: ['Please check your phone number and try again']
    };
  }
};

export const formatPhoneForDisplay = (phoneNumber: string): string => {
  const validation = validatePhoneNumber(phoneNumber);
  if (!validation.isValid) {
    return phoneNumber;
  }
  
  const normalized = validation.normalizedNumber;
  
  // Format based on country
  if (normalized.startsWith('+44')) {
    // UK format: +44 7XXX XXX XXX
    const digits = normalized.substring(3);
    if (digits.length === 10) {
      return `+44 ${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
    }
  } else if (normalized.startsWith('+355')) {
    // Albanian format: +355 6X XXX XXX
    const digits = normalized.substring(4);
    if (digits.length === 8) {
      return `+355 ${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
    }
  } else if (normalized.startsWith('+1')) {
    // US/Canada format: +1 XXX XXX XXXX
    const digits = normalized.substring(2);
    if (digits.length === 10) {
      return `+1 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
    }
  }
  
  return normalized;
};
