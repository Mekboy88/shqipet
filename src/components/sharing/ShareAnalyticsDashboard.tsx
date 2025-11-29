import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Share2, TrendingUp, Users, Calendar, 
  Facebook, MessageCircle, Linkedin, Copy
} from 'lucide-react';
import { useEnhancedSharing, ShareAnalytics } from '@/hooks/useEnhancedSharing';

interface ShareAnalyticsDashboardProps {
  postId?: string;
  userId?: string;
}

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  whatsapp: '#25D366',
  telegram: '#0088CC',
  sms: '#34C759',
  email: '#FF9500',
  copy: '#8E8E93',
  reshare: '#007AFF',
  native: '#5856D6'
};

const PLATFORM_ICONS = {
  facebook: Facebook,
  twitter: MessageCircle,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
  telegram: MessageCircle,
  sms: MessageCircle,
  email: MessageCircle,
  copy: Copy,
  reshare: Share2,
  native: Share2
};

const ShareAnalyticsDashboard: React.FC<ShareAnalyticsDashboardProps> = ({
  postId,
  userId
}) => {
  const { getShareAnalytics, getShareHistory } = useEnhancedSharing();
  const [analytics, setAnalytics] = useState<ShareAnalytics | null>(null);
  const [shareHistory, setShareHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        if (postId) {
          const analyticsData = await getShareAnalytics(postId);
          setAnalytics(analyticsData);
        }
        
        if (userId) {
          const historyData = await getShareHistory(userId, 50);
          setShareHistory(historyData);
        }
      } catch (error) {
        console.error('Error fetching share analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (postId || userId) {
      fetchData();
    }
  }, [postId, userId, getShareAnalytics, getShareHistory]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/3"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const platformData = analytics?.platformBreakdown 
    ? Object.entries(analytics.platformBreakdown).map(([platform, count]) => ({
        name: platform,
        value: count,
        color: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || '#8E8E93'
      }))
    : [];

  const timelineData = shareHistory.reduce((acc, share) => {
    const date = new Date(share.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    
    if (existing) {
      existing.shares++;
    } else {
      acc.push({ date, shares: 1 });
    }
    
    return acc;
  }, [] as { date: string; shares: number }[]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Përmbledhje</TabsTrigger>
          <TabsTrigger value="platforms">Platformat</TabsTrigger>
          <TabsTrigger value="history">Historiku</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Totali i ndarjeve
                </CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalShares || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Në të gjitha platformat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platformat aktive
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(analytics?.platformBreakdown || {}).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Platforma të përdorura
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ndarja e fundit
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm font-bold">
                  {analytics?.recentShares[0] 
                    ? new Date(analytics.recentShares[0].shared_at).toLocaleDateString()
                    : 'Asnjë'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.recentShares[0]?.platform || 'N/A'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Chart */}
          {timelineData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Aktiviteti i ndarjes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="shares" 
                      stroke="#007AFF" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Breakdown Pie Chart */}
            {platformData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ndarja sipas platformave</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Platform Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistikat e platformave</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics?.platformBreakdown || {})
                    .sort(([,a], [,b]) => b - a)
                    .map(([platform, count]) => {
                      const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS] || Share2;
                      return (
                        <div key={platform} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{platform}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historiku i ndarjeve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.recentShares.length ? (
                  analytics.recentShares.map((share, index) => {
                    const Icon = PLATFORM_ICONS[share.platform as keyof typeof PLATFORM_ICONS] || Share2;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                        <Icon className="w-4 h-4 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary"
                              style={{ 
                                backgroundColor: PLATFORM_COLORS[share.platform as keyof typeof PLATFORM_COLORS] + '20',
                                color: PLATFORM_COLORS[share.platform as keyof typeof PLATFORM_COLORS]
                              }}
                            >
                              {share.platform}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(share.shared_at).toLocaleString()}
                            </span>
                          </div>
                          {share.custom_text && (
                            <p className="text-sm mt-2 text-muted-foreground">
                              "{share.custom_text.substring(0, 100)}..."
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Nuk ka historik ndarjesh për të shfaqur
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShareAnalyticsDashboard;