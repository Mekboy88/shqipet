/**
 * Convert country code (ISO 3166-1 alpha-2) to flag emoji
 * @param countryCode - Two-letter country code (e.g., "US", "GB", "AL")
 * @returns Flag emoji or empty string if invalid
 */
export const getCountryFlag = (countryCode: string | null | undefined): string => {
  if (!countryCode || countryCode.length !== 2) {
    return '';
  }

  // Convert country code to regional indicator symbols
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
};

/**
 * Format location with flag
 * @param city - City name
 * @param country - Country name
 * @param countryCode - Two-letter country code
 * @returns Formatted location string with flag
 */
export const formatLocationWithFlag = (
  city: string | null | undefined,
  country: string | null | undefined,
  countryCode: string | null | undefined
): string => {
  const flag = getCountryFlag(countryCode);
  
  if (city && country) {
    return `${city}, ${country} ${flag}`.trim();
  }
  
  if (country) {
    return `${country} ${flag}`.trim();
  }
  
  return 'Unknown location';
};
