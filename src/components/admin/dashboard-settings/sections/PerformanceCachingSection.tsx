import React from 'react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Zap, Database, Clock, TrendingUp } from "lucide-react";

interface PerformanceCachingSectionProps {
  settings: any;
  updateSettings: (updates: any) => void;
}

const PerformanceCachingSection: React.FC<PerformanceCachingSectionProps> = ({
  settings,
  updateSettings
}) => {
  const cardIds = ['totalUsers', 'onlineUsers', 'contentPosts', 'comments', 'groups', 'messages', 'revenue', 'platformHealth'];
  
  const backoffStrategies = [
    { value: 'exponential', label: 'Exponential Backoff' },
    { value: 'linear', label: 'Linear Backoff' },
    { value: 'fixed', label: 'Fixed Interval' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Edge Caching</span>
          </CardTitle>
          <CardDescription>Configure cache TTL and invalidation for each card</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {cardIds.map(cardId => (
              <div key={cardId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium capitalize">
                    {cardId.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    TTL: {settings?.performance?.cache?.[cardId]?.ttlMs || 30000}ms
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-xs">Cache TTL (ms)</Label>
                    <Input
                      type="number"
                      className="w-24 h-8"
                      value={settings?.performance?.cache?.[cardId]?.ttlMs || 30000}
                      onChange={(e) => updateSettings({
                        performance: {
                          ...settings?.performance,
                          cache: {
                            ...settings?.performance?.cache,
                            [cardId]: {
                              ...settings?.performance?.cache?.[cardId],
                              ttlMs: parseInt(e.target.value)
                            }
                          }
                        }
                      })}
                    />
                  </div>
                  
                  <Switch
                    checked={settings?.performance?.cache?.[cardId]?.enabled !== false}
                    onCheckedChange={(checked) => updateSettings({
                      performance: {
                        ...settings?.performance,
                        cache: {
                          ...settings?.performance?.cache,
                          [cardId]: {
                            ...settings?.performance?.cache?.[cardId],
                            enabled: checked
                          }
                        }
                      }
                    })}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="font-medium">Global Cache Settings</Label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Cache Invalidation Strategy</Label>
                <Select
                  value={settings?.performance?.cache?.strategy || 'time_based'}
                  onValueChange={(value) => updateSettings({
                    performance: {
                      ...settings?.performance,
                      cache: {
                        ...settings?.performance?.cache,
                        strategy: value
                      }
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time_based">Time-based TTL</SelectItem>
                    <SelectItem value="data_change">Data Change Trigger</SelectItem>
                    <SelectItem value="hybrid">Hybrid (TTL + Change)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Max Cache Size (MB)</Label>
                <Input
                  type="number"
                  value={settings?.performance?.cache?.maxSizeMb || 100}
                  onChange={(e) => updateSettings({
                    performance: {
                      ...settings?.performance,
                      cache: {
                        ...settings?.performance?.cache,
                        maxSizeMb: parseInt(e.target.value)
                      }
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Query Budget Guardrails</span>
          </CardTitle>
          <CardDescription>Prevent expensive queries from impacting performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Max Rows per Query</Label>
              <Input
                type="number"
                value={settings?.performance?.queryLimits?.maxRows || 10000}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    queryLimits: {
                      ...settings?.performance?.queryLimits,
                      maxRows: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Max Query Time (ms)</Label>
              <Input
                type="number"
                value={settings?.performance?.queryLimits?.maxTimeMs || 30000}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    queryLimits: {
                      ...settings?.performance?.queryLimits,
                      maxTimeMs: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Concurrent Queries</Label>
              <Input
                type="number"
                value={settings?.performance?.queryLimits?.maxConcurrent || 5}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    queryLimits: {
                      ...settings?.performance?.queryLimits,
                      maxConcurrent: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Query Budget Usage</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Current Hour Usage</span>
                <span>2,450 / 10,000 queries</span>
              </div>
              <Progress value={24.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Error Handling & Backoff</span>
          </CardTitle>
          <CardDescription>Configure retry strategies and error recovery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Backoff Strategy</Label>
              <Select
                value={settings?.performance?.backoff?.strategy || 'exponential'}
                onValueChange={(value) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    backoff: {
                      ...settings?.performance?.backoff,
                      strategy: value
                    }
                  }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {backoffStrategies.map(strategy => (
                    <SelectItem key={strategy.value} value={strategy.value}>
                      {strategy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Max Retry Attempts</Label>
              <Input
                type="number"
                value={settings?.performance?.backoff?.maxRetries || 3}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    backoff: {
                      ...settings?.performance?.backoff,
                      maxRetries: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Initial Delay (ms)</Label>
              <Input
                type="number"
                value={settings?.performance?.backoff?.initialDelayMs || 1000}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    backoff: {
                      ...settings?.performance?.backoff,
                      initialDelayMs: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Jitter Percentage</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={settings?.performance?.backoff?.jitterPercent || 10}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    backoff: {
                      ...settings?.performance?.backoff,
                      jitterPercent: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={settings?.performance?.backoff?.enableCircuitBreaker || true}
              onCheckedChange={(checked) => updateSettings({
                performance: {
                  ...settings?.performance,
                  backoff: {
                    ...settings?.performance?.backoff,
                    enableCircuitBreaker: checked
                  }
                }
              })}
            />
            <Label>Enable circuit breaker pattern</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Loading States</span>
          </CardTitle>
          <CardDescription>Configure skeleton loaders and loading indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Skeleton Animation Duration (ms)</Label>
              <Input
                type="number"
                value={settings?.performance?.loading?.skeletonDurationMs || 1500}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    loading: {
                      ...settings?.performance?.loading,
                      skeletonDurationMs: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Stale Data Threshold (ms)</Label>
              <Input
                type="number"
                value={settings?.performance?.loading?.staleThresholdMs || 60000}
                onChange={(e) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    loading: {
                      ...settings?.performance?.loading,
                      staleThresholdMs: parseInt(e.target.value)
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings?.performance?.loading?.showLastUpdated !== false}
                onCheckedChange={(checked) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    loading: {
                      ...settings?.performance?.loading,
                      showLastUpdated: checked
                    }
                  }
                })}
              />
              <Label>Show "last updated" timestamps</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={settings?.performance?.loading?.enableSkeletons !== false}
                onCheckedChange={(checked) => updateSettings({
                  performance: {
                    ...settings?.performance,
                    loading: {
                      ...settings?.performance?.loading,
                      enableSkeletons: checked
                    }
                  }
                })}
              />
              <Label>Enable skeleton loading animations</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceCachingSection;