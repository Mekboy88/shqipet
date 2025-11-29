// Albanian number formatter with abbreviations to avoid confusion
// Uses "mij" for thousand and "mil" for million to distinguish them

export const formatNumberAlbanian = (num: number): string => {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    if (remainder === 0) {
      return `${thousands}mij`;
    }
    return `${thousands}.${Math.floor(remainder / 100)}mij`;
  }
  
  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    if (remainder === 0) {
      return `${millions}mil`;
    }
    return `${millions}.${Math.floor(remainder / 100000)}mil`;
  }
  
  if (num < 1000000000000) {
    const billions = Math.floor(num / 1000000000);
    const remainder = num % 1000000000;
    if (remainder === 0) {
      return `${billions}mld`;
    }
    return `${billions}.${Math.floor(remainder / 100000000)}mld`;
  }
  
  // Trillion
  const trillions = Math.floor(num / 1000000000000);
  const remainder = num % 1000000000000;
  if (remainder === 0) {
    return `${trillions}trl`;
  }
  return `${trillions}.${Math.floor(remainder / 100000000000)}trl`;
};