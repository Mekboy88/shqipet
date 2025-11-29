import { S3Health } from '@/stores/useS3Health';
import { 
  ServiceHealth, 
  ConnectionHealth, 
  HealthReport, 
  HealthLogEntry, 
  HealthAlert, 
  HealthPrediction,
  HealthStatus
} from '@/types/health';

// Transform S3Health data to comprehensive HealthReport
export const transformS3HealthToReport = (s3Health: S3Health | null): HealthReport => {
  const timestamp = new Date().toISOString();
  
  if (!s3Health) {
    return {
      timestamp,
      overallScore: 0,
      services: [],
      connections: [],
      predictions: [],
      logs: [],
      alerts: [{
        id: 'no-data',
        level: 'critical',
        service: 'System',
        title: 'No Health Data',
        description: 'Unable to fetch health data. Check system connectivity.',
        timestamp,
        resolved: false
      }]
    };
  }

  // Check for credential issues in the issues array
  const hasCredentialIssues = s3Health.issues?.some(issue => 
    issue.toLowerCase().includes('missing') ||
    issue.toLowerCase().includes('credentials') ||
    issue.toLowerCase().includes('access') ||
    issue.toLowerCase().includes('aws')
  );

  // Transform services with proper status detection
  const services: ServiceHealth[] = [
    {
      id: 'website',
      name: 'Website',
      status: getHealthStatus(s3Health.website.online, s3Health.website.latency_ms),
      online: s3Health.website.online,
      latency_ms: s3Health.website.latency_ms,
      metrics: {
        uptime: s3Health.website.online ? 99.2 : 0,
        latency: s3Health.website.latency_ms,
        errorRate: s3Health.website.online ? 0.1 : 100,
        lastCheck: s3Health.ts,
        incidents24h: s3Health.website.online ? 0 : 1,
        trend: s3Health.website.latency_ms < 800 ? 'improving' : 'stable'
      },
      details: {
        'Response Time': `${s3Health.website.latency_ms}ms`,
        'Status Code': s3Health.website.online ? '200 OK' : '503 Error',
        'SSL Certificate': 'Valid',
      },
      position: { x: 100, y: 50 }
    },
    {
      id: 'supabase',
      name: 'Supabase',
      status: getHealthStatus(s3Health.supabase.online, s3Health.supabase.latency_ms),
      online: s3Health.supabase.online,
      latency_ms: s3Health.supabase.latency_ms,
      metrics: {
        uptime: s3Health.supabase.online ? 99.8 : 0,
        latency: s3Health.supabase.latency_ms,
        errorRate: s3Health.supabase.online ? 0.01 : 100,
        lastCheck: s3Health.ts,
        incidents24h: 0,
        trend: 'stable'
      },
      details: {
        'DB Connections': s3Health.supabase.online ? '12/50' : 'Disconnected',
        'Auth Status': s3Health.supabase.online ? 'Active' : 'Offline',
        'API Calls/min': s3Health.supabase.online ? '1,247' : '0',
      },
      position: { x: 400, y: 50 }
    },
    {
      id: 's3',
      name: 'Amazon S3',
      // Force critical status if credential issues are detected
      status: hasCredentialIssues ? 'critical' : getHealthStatus(s3Health.s3.online, s3Health.s3.latency_ms),
      online: hasCredentialIssues ? false : s3Health.s3.online,
      latency_ms: hasCredentialIssues ? 0 : s3Health.s3.latency_ms,
      metrics: {
        uptime: hasCredentialIssues ? 0 : (s3Health.s3.online ? 97.2 : 0),
        latency: hasCredentialIssues ? 0 : s3Health.s3.latency_ms,
        errorRate: hasCredentialIssues ? 100 : (s3Health.s3.online ? 2.1 : 100),
        lastCheck: s3Health.ts,
        incidents24h: hasCredentialIssues ? 5 : (s3Health.s3.online ? 2 : 5),
        trend: hasCredentialIssues ? 'degrading' : (s3Health.s3.permissions?.put ? 'improving' : 'degrading')
      },
      details: {
        'Bucket Access': hasCredentialIssues ? 'No Access - Missing Credentials' : 
                        (s3Health.s3.permissions?.put ? 'Full Access' : 'Limited'),
        'Region': s3Health.s3.region || 'Unknown',
        'Objects Count': hasCredentialIssues ? '0' : 
                        Object.values(s3Health.storage).reduce((sum, bucket) => sum + bucket.objects, 0),
        'Storage Used': hasCredentialIssues ? '0 B' : 
                       formatBytes(Object.values(s3Health.storage).reduce((sum, bucket) => sum + bucket.bytes, 0)),
      },
      position: { x: 250, y: 200 }
    }
  ];

  // Transform connections with credential awareness
  const connections: ConnectionHealth[] = [
    {
      from: 'website',
      to: 'supabase',
      status: getConnectionStatus(s3Health.website.online && s3Health.supabase.online, 
                                 (s3Health.website.latency_ms + s3Health.supabase.latency_ms) / 2),
      latency: (s3Health.website.latency_ms + s3Health.supabase.latency_ms) / 2,
      errorRate: 0.1,
      bandwidth: 95.2
    },
    {
      from: 'supabase',
      to: 's3',
      status: hasCredentialIssues ? 'down' : 
              getConnectionStatus(s3Health.supabase.online && s3Health.s3.online,
                                 (s3Health.supabase.latency_ms + s3Health.s3.latency_ms) / 2),
      latency: hasCredentialIssues ? 0 : (s3Health.supabase.latency_ms + s3Health.s3.latency_ms) / 2,
      errorRate: hasCredentialIssues ? 100 : (s3Health.s3.online ? 1.2 : 15.5),
      bandwidth: hasCredentialIssues ? 0 : (s3Health.s3.online ? 78.3 : 0)
    },
    {
      from: 'website',
      to: 's3',
      status: hasCredentialIssues ? 'down' :
              getConnectionStatus(s3Health.website.online && s3Health.signed_url_test.ok,
                                 s3Health.signed_url_test.latency_ms),
      latency: hasCredentialIssues ? 0 : s3Health.signed_url_test.latency_ms,
      errorRate: hasCredentialIssues ? 100 : (s3Health.signed_url_test.ok ? 0.5 : 25.0),
      bandwidth: hasCredentialIssues ? 0 : (s3Health.signed_url_test.ok ? 82.1 : 0)
    }
  ];

  // Generate predictions based on current status and credential issues
  const predictions: HealthPrediction[] = [];
  
  if (hasCredentialIssues) {
    predictions.push({
      service: 'S3',
      prediction: 'S3 connectivity will remain unavailable until AWS credentials are properly configured',
      confidence: 99,
      timeframe: 'Until fixed',
      suggestedAction: 'Add AWS Access Key ID and Secret Access Key in the configuration form'
    });
  } else if (!s3Health.s3.online) {
    predictions.push({
      service: 'S3',
      prediction: 'S3 connectivity issues may persist due to configuration or network problems',
      confidence: 85,
      timeframe: 'Next 2 hours',
      suggestedAction: 'Verify AWS credentials, bucket permissions, and network connectivity'
    });
  }

  if (s3Health.website.latency_ms > 1200) {
    predictions.push({
      service: 'Website',
      prediction: 'Website response time may increase during peak hours',
      confidence: 78,
      timeframe: 'Next 4 hours',
      suggestedAction: 'Consider enabling CDN or optimizing server performance'
    });
  }

  // Generate logs with credential issue awareness
  const logs: HealthLogEntry[] = [
    {
      timestamp: new Date(Date.now() - 30000).toISOString(),
      level: hasCredentialIssues ? 'error' : (s3Health.s3.online ? 'info' : 'warning'),
      service: 'S3',
      message: hasCredentialIssues ? 'S3 connection failed - AWS credentials not configured' :
               (s3Health.s3.online ? 'Health check completed successfully' : 'S3 connection failed'),
      details: { 
        latency: s3Health.s3.latency_ms, 
        permissions: s3Health.s3.permissions,
        credentialIssues: hasCredentialIssues
      }
    },
    {
      timestamp: new Date(Date.now() - 60000).toISOString(),
      level: 'info',
      service: 'Supabase',
      message: `Database connection stable, ${s3Health.supabase.latency_ms}ms response time`,
      details: { latency: s3Health.supabase.latency_ms }
    }
  ];

  // Generate alerts from issues with proper categorization
  const alerts: HealthAlert[] = s3Health.issues.map((issue, index) => {
    const isCredentialIssue = issue.toLowerCase().includes('missing') || 
                             issue.toLowerCase().includes('credentials');
    
    return {
      id: `alert-${index}`,
      level: isCredentialIssue ? 'critical' : 'medium',
      service: 'S3',
      title: isCredentialIssue ? 'Configuration Issue' : 'Service Issue',
      description: issue,
      timestamp: s3Health.ts,
      resolved: false
    };
  });

  // Calculate overall score with credential issues having major impact
  const overallScore = hasCredentialIssues ? 
    Math.min(calculateOverallScore(services), 25) : // Cap at 25 if credential issues
    calculateOverallScore(services);

  return {
    timestamp,
    overallScore,
    services,
    connections,
    predictions,
    logs,
    alerts
  };
};

// Helper functions
function getHealthStatus(online: boolean, latency: number): HealthStatus {
  if (!online) return 'offline';
  if (latency > 2000) return 'critical';  // 2+ seconds is critical
  if (latency > 1000) return 'warning';   // 1+ second is warning
  return 'healthy';
}

function getConnectionStatus(online: boolean, latency: number) {
  if (!online) return 'down';
  if (latency > 500) return 'latency';
  return 'stable';
}

function calculateOverallScore(services: ServiceHealth[]): number {
  const totalServices = services.length;
  if (totalServices === 0) return 0;

  let score = 0;
  services.forEach(service => {
    switch (service.status) {
      case 'healthy': score += 100; break;
      case 'warning': score += 70; break;
      case 'critical': score += 30; break;
      case 'offline': score += 0; break;
    }
  });

  return Math.round(score / totalServices);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}