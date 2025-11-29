import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Globe, Calendar } from 'lucide-react';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

interface TimezoneDisplayProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
  countryCode?: string;
}

// Comprehensive timezone list with regions
const TIMEZONE_REGIONS = {
  'UTC': ['UTC'],
  'Europe': [
    'Europe/London', 'Europe/Dublin', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
    'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna',
    'Europe/Zurich', 'Europe/Prague', 'Europe/Warsaw', 'Europe/Budapest',
    'Europe/Bucharest', 'Europe/Sofia', 'Europe/Athens', 'Europe/Helsinki',
    'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Lisbon',
    'Europe/Moscow', 'Europe/Kiev', 'Europe/Minsk', 'Europe/Vilnius',
    'Europe/Riga', 'Europe/Tallinn', 'Europe/Zagreb', 'Europe/Belgrade',
    'Europe/Ljubljana', 'Europe/Sarajevo', 'Europe/Skopje', 'Europe/Tirane',
    'Europe/Podgorica', 'Europe/Istanbul'
  ],
  'North America': [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'America/Honolulu', 'America/Toronto', 'America/Vancouver',
    'America/Montreal', 'America/Mexico_City'
  ],
  'South America': [
    'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Santiago', 'America/Lima',
    'America/Bogota', 'America/Caracas'
  ],
  'Asia': [
    'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
    'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Manila', 'Asia/Kuala_Lumpur',
    'Asia/Mumbai', 'Asia/Kolkata', 'Asia/Delhi', 'Asia/Karachi', 'Asia/Dhaka',
    'Asia/Dubai', 'Asia/Riyadh', 'Asia/Tehran', 'Asia/Baghdad', 'Asia/Jerusalem',
    'Asia/Beirut', 'Asia/Damascus', 'Asia/Amman', 'Asia/Kuwait', 'Asia/Qatar',
    'Asia/Muscat', 'Asia/Yerevan', 'Asia/Baku', 'Asia/Tbilisi', 'Asia/Almaty',
    'Asia/Tashkent', 'Asia/Bishkek', 'Asia/Dushanbe', 'Asia/Ashgabat',
    'Asia/Kabul', 'Asia/Ulaanbaatar', 'Asia/Vladivostok', 'Asia/Irkutsk',
    'Asia/Novosibirsk', 'Asia/Yekaterinburg'
  ],
  'Africa': [
    'Africa/Cairo', 'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg',
    'Africa/Casablanca', 'Africa/Tunis', 'Africa/Algiers', 'Africa/Tripoli',
    'Africa/Khartoum', 'Africa/Addis_Ababa', 'Africa/Dar_es_Salaam',
    'Africa/Kampala', 'Africa/Kigali', 'Africa/Lusaka', 'Africa/Harare',
    'Africa/Maputo', 'Africa/Windhoek', 'Africa/Gaborone', 'Africa/Maseru',
    'Africa/Mbabane', 'Africa/Accra', 'Africa/Abidjan', 'Africa/Dakar',
    'Africa/Bamako', 'Africa/Ouagadougou', 'Africa/Niamey', 'Africa/Ndjamena',
    'Africa/Bangui', 'Africa/Brazzaville', 'Africa/Kinshasa', 'Africa/Libreville',
    'Africa/Malabo', 'Africa/Douala'
  ],
  'Oceania': [
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Adelaide', 'Australia/Perth', 'Australia/Darwin',
    'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu', 'Pacific/Guam',
    'Pacific/Port_Moresby', 'Pacific/Noumea', 'Pacific/Tahiti'
  ]
};

// Country to timezone mapping for auto-selection
const COUNTRY_TIMEZONE_MAP: { [key: string]: string } = {
  'AL': 'Europe/Tirane', 'AD': 'Europe/Andorra', 'AM': 'Asia/Yerevan',
  'AT': 'Europe/Vienna', 'AZ': 'Asia/Baku', 'BY': 'Europe/Minsk',
  'BE': 'Europe/Brussels', 'BA': 'Europe/Sarajevo', 'BG': 'Europe/Sofia',
  'HR': 'Europe/Zagreb', 'CY': 'Asia/Nicosia', 'CZ': 'Europe/Prague',
  'DK': 'Europe/Copenhagen', 'EE': 'Europe/Tallinn', 'FI': 'Europe/Helsinki',
  'FR': 'Europe/Paris', 'GE': 'Asia/Tbilisi', 'DE': 'Europe/Berlin',
  'GR': 'Europe/Athens', 'HU': 'Europe/Budapest', 'IS': 'Atlantic/Reykjavik',
  'IE': 'Europe/Dublin', 'IT': 'Europe/Rome', 'KZ': 'Asia/Almaty',
  'XK': 'Europe/Belgrade', 'LV': 'Europe/Riga', 'LI': 'Europe/Vaduz',
  'LT': 'Europe/Vilnius', 'LU': 'Europe/Luxembourg', 'MT': 'Europe/Malta',
  'MD': 'Europe/Chisinau', 'MC': 'Europe/Monaco', 'ME': 'Europe/Podgorica',
  'NL': 'Europe/Amsterdam', 'MK': 'Europe/Skopje', 'NO': 'Europe/Oslo',
  'PL': 'Europe/Warsaw', 'PT': 'Europe/Lisbon', 'RO': 'Europe/Bucharest',
  'RU': 'Europe/Moscow', 'SM': 'Europe/San_Marino', 'RS': 'Europe/Belgrade',
  'SK': 'Europe/Bratislava', 'SI': 'Europe/Ljubljana', 'ES': 'Europe/Madrid',
  'SE': 'Europe/Stockholm', 'CH': 'Europe/Zurich', 'TR': 'Europe/Istanbul',
  'UA': 'Europe/Kiev', 'GB': 'Europe/London', 'VA': 'Europe/Vatican',
  'US': 'America/New_York', 'CA': 'America/Toronto', 'MX': 'America/Mexico_City',
  'BR': 'America/Sao_Paulo', 'AR': 'America/Buenos_Aires', 'CL': 'America/Santiago',
  'JP': 'Asia/Tokyo', 'KR': 'Asia/Seoul', 'CN': 'Asia/Shanghai',
  'IN': 'Asia/Kolkata', 'AU': 'Australia/Sydney', 'NZ': 'Pacific/Auckland',
  'ZA': 'Africa/Johannesburg', 'EG': 'Africa/Cairo', 'NG': 'Africa/Lagos'
};

