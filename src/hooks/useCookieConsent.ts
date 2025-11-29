
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useCookieConsent = () => {
  const { user, session } = useAuth();
  const [consent, setConsent] = useState(false);
  const [isConsentLoading, setIsConsentLoading] = useState(true);
  const [shouldShowBanner, setShouldShowBanner] = useState(false);

  useEffect(() => {
    const checkConsentStatus = () => {
      setIsConsentLoading(true);
      // Check if user has already consented
      const hasConsented = localStorage.getItem('cookieConsent') === 'true';
      setConsent(hasConsented);
      
      // Check if user is marked as new
      const isNewUser = localStorage.getItem('isNewUser') === 'true';
      
      // Check last login time for 3-day rule
      const lastLoginStr = localStorage.getItem('lastLoginTime');
      let hasBeenInactiveFor3Days = false;
      
      if (lastLoginStr && user) {
        const lastLogin = new Date(lastLoginStr);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        hasBeenInactiveFor3Days = lastLogin < threeDaysAgo;
      }

      // Show banner if user hasn't consented AND (is new user OR has been inactive for 3+ days)
      setShouldShowBanner(!hasConsented && (isNewUser || hasBeenInactiveFor3Days));
      setIsConsentLoading(false);
    };

    checkConsentStatus();
  }, [user]);

  // Update last login time when user logs in
  useEffect(() => {
    if (session && user) {
      localStorage.setItem('lastLoginTime', new Date().toISOString());
    }
  }, [session, user]);

  const giveConsent = () => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.removeItem('isNewUser'); // Clear new user flag after consent
    setConsent(true);
    setShouldShowBanner(false);
  };

  const markAsNewUser = () => {
    localStorage.setItem('isNewUser', 'true');
  };

  return {
    consent,
    isConsentLoading,
    shouldShowBanner,
    giveConsent,
    markAsNewUser
  };
};
