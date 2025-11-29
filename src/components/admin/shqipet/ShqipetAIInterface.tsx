import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Database, Monitor, Lock, Activity, Settings, TrendingUp, Zap, 
  Globe, Smartphone, AlertTriangle, CheckCircle, RefreshCw, X,
  Wifi, WifiOff, Cpu, HardDrive, Network, Server, Timer, BarChart3,
  ChevronDown, ChevronRight, ChevronLeft, Eye, Key, Power, Bell, FileText, Gauge,
  Heart, MessageCircle, Mic, Type, Languages, Bot, Camera, Video
} from 'lucide-react';
import clsx from 'clsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import ShqipetAIAdmin from './ShqipetAIAdmin';
import DatabaseConnectionStatus from '../database/DatabaseConnectionStatus';
import BackendIntegrationStatus from '../backend/BackendIntegrationStatus';

interface ShqipetAIInterfaceProps {
  isVisible: boolean;
  onClose: () => void;
}

// Organized menu sections with expandable items
const menuSections = [
  {
    id: 'ai-chat-settings',
    label: 'AI Chat',
    icon: MessageCircle,
    color: 'blue',
    items: []
  },
  {
    id: 'connection-status',
    label: 'Connection Status Monitoring',
    icon: Wifi,
    color: 'primary',
    items: [
      { id: 'database-connection', label: 'Database Connection Status', icon: Database },
      { id: 'backend-integration', label: 'Backend Integration Status', icon: Server },
      { id: 'website-connectivity', label: 'Website/Web App Connectivity', icon: Globe },
      { id: 'ios-connection', label: 'iOS App Connection Status', icon: Smartphone },
      { id: 'android-connection', label: 'Android App Connection Status', icon: Smartphone }
    ]
  },
  {
    id: 'security-monitoring',
    label: 'Security Monitoring',
    icon: Lock,
    color: 'destructive',
    items: [
      { id: 'vulnerability-scan', label: 'Vulnerability Scanning Results', icon: Shield },
      { id: 'security-alerts', label: 'Security Alerts and Warnings', icon: AlertTriangle },
      { id: 'authentication-status', label: 'Authentication Status', icon: Key },
      { id: 'api-security', label: 'API Endpoint Security', icon: Network }
    ]
  },
  {
    id: 'system-control',
    label: 'System Control Panel',
    icon: Settings,
    color: 'muted',
    items: [
      { id: 'ai-monitoring-toggle', label: 'Enable/Disable AI Monitoring', icon: Power },
      { id: 'scan-intervals', label: 'Configure Scan Intervals', icon: Timer },
      { id: 'alert-thresholds', label: 'Set Alert Thresholds', icon: Bell },
      { id: 'emergency-disconnect', label: 'Emergency Disconnect Options', icon: X }
    ]
  },
  {
    id: 'realtime-dashboard',
    label: 'Real-time Dashboard',
    icon: Activity,
    color: 'green',
    items: [
      { id: 'connection-stats', label: 'Live Connection Statistics', icon: BarChart3 },
      { id: 'performance-metrics', label: 'Performance Metrics', icon: Gauge },
      { id: 'error-logs', label: 'Error Logs and Diagnostics', icon: FileText },
      { id: 'health-indicators', label: 'System Health Indicators', icon: Monitor }
    ]
  }
];

