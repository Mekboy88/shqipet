import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Eye, 
  AlertTriangle, 
  Shield, 
  Target, 
  MapPin, 
  FileText, 
  Lock,
  Smartphone,
  Monitor,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BehavioralBiometrics = () => {
  const [activeSection, setActiveSection] = useState('monitoring');
  const [settings, setSettings] = useState({
    enableBiometrics: true,
    silentAlerts: true,
    autoFlagHighRisk: true,
    exportLogs: false
  });
  const { toast } = useToast();

  const sections = [
    { id: 'monitoring', label: 'Input Pattern Monitoring', icon: Eye },
    { id: 'baseline', label: 'AI Profile Baseline', icon: Brain },
    { id: 'realtime', label: 'Real-Time Checker', icon: Activity },
    { id: 'alerts', label: 'Alert Triggers', icon: AlertTriangle },
    { id: 'learning', label: 'Adaptive Learning', icon: TrendingUp },
    { id: 'crossdevice', label: 'Cross-Device Patterns', icon: Smartphone },
    { id: 'scoring', label: 'Suspicion Scoring', icon: Target },
    { id: 'location', label: 'Location Matching', icon: MapPin },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
    { id: 'lockout', label: 'Lockout Policy', icon: Lock }
  ];

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    toast({
      title: "Settings Updated",
      description: `${setting} has been ${settings[setting as keyof typeof settings] ? 'disabled' : 'enabled'}`,
    });
  };

  const StatusCard = ({ title, value, status, icon: Icon }: { title: string; value: string; status: 'success' | 'warning' | 'danger'; icon: any }) => (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-lg font-bold">{value}</p>
            </div>
          </div>
          <Badge variant={status === 'success' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}>
            {status === 'success' ? '✅ Live' : status === 'warning' ? '⚠️ Check' : '🔴 Alert'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const ConsequenceInfo = ({ title, consequence }: { title: string; consequence: string }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-900 mb-1">{title}</h4>
          <p className="text-sm text-blue-800"><strong>CONSEQUENCES:</strong> {consequence}</p>
        </div>
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'monitoring':
        return (
          <div>
            <ConsequenceInfo 
              title="Input Pattern Monitoring"
              consequence="Without proper monitoring, suspicious typing patterns, unusual mouse movements, and abnormal scroll behaviors cannot be detected, allowing potential unauthorized access to go unnoticed."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Input Pattern Monitoring</span>
                </CardTitle>
                <CardDescription>
                  Track user typing rhythm (keystroke timing), scroll speed, mouse travel distance, and click cadence. Learn and baseline per user session.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Keystroke Dynamics</h4>
                    <p className="text-sm text-gray-600">Monitoring typing rhythm and timing patterns</p>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-gray-500">87% accuracy in user identification</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Mouse Movement Analysis</h4>
                    <p className="text-sm text-gray-600">Tracking cursor travel patterns and click cadence</p>
                    <Progress value={92} className="h-2" />
                    <p className="text-xs text-gray-500">92% behavioral consistency detected</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Scroll Behavior</h4>
                    <p className="text-sm text-gray-600">Analyzing scroll speed and interaction patterns</p>
                    <Progress value={78} className="h-2" />
                    <p className="text-xs text-gray-500">78% unique pattern recognition</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Click Patterns</h4>
                    <p className="text-sm text-gray-600">Measuring click frequency and pressure</p>
                    <Progress value={84} className="h-2" />
                    <p className="text-xs text-gray-500">84% behavioral baseline established</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'baseline':
        return (
          <div>
            <ConsequenceInfo 
              title="AI Profile Baseline Builder"
              consequence="Without individual user baselines, the system cannot distinguish between legitimate behavior changes and potential security threats, leading to false positives or missed intrusions."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Profile Baseline Builder</span>
                </CardTitle>
                <CardDescription>
                  For every user, build a unique biometric profile based on interaction style — typing, scrolling, mouse gesture frequency, and device posture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatusCard 
                    title="Active Profiles"
                    value="19,400"
                    status="success"
                    icon={Users}
                  />
                  <StatusCard 
                    title="Baseline Accuracy"
                    value="94.2%"
                    status="success"
                    icon={Target}
                  />
                  <StatusCard 
                    title="Learning Sessions"
                    value="5.3 avg"
                    status="warning"
                    icon={Brain}
                  />
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Profile Components</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Typing Speed & Rhythm</span>
                      <Badge>Core Metric</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Mouse Movement Patterns</span>
                      <Badge>Core Metric</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Scroll Velocity</span>
                      <Badge variant="secondary">Supporting</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span>Click Pressure & Timing</span>
                      <Badge variant="secondary">Supporting</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'realtime':
        return (
          <div>
            <ConsequenceInfo 
              title="Real-Time Deviation Checker"
              consequence="Delayed detection of behavioral anomalies allows potential attackers more time to access sensitive data and perform malicious activities before being identified."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Real-Time Deviation Checker</span>
                </CardTitle>
                <CardDescription>
                  Every new session is compared to past behavior. Large deviations are flagged for possible stolen access, bot activity, or impersonation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Current Session Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Session Risk Score</span>
                        <Badge className="bg-green-100 text-green-800">8.3 / 100</Badge>
                      </div>
                      <Progress value={8.3} className="h-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Behavioral Consistency</span>
                        <Badge className="bg-green-100 text-green-800">96%</Badge>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Detection Thresholds</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Standard Deviation</span>
                          <span className="text-sm">3σ</span>
                        </div>
                        <p className="text-xs text-gray-600">Triggers silent alert</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Critical Threshold</span>
                          <span className="text-sm">90+</span>
                        </div>
                        <p className="text-xs text-gray-600">Auto-flag for review</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'alerts':
        return (
          <div>
            <ConsequenceInfo 
              title="Silent Alert Triggers"
              consequence="Without proper alert mechanisms, security teams cannot respond quickly to potential threats, and genuine users may be unnecessarily interrupted by false alarms."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Silent Alert Triggers</span>
                </CardTitle>
                <CardDescription>
                  If deviation exceeds 3σ (standard deviations) from baseline, flag the session silently without logging out the user. Admin receives real-time warning.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatusCard 
                    title="Alerts This Week"
                    value="12"
                    status="warning"
                    icon={AlertTriangle}
                  />
                  <StatusCard 
                    title="Confirmed Threats"
                    value="3"
                    status="danger"
                    icon={Shield}
                  />
                  <StatusCard 
                    title="False Positives"
                    value="2"
                    status="warning"
                    icon={Eye}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <div>
                          <p className="text-sm font-medium">High Risk Session Detected</p>
                          <p className="text-xs text-gray-600">User: john.doe@example.com | Score: 96</p>
                        </div>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-4 w-4 text-yellow-500" />
                        <div>
                          <p className="text-sm font-medium">Unusual Typing Pattern</p>
                          <p className="text-xs text-gray-600">User: alice.smith@example.com | Score: 78</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Monitoring</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'learning':
        return (
          <div>
            <ConsequenceInfo 
              title="Adaptive Learning Engine"
              consequence="Static behavioral models become outdated as users naturally evolve their interaction patterns, leading to increased false positives and reduced security effectiveness over time."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Adaptive Learning Engine</span>
                </CardTitle>
                <CardDescription>
                  Continuously adapts to user over time. If a user changes typing device or style (e.g., from laptop to phone), model auto-adjusts after a few sessions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Learning Performance</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Model Accuracy</span>
                          <span className="text-sm font-medium">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Adaptation Speed</span>
                          <span className="text-sm font-medium">3.2 sessions</span>
                        </div>
                        <Progress value={76} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">False Positive Rate</span>
                          <span className="text-sm font-medium">2.1%</span>
                        </div>
                        <Progress value={21} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Adaptation Scenarios</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Device Change Detected</p>
                        <p className="text-xs text-green-600">Desktop → Mobile adaptation in progress</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Typing Style Evolution</p>
                        <p className="text-xs text-blue-600">Gradual speed increase detected and learned</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">Environmental Change</p>
                        <p className="text-xs text-yellow-600">Mouse sensitivity adjustment noted</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'crossdevice':
        return (
          <div>
            <ConsequenceInfo 
              title="Cross-Device Pattern Recognition"
              consequence="Failure to recognize legitimate users across different devices can lead to unnecessary security challenges, while missing cross-device anomalies allows sophisticated attacks to succeed."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Cross-Device Pattern Recognition</span>
                </CardTitle>
                <CardDescription>
                  Match behavior across devices (e.g., mobile vs. desktop) using hashed biometric signatures to detect human consistency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Device Coverage</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm">Desktop</span>
                        </div>
                        <Badge>4,200 users</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-4 w-4" />
                          <span className="text-sm">Mobile</span>
                        </div>
                        <Badge>3,800 users</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Monitor className="h-4 w-4" />
                          <span className="text-sm">Tablet</span>
                        </div>
                        <Badge variant="secondary">1,200 users</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Cross-Device Metrics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Pattern Consistency</span>
                          <span className="text-sm font-medium">89%</span>
                        </div>
                        <Progress value={89} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Device Recognition</span>
                          <span className="text-sm font-medium">96%</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Signature Matching</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'scoring':
        return (
          <div>
            <ConsequenceInfo 
              title="Suspicion Scoring System"
              consequence="Without accurate risk scoring, security teams cannot prioritize threats effectively, leading to resource waste on low-risk events while missing critical security incidents."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Suspicion Score per Session</span>
                </CardTitle>
                <CardDescription>
                  Show a score (0–100) indicating session anomaly risk. Color code: Green = normal, Yellow = suspicious, Red = critical anomaly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">8.3</div>
                    <div className="text-sm text-green-700">Average Score</div>
                    <Badge className="mt-2 bg-green-100 text-green-800">🟢 Low Risk</Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-yellow-50">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-yellow-700">Sessions {'>'}  50</div>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">⚠️ Suspicious</Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg bg-red-50">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-red-700">Sessions {'>'}  90</div>
                    <Badge className="mt-2 bg-red-100 text-red-800">🔴 Critical</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Risk Score Distribution</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">0-30 (Normal)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">31-70 (Suspicious)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={12} className="w-24 h-2" />
                        <span className="text-sm font-medium">12%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">71-100 (Critical)</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={3} className="w-24 h-2" />
                        <span className="text-sm font-medium">3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'location':
        return (
          <div>
            <ConsequenceInfo 
              title="Location + Biometrics Matching"
              consequence="Isolated location or behavioral analysis can produce false positives; combining both provides higher confidence in threat detection while reducing legitimate user friction."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location + Biometrics Match</span>
                </CardTitle>
                <CardDescription>
                  Combine biometric analysis with location/IP analysis for maximum confidence. E.g., same typing pattern but wrong IP? Allow but alert.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Correlation Examples</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">✅ Normal Pattern + Known Location</span>
                          <Badge className="bg-green-100 text-green-800">Allow</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Score: 5 | Action: Continue</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">⚠️ Normal Pattern + New Location</span>
                          <Badge className="bg-yellow-100 text-yellow-800">Alert</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Score: 45 | Action: Silent Alert</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">🔴 Abnormal Pattern + Wrong IP</span>
                          <Badge className="bg-red-100 text-red-800">Block</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Score: 96 | Action: Session Flag</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Geographic Distribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">United States</span>
                        <Badge>45%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Europe</span>
                        <Badge>28%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Asia Pacific</span>
                        <Badge>18%</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span className="text-sm">Other</span>
                        <Badge variant="secondary">9%</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'audit':
        return (
          <div>
            <ConsequenceInfo 
              title="Logging & Audit Trail"
              consequence="Without comprehensive audit logs, security incidents cannot be properly investigated, compliance requirements may not be met, and learning from past events becomes impossible."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Logging & Audit Trail</span>
                </CardTitle>
                <CardDescription>
                  Every suspicious behavior session is logged in the audit history, with timestamp, score, and reason for alert. Exportable for review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <StatusCard 
                    title="Total Events Logged"
                    value="47,892"
                    status="success"
                    icon={FileText}
                  />
                  <StatusCard 
                    title="High Risk Events"
                    value="156"
                    status="warning"
                    icon={AlertTriangle}
                  />
                  <StatusCard 
                    title="Export Requests"
                    value="23"
                    status="success"
                    icon={FileText}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recent Audit Entries</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                      <div>
                        <span className="font-medium">2024-01-15 14:32:18</span>
                        <span className="mx-2">•</span>
                        <span>Behavioral anomaly detected</span>
                      </div>
                      <Badge variant="destructive">Score: 92</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                      <div>
                        <span className="font-medium">2024-01-15 14:28:45</span>
                        <span className="mx-2">•</span>
                        <span>Cross-device pattern verified</span>
                      </div>
                      <Badge>Score: 15</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg text-sm">
                      <div>
                        <span className="font-medium">2024-01-15 14:25:12</span>
                        <span className="mx-2">•</span>
                        <span>Location anomaly with normal behavior</span>
                      </div>
                      <Badge variant="secondary">Score: 48</Badge>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'lockout':
        return (
          <div>
            <ConsequenceInfo 
              title="Optional Lockout Policy"
              consequence="Overly aggressive lockout policies can disrupt legitimate users, while insufficient policies may allow threats to persist and cause damage to the system."
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Optional Lockout Policy</span>
                </CardTitle>
                <CardDescription>
                  If score is too high or combined with other risk signals (wrong IP, expired token, etc), platform may auto-lock session (optional toggle).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Lockout Configuration</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Auto-lockout Threshold</span>
                          <p className="text-sm text-gray-600">Score that triggers automatic session lockout</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">95</span>
                          <p className="text-xs text-gray-500">/100</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Grace Period</span>
                          <p className="text-sm text-gray-600">Time before lockout takes effect</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">30</span>
                          <p className="text-xs text-gray-500">seconds</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <span className="font-medium">Lockout Duration</span>
                          <p className="text-sm text-gray-600">How long the session remains locked</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">15</span>
                          <p className="text-xs text-gray-500">minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Risk Combinations</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="text-sm font-medium text-red-800">High Score + Wrong Location</span>
                        <p className="text-xs text-red-600">Immediate lockout triggered</p>
                      </div>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="text-sm font-medium text-yellow-800">Medium Score + Expired Token</span>
                        <p className="text-xs text-yellow-600">Grace period lockout</p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-sm font-medium text-blue-800">Multiple Failed Attempts</span>
                        <p className="text-xs text-blue-600">Escalated security check</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
          <Brain className="h-8 w-8 text-primary" />
          <span>Behavioral Biometrics & Anomaly Detection AI</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Detect suspicious user behavior in real time using typing patterns, mouse movements, and other interaction signals — even when credentials are valid.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sections.map((section, index) => {
          const Icon = section.icon;
          
          // Define different color schemes for each button
          const colorSchemes = [
            'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 border-blue-200',
            'bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-700 border-emerald-200',
            'bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 border-purple-200',
            'bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 border-amber-200',
            'bg-gradient-to-r from-rose-50 to-rose-100 hover:from-rose-100 hover:to-rose-200 text-rose-700 border-rose-200',
            'bg-gradient-to-r from-cyan-50 to-cyan-100 hover:from-cyan-100 hover:to-cyan-200 text-cyan-700 border-cyan-200',
            'bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 border-indigo-200',
            'bg-gradient-to-r from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 text-teal-700 border-teal-200',
            'bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 border-orange-200',
            'bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 text-pink-700 border-pink-200'
          ];
          
          const activeColorSchemes = [
            'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300',
            'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border-emerald-300',
            'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300',
            'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300',
            'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800 border-rose-300',
            'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300',
            'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border-indigo-300',
            'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border-teal-300',
            'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-orange-300',
            'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-800 border-pink-300'
          ];

          const colorScheme = colorSchemes[index % colorSchemes.length];
          const activeColorScheme = activeColorSchemes[index % activeColorSchemes.length];

          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className={`justify-start text-xs px-3 py-2 h-auto font-medium border shadow-md hover:shadow-lg transition-all duration-300 rounded-xl hover:scale-105 ${
                activeSection === section.id
                  ? `${activeColorScheme} border-2`
                  : colorScheme
              }`}
            >
              <Icon className="h-3 w-3 mr-2 flex-shrink-0" />
              <span className="truncate">{section.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Admin Control Panel */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Control Panel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Enable Biometrics AI</span>
              <Switch 
                checked={settings.enableBiometrics}
                onCheckedChange={() => handleToggle('enableBiometrics')}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Send Silent Alerts</span>
              <Switch 
                checked={settings.silentAlerts}
                onCheckedChange={() => handleToggle('silentAlerts')}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Auto-flag High Risk</span>
              <Switch 
                checked={settings.autoFlagHighRisk}
                onCheckedChange={() => handleToggle('autoFlagHighRisk')}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Export Logs</span>
              <Switch 
                checked={settings.exportLogs}
                onCheckedChange={() => handleToggle('exportLogs')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {renderSectionContent()}

      {/* Tech Stack & Implementation */}
      <Card className="border-l-4 border-l-secondary">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>🧪 Tech Stack & Implementation</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Core Components</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">✅ Keystroke Dynamics API</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">✅ Mouse Activity Tracker</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">✅ Scroll/Tap Speed Monitor</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">✅ Supabase Edge Function</span>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">✅ Realtime Dashboard</span>
                  <Badge>Active</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">System Status</h4>
              <div className="space-y-3">
                <StatusCard 
                  title="System Health"
                  value="98.7%"
                  status="success"
                  icon={Activity}
                />
                <StatusCard 
                  title="Processing Latency"
                  value="< 50ms"
                  status="success"
                  icon={TrendingUp}
                />
                <StatusCard 
                  title="Storage Usage"
                  value="2.3TB"
                  status="warning"
                  icon={FileText}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehavioralBiometrics;