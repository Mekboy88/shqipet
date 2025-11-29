import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useWebsiteSettings, useUpdateWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { Loader2, Clock3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import LocalizationNav from './LocalizationNav';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';
import { format } from 'date-fns';

const TIMEZONES = [
  // UTC
  'UTC',
  
  // Europe
  'Europe/London', // United Kingdom
  'Europe/Dublin', // Ireland
  'Europe/Paris', // France
  'Europe/Berlin', // Germany
  'Europe/Rome', // Italy
  'Europe/Madrid', // Spain
  'Europe/Barcelona', // Spain
  'Europe/Amsterdam', // Netherlands
  'Europe/Brussels', // Belgium
  'Europe/Vienna', // Austria
  'Europe/Zurich', // Switzerland
  'Europe/Prague', // Czech Republic
  'Europe/Warsaw', // Poland
  'Europe/Budapest', // Hungary
  'Europe/Bucharest', // Romania
  'Europe/Sofia', // Bulgaria
  'Europe/Athens', // Greece
  'Europe/Helsinki', // Finland
  'Europe/Stockholm', // Sweden
  'Europe/Oslo', // Norway
  'Europe/Copenhagen', // Denmark
  'Europe/Lisbon', // Portugal
  'Europe/Moscow', // Russia
  'Europe/Kiev', // Ukraine
  'Europe/Minsk', // Belarus
  'Europe/Vilnius', // Lithuania
  'Europe/Riga', // Latvia
  'Europe/Tallinn', // Estonia
  'Europe/Zagreb', // Croatia
  'Europe/Belgrade', // Serbia
  'Europe/Ljubljana', // Slovenia
  'Europe/Sarajevo', // Bosnia and Herzegovina
  'Europe/Skopje', // North Macedonia
  'Europe/Tirane', // Albania
  'Europe/Podgorica', // Montenegro
  'Europe/Istanbul', // Turkey
  
  // North America
  'America/New_York', // Eastern Time
  'America/Chicago', // Central Time
  'America/Denver', // Mountain Time
  'America/Los_Angeles', // Pacific Time
  'America/Anchorage', // Alaska Time
  'America/Honolulu', // Hawaii Time
  'America/Toronto', // Canada Eastern
  'America/Vancouver', // Canada Pacific
  'America/Montreal', // Canada Eastern
  'America/Mexico_City', // Mexico
  
  // South America
  'America/Sao_Paulo', // Brazil
  'America/Buenos_Aires', // Argentina
  'America/Santiago', // Chile
  'America/Lima', // Peru
  'America/Bogota', // Colombia
  'America/Caracas', // Venezuela
  
  // Asia
  'Asia/Tokyo', // Japan
  'Asia/Seoul', // South Korea
  'Asia/Shanghai', // China
  'Asia/Hong_Kong', // Hong Kong
  'Asia/Singapore', // Singapore
  'Asia/Bangkok', // Thailand
  'Asia/Jakarta', // Indonesia
  'Asia/Manila', // Philippines
  'Asia/Kuala_Lumpur', // Malaysia
  'Asia/Mumbai', // India
  'Asia/Kolkata', // India
  'Asia/Delhi', // India
  'Asia/Karachi', // Pakistan
  'Asia/Dhaka', // Bangladesh
  'Asia/Dubai', // UAE
  'Asia/Riyadh', // Saudi Arabia
  'Asia/Tehran', // Iran
  'Asia/Baghdad', // Iraq
  'Asia/Jerusalem', // Israel
  'Asia/Beirut', // Lebanon
  'Asia/Damascus', // Syria
  'Asia/Amman', // Jordan
  'Asia/Kuwait', // Kuwait
  'Asia/Qatar', // Qatar
  'Asia/Muscat', // Oman
  'Asia/Yerevan', // Armenia
  'Asia/Baku', // Azerbaijan
  'Asia/Tbilisi', // Georgia
  'Asia/Almaty', // Kazakhstan
  'Asia/Tashkent', // Uzbekistan
  'Asia/Bishkek', // Kyrgyzstan
  'Asia/Dushanbe', // Tajikistan
  'Asia/Ashgabat', // Turkmenistan
  'Asia/Kabul', // Afghanistan
  'Asia/Ulaanbaatar', // Mongolia
  'Asia/Vladivostok', // Russia Far East
  'Asia/Irkutsk', // Russia
  'Asia/Novosibirsk', // Russia
  'Asia/Yekaterinburg', // Russia
  
  // Africa
  'Africa/Cairo', // Egypt
  'Africa/Lagos', // Nigeria
  'Africa/Nairobi', // Kenya
  'Africa/Johannesburg', // South Africa
  'Africa/Casablanca', // Morocco
  'Africa/Tunis', // Tunisia
  'Africa/Algiers', // Algeria
  'Africa/Tripoli', // Libya
  'Africa/Khartoum', // Sudan
  'Africa/Addis_Ababa', // Ethiopia
  'Africa/Dar_es_Salaam', // Tanzania
  'Africa/Kampala', // Uganda
  'Africa/Kigali', // Rwanda
  'Africa/Lusaka', // Zambia
  'Africa/Harare', // Zimbabwe
  'Africa/Maputo', // Mozambique
  'Africa/Windhoek', // Namibia
  'Africa/Gaborone', // Botswana
  'Africa/Maseru', // Lesotho
  'Africa/Mbabane', // Eswatini
  'Africa/Accra', // Ghana
  'Africa/Abidjan', // Ivory Coast
  'Africa/Dakar', // Senegal
  'Africa/Bamako', // Mali
  'Africa/Ouagadougou', // Burkina Faso
  'Africa/Niamey', // Niger
  'Africa/Ndjamena', // Chad
  'Africa/Bangui', // Central African Republic
  'Africa/Brazzaville', // Republic of the Congo
  'Africa/Kinshasa', // Democratic Republic of the Congo
  'Africa/Libreville', // Gabon
  'Africa/Malabo', // Equatorial Guinea
  'Africa/Douala', // Cameroon
  
  // Oceania
  'Australia/Sydney', // Australia Eastern
  'Australia/Melbourne', // Australia Eastern
  'Australia/Brisbane', // Australia Eastern
  'Australia/Adelaide', // Australia Central
  'Australia/Perth', // Australia Western
  'Australia/Darwin', // Australia Central
  'Pacific/Auckland', // New Zealand
  'Pacific/Fiji', // Fiji
  'Pacific/Honolulu', // Hawaii
  'Pacific/Guam', // Guam
  'Pacific/Port_Moresby', // Papua New Guinea
  'Pacific/Noumea', // New Caledonia
  'Pacific/Tahiti', // French Polynesia
];

export default function TimePage() {
  const { data, isLoading } = useWebsiteSettings();
  const update = useUpdateWebsiteSettings();
  const [local, setLocal] = React.useState<any>({});
  React.useEffect(() => { if (data) setLocal(data); }, [data]);
  
  const save = (patch: any) => { setLocal((p:any)=>({ ...p, ...patch })); update.mutate(patch); };

  // Auto-detect timezone functionality
  React.useEffect(() => {
    if (local.auto_detect_timezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detectedTimezone && detectedTimezone !== local.default_timezone) {
        console.log('Auto-detected timezone:', detectedTimezone);
        save({ default_timezone: detectedTimezone });
      }
    }
  }, [local.auto_detect_timezone, local.default_timezone]);

  // Live digital clock state - PERFORMANCE OPTIMIZED
  const [now, setNow] = React.useState<Date>(new Date());
  React.useEffect(() => {
    // Only update clock when page is visible to prevent unnecessary renders
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
  // Get the active timezone (auto-detected or manually selected)
  const activeTimezone = React.useMemo(() => {
    if (local.auto_detect_timezone) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return local.default_timezone || 'UTC';
  }, [local.auto_detect_timezone, local.default_timezone]);

  // Calculate timezone-aware time
  const zonedTime = React.useMemo(() => {
    try {
      return toZonedTime(now, activeTimezone);
    } catch (error) {
      console.warn('Invalid timezone, falling back to UTC:', activeTimezone);
      return toZonedTime(now, 'UTC');
    }
  }, [now, activeTimezone]);

  // Format time according to user settings with proper React dependencies
  const formattedTime = React.useMemo(() => {
    const timeFormat = local.time_format || 'HH:mm';
    const isAmPmFormat = timeFormat.toLowerCase().includes('h') && !timeFormat.includes('HH');
    
    const hours = zonedTime.getHours();
    const minutes = zonedTime.getMinutes();
    const seconds = zonedTime.getSeconds();
    
    console.log('Time format changed to:', timeFormat, 'isAmPm:', isAmPmFormat);
    
    if (isAmPmFormat) {
      const displayHour = ((hours + 11) % 12) + 1;
      const ampm = hours < 12 ? 'AM' : 'PM';
      return {
        displayHour: displayHour.toString(),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        ampm: ampm,
        isAmPm: true
      };
    } else {
      return {
        displayHour: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
        ampm: '',
        isAmPm: false
      };
    }
  }, [zonedTime, local.time_format]);

  // Date formatting
  const MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  const dateStr = `${MONTHS[zonedTime.getMonth()]} ${zonedTime.getDate().toString().padStart(2,'0')} ${zonedTime.getFullYear()}`;
  const weekdayStr = zonedTime.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();

  if (isLoading || !local) return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;

  return (
    <div className="space-y-6">
      <LocalizationNav />
      <h1 className="text-2xl font-semibold">Time & Calendar</h1>
      <Card className="rounded-xl shadow-sm ring-1 ring-[hsl(var(--surface-soft-green-border))] bg-[hsl(var(--surface-soft-green))]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5" /> Time & Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default timezone</Label>
              <Select value={local.default_timezone || 'UTC'} onValueChange={(v) => save({ default_timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Week start day</Label>
              <Select value={String(local.week_start_day ?? 1)} onValueChange={(v) => save({ week_start_day: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date format</Label>
              <Input value={local.date_format || 'PPP'} onChange={(e) => setLocal({ ...local, date_format: e.target.value })} onBlur={() => save({ date_format: local.date_format })} />
            </div>
            <div className="space-y-2">
              <Label>Time format</Label>
              <Input 
                value={local.time_format || 'HH:mm'} 
                onChange={(e) => {
                  const newFormat = e.target.value;
                  setLocal({ ...local, time_format: newFormat });
                  save({ time_format: newFormat });
                }} 
                placeholder="e.g., HH:mm, h:mm a, HH:mm:ss"
              />
              <p className="text-xs text-muted-foreground">
                Examples: HH:mm (24-hour), h:mm a (12-hour with AM/PM), HH:mm:ss (with seconds)
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <Label>Auto-detect timezone</Label>
              <p className="text-xs text-muted-foreground">Use browser Intl API to detect.</p>
            </div>
            <Switch checked={!!local.auto_detect_timezone} onCheckedChange={(v) => save({ auto_detect_timezone: v })} />
          </div>

          {/* Live Digital Clock Preview */}
          <section aria-label="Live digital clock" className="pt-2">
            <div className="relative rounded-xl px-6 py-12 md:py-16" style={{ backgroundColor: 'hsl(var(--digital-bg))', color: 'hsl(var(--digital-gray))' }}>
              {/* AM/PM top-right (only show if 12-hour format) */}
              {formattedTime.isAmPm && (
                <div className="absolute right-6 top-4" style={{ fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace", letterSpacing: '0.1em' }}>
                  {formattedTime.ampm}
                </div>
              )}

              {/* Main time */}
              <div className="w-full flex items-center justify-center overflow-visible">
                <span className="leading-none" style={{ fontFamily: "'DSEG7-Classic','DSEG7-Modern','DSEG7-7SEGG',monospace", letterSpacing: '0.02em', fontSize: 'clamp(96px, 18vw, 220px)' }}>
                  <span aria-hidden="true">{formattedTime.displayHour}</span>
                  <span className="inline-block px-2" aria-label="Separator" style={{ opacity: parseInt(formattedTime.seconds) % 2 === 0 ? 1 : 0 }}>:</span>
                  <span aria-hidden="true">{formattedTime.minutes}</span>
                </span>
                {/* Seconds next to time */}
                <span className="ml-4 inline-block translate-y-16 sm:translate-y-20 md:translate-y-24" style={{ fontFamily: "'DSEG7-Classic','DSEG7-Modern','DSEG7-7SEGG',monospace", fontSize: 'clamp(24px, 5vw, 42px)' }}>
                  {formattedTime.seconds}
                </span>
              </div>

              {/* Bottom row: date left, weekday right */}
              <div className="mt-8 flex items-center justify-between uppercase" style={{ fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace", letterSpacing: '0.18em' }}>
                <span>{dateStr}</span>
                <span>{weekdayStr}</span>
              </div>
              
              {/* Display current timezone and detection status */}
              <div className="mt-4 text-center text-sm opacity-75" style={{ fontFamily: "'DSEG14-Classic','DSEG14-Modern',monospace" }}>
                <div>Timezone: {activeTimezone}</div>
                {local.auto_detect_timezone && (
                  <div className="text-xs mt-1">Auto-detected from browser</div>
                )}
                <div className="text-xs mt-1">Format: {local.time_format || 'HH:mm'}</div>
              </div>
            </div>
          </section>

          {/* Calendar Section */}
          <section aria-label="Calendar" className="pt-2">
            <div className="rounded-3xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm shadow-xl ring-1 ring-blue-200/50 p-8 md:p-12 w-full md:w-[720px] lg:w-[900px] xl:w-[1000px] mx-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn('pointer-events-auto')}
                classNames={{
                  months: 'flex justify-center',
                  month: 'space-y-6',
                  caption: 'flex items-center justify-between px-4 mb-2',
                  caption_label: 'sr-only',
                  nav: 'flex items-center gap-3',
                  nav_button: 'h-12 w-12 md:h-14 md:w-14 rounded-2xl border border-slate-200/80 bg-white/90 hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center backdrop-blur-sm',
                  nav_button_previous: 'order-first hover:bg-green-50 hover:border-green-300',
                  nav_button_next: 'order-last hover:bg-purple-50 hover:border-purple-300',
                  table: 'w-full border-collapse',
                  head_row: 'grid grid-cols-7 gap-4 md:gap-5 px-2 mb-4',
                  head_cell: 'text-slate-600 font-semibold text-lg md:text-xl tracking-wide',
                  row: 'grid grid-cols-7 gap-4 md:gap-5 px-2 mb-2',
                  cell: 'relative p-0 aspect-square',
                  day: 'w-full h-full rounded-2xl border border-slate-200/60 bg-white/80 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 text-lg md:text-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm hover:border-blue-300 [&:nth-child(7n+1)]:hover:from-red-50 [&:nth-child(7n+1)]:hover:to-red-100 [&:nth-child(7n+1)]:hover:border-red-300 [&:nth-child(7n+2)]:hover:from-orange-50 [&:nth-child(7n+2)]:hover:to-orange-100 [&:nth-child(7n+2)]:hover:border-orange-300 [&:nth-child(7n+3)]:hover:from-yellow-50 [&:nth-child(7n+3)]:hover:to-yellow-100 [&:nth-child(7n+3)]:hover:border-yellow-300 [&:nth-child(7n+4)]:hover:from-green-50 [&:nth-child(7n+4)]:hover:to-green-100 [&:nth-child(7n+4)]:hover:border-green-300 [&:nth-child(7n+5)]:hover:from-teal-50 [&:nth-child(7n+5)]:hover:to-teal-100 [&:nth-child(7n+5)]:hover:border-teal-300 [&:nth-child(7n+6)]:hover:from-indigo-50 [&:nth-child(7n+6)]:hover:to-indigo-100 [&:nth-child(7n+6)]:hover:border-indigo-300 [&:nth-child(7n+7)]:hover:from-purple-50 [&:nth-child(7n+7)]:hover:to-purple-100 [&:nth-child(7n+7)]:hover:border-purple-300',
                  day_selected: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-2 ring-blue-300 hover:from-blue-600 hover:to-blue-700',
                  day_today: 'ring-2 ring-blue-400 bg-gradient-to-br from-blue-100 to-blue-200 font-bold',
                  day_disabled: 'opacity-30',
                  day_outside: 'opacity-30',
                }}
                components={{
                  IconLeft: () => <ChevronLeft className="h-5 w-5" aria-hidden />,
                  IconRight: () => <ChevronRight className="h-5 w-5" aria-hidden />,
                  Caption: (props: any) => {
                    const date = props.displayMonth as Date;
                    const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                    const monthStr = date.toLocaleString(undefined, { month: 'long' });
                    const yearStr = date.getFullYear();
                    return (
                      <div className="flex items-center justify-between px-2">
                        <button
                          type="button"
                          onClick={() => props.goToMonth(prev)}
                          className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
                          aria-label="Previous month"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <div className="px-4 py-2 rounded-lg bg-background border border-border text-xl md:text-2xl font-bold">
                            {monthStr}
                          </div>
                          <div className="px-4 py-2 rounded-lg bg-background border border-border text-xl md:text-2xl font-bold">
                            {yearStr}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => props.goToMonth(next)}
                          className="h-10 w-10 md:h-11 md:w-11 rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
                          aria-label="Next month"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    );
                  },
                }}
              />
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