const ShqipetAIInterface = memo<ShqipetAIInterfaceProps>(function ShqipetAIInterface({ isVisible, onClose }) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('connection-stats');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'connection-status': false,
    'security-monitoring': false,
    'system-control': false,
    'realtime-dashboard': false,
    'ai-chat-settings': false
  });
  const [isScanning, setIsScanning] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    website: { status: 'online', latency: 45 },
    database: { status: 'connected', latency: 23 },
    mobile: { ios: 'active', android: 'active' },
    security: { score: 99.2, warnings: 3 }
  });
  const [activeTab, setActiveTab] = useState('connections');
  const [activeSubPage, setActiveSubPage] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // No loading needed - interface shows immediately

  const runFullSystemScan = useCallback(async () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-card shadow-2xl flex flex-col">
      {/* TOP BAR */}
      <div className="h-16 bg-background border-b border-border flex items-center justify-between px-6 flex-shrink-0">
        {/* Left section - Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Shqipet AI</h1>
              <p className="text-xs text-muted-foreground">Infrastructure Guardian</p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <span>/</span>
            <span>AI Assistant</span>
            <span>/</span>
            <span className="text-foreground font-medium capitalize">{activeSection.replace('-', ' ')}</span>
          </div>
        </div>
        
        {/* Center section - Status indicators */}
        <div className="hidden lg:flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-foreground">AI Active</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">99.9% Uptime</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">All Systems Normal</span>
          </div>
        </div>
        
        {/* Right section - Controls */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={runFullSystemScan}
            disabled={isScanning}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all disabled:opacity-50 text-sm"
          >
            <Shield className={clsx('w-4 h-4', isScanning && 'animate-spin')} />
            <span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Quick Scan'}</span>
          </button>
          
          <button 
            onClick={() => setActiveSection('ai-settings')}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-all"
          >
            <Settings className="w-4 h-4 text-foreground" />
          </button>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 border border-border transition-all"
          >
            <X className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 overflow-hidden">
        {/* AI-FOCUSED SIDEBAR */}
        <div className={clsx(
          "bg-secondary/50 border-r border-border overflow-y-auto transition-all duration-300",
          isSidebarCollapsed ? "w-12" : "w-72 p-6"
        )}>
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute top-20 left-0 z-10 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent transition-all"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
          
          {!isSidebarCollapsed && (
            <>
          {/* ORGANIZED MENU SECTIONS */}
          <nav className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              AI SYSTEM MONITORING
            </div>
            
            {menuSections.map((section) => {
              const SectionIcon = section.icon;
              const isExpanded = expandedSections[section.id];
              
              return (
                <div key={section.id} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => {
                      if (section.items.length > 0) {
                        setExpandedSections(prev => ({
                          ...prev,
                          [section.id]: !prev[section.id]
                        }));
                      } else {
                        setActiveSection(section.id);
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <SectionIcon className="w-4 h-4" />
                      <span className="text-xs font-medium">{section.label}</span>
                    </div>
                    {section.items.length > 0 && (
                      isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )
                    )}
                  </button>
                  
                  {/* Section Items */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = activeSection === item.id;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={clsx(
                              'w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-left',
                              isActive 
                                ? 'bg-primary/10 text-primary border border-primary/30' 
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            )}
                          >
                            <ItemIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* AI STATUS PANEL */}
          <div className="mt-8 p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">AI ACTIVE</span>
            </div>
            
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Scans Today:</span>
                <span className="text-primary font-medium">247</span>
              </div>
              <div className="flex justify-between">
                <span>Issues Found:</span>
                <span className="text-destructive font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Auto-Fixed:</span>
                <span className="text-green-600 font-medium">12</span>
              </div>
            </div>
          </div>
            </>
          )}
          
          {/* Collapsed Mini Icons */}
          {isSidebarCollapsed && (
            <div className="pt-16 px-2 space-y-2">
              {menuSections.map((section) => {
                const SectionIcon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-all"
                    title={section.label}
                  >
                    <SectionIcon className="w-4 h-4 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* MAIN AI CONTENT AREA */}
        <div className="flex-1 bg-background">
          {renderAISection()}
        </div>
      </div>
    </div>
  );

  // Render different AI sections based on selection
  function renderAISection() {
    switch(activeSection) {
      case 'ai-chat-settings':
        return <ShqipetAIAdmin />;
      case 'database-connection':
        return <DatabaseConnectionStatus />;
      case 'backend-integration':
        return <BackendIntegrationStatus />;
      case 'dashboard':
        return renderAIDashboard();
      case 'infrastructure':
        return renderInfrastructureScan();
      case 'security':
        return renderSecurityAnalysis();
      case 'performance':
        return renderPerformanceMonitor();
      case 'predictions':
        return renderAIPredictions();
      case 'auto-actions':
        return renderAutoActions();
      case 'ai-settings':
        return renderAISettings();
      // AI Chat Settings sub-pages
      case 'chat-interface-settings':
        return renderChatInterfaceSettings();
      case 'voice-input-output':
        return renderVoiceSettings();
      case 'text-communication':
        return renderTextCommunicationSettings();
      case 'language-translation':
        return renderLanguageSettings();
      case 'ai-personality':
        return renderAIPersonalitySettings();
      case 'response-speed-format':
        return renderResponseSettings();
      default:
        return renderAIDashboard();
    }
  }

  // AI Dashboard - Main Control Center
  function renderAIDashboard() {
    return (
      <div className="space-y-8">
        {/* AI STATUS HEADER */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">AI System Guardian</h2>
              <p className="text-muted-foreground">Monitoring your Shqipet.com infrastructure 24/7</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              
              <button 
                onClick={runFullSystemScan}
                disabled={isScanning}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl transition-all disabled:opacity-50"
              >
                <Shield className={clsx('w-5 h-5', isScanning && 'animate-spin')} />
                <span>{isScanning ? 'Scanning...' : 'Full System Scan'}</span>
              </button>
            </div>
          </div>
          
          {/* REAL-TIME MONITORING GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Website Status */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <Globe className="w-6 h-6 text-primary" />
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-foreground">shqipet.com</div>
              <div className="text-sm text-muted-foreground">Online • {systemHealth.website.latency}ms</div>
            </div>
            
            {/* Database Status */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <Database className="w-6 h-6 text-green-600" />
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-foreground">Database</div>
              <div className="text-sm text-muted-foreground">Connected • {systemHealth.database.latency}ms</div>
            </div>
            
            {/* Mobile Apps */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <Smartphone className="w-6 h-6 text-purple-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="text-xl font-bold text-foreground">iOS + Android</div>
              <div className="text-sm text-muted-foreground">Both Active</div>
            </div>
            
            {/* Security Status */}
            <div className="bg-secondary/30 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <Lock className="w-6 h-6 text-destructive" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="text-xl font-bold text-foreground">Security</div>
              <div className="text-sm text-muted-foreground">{systemHealth.security.warnings} Warnings</div>
            </div>
          </div>
        </div>
        
        {/* AI INSIGHTS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              AI Health Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <span className="text-green-700">✓ All systems operational</span>
                <span className="text-xs text-green-600">Just now</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <span className="text-yellow-700">⚠ SSL cert expires in 45 days</span>
                <span className="text-xs text-yellow-600">12min ago</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <span className="text-blue-700">ℹ Database backup completed</span>
                <span className="text-xs text-blue-600">2h ago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-foreground">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Auto-Actions Today
            </h3>
            
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Security blocks:</span>
                  <span className="text-destructive font-bold">7</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Query optimizations:</span>
                  <span className="text-green-600 font-bold">3</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Cache optimizations:</span>
                  <span className="text-primary font-bold">12</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <div className="flex justify-between mb-1">
                  <span>Resource scaling:</span>
                  <span className="text-purple-600 font-bold">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Infrastructure Scan - Deep System Analysis
  function renderInfrastructureScan() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Infrastructure Deep Scan</h2>
            <button 
              onClick={() => setIsScanning(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all"
            >
              Start Deep Scan
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-primary flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Website Infrastructure
              </h3>
              
              <div className="space-y-3">
                <div className="bg-secondary/30 border border-border p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">DNS Resolution</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-foreground">shqipet.com</div>
                  <div className="text-xs text-muted-foreground">Response: 12ms</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-green-600 flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Database Infrastructure
              </h3>
              
              <div className="space-y-3">
                <div className="bg-secondary/30 border border-border p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Connection Pool</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-foreground">15/50 Active</div>
                  <div className="text-xs text-muted-foreground">Efficiency: 94%</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-purple-600 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Infrastructure
              </h3>
              
              <div className="space-y-3">
                <div className="bg-secondary/30 border border-border p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-muted-foreground">App Store Status</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-foreground">Live</div>
                  <div className="text-xs text-muted-foreground">Version: 2.1.0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Other render functions with semantic theme colors
  function renderSecurityAnalysis() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Security Analysis</h2>
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Security monitoring active</h3>
            <p className="text-muted-foreground">All security systems are operational</p>
          </div>
        </div>
      </div>
    );
  }

  function renderPerformanceMonitor() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Performance Monitor</h2>
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Performance optimal</h3>
            <p className="text-muted-foreground">All systems running efficiently</p>
          </div>
        </div>
      </div>
    );
  }

  function renderAIPredictions() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">AI Predictions</h2>
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Predictive analysis ready</h3>
            <p className="text-muted-foreground">AI models are analyzing patterns</p>
          </div>
        </div>
      </div>
    );
  }

  function renderAutoActions() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Auto Response</h2>
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Auto-response enabled</h3>
            <p className="text-muted-foreground">System will auto-resolve common issues</p>
          </div>
        </div>
      </div>
    );
  }

  function renderAISettings() {
    const tabs = [
      { id: 'connections', label: 'Connections', icon: Database },
      { id: 'security', label: 'Security', icon: Shield },
      { id: 'system', label: 'System Control', icon: Settings },
      { id: 'dashboard', label: 'Dashboard', icon: Activity },
      { id: 'chat', label: 'AI Chat Settings', icon: MessageCircle }
    ];

    const subPages = {
      connections: [
        { id: 'database-connection', label: 'Database Connection Status', icon: Database },
        { id: 'backend-integration', label: 'Backend Integration Status', icon: Server },
        { id: 'web-app-connectivity', label: 'Website/Web App Connectivity', icon: Globe },
        { id: 'ios-connection', label: 'iOS App Connection Status', icon: Smartphone },
        { id: 'android-connection', label: 'Android App Connection Status', icon: Smartphone }
      ],
      security: [
        { id: 'vulnerability-scanning', label: 'Vulnerability Scanning Results', icon: Shield },
        { id: 'security-alerts', label: 'Security Alerts and Warnings', icon: AlertTriangle },
        { id: 'authentication-status', label: 'Authentication Status', icon: Key },
        { id: 'api-security', label: 'API Endpoint Security', icon: Lock }
      ],
      system: [
        { id: 'ai-monitoring', label: 'Enable/Disable AI Monitoring', icon: Monitor },
        { id: 'scan-intervals', label: 'Configure Scan Intervals', icon: Timer },
        { id: 'alert-thresholds', label: 'Set Alert Thresholds', icon: Bell },
        { id: 'emergency-disconnect', label: 'Emergency Disconnect Options', icon: AlertTriangle }
      ],
      dashboard: [
        { id: 'connection-statistics', label: 'Live Connection Statistics', icon: Wifi },
        { id: 'performance-metrics', label: 'Performance Metrics', icon: BarChart3 },
        { id: 'error-logs', label: 'Error Logs and Diagnostics', icon: FileText },
        { id: 'health-indicators', label: 'System Health Indicators', icon: Heart }
      ],
      chat: [
        { id: 'chat-interface', label: 'Chat Interface Settings', icon: MessageCircle },
        { id: 'voice-settings', label: 'Voice Input/Output Settings', icon: Mic },
        { id: 'text-settings', label: 'Text Communication Settings', icon: Type },
        { id: 'language-settings', label: 'Language & Translation Settings', icon: Languages },
        { id: 'ai-personality', label: 'AI Personality & Behavior', icon: Bot },
        { id: 'response-settings', label: 'Response Speed & Format', icon: Zap },
        { id: 'photo-screenshot', label: 'Photo & Screenshot Reading', icon: Camera },
        { id: 'video-analysis', label: 'Video Sharing & Analysis', icon: Video }
      ]
    };

    const renderComingSoon = () => (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-600 mb-4">
            {subPages[activeTab]?.find(sub => sub.id === activeSubPage)?.label} settings will be available soon.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            We're working hard to bring you comprehensive configuration options for this feature.
          </p>
          <button
            onClick={() => setActiveSubPage(null)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              AI Settings Configuration
            </h1>
            <p className="text-gray-600 mt-1">Configure and control your Shapjet AI infrastructure settings</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setActiveSubPage(null);
                    }}
                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300">
            {!activeSubPage ? (
              <div className="space-y-4">
                {/* Small Sub-buttons below main tabs */}
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="flex flex-wrap gap-2">
                    {subPages[activeTab]?.map((subPage) => {
                      const SubIcon = subPage.icon;
                      return (
                        <button
                          key={subPage.id}
                          onClick={() => setActiveSubPage(subPage.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                        >
                          <SubIcon className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">{subPage.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Main content area - empty for now */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {activeTab === 'connections' && 'Connection Status Monitoring'}
                      {activeTab === 'security' && 'Security Monitoring'}
                      {activeTab === 'system' && 'System Control Panel'}
                      {activeTab === 'dashboard' && 'Real-time Dashboard'}
                      {activeTab === 'chat' && 'AI Chat Settings'}
                    </h3>
                    <p className="text-gray-600">
                      Select a specific setting from the buttons above to configure
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              renderComingSoon()
            )}
          </div>

          {/* Save Settings Button - Only show when not on Coming Soon page */}
          {!activeSubPage && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Save Configuration</h3>
                  <p className="text-sm text-gray-600">Apply all changes to your AI settings</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Save All Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // AI Chat Settings render functions
  function renderChatInterfaceSettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Chat Interface Settings</h2>
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Chat Interface Configuration</h3>
            <p className="text-muted-foreground">Configure chat interface appearance and behavior</p>
          </div>
        </div>
      </div>
    );
  }

  function renderVoiceSettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Voice Input/Output Settings</h2>
          <div className="text-center py-12">
            <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Voice Configuration</h3>
            <p className="text-muted-foreground">Configure voice input and output settings</p>
          </div>
        </div>
      </div>
    );
  }

  function renderTextCommunicationSettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Text Communication Settings</h2>
          <div className="text-center py-12">
            <Type className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Text Communication</h3>
            <p className="text-muted-foreground">Configure text communication preferences</p>
          </div>
        </div>
      </div>
    );
  }

  function renderLanguageSettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Language & Translation Settings</h2>
          <div className="text-center py-12">
            <Languages className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Language Configuration</h3>
            <p className="text-muted-foreground">Configure language and translation settings</p>
          </div>
        </div>
      </div>
    );
  }

  function renderAIPersonalitySettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">AI Personality & Behavior</h2>
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">AI Personality</h3>
            <p className="text-muted-foreground">Configure AI personality and behavior patterns</p>
          </div>
        </div>
      </div>
    );
  }

  function renderResponseSettings() {
    return (
      <div className="space-y-8">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Response Speed & Format</h2>
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Response Configuration</h3>
            <p className="text-muted-foreground">Configure response speed and formatting options</p>
          </div>
        </div>
      </div>
    );
  }
});

export default ShqipetAIInterface;
