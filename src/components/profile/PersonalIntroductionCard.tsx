import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Avatar from '@/components/Avatar';
import { Eye, Users, Lock, School, MapPin, Briefcase, Quote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/relaxedSupabase';
import { toast } from 'sonner';
import { useProfileRealtime } from '@/hooks/useProfileRealtime';


interface VisibilityOption {
  value: 'public' | 'friends' | 'private';
  label: string;
  icon: React.ElementType;
}

interface PersonalIntroData {
  bio?: string;
  bio_visibility?: string;
  profession?: string;
  profession_visibility?: string;
  company?: string;
  company_visibility?: string;
  relationship_status?: string;
  relationship_visibility?: string;
  relationship_user_id?: string;
  favorite_quote?: string;
  favorite_quote_visibility?: string;
  school?: string;
  school_visibility?: string;
  location?: string;
  location_visibility?: string;
  city_location?: string;
  public_phone?: string;
  public_phone_visibility?: string;
  public_email?: string;
  public_email_visibility?: string;
  contact_website?: string;
  contact_website_visibility?: string;
}

const visibilityOptions: VisibilityOption[] = [
  { value: 'public', label: 'Public', icon: Eye },
  { value: 'friends', label: 'Friends', icon: Users },
  { value: 'private', label: 'Private', icon: Lock },
];

const relationshipOptions = [
  'Single',
  'In a relationship',
  'Engaged', 
  'Married',
  'It\'s complicated'
];

interface PersonalIntroductionCardProps {
  isDisplayMode?: boolean;
}

export const PersonalIntroductionCard: React.FC<PersonalIntroductionCardProps> = ({ 
  isDisplayMode = false 
}) => {
  const smokeFocusStyles = "focus:ring-1 focus:ring-gray-300/50 focus:border-gray-400 focus:shadow-sm focus:shadow-gray-200/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-gray-300/50 focus-visible:ring-offset-0";
  const { user } = useAuth();
  
  // Initialize state from cache for instant display
  const getCachedData = useCallback((): PersonalIntroData => {
    if (!user?.id) return {};
    try {
      const cached = localStorage.getItem(`personal_intro_${user.id}`);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  }, [user?.id]);

  const [data, setData] = useState<PersonalIntroData>(() => getCachedData());
  const [originalData, setOriginalData] = useState<PersonalIntroData>(() => getCachedData());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch from personal_introduction table
      const res: any = await (supabase as any)
        .from('personal_introduction' as any)
        .select('*' as any)
        .eq('user_id', user.id)
        .maybeSingle();
      const introData = res?.data as any;
      const error = res?.error as any;

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading personal introduction:', error);
        return;
      }

      const loadedData: PersonalIntroData = {
        school: introData?.school || '',
        city_location: introData?.city || '',
        profession: introData?.profession || '',
        favorite_quote: introData?.favorite_quote || '',
      };

      // Only update if data actually changed
      const dataChanged = JSON.stringify(loadedData) !== JSON.stringify(data);
      if (dataChanged) {
        setData(loadedData);
        setOriginalData(loadedData);
        
        // Update cache
        localStorage.setItem(`personal_intro_${user.id}`, JSON.stringify(loadedData));
      }
    } catch (error) {
      console.error('Error loading personal introduction:', error);
    } finally {
      setLoading(false);
    }
  }, [user, data]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Real-time subscription for instant updates across all devices
  useProfileRealtime(user?.id, loadData);

  // Local live preview for display card to avoid flicker and ensure instant UI update
  useEffect(() => {
    if (!isDisplayMode) return;
    const handler = (e: any) => {
      const detail = e?.detail;
      if (!detail || detail.userId !== user?.id) return;
      setData(detail.data || {});
    };
    window.addEventListener('personalIntroDraftChange', handler);
    return () => window.removeEventListener('personalIntroDraftChange', handler);
  }, [isDisplayMode, user?.id]);

  // Helper to broadcast draft changes from the settings form
  const setDataAndBroadcast = (patch: Partial<PersonalIntroData>) => {
    setData(prev => {
      const next = { ...prev, ...patch };
      window.dispatchEvent(new CustomEvent('personalIntroDraftChange', { detail: { userId: user?.id, data: next } }));
      return next;
    });
  };

  useEffect(() => {
    const changed = JSON.stringify(data) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [data, originalData]);

  const autoSave = async () => {
    if (!user || !hasChanges) return;

    try {
      setSaving(true);
      
      // Prepare data for personal_introduction table
      const introData = {
        user_id: user.id,
        school: data.school || null,
        city: data.city_location || null,
        profession: data.profession || null,
        favorite_quote: data.favorite_quote || null,
        updated_at: new Date().toISOString()
      };

      const upsertRes: any = await (supabase as any)
        .from('personal_introduction' as any)
        .upsert(introData, {
          onConflict: 'user_id'
        });
      const error = upsertRes?.error as any;

      if (error) {
        console.error('Error saving personal introduction:', error);
        toast.error('Failed to save changes');
        return;
      }

      setOriginalData({ ...data });
      
      // Update cache immediately
      if (user?.id) {
        localStorage.setItem(`personal_intro_${user.id}`, JSON.stringify(data));
      }
      
      toast.success('Changes saved automatically');
    } catch (error) {
      console.error('Error saving personal introduction:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save effect with debounce
  useEffect(() => {
    if (!hasChanges) return;
    
    const timeoutId = setTimeout(() => {
      autoSave();
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [data, hasChanges]);

  const VisibilitySelect: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {visibilityOptions.map(option => {
          const Icon = option.icon;
          return (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {option.label}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );


  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  // Display mode - show actual data or empty message
  if (isDisplayMode) {
    // Check if any data exists
    const hasData = data.profession || data.school || data.city_location || data.favorite_quote;

    return (
      <Card className="p-6">
        <h3 className="text-xl font-black text-black/20 animate-fade-in mb-4" style={{
          WebkitTextStroke: '0.5px rgba(0,0,0,0.08)'
        }}>Prezantim</h3>
        
        {!hasData ? (
          <div className="text-gray-500">
            Asnjë hyrje shtuar ende
          </div>
        ) : (
          <div className="space-y-4">
            {/* All Items in a flowing layout */}
            <div className="flex flex-wrap gap-4">
              {/* Profession/Job Title */}
              {data.profession && (
                <div className="flex-none">
                  <h4 className="text-lg font-black mb-1 text-black/20 animate-fade-in flex items-center gap-2" style={{
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.08)'
                  }}>
                    <svg version="1.1" viewBox="0 0 512 512" xmlSpace="preserve" className="w-5 h-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <path className="st0" fill="currentColor" d="M470.537,137.504H41.471C18.565,137.504,0,156.077,0,178.976v56.797l211.507,44.607V252.1h87.772v28.28 L512,235.489v-56.513C512,156.077,493.435,137.504,470.537,137.504z"></path>
                          <path className="st0" fill="currentColor" d="M299.279,369.129h-87.772v-57.017L14.633,273.012V439.81c0,22.898,18.557,41.47,41.455,41.47h399.824 c22.898,0,41.463-18.572,41.463-41.47V272.721l-198.096,39.39V369.129z"></path>
                          <rect x="233.452" y="274.044" className="st0" fill="currentColor" width="43.882" height="73.132"></rect>
                          <path className="st0" fill="currentColor" d="M193.786,72.206c0.008-1.703,0.638-3.057,1.75-4.208c1.127-1.103,2.49-1.718,4.176-1.734h112.577 c1.686,0.016,3.058,0.631,4.185,1.734c1.103,1.151,1.726,2.505,1.733,4.208v29.627h35.546V72.206 c0.008-11.41-4.665-21.875-12.143-29.329c-7.446-7.485-17.934-12.166-29.321-12.158H199.712 c-11.394-0.008-21.875,4.673-29.32,12.158c-7.47,7.454-12.158,17.918-12.135,29.329v29.627h35.529V72.206z"></path>
                        </g>
                      </g>
                    </svg>
                    Profesioni
                  </h4>
                  <p className="text-gray-600 text-sm ml-7 font-medium">{data.profession}</p>
                </div>
              )}

              {/* Education/School */}
              {data.school && (
                <div className="flex-none">
                  <h4 className="text-lg font-black mb-1 text-black/20 animate-fade-in flex items-center gap-2" style={{
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.08)'
                  }}>
                    <svg fill="#52525b" version="1.1" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" enableBackground="new 0 0 300 300">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path d="M89.398,38.617c0-16.908,13.714-30.601,30.606-30.601c16.9,0,30.609,13.696,30.609,30.601 c0,16.891-13.709,30.631-30.609,30.631C103.113,69.248,89.398,55.509,89.398,38.617z M246,91.896V292H30V140h12v76h73v12H42v52 h104.064L146,207H82c-22,0-31.928-16.618-30.148-32.766l8.86-78.583c1.78-16.147,16.319-27.791,32.461-26.015 c9.309,1.026,16.898,6.18,21.91,13.28c3.049,4.319,12.956,16.95,12.956,16.95l34.363-18.481l-1.41-2.639 c-0.937-1.754-0.276-3.936,1.479-4.874c1.754-0.935,3.936-0.276,4.874,1.479l1.408,2.634c6.385-3.275,14.24-0.859,17.654,5.487 c3.424,6.366,1.084,14.285-5.213,17.788l4.99,9.336l79.605-43.052l5.711,10.561L246,91.896z M234,280V162h-69v-26.298 l-22.037,11.918l-5.711-10.561l42.595-23.036l-4.993-9.342l-44.037,23.683c-1.978,1.066-4.124,1.578-6.248,1.578 c-2.943,0-5.844-0.984-8.199-2.846L110.743,177h45.507c10.908,0,19.75,8.842,19.75,19.75V280H234z"></path>
                      </g>
                    </svg>
                    Shkolla
                  </h4>
                  <p className="text-gray-600 text-sm ml-7 font-medium">{data.school}</p>
                </div>
              )}

              {/* City */}
              {data.city_location && (
                <div className="flex-none">
                  <h4 className="text-lg font-black mb-1 text-black/20 animate-fade-in flex items-center gap-2" style={{
                    WebkitTextStroke: '0.5px rgba(0,0,0,0.08)'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2 21.25C1.58579 21.25 1.25 21.5858 1.25 22C1.25 22.4142 1.58579 22.75 2 22.75H22C22.4142 22.75 22.75 22.4142 22.75 22C22.75 21.5858 22.4142 21.25 22 21.25H21H18.5H17V16C17 14.1144 17 13.1716 16.4142 12.5858C15.8284 12 14.8856 12 13 12H11C9.11438 12 8.17157 12 7.58579 12.5858C7 13.1716 7 14.1144 7 16V21.25H5.5H3H2ZM9.25 15C9.25 14.5858 9.58579 14.25 10 14.25H14C14.4142 14.25 14.75 14.5858 14.75 15C14.75 15.4142 14.4142 15.75 14 15.75H10C9.58579 15.75 9.25 15.4142 9.25 15ZM9.25 18C9.25 17.5858 9.58579 17.25 10 17.25H14C14.4142 17.25 14.75 17.5858 14.75 18C14.75 18.4142 14.4142 18.75 14 18.75H10C9.58579 18.75 9.25 18.4142 9.25 18Z" fill="#1C274C"></path>
                        <g opacity="0.5">
                          <path d="M8 4.5C8.94281 4.5 9.41421 4.5 9.70711 4.79289C10 5.08579 10 5.55719 10 6.5L9.99999 8.29243C10.1568 8.36863 10.2931 8.46469 10.4142 8.58579C10.8183 8.98987 10.9436 9.56385 10.9825 10.5V12C9.10855 12 8.16976 12.0018 7.58579 12.5858C7 13.1716 7 14.1144 7 16V21.25H3V12C3 10.1144 3 9.17157 3.58579 8.58579C3.70688 8.46469 3.84322 8.36864 4 8.29243V6.5C4 5.55719 4 5.08579 4.29289 4.79289C4.58579 4.5 5.05719 4.5 6 4.5H6.25V3C6.25 2.58579 6.58579 2.25 7 2.25C7.41421 2.25 7.75 2.58579 7.75 3V4.5H8Z" fill="#1C274C"></path>
                          <path d="M20.6439 5.24676C20.2877 4.73284 19.66 4.49743 18.4045 4.02663C15.9493 3.10592 14.7216 2.64555 13.8608 3.2421C13 3.83864 13 5.14974 13 7.77195V12C14.8856 12 15.8284 12 16.4142 12.5858C17 13.1716 17 14.1144 17 16V21.25H21V7.77195C21 6.4311 21 5.76068 20.6439 5.24676Z" fill="#1C274C"></path>
                        </g>
                      </g>
                    </svg>
                    Qyteti ku jetoni
                  </h4>
                  <p className="text-gray-600 text-sm ml-7 font-medium">{data.city_location}</p>
                </div>
              )}
            </div>

            {/* Favorite Quote - Full width */}
            {data.favorite_quote && (
              <div className="w-full">
                <h4 className="text-lg font-black mb-1 text-black/20 animate-fade-in flex items-center gap-2" style={{
                  WebkitTextStroke: '0.5px rgba(0,0,0,0.08)'
                }}>
                  <Quote className="w-5 h-5 text-gray-600" />
                    Citati i Preferuar
                </h4>
                <p className="text-gray-600 italic text-sm ml-7 font-medium">"{data.favorite_quote}"</p>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6">

      <div className="space-y-6">

        {/* School */}
        <div className="p-4 rounded-lg">
          <div className="mb-2">
            <Label htmlFor="intro-school">School</Label>
          </div>
          <Input
            id="intro-school"
            value={data.school || ''}
            onChange={e => setDataAndBroadcast({ school: e.target.value })}
            placeholder="Enter your school name"
            className={smokeFocusStyles}
          />
        </div>

        {/* City you live */}
        <div className="p-4 rounded-lg">
          <div className="mb-2">
            <Label htmlFor="intro-cityLocation">City you live</Label>
          </div>
          <Input
            id="intro-cityLocation"
            value={data.city_location || ''}
            onChange={e => setDataAndBroadcast({ city_location: e.target.value })}
            placeholder="Enter the city where you live"
            className={smokeFocusStyles}
          />
        </div>

        {/* Profession / Job Title */}
        <div className="p-4 rounded-lg">
          <div className="mb-2">
            <Label htmlFor="profession">Profession / Job Title</Label>
          </div>
          <Input
            id="profession"
            value={data.profession || ''}
            onChange={e => setDataAndBroadcast({ profession: e.target.value })}
            placeholder="Software Engineer, Teacher, etc."
            className={smokeFocusStyles}
          />
        </div>



        {/* Favorite Quote */}
        <div className="p-4 rounded-lg">
          <div className="mb-2">
            <Label htmlFor="quote">Favorite Quote</Label>
          </div>
          <Input
            id="quote"
            value={data.favorite_quote || ''}
            onChange={e => setDataAndBroadcast({ favorite_quote: e.target.value })}
            placeholder="Enter your favorite quote..."
            className={smokeFocusStyles}
          />
        </div>

        {/* Auto-save indicator */}
        {saving && (
          <div className="flex justify-center pt-4">
            <span className="text-sm text-gray-500">Saving changes...</span>
          </div>
        )}
      </div>
    </Card>
  );
};