const TimezoneDisplay: React.FC<TimezoneDisplayProps> = ({
  timezone,
  onTimezoneChange,
  countryCode
}) => {
  const [now, setNow] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  
  // Get website settings from admin/database
  const { data: websiteSettings } = useWebsiteSettings();

  // Update time - PERFORMANCE OPTIMIZED (for clocks, 1s is necessary but optimized)
  useEffect(() => {
    // Use performance-optimized interval for clock display
    const interval = setInterval(() => {
      // Only update if component is visible to user
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-detect timezone from admin settings
  useEffect(() => {
    if (websiteSettings?.auto_detect_timezone && !timezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Auto-detected timezone from admin settings:', detectedTimezone);
      onTimezoneChange(detectedTimezone);
    } else if (websiteSettings?.default_timezone && !timezone) {
      console.log('Using default timezone from admin settings:', websiteSettings.default_timezone);
      onTimezoneChange(websiteSettings.default_timezone);
    }
  }, [websiteSettings, timezone, onTimezoneChange]);

  // Auto-update timezone based on country (from database settings)
  useEffect(() => {
    if (countryCode && COUNTRY_TIMEZONE_MAP[countryCode] && !timezone) {
      const suggestedTimezone = COUNTRY_TIMEZONE_MAP[countryCode];
      console.log('Auto-updating timezone based on country:', countryCode, '->', suggestedTimezone);
      onTimezoneChange(suggestedTimezone);
    }
  }, [countryCode, timezone, onTimezoneChange]);

  // Get active timezone (priority: selected -> country-based -> admin default -> auto-detected -> UTC)
  const activeTimezone = useMemo(() => {
    if (timezone) return timezone;
    if (countryCode && COUNTRY_TIMEZONE_MAP[countryCode]) return COUNTRY_TIMEZONE_MAP[countryCode];
    if (websiteSettings?.auto_detect_timezone) return Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (websiteSettings?.default_timezone) return websiteSettings.default_timezone;
    return 'UTC';
  }, [timezone, countryCode, websiteSettings]);

  // Calculate timezone info using active timezone
  const timezoneInfo = useMemo(() => {
    try {
      const zonedTime = toZonedTime(now, activeTimezone);
      const utcOffset = formatInTimeZone(now, activeTimezone, 'xxx');
      
      // Use admin time format if available
      const timeFormat = websiteSettings?.time_format || 'HH:mm:ss';
      const dateFormat = websiteSettings?.date_format || 'PPP';
      
      return {
        time: format(zonedTime, timeFormat),
        date: format(zonedTime, dateFormat),
        weekday: format(zonedTime, 'EEEE'),
        utcOffset,
        zonedTime
      };
    } catch (error) {
      console.warn('Error calculating timezone info for:', activeTimezone, error);
      return null;
    }
  }, [now, activeTimezone, websiteSettings]);

  const formatTimezoneDisplay = (tz: string) => {
    const city = tz.split('/')[1]?.replace(/_/g, ' ') || tz;
    try {
      const offset = formatInTimeZone(now, tz, 'xxx');
      return `${city} (UTC${offset})`;
    } catch (error) {
      return `${city}`;
    }
  };

  const getTimezoneTime = (tz: string) => {
    try {
      return formatInTimeZone(now, tz, 'HH:mm');
    } catch (error) {
      return '--:--';
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 border border-input rounded-lg bg-background hover:bg-accent/50 transition-colors text-left"
        >
          {activeTimezone && timezoneInfo ? (
            <div className="space-y-2">
              {/* Digital time display with DSEG font styling - matching admin page */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{formatTimezoneDisplay(activeTimezone)}</span>
                  {websiteSettings?.auto_detect_timezone && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Auto</span>
                  )}
                </div>
                <div 
                  className="text-xl font-mono tabular-nums tracking-wider"
                  style={{ 
                    fontFamily: "'DSEG7-Classic','DSEG7-Modern','DSEG7-7SEGG',monospace, 'Courier New', monospace",
                    letterSpacing: '0.1em',
                    color: 'hsl(var(--digital-gray))'
                  }}
                >
                  {timezoneInfo.time}
                </div>
              </div>
              
              {/* Date and additional info - matching admin page styling */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span 
                    style={{ 
                      fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace, 'Courier New', monospace",
                      letterSpacing: '0.05em'
                    }}
                  >
                    {timezoneInfo.weekday}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span 
                    style={{ 
                      fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace, 'Courier New', monospace"
                    }}
                  >
                    {timezoneInfo.date}
                  </span>
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    <span 
                      style={{ 
                        fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace, 'Courier New', monospace"
                      }}
                    >
                      UTC{timezoneInfo.utcOffset}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Admin sync indicator */}
              <div className="text-xs text-muted-foreground/70 text-center">
                Synkronizuar me cilësimet e administratorit
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Zgjetimi automatik i zonës kohore...</span>
            </div>
          )}
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-lg shadow-lg max-h-80 overflow-auto">
            {Object.entries(TIMEZONE_REGIONS).map(([region, timezones]) => (
              <div key={region} className="p-2">
                <div className="text-sm font-medium text-muted-foreground px-2 py-1 border-b">
                  {region}
                </div>
                {timezones.map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => {
                      onTimezoneChange(tz);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 hover:bg-accent/50 transition-colors text-sm rounded"
                  >
                    <div className="flex justify-between items-center">
                      <span>{formatTimezoneDisplay(tz)}</span>
                      <span 
                        className="text-xs font-mono tabular-nums"
                        style={{ 
                          fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace, 'Courier New', monospace"
                        }}
                      >
                        {getTimezoneTime(tz)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimezoneDisplay;