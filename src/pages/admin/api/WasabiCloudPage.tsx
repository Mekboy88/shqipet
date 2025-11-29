import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Server, Globe, RefreshCcw, Play, ShieldCheck, Settings2, Cloud, CheckCircle2, AlertTriangle, XCircle, Link2, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/utils/toast-helpers";
import { Toaster } from "@/components/ui/sonner";
// Local cache for instant hydration (no secrets stored)
const WASABI_CACHE_KEY = 'wasabi_cfg_cache_v1';
const readWasabiCache = (): any => {
  try { return JSON.parse(localStorage.getItem(WASABI_CACHE_KEY) || '{}'); } catch { return {}; }
};
const writeWasabiCache = (partial: any) => {
  try {
    const curr = readWasabiCache();
    localStorage.setItem(WASABI_CACHE_KEY, JSON.stringify({ ...curr, ...partial }));
  } catch {}
};

// --- Helpers --------------------------------------------------------------
const WASABI_ENDPOINT = (region: string) =>
  region === "us-east-1" ? "https://s3.wasabisys.com" : `https://s3.${region}.wasabisys.com`;

const STATUS_COLORS: Record<ConnStatus, string> = {
  ok: "#16a34a",
  warn: "#ca8a04",
  down: "#dc2626",
};

type ConnStatus = "ok" | "warn" | "down";

type EdgeStatus = {
  site_supabase: ConnStatus;
  supabase_wasabi: ConnStatus;
  site_wasabi: ConnStatus;
};

const defaultEdgeStatus: EdgeStatus = {
  site_supabase: "warn",
  supabase_wasabi: "warn",
  site_wasabi: "warn",
};

const nf = (n: number) => new Intl.NumberFormat().format(n);

// Format file sizes properly  
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Wasabi flat-rate example price (adjust if needed)
const COST_PER_TB = 6.99;

