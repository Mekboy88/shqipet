import { useState, useEffect, useCallback } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', rtl: false },
  { code: 'sq', name: 'Albanian', nativeName: 'Shqip', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', rtl: true },
];

interface UseLocalizationOptions {
  fallbackLanguage?: string;
  enableAutoDetection?: boolean;
  storageKey?: string;
}

export const useLocalization = (options: UseLocalizationOptions = {}) => {
  const {
    fallbackLanguage = 'en',
    enableAutoDetection = true,
    storageKey = 'user-language'
  } = options;

  const [currentLanguage, setCurrentLanguage] = useState<string>(fallbackLanguage);
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [autoDetectedLanguage, setAutoDetectedLanguage] = useState<string | null>(null);

  // Detect browser language
  const detectBrowserLanguage = useCallback((): string => {
    if (!enableAutoDetection) return fallbackLanguage;

    // Get browser languages in order of preference
    const browserLanguages = [
      navigator.language,
      ...(navigator.languages || [])
    ];

    // Find the first supported language
    for (const browserLang of browserLanguages) {
      // Extract language code (e.g., 'en-US' -> 'en')
      const langCode = browserLang.split('-')[0].toLowerCase();
      
      // Check if we support this language
      const supportedLang = SUPPORTED_LANGUAGES.find(lang => lang.code === langCode);
      if (supportedLang) {
        setAutoDetectedLanguage(supportedLang.code);
        return supportedLang.code;
      }
    }

    return fallbackLanguage;
  }, [enableAutoDetection, fallbackLanguage]);

  // Update RTL status when language changes
  useEffect(() => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);
    const rtlStatus = language?.rtl || false;
    setIsRTL(rtlStatus);

    // Update document direction
    document.documentElement.dir = rtlStatus ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;

    // Add/remove RTL class to body for CSS
    if (rtlStatus) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage]);

  // Load saved language or detect browser language
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(storageKey);
      if (savedLanguage && SUPPORTED_LANGUAGES.find(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
      } else {
        const detectedLanguage = detectBrowserLanguage();
        setCurrentLanguage(detectedLanguage);
      }
    } catch (error) {
      console.warn('Failed to load language preference:', error);
      const detectedLanguage = detectBrowserLanguage();
      setCurrentLanguage(detectedLanguage);
    }
  }, [detectBrowserLanguage, storageKey]);

  // Change language
  const changeLanguage = useCallback((languageCode: string) => {
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (!language) {
      console.warn(`Unsupported language code: ${languageCode}`);
      return;
    }

    setCurrentLanguage(languageCode);
    
    try {
      localStorage.setItem(storageKey, languageCode);
    } catch (error) {
      console.warn('Failed to save language preference:', error);
    }
  }, [storageKey]);

  // Get current language object
  const getCurrentLanguage = useCallback((): Language => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  }, [currentLanguage]);

  // Get localized text (basic implementation - would integrate with i18n library)
  const t = useCallback((key: string, fallback?: string): string => {
    // This is a simplified implementation
    // In a real app, this would use a proper i18n library like react-i18next
    const translations: Record<string, Record<string, string>> = {
      en: {
        'login.title': 'Sign In',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.submit': 'Sign In',
        'signup.title': 'Create Account',
        'common.cancel': 'Cancel',
        'common.save': 'Save',
        'language.detected': 'Auto-detected',
        'feed.no_posts': 'No posts yet',
        'feed.no_stories': 'No stories available',
        'feed.no_live': 'No live streams',
        'feed.no_reels': 'No reels available',
        'feed.no_people': 'No suggestions available',
        'feed.no_live_description': 'Check back later for live content',
        'feed.no_people_description': 'Connect with more people to see suggestions',
        'feed.live_section_title': 'Live Now',
        'feed.people_section_title': 'People You May Know',
        'feed.no_posts_description': 'Be the first to share something!'
      },
      sq: {
        'login.title': 'Hyni',
        'login.email': 'Email',
        'login.password': 'Fjalëkalimi',
        'login.submit': 'Hyni',
        'signup.title': 'Krijoni Llogari',
        'common.cancel': 'Anulo',
        'common.save': 'Ruaj',
        'language.detected': 'Zbuluar automatikisht',
        'feed.no_posts': 'Nuk ka postime ende',
        'feed.no_stories': 'Nuk ka histori të disponueshme',
        'feed.no_live': 'Nuk ka transmerime të drejtpërdrejta',
        'feed.no_reels': 'Nuk ka reel të disponueshëm',
        'feed.no_people': 'Nuk ka sugjerime të disponueshme',
        'feed.no_live_description': 'Kontrollo më vonë për përmbajtje të drejtpërdrejtë',
        'feed.no_people_description': 'Lidhu me më shumë njerëz për të parë sugjerime',
        'feed.live_section_title': 'Live tani',
        'feed.people_section_title': "Njerëz që mund t'i njihni",
        'feed.no_posts_description': 'Bëhu i pari që ndan diçka!'
      },
      ar: {
        'login.title': 'تسجيل الدخول',
        'login.email': 'البريد الإلكتروني',
        'login.password': 'كلمة المرور',
        'login.submit': 'تسجيل الدخول',
        'signup.title': 'إنشاء حساب',
        'common.cancel': 'إلغاء',
        'common.save': 'حفظ',
        'language.detected': 'تم اكتشافه تلقائياً',
        'feed.no_posts': 'لا توجد منشورات بعد',
        'feed.no_stories': 'لا توجد قصص متاحة',
        'feed.no_live': 'لا توجد بث مباشر',
        'feed.no_reels': 'لا توجد مقاطع ريلز متاحة',
        'feed.no_people': 'لا توجد اقتراحات متاحة'
      },
      he: {
        'login.title': 'התחברות',
        'login.email': 'אימייל',
        'login.password': 'סיסמה',
        'login.submit': 'התחבר',
        'signup.title': 'יצירת חשבון',
        'common.cancel': 'ביטול',
        'common.save': 'שמור',
        'language.detected': 'זוהה אוטומטית',
        'feed.no_posts': 'אין פוסטים עדיין',
        'feed.no_stories': 'אין סיפורים זמינים',
        'feed.no_live': 'אין שידורים חיים',
        'feed.no_reels': 'אין רילז זמינים',
        'feed.no_people': 'אין הצעות זמינות'
      }
    };

    return translations[currentLanguage]?.[key] || fallback || key;
  }, [currentLanguage]);

  return {
    currentLanguage,
    isRTL,
    autoDetectedLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getCurrentLanguage,
    changeLanguage,
    t
  };
};