
// Helper function to detect if contact is phone number
export const isPhoneNumber = (contact: string): boolean => {
  const digitsOnly = contact.replace(/\D/g, '');
  return digitsOnly.length >= 10 && (
    contact.startsWith('+') ||
    digitsOnly.startsWith('355') ||
    digitsOnly.startsWith('1') ||
    digitsOnly.startsWith('44') ||
    digitsOnly.startsWith('447')
  );
};

// Helper function to normalize phone number with multiple variations
export const normalizePhoneNumber = (phone: string): string => {
  console.log('📱 Normalizing phone number:', phone);
  
  let normalized = phone.replace(/[^\d+]/g, '');
  console.log('📱 After cleaning:', normalized);
  
  if (!normalized.startsWith('+')) {
    if (normalized.startsWith('355')) {
      normalized = '+' + normalized;
    } else if (normalized.startsWith('447')) {
      normalized = '+' + normalized;
    } else if (normalized.startsWith('44')) {
      normalized = '+' + normalized;
    } else {
      // Default to keeping as-is for other formats
      console.log('📱 No country code detected, keeping as-is');
    }
  }
  
  console.log('📱 Final normalized phone:', normalized);
  return normalized;
};

// CRITICAL: Get ALL possible phone number variations for database lookup
export const getPhoneVariations = (phone: string): string[] => {
  console.log('📱 EXTREME DEBUG: Getting phone variations for:', phone);
  
  // Start with the original input
  const cleaned = phone.replace(/[^\d+]/g, '');
  console.log('📱 Cleaned input:', cleaned);
  
  const variations = new Set<string>();
  
  // Add the cleaned version
  variations.add(cleaned);
  
  // Handle different formats based on the input
  if (cleaned.startsWith('+447')) {
    // UK mobile with +447
    const withoutPlus = cleaned.substring(1); // 447561622227
    const withoutPlusAnd44 = cleaned.substring(3); // 7561622227
    const withZero = '0' + withoutPlusAnd44; // 07561622227
    
    variations.add(withoutPlus);
    variations.add(withoutPlusAnd44);
    variations.add(withZero);
    variations.add('+44' + withoutPlusAnd44);
  } else if (cleaned.startsWith('447')) {
    // UK mobile without + (447...)
    const withPlus = '+' + cleaned; // +447561622227
    const withoutCountryCode = cleaned.substring(2); // 7561622227
    const withZero = '0' + withoutCountryCode; // 07561622227
    
    variations.add(withPlus);
    variations.add(withoutCountryCode);
    variations.add(withZero);
    variations.add('+44' + withoutCountryCode);
  } else if (cleaned.startsWith('+44')) {
    // UK landline or other +44 format
    const withoutPlus = cleaned.substring(1); // 44...
    const withoutPlusAnd44 = cleaned.substring(3); // remaining digits
    
    variations.add(withoutPlus);
    if (withoutPlusAnd44.length > 0) {
      variations.add(withoutPlusAnd44);
      if (withoutPlusAnd44.startsWith('7')) {
        // It's a mobile number, add 0 prefix version
        variations.add('0' + withoutPlusAnd44);
      }
    }
  } else if (cleaned.startsWith('44')) {
    // UK without + (44...)
    const withPlus = '+' + cleaned;
    const withoutCountryCode = cleaned.substring(2);
    
    variations.add(withPlus);
    if (withoutCountryCode.length > 0) {
      variations.add(withoutCountryCode);
      if (withoutCountryCode.startsWith('7')) {
        // It's a mobile number, add 0 prefix version
        variations.add('0' + withoutCountryCode);
      }
    }
  } else if (cleaned.startsWith('0')) {
    // UK format starting with 0 (07561622227)
    const withoutZero = cleaned.substring(1); // 7561622227
    const with44 = '44' + withoutZero; // 447561622227
    const withPlus44 = '+44' + withoutZero; // +447561622227
    
    variations.add(withoutZero);
    variations.add(with44);
    variations.add(withPlus44);
  } else if (cleaned.startsWith('7') && cleaned.length === 10) {
    // UK mobile without country code (7561622227)
    const withZero = '0' + cleaned; // 07561622227
    const with44 = '44' + cleaned; // 447561622227
    const withPlus44 = '+44' + cleaned; // +447561622227
    
    variations.add(withZero);
    variations.add(with44);
    variations.add(withPlus44);
  }
  
  // For Albanian numbers
  if (cleaned.startsWith('+355') || cleaned.startsWith('355')) {
    const withPlus = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
    const withoutPlus = cleaned.startsWith('+') ? cleaned.substring(1) : cleaned;
    variations.add(withPlus);
    variations.add(withoutPlus);
  }
  
  // Convert Set to Array and remove any empty strings
  const uniqueVariations = Array.from(variations).filter(v => v.length > 0);
  
  // Sort by priority - put the most likely format first
  uniqueVariations.sort((a, b) => {
    // Prioritize formats that start with + (international format)
    if (a.startsWith('+') && !b.startsWith('+')) return -1;
    if (!a.startsWith('+') && b.startsWith('+')) return 1;
    
    // Then prioritize longer formats (more complete)
    return b.length - a.length;
  });
  
  console.log('📱 EXTREME DEBUG: All phone variations generated (sorted by priority):', uniqueVariations);
  console.log('📱 Total variations count:', uniqueVariations.length);
  
  return uniqueVariations;
};