const WasabiCloudPage: React.FC = () => {
  // Edge status persistence helpers
  function readEdgeStatusCache(): EdgeStatus | null {
    try { const raw = localStorage.getItem('wasabi_edge_status_v1'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  function writeEdgeStatusCache(status: EdgeStatus) {
    try { localStorage.setItem('wasabi_edge_status_v1', JSON.stringify(status)); } catch {}
  }
  
  // Health + state
  const [edgeStatus, setEdgeStatus] = useState<EdgeStatus>(() => readEdgeStatusCache() || defaultEdgeStatus);
  const [testing, setTesting] = useState(false);
  const [uploadLog, setUploadLog] = useState<string>("");
  const [testResults, setTestResults] = useState<Array<{ ok: boolean; message: string }>>([]);
  const [checkStatus, setCheckStatus] = useState<{ siteWasabi: boolean | null; siteSupabase: boolean | null; supabaseWasabi: boolean | null; upload: boolean | null }>({
    siteWasabi: null,
    siteSupabase: null,
    supabaseWasabi: null,
    upload: null,
  });

  // Persist edge status across refreshes
  useEffect(() => { writeEdgeStatusCache(edgeStatus); }, [edgeStatus]);

  // Live settings
  const [maxFileMB, setMaxFileMB] = useState(50);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [allowTypes, setAllowTypes] = useState<string[]>(["image/*", "video/*", "audio/*", "application/pdf"]);
  
  // Additional settings from database
  const [useSignedUrls, setUseSignedUrls] = useState(true);
  const [autoCleanupDays, setAutoCleanupDays] = useState(90);
  const [enablePhotos, setEnablePhotos] = useState(true);
  const [enableVideos, setEnableVideos] = useState(true);
  const [enableMusic, setEnableMusic] = useState(true);
  const [enableDocuments, setEnableDocuments] = useState(true);
  
  // Credential change tracking
  const [recentChanges, setRecentChanges] = useState<Array<{
    id: string;
    changed_by: string;
    changed_by_email: string;
    changed_by_role: string;
    changed_at: string;
    changes: string[];
  }>>([]);
  const [loadingChanges, setLoadingChanges] = useState(false);

  const [credStatus, setCredStatus] = useState<"dirty" | "saving" | "saved">("dirty");
  
  // Load credentials from database on component mount
  const loadCredentials = async () => {
    try {
      const { data } = await supabase.functions.invoke('wasabi-config', { body: { action: 'get' } });
      const cfg = data || {};
      
      if (typeof cfg.max_file_size_mb === 'number') setMaxFileMB(cfg.max_file_size_mb);
      if (typeof cfg.real_time_uploads === 'boolean') setAutoUpdate(cfg.real_time_uploads);
      if (typeof cfg.use_signed_urls === 'boolean') setUseSignedUrls(cfg.use_signed_urls);
      if (typeof cfg.auto_cleanup_days === 'number') setAutoCleanupDays(cfg.auto_cleanup_days);
      if (typeof cfg.enable_photos === 'boolean') setEnablePhotos(cfg.enable_photos);
      if (typeof cfg.enable_videos === 'boolean') setEnableVideos(cfg.enable_videos);
      if (typeof cfg.enable_music === 'boolean') setEnableMusic(cfg.enable_music);
      if (typeof cfg.enable_documents === 'boolean') setEnableDocuments(cfg.enable_documents);
      if (Array.isArray(cfg.allowed_file_types)) setAllowTypes(cfg.allowed_file_types);

      setCredStatus('saved');
    } catch (error) {
      console.error('Failed to load Wasabi config via edge function:', error);
    }
  };

  const saveCredentials = async () => {
    if (credStatus === "saving") return;
    setCredStatus("saving");
    
    try {
      // Get current user info
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user profile and role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      const { data: userRole } = await supabase.rpc('get_current_user_role');
      
      // First, get existing config to preserve ID
      const { data: existingConfig } = await supabase
        .from('wasabi_config')
        .select('id')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      // Save configuration to database with retry logic for schema cache issues
      const saveConfigWithRetry = async (retryCount = 0): Promise<void> => {
        const baseConfigData = {
          max_file_size_mb: maxFileMB,
          real_time_uploads: autoUpdate,
          use_signed_urls: useSignedUrls,
          auto_cleanup_days: autoCleanupDays,
          enable_photos: enablePhotos,
          enable_videos: enableVideos,
          enable_music: enableMusic,
          enable_documents: enableDocuments,
          connection_status: 'configured',
          updated_at: new Date().toISOString(),
          created_by: user.id
        };

        // Build safe config payload
        const configData: any = { ...baseConfigData };

        let saveError;
        if (existingConfig?.id) {
          // Update existing config
          const { error } = await supabase
            .from('wasabi_config')
            .update(configData)
            .eq('id', existingConfig.id);
          saveError = error;
        } else {
          // Insert new config
          const { error } = await supabase
            .from('wasabi_config')
            .insert(configData);
          saveError = error;
        }

        // Handle schema cache errors with retry
        if (saveError?.code === 'PGRST204' && retryCount < 2) {
          console.log('Schema cache issue, retrying...', retryCount + 1);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return saveConfigWithRetry(retryCount + 1);
        }

        if (saveError) throw saveError;
      };

      await saveConfigWithRetry();
      
      // Log the change for audit trail
      const changedFields = [
        'max_file_size_mb', 'real_time_uploads', 'use_signed_urls', 'auto_cleanup_days',
        'enable_photos', 'enable_videos', 'enable_music', 'enable_documents'
      ];
      if (allowTypes && allowTypes.length > 0) changedFields.push('allowed_file_types');
      
      await supabase
        .from('wasabi_file_operations')
        .insert({
          operation_type: 'config_update',
          user_id: user.id,
          operation_details: {
            changed_fields: changedFields,
            changed_by: profile?.email || user.email,
            changed_by_role: userRole || 'user',
            timestamp: new Date().toISOString()
          }
        });
      
      setCredStatus('saved');
      toast.success('Wasabi settings saved');
      
      // Refresh changes after saving
      await fetchRecentChanges();
      // Reload latest saved config to ensure UI reflects DB
      await loadCredentials();
    } catch (error: any) {
      console.error('Failed to save credentials:', error);
      setUploadLog(prev => prev + `\n✖ Failed to save credentials: ${error.message}`);
      setCredStatus("dirty");
      
      // Show user-friendly error message
      if (error?.code === 'PGRST204') {
        setUploadLog(prev => prev + `\n⚠️ Database schema updating, please try again in a moment`);
      }
    }
  };


  // Function + metrics
  const [functionUrl, setFunctionUrl] = useState(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/wasabi-upload`);
  const [metricsUrl] = useState(""); // input removed; keep state for optional future use
  const analyticsRef = useRef<HTMLDivElement>(null);
  const [downloadFormat, setDownloadFormat] = useState<string>("csv");
  const [analytics, setAnalytics] = useState({
    objects: 0,
    totalGB: 0,
    totalBytes: 0,
    monthEgressGB: 0,
    categories: {
      photos: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      other: 0,
    },
    categoryBytes: {
      photos: 0,
      videos: 0,
      audio: 0,
      documents: 0,
      other: 0,
    },
    operationStats: {
      totalUploads: 0,
      totalDeletes: 0,
      recentOperations: []
    },
    lastUploads: [
      { day: "D-6", uploads: 0 },
      { day: "D-5", uploads: 0 },
      { day: "D-4", uploads: 0 },
      { day: "D-3", uploads: 0 },
      { day: "D-2", uploads: 0 },
      { day: "D-1", uploads: 0 },
      { day: "Today", uploads: 0 },
    ],
  });

  // Analytics range selector (kept for UI but does not generate fake data)
  const [chartRange, setChartRange] = useState<string>("daily-7");

  // chartData is derived strictly from real DB data in analytics.lastUploads
  const chartData = useMemo(() => {
    return (analytics.lastUploads || []).map((d) => ({ label: d.day, uploads: d.uploads || 0 }));
  }, [analytics.lastUploads]);

  

  // --- Topology helpers ---------------------------------------------------
  const SUPABASE_POS = { x: 400, y: 70 } as const;
  const WEBSITE_POS = { x: 120, y: 340 } as const;
  const WASABI_POS = { x: 680, y: 340 } as const;

  const outerLoopStatus: ConnStatus =
    edgeStatus.site_supabase === "ok" && edgeStatus.supabase_wasabi === "ok" && edgeStatus.site_wasabi === "ok"
      ? "ok"
      : edgeStatus.site_supabase === "down" || edgeStatus.supabase_wasabi === "down" || edgeStatus.site_wasabi === "down"
      ? "down"
      : "warn";

  const DirectionLine = ({
    from,
    to,
    status,
    offset = 0,
    clockwise = true,
  }: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    status: ConnStatus;
    offset?: number;
    clockwise?: boolean;
  }) => {
    const color = STATUS_COLORS[status];
    const cx = (from.x + to.x) / 2 + (offset || 0);
    const cy = (from.y + to.y) / 2 - 40 * Math.sign(to.x - from.x || 1);
    const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
    const id = `grad-${from.x}-${from.y}-${to.x}-${to.y}-${offset}-${status}`;
    return (
      <g>
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          <marker id={`arrow-${status}`} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
          </marker>
        </defs>
        <motion.path
          d={d}
          stroke={`url(#${id})`}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="12 10"
          markerEnd={`url(#arrow-${status})`}
          fill="transparent"
          initial={{ pathLength: 0, strokeDashoffset: 0 }}
          animate={{ pathLength: 1, strokeDashoffset: clockwise ? -80 : 80 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 3.2 }}
        />
      </g>
    );
  };

  const TriangleLoop = ({ pts, status }: { pts: { x: number; y: number }[]; status: ConnStatus }) => {
    const color = STATUS_COLORS[status];
    const d = `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y} L ${pts[2].x} ${pts[2].y} Z`;
    return (
      <motion.path
        d={d}
        fill="transparent"
        stroke={color}
        strokeOpacity={0.15}
        strokeWidth={6}
        strokeDasharray="16 14"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -120 }}
        transition={{ repeat: Infinity, ease: "linear", duration: 6 }}
      />
    );
  };

  const Node = ({ x, y, label, Icon }: { x: number; y: number; label: string; Icon: any }) => (
    <g transform={`translate(${x - 40}, ${y - 40})`}>
      <motion.circle r={40} cx={40} cy={40} className="fill-white" />
      <motion.circle r={40} cx={40} cy={40} className="stroke-1" stroke="#e5e7eb" fill="transparent" />
      <foreignObject x={0} y={0} width={80} height={80}>
        <div className="w-20 h-20 flex flex-col items-center justify-center gap-1">
          <Icon className="w-6 h-6 text-gray-700" />
          <span className="text-xs text-gray-700 text-center leading-tight">{label}</span>
        </div>
      </foreignObject>
    </g>
  );

  // --- Actions ------------------------------------------------------------
  const fetchRecentChanges = async () => {
    setLoadingChanges(true);
    try {
      // Get recent config changes from operations log
      const { data: operations, error } = await supabase
        .from('wasabi_file_operations')
        .select(`
          id,
          operation_type,
          user_id,
           operation_details,
          created_at
        `)
        .eq('operation_type', 'config_update')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (operations && operations.length > 0) {
        // Get user details for each operation
        const userIds = operations.map(op => op.user_id).filter(Boolean);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('auth_user_id, email, first_name, last_name')
          .in('auth_user_id', userIds);

        const changes = operations.map(op => {
          const profile = profiles?.find(p => p.auth_user_id === op.user_id);
          const details = op.operation_details as any;
          const role = details?.changed_by_role || 'user';
          
          return {
            id: op.id,
            changed_by: profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'Unknown User',
            changed_by_email: details?.changed_by || profile?.email || 'unknown@example.com',
            changed_by_role: role,
            changed_at: op.created_at,
            changes: details?.changed_fields || []
          };
        });

        setRecentChanges(changes);
      }
    } catch (error) {
      console.error('Failed to fetch recent changes:', error);
    } finally {
      setLoadingChanges(false);
    }
  };


  const refreshAnalytics = async () => {
    try {
      // 1) Try authoritative live data from Wasabi via edge function
      let bucketName = '';
      let region = '';
      try {
        const { data: cfg } = await supabase.functions.invoke('wasabi-config', { body: { action: 'get' } });
        bucketName = cfg?.bucket_name || '';
        region = cfg?.region || '';
      } catch {}

      if (bucketName && region) {
        try {
          const { data, error } = await supabase.functions.invoke('test-s3-connection', {
            body: {
              testConnection: true,
              bucketName: bucketName.trim(),
              region: region.trim(),
              useStoredCredentials: true,
            },
            headers: { 'Content-Type': 'application/json' },
          });
          if (!error && data?.storageAnalytics) {
            const fileTypes = data.storageAnalytics.fileTypes || {};
            const toBytes = (n: number) => (typeof n === 'number' ? n : 0);
            const toCount = (n: number) => (typeof n === 'number' ? n : 0);

            const sizes = {
              photos: toBytes(fileTypes?.images?.size || 0),
              videos: toBytes(fileTypes?.videos?.size || 0),
              audio: toBytes(fileTypes?.audio?.size || 0),
              documents: toBytes(fileTypes?.documents?.size || 0),
            } as const;

            const counts = {
              photos: toCount(fileTypes?.images?.count || 0),
              videos: toCount(fileTypes?.videos?.count || 0),
              audio: toCount(fileTypes?.audio?.count || 0),
              documents: toCount(fileTypes?.documents?.count || 0),
            } as const;

            const totalBytes = toBytes(data.storageAnalytics.totalSize || (sizes.photos + sizes.videos + sizes.audio + sizes.documents));
            const totalObjects = data.storageAnalytics.totalObjects || (counts.photos + counts.videos + counts.audio + counts.documents);

            setAnalytics(prev => ({
              ...prev,
              objects: totalObjects,
              totalGB: totalBytes / (1024 * 1024 * 1024),
              totalBytes: totalBytes,
              categories: {
                photos: counts.photos,
                videos: counts.videos,
                audio: counts.audio,
                documents: counts.documents,
                other: 0, // removed in UI but kept internally to avoid undefined access
              },
              categoryBytes: {
                photos: sizes.photos,
                videos: sizes.videos,
                audio: sizes.audio,
                documents: sizes.documents,
                other: 0,
              },
              lastUploads: prev.lastUploads, // keep recent chart; we don't have per-day from Wasabi list
            }));
            return; // stop here if live Wasabi data succeeded
          }
        } catch {}
      }

      // 2) Fallback to database snapshot (may be stale if files deleted outside app)
      const [filesResult] = await Promise.all([
        supabase
          .from('wasabi_files')
          .select('file_size, content_type, created_at, original_filename')
      ]);

      const files = filesResult.data || [];

      const totalBytes = files.reduce((sum, file) => sum + (file.file_size || 0), 0);
      
      const now = new Date();
      const buckets: Record<number, number> = { 6:0,5:0,4:0,3:0,2:0,1:0,0:0 };
      files.forEach((f: any) => {
        const d = new Date(f.created_at);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 6) buckets[diffDays] = (buckets[diffDays] || 0) + 1;
      });
      const labels = ['D-6','D-5','D-4','D-3','D-2','D-1','Today'];
      const lastUploads = [6,5,4,3,2,1,0].map((k, idx) => ({ day: labels[idx], uploads: buckets[k] || 0 }));

      const categorizeFile = (contentType: string, filename: string = '') => {
        const type = contentType?.toLowerCase() || '';
        const ext = filename?.toLowerCase().split('.').pop() || '';
        if (type.startsWith('image/') || ['jpg','jpeg','png','gif','bmp','svg','webp'].includes(ext)) return 'photos';
        if (type.startsWith('video/') || ['mp4','avi','mov','wmv','flv','webm','mkv'].includes(ext)) return 'videos';
        if (type.startsWith('audio/') || ['mp3','wav','flac','aac','ogg','m4a'].includes(ext)) return 'audio';
        if (type.includes('pdf') || type.includes('document') || type.includes('text') || ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','rtf'].includes(ext)) return 'documents';
        return 'other';
      };

      const categories: any = { photos: 0, videos: 0, audio: 0, documents: 0 };
      const categoryBytes: any = { photos: 0, videos: 0, audio: 0, documents: 0 };

      files.forEach((file: any) => {
        const cat = categorizeFile(file.content_type, file.original_filename);
        if (cat in categories) {
          categories[cat]++;
          categoryBytes[cat] += (file.file_size || 0);
        }
      });

      setAnalytics(prev => ({
        ...prev,
        objects: files.length,
        totalGB: totalBytes / (1024 * 1024 * 1024),
        totalBytes: totalBytes,
        categories: { ...categories, other: 0 },
        categoryBytes: { ...categoryBytes, other: 0 },
        lastUploads,
      }));
    } catch (e) {
      // Hard reset to zeros on errors to avoid misleading numbers
      setAnalytics(prev => ({
        ...prev,
        objects: 0,
        totalGB: 0,
        totalBytes: 0,
        categories: { photos: 0, videos: 0, audio: 0, documents: 0, other: 0 },
        categoryBytes: { photos: 0, videos: 0, audio: 0, documents: 0, other: 0 },
      }));
    }
  };

  // Real-time: watch file changes to update analytics and notify admin
  useEffect(() => {
    const channel = supabase
      .channel('wasabi-files-realtime')
      .on('postgres_changes', { event: '*', schema: 'api', table: 'wasabi_files' }, (payload) => {
        try {
          if ((payload as any).eventType === 'INSERT') {
            toast.success('New file recorded in storage analytics');
          } else if ((payload as any).eventType === 'DELETE') {
            toast.info('File removed from storage analytics');
          } else if ((payload as any).eventType === 'UPDATE') {
            toast.info('File metadata updated');
          }
        } catch {}
        // Always refresh analytics on any change
        refreshAnalytics();
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(channel); } catch {}
    };
  }, []);

  const estimatedMonthlyCost = useMemo(() => {
    return ((analytics.totalGB / 1024) * COST_PER_TB).toFixed(2);
  }, [analytics.totalGB]);

  const maskEmail = (email: string, role: string): string => {
    if (role === 'platform_owner_root') {
      // Hide email for platform owner
      const [, domain] = email.split('@');
      return `*****************@${domain}`;
    }
    // Show full email for other roles
    return email;
  };

  const formatChangeTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    loadCredentials();
    refreshAnalytics();
    // Force refresh analytics after a short delay to ensure latest state
    setTimeout(refreshAnalytics, 1000);
  }, []);

  // Auto-save settings after changes with debounce
  useEffect(() => {
    if (credStatus === "dirty") {
      const timer = setTimeout(async () => {
        await saveCredentials();
      }, 2000); // Auto-save 2 seconds after last change
      return () => clearTimeout(timer);
    }
  }, [credStatus, maxFileMB, autoUpdate, useSignedUrls, autoCleanupDays, enablePhotos, enableVideos, enableMusic, enableDocuments, saveCredentials]);

  // Real-time analytics refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshAnalytics();
      }
    }, 30000); // Refresh every 30 seconds when page is visible
    
    return () => clearInterval(interval);
  }, [refreshAnalytics]);

  // Handle visibility change for real-time updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAnalytics();
        fetchRecentChanges();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [refreshAnalytics, fetchRecentChanges]);


  const StatusPill = ({ status }: { status: ConnStatus }) => {
    const map: Record<ConnStatus, { text: string; icon: any; cls: string }> = {
      ok: { text: "Connected", icon: CheckCircle2, cls: "bg-green-50 text-green-700 border-green-200" },
      warn: { text: "Degraded", icon: AlertTriangle, cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
      down: { text: "Down", icon: XCircle, cls: "bg-red-50 text-red-700 border-red-200" },
    };
    const I = map[status].icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${map[status].cls}`}>
        <I className="w-4 h-4" /> {map[status].text}
      </span>
    );
  };

  // Centralized real-time connection test (hoisted)
  async function runConnectionTest() {
    if (testing) return;
    setTesting(true);
    setUploadLog("");
    setCheckStatus({ siteWasabi: null, siteSupabase: null, supabaseWasabi: null, upload: null });

    try {
      // Load config (bucket/region)
      let configBucket = '';
      let configRegion = '';
      try {
        const { data: config } = await supabase.functions.invoke('wasabi-config', { body: { action: 'get' } });
        configBucket = config?.bucket_name || '';
        configRegion = config?.region || '';
        if (!configBucket) throw new Error('Missing Wasabi bucket in database configuration.');
        if (!configRegion) throw new Error('Missing Wasabi region in database configuration.');
      } catch (e: any) {
        setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Failed to load config: ${e?.message || e}`);
        setEdgeStatus(defaultEdgeStatus);
        setTesting(false);
        return;
      }
      const configEndpoint = configRegion === "us-east-1" ? "https://s3.wasabisys.com" : `https://s3.${configRegion}.wasabisys.com`;

      // Keep previous indicators until each step updates them

      // Step A: Website → Wasabi (HEAD)
      try {
        const head = await fetch(`${configEndpoint}/${configBucket}/`, { method: "HEAD" });
        if (head.ok || head.status === 403 || head.status === 301) {
          setEdgeStatus((s) => ({ ...s, site_wasabi: "ok" }));
          setCheckStatus(s => ({ ...s, siteWasabi: true }));
          setUploadLog(prev => (prev ? prev + "\n" : "") + `• Wasabi bucket reachable (${head.status}).`);
        } else {
          setEdgeStatus((s) => ({ ...s, site_wasabi: "down" }));
          setCheckStatus(s => ({ ...s, siteWasabi: false }));
          setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Wasabi bucket HEAD status ${head.status}.`);
        }
      } catch (e: any) {
        setEdgeStatus((s) => ({ ...s, site_wasabi: "down" }));
        setCheckStatus(s => ({ ...s, siteWasabi: false }));
        setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Wasabi HEAD failed: ${e?.message || e}`);
      }

      // Step B: Website → Supabase and Supabase → Wasabi (edge health)
      try {
        const { data, error } = await supabase.functions.invoke('wasabi-health');
        if (error) throw error;
        const siteSupabaseOk = !!data?.supabase?.online;
        const supabaseWasabiOk = !!data?.s3?.online;
        setEdgeStatus((s) => ({
          ...s,
          site_supabase: siteSupabaseOk ? "ok" : "warn",
          supabase_wasabi: supabaseWasabiOk ? "ok" : "warn",
        }));
        setCheckStatus(s => ({ ...s, siteSupabase: siteSupabaseOk, supabaseWasabi: supabaseWasabiOk }));
        setUploadLog(prev => (prev ? prev + "\n" : "") + (siteSupabaseOk ? "• Supabase connection OK." : "• Supabase connection degraded."));
        setUploadLog(prev => (prev ? prev + "\n" : "") + (supabaseWasabiOk ? "• Supabase → Wasabi connection OK." : "✖ Supabase → Wasabi connection failed."));
      } catch (e: any) {
        setEdgeStatus((s) => ({ ...s, site_supabase: "down" }));
        setCheckStatus(s => ({ ...s, siteSupabase: false, supabaseWasabi: false }));
        setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Health check failed: ${e?.message || e}`);
      }

      // Step C: Upload test (use multipart FormData to edge function)
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const { data: userData } = await supabase.auth.getUser();
        const session = sessionData?.session;
        if (!session) throw new Error('Not authenticated');

        const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

        const blob = new Blob([new Uint8Array(256)], { type: 'application/octet-stream' });
        const file = new File([blob], 'connectivity.test', { type: 'application/octet-stream' });
        const form = new FormData();
        form.append('file', file);
        form.append('mediaType', 'avatar');
        if (userData?.user?.id) form.append('userId', userData.user.id);

        const res = await fetch(`${baseUrl}/functions/v1/wasabi-upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: apiKey,
          },
          body: form,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) {
          setCheckStatus(s => ({ ...s, upload: false }));
          setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Upload test error: Edge Function returned ${res.status}`);
        } else {
          setCheckStatus(s => ({ ...s, upload: true }));
          setEdgeStatus(s => ({ ...s, supabase_wasabi: 'ok' }));
          setUploadLog(prev => (prev ? prev + "\n" : "") + `• Upload test OK. Key: ${data.key}`);
        }
      } catch (e: any) {
        setCheckStatus(s => ({ ...s, upload: false }));
        const errorMsg = e?.message || String(e);
        if (errorMsg.includes('Failed to fetch') || errorMsg.includes('CORS') || errorMsg.includes('fetch')) {
          setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Upload test error: CORS issue - configure Wasabi bucket CORS to allow PUT from your domain`);
        } else {
          setUploadLog(prev => (prev ? prev + "\n" : "") + `✖ Upload test error: ${errorMsg}`);
        }
      }
    } finally {
      setTesting(false);
    }
  }

  return (

    <div className="min-h-screen w-full bg-gray-50 text-gray-900 p-6 md:p-10">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        offset="80px"
        toastOptions={{
          duration: 4000,
          style: {
            animation: 'slide-in 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards',
          },
        }}
      />
      <style>{`
        @keyframes slide-in {
          0% {
            transform: translateX(120%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        [data-sonner-toaster] {
          top: 80px !important;
        }
        
        [data-sonner-toast] {
          transition: all 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) !important;
        }
      `}</style>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="w-7 h-7" />
            <h1 className="text-2xl md:text-3xl font-semibold">Wasabi API Connection</h1>
          </div>
        </header>

        {/* Topology Triangle + Quick Settings */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topology */}
          <div className="lg:col-span-2 rounded-2xl bg-white border shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Topology</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill status={edgeStatus.site_supabase} />
                <StatusPill status={edgeStatus.supabase_wasabi} />
                <StatusPill status={edgeStatus.site_wasabi} />
              </div>
            </div>

            <div className="relative w-full aspect-[2/1]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420">
                {/* Outer loop */}
                <TriangleLoop pts={[SUPABASE_POS, WASABI_POS, WEBSITE_POS]} status={outerLoopStatus} />

                {/* Website ⇄ Supabase */}
                <DirectionLine from={WEBSITE_POS} to={SUPABASE_POS} status={edgeStatus.site_supabase} offset={-20} clockwise />
                <DirectionLine from={SUPABASE_POS} to={WEBSITE_POS} status={edgeStatus.site_supabase} offset={20} clockwise={false} />

                {/* Supabase ⇄ Wasabi */}
                <DirectionLine from={SUPABASE_POS} to={WASABI_POS} status={edgeStatus.supabase_wasabi} offset={-20} clockwise />
                <DirectionLine from={WASABI_POS} to={SUPABASE_POS} status={edgeStatus.supabase_wasabi} offset={20} clockwise={false} />

                {/* Website ⇄ Wasabi */}
                <DirectionLine from={WEBSITE_POS} to={WASABI_POS} status={edgeStatus.site_wasabi} offset={-20} clockwise />
                <DirectionLine from={WASABI_POS} to={WEBSITE_POS} status={edgeStatus.site_wasabi} offset={20} clockwise={false} />

                {/* Nodes */}
                <Node x={SUPABASE_POS.x} y={SUPABASE_POS.y} label="Supabase" Icon={Server} />
                <Node x={WEBSITE_POS.x} y={WEBSITE_POS.y} label="Website" Icon={Globe} />
                <Node x={WASABI_POS.x} y={WASABI_POS.y} label="Wasabi" Icon={Cloud} />
              </svg>
              <p className="text-xs text-gray-500 mt-2">Parallel curved lines show both directions. Animated dashes & arrows indicate flow; colors reflect health.</p>
            </div>
          </div>

          {/* Live Settings */}
          <div className="rounded-2xl bg-white border shadow-sm p-4 md:p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5" />
              <h3 className="font-semibold">Live Settings</h3>
            </div>

            <label className="text-sm font-medium">Max file size (MB)</label>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max="2048" 
                value={maxFileMB} 
                onChange={(e) => { 
                  const newValue = Math.max(1, Math.min(2048, parseInt(e.target.value) || 1));
                  setMaxFileMB(newValue); 
                  setCredStatus("dirty"); 
                  toast.info(`Max file size updated to ${newValue > 1024 ? `${(newValue / 1024).toFixed(1)} GB` : `${newValue} MB`}`);
                }} 
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="Enter size in MB"
              />
              <span className="text-sm w-20 text-right text-gray-500">
                {maxFileMB > 1024
                  ? `${(maxFileMB / 1024).toFixed(1)} GB`
                  : `${maxFileMB} MB`}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Allowed types</label>
              <div className="flex flex-wrap gap-2">
                {allowTypes.map((t) => (
                  <span key={t} className="px-2 py-1 rounded-full text-xs bg-gray-100 border">{t}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <div className="font-medium">Auto-update Wasabi settings</div>
                <div className="text-gray-500">Keeps CORS & lifecycle in sync</div>
              </div>
              <button
                onClick={() => { 
                  const newValue = !autoUpdate;
                  setAutoUpdate(newValue); 
                  setCredStatus("dirty"); 
                  toast.success(`Auto-update Wasabi settings ${newValue ? 'enabled' : 'disabled'}`);
                }}
                className={`w-12 h-7 rounded-full transition ${autoUpdate ? "bg-green-500" : "bg-gray-300"}`}
                aria-label="toggle auto update"
              >
                <span className={`block h-6 w-6 bg-white rounded-full m-0.5 transition ${autoUpdate ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Advanced Settings */}
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <h4 className="text-sm font-semibold text-gray-700">Advanced Settings</h4>
              
              {/* Auto Cleanup Days */}
              <div>
                <label className="text-sm font-medium">Auto Cleanup (Days)</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="7" 
                    max="365" 
                    value={autoCleanupDays} 
                    onChange={(e) => { 
                      const newValue = Math.max(7, Math.min(365, parseInt(e.target.value) || 7));
                      setAutoCleanupDays(newValue); 
                      setCredStatus("dirty"); 
                      toast.info(`Auto cleanup period updated to ${newValue} days`);
                    }} 
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    placeholder="Enter days (7-365)"
                  />
                  <span className="text-sm w-16 text-right text-gray-500">{autoCleanupDays}d</span>
                </div>
              </div>

              {/* Use Signed URLs Toggle */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Use Signed URLs</div>
                  <div className="text-gray-500">Enhanced security for file access</div>
                </div>
                <button
                  onClick={() => { 
                    const newValue = !useSignedUrls;
                    setUseSignedUrls(newValue); 
                    setCredStatus("dirty"); 
                    toast.success(`Signed URLs ${newValue ? 'enabled' : 'disabled'}`);
                  }}
                  className={`w-12 h-7 rounded-full transition ${useSignedUrls ? "bg-green-500" : "bg-gray-300"}`}
                  aria-label="toggle signed URLs"
                >
                  <span className={`block h-6 w-6 bg-white rounded-full m-0.5 transition ${useSignedUrls ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* File Type Toggles */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Enable File Types</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">Photos</span>
                    <button
                      onClick={() => { 
                        const newValue = !enablePhotos;
                        setEnablePhotos(newValue); 
                        setCredStatus("dirty"); 
                        toast.success(`Photo uploads ${newValue ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-10 h-5 rounded-full transition ${enablePhotos ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`block h-4 w-4 bg-white rounded-full m-0.5 transition ${enablePhotos ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">Videos</span>
                    <button
                      onClick={() => { 
                        const newValue = !enableVideos;
                        setEnableVideos(newValue); 
                        setCredStatus("dirty"); 
                        toast.success(`Video uploads ${newValue ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-10 h-5 rounded-full transition ${enableVideos ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`block h-4 w-4 bg-white rounded-full m-0.5 transition ${enableVideos ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">Audio</span>
                    <button
                      onClick={() => { 
                        const newValue = !enableMusic;
                        setEnableMusic(newValue); 
                        setCredStatus("dirty"); 
                        toast.success(`Audio uploads ${newValue ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-10 h-5 rounded-full transition ${enableMusic ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`block h-4 w-4 bg-white rounded-full m-0.5 transition ${enableMusic ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-lg">
                    <span className="text-sm">Documents</span>
                    <button
                      onClick={() => { 
                        const newValue = !enableDocuments;
                        setEnableDocuments(newValue); 
                        setCredStatus("dirty"); 
                        toast.success(`Document uploads ${newValue ? 'enabled' : 'disabled'}`);
                      }}
                      className={`w-10 h-5 rounded-full transition ${enableDocuments ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`block h-4 w-4 bg-white rounded-full m-0.5 transition ${enableDocuments ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Credential Changes */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Recent Changes</h4>
                {loadingChanges && <RefreshCcw className="w-4 h-4 animate-spin text-gray-400" />}
              </div>
              
              {recentChanges.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {recentChanges.map((change) => (
                    <div key={change.id} className="text-xs p-2 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-600">
                          {maskEmail(change.changed_by_email, change.changed_by_role)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatChangeTime(change.changed_at)}
                        </span>
                      </div>
                      <div className="text-gray-500 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {change.changed_by_role.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        Updated: {change.changes.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 py-2">
                  No recent credential changes
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Storage Analytics */}
        <section className="rounded-2xl bg-white border shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Storage Analytics</h2>
            </div>
            <div className="flex gap-2 items-center">
              <select
                className="rounded-lg border p-2 text-sm"
                value={chartRange}
                onChange={(e) => setChartRange(e.target.value)}
                title="Choose analytics window"
              >
                <optgroup label="Daily">
                  <option value="daily-1">Daily (1)</option>
                  <option value="daily-3">Daily (3)</option>
                  <option value="daily-5">Daily (5)</option>
                  <option value="daily-7">Daily (7)</option>
                </optgroup>
                <optgroup label="Monthly">
                  <option value="monthly-1">Monthly (1)</option>
                  <option value="monthly-3">Monthly (3)</option>
                  <option value="monthly-6">Monthly (6)</option>
                  <option value="monthly-12">Monthly (12)</option>
                </optgroup>
                <optgroup label="Yearly">
                  <option value="yearly-1">Yearly (1)</option>
                </optgroup>
                <optgroup label="Multi‑year">
                  <option value="years-2">2 years</option>
                  <option value="years-3">3 years</option>
                  <option value="years-5">5 years</option>
                  <option value="years-7">7 years</option>
                  <option value="years-10">10 years</option>
                  <option value="years-15">15 years</option>
                  <option value="years-20">20 years</option>
                  <option value="years-30">30 years</option>
                  <option value="years-40">40 years</option>
                  <option value="years-50">50 years</option>
                </optgroup>
              </select>
              <select
                className="rounded-lg border p-2 text-sm"
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                title="Choose download format"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
                <option value="tsv">TSV</option>
                <option value="png">PNG</option>
                <option value="pdf">PDF</option>
              </select>
              <button
                onClick={async () => {
                  // Build data rows from chartData
                  const rows = chartData.map((d) => ({ label: d.label, uploads: d.uploads }));
                  const toCSV = (sep: string) => {
                    const header = `label${sep}uploads`;
                    const body = rows.map((r) => `${r.label}${sep}${r.uploads}`).join("\n");
                    return header + "\n" + body;
                  };
                  const download = (filename: string, mime: string, data: string | Blob) => {
                    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  };

                  try {
                    if (downloadFormat === "csv") {
                      download(`analytics_${chartRange}.csv`, "text/csv", toCSV(","));
                      toast.success(`Analytics data downloaded as CSV`);
                    } else if (downloadFormat === "tsv") {
                      download(`analytics_${chartRange}.tsv`, "text/tab-separated-values", toCSV("\t"));
                      toast.success(`Analytics data downloaded as TSV`);
                    } else if (downloadFormat === "json") {
                      download(`analytics_${chartRange}.json`, "application/json", JSON.stringify(rows, null, 2));
                      toast.success(`Analytics data downloaded as JSON`);
                    } else if (downloadFormat === "png" || downloadFormat === "pdf") {
                      // Convert the Recharts SVG to PNG via <canvas>
                      const wrap = analyticsRef.current;
                      const svg = wrap?.querySelector("svg");
                      if (!svg) {
                        toast.error("Unable to export chart: SVG not found");
                        return;
                      }
                      const serializer = new XMLSerializer();
                      const svgStr = serializer.serializeToString(svg);
                      const img = new Image();
                      const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
                      const url = URL.createObjectURL(svgBlob);
                      await new Promise<void>((resolve) => {
                        img.onload = () => resolve();
                        img.src = url;
                      });
                      const canvas = document.createElement("canvas");
                      canvas.width = svg.clientWidth || 800;
                      canvas.height = svg.clientHeight || 400;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) {
                        toast.error("Unable to export chart: Canvas context not available");
                        return;
                      }
                      ctx.fillStyle = "#ffffff";
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      ctx.drawImage(img, 0, 0);
                      URL.revokeObjectURL(url);

                      const pngDataUrl = canvas.toDataURL("image/png");
                      if (downloadFormat === "png") {
                        const pngBlob = await (await fetch(pngDataUrl)).blob();
                        download(`analytics_${chartRange}.png`, "image/png", pngBlob);
                        toast.success(`Analytics chart downloaded as PNG`);
                      } else {
                        const { jsPDF } = await import("jspdf");
                        const pdf = new jsPDF({ orientation: "l", unit: "px", format: [canvas.width, canvas.height + 120] });
                        pdf.setFontSize(14);
                        pdf.text("Wasabi Storage Analytics", 20, 24);
                        pdf.text(`Range: ${chartRange}`, 20, 44);
                        pdf.addImage(pngDataUrl, "PNG", 20, 60, canvas.width - 40, canvas.height - 80, undefined, "FAST");
                        pdf.text(`Total Objects: ${nf(analytics.objects)}`, 20, canvas.height + 20);
                        pdf.text(`Total Storage Used: ${analytics.totalGB} GB`, 20, canvas.height + 40);
                        pdf.text(`Estimated Monthly Cost: $${((analytics.totalGB / 1024) * COST_PER_TB).toFixed(2)}`, 20, canvas.height + 60);
                        pdf.text(`Egress (30d): ${analytics.monthEgressGB} GB`, 20, canvas.height + 80);
                        pdf.save(`analytics_${chartRange}.pdf`);
                        toast.success(`Analytics report downloaded as PDF`);
                      }
                    }
                  } catch (error: any) {
                    toast.error(`Download failed: ${error.message}`);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 border px-3 py-2 text-sm shadow-sm"
              >
                Download
              </button>
              <button
                onClick={async () => {
                  const rows = chartData.map((d) => ({ label: d.label, uploads: d.uploads }));
                  const csv = ["label,uploads", ...rows.map((r) => `${r.label},${r.uploads}`)].join("\n");
                  try {
                    await navigator.clipboard.writeText(csv);
                    toast.success("Analytics data copied to clipboard");
                  } catch (error) {
                    toast.error("Failed to copy analytics data to clipboard");
                  }
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 border px-3 py-2 text-sm shadow-sm"
                title="Copy analytics table to clipboard"
              >
                Copy
              </button>
              <button onClick={async () => {
                try {
                  await refreshAnalytics();
                  toast.success("Storage analytics refreshed");
                } catch (error: any) {
                  toast.error(`Failed to refresh analytics: ${error.message}`);
                }
              }} className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 border px-4 py-2 text-sm shadow-sm">
                <RefreshCcw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-green-100 p-4 bg-green-50">
              <div className="text-sm text-green-700">Photos</div>
              <div className="text-2xl font-semibold text-green-800">{nf(analytics.categories.photos)}</div>
              <div className="text-xs text-green-600 mt-1">Image files</div>
            </div>
            <div className="rounded-xl border border-red-100 p-4 bg-red-50">
              <div className="text-sm text-red-700">Videos</div>
              <div className="text-2xl font-semibold text-red-800">{nf(analytics.categories.videos)}</div>
              <div className="text-xs text-red-600 mt-1">Video files</div>
            </div>
            <div className="rounded-xl border border-blue-100 p-4 bg-blue-50">
              <div className="text-sm text-blue-700">Audio</div>
              <div className="text-2xl font-semibold text-blue-800">{nf(analytics.categories.audio)}</div>
              <div className="text-xs text-blue-600 mt-1">Audio files</div>
            </div>
            <div className="rounded-xl border border-amber-200 p-4 bg-amber-50">
              <div className="text-sm text-amber-700">Documents</div>
              <div className="text-2xl font-semibold text-amber-800">{nf(analytics.categories.documents)}</div>
              <div className="text-xs text-amber-600 mt-1">Text & docs</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border border-orange-100 p-4 bg-orange-50">
              <div className="text-sm text-orange-700">Total Objects</div>
              <div className="text-2xl font-semibold text-orange-800">{nf(analytics.objects)}</div>
              <div className="text-xs text-orange-600 mt-1">Files stored</div>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-100">
              <div className="text-sm text-slate-700">Total Storage Used</div>
              <div className="text-2xl font-semibold text-slate-800">{formatFileSize(analytics.totalBytes || 0)}</div>
              <div className="text-xs text-slate-600 mt-1">Space consumed</div>
            </div>
            <div className="rounded-xl border border-emerald-100 p-4 bg-emerald-50">
              <div className="text-sm text-emerald-700">Estimated Monthly Cost</div>
              <div className="text-2xl font-semibold text-emerald-800">${((analytics.totalGB / 1024) * COST_PER_TB).toFixed(4)}</div>
              <div className="text-xs text-emerald-600 mt-1">@$6.99/TB/month</div>
            </div>
            <div className="rounded-xl border border-pink-100 p-4 bg-pink-50">
              <div className="text-sm text-pink-700">Egress (30d)</div>
              <div className="text-2xl font-semibold text-pink-800">{formatFileSize((analytics.monthEgressGB || 0) * 1024 * 1024 * 1024)}</div>
              <div className="text-xs text-pink-600 mt-1">Data transferred</div>
            </div>
          </div>

          <div ref={analyticsRef} className="w-full space-y-6">
            {/* Chart Section */}
            <div className="h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="uploads" 
                    fill="url(#colorGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Connection Test (Admin, failure breakdown) */}
        <section className="grid grid-cols-1 gap-6">
          <div className="rounded-2xl bg-white border shadow-sm p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                <h3 className="font-semibold">Connection Test (Admin)</h3>
              </div>
              <StatusPill status={outerLoopStatus} />
            </div>

            {/* Individual Test Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className={`rounded-lg border p-3 text-center ${checkStatus.siteWasabi === true ? 'bg-green-50 border-green-200' : checkStatus.siteWasabi === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-center mb-1">
                  {checkStatus.siteWasabi === true ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : checkStatus.siteWasabi === false ? <XCircle className="w-4 h-4 text-red-600" /> : <RefreshCcw className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-xs font-medium">Website → Wasabi</div>
                <div className="text-xs text-gray-500">Direct HEAD request</div>
              </div>
              <div className={`rounded-lg border p-3 text-center ${checkStatus.siteSupabase === true ? 'bg-green-50 border-green-200' : checkStatus.siteSupabase === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-center mb-1">
                  {checkStatus.siteSupabase === true ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : checkStatus.siteSupabase === false ? <XCircle className="w-4 h-4 text-red-600" /> : <RefreshCcw className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-xs font-medium">Website → Supabase</div>
                <div className="text-xs text-gray-500">Edge function health</div>
              </div>
              <div className={`rounded-lg border p-3 text-center ${checkStatus.supabaseWasabi === true ? 'bg-green-50 border-green-200' : checkStatus.supabaseWasabi === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-center mb-1">
                  {checkStatus.supabaseWasabi === true ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : checkStatus.supabaseWasabi === false ? <XCircle className="w-4 h-4 text-red-600" /> : <RefreshCcw className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-xs font-medium">Supabase → Wasabi</div>
                <div className="text-xs text-gray-500">S3 API connectivity</div>
              </div>
              <div className={`rounded-lg border p-3 text-center ${checkStatus.upload === true ? 'bg-green-50 border-green-200' : checkStatus.upload === false ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-center mb-1">
                  {checkStatus.upload === true ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : checkStatus.upload === false ? <XCircle className="w-4 h-4 text-red-600" /> : <RefreshCcw className="w-4 h-4 text-gray-400" />}
                </div>
                <div className="text-xs font-medium">Upload Test</div>
                <div className="text-xs text-gray-500">Presigned URL + PUT</div>
              </div>
            </div>

            <div className="rounded-xl border bg-gray-50 p-3 text-sm text-gray-700">
              <p className="font-medium mb-1">Test Log</p>
              <pre className="whitespace-pre-wrap text-xs" style={{ color: uploadLog.includes('✖') ? '#dc2626' : '#374151' }}>{uploadLog || "No test results yet. Click 'Run Connection Test' to start."}</pre>
              {/(^|\n).*403.*$/m.test(uploadLog) && (
                <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-2 text-xs text-blue-800 flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="font-medium">Private Bucket Detected (403)</div>
                    <div>
                      403 = Forbidden. This is normal for private buckets - it means the bucket exists and is reachable, but public listing is disabled for security. Your uploads and signed URLs work fine with private buckets.
                    </div>
                  </div>
                </div>
              )}
              {/(^|\n).*CORS.*$/m.test(uploadLog) && (
                <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <div>
                    <div className="font-medium">CORS Configuration Required</div>
                    <div>
                      Your Wasabi bucket needs CORS configured to allow uploads from web browsers. In Wasabi console, go to your bucket → Properties → CORS → Add this rule:
                      <br />
                      <code className="bg-yellow-100 px-1 rounded text-xs">AllowedOrigins: * | AllowedMethods: GET,PUT,POST,DELETE | AllowedHeaders: *</code>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap justify-between items-center">
              <div className="flex gap-3 flex-wrap">
              <button
                onClick={async () => {
                  await runConnectionTest();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 text-sm shadow-sm"
                disabled={testing}
              >
                <Upload className="w-4 h-4" /> Run Connection Test
              </button>
              </div>
            </div>
          </div>
        </section>

        {/* Wasabi Edge Functions Tests */}
        <section className="space-y-6">
          <WasabiEdgeTestsOnly />
        </section>
      </div>
    </div>
  );
};

// --- Wasabi Edge Functions Tests Component ---
const WasabiEdgeTestsOnly = () => {
  // --- Types ---------------------------------------------------------------
  type ConnStatusEdge = "ok" | "warn" | "down" | "idle";

  const STATUS_COLORS_EDGE: Record<ConnStatusEdge, string> = {
    ok: "bg-green-50 text-green-700 border-green-600",
    warn: "bg-yellow-50 text-yellow-700 border-yellow-600",
    down: "bg-red-50 text-red-700 border-red-600",
    idle: "bg-gray-50 text-gray-600 border-gray-400",
  };

  const STATUS_ICON_EDGE: Record<ConnStatusEdge, any> = {
    ok: CheckCircle2,
    warn: AlertTriangle,
    down: XCircle,
    idle: RefreshCcw,
  };

  // --- Config: your Edge Functions ----------------------------------------
  const baseFunctionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  const EDGE_FUNCTIONS = [
    { key: "wasabi-delete",   url: `${baseFunctionsUrl}/wasabi-delete` },
    { key: "wasabi-download", url: `${baseFunctionsUrl}/wasabi-download` },
    { key: "wasabi-list",     url: `${baseFunctionsUrl}/wasabi-list` },
    { key: "wasabi-metadata", url: `${baseFunctionsUrl}/wasabi-metadata` },
    { key: "wasabi-security", url: `${baseFunctionsUrl}/wasabi-security` },
    { key: "wasabi-upload",   url: `${baseFunctionsUrl}/wasabi-upload` },
    { key: "wasabi-health",   url: `${baseFunctionsUrl}/wasabi-health` },
    { key: "wasabi-config",   url: `${baseFunctionsUrl}/wasabi-config` },
    { key: "wasabi-get-url",  url: `${baseFunctionsUrl}/wasabi-get-url` },
    { key: "wasabi-proxy",    url: "https://axctozdoysadqvmtdawm.supabase.co/functions/v1/wasabi-proxy" },
    { key: "test-s3-connection", url: "https://axctozdoysadqvmtdawm.supabase.co/functions/v1/test-s3-connection" },
  ] as const;

  // --- Component -----------------------------------------------------------
  const [statuses, setStatuses] = useState<Record<string, ConnStatusEdge>>(() => {
    const s: Record<string, ConnStatusEdge> = {};
    EDGE_FUNCTIONS.forEach(f => (s[f.key] = "idle"));
    return s;
  });
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [log, setLog] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [lastFileKey, setLastFileKey] = useState<string | null>(null);

  // Fetch available files to use for testing
  const fetchValidTestKey = async (): Promise<string | null> => {
    try {
      const { data } = await supabase.functions.invoke('wasabi-list', { body: { maxKeys: 5 } });
      if (data?.files && data.files.length > 0) {
        const key = data.files[0].Key || data.files[0].key || data.files[0].file_key;
        if (key) {
          setLastFileKey(key);
          return key;
        }
      }
    } catch (error) {
      console.log('Could not fetch files for testing:', error);
    }
    return null;
  };

  const overall: ConnStatusEdge = useMemo(() => {
    const vals = Object.values(statuses);
    if (vals.every(v => v === "ok")) return "ok";
    if (vals.some(v => v === "down")) return "down";
    if (vals.some(v => v === "warn")) return "warn";
    return "idle";
  }, [statuses]);

  const append = (line: string) => setLog(prev => (prev ? prev + "\n" : "") + line);

  const testOne = async (key: string) => {
    setStatuses(s => ({ ...s, [key]: "idle" }));
    try {
      append(`▶ Testing ${key} ...`);
      
      let testBody;
      if (key === 'wasabi-upload') {
        // Use multipart upload with a tiny inline file
        const { data: sessionData } = await supabase.auth.getSession();
        const { data: userData } = await supabase.auth.getUser();
        const session = sessionData?.session;
        if (!session) throw new Error('No session');
        const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

        const blob = new Blob(["edge probe from UI"], { type: 'text/plain' });
        const file = new File([blob], 'edge-probe.txt', { type: 'text/plain' });
        const form = new FormData();
        form.append('file', file);
        form.append('mediaType', 'uploads'); // Generic folder, not profile/avatar/cover
        form.append('updateProfile', 'false'); // Never modify profiles table during tests
        if (userData?.user?.id) form.append('userId', userData.user.id);

        const res = await fetch(`${baseUrl}/functions/v1/wasabi-upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: apiKey,
          },
          body: form,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data) {
          setStatuses(s => ({ ...s, [key]: 'down' }));
          append(`✖ ${key} responded ${res.status}`);
          return;
        }
        const fk = data?.key || data?.fileKey || data?.file_key;
        if (fk) {
          setLastFileKey(fk);
          append(`• Saved file key: ${fk}`);
        }
        setStatuses(s => ({ ...s, [key]: 'ok' }));
        append(`✓ ${key} responded ${res.status}`);
        return;
      } else if (key === 'wasabi-get-url') {
        // Fetch a valid key first, or use last uploaded
        const validKey = lastFileKey || await fetchValidTestKey();
        testBody = { key: validKey || 'connectivity-tests/test-file.txt', expires: 300 };
        if (validKey) {
          append(`• Using valid file key: ${validKey.split('/').pop()}`);
        }
      } else if (key === 'wasabi-proxy') {
        // Fetch a valid key first, or use last uploaded
        const validKey = lastFileKey || await fetchValidTestKey();
        testBody = { key: validKey || 'connectivity-tests/test-file.txt' };
        if (validKey) {
          append(`• Using valid file key: ${validKey.split('/').pop()}`);
        }
      } else if (key === 'wasabi-download' || key === 'wasabi-metadata') {
        // Use health check for endpoint availability test
        const { data, error } = await supabase.functions.invoke(key, {
          body: { ping: true },
        });
        
        // Check for health parameter support by calling with ?health=1
        const baseUrl = import.meta.env.VITE_SUPABASE_URL as string;
        const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        
        const healthUrl = `${baseUrl}/functions/v1/${key}?health=1`;
        const healthRes = await fetch(healthUrl, {
          method: 'POST',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            apikey: apiKey,
          },
        });
        
        if (healthRes.status === 204) {
          setStatuses(s => ({ ...s, [key]: 'ok' }));
          setCodes(c => ({ ...c, [key]: '204' }));
          append(`✓ ${key} health check OK (204)`);
          return;
        }
        
        // Fall through to normal test if health check fails
        testBody = { ping: true };
      } else if (key === 'wasabi-delete') {
        // These functions require a key in the request body
        const validKey = lastFileKey || await fetchValidTestKey();
        testBody = { key: validKey || 'connectivity-tests/test-file.txt' };
        if (validKey) {
          append(`• Using valid file key: ${validKey.split('/').pop()}`);
        }
      } else {
        testBody = { ping: true };
      }
      
      const { data, error } = await supabase.functions.invoke(key, {
        body: testBody,
      });

      if (!error) {
        setStatuses(s => ({ ...s, [key]: 'ok' }));
        setCodes(c => ({ ...c, [key]: '200' }));
        append(`✓ ${key} responded 200`);
        return; // prevent false 'network' logs
      }

      // Map error to an HTTP-like status code when available
      const statusRaw = (error as any)?.status ?? (error as any)?.code ?? (error as any)?.context?.status;
      let status = typeof statusRaw === 'number' ? statusRaw : Number(statusRaw);
      if (Number.isNaN(status)) {
        const msg: string = (error as any)?.message || '';
        const m = msg.match(/\b(\d{3})\b/);
        status = m ? Number(m[1]) : NaN;
      }
      const statusNum = status;

      if (!Number.isNaN(statusNum) && statusNum >= 400 && statusNum < 500) {
        setStatuses(s => ({ ...s, [key]: "warn" }));
        setCodes(c => ({ ...c, [key]: String(statusNum) }));
        append(`⚠ ${key} responded ${statusNum}`);
        return;
      }

      // 5xx or network
      setStatuses(s => ({ ...s, [key]: "down" }));
      setCodes(c => ({ ...c, [key]: String(statusNum || 'net') }));
      append(`✖ ${key} responded ${statusNum || 'network'}`);
    } catch (e: any) {
      setStatuses(s => ({ ...s, [key]: "down" }));
      setCodes(c => ({ ...c, [key]: "net" }));
      append(`✖ ${key} network error: ${e?.message || e}`);
    }
  };

  const testAll = async () => {
    if (running) return;
    setRunning(true);
    setLog("");
    for (const f of EDGE_FUNCTIONS) {
      // sequential to make logs easy to follow
      // eslint-disable-next-line no-await-in-loop
      await testOne(f.key);
    }
    setRunning(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-6 h-6" />
          <h1 className="text-2xl font-semibold">Wasabi & Supabase Edge – Connection Tests</h1>
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${STATUS_COLORS_EDGE[overall]}`}
        >
          {(() => { const I = STATUS_ICON_EDGE[overall]; return <I className="w-4 h-4" />; })()}
          Overall: {overall.toUpperCase()}
        </motion.span>
      </header>

      {/* Controls */}
      <div className="rounded-2xl bg-white border shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Run Tests</h2>
          <div className="flex gap-2">
            <button
              onClick={testAll}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 px-4 py-2 text-sm shadow-sm"
            >
              <Play className="w-4 h-4" /> Run All (sequential)
            </button>
            <button
              onClick={() => {
                setLog("");
                setCodes({});
                setLastFileKey(null);
                setStatuses(() => {
                  const reset: Record<string, ConnStatusEdge> = {} as any;
                  EDGE_FUNCTIONS.forEach(f => (reset[f.key] = "idle"));
                  return reset;
                });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 border px-4 py-2 text-sm shadow-sm"
            >
              <RefreshCcw className="w-4 h-4" /> Clear Log
            </button>
          </div>
        </div>

        {/* List of functions */}
        <div className="divide-y">
          {EDGE_FUNCTIONS.map((f) => {
            const st = statuses[f.key];
            const Icon = STATUS_ICON_EDGE[st];
            return (
              <div key={f.key} className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded border">{f.key}</span>
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${STATUS_COLORS_EDGE[st]}`}>
                      <Icon className="w-3.5 h-3.5" /> {st.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate">{f.url}</div>
                  {codes[f.key] && (
                    <div className="text-xs text-gray-600">Last status: {codes[f.key]}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => testOne(f.key)}
                    disabled={running}
                    className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-gray-100 border px-3 py-1.5 text-sm shadow-sm"
                  >
                    <Play className="w-4 h-4" /> Run test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log */}
      <div className="rounded-2xl bg-white border shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Test Log</h3>
          <span className="text-xs text-gray-500">Green = 2xx, Yellow = 4xx (likely auth), Red = network/5xx</span>
        </div>
        <pre className="whitespace-pre-wrap text-xs text-gray-800 bg-gray-50 border rounded-xl p-3 max-h-72 overflow-auto">{log || "No runs yet. Click Run All or Run test on any row."}</pre>
      </div>
    </div>
  );
};

export default WasabiCloudPage;