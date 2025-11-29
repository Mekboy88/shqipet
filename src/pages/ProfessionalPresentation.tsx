import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MinimalNavbar from "@/components/navbar/MinimalNavbar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { mediaService } from "@/services/media/MediaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import UploadAnimation from "@/components/ui/UploadAnimation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings, FileText, Linkedin, Github, Facebook, Instagram, Globe, Mail, Phone, ArrowRight, Wand2, ExternalLink, User as UserIcon, Move, Save, Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Highlighter, X, Camera, Briefcase, RotateCcw, Eye, Download, Edit, ChevronDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { usePhotoEditor } from "@/hooks/usePhotoEditor";
import { PhotoEditor } from "@/components/profile/PhotoEditor";
import { useGroupDrag } from "@/hooks/useGroupDrag";

// Resolve Wasabi storage keys to proxy URLs
const resolveMediaUrl = (value: string | null | undefined) => {
  if (!value) return '';
  const v = String(value);
  if (v.startsWith('http') || v.startsWith('blob:') || v.startsWith('data:')) return v;
  return `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wasabi-proxy?key=${encodeURIComponent(v)}`;
};

// ===== Reusable: Editable & Draggable (fixed caret + sticky toolbar) =====
const FONT_OPTIONS = ["system-ui", "Inter, system-ui, sans-serif", "Georgia, serif", "Times New Roman, Times, serif", "Garamond, serif", "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif", "Montserrat, system-ui, sans-serif", "Poppins, system-ui, sans-serif", "Roboto, system-ui, sans-serif"];
type StyleConfig = {
  fontFamily?: string;
  fontSize?: number; // px
  color?: string;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  textDecoration?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number; // unitless
  letterSpacing?: number; // px
  backgroundColor?: string;
};
type EditableProps = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  styleConfig?: StyleConfig;
  setStyleConfig?: (s: StyleConfig) => void;
  editMode: boolean;
  draggable?: boolean;
};
function EditableText({
  id,
  value,
  onChange,
  className,
  styleConfig,
  setStyleConfig,
  editMode,
  draggable
}: EditableProps) {
  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [local, setLocal] = useState(value);
  const [styles, setStyles] = useState<StyleConfig>(styleConfig || {});
  const ref = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Range | null>(null);

  // keep local in sync only when not actively editing to avoid caret jumps
  useEffect(() => {
    if (!isEditing) setLocal(value);
  }, [value, isEditing]);
  useEffect(() => setStyles(styleConfig || {}), [styleConfig]);

  // preserve caret before re-renders caused by style changes
  const saveSelection = () => {
    const sel = window.getSelection?.();
    if (sel && sel.rangeCount > 0) selectionRef.current = sel.getRangeAt(0);
  };
  const restoreSelection = () => {
    const sel = window.getSelection?.();
    if (sel && selectionRef.current) {
      sel.removeAllRanges();
      sel.addRange(selectionRef.current);
    }
  };
  const applySave = () => {
    onChange(local);
    setStyleConfig?.(styles);
  };
  const resetStyles = () => setStyles({});
  const toolbar = <div className="absolute -top-12 left-0 z-50 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-1 shadow-sm" onMouseDown={e => e.stopPropagation()} onMouseEnter={() => setHover(true)}>
      <Type className="h-4 w-4 text-neutral-500" />
      <select className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs" value={styles.fontFamily || FONT_OPTIONS[0]} onChange={e => {
      saveSelection();
      setStyles({
        ...styles,
        fontFamily: e.target.value
      });
      setTimeout(restoreSelection, 0);
    }}>
        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f.split(",")[0]}</option>)}
      </select>
      <input type="number" className="w-16 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs" value={styles.fontSize ?? 14} min={10} max={96} onChange={e => {
      saveSelection();
      setStyles({
        ...styles,
        fontSize: Number(e.target.value)
      });
      setTimeout(restoreSelection, 0);
    }} title="Font size (px)" />
      <input type="color" className="h-7 w-7 cursor-pointer rounded-md border border-neutral-200" value={styles.color || "#111111"} onChange={e => {
      saveSelection();
      setStyles({
        ...styles,
        color: e.target.value
      });
      setTimeout(restoreSelection, 0);
    }} title="Text color" />
      <input type="color" className="h-7 w-7 cursor-pointer rounded-md border border-neutral-200" value={styles.backgroundColor || "#ffffff"} onChange={e => {
      saveSelection();
      setStyles({
        ...styles,
        backgroundColor: e.target.value
      });
      setTimeout(restoreSelection, 0);
    }} title="Background highlight" />
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        fontWeight: styles.fontWeight ? 400 : 700
      });
      setTimeout(restoreSelection, 0);
    }} title="Bold"><Bold className="h-4 w-4" /></button>
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        fontStyle: styles.fontStyle === "italic" ? "normal" : "italic"
      });
      setTimeout(restoreSelection, 0);
    }} title="Italic"><Italic className="h-4 w-4" /></button>
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        textDecoration: styles.textDecoration === "underline" ? "none" : "underline"
      });
      setTimeout(restoreSelection, 0);
    }} title="Underline"><Underline className="h-4 w-4" /></button>
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        textAlign: "left"
      });
      setTimeout(restoreSelection, 0);
    }} title="Align left"><AlignLeft className="h-4 w-4" /></button>
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        textAlign: "center"
      });
      setTimeout(restoreSelection, 0);
    }} title="Align center"><AlignCenter className="h-4 w-4" /></button>
      <button className="rounded border border-neutral-200 p-1" onClick={() => {
      saveSelection();
      setStyles({
        ...styles,
        textAlign: "right"
      });
      setTimeout(restoreSelection, 0);
    }} title="Align right"><AlignRight className="h-4 w-4" /></button>
      <div className="flex items-center gap-1 text-xs text-neutral-600">
        <Highlighter className="h-4 w-4" />
        <input type="number" className="w-14 rounded-md border border-neutral-200 bg-white px-1 py-0.5" value={styles.lineHeight ?? 1.4} step={0.05} min={1} max={3} onChange={e => {
        saveSelection();
        setStyles({
          ...styles,
          lineHeight: Number(e.target.value)
        });
        setTimeout(restoreSelection, 0);
      }} title="Line height" />
        <input type="number" className="w-14 rounded-md border border-neutral-200 bg-white px-1 py-0.5" value={styles.letterSpacing ?? 0} step={0.2} min={-1} max={5} onChange={e => {
        saveSelection();
        setStyles({
          ...styles,
          letterSpacing: Number(e.target.value)
        });
        setTimeout(restoreSelection, 0);
      }} title="Letter spacing (px)" />
      </div>
      <Button size="sm" variant="outline" className="h-7 gap-1 px-2" onClick={applySave}>
        <Save className="h-3.5 w-3.5" /> Save
      </Button>
      <Button size="sm" variant="ghost" className="h-7 gap-1 px-2" onClick={resetStyles} title="Reset styles">
        <X className="h-3.5 w-3.5" /> Reset
      </Button>
    </div>;
  const style: React.CSSProperties = {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    color: styles.color,
    fontWeight: styles.fontWeight,
    fontStyle: styles.fontStyle,
    textDecoration: styles.textDecoration,
    textAlign: styles.textAlign,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing ? `${styles.letterSpacing}px` : undefined,
    backgroundColor: styles.backgroundColor
  };
  const inner = <div ref={ref} className={(className || "") + (editMode ? " outline-none hover:bg-[var(--accent-10)]/40 focus:bg-[var(--accent-10)]/60 rounded" : "")} style={style} contentEditable={editMode} suppressContentEditableWarning onFocus={() => setIsEditing(true)} onBlur={() => {
    setIsEditing(false);
    applySave();
  }} onInput={e => setLocal((e.target as HTMLDivElement).innerText)}>
      {local}
    </div>;
  if (!editMode) return inner;
  return <motion.div drag={draggable && !isEditing} dragMomentum={false} className="relative cursor-text" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {(hover || isEditing) && toolbar}
      {inner}
    </motion.div>;
}

// ===== Helper section (borderless) =====
const Section = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => <section className="space-y-2">
    <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    <div className="text-[15px] leading-relaxed text-neutral-800">{children}</div>
  </section>;
const IconMap: Record<string, any> = {
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  instagram: Instagram,
  website: Globe
};
const SocialIcon = ({
  href,
  label,
  icon
}: {
  href: string;
  label: string;
  icon?: string;
}) => {
  const Icon = icon && IconMap[icon.toLowerCase()] ? IconMap[icon.toLowerCase()] : Globe;
  return <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="inline-flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-80">
            <Icon className="h-5 w-5" />
          </a>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>;
};

