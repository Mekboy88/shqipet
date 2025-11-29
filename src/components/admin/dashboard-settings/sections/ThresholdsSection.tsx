import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface ThresholdsSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const ThresholdsSection: React.FC<ThresholdsSectionProps> = ({
  settings,
  updateSettings
}) => {
  const healthMetrics = [
    { id: 'uptime', label: 'System Uptime', unit: '%', min: 0, max: 100, step: 1 },
    { id: 'apiLatency', label: 'API Response Time', unit: 'ms', min: 0, max: 5000, step: 50 },
    { id: 'dbLatency', label: 'Database Latency', unit: 'ms', min: 0, max: 1000, step: 10 },
    { id: 'errorRate', label: 'Error Rate', unit: '%', min: 0, max: 100, step: 0.1 },
    { id: 'memoryUsage', label: 'Memory Usage', unit: '%', min: 0, max: 100, step: 1 },
    { id: 'diskUsage', label: 'Disk Usage', unit: '%', min: 0, max: 100, step: 1 },
  ];

  const anomalyRules = [
    { id: 'usersDrop', label: 'Online Users Drop', description: 'Alert when online users drop by percentage vs median' },
    { id: 'trafficSpike', label: 'Traffic Spike', description: 'Alert when traffic increases significantly' },
    { id: 'errorSpike', label: 'Error Rate Spike', description: 'Alert when error rate exceeds normal patterns' },
    { id: 'slowResponse', label: 'Response Time Degradation', description: 'Alert when response times increase' },
  ];

  const getThreshold = (metricId: string, level: 'warning' | 'critical') => {
    return settings?.thresholds?.[metricId]?.[level] || 0;
  };

  const updateThreshold = (metricId: string, level: 'warning' | 'critical', value: number) => {
    updateSettings({
      thresholds: {
        ...settings?.thresholds,
        [metricId]: {
          ...settings?.thresholds?.[metricId],
          [level]: value
        }
      }
    });
  };

  const getAnomalyRule = (ruleId: string) => {
    return settings?.thresholds?.anomalies?.[ruleId] || { enabled: false, threshold: 30, timeWindow: '7d' };
  };

  const updateAnomalyRule = (ruleId: string, updates: any) => {
    updateSettings({
      thresholds: {
        ...settings?.thresholds,
        anomalies: {
          ...settings?.thresholds?.anomalies,
          [ruleId]: {
            ...getAnomalyRule(ruleId),
            ...updates
          }
        }
      }
    });
  };

  const getStatusColor = (value: number, warning: number, critical: number, isReverse = false) => {
    if (isReverse) {
      if (value <= critical) return 'text-red-500';
      if (value <= warning) return 'text-amber-500';
      return 'text-green-500';
    } else {
      if (value >= critical) return 'text-red-500';
      if (value >= warning) return 'text-amber-500';
      return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Health Thresholds</CardTitle>
          <CardDescription>Set warning and critical thresholds for system health metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {healthMetrics.map(metric => {
            const warningValue = getThreshold(metric.id, 'warning');
            const criticalValue = getThreshold(metric.id, 'critical');
            const isReverse = metric.id === 'uptime'; // For uptime, lower is worse
            
            return (
              <div key={metric.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{metric.label}</h4>
                    <p className="text-sm text-muted-foreground">Configure alert thresholds</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metric.unit}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center space-x-2">
                      <span>Warning Threshold</span>
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        {warningValue}{metric.unit}
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min={metric.min}
                      max={metric.max}
                      step={metric.step}
                      value={warningValue}
                      onChange={(e) => updateThreshold(metric.id, 'warning', parseFloat(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center space-x-2">
                      <span>Critical Threshold</span>
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        {criticalValue}{metric.unit}
                      </Badge>
                    </Label>
                    <Input
                      type="number"
                      min={metric.min}
                      max={metric.max}
                      step={metric.step}
                      value={criticalValue}
                      onChange={(e) => updateThreshold(metric.id, 'critical', parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-3 rounded">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Status Preview:</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-green-500">• OK (Green)</span>
                      <span className="text-amber-500">• Warning (Amber)</span>
                      <span className="text-red-500">• Critical (Red)</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection Rules</CardTitle>
          <CardDescription>Configure intelligent anomaly detection for proactive monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {anomalyRules.map(rule => {
            const ruleConfig = getAnomalyRule(rule.id);
            
            return (
              <div key={rule.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{rule.label}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <Badge variant={ruleConfig.enabled ? 'default' : 'secondary'}>
                    {ruleConfig.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                {ruleConfig.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label className="text-sm">Threshold (%)</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[ruleConfig.threshold]}
                          onValueChange={([value]) => updateAnomalyRule(rule.id, { threshold: value })}
                          max={100}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-center">
                          {ruleConfig.threshold}% change
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Time Window</Label>
                      <select
                        value={ruleConfig.timeWindow}
                        onChange={(e) => updateAnomalyRule(rule.id, { timeWindow: e.target.value })}
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="1h">Last 1 hour</option>
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color System</CardTitle>
          <CardDescription>Health status colors that will be reflected across all dashboard cards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium text-green-700">Healthy</div>
              <div className="text-xs text-muted-foreground">All metrics OK</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-amber-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium text-amber-700">Warning</div>
              <div className="text-xs text-muted-foreground">Some metrics elevated</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2"></div>
              <div className="font-medium text-red-700">Critical</div>
              <div className="text-xs text-muted-foreground">Immediate attention needed</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2"></div>
              <div className="font-medium text-gray-700">No Data</div>
              <div className="text-xs text-muted-foreground">Connection issues</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThresholdsSection;