import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  // English Variants
  { code: 'en-US', name: 'English (USA)', nativeName: 'Anglisht (SHBA)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'Anglisht (MB)', flag: '🇬🇧' },
  { code: 'en-CA', name: 'English (Canada)', nativeName: 'Anglisht (Kanada)', flag: '🇨🇦' },
  { code: 'en-AU', name: 'English (Australia)', nativeName: 'Anglisht (Australi)', flag: '🇦🇺' },
  { code: 'en-IE', name: 'English (Ireland)', nativeName: 'Anglisht (Irlandë)', flag: '🇮🇪' },
  { code: 'en-NZ', name: 'English (New Zealand)', nativeName: 'Anglisht (Zelandë e Re)', flag: '🇳🇿' },
  
  // Balkan Languages
  { code: 'bs', name: 'Bosnian', nativeName: 'Boshnjakisht', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Bullgarisht', flag: '🇧🇬' },
  { code: 'hr', name: 'Croatian', nativeName: 'Kroatisht', flag: '🇭🇷' },
  { code: 'mk', name: 'Macedonian', nativeName: 'Maqedonisht', flag: '🇲🇰' },
  { code: 'sl', name: 'Slovenian', nativeName: 'Sllovenisht', flag: '🇸🇮' },
  { code: 'el', name: 'Greek', nativeName: 'Greqisht', flag: '🇬🇷' },
  { code: 'ro', name: 'Romanian', nativeName: 'Rumanisht', flag: '🇷🇴' },
  
  // Western European Languages
  { code: 'fr', name: 'French', nativeName: 'Frëngjisht', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Gjermanisht', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italisht', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Spanjisht', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Portugalisht', flag: '🇵🇹' },
  { code: 'pl', name: 'Polish', nativeName: 'Polonisht', flag: '🇵🇱' },
  { code: 'nl', name: 'Dutch', nativeName: 'Holandisht', flag: '🇳🇱' },
  
  // Central European Languages
  { code: 'cs', name: 'Czech', nativeName: 'Çekisht', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovak', nativeName: 'Sllovakisht', flag: '🇸🇰' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Hungarisht', flag: '🇭🇺' },
  
  // Nordic Languages
  { code: 'sv', name: 'Swedish', nativeName: 'Suedisht', flag: '🇸🇪' },
  { code: 'da', name: 'Danish', nativeName: 'Danisht', flag: '🇩🇰' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norvegjisht', flag: '🇳🇴' },
  { code: 'fi', name: 'Finnish', nativeName: 'Finlandisht', flag: '🇫🇮' },
  
  // Eastern European Languages
  { code: 'ru', name: 'Russian', nativeName: 'Rusisht', flag: '🇷🇺' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Ukrainisht', flag: '🇺🇦' },
  { code: 'tr', name: 'Turkish', nativeName: 'Turqisht', flag: '🇹🇷' },
  
  // Asian Languages
  { code: 'ja', name: 'Japanese', nativeName: 'Japonisht', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: 'Kinezisht', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: 'Koreanisht', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'Hindisht', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', nativeName: 'Tajlandisht', flag: '🇹🇭' },
  { code: 'ar', name: 'Arabic', nativeName: 'Arabisht', flag: '🇸🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Vietnamisht', flag: '🇻🇳' },
  { code: 'id', name: 'Indonesian', nativeName: 'Indonezisht', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Malajisht', flag: '🇲🇾' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipinisht', flag: '🇵🇭' },
  { code: 'bn', name: 'Bengali', nativeName: 'Bengalisht', flag: '🇧🇩' },
  { code: 'fa', name: 'Persian', nativeName: 'Persianisht', flag: '🇮🇷' },
  { code: 'he', name: 'Hebrew', nativeName: 'Hebraisht', flag: '🇮🇱' },
  { code: 'ur', name: 'Urdu', nativeName: 'Urdisht', flag: '🇵🇰' },
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: (key: string) => string;
  getCurrentLanguage: () => Language;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('sq'); // Default to Albanian

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (langCode: string) => {
    setCurrentLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  // Translation function - this would typically use i18n library
  const t = (key: string): string => {
    return translations[currentLanguage]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, getCurrentLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Basic translations for main UI elements
const translations: Record<string, Record<string, string>> = {
  sq: {
    // Common UI elements
    'language': 'Gjuha',
    'home': 'Shtëpia',
    'about': 'Rreth Nesh',
    'contact': 'Kontakti',
    'settings': 'Cilësimet',
    'profile': 'Profili',
    'logout': 'Dilni',
    'login': 'Hyni',
    'register': 'Regjistrohuni',
    'search': 'Kërko',
    'menu': 'Menu',
    'close': 'Mbyll',
    'open': 'Hap',
    'save': 'Ruaj',
    'cancel': 'Anulo',
    'edit': 'Ndrysho',
    'delete': 'Fshi',
    'back': 'Prapa',
    'next': 'Tjetër',
    'previous': 'E mëparshme',
    'submit': 'Dërgo',
    'loading': 'Duke u ngarkuar...',
    'error': 'Gabim',
    'success': 'Sukses',
    'warning': 'Paralajmërim',
    'info': 'Informacion',
    'confirm': 'Konfirmo',
    'yes': 'Po',
    'no': 'Jo',
    'welcome': 'Mirë se vini',
    'dashboard': 'Paneli',
    'notifications': 'Njoftimet',
    'messages': 'Mesazhet',
    'inbox': 'Kutia e Mesazheve',
    'sent': 'Dërguar',
    'draft': 'Draft',
    'archive': 'Arkivi',
    'trash': 'Koshi',
    'help': 'Ndihmë',
    'support': 'Mbështetje',
    'feedback': 'Komente',
    'privacy': 'Privatësia',
    'terms': 'Kushtet',
    'more': 'Më shumë',
    // Admin Localization
    'admin.localization.title': 'Gjuhët dhe Vendndodhja',
    'admin.localization.description': 'Menaxho gjuhët e mbështetura dhe cilësimet e lokalizimit',
    'admin.unsaved.changes': 'Ndryshime të paruajtura',
    'admin.preview.locale': 'Parapamja e gjuhës',
    'admin.preview.none': 'Pa parapamje',
    'admin.preview.mode': 'Mënyra e Parapamjes',
    'admin.preview.exit': 'Dil nga Parapamja',
    'admin.search.languages': 'Kërko gjuhë...',
    'admin.regions.all': 'Të gjitha Rajonet',
    'admin.tab.languages': 'Gjuhët',
    'admin.tab.translate': 'Përkthej',
    'admin.tab.settings': 'Cilësimet',
    'admin.settings.defaults.title': 'E parazgjedhur dhe Mbështetëse',
    'admin.settings.default.locale': 'Gjuha e Parazgjedhur',
    'admin.settings.fallback.locale': 'Gjuha Mbështetëse',
    'admin.settings.detection.order': 'Renditja e Zbulimit',
    'admin.language.default': 'E parazgjedhur',
    'admin.language.fallback': 'Mbështetëse',
    'admin.language.updated': 'Gjuha u Përditësua',
    'admin.language.enabled': 'e aktivizuar',
    'admin.language.disabled': 'e çaktivizuar',
    'admin.language.update.failed': 'Dështoi përditësimi i gjuhës',
    'admin.settings.saved': 'Cilësimet u Ruajtën',
    'admin.settings.locales.updated': 'Gjuhët e parazgjedhura dhe mbështetëse u përditësuan',
    'admin.settings.save.failed': 'Dështoi ruajtja e cilësimeve',
    'admin.stats.total.languages': 'Gjithsej Gjuhë',
    'admin.stats.enabled': 'Të Aktivizuara',
    'admin.stats.regions': 'Rajone',
    'admin.stats.missing.keys': 'Çelësa të Munguar',
    'admin.translate.editor.title': 'Redaktuesi i Përkthimeve',
    'admin.translate.editor.coming.soon': 'Menaxhimi i avancuar i përkthimeve vjen së shpejti',
    'admin.translate.add.key': 'Shto Çelës Përkthimi',
    'admin.system.settings': 'Cilësimet e Sistemit',
    'admin.settings.force.english': 'Detyro Hyrjen dhe Cilësimet e Admin në Anglisht',
    'admin.settings.force.english.description': 'Gjithmonë shfaq faqet e hyrjes dhe cilësimeve të admin në anglisht për prodhimin',
    'admin.settings.sync.user': 'Sinkronizo me Cilësimet e Përdoruesit',
    'admin.settings.sync.user.description': 'Menuja e gjuhës së përdoruesit tregon saktësisht gjuhët e aktivizuara këtu',
    'admin.export.all': 'Eksporto Të Gjitha',
    'admin.import.all': 'Importo Të Gjitha',
    'common.error': 'Gabim'
  },
  en: {
    'language': 'Language',
    'home': 'Home',
    'about': 'About',
    'contact': 'Contact',
    'settings': 'Settings',
    'profile': 'Profile',
    'logout': 'Logout',
    'login': 'Login',
    'register': 'Register',
    'search': 'Search',
    'menu': 'Menu',
    'close': 'Close',
    'open': 'Open',
    'save': 'Save',
    'cancel': 'Cancel',
    'edit': 'Edit',
    'delete': 'Delete',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'submit': 'Submit',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information',
    'confirm': 'Confirm',
    'yes': 'Yes',
    'no': 'No',
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'notifications': 'Notifications',
    'messages': 'Messages',
    'inbox': 'Inbox',
    'sent': 'Sent',
    'draft': 'Draft',
    'archive': 'Archive',
    'trash': 'Trash',
    'help': 'Help',
    'support': 'Support',
    'feedback': 'Feedback',
    'privacy': 'Privacy',
    'terms': 'Terms',
    'more': 'More',
    // Admin Localization
    'admin.localization.title': 'Languages & Localization',
    'admin.localization.description': 'Manage supported languages and localization settings',
    'admin.unsaved.changes': 'Unsaved changes',
    'admin.preview.locale': 'Preview locale',
    'admin.preview.none': 'No preview',
    'admin.preview.mode': 'Preview Mode',
    'admin.preview.exit': 'Exit Preview',
    'admin.search.languages': 'Search languages...',
    'admin.regions.all': 'All Regions',
    'admin.tab.languages': 'Languages',
    'admin.tab.translate': 'Translate',
    'admin.tab.settings': 'Settings',
    'admin.settings.defaults.title': 'Default & Fallback',
    'admin.settings.default.locale': 'Default Locale',
    'admin.settings.fallback.locale': 'Fallback Locale',
    'admin.settings.detection.order': 'Detection Order',
    'admin.language.default': 'Default',
    'admin.language.fallback': 'Fallback',
    'admin.language.updated': 'Language Updated',
    'admin.language.enabled': 'enabled',
    'admin.language.disabled': 'disabled',
    'admin.language.update.failed': 'Failed to update language',
    'admin.settings.saved': 'Settings Saved',
    'admin.settings.locales.updated': 'Default and fallback locales updated',
    'admin.settings.save.failed': 'Failed to save settings',
    'admin.stats.total.languages': 'Total Languages',
    'admin.stats.enabled': 'Enabled',
    'admin.stats.regions': 'Regions',
    'admin.stats.missing.keys': 'Missing Keys',
    'admin.translate.editor.title': 'Translation Editor',
    'admin.translate.editor.coming.soon': 'Advanced translation management coming soon',
    'admin.translate.add.key': 'Add Translation Key',
    'admin.system.settings': 'System Settings',
    'admin.settings.force.english': 'Force Admin Login & Settings in English',
    'admin.settings.force.english.description': 'Always render admin login and settings pages in English for production',
    'admin.settings.sync.user': 'Sync with User Settings',
    'admin.settings.sync.user.description': 'User language dropdown shows exactly the enabled languages here',
    'admin.export.all': 'Export All',
    'admin.import.all': 'Import All',
    'common.error': 'Error'
  },
  de: {
    'language': 'Sprache',
    'home': 'Startseite',
    'about': 'Über uns',
    'contact': 'Kontakt',
    'settings': 'Einstellungen',
    'profile': 'Profil',
    'logout': 'Abmelden',
    'login': 'Anmelden',
    'register': 'Registrieren',
    'search': 'Suchen',
    'menu': 'Menü',
    'close': 'Schließen',
    'open': 'Öffnen',
    'save': 'Speichern',
    'cancel': 'Abbrechen',
    'edit': 'Bearbeiten',
    'delete': 'Löschen',
    'back': 'Zurück',
    'next': 'Weiter',
    'previous': 'Vorherige',
    'submit': 'Absenden',
    'loading': 'Wird geladen...',
    'error': 'Fehler',
    'success': 'Erfolg',
    'warning': 'Warnung',
    'info': 'Information',
    'confirm': 'Bestätigen',
    'yes': 'Ja',
    'no': 'Nein',
    'welcome': 'Willkommen',
    'dashboard': 'Dashboard',
    'notifications': 'Benachrichtigungen',
    'messages': 'Nachrichten',
    'inbox': 'Posteingang',
    'sent': 'Gesendet',
    'draft': 'Entwurf',
    'archive': 'Archiv',
    'trash': 'Papierkorb',
    'help': 'Hilfe',
    'support': 'Support',
    'feedback': 'Feedback',
    'privacy': 'Datenschutz',
    'terms': 'Bedingungen',
    'more': 'Mehr',
    // Admin Localization
    'admin.localization.title': 'Sprachen & Lokalisierung',
    'admin.localization.description': 'Verwalten Sie unterstützte Sprachen und Lokalisierungseinstellungen',
    'admin.unsaved.changes': 'Ungespeicherte Änderungen',
    'admin.preview.locale': 'Vorschau Sprache',
    'admin.preview.none': 'Keine Vorschau',
    'admin.preview.mode': 'Vorschau-Modus',
    'admin.preview.exit': 'Vorschau Verlassen',
    'admin.search.languages': 'Sprachen suchen...',
    'admin.regions.all': 'Alle Regionen',
    'admin.tab.languages': 'Sprachen',
    'admin.tab.translate': 'Übersetzen',
    'admin.tab.settings': 'Einstellungen',
    'admin.settings.defaults.title': 'Standard & Fallback',
    'admin.settings.default.locale': 'Standardsprache',
    'admin.settings.fallback.locale': 'Fallback-Sprache',
    'admin.settings.detection.order': 'Erkennungsreihenfolge',
    'admin.language.default': 'Standard',
    'admin.language.fallback': 'Fallback',
    'admin.language.updated': 'Sprache Aktualisiert',
    'admin.language.enabled': 'aktiviert',
    'admin.language.disabled': 'deaktiviert',
    'admin.language.update.failed': 'Fehler beim Aktualisieren der Sprache',
    'admin.settings.saved': 'Einstellungen Gespeichert',
    'admin.settings.locales.updated': 'Standard- und Fallback-Sprachen aktualisiert',
    'admin.settings.save.failed': 'Fehler beim Speichern der Einstellungen',
    'admin.stats.total.languages': 'Sprachen Gesamt',
    'admin.stats.enabled': 'Aktiviert',
    'admin.stats.regions': 'Regionen',
    'admin.stats.missing.keys': 'Fehlende Schlüssel',
    'admin.translate.editor.title': 'Übersetzungseditor',
    'admin.translate.editor.coming.soon': 'Erweiterte Übersetzungsverwaltung kommt bald',
    'admin.translate.add.key': 'Übersetzungsschlüssel Hinzufügen',
    'admin.system.settings': 'Systemeinstellungen',
    'admin.settings.force.english': 'Admin-Anmeldung & Einstellungen auf Englisch Erzwingen',
    'admin.settings.force.english.description': 'Admin-Anmelde- und Einstellungsseiten immer auf Englisch für Produktion rendern',
    'admin.settings.sync.user': 'Mit Benutzereinstellungen Synchronisieren',
    'admin.settings.sync.user.description': 'Benutzer-Sprachdropdown zeigt genau die hier aktivierten Sprachen',
    'admin.export.all': 'Alle Exportieren',
    'admin.import.all': 'Alle Importieren',
    'common.error': 'Fehler'
  },
  fr: {
    'language': 'Langue',
    'home': 'Accueil',
    'about': 'À propos',
    'contact': 'Contact',
    'settings': 'Paramètres',
    'profile': 'Profil',
    'logout': 'Déconnexion',
    'login': 'Connexion',
    'register': 'S\'inscrire',
    'search': 'Rechercher',
    'menu': 'Menu',
    'close': 'Fermer',
    'open': 'Ouvrir',
    'save': 'Sauvegarder',
    'cancel': 'Annuler',
    'edit': 'Modifier',
    'delete': 'Supprimer',
    'back': 'Retour',
    'next': 'Suivant',
    'previous': 'Précédent',
    'submit': 'Soumettre',
    'loading': 'Chargement...',
    'error': 'Erreur',
    'success': 'Succès',
    'warning': 'Avertissement',
    'info': 'Information',
    'confirm': 'Confirmer',
    'yes': 'Oui',
    'no': 'Non',
    'welcome': 'Bienvenue',
    'dashboard': 'Tableau de bord',
    'notifications': 'Notifications',
    'messages': 'Messages',
    'inbox': 'Boîte de réception',
    'sent': 'Envoyé',
    'draft': 'Brouillon',
    'archive': 'Archive',
    'trash': 'Corbeille',
    'help': 'Aide',
    'support': 'Support',
    'feedback': 'Commentaires',
    'privacy': 'Confidentialité',
    'terms': 'Conditions',
    'more': 'Plus',
    // Admin Localization
    'admin.localization.title': 'Langues et Localisation',
    'admin.localization.description': 'Gérer les langues prises en charge et les paramètres de localisation',
    'admin.unsaved.changes': 'Modifications non sauvegardées',
    'admin.preview.locale': 'Aperçu de la langue',
    'admin.preview.none': 'Aucun aperçu',
    'admin.preview.mode': 'Mode Aperçu',
    'admin.preview.exit': 'Quitter l\'Aperçu',
    'admin.search.languages': 'Rechercher des langues...',
    'admin.regions.all': 'Toutes les Régions',
    'admin.tab.languages': 'Langues',
    'admin.tab.translate': 'Traduire',
    'admin.tab.settings': 'Paramètres',
    'admin.settings.defaults.title': 'Par Défaut et Secours',
    'admin.settings.default.locale': 'Langue par Défaut',
    'admin.settings.fallback.locale': 'Langue de Secours',
    'admin.settings.detection.order': 'Ordre de Détection',
    'admin.language.default': 'Par défaut',
    'admin.language.fallback': 'Secours',
    'admin.language.updated': 'Langue Mise à Jour',
    'admin.language.enabled': 'activée',
    'admin.language.disabled': 'désactivée',
    'admin.language.update.failed': 'Échec de la mise à jour de la langue',
    'admin.settings.saved': 'Paramètres Sauvegardés',
    'admin.settings.locales.updated': 'Langues par défaut et de secours mises à jour',
    'admin.settings.save.failed': 'Échec de la sauvegarde des paramètres',
    'admin.stats.total.languages': 'Total des Langues',
    'admin.stats.enabled': 'Activées',
    'admin.stats.regions': 'Régions',
    'admin.stats.missing.keys': 'Clés Manquantes',
    'admin.translate.editor.title': 'Éditeur de Traduction',
    'admin.translate.editor.coming.soon': 'Gestion avancée des traductions bientôt disponible',
    'admin.translate.add.key': 'Ajouter une Clé de Traduction',
    'admin.system.settings': 'Paramètres Système',
    'admin.settings.force.english': 'Forcer la Connexion Admin et les Paramètres en Anglais',
    'admin.settings.force.english.description': 'Toujours afficher les pages de connexion admin et les paramètres en anglais pour la production',
    'admin.settings.sync.user': 'Synchroniser avec les Paramètres Utilisateur',
    'admin.settings.sync.user.description': 'Le menu déroulant de langue utilisateur affiche exactement les langues activées ici',
    'admin.export.all': 'Tout Exporter',
    'admin.import.all': 'Tout Importer',
    'common.error': 'Erreur'
  }
};