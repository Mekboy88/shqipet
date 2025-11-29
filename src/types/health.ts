export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'offline';
export type ConnectionStatus = 'stable' | 'latency' | 'down';

export interface HealthMetrics {
  uptime: number;
  latency: number;
  errorRate: number;
  lastCheck: string;
  incidents24h: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface ServiceHealth {
  id: string;
  name: string;
  status: HealthStatus;
  online: boolean;
  latency_ms: number;
  metrics: HealthMetrics;
  details: {
    [key: string]: string | number | boolean;
  };
  position: { x: number; y: number };
}

export interface ConnectionHealth {
  from: string;
  to: string;
  status: ConnectionStatus;
  latency: number;
  errorRate: number;
  bandwidth: number;
}

export interface HealthPrediction {
  service: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  suggestedAction?: string;
}

export interface HealthReport {
  timestamp: string;
  overallScore: number;
  services: ServiceHealth[];
  connections: ConnectionHealth[];
  predictions: HealthPrediction[];
  logs: HealthLogEntry[];
  alerts: HealthAlert[];
}

export interface HealthLogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  service: string;
  message: string;
  details?: any;
}

export interface HealthAlert {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  service: string;
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}