// ===== Main component =====
export default function ProfessionalPresentation() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  const [presentationUserId, setPresentationUserId] = useState<string | null>(null);

  // SECURITY: Only allow viewing own presentation (no uid param support)
  useEffect(() => {
    // Always use current logged-in user - no viewing others' pages
    if (user) {
      setIsOwner(true);
      setPresentationUserId(user.id);
    } else {
      setIsOwner(false);
      setPresentationUserId(null);
    }
  }, [user]);

  // Text group drag hook
  const textDrag = useGroupDrag({ userId: user?.id });

  // Blob URL lifecycle management - track current blob to prevent memory leaks
  const currentBlobRef = useRef<string | null>(null);

  // Editable state - Start with cached data for instant display
  const [profile, setProfile] = useState(() => {
    // Load cached avatar from localStorage for instant display
    let cachedAvatarUrl = "";
    try {
      const metaStr = localStorage.getItem('pp:avatar_meta');
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        // Only use cache if it's for the current user AND it's an http(s) URL
        // CRITICAL: Never load blob/data URLs from cache (they're invalid after reload)
        if (meta.userId === user?.id) {
          const cached = localStorage.getItem('pp:last:avatar_url') || "";
          if (/^https?:/.test(cached)) {
            cachedAvatarUrl = cached;
          }
        }
      }
    } catch {}
    
    return {
      name: "John Smith",
      role: "Professional Title",
      entry: "",
      quick: "",
      email: "",
      phone: "",
      website: "",
      cvUrl: "",
      avatarUrl: cachedAvatarUrl
    };
  });
  const [navLabels, setNavLabels] = useState({
    home: "Home",
    skills: "Skills",
    portfolio: "Portfolio",
    blogs: "Blogs",
    contact: "Contact"
  });

  // Per-text style configs
  const [styles, setStyles] = useState<Record<string, StyleConfig>>({});
  const setStyle = (k: string, s: StyleConfig) => setStyles(prev => ({
    ...prev,
    [k]: s
  }));

  // Dynamic socials - Start with empty array (no sample data)
  const [socials, setSocials] = useState<Array<{
    label: string;
    url: string;
    icon?: string;
  }>>([]);
  const [sections, setSections] = useState({
    home: true,
    skills: true,
    portfolio: true,
    blogs: true,
    contact: true,
    cv: true
  });
  const [editMode, setEditMode] = useState(false); // Default OFF
  const [activeTab, setActiveTab] = useState("home"); // Track active tab for navigation

  const [layout, setLayout] = useState({
    showRightSidebar: true,
    leftColFraction: "1.1fr",
    middleColFraction: "1.4fr",
    rightColFraction: "0.5fr",
    noiseOpacity: 0.06,
    enableAnimations: true,
    fullBleedPhoto: false,
    photoHeight: 420
  });
  const [seo, setSeo] = useState({
    pageTitle: "Professional Presentation",
    description: "Professional presentation page",
    openInNewWindow: true
  });
  const [accent, setAccent] = useState("#2AA1FF");
  const accentStyle = useMemo(() => ({
    ["--accent"]: accent,
    ["--accent-10"]: accent + "19",
    ["--accent-20"]: accent + "33"
  }) as React.CSSProperties, [accent]);

  // Hire button settings - Start disabled to prevent flicker
  const [hireButton, setHireButton] = useState({
    enabled: false,
    text: "Hire Me",
    url: "",
    email: ""
  });
  const [hireButtonLoaded, setHireButtonLoaded] = useState(false);
  const [isSavingHireButton, setIsSavingHireButton] = useState(false);
  const lastAppliedKeyRef = useRef<string | null>(null);
  const lastLocalWriteAtRef = useRef<number>(0);

  // ---- Self tests (lightweight) ----
  useEffect(() => {
    const keys = ["home", "skills", "portfolio", "blogs", "contact"] as const;
    keys.forEach(k => console.assert(typeof (navLabels as any)[k] === "string", `[SelfTest] nav label ${k} should be string`));
    console.assert(typeof seo.pageTitle === "string" && seo.pageTitle.length > 0, "[SelfTest] pageTitle should be non-empty string");
  }, []);

  // Load edit mode, hire button, avatar, and user's real name from database
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        // Fetch user's real name from profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .maybeSingle();

        // Set the user's real name
        if (profileData) {
          const fullName = [profileData.first_name, profileData.last_name].filter(Boolean).join(' ').trim();
          if (fullName) {
            setProfile(prev => ({
              ...prev,
              name: fullName
            }));
          }
        }

        const {
          data,
          error
        } = await supabase.from('professional_presentations').select('edit_mode, hire_button_enabled, hire_button_text, hire_button_url, hire_button_email, avatar_url, name, updated_at').eq('user_id', user.id).maybeSingle();
        if (data && !error) {
          console.log('📊 Loaded professional presentation data:', data);
          setEditMode(data.edit_mode || false);
          setHireButton({
            enabled: data.hire_button_enabled === true,
            text: data.hire_button_text || "Hire Me",
            url: data.hire_button_url || "",
            email: data.hire_button_email || ""
          });
          setHireButtonLoaded(true);

          // Load saved name if available (overrides profile name)
          if (data.name) {
            setProfile(prev => ({
              ...prev,
              name: data.name
            }));
          }

          // Load professional presentation avatar (instant from cache, update only if changed)
          if (data.avatar_url) {
            const keyOrUrl = String(data.avatar_url);
            const rev = data.updated_at || Date.now().toString();
            console.log('🖼️ Loading professional avatar (instant):', {
              keyOrUrl,
              rev
            });

            // For full URLs or local previews, apply directly only if different
            if (/^(https?:|blob:|data:)/.test(keyOrUrl)) {
              setProfile(prev => {
                // Only update if URL actually changed
                if (prev.avatarUrl === keyOrUrl) return prev;
                
                // CRITICAL: Only store http(s) URLs in localStorage (blob/data are session-only)
                const isHttp = /^https?:/.test(keyOrUrl);
                if (isHttp) {
                  try {
                    localStorage.setItem('pp:last:avatar_url', keyOrUrl);
                    localStorage.setItem('pp:avatar_meta', JSON.stringify({
                      url: keyOrUrl,
                      rev,
                      userId: user.id
                    }));
                  } catch {}
                }
                
                return {
                  ...prev,
                  avatarUrl: keyOrUrl
                };
              });
            } else {
              // Check if we have valid cache before resolving URL
              let cachedUrl = "";
              let cachedRev = "";
              try {
                const metaStr = localStorage.getItem('pp:avatar_meta');
                if (metaStr) {
                  const meta = JSON.parse(metaStr);
                  if (meta.userId === user.id && meta.rev === rev) {
                    cachedUrl = localStorage.getItem('pp:last:avatar_url') || "";
                    cachedRev = meta.rev;
                  }
                }
              } catch {}
              
              // If cache is valid and matches current revision, skip URL resolution
              if (cachedUrl && cachedRev === rev && /^https?:/.test(cachedUrl)) {
                console.log('✅ Using valid cache, skipping URL resolution');
                // Photo is already displayed from initial cache load, no action needed
                return;
              }
              
              console.log('🔄 Cache invalid or outdated, resolving URL');
              (async () => {
                try {
                  const fresh = await mediaService.getUrl(keyOrUrl);
                  
                  // CRITICAL: Only add cache-busting query params to http(s) URLs, NOT blob/data
                  const isBlob = /^(blob:|data:)/.test(fresh);
                  const versioned = isBlob ? fresh : fresh + (fresh.includes('?') ? '&' : '?') + 'rev=' + encodeURIComponent(rev);
                  
                  // Check if URL changed before preloading and updating
                  setProfile(prev => {
                    if (prev.avatarUrl === versioned) return prev;
                    
                    // Preload in background after state update for instant display
                    if (!isBlob) {
                      mediaService.preloadImage(versioned).catch(() => {});
                    }
                    
                    // CRITICAL: Only store http(s) URLs in localStorage
                    if (!isBlob) {
                      try {
                        localStorage.setItem('pp:last:avatar_url', versioned);
                        localStorage.setItem('pp:avatar_meta', JSON.stringify({
                          url: versioned,
                          rev,
                          userId: user?.id
                        }));
                      } catch {}
                    }
                    
                    return {
                      ...prev,
                      avatarUrl: versioned
                    };
                  });
                } catch (e) {
                  console.warn('⚠️ Failed to resolve avatar, using cached version', e);
                  // Cache fallback is already in state initialization
                }
              })();
            }
          } else {
            console.log('⚠️ No avatar_url found in professional_presentations');
          }
        } else if (error) {
          console.error('❌ Error loading professional presentation data:', error);
          setHireButtonLoaded(true); // Mark as loaded even on error
        } else {
          console.log('ℹ️ No professional presentation data found for user');
          setHireButtonLoaded(true); // Mark as loaded when no data exists
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
      }
    };
    loadData();

    // Cleanup: Revoke blob URL on unmount to prevent memory leaks
    return () => {
      if (currentBlobRef.current) {
        try {
          URL.revokeObjectURL(currentBlobRef.current);
        } catch {}
        currentBlobRef.current = null;
      }
    };
  }, [user]);

  // Set up realtime subscription for INSTANT updates across devices (zero delay)
  // SECURITY: RLS ensures only own data is received
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase.channel('professional-presentation-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'professional_presentations',
      filter: `user_id=eq.${user.id}`
    }, async payload => {
      console.log('🔄 Realtime update received:', payload);
      if (payload.new && typeof payload.new === 'object') {
        const newData = payload.new as any;
        const oldData = (payload as any).old as any;
        const commitTimestamp = (payload as any).commit_timestamp;

        // Improved deduplication: check both avatar_url AND commit_timestamp
        if (oldData?.avatar_url === newData.avatar_url && commitTimestamp === lastAppliedKeyRef.current) {
          console.log('⏭️ Skipping unchanged update');
          return;
        }
        if (newData.avatar_url) {
          const keyOrUrl = String(newData.avatar_url);
          lastAppliedKeyRef.current = commitTimestamp;

          // If this is a local preview (blob/data), apply only if changed
          if (/^(blob:|data:)/.test(keyOrUrl)) {
            setProfile(prev => {
              // Only update if URL actually changed
              if (prev.avatarUrl === keyOrUrl) return prev;
              
              // CRITICAL: NEVER store blob/data URLs in localStorage (session-only)
              // They are invalid after page reload
              
              return {
                ...prev,
                avatarUrl: keyOrUrl
              };
            });
          } else {
            try {
              // CRITICAL: Clear ALL caches before fetching to ensure fresh data
              console.log('🧹 Clearing cache for:', keyOrUrl);
              try {
                mediaService.clearCache?.(keyOrUrl);
                mediaService.clearAllCaches?.();
              } catch {}

              // Force fresh fetch with proxy blob (bypasses all caches)
              const fresh = await mediaService.getProxyBlob(keyOrUrl);
              
              // CRITICAL: Only add cache-busting to http(s), NOT blob URLs
              const isBlob = /^(blob:|data:)/.test(fresh);
              const versioned = isBlob ? fresh : fresh + (fresh.includes('?') ? '&' : '?') + 't=' + Date.now();

              setProfile(prev => {
                // Only update if URL actually changed
                if (prev.avatarUrl === versioned) return prev;
                
                // Blob URL lifecycle: revoke old blob before setting new one
                if (isBlob) {
                  if (currentBlobRef.current && currentBlobRef.current !== versioned) {
                    try {
                      URL.revokeObjectURL(currentBlobRef.current);
                    } catch {}
                  }
                  currentBlobRef.current = versioned;
                } else {
                  // Preload http(s) URLs in background for smooth transition
                  mediaService.preloadImage(versioned).catch(() => {});
                }
                
                // CRITICAL: Only store http(s) URLs in localStorage
                if (!isBlob) {
                  try {
                    localStorage.setItem('pp:last:avatar_url', versioned);
                    localStorage.setItem('pp:avatar_meta', JSON.stringify({
                      url: versioned,
                      rev: commitTimestamp,
                      userId: user.id
                    }));
                  } catch {}
                }
                
                console.log('✅ Applied fresh avatar URL instantly:', versioned);
                
                return {
                  ...prev,
                  avatarUrl: versioned
                };
              });
            } catch (err) {
              console.error('⚠️ Failed to resolve/preload avatar URL:', err);
            }
          }
        }

        // Update hire button - apply only if newer than our last local write and not in saving window
        const remoteTs = Date.parse(newData.updated_at || commitTimestamp || '');
        if (Number.isFinite(remoteTs)) {
          if (remoteTs <= lastLocalWriteAtRef.current) {
            console.log('⏭️ Skipping stale hire button update (older than local write)');
            return;
          }
        }
        
        // Check for actual changes to prevent redundant updates
        const hasChanges = 
          newData.hire_button_enabled !== hireButton.enabled ||
          newData.hire_button_text !== hireButton.text ||
          newData.hire_button_url !== hireButton.url ||
          newData.hire_button_email !== hireButton.email;
        
        if (!hasChanges) {
          console.log('⏭️ Skipping realtime update - no changes detected');
          return;
        }
        
        if (!isSavingHireButton) {
          console.log('📥 Applying hire button update from realtime:', {
            enabled: newData.hire_button_enabled,
            text: newData.hire_button_text
          });
          setHireButton({
            enabled: newData.hire_button_enabled === true,
            text: newData.hire_button_text || "Hire Me",
            url: newData.hire_button_url || "",
            email: newData.hire_button_email || ""
          });
          
          // Also sync name if changed
          if (newData.name) {
            setProfile(prev => ({
              ...prev,
              name: newData.name
            }));
          }
        } else {
          console.log('⏭️ Skipping hire button realtime update (currently saving)');
        }
      }
    }).subscribe(status => {
      console.log('📡 Realtime subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time sync ACTIVE - photos will update instantly!');
      }
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Track previous values to detect actual changes
  const prevHireButtonRef = useRef<typeof hireButton | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save function with debounce to prevent flickering
  const saveHireButtonData = useCallback(async () => {
    if (!user || !isOwner || !hireButtonLoaded) return;
    
    // Check if there's an actual change
    const prev = prevHireButtonRef.current;
    if (prev && 
        prev.enabled === hireButton.enabled &&
        prev.text === hireButton.text &&
        prev.url === hireButton.url &&
        prev.email === hireButton.email) {
      console.log('⏭️ No changes detected, skipping save');
      return;
    }
    
    // Set flag and timestamp to prevent realtime overwriting this change
    setIsSavingHireButton(true);
    lastLocalWriteAtRef.current = Date.now();
    console.log('💾 Saving hire button state:', hireButton);
    
    try {
      const { error } = await supabase.from('professional_presentations').upsert({
        user_id: user.id,
        edit_mode: editMode,
        hire_button_enabled: hireButton.enabled,
        hire_button_text: hireButton.text,
        hire_button_url: hireButton.url,
        hire_button_email: hireButton.email,
        name: profile.name,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      
      if (error) {
        console.error('❌ Error saving hire button data:', error);
        toast.error('Failed to save hire button settings');
        // Revert on error - fetch latest state
        const { data } = await supabase
          .from('professional_presentations')
          .select('hire_button_enabled, hire_button_text, hire_button_url, hire_button_email')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data) {
          setHireButton({
            enabled: data.hire_button_enabled === true,
            text: data.hire_button_text || "Hire Me",
            url: data.hire_button_url || "",
            email: data.hire_button_email || ""
          });
        }
      } else {
        console.log('✅ Hire button data saved successfully');
        // Update previous value only on successful save
        prevHireButtonRef.current = { ...hireButton };
      }
    } catch (error) {
      console.error('❌ Exception saving data:', error);
      toast.error('Failed to save hire button settings');
    } finally {
      // Clear flag after a short delay to allow realtime to process
      setTimeout(() => {
        setIsSavingHireButton(false);
        console.log('🔓 Hire button save complete, realtime updates re-enabled');
      }, 300);
    }
  }, [user, isOwner, hireButtonLoaded, hireButton, editMode, profile.name]);

  // Debounced save on hire button changes
  useEffect(() => {
    if (!hireButtonLoaded || !isOwner) return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout for debounced save (only after user stops typing)
    saveTimeoutRef.current = setTimeout(() => {
      saveHireButtonData();
    }, 800);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [hireButton, hireButtonLoaded, isOwner, saveHireButtonData]);

  // Persist to localStorage so Save keeps edits
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ppd-state");
      if (raw) {
        const parsed = JSON.parse(raw);
        // CRITICAL: Preserve avatarUrl from cache initialization (don't overwrite with old state)
        setProfile(prev => ({
          ...prev,
          ...(parsed.profile ?? {}),
          avatarUrl: prev.avatarUrl // Keep the cached avatarUrl
        }));
        setNavLabels(parsed.navLabels ?? navLabels);
        setStyles(parsed.styles ?? styles);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveAll = () => {
    const data = {
      profile,
      navLabels,
      styles
    };
    localStorage.setItem("ppd-state", JSON.stringify(data));
  };

  // Professional Presentation Controls - Navigation buttons in center of navbar
  const professionalControls = isOwner || !isOwner ? (
    <div className="flex items-center gap-2">
      {/* Back to Profile Arrow Button */}
      <button 
        onClick={() => navigate('/profile')}
        className="rounded-xl p-2 text-sm transition-all hover:bg-gray-100"
        aria-label="Back to Profile"
      >
        ←
      </button>
      {sections.home && (
        <button 
          onClick={() => setActiveTab("home")}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            activeTab === "home" 
              ? "bg-gradient-to-r from-red-500/10 to-gray-800/10 border border-red-200" 
              : "hover:bg-gray-100"
          }`}
        >
          {navLabels.home}
        </button>
      )}
      {sections.skills && (
        <button 
          onClick={() => setActiveTab("skills")}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            activeTab === "skills" 
              ? "bg-gradient-to-r from-red-500/10 to-gray-800/10 border border-red-200" 
              : "hover:bg-gray-100"
          }`}
        >
          {navLabels.skills}
        </button>
      )}
      {sections.portfolio && (
        <button 
          onClick={() => setActiveTab("portfolio")}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            activeTab === "portfolio" 
              ? "bg-gradient-to-r from-red-500/10 to-gray-800/10 border border-red-200" 
              : "hover:bg-gray-100"
          }`}
        >
          {navLabels.portfolio}
        </button>
      )}
      {sections.blogs && (
        <button 
          onClick={() => setActiveTab("blogs")}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            activeTab === "blogs" 
              ? "bg-gradient-to-r from-red-500/10 to-gray-800/10 border border-red-200" 
              : "hover:bg-gray-100"
          }`}
        >
          {navLabels.blogs}
        </button>
      )}
      {sections.contact && (
        <button 
          onClick={() => setActiveTab("contact")}
          className={`rounded-xl px-4 py-2 text-sm transition-all ${
            activeTab === "contact" 
              ? "bg-gradient-to-r from-red-500/10 to-gray-800/10 border border-red-200" 
              : "hover:bg-gray-100"
          }`}
        >
          {navLabels.contact}
        </button>
      )}
      {sections.cv && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 h-8 transition-all hover:shadow-md">
            <svg fill="currentColor" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 491.52 491.52" xmlSpace="preserve" className="h-3.5 w-3.5 text-gray-600"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="334.879,7.93 334.879,94.307 421.256,94.307 "></polygon> </g> </g> <g> <g> <path d="M224.046,71.948l-14.926-5.241c-1.03-0.349-2.16-0.356-3.206,0.046c-3.228,1.223-7.51,2.818-10.204,3.677 c-2.028,0.65-4.126,0.976-6.255,0.976h-13.525c-0.73,0.177-2.049,0.623-3.369,1.668c-0.128,0.102-0.244,0.286-0.372,0.401 c-0.528,0.468-1.061,0.965-1.534,1.662c-0.591,0.872-1.113,1.936-1.483,3.244v21.577v5.21c0,0,0.643,17.783,11.451,24.937 c0.123,0.084,0.212,0.151,0.331,0.232c0.01,0.006,0.022,0.009,0.032,0.016c0.079,0.053,0.153,0.114,0.231,0.168 c1.191,0.823,2.191,1.546,3.121,2.278c6.744,5.295,11.876,7.208,13.123,7.169c0.48-0.008,0.882,0.008,1.316,0.078 c0.433,0.034,5.272,0.422,11.006-3.567c0.821-0.573,1.661-1.231,2.511-1.999c1.827-1.65,3.762-3.151,5.775-4.545 c0.061-0.038,0.634-0.441,0.697-0.48c2.789-1.879,9.641-8.257,11.234-25.382V78.351C229.767,77.351,228.629,73.636,224.046,71.948 z"></path> </g> </g> <g> <g> <polygon points="182.486,161.503 175.707,156.974 183.725,171.556 185.343,169.342 185.374,169.303 186.283,168.068 188.267,165.368 "></polygon> </g> </g> <g> <g> <path d="M231.121,52.818c-2.315-0.558-4.266-2.129-5.295-4.274c-1.03-2.152-1.045-4.645-0.031-6.805 c0.023-0.061,0.055-0.24,0.085-0.418c-0.17-0.015-0.488-0.116-0.983-0.24h-42.496c-11.342,0-20.593,9.143-20.764,20.446 c0.176-0.155,0.363-0.256,0.541-0.404c0.617-0.514,1.238-0.961,1.871-1.395c0.428-0.293,0.843-0.604,1.273-0.861 c0.686-0.414,1.359-0.751,2.04-1.08c0.376-0.182,0.749-0.393,1.118-0.55c0.753-0.32,1.468-0.561,2.181-0.786 c0.273-0.086,0.559-0.207,0.824-0.281c0.956-0.263,1.86-0.454,2.67-0.559c0.333-0.038,0.674-0.062,1.015-0.062h14.284 c0.488,0,0.968-0.077,1.432-0.224c2.469-0.79,6.41-2.261,9.399-3.398c1.157-0.439,2.345-0.763,3.547-0.985 c0.304-0.056,0.613-0.051,0.918-0.093c0.907-0.126,1.814-0.24,2.726-0.244c0.035,0,0.067-0.009,0.101-0.009 c0.643,0,1.279,0.101,1.919,0.161c0.485,0.045,0.972,0.041,1.454,0.121c1.156,0.192,2.299,0.478,3.417,0.872l15.035,5.28 c1.571,0.577,2.982,1.273,4.289,2.034c0.488,0.285,0.896,0.612,1.349,0.915c0.762,0.515,1.519,1.026,2.187,1.587 c0.123,0.104,0.284,0.189,0.405,0.294v-2.044C237.346,58.508,236.007,53.987,231.121,52.818z"></path> </g> </g> <g> <g> <path d="M279.741,183.091c-0.658-3.948-3.398-7.247-7.169-8.609l-33.933-12.28l-15.329,27.881c-1.3,2.376-3.723,3.918-6.426,4.095 c-0.177,0.008-0.348,0.016-0.518,0.016c-2.516,0-4.893-1.193-6.388-3.236l-10.413-14.18l-1.037,1.405 c-0.006,0.012-0.017,0.025-0.025,0.037l0.002,0.002l-0.373,0.502l0.002,0.001l-8.973,12.233c-1.502,2.044-3.879,3.236-6.395,3.236 c-0.17,0-0.341-0.008-0.518-0.016c-2.694-0.177-5.126-1.719-6.426-4.095l-15.335-27.881l-33.935,12.28 c-3.762,1.362-6.51,4.661-7.169,8.609l-4.166,25.161l0.643,0.751h167.412l0.635-0.751L279.741,183.091z"></path> </g> </g> <g> <g> <path d="M326.95,110.162c-4.382,0-7.928-3.546-7.928-7.927V0H62.335v491.52h366.849V110.162H326.95z M99.577,205.659l4.166-25.154 c1.587-9.6,8.261-17.621,17.419-20.934l40.305-14.586c0,0,0.009,0,0.014-0.002c0,0,0.006-0.004,0.009-0.005l7.131-2.553v-1.603 c-14.614-12.649-15.284-34.489-15.306-35.483v-5.013c-0.166-2.562-0.913-4.707-2.245-6.36c-3.415-4.251-5.288-9.616-5.288-15.113 V61.837c0-20.191,16.428-36.612,36.619-36.612h43.347c0.511,0,1.014,0.047,1.509,0.147c7.758,1.502,11.288,5.574,12.891,8.718 c1.061,2.098,1.509,4.188,1.602,6.116c7.858,4.715,11.04,12.968,11.675,17.937c0.038,0.333,0.062,0.666,0.062,0.999V82.29 c0,3.569-1.007,7.076-2.919,10.142c-3.615,5.791-4.792,13.2-4.8,13.277c-0.02,0.134-0.099,0.239-0.126,0.369 c-2.046,19.233-9.383,29.254-15.133,34.253v2.094l7.123,2.551l0.008,0.005c0.005,0.002,0.009,0,0.015,0.002l40.305,14.586 c9.158,3.306,15.832,11.326,17.419,20.934l4.165,25.161c0.798,4.785-0.549,9.662-3.685,13.362 c-3.143,3.709-7.726,5.83-12.588,5.83H115.859c-4.862,0-9.453-2.129-12.596-5.83C100.127,215.321,98.78,210.451,99.577,205.659z M333.376,447.478H107.281c-4.382,0-7.928-3.546-7.928-7.928c0-4.381,3.546-7.927,7.928-7.927h226.095 c4.382,0,7.927,3.546,7.927,7.927C341.304,443.932,337.759,447.478,333.376,447.478z M384.241,405.184h-276.96 c-4.382,0-7.928-3.546-7.928-7.927c0-4.382,3.546-7.928,7.928-7.928h276.96c4.381,0,7.927,3.546,7.927,7.928 C392.168,401.638,388.622,405.184,384.241,405.184z M384.241,362.882h-276.96c-4.382,0-7.928-3.546-7.928-7.928 c0-4.381,3.546-7.927,7.928-7.927h276.96c4.381,0,7.927,3.546,7.927,7.927C392.168,359.336,388.622,362.882,384.241,362.882z M384.241,320.588h-276.96c-4.382,0-7.928-3.546-7.928-7.927c0-4.382,3.546-7.928,7.928-7.928h276.96 c4.381,0,7.927,3.546,7.927,7.928C392.168,317.042,388.622,320.588,384.241,320.588z M384.241,278.294h-276.96 c-4.382,0-7.928-3.546-7.928-7.928s3.546-7.928,7.928-7.928h276.96c4.381,0,7.927,3.546,7.927,7.928 S388.622,278.294,384.241,278.294z"></path> </g> </g> <g> <g> <polygon points="210.861,165.37 215.405,171.564 223.418,156.978 "></polygon> </g> </g> </g></svg>
            CV
            <ChevronDown className="h-3.5 w-3.5 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-48 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
        >
          <DropdownMenuItem 
            onClick={() => window.open(profile.cvUrl, '_blank')}
            className="gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-red-500/5 hover:to-gray-800/5 transition-all"
          >
            <svg fill="currentColor" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 425.966 425.966" xmlSpace="preserve" className="h-4 w-4 text-gray-600"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M425.393,205.3C425.354,205.195,425.375,205.253,425.393,205.3L425.393,205.3z"></path> <path d="M425.403,205.333c-1.389-3.895-3.212-7.675-5.085-11.356c-2.529-4.97-5.249-9.845-8.191-14.583 c-2.929-4.715-5.964-9.403-9.254-13.878c-13.897-18.908-29.971-36.023-48.347-50.655c-19.465-15.499-41.243-28.139-64.521-36.966 c-5.844-2.215-11.778-4.19-17.788-5.903c-5.96-1.699-11.993-3.004-18.055-4.28c-5.507-1.159-11.168-2.042-16.77-2.592 c-4.479-0.44-8.977-0.965-13.479-1.104c-7.158-0.222-14.249-0.425-21.414-0.067c-12.877,0.642-25.698,2.438-38.254,5.367 c-24.403,5.693-47.711,15.6-68.986,28.809c-21.177,13.148-40.348,29.514-56.814,48.218 c-10.606,12.048-20.058,25.041-28.099,38.932c-2.9,5.011-5.577,10.163-7.927,15.456c-1.629,3.671-3.343,7.362-1.845,11.414 c1.786,4.832,7.149,7.557,12.105,6.154c2.851-0.807,5.238-3.1,7.563-4.85c13.234-9.959,26.938-19.358,40.945-28.192 c20.817-13.13,42.582-24.942,65.493-34.007c15.428-6.104,31.404-10.931,47.712-13.968c6.822,3.821,11.44,11.106,11.44,19.481 c0,12.334-9.999,22.333-22.334,22.333c-6.481,0-12.315-2.764-16.396-7.174c-1.169,4.982-1.807,10.169-1.807,15.507 c0,37.373,30.297,67.669,67.669,67.669c37.373,0,67.669-30.296,67.669-67.669c0-18.875-7.735-35.938-20.201-48.212 c15.909,3.625,31.416,8.827,46.455,15.25c22.864,9.766,44.576,22.116,65.383,35.683c11.301,7.368,22.42,15.069,33.217,23.162 c3.367,2.522,6.614,5.641,11.146,5.343C423.158,218.228,427.584,211.478,425.403,205.333z"></path> <path d="M48.446,252.549c0,0,0.012,0.033,0.021,0.057C48.462,252.594,48.458,252.583,48.446,252.549z"></path> <path d="M368.134,242.505c-2.208,0.625-4.058,2.401-5.857,3.756c-10.251,7.716-20.866,14.994-31.715,21.838 c-16.125,10.171-32.984,19.32-50.73,26.343c-18.051,7.142-37.065,12.046-56.479,13.284c-11.719,0.749-23.572,0.198-35.167-1.647 c-16.534-2.631-32.552-7.559-47.938-14.131c-17.712-7.564-34.528-17.13-50.646-27.64c-8.752-5.707-17.365-11.673-25.728-17.939 c-2.608-1.955-5.124-4.369-8.634-4.139c-5.052,0.332-8.48,5.56-6.792,10.319c1.076,3.018,2.488,5.945,3.938,8.796 c1.96,3.85,4.066,7.625,6.345,11.296c2.269,3.652,4.62,7.283,7.168,10.75c10.766,14.646,23.215,27.901,37.449,39.235 c15.078,12.005,31.946,21.796,49.978,28.633c4.526,1.717,9.124,3.247,13.778,4.573c4.616,1.316,9.29,2.327,13.985,3.315 c4.265,0.896,8.65,1.582,12.989,2.007c3.471,0.341,6.952,0.748,10.439,0.855c5.546,0.172,11.038,0.328,16.586,0.052 c9.975-0.497,19.905-1.888,29.631-4.157c18.902-4.41,36.956-12.083,53.436-22.314c16.403-10.185,31.253-22.861,44.009-37.35 c8.215-9.332,15.537-19.396,21.765-30.156c2.247-3.882,4.32-7.872,6.14-11.972c1.263-2.844,2.591-5.703,1.431-8.841 C376.127,243.53,371.973,241.419,368.134,242.505z"></path> <path d="M48.466,252.606C48.475,252.63,48.473,252.626,48.466,252.606L48.466,252.606z"></path> </g> </g> </g></svg>
            <span>Look my CV</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              const link = document.createElement('a');
              link.href = profile.cvUrl;
              link.download = `${profile.name}_CV.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success('CV download started');
            }}
            className="gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-red-500/5 hover:to-gray-800/5 transition-all"
          >
            <svg fill="currentColor" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M27.4,2A1.58,1.58,0,0,1,29,3.6h0V14.8A3.89,3.89,0,0,0,33.2,19H44.4A1.58,1.58,0,0,1,46,20.6h0V45.2A4.87,4.87,0,0,1,41.2,50H10.8A4.87,4.87,0,0,1,6,45.2H6V6.8A4.87,4.87,0,0,1,10.8,2H27.4Zm8.79,38.66H26.8a.93.93,0,0,0-.93.93h0v2.65a.93.93,0,0,0,.93.93h9.39a.93.93,0,0,0,.93-.93h0V41.59a.93.93,0,0,0-.93-.93Zm0-10.79H15.73a.93.93,0,0,0-.93.93h0v6.32a.93.93,0,0,0,.93.93H36.19a.93.93,0,0,0,.93-.93h0V30.8a.93.93,0,0,0-.93-.93ZM25.12,22.8H15.73a.93.93,0,0,0-.93.93h0v2.65a.93.93,0,0,0,.93.93h9.39a.93.93,0,0,0,.93-.93h0V23.73a.93.93,0,0,0-.93-.93ZM34.2,2a1.4,1.4,0,0,1,.9.3h0L45.7,12.9a1.4,1.4,0,0,1,.3.9A1.2,1.2,0,0,1,44.9,15H36.4A3.5,3.5,0,0,1,33,11.6h0V3.1A1.2,1.2,0,0,1,34.2,2Z"></path></g></svg>
            <span>Download my CV</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('CV link copied to clipboard!');
            }}
            className="gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-red-500/5 hover:to-gray-800/5 transition-all"
          >
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" enableBackground="new 0 0 52 52" xmlSpace="preserve" className="h-4 w-4 text-gray-600"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M41,15.9h7.8c0.4,0,0.7-0.5,0.4-0.9l-8.3-8.3c-0.4-0.3-0.9,0-0.9,0.4v7.8C40,15.5,40.4,15.9,41,15.9z M49,19.9H38c-1.1,0-2-0.9-2-2v-11c0-0.6-0.4-1-1-1H21.5c-0.8,0-1.5,0.7-1.5,1.5v4c0,0.4,0.2,0.8,0.4,1.1l5.6,5.6 c0.8,0.8,1.4,1.9,1.6,3.1c0.2,1.6-0.3,3.1-1.4,4.3L24.6,27c-0.5,0.5-1,0.8-1.6,1.1c0.7,0.3,1.5,0.5,2.3,0.6 c2.6,0.2,4.7,2.4,4.7,5.1V36c0,1.4-0.7,2.8-1.7,3.7c-1,1-2.5,1.4-3.9,1.3c-1.1-0.1-2.1-0.3-3.2-0.5c-0.6-0.2-1.2,0.3-1.2,1v3.1 c0,0.8,0.7,1.5,1.5,1.5h27c0.8,0,1.5-0.7,1.5-1.5V21C50,20.4,49.6,20,49,19.9z M26,35.8v-2.2c0-0.6-0.5-1-1.1-1.1 c-5.4-0.5-9.9-5.1-9.9-10.8v-1.2c0-0.6,0.8-1,1.2-0.5l4,4c0.4,0.4,1.1,0.4,1.5,0l1.5-1.5c0.4-0.4,0.4-1.1,0-1.5l-9.7-9.7 c-0.4-0.4-1.1-0.4-1.5,0l-9.7,9.7c-0.4,0.4-0.4,1.1,0,1.5l1.5,1.5c0.4,0.4,1.1,0.5,1.5,0.1l4.2-4c0.5-0.5,1.4-0.1,1.4,0.5v1.9 c0,7.2,6.3,13.8,13.9,14.4C25.5,36.9,26,36.4,26,35.8z"></path> </g> </g></svg>
            <span>Share my CV</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      )}
    </div>
  ) : null;
  return <>
      {/* Minimal Navbar with Professional Controls (only visible to owner) */}
      <MinimalNavbar 
        professionalControls={professionalControls} 
        professionalEditMode={editMode}
        setProfessionalEditMode={setEditMode}
        professionalSections={sections}
        setProfessionalSections={setSections}
        professionalSocials={socials}
        setProfessionalSocials={setSocials}
        professionalHireButton={hireButton}
        setProfessionalHireButton={setHireButton}
        professionalProfile={{
          firstName: profile.name.split(' ')[0] || '',
          lastName: profile.name.split(' ').slice(1).join(' ') || '',
          presentation: profile.role,
          photoUrl: profile.avatarUrl,
          aboutMe: profile.entry,
          highlights: profile.quick ? [profile.quick] : []
        }}
        isOwner={isOwner}
        hireButtonLoaded={hireButtonLoaded}
        isSavingHireButton={isSavingHireButton}
      />
      
      <div className="min-h-screen w-full bg-white text-neutral-900 pt-14" style={accentStyle}>
        {/* Grid */}
        <main className="mx-auto grid max-w-7xl gap-10 px-6 py-10" style={{
        gridTemplateColumns: `${layout.leftColFraction} ${layout.middleColFraction} ${layout.showRightSidebar ? layout.rightColFraction : "0fr"}`
      }}>
        {/* LEFT: Photo strip + name/role/quick (borderless) */}
        <motion.section initial={{
          opacity: 0,
          y: layout.enableAnimations ? 12 : 0
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="col-span-1">
          <div className="-ml-96 mt-8">
            <PhotoStrip avatarUrl={profile.avatarUrl} accent={accent} height={layout.photoHeight || 420} userId={user?.id} editMode={editMode && isOwner} onPhotoUpdate={url => setProfile({
              ...profile,
              avatarUrl: url
            })} />
          </div>

          {/* Text Section - Draggable as a group */}
          <motion.div
            drag={editMode}
            dragMomentum={false}
            className={`mt-12 space-y-2 mx-0 px-0 rounded-lg -ml-56 scale-[1.2] origin-left my-[60px] relative ${editMode ? 'border-2 border-dashed border-blue-300 p-4 cursor-move hover:border-blue-500' : ''}`}
            onDragEnd={(e, info) => {
              if (editMode && user?.id) {
                const newTransform = {
                  translateX: textDrag.transform.translateX + info.offset.x,
                  translateY: textDrag.transform.translateY + info.offset.y,
                };
                // update local state immediately to avoid snap-back
                textDrag.setPosition(newTransform);
                // Auto-save on drag end
                supabase
                  .from('profiles')
                  .update({ photo_text_transform: newTransform })
                  .eq('id', user.id)
                  .then(() => {
                    localStorage.setItem(`photo-text-transform-${user.id}`, JSON.stringify(newTransform));
                    localStorage.setItem('photo-text-transform-last', JSON.stringify(newTransform));
                    toast.success('Position saved!');
                  })
                  .catch(() => toast.error('Failed to save position'));
              }
            }}
            style={{
              x: textDrag.transform.translateX,
              y: textDrag.transform.translateY,
              opacity: textDrag.isLoading && !textDrag.hadCache ? 0 : 1,
            }}
          >
            {/* Drag indicator */}
            {editMode && (
              <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                Drag to move
              </div>
            )}
            
            <EditableText id="name" value={profile.name} onChange={v => setProfile({
              ...profile,
              name: v
            })} className="text-2xl font-bold tracking-tight" styleConfig={styles.name} setStyleConfig={s => setStyle("name", s)} editMode={editMode} draggable />
            <EditableText id="role" value={profile.role} onChange={v => setProfile({
              ...profile,
              role: v
            })} className="text-sm text-neutral-600" styleConfig={styles.role} setStyleConfig={s => setStyle("role", s)} editMode={editMode} draggable />
            <EditableText id="quick" value={profile.quick} onChange={v => setProfile({
              ...profile,
              quick: v
            })} className="pt-2 text-sm leading-relaxed text-neutral-700 whitespace-pre-line" styleConfig={styles.quick} setStyleConfig={s => setStyle("quick", s)} editMode={editMode} draggable />

            {/* Socials stay non-editable except via Settings */}
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map((s, i) => <SocialIcon key={i} href={s.url} label={s.label} icon={s.icon} />)}
            </div>
          </motion.div>
        </motion.section>

        {/* MIDDLE: Top buttons remain; labels editable on hover; content below is editable and draggable */}
        <motion.section initial={{
          opacity: 0,
          y: layout.enableAnimations ? 12 : 0
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.05
        }} className="col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mx-[80px] px-0">
            {/* Navigation buttons moved to top navbar center */}

            {/* HOME */}
            {sections.home && <TabsContent value="home" className="space-y-8">
                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="about-title" value="About me" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["about-title"]} setStyleConfig={s => setStyle("about-title", s)} editMode={editMode} />
                  <EditableText id="about-body" value={profile.entry} onChange={v => setProfile({
                  ...profile,
                  entry: v
                })} className="mt-2 text-[15px] leading-relaxed" styleConfig={styles["about-body"]} setStyleConfig={s => setStyle("about-body", s)} editMode={editMode} />
                </motion.div>

                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="highlights-title" value="Highlights" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["highlights-title"]} setStyleConfig={s => setStyle("highlights-title", s)} editMode={editMode} />
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    {["Founder mindset with hands-on product execution", "Supabase, Wasabi (S3), React/Next.js, Tailwind, shadcn/ui", "Auth flows, MFA, admin dashboards, and real-time tooling"].map((item, idx) => <li key={idx}>
                        <EditableText id={`highlight-${idx}`} value={item} onChange={() => {}} editMode={editMode} styleConfig={styles[`highlight-${idx}`]} setStyleConfig={s => setStyle(`highlight-${idx}`, s)} />
                      </li>)}
                  </ul>
                </motion.div>
              </TabsContent>}

            {/* SKILLS */}
            {sections.skills && <TabsContent value="skills" className="space-y-8">
                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="skills-title" value="Core skills" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["skills-title"]} setStyleConfig={s => setStyle("skills-title", s)} editMode={editMode} />
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    {["Product Thinking", "React / Next.js / Vite", "Tailwind / shadcn/ui", "Supabase & RLS", "Wasabi S3 + CORS", "Edge Functions", "Authentication & MFA", "Admin Dashboards"].map((s, i) => <EditableText key={i} id={`skill-${i}`} value={s} onChange={() => {}} className="rounded-xl bg-[var(--accent-10)] px-3 py-2 text-[13px]" styleConfig={styles[`skill-${i}`]} setStyleConfig={st => setStyle(`skill-${i}`, st)} editMode={editMode} draggable />)}
                  </div>
                </motion.div>

                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="learning-title" value="Currently learning" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["learning-title"]} setStyleConfig={s => setStyle("learning-title", s)} editMode={editMode} />
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {["Threat Modeling", "Pen Testing Basics", "Secure SDLC"].map((s, i) => <EditableText key={i} id={`learning-${i}`} value={s} onChange={() => {}} className="rounded-xl bg-neutral-50 px-3 py-2 text-[13px]" styleConfig={styles[`learning-${i}`]} setStyleConfig={st => setStyle(`learning-${i}`, st)} editMode={editMode} draggable />)}
                  </div>
                </motion.div>
              </TabsContent>}

            {/* PORTFOLIO */}
            {sections.portfolio && <TabsContent value="portfolio" className="space-y-8" id="portfolio">
                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="portfolio-title" value="Featured work" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["portfolio-title"]} setStyleConfig={s => setStyle("portfolio-title", s)} editMode={editMode} />
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    {["Shqipet Admin Settings", "Notification System", "Marketplace Cards", "Luna AI Assistant"].map((t, i) => <motion.div key={i} drag={editMode} dragMomentum={false} className="group relative overflow-hidden rounded-2xl bg-white p-3">
                        <EditableText id={`pf-${i}-title`} value={t} onChange={() => {}} className="text-[15px] font-semibold" styleConfig={styles[`pf-${i}-title`]} setStyleConfig={s => setStyle(`pf-${i}-title`, s)} editMode={editMode} />
                        <EditableText id={`pf-${i}-desc`} value={"Project description"} onChange={() => {}} className="mt-1 text-sm text-neutral-600" styleConfig={styles[`pf-${i}-desc`]} setStyleConfig={s => setStyle(`pf-${i}-desc`, s)} editMode={editMode} />
                      </motion.div>)}
                  </div>
                </motion.div>
              </TabsContent>}

            {/* BLOGS */}
            {sections.blogs && <TabsContent value="blogs" className="space-y-8">
                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="blogs-title" value="Latest posts" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["blogs-title"]} setStyleConfig={s => setStyle("blogs-title", s)} editMode={editMode} />
                  <div className="mt-3 space-y-3 text-[15px]">
                    {["Designing calm interfaces", "Auth flows that feel humane", "My Supabase & Wasabi tips"].map((t, i) => <motion.div key={i} drag={editMode} dragMomentum={false} className="flex items-center justify-between rounded-xl bg-white p-3">
                        <EditableText id={`blog-${i}`} value={t} onChange={() => {}} editMode={editMode} styleConfig={styles[`blog-${i}`]} setStyleConfig={s => setStyle(`blog-${i}`, s)} />
                        <Button variant="ghost" className="gap-1 px-2 text-[13px]">
                          Read <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>)}
                  </div>
                </motion.div>
              </TabsContent>}

            {/* CONTACT */}
            {sections.contact && <TabsContent value="contact" className="space-y-8" id="contact">
                <motion.div drag={editMode} dragMomentum={false} className={`relative ${editMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-4 cursor-move hover:border-blue-500' : ''}`}>
                  {editMode && (
                    <div className="absolute -top-3 left-2 bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      Drag to move
                    </div>
                  )}
                  <EditableText id="contact-title" value="Get in touch" onChange={() => {}} className="text-lg font-semibold tracking-tight" styleConfig={styles["contact-title"]} setStyleConfig={s => setStyle("contact-title", s)} editMode={editMode} />
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="Your name" />
                      <Label className="mt-2">Email</Label>
                      <Input type="email" placeholder="your@email.com" />
                      <Label className="mt-2">Message</Label>
                      <Textarea placeholder="Say hello…" rows={6} />
                      <Button className="mt-2">Send message</Button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {profile.email}</div>
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {profile.phone}</div>
                      <a className="inline-flex items-center gap-1 underline" href={profile.website} target="_blank" rel="noreferrer">
                        Visit website <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>}
          </Tabs>
        </motion.section>

        {/* RIGHT: CV only */}
        <motion.aside initial={{
          opacity: 0,
          y: layout.enableAnimations ? 12 : 0
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="col-span-1" style={{
          display: layout.showRightSidebar ? undefined : "none"
        }}>
          <div className="sticky top-24 space-y-3">
            {/* Open CV button moved to top navbar center */}
          </div>
        </motion.aside>
      </main>

      {/* Floating Hire Button - Bottom Right */}
      {hireButton.enabled && !editMode && <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.4,
        delay: 0.3
      }} className="fixed bottom-8 right-8 z-50">
          <Button size="lg" onClick={() => {
          if (hireButton.url) {
            window.open(hireButton.url, '_blank');
          } else if (hireButton.email) {
            window.location.href = `mailto:${hireButton.email}`;
          }
        }} className="gap-2 shadow-xl bg-gradient-to-r from-[#2AA1FF] to-[#1E88E5] hover:from-[#1E88E5] hover:to-[#1565C0] text-white" style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`
        }}>
            <Briefcase className="h-5 w-5" />
            {hireButton.text}
          </Button>
        </motion.div>}
    </div>
    </>;
}

// ===== Photo strip (left, subtle) =====
const PhotoStrip = React.memo(({
  avatarUrl,
  accent,
  height = 420,
  userId,
  editMode = false,
  onPhotoUpdate
}: {
  avatarUrl: string;
  accent: string;
  height?: number;
  userId?: string;
  editMode?: boolean;
  onPhotoUpdate?: (url: string) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const rawAvatarRef = useRef(avatarUrl);
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      // Show local preview instantly
      const localPreview = URL.createObjectURL(file);
      if (onPhotoUpdate) {
        onPhotoUpdate(localPreview);
      }
      setUploadProgress(15);
      console.log('📤 Uploading professional photo...', {
        fileName: file.name,
        fileSize: file.size
      });

      // Upload to Wasabi
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mediaType', 'professional-presentation-avatar');
      formData.append('userId', userId);
      setUploadProgress(30);
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      setUploadProgress(40);
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wasabi-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Upload response error:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }
      setUploadProgress(60);
      const result = await response.json();
      console.log('✅ Upload successful:', result);
      const key = result.key || result.url;
      if (!key) {
        throw new Error('Upload did not return a file key');
      }
      setUploadProgress(75);
      // Update professional_presentations table with the new avatar key
      const {
        data: upserted,
        error: updateError
      } = await supabase.from('professional_presentations').upsert({
        user_id: userId,
        avatar_url: key,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      }).select('updated_at, avatar_url').single();
      if (updateError) {
        console.error('❌ Database update error:', updateError);
        throw updateError;
      }

      // CRITICAL: Clear cache and force fresh URL resolution for instant sync
      try {
        mediaService.clearCache?.(key);
        mediaService.clearAllCaches?.();
      } catch {}
      const freshUrl = await mediaService.getProxyBlob(key);
      const timestamp = Date.now();
      const versionedUrl = freshUrl + (freshUrl.includes('?') ? '&' : '?') + 't=' + timestamp;

      // Preload and apply immediately
      await mediaService.preloadImage(versionedUrl);
      onPhotoUpdate?.(versionedUrl);

      // Store in localStorage for instant display on refresh
      try {
        localStorage.setItem('pp:last:avatar_url', versionedUrl);
        localStorage.setItem('pp:avatar_meta', JSON.stringify({
          url: versionedUrl,
          rev: upserted?.updated_at || new Date().toISOString(),
          userId
        }));
      } catch {}
      setUploadProgress(85);
      console.log('✅ Database updated with key:', key);
      toast.success('Professional photo updated successfully');
      const rev = (upserted as any)?.updated_at || Date.now().toString();
      try {
        mediaService.clearCache?.(key);
      } catch {}
      try {
        const fresh = await mediaService.getUrl(key);
        const versioned = fresh + (fresh.includes('?') ? '&' : '?') + 'rev=' + encodeURIComponent(rev);
        await mediaService.preloadImage(versioned);
        setUploadProgress(95);
        // Apply final resolved URL immediately
        if (onPhotoUpdate) onPhotoUpdate(versioned);
        try {
          localStorage.setItem('pp:last:avatar_url', versioned);
          localStorage.setItem('pp:avatar_meta', JSON.stringify({
            url: versioned,
            rev,
            userId
          }));
        } catch {}
      } catch (e) {
        console.warn('⚠️ Failed to resolve fresh avatar after upload', e);
      }
      setUploadProgress(100);
    } catch (error) {
      console.error('❌ Professional photo upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update professional photo');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Memoized URL resolution - prevent unnecessary re-resolves
  const displayUrl = useMemo(() => {
    // Check if avatarUrl changed
    if (rawAvatarRef.current !== avatarUrl) {
      rawAvatarRef.current = avatarUrl;
    }

    // If already a valid HTTP/blob/data URL, use it directly
    if (avatarUrl && /^(https?:|blob:|data:)/.test(avatarUrl)) {
      return avatarUrl;
    }

    // Try localStorage cache first
    try {
      const raw = localStorage.getItem('pp:avatar_meta');
      if (raw) {
        const meta = JSON.parse(raw);
        if (meta?.url && (!userId || meta.userId === userId)) {
          // If cached URL is valid HTTP, use it
          if (/^https?:/.test(meta.url)) {
            return String(meta.url);
          }
        }
      }
    } catch {}

    // Fallback to resolving
    return resolveMediaUrl(avatarUrl);
  }, [avatarUrl, userId]);
  // Photo editor hook
  const photoEditor = usePhotoEditor({
    userId,
    onSave: (transform) => {
      console.log('Photo transform saved:', transform);
    }
  });

  return <div className="relative group">
      <div 
        className={`relative w-full ${photoEditor.isEditMode ? 'overflow-visible z-[60]' : 'overflow-hidden'} rounded-xl border border-neutral-200 bg-white`}
        style={{
          height,
          transform: `translate(${photoEditor.transform.translateX}px, ${photoEditor.transform.translateY}px) scale(${photoEditor.transform.scaleX}, ${photoEditor.transform.scaleY})`,
          transition: (photoEditor.isLoading || photoEditor.isDragging || photoEditor.isResizing) ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: photoEditor.isDragging ? 'grabbing' : photoEditor.isEditMode ? 'grab' : 'default',
          opacity: photoEditor.isLoading && !photoEditor.hadCache ? 0 : 1,
          willChange: 'transform',
        }}
      >
        {displayUrl ? <UploadAnimation isUploading={isUploading} progress={uploadProgress} type="avatar">
            <img 
              src={displayUrl} 
              alt="Professional Profile" 
              className="h-full w-full object-cover animate-fade-in select-none"
              draggable={false}
            />
          </UploadAnimation> : <div className="h-full w-full">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#f3f4f6,#f3f4f6_12px,#e5e7eb_12px,#e5e7eb_24px)]" />
          </div>}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-black/5" />
        
        {/* Photo Editor Controls */}
        {editMode && (
          <PhotoEditor
            isEditMode={photoEditor.isEditMode}
            isDragging={photoEditor.isDragging}
            isResizing={photoEditor.isResizing}
            isSaving={photoEditor.isSaving}
            scaleX={photoEditor.transform.scaleX}
            scaleY={photoEditor.transform.scaleY}
            onEditToggle={() => photoEditor.setIsEditMode(!photoEditor.isEditMode)}
            onDragStart={photoEditor.handleDragStart}
            onResizeStart={photoEditor.handleResizeStart}
            onSave={photoEditor.saveTransform}
            onReset={photoEditor.resetTransform}
            onCancel={photoEditor.cancelEdit}
          />
        )}

        {/* Camera button - only show when NOT in photo edit mode */}
        {editMode && !photoEditor.isEditMode && (
          <div className="absolute bottom-4 right-4 transition-opacity duration-200">
            <Button size="sm" variant="secondary" onClick={triggerUpload} disabled={isUploading} className="bg-white/90 text-black hover:bg-white shadow-lg">
              <Camera className="w-4 h-4 mr-1" />
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.avif,.heic,.heif" onChange={handleFileSelect} className="hidden" />
    </div>;
});

PhotoStrip.displayName = 'PhotoStrip';

// ===== Minor helpers =====
function SettingsDialog({
  profile,
  setProfile,
  socials,
  setSocials,
  sections,
  setSections,
  accent,
  setAccent,
  layout,
  setLayout,
  seo,
  setSeo,
  hireButton,
  setHireButton
}: any) {
  function updateSocial(i: number, key: "label" | "url" | "icon", value: string) {
    const copy = socials.slice();
    (copy[i] as any)[key] = value;
    setSocials(copy);
  }
  function addSocial() {
    setSocials([...socials, {
      label: "New link",
      url: "https://",
      icon: "website"
    }]);
  }
  function removeSocial(i: number) {
    setSocials(socials.filter((_, idx) => idx !== i));
  }
  return <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2"><Settings className="h-4 w-4" /> Settings</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader><DialogTitle>Page settings</DialogTitle></DialogHeader>
        <Tabs defaultValue="profile">
          <TabsList className="mb-4 grid grid-cols-7">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="links">Social links</TabsTrigger>
            <TabsTrigger value="hire">Hire Button</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input value={profile.name} onChange={e => setProfile({
                ...profile,
                name: e.target.value
              })} />
                <Label className="mt-2">Role / headline</Label>
                <Input value={profile.role} onChange={e => setProfile({
                ...profile,
                role: e.target.value
              })} />
                <Label className="mt-2">Entry text (Home)</Label>
                <Textarea rows={4} value={profile.entry} onChange={e => setProfile({
                ...profile,
                entry: e.target.value
              })} />
                <Label className="mt-2">Quick intro (under photo)</Label>
                <Textarea rows={3} value={profile.quick} onChange={e => setProfile({
                ...profile,
                quick: e.target.value
              })} />
              </div>
              <div className="space-y-2">
                <Label>Avatar image URL</Label>
                <Input placeholder="https://…" value={profile.avatarUrl} onChange={e => setProfile({
                ...profile,
                avatarUrl: e.target.value
              })} />
                <Label className="mt-2">Email</Label>
                <Input value={profile.email} onChange={e => setProfile({
                ...profile,
                email: e.target.value
              })} />
                <Label className="mt-2">Phone</Label>
                <Input value={profile.phone} onChange={e => setProfile({
                ...profile,
                phone: e.target.value
              })} />
                <Label className="mt-2">Website</Label>
                <Input value={profile.website} onChange={e => setProfile({
                ...profile,
                website: e.target.value
              })} />
                <Label className="mt-2">CV URL</Label>
                <Input value={profile.cvUrl} onChange={e => setProfile({
                ...profile,
                cvUrl: e.target.value
              })} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-3">
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-neutral-700">
              <strong>Note:</strong> Section toggles have been moved to the settings dropdown next to your profile avatar in the top right corner.
            </div>
          </TabsContent>

          <TabsContent value="links" className="space-y-3">
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-neutral-700">
              <strong>Note:</strong> Social links have been moved to the settings dropdown next to your profile avatar in the top right corner.
            </div>
          </TabsContent>

          <TabsContent value="hire" className="space-y-4">
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-neutral-700">
              <strong>Note:</strong> Hire button settings have been moved to the settings dropdown next to your profile avatar in the top right corner.
            </div>
          </TabsContent>

          <TabsContent value="theme" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Accent color (HEX)</Label>
                <Input value={accent} onChange={e => setAccent(e.target.value)} placeholder="#2AA1FF" />
                <div className="text-xs text-neutral-500">White-first theme; accent is subtle.</div>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4">
                <div className="mb-2 text-sm font-medium">Preview</div>
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl" style={{
                  background: "var(--accent)"
                }} />
                  <div className="h-9 w-9 rounded-xl" style={{
                  background: "var(--accent-20)"
                }} />
                  <div className="h-9 w-9 rounded-xl" style={{
                  background: "var(--accent-10)"
                }} />
                  <div className="h-9 w-9 rounded-xl bg-white" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Left column width (CSS fr)</Label>
                <Input value={layout.leftColFraction} onChange={e => setLayout({
                ...layout,
                leftColFraction: e.target.value
              })} />
                <Label>Middle column width (CSS fr)</Label>
                <Input value={layout.middleColFraction} onChange={e => setLayout({
                ...layout,
                middleColFraction: e.target.value
              })} />
                <Label>Right column width (CSS fr)</Label>
                <Input value={layout.rightColFraction} onChange={e => setLayout({
                ...layout,
                rightColFraction: e.target.value
              })} />
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 mt-2">
                  <div className="text-sm">Enable animations</div>
                  <Switch checked={layout.enableAnimations} onCheckedChange={v => setLayout({
                  ...layout,
                  enableAnimations: v
                })} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <div className="text-sm">Show right sidebar</div>
                  <Switch checked={layout.showRightSidebar} onCheckedChange={v => setLayout({
                  ...layout,
                  showRightSidebar: v
                })} />
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <Label>Noise strength (0–0.2)</Label>
                  <Input value={String(layout.noiseOpacity)} onChange={e => setLayout({
                  ...layout,
                  noiseOpacity: Number(e.target.value || 0)
                })} placeholder="0.06" />
                </div>
                <div className="rounded-xl bg-neutral-50 p-3">
                  <Label>Photo height (px)</Label>
                  <Input value={String(layout.photoHeight)} onChange={e => setLayout({
                  ...layout,
                  photoHeight: Number(e.target.value || 0)
                })} placeholder="220" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Page title</Label>
                <Input value={seo.pageTitle} onChange={e => setSeo({
                ...seo,
                pageTitle: e.target.value
              })} />
                <Label className="mt-2">Description</Label>
                <Textarea rows={3} value={seo.description} onChange={e => setSeo({
                ...seo,
                description: e.target.value
              })} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <div className="text-sm">Open in new window</div>
                  <Switch checked={seo.openInNewWindow} onCheckedChange={v => setSeo({
                  ...seo,
                  openInNewWindow: v
                })} />
                </div>
                <p className="text-xs text-neutral-500">Optimized for separate profile window.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}

// ===== Simple tag visual used in Skills (still editable via wrapper) =====
function SkillTag({
  label,
  subtle = false
}: {
  label: string;
  subtle?: boolean;
}) {
  return <span className={"inline-flex items-center justify-center rounded-xl px-3 py-2 " + (subtle ? "bg-neutral-50" : "bg-[var(--accent-10)]")}>
      <span className="text-[13px] font-medium">{label}</span>
    </span>;
}