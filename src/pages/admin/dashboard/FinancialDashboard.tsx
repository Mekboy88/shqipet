import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Users, 
  Calendar,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

interface FinancialMetrics {
  todayRevenue: number;
  mrr: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
  pendingPayouts: number;
  totalRevenue: number;
  growth: number;
}

const subscriptionData = [
  { name: 'Basic Plan', value: 45, color: '#3B82F6' },
  { name: 'Pro Plan', value: 30, color: '#8B5CF6' },
  { name: 'Premium Plan', value: 20, color: '#10B981' },
  { name: 'Enterprise', value: 5, color: '#F59E0B' }
];

const revenueData = [
  { month: 'Jan', revenue: 4500, subscriptions: 120 },
  { month: 'Feb', revenue: 5200, subscriptions: 145 },
  { month: 'Mar', revenue: 4800, subscriptions: 138 },
  { month: 'Apr', revenue: 6100, subscriptions: 165 },
  { month: 'May', revenue: 7200, subscriptions: 198 },
  { month: 'Jun', revenue: 8100, subscriptions: 223 }
];

const FinancialDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    todayRevenue: 1247.50,
    mrr: 15650.00,
    activeSubscriptions: 523,
    cancelledSubscriptions: 12,
    pendingPayouts: 3420.75,
    totalRevenue: 94230.00,
    growth: 12.5
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + (Math.random() * 50 - 25),
        activeSubscriptions: prev.activeSubscriptions + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 20000); // Update every 20 seconds

    return () => clearInterval(interval);
  }, []);

  const handleOpenBillingDashboard = () => {
    // Navigate to billing dashboard
    console.log('Opening billing dashboard...');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">💰 Financial Snapshot</h1>
          <p className="text-muted-foreground">Revenue metrics and subscription overview</p>
        </div>
        <Button 
          onClick={handleOpenBillingDashboard}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          📊 Open Billing Dashboard
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              ${metrics.todayRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Monthly Recurring Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              ${metrics.mrr.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{metrics.growth}% growth
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {metrics.activeSubscriptions}
            </div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              {metrics.cancelledSubscriptions} cancelled this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Pending Payouts</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800">
              ${metrics.pendingPayouts.toFixed(2)}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              Processing in 2-3 business days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart and Subscription Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and subscription growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'revenue' ? `$${value}` : value,
                  name === 'revenue' ? 'Revenue' : 'Subscriptions'
                ]} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="subscriptions" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans Overview</CardTitle>
            <CardDescription>Distribution of active subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2">
                {subscriptionData.map((plan, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-sm">{plan.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {plan.value}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>Income sources and payout status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Income</h3>
              <p className="text-2xl font-bold">${(metrics.totalRevenue).toLocaleString()}</p>
              <p className="text-sm opacity-90">Total revenue</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Payouts</h3>
              <p className="text-2xl font-bold">${metrics.pendingPayouts.toFixed(2)}</p>
              <p className="text-sm opacity-90">Pending payments</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
              <h3 className="font-semibold mb-2">Plans</h3>
              <p className="text-2xl font-bold">{metrics.activeSubscriptions}</p>
              <p className="text-sm opacity-90">Active subscriptions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialDashboard;