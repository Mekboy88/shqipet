import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, MapPin, TrendingUp, Users, Activity } from 'lucide-react';

const GeoActivityDashboard: React.FC = () => {
  const [geoStats, setGeoStats] = useState({
    totalCountries: 89,
    activeRegions: 12,
    onlineUsers: 1247,
    peakHour: '14:00 UTC'
  });

  const [topCountries] = useState([
    { country: 'United States', users: 8543, growth: 12, flag: '🇺🇸' },
    { country: 'United Kingdom', users: 4287, growth: 8, flag: '🇬🇧' },
    { country: 'Germany', users: 3156, growth: 15, flag: '🇩🇪' },
    { country: 'France', users: 2934, growth: 6, flag: '🇫🇷' },
    { country: 'Canada', users: 2456, growth: 18, flag: '🇨🇦' },
    { country: 'Australia', users: 1987, growth: 22, flag: '🇦🇺' },
    { country: 'Japan', users: 1743, growth: -3, flag: '🇯🇵' },
    { country: 'Brazil', users: 1654, growth: 28, flag: '🇧🇷' }
  ]);

  const [regionalActivity] = useState([
    { region: 'North America', active: 11032, percentage: 35 },
    { region: 'Europe', active: 9876, percentage: 31 },
    { region: 'Asia Pacific', active: 6543, percentage: 21 },
    { region: 'South America', active: 2345, percentage: 7 },
    { region: 'Africa', active: 1234, percentage: 4 },
    { region: 'Middle East', active: 654, percentage: 2 }
  ]);

  const [recentLogins] = useState([
    { city: 'New York, US', users: 234, time: '2m ago', coords: '40.7128, -74.0060' },
    { city: 'London, UK', users: 187, time: '5m ago', coords: '51.5074, -0.1278' },
    { city: 'Tokyo, JP', users: 156, time: '8m ago', coords: '35.6762, 139.6503' },
    { city: 'Sydney, AU', users: 98, time: '12m ago', coords: '-33.8688, 151.2093' },
    { city: 'Berlin, DE', users: 76, time: '15m ago', coords: '52.5200, 13.4050' },
    { city: 'Toronto, CA', users: 65, time: '18m ago', coords: '43.6532, -79.3832' }
  ]);

  const [timeZoneActivity] = useState([
    { timezone: 'UTC-8 (PST)', active: 2543, peak: '20:00' },
    { timezone: 'UTC-5 (EST)', active: 3421, peak: '19:00' },
    { timezone: 'UTC+0 (GMT)', active: 1987, peak: '18:00' },
    { timezone: 'UTC+1 (CET)', active: 2156, peak: '17:00' },
    { timezone: 'UTC+9 (JST)', active: 1234, peak: '21:00' },
    { timezone: 'UTC+10 (AEST)', active: 876, peak: '20:00' }
  ]);

  const getGrowthColor = (growth: number) => {
    if (growth > 15) return 'text-green-600';
    if (growth > 5) return 'text-blue-600';
    if (growth > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? '↗️' : '↘️';
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setGeoStats(prev => ({
        ...prev,
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 20) - 10
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Geo Activity Map</h1>
          <p className="text-muted-foreground">Global user activity and regional insights</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Globe className="mr-2 h-4 w-4" />
          🌐 Open Regional Analytics
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Countries</CardTitle>
            <Globe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{geoStats.totalCountries}</div>
            <p className="text-xs text-blue-700">With active users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Active Regions</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{geoStats.activeRegions}</div>
            <p className="text-xs text-green-700">High activity zones</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Online Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{geoStats.onlineUsers.toLocaleString()}</div>
            <p className="text-xs text-purple-700">Currently active</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Peak Hour</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{geoStats.peakHour}</div>
            <p className="text-xs text-orange-700">Global peak time</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Countries & Regional Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Countries by Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium">{country.country}</p>
                      <p className="text-sm text-muted-foreground">
                        {country.users.toLocaleString()} users
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={getGrowthColor(country.growth)}
                    >
                      {getGrowthIcon(country.growth)} {Math.abs(country.growth)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Regional Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalActivity} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="region" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="active" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logins & Timezone Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Recent Login Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogins.map((login, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-green-500 ${index < 2 ? 'animate-pulse' : ''}`} />
                    <div>
                      <p className="font-medium text-sm">{login.city}</p>
                      <p className="text-xs text-muted-foreground">{login.coords}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{login.users} users</p>
                    <p className="text-xs text-muted-foreground">{login.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Timezone Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeZoneActivity.map((tz, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tz.timezone}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold">{tz.active.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground">Peak: {tz.peak}</p>
                    </div>
                  </div>
                  <Progress 
                    value={(tz.active / Math.max(...timeZoneActivity.map(t => t.active))) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <Globe className="h-5 w-5" />
            Global Activity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900">
                {topCountries.filter(c => c.growth > 10).length}
              </div>
              <p className="text-sm text-indigo-700">High Growth Countries</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900">
                {Math.round(regionalActivity.reduce((sum, r) => sum + r.active, 0) / 1000)}K
              </div>
              <p className="text-sm text-indigo-700">Total Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900">
                {recentLogins.reduce((sum, l) => sum + l.users, 0)}
              </div>
              <p className="text-sm text-indigo-700">Recent Logins</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-900">24/7</div>
              <p className="text-sm text-indigo-700">Global Coverage</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeoActivityDashboard;