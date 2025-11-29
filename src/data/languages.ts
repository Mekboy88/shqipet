export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
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
