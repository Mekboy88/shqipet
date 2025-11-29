// Dynamic domain config - detects actual domain
export const PRIMARY_DOMAINS = ['shqipet.com', 'www.shqipet.com'];
export const MOBILE_SUBDOMAIN = 'm.shqipet.com';

export const getDomainConfig = () => {
  const hostname = window?.location?.hostname || 'localhost';
  const origin = window?.location?.origin || 'http://localhost:3000';
  
  const isCustomDomain = hostname === 'shqipet.com' || hostname === 'www.shqipet.com';
  const isPrimary = hostname === 'shqipet.com';
  
  return {
    domain: hostname,
    isCustomDomain,
    baseUrl: origin,
    supabaseUrl: ''
  };
};

export const isPrimaryDomain = (hostname?: string) => {
  const host = hostname || window?.location?.hostname || 'localhost';
  return PRIMARY_DOMAINS.includes(host);
};

export const isMobileSubdomain = (hostname?: string) => {
  const host = hostname || window?.location?.hostname || 'localhost';
  return host === MOBILE_SUBDOMAIN;
};

export const buildUrlFor = (targetHost: string) => {
  const { pathname, search, hash } = window.location;
  return `https://${targetHost}${pathname}${search}${hash}`;
};

export const isAdminPath = (pathname: string) => {
  return pathname.startsWith('/admin');
};

export const shouldRedirectToPrimary = () => {
  const hostname = window?.location?.hostname;
  const { pathname, search, hash } = window.location;
  
  // Redirect www.shqipet.com to shqipet.com (301 permanent)
  if (hostname === 'www.shqipet.com') {
    return `https://shqipet.com${pathname}${search}${hash}`;
  }
  
  // Do not redirect mobile subdomain; handled in app (single-domain mode)
  // if (hostname === 'm.shqipet.com') {
  //   const params = new URLSearchParams(search);
  //   params.set('forceMobile', '1');
  //   params.set('clearPrefersDesktop', '1');
  //   return `https://shqipet.com${pathname}?${params.toString()}${hash}`;
  // }
  
  return null;
};

export const isDomainAccessible = async () => true;

export const isOnCustomDomain = () => {
  const hostname = window?.location?.hostname || 'localhost';
  return hostname === 'shqipet.com' || hostname === 'www.shqipet.com';
};

export const isOnPrimaryDomain = () => {
  const hostname = window?.location?.hostname || 'localhost';
  return hostname === 'shqipet.com';
};