import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Zap, 
  Globe, 
  Users, 
  HardDrive,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Activity,
  Info
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfMonth } from 'date-fns';

interface ServiceCost {
  service_name: string;
  total_usage: number;
  free_tier_used: number;
  billable_usage: number;
  estimated_cost: number;
}

interface ResourceUsage {
  id: string;
  service_name: string;
  usage_amount: number;
  usage_date: string;
  metadata: any;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const serviceIcons: Record<string, any> = {
  'Database Storage': Database,
  'API Calls': Zap,
  'Bandwidth': Globe,
  'Edge Functions': Activity,
  'File Storage': HardDrive,
  'Authentication': Users
};

const CostEstimator: React.FC = () => {
  const [costs, setCosts] = useState<ServiceCost[]>([]);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [justUpdated, setJustUpdated] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const fetchCosts = async () => {
    try {
      const { data, error } = await supabase.rpc('calculate_current_month_costs');
      
      if (error) throw error;
      
      setCosts(data || []);
    } catch (error: any) {
      console.error('Error fetching costs:', error);
      toast({
        title: 'Error loading cost data',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('resource_usage')
        .select('*')
        .gte('usage_date', thirtyDaysAgo)
        .order('usage_date', { ascending: true });
      
      if (error) throw error;
      
      // Group by date and service
      const groupedData = (data || []).reduce((acc: any, item: ResourceUsage) => {
        const date = item.usage_date;
        if (!acc[date]) {
          acc[date] = { date, total: 0 };
        }
        acc[date][item.service_name] = (acc[date][item.service_name] || 0) + Number(item.usage_amount);
        acc[date].total += Number(item.usage_amount);
        return acc;
      }, {});
      
      setHistoricalData(Object.values(groupedData));
    } catch (error: any) {
      console.error('Error fetching historical data:', error);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCosts(), fetchHistoricalData()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Real-time subscription for resource usage
  useEffect(() => {
    if (!autoRefresh) return;

    const channel = supabase
      .channel('cost-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'resource_usage'
        },
        (payload) => {
          console.log('Real-time cost update:', payload);
          setJustUpdated(true);
          setTimeout(() => setJustUpdated(false), 2000);
          fetchCosts();
          fetchHistoricalData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoRefresh]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchCosts();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const totalEstimatedCost = useMemo(() => {
    return costs.reduce((sum, service) => sum + Number(service.estimated_cost), 0);
  }, [costs]);

  const totalUsage = useMemo(() => {
    return costs.reduce((sum, service) => sum + Number(service.total_usage), 0);
  }, [costs]);

  const projectedMonthlyCost = useMemo(() => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const projectionFactor = daysInMonth / currentDay;
    return totalEstimatedCost * projectionFactor;
  }, [totalEstimatedCost]);

  const pieChartData = costs.map(service => ({
    name: service.service_name,
    value: Number(service.estimated_cost),
    usage: Number(service.total_usage)
  })).filter(item => item.value > 0);


  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading cost data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <DollarSign className="h-10 w-10 text-green-500" />
            Cost Estimator Dashboard
            {justUpdated && (
              <Badge className="animate-pulse bg-green-500">
                Data Updated
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time cloud resource usage and cost tracking for {format(startOfMonth(new Date()), 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`gap-2 transition-colors ${
              autoRefresh 
                ? 'bg-green-500/10 hover:bg-green-500/20 border-green-500 text-green-700 dark:text-green-400' 
                : 'bg-red-500/10 hover:bg-red-500/20 border-red-500 text-red-700 dark:text-red-400'
            }`}
          >
            {autoRefresh ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {autoRefresh ? 'Live Updates On' : 'Live Updates Off'}
          </Button>
          <Button 
            onClick={async () => {
              setIsRecording(true);
              try {
                const { error } = await supabase.functions.invoke('track-resource-usage');
                if (error) throw error;
                await loadAllData();
                toast({
                  title: 'Usage Recorded!',
                  description: 'Resource usage has been updated successfully.',
                });
              } catch (error: any) {
                toast({
                  title: 'Recording Failed',
                  description: error.message,
                  variant: 'destructive'
                });
              } finally {
                setIsRecording(false);
              }
            }} 
            variant="outline" 
            className="gap-2"
            disabled={isRecording}
          >
            <Activity className={`h-4 w-4 ${isRecording ? 'animate-spin' : ''}`} />
            {isRecording ? 'Recording...' : 'Record Usage Now'}
          </Button>
          <Button onClick={loadAllData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* What's Being Tracked Info Panel */}
      <Card className="bg-blue-500/5 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            What's Being Tracked
          </CardTitle>
          <CardDescription>Real-time monitoring of all cloud services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Database className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">Database Storage</p>
              <p className="text-xs text-muted-foreground">PostgreSQL size in MB</p>
            </div>
            <div>
              <Zap className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">API Calls</p>
              <p className="text-xs text-muted-foreground">Total requests made</p>
            </div>
            <div>
              <Globe className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">Bandwidth</p>
              <p className="text-xs text-muted-foreground">Data transfer in GB</p>
            </div>
            <div>
              <Activity className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">Edge Functions</p>
              <p className="text-xs text-muted-foreground">Function invocations</p>
            </div>
            <div>
              <HardDrive className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">File Storage</p>
              <p className="text-xs text-muted-foreground">Uploaded files in GB</p>
            </div>
            <div>
              <Users className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold">Authentication</p>
              <p className="text-xs text-muted-foreground">Monthly active users</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Current Month Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-500">
              ${totalEstimatedCost.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              As of {format(new Date(), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Projected Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-500">
              ${projectedMonthlyCost.toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on current usage pattern
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Total Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-500">
              {totalUsage.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Units consumed this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="breakdown" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="breakdown" className="space-y-6">
          {/* Service-by-Service Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {costs.map((service) => {
              const Icon = serviceIcons[service.service_name] || Database;
              const usagePercent = service.free_tier_used > 0 
                ? (Number(service.total_usage) / Number(service.free_tier_used)) * 100 
                : 0;
              
              return (
                <Card key={service.service_name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        {service.service_name}
                      </span>
                      <Badge variant={Number(service.estimated_cost) > 0 ? "default" : "secondary"}>
                        ${Number(service.estimated_cost).toFixed(4)}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {Number(service.total_usage).toLocaleString()} total units
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Free Tier Usage</span>
                        <span className="font-medium">
                          {Number(service.free_tier_used).toLocaleString()} / {Number(service.free_tier_used).toLocaleString()} units
                        </span>
                      </div>
                      <Progress value={Math.min(usagePercent, 100)} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Billable Usage</p>
                        <p className="text-lg font-semibold text-orange-500">
                          {Number(service.billable_usage).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost/Unit</p>
                        <p className="text-lg font-semibold">
                          ${(Number(service.estimated_cost) / Math.max(Number(service.billable_usage), 1)).toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Cost Distribution Pie Chart */}
          {pieChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Breakdown of costs by service</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Usage Comparison</CardTitle>
              <CardDescription>Compare usage across services</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={costs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="service_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total_usage" name="Total Usage" fill="#3b82f6" />
                  <Bar dataKey="billable_usage" name="Billable Usage" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>30-Day Usage Trends</CardTitle>
              <CardDescription>Historical usage over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), 'MMM dd')}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="Total Usage" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Card */}
      {totalEstimatedCost > 50 && (
        <Card className="border-orange-500 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <AlertCircle className="h-5 w-5" />
              Cost Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your projected monthly cost (${projectedMonthlyCost.toFixed(2)}) exceeds typical usage. 
              Consider reviewing your resource consumption or adjusting service configurations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CostEstimator;