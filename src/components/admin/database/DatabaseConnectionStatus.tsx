import React, { useState, useEffect } from 'react';
import { 
  Database, Activity, AlertCircle, CheckCircle, RefreshCw, Server, Clock, Users, 
  HardDrive, Wifi, Shield, Bell, Settings, TrendingUp, Zap, FileText, Calendar, 
  Terminal, Eye, Download, Moon, Sun, Play, Pause, RotateCcw, AlertTriangle, 
  Lock, Globe, BarChart3, LineChart, PieChart, Monitor, Cpu, MemoryStick, 
  Archive, History, UserCheck, Key, Search, Filter, ChevronDown, ChevronUp, 
  Mail, MessageSquare, Webhook, Code, GitBranch, Wrench, BookOpen, MessageCircle, 
  FileCheck, DollarSign, Target, Brain, Sparkles, Gauge, Map, Network 
} from 'lucide-react';

const DatabaseConnectionStatus = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('production');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [showAlerts, setShowAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefresh(new Date());
    }, 2000);
  };

  // Mock comprehensive data
  const [databases] = useState([
    {
      id: 1,
      name: 'Primary Database',
      host: 'shqipet-main.db.amazonaws.com',
      type: 'PostgreSQL',
      version: '15.3',
      status: 'connected',
      responseTime: '12ms',
      lastConnected: '2 minutes ago',
      connections: 45,
      maxConnections: 100,
      uptime: '99.9%',
      size: '2.4 GB',
      cpu: 23,
      memory: 67,
      disk: 34,
      queries: 1247,
      slowQueries: 3,
      errors: 0,
      cost: '$245.50',
      backup: '2h ago',
      ssl: true,
      environment: 'production'
    },
    {
      id: 2,
      name: 'AI Training Data',
      host: 'shqipet-ai.db.amazonaws.com',
      type: 'MongoDB',
      version: '6.0',
      status: 'connected',
      responseTime: '8ms',
      lastConnected: '1 minute ago',
      connections: 23,
      maxConnections: 50,
      uptime: '99.8%',
      size: '15.2 GB',
      cpu: 45,
      memory: 78,
      disk: 89,
      queries: 892,
      slowQueries: 1,
      errors: 0,
      cost: '$189.20',
      backup: '1h ago',
      ssl: true,
      environment: 'production'
    },
    {
      id: 3,
      name: 'User Analytics',
      host: 'shqipet-analytics.db.amazonaws.com',
      type: 'Redis',
      version: '7.0',
      status: 'connected',
      responseTime: '3ms',
      lastConnected: '30 seconds ago',
      connections: 12,
      maxConnections: 25,
      uptime: '100%',
      size: '512 MB',
      cpu: 12,
      memory: 34,
      disk: 15,
      queries: 2156,
      slowQueries: 0,
      errors: 0,
      cost: '$67.80',
      backup: '30m ago',
      ssl: true,
      environment: 'production'
    },
    {
      id: 4,
      name: 'Session Store',
      host: 'shqipet-sessions.db.amazonaws.com',
      type: 'Redis',
      version: '6.2',
      status: 'warning',
      responseTime: '45ms',
      lastConnected: '5 minutes ago',
      connections: 8,
      maxConnections: 20,
      uptime: '98.5%',
      size: '128 MB',
      cpu: 67,
      memory: 89,
      disk: 23,
      queries: 456,
      slowQueries: 12,
      errors: 2,
      cost: '$34.50',
      backup: '15m ago',
      ssl: true,
      environment: 'production'
    },
    {
      id: 5,
      name: 'Backup Database',
      host: 'shqipet-backup.db.amazonaws.com',
      type: 'PostgreSQL',
      version: '15.1',
      status: 'disconnected',
      responseTime: 'N/A',
      lastConnected: '2 hours ago',
      connections: 0,
      maxConnections: 50,
      uptime: '95.2%',
      size: '2.1 GB',
      cpu: 0,
      memory: 0,
      disk: 78,
      queries: 0,
      slowQueries: 0,
      errors: 15,
      cost: '$98.70',
      backup: 'Failed',
      ssl: false,
      environment: 'production'
    }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'critical', message: 'Backup Database connection failed', time: '2h ago', resolved: false },
    { id: 2, type: 'warning', message: 'Session Store high response time detected', time: '5m ago', resolved: false },
    { id: 3, type: 'info', message: 'SSL certificate expires in 45 days', time: '1h ago', resolved: false },
    { id: 4, type: 'success', message: 'Database backup completed successfully', time: '2h ago', resolved: true }
  ]);

  const [maintenance] = useState([
    { id: 1, database: 'Primary Database', type: 'Scheduled Restart', date: '2025-09-15', status: 'planned' },
    { id: 2, database: 'AI Training Data', type: 'Index Optimization', date: '2025-09-12', status: 'in-progress' },
    { id: 3, database: 'User Analytics', type: 'Version Update', date: '2025-09-10', status: 'completed' }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'disconnected': return <AlertCircle className="w-5 h-5" />;
      default: return <Database className="w-5 h-5" />;
    }
  };

  const connectedDbs = databases.filter(db => db.status === 'connected').length;
  const totalConnections = databases.reduce((sum, db) => sum + db.connections, 0);
  const avgResponseTime = databases.filter(db => db.responseTime !== 'N/A').reduce((sum, db) => sum + parseInt(db.responseTime), 0) / databases.filter(db => db.responseTime !== 'N/A').length;
  const totalCost = databases.reduce((sum, db) => sum + parseFloat(db.cost.replace('$', '')), 0);

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 pb-20 space-y-8">
        {/* Header */}
        <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Database className="w-8 h-8 text-primary" />
                  Database Command Center
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive database monitoring and management for Shqipet AI
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Environment Selector */}
                <select 
                  value={selectedEnvironment}
                  onChange={(e) => setSelectedEnvironment(e.target.value)}
                  className="px-3 py-2 rounded-lg border bg-background border-border text-foreground"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
                
                {/* Theme Toggle */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg bg-card text-foreground border border-border hover:bg-accent"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                
                {/* Auto Refresh Toggle */}
                <button 
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${autoRefresh ? 'bg-green-600 text-white border-green-600' : 'bg-card border-border text-foreground hover:bg-accent'}`}
                >
                  {autoRefresh ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  Auto
                </button>
                
                {/* Refresh Button */}
                <button 
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          {showAlerts && alerts.filter(alert => !alert.resolved).length > 0 && (
            <div className="bg-destructive/10 border-destructive/20 border rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="font-medium text-destructive">
                    {alerts.filter(alert => !alert.resolved).length} Active Alerts
                  </span>
                </div>
                <button 
                  onClick={() => setShowAlerts(false)}
                  className="text-destructive hover:text-destructive/80"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart3 },
                  { id: 'performance', name: 'Performance', icon: TrendingUp },
                  { id: 'security', name: 'Security', icon: Shield },
                  { id: 'alerts', name: 'Alerts', icon: Bell },
                  { id: 'maintenance', name: 'Maintenance', icon: Wrench },
                  { id: 'analytics', name: 'Analytics', icon: LineChart },
                  { id: 'automation', name: 'Automation', icon: Zap }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Connected DBs</p>
                    <p className="text-2xl font-bold text-green-600">{connectedDbs}/{databases.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Connections</p>
                    <p className="text-2xl font-bold text-primary">{totalConnections}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Avg Response</p>
                    <p className="text-2xl font-bold text-purple-600">{Math.round(avgResponseTime)}ms</p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Monthly Cost</p>
                    <p className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Alerts</p>
                    <p className="text-2xl font-bold text-destructive">{alerts.filter(a => !a.resolved).length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-destructive" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Last Updated</p>
                    <p className="text-lg font-bold text-muted-foreground">{lastRefresh.toLocaleTimeString()}</p>
                  </div>
                  <Clock className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Main Database Table */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Database Connections</h2>
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3 py-1 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                    <Terminal className="w-4 h-4" />
                    Query Console
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <Play className="w-4 h-4" />
                    Test All
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Database</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Resources</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Connections</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {databases.map((db) => (
                      <tr key={db.id} className="hover:bg-accent/50 cursor-pointer" onClick={() => setSelectedDatabase(db)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Server className="w-5 h-5 text-muted-foreground mr-3" />
                            <div>
                              <div className="text-sm font-medium text-foreground">{db.name}</div>
                              <div className="text-sm text-muted-foreground">{db.type} {db.version}</div>
                              <div className="text-xs text-muted-foreground">{db.host}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center ${getStatusColor(db.status)}`}>
                            {getStatusIcon(db.status)}
                            <div className="ml-2">
                              <div className="text-sm font-medium capitalize">{db.status}</div>
                              <div className="text-xs">Uptime: {db.uptime}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Activity className="w-3 h-3 text-muted-foreground" />
                              <span className="text-sm">{db.responseTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary">{db.queries} queries</span>
                            </div>
                            {db.slowQueries > 0 && (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-yellow-600">{db.slowQueries} slow</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <Cpu className="w-3 h-3" />
                                CPU
                              </span>
                              <span>{db.cpu}%</span>
                            </div>
                            <div className="w-16 bg-muted rounded-full h-1">
                              <div className={`h-1 rounded-full ${db.cpu > 80 ? 'bg-destructive' : db.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${db.cpu}%`}}></div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1">
                                <MemoryStick className="w-3 h-3" />
                                RAM
                              </span>
                              <span>{db.memory}%</span>
                            </div>
                            <div className="w-16 bg-muted rounded-full h-1">
                              <div className={`h-1 rounded-full ${db.memory > 80 ? 'bg-destructive' : db.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${db.memory}%`}}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-muted-foreground mr-2" />
                            <span className="text-sm text-foreground">{db.connections}/{db.maxConnections}</span>
                            <div className="ml-2 w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{width: `${(db.connections / db.maxConnections) * 100}%`}}
                              ></div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Last: {db.lastConnected}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-primary hover:bg-primary/10 rounded">
                              <Play className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-yellow-600 hover:bg-yellow-100 rounded">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                              <Terminal className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-purple-600 hover:bg-purple-100 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Overview Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Connection Health */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-500" />
                  Connection Health
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Healthy</span>
                    <span className="text-sm font-medium text-green-600">{databases.filter(db => db.status === 'connected').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Warning</span>
                    <span className="text-sm font-medium text-yellow-600">{databases.filter(db => db.status === 'warning').length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Failed</span>
                    <span className="text-sm font-medium text-destructive">{databases.filter(db => db.status === 'disconnected').length}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Overall Health</span>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round((databases.filter(db => db.status === 'connected').length / databases.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  Cost Analysis
                </h3>
                <div className="space-y-4">
                  {databases.slice(0, 3).map((db) => (
                    <div key={db.id} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{db.name}</span>
                      <span className="text-sm font-medium text-green-600">{db.cost}/mo</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Total Monthly</span>
                      <span className="text-sm font-bold text-green-600">${totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                    <Terminal className="w-5 h-5" />
                    Open Query Console
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-green-500/10 text-green-700 rounded-lg hover:bg-green-500/20 transition-colors">
                    <Archive className="w-5 h-5" />
                    Backup All Databases
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-purple-500/10 text-purple-700 rounded-lg hover:bg-purple-500/20 transition-colors">
                    <Download className="w-5 h-5" />
                    Export Health Report
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 bg-yellow-500/10 text-yellow-700 rounded-lg hover:bg-yellow-500/20 transition-colors">
                    <Settings className="w-5 h-5" />
                    Configuration Manager
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics Chart */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Response Time Trends
                </h3>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <LineChart className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Real-time performance chart would appear here</p>
                  </div>
                </div>
              </div>

              {/* Query Performance */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Gauge className="w-5 h-5 mr-2 text-purple-500" />
                  Query Performance
                </h3>
                <div className="space-y-4">
                  {databases.filter(db => db.status === 'connected').map((db) => (
                    <div key={db.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-foreground">{db.name}</span>
                        <span className="text-sm font-medium">{db.queries} queries</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{width: `${Math.min((db.queries / 2500) * 100, 100)}%`}}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{db.slowQueries} slow</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Monitor className="w-5 h-5 mr-2 text-green-500" />
                Resource Usage
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {databases.filter(db => db.status === 'connected').map((db) => (
                  <div key={db.id} className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-3">{db.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            CPU
                          </span>
                          <span>{db.cpu}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${db.cpu > 80 ? 'bg-destructive' : db.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${db.cpu}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <MemoryStick className="w-3 h-3" />
                            Memory
                          </span>
                          <span>{db.memory}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${db.memory > 80 ? 'bg-destructive' : db.memory > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${db.memory}%`}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            Disk
                          </span>
                          <span>{db.disk}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className={`h-2 rounded-full ${db.disk > 80 ? 'bg-destructive' : db.disk > 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{width: `${db.disk}%`}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Overview */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-primary" />
                  Security Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">SSL Encryption</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Enabled
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Authentication</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Firewall Protection</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Enabled
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Access Control</span>
                    <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Configured
                    </span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">Security Score</span>
                      <span className="text-sm font-bold text-green-600">98/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Logs */}
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-green-500" />
                  Recent Access
                </h3>
                <div className="space-y-3">
                  {[
                    { user: 'admin@shqipet.com', db: 'Primary Database', time: '2m ago', action: 'Read' },
                    { user: 'ai-service@shqipet.com', db: 'AI Training Data', time: '5m ago', action: 'Write' },
                    { user: 'analytics@shqipet.com', db: 'User Analytics', time: '10m ago', action: 'Read' },
                    { user: 'backup-service@shqipet.com', db: 'Backup Database', time: '2h ago', action: 'Backup' }
                  ].map((log, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium text-foreground">{log.user}</div>
                          <div className="text-xs text-muted-foreground">{log.db}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{log.time}</div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${log.action === 'Write' ? 'bg-primary/10 text-primary' : log.action === 'Backup' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                            {log.action}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SSL Certificates */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-yellow-500" />
                SSL Certificates
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground">Database</th>
                      <th className="text-left py-2 text-muted-foreground">Issuer</th>
                      <th className="text-left py-2 text-muted-foreground">Expires</th>
                      <th className="text-left py-2 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {databases.map((db) => (
                      <tr key={db.id} className="border-b border-border">
                        <td className="py-3 text-foreground">{db.name}</td>
                        <td className="py-3 text-muted-foreground">Let's Encrypt</td>
                        <td className="py-3 text-muted-foreground">45 days</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${db.ssl ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'}`}>
                            {db.ssl ? 'Valid' : 'Invalid'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alert Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Critical</p>
                    <p className="text-2xl font-bold text-destructive">{alerts.filter(a => a.type === 'critical' && !a.resolved).length}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </div>
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Warning</p>
                    <p className="text-2xl font-bold text-yellow-600">{alerts.filter(a => a.type === 'warning' && !a.resolved).length}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Info</p>
                    <p className="text-2xl font-bold text-primary">{alerts.filter(a => a.type === 'info' && !a.resolved).length}</p>
                  </div>
                  <Bell className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.resolved).length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Alert List */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-primary" />
                  Alert History
                </h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                    Configure Alerts
                  </button>
                  <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                    Mark All Read
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border border-border rounded-lg ${alert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.type === 'critical' && <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />}
                        {alert.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                        {alert.type === 'info' && <Bell className="w-5 h-5 text-primary mt-0.5" />}
                        {alert.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                        <div>
                          <div className="font-medium text-foreground">{alert.message}</div>
                          <div className="text-sm text-muted-foreground">{alert.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!alert.resolved && (
                          <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                            Resolve
                          </button>
                        )}
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${alert.resolved ? 'bg-green-500/10 text-green-600' : alert.type === 'critical' ? 'bg-destructive/10 text-destructive' : alert.type === 'warning' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                          {alert.resolved ? 'Resolved' : alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-muted-foreground" />
                Notification Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Email Alerts</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" checked className="mr-2" />
                      <span className="text-sm text-muted-foreground">Connection failures</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" checked className="mr-2" />
                      <span className="text-sm text-muted-foreground">Performance degradation</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-muted-foreground">High resource usage</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Slack Integration</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" checked className="mr-2" />
                      <span className="text-sm text-muted-foreground">Critical alerts</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-muted-foreground">Daily summaries</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-3">Webhooks</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monitoring endpoint</span>
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80">
                      Configure webhooks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Maintenance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Planned</p>
                    <p className="text-2xl font-bold text-primary">{maintenance.filter(m => m.status === 'planned').length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{maintenance.filter(m => m.status === 'in-progress').length}</p>
                  </div>
                  <Settings className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{maintenance.filter(m => m.status === 'completed').length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Maintenance Schedule */}
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-primary" />
                Maintenance Schedule
              </h3>
              
              <div className="space-y-3">
                {maintenance.map((item) => (
                  <div key={item.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">{item.database}</div>
                        <div className="text-sm text-muted-foreground">{item.type}</div>
                        <div className="text-xs text-muted-foreground">Scheduled: {item.date}</div>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.status === 'completed' ? 'bg-green-500/10 text-green-600' : item.status === 'in-progress' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-primary/10 text-primary'}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  <Calendar className="w-4 h-4" />
                  Schedule New Maintenance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-primary" />
                Database Analytics Dashboard
              </h3>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Advanced analytics charts would appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                Automation Rules
              </h3>
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Automation configuration panel would appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {(activeTab === 'performance' || activeTab === 'security' || activeTab === 'alerts' || activeTab === 'maintenance' || activeTab === 'analytics') && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard
              </h3>
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} monitoring details would be displayed here</p>
              </div>
            </div>
          </div>
        )}

        {/* Extra bottom spacing for scroll */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default DatabaseConnectionStatus